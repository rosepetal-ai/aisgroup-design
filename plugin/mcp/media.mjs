import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { STUDIO, GUIDE } from '../engine/recipe.mjs';
import { pythonPath } from '../scripts/setup.mjs';

export const PREVIEW_BYTES = 96 * 1024;
// Windows has no python3: use the plugin venv's python (start.mjs sets AIS_PYTHON). Elsewhere python3, the venv's once start.mjs puts it first on PATH.
export const PYTHON = pythonPath();
// Windows has no SIGTERM: child.kill() is TerminateProcess on the Python supervisor alone, which would leave Chromium/ffmpeg running. End the whole tree there.
export function stopTree(child) {
  if (process.platform !== 'win32') return child.kill('SIGTERM');
  spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' }).on('error', () => {});
}
export function sourceStamp(p) {
  const s = fs.statSync(p);
  return { bytes:s.size, mtimeMs:s.mtimeMs, ctimeMs:s.ctimeMs, inode:s.ino, device:s.dev };
}
const sameStamp = (a,b) => Object.keys(a || {}).length === 5 && Object.keys(b).every(k => a[k] === b[k]);
export function resolveMediaReference(state, ref) {
  const m = /^media:([a-f0-9-]{36}):([0-3])$/.exec(ref);
  if (!m) throw Error('Expected a media reference returned by plan_piece');
  const bundlePath = path.join(state,'bundles',m[1]+'.json');
  if (fs.lstatSync(bundlePath).isSymbolicLink()) throw Error('Bundle cannot be a symlink');
  const bundle = JSON.parse(fs.readFileSync(bundlePath,'utf8'));
  const media = bundle.media?.[Number(m[2])];
  if (!media || media.ref !== ref || !media.uri?.startsWith('file:')) throw Error('Unknown supplied media reference; route the source again');
  const p = fs.realpathSync(fileURLToPath(media.uri));
  const roots = [path.join(STUDIO,'library'),path.join(STUDIO,'library/media'),path.join(STUDIO,'work'),GUIDE,...(process.env.AIS_INBOX?[process.env.AIS_INBOX]:[])].filter((r)=>fs.existsSync(r));
  if (!roots.some(root => { const r=path.relative(fs.realpathSync(root),p);return r==='' || (!r.startsWith('..') && !path.isAbsolute(r)); })) throw Error('Media escaped controlled roots');
  if (!sameStamp(media.stamp,sourceStamp(p))) throw Error('Supplied media changed; route the current file again');
  return {...media,path:p};
}

export async function inspectMedia(state, args, {signal,onStart=()=>{},onFinish=()=>{}}={}) {
  if(signal?.aborted)throw Error('Media inspection cancelled');
  const media = resolveMediaReference(state,args.ref);
  if (media.mime === 'text/plain') throw Error('Use read_instructions with this media reference for bounded text');
  if (args.action === 'probe' && args.seconds !== undefined) throw Error('A timestamp is only used for a video preview');
  if (media.mime !== 'video/mp4' && args.seconds !== undefined) throw Error('Image references do not accept timestamps');
  const cache = path.join(state,'media');
  fs.mkdirSync(cache,{recursive:true,mode:0o700});
  if (fs.lstatSync(cache).isSymbolicLink()) throw Error('Media cache cannot be a symlink');
  if (fs.readdirSync(cache).length >= 100) throw Error('Media inspection cap reached; archive state manually');
  const dir = path.join(cache,randomUUID());fs.mkdirSync(dir,{mode:0o700});
  const request = {path:media.path,mime:media.mime,action:args.action,seconds:args.seconds,output:dir};
  const result = await new Promise((resolve,reject) => {
    const child = spawn(PYTHON,[path.join(STUDIO,'mcp/media-preview.py')],{stdio:['pipe','pipe','pipe'],env:{...process.env,OMP_NUM_THREADS:'1',OPENBLAS_NUM_THREADS:'1'}});
    if(child.pid)onStart(child.pid);
    let stdout='',stderr='',timedOut=false;
    const abort=()=>stopTree(child);signal?.addEventListener('abort',abort,{once:true});
    if(signal?.aborted)abort();
    let finished=false;
    const finish=()=>{if(finished)return;finished=true;signal?.removeEventListener('abort',abort);if(child.pid)onFinish(child.pid);};
    // The Python supervisor owns the shared lock and kills its descendants before returning.
    const timer=setTimeout(()=>{timedOut=true;stopTree(child);},40000);
    child.stdout.on('data',b=>{stdout+=b;if(Buffer.byteLength(stdout)>24000)stopTree(child);});
    child.stderr.on('data',b=>{stderr=(stderr+b).slice(-2000);});
    child.once('error',e=>{clearTimeout(timer);finish();reject(e);});
    child.once('close',code=>{
      clearTimeout(timer);finish();
      if(timedOut)return reject(Error('Finite media inspection deadline exceeded'));
      try {const r=JSON.parse(stdout);if(!['inspected','previewed','blocked','failed'].includes(r.state))throw Error('Invalid inspector state');resolve(r);}
      catch {reject(Error(`Media inspector failed (${code}): ${stderr.slice(-500)}`));}
    });
    child.stdin.on('error',()=>{});child.stdin.end(JSON.stringify(request));
  });
  const after = resolveMediaReference(state,args.ref);
  const summary = {ref:args.ref,source:{uri:after.uri,mime:after.mime,bytes:after.bytes,role:after.role,catalogMatches:after.catalogMatches||[]},...result,referenceOnly:true};
  if(result.state==='previewed') {
    const p=path.join(dir,result.preview.file);
    if(!['preview.jpg','preview.png'].includes(result.preview.file) || !fs.statSync(p).isFile() || fs.statSync(p).size>PREVIEW_BYTES)throw Error('Invalid bounded preview');
    const bytes=fs.readFileSync(p);
    summary.preview={...result.preview,uri:pathToFileURL(p).href};
    summary.image={type:'image',data:bytes.toString('base64'),mimeType:result.preview.mime};
  }
  const {image,...record}=summary;
  fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(record,null,2),{mode:0o600});
  return summary;
}
