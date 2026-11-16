#!/usr/bin/env node
// Large brand material lives in a private Cloud Storage bucket, not in git:
//   media           the studio's media library: brand photos, renders, detections, intro videos
//   marketing-kit   the delivered marketing kit, the source of the guide's kit pages
// Reading needs a Google account with «Storage Object Viewer» on the aisgroup-design project and «gcloud auth login»;
// pushing needs «Storage Object Creator». Pushes add and update files, never delete.
//   node scripts/media.mjs pull <set> [folder]     media defaults to AIS_MEDIA_LIBRARY or ~/.cache/ais-group-design/media,
//   node scripts/media.mjs push <set> [folder]     the others to ./<set>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const BUCKET = 'gs://aisgroup-design-assets';
export const SETS = ['media', 'marketing-kit'];
export const MEDIA_HOME = process.env.AIS_MEDIA_LIBRARY || path.join(os.userInfo().homedir, '.cache/ais-group-design/media');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shell = process.platform === 'win32';

export const hasGcloud = () => spawnSync('gcloud', ['--version'], { stdio: 'ignore', shell }).status === 0;
// The studio fetches a picture the first time a piece uses it, so nobody needs the whole library: search runs on the
// catalogue that ships with the plugin. Downloads use the Cloud Storage JSON API with the user's gcloud token (taken
// once, reused until shortly before it expires), in parallel, each written to a temporary name and renamed, so an
// interrupted download never leaves a broken file and a missing file never stops the others.
let gcloudChecked, cached = { token: null, until: 0 };
export const canFetch = () => (gcloudChecked ??= hasGcloud());
// The signed-in Google account, or null: what studio_status and setup report.
export const signedIn = () => canFetch() && (spawnSync('gcloud', ['auth', 'list', '--filter=status:ACTIVE', '--format=value(account)'], { encoding: 'utf8', shell, timeout: 15000 }).stdout || '').trim().split('\n')[0] || null;
function token() {
  if (cached.token && Date.now() < cached.until) return cached.token;
  const r = spawnSync('gcloud', ['auth', 'print-access-token'], { encoding: 'utf8', shell, timeout: 20000 });
  cached = r.status === 0 ? { token: r.stdout.trim(), until: Date.now() + 45 * 60 * 1000 } : { token: null, until: 0 };
  return cached.token;
}
// Runs in a short child process so callers stay synchronous; prints {rel: status} for the files it could not save.
const FETCHER = `const {token,bucket,jobs}=JSON.parse(require('fs').readFileSync(0,'utf8'));const fs=require('fs'),path=require('path');const bad={};
Promise.all(jobs.map(async({rel,dest})=>{try{const r=await fetch('https://storage.googleapis.com/storage/v1/b/'+bucket+'/o/'+encodeURIComponent('media/'+rel)+'?alt=media',{headers:{Authorization:'Bearer '+token}});
if(!r.ok){bad[rel]=r.status;return;}fs.mkdirSync(path.dirname(dest),{recursive:true});const tmp=dest+'.part-'+process.pid;fs.writeFileSync(tmp,Buffer.from(await r.arrayBuffer()));fs.renameSync(tmp,dest);}catch(e){bad[rel]=String(e.message)}}))
.then(()=>process.stdout.write(JSON.stringify(bad)));`;
export class MediaAccessError extends Error {}
export function ensureMedia(rels) {
  const want = [...new Set(rels)].filter((rel) => rel && !rel.split('/').includes('..') && !path.isAbsolute(rel) && !fs.existsSync(path.join(MEDIA_HOME, rel)));
  if (!want.length || !canFetch()) return want;
  const t = token();
  if (!t) return want;
  const jobs = want.map((rel) => ({ rel, dest: path.join(MEDIA_HOME, rel) }));
  const r = spawnSync(process.execPath, ['-e', FETCHER], { input: JSON.stringify({ token: t, bucket: BUCKET.slice(5), jobs }), encoding: 'utf8', timeout: 300000 });
  let bad = {}; try { bad = JSON.parse(r.stdout || '{}'); } catch { bad = Object.fromEntries(want.map((rel) => [rel, 'failed'])); }
  if (Object.values(bad).some((s) => s === 401)) cached = { token: null, until: 0 };
  if (Object.values(bad).some((s) => s === 401 || s === 403)) throw new MediaAccessError('The media bucket refused this account: run «gcloud auth login» with an account that has «Storage Object Viewer» on the aisgroup-design project.');
  return want.filter((rel) => !fs.existsSync(path.join(MEDIA_HOME, rel)));
}
// Every library/media or @lib/media reference in a recipe or any text, as a path relative to the media folder.
export const mediaRefs = (text) => [...String(text).matchAll(/(?:@lib|library)\/media\/([^"'\s)]+)/g)].map((m) => m[1]);

// Quiet: gcloud prints one line per file; only the count of copied files and any error are shown.
export function rsync(from, to) {
  if (!to.startsWith('gs:')) fs.mkdirSync(to, { recursive: true });
  const r = spawnSync('gcloud', ['storage', 'rsync', '--recursive', '--ignore-symlinks', from, to], { encoding: 'utf8', shell, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`${(r.stderr || '').split('\n').filter((l) => /ERROR|denied|403|401/i.test(l)).slice(0, 3).join('\n')}\ngcloud storage rsync failed. Sign in with «gcloud auth login» and ask for access to the aisgroup-design project.`);
  const copied = (r.stderr.match(/^Copying /gm) || []).length;
  console.error(copied ? `${copied} files updated from ${from} to ${to}.` : `${to} is up to date.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, set, folder] = process.argv.slice(2);
  if (!['pull', 'push'].includes(command) || !SETS.includes(set)) { console.error(`Usage: media.mjs pull|push ${SETS.join('|')} [folder]`); process.exit(1); }
  if (!hasGcloud()) { console.error('Install the Google Cloud CLI (https://cloud.google.com/sdk/docs/install), then run «gcloud auth login».'); process.exit(1); }
  const local = path.resolve(folder ?? (set === 'media' ? (command === 'push' ? fs.realpathSync(path.join(ROOT, 'library/media')) : MEDIA_HOME) : set));
  try { command === 'pull' ? rsync(`${BUCKET}/${set}`, local) : rsync(local, `${BUCKET}/${set}`); }
  catch (e) { console.error(e.message); process.exit(1); }
}
