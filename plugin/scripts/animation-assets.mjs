// Fetch the pinned private model pack once per plugin data directory.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { modelPackPaths } from '../mcp/industrial-models.mjs';
import { installedSceneModels } from '../skills/scene-assembly/models-directory.mjs';
import { installSceneModelPack } from './scene-model-pack.mjs';

const run = promisify(execFile);
const require = createRequire(import.meta.url);
const descriptor = new URL('./animation-assets.json', import.meta.url);

async function firebaseToken() {
  // Reuse the Firebase CLI sign-in when the team already works in Firebase.
  const globalRoot = await commandOutput('npm', ['root', '-g']);
  const auth = require(path.join(globalRoot, 'firebase-tools/lib/auth.js'));
  const account = auth.getGlobalDefaultAccount();
  if (!account) throw new Error('No signed-in Firebase account');
  const result = await auth.getAccessToken(account.tokens.refresh_token, []);
  return result.access_token;
}

async function commandOutput(binary, args) {
  // Windows installs both CLIs with a .cmd launcher. All arguments here are constants.
  const windows = process.platform === 'win32';
  const { stdout } = await run(windows ? binary + '.cmd' : binary, args, {
    shell: windows, encoding: 'utf8', timeout: 20000, windowsHide: true,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: '1' },
  });
  return stdout.trim();
}

async function fetchPrivatePack(url) {
  const credentials = [
    firebaseToken,
    () => commandOutput('gcloud', ['auth', 'print-access-token', '--quiet']),
    () => commandOutput('gcloud', ['auth', 'application-default', 'print-access-token', '--quiet']),
  ];
  let lastStatus;
  for (const getToken of credentials) {
    let token;
    try { token = await getToken(); } catch { continue; }
    if (!token) continue;
    const response = await fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      signal: AbortSignal.timeout(45000), redirect: 'error',
    });
    if (response.ok) return response;
    lastStatus = response.status;
    await response.body?.cancel();
    if (lastStatus !== 401 && lastStatus !== 403) throw new Error('Cloud Storage returned HTTP ' + lastStatus);
  }
  const status = lastStatus ? ' (HTTP ' + lastStatus + ')' : '';
  throw new Error('Private animation assets require an AIS account with read access' + status +
    '. Sign in with firebase login or gcloud auth login, or install the internal offline pack using scripts/scene-model-pack.mjs.');
}

// A matching cache directory can still contain a partial restore or a damaged mesh.
async function cacheMatches(root, asset) {
  if (!root || path.basename(root) !== asset.sha256) return false;
  try {
    for (const name of modelPackPaths) {
      const file = path.join(root, name);
      if (await fs.realpath(file) !== file) return false;
      const bytes = await fs.readFile(file);
      if (createHash('sha256').update(bytes).digest('hex') !== asset.files[name]) return false;
    }
    return true;
  } catch { return false; }
}

export async function ensureAnimationAssets() {
  if (process.env.AIS_INDUSTRY_MODELS) return path.dirname(path.resolve(process.env.AIS_INDUSTRY_MODELS));
  if (process.env.AIS_SCENE_MODELS_DIR) return path.resolve(process.env.AIS_SCENE_MODELS_DIR);
  const asset = JSON.parse(await fs.readFile(descriptor, 'utf8'));
  if (!/^[a-f0-9]{64}$/.test(asset.sha256) || asset.bucket !== 'aisgroup-design-private' ||
      asset.object !== 'animation-pilot/models/' + asset.sha256 + '.aispack' ||
      !/^\d+$/.test(asset.generation) || !modelPackPaths.every(name => /^[a-f0-9]{64}$/.test(asset.files?.[name])) ||
      !Number.isSafeInteger(asset.bytes) || asset.bytes < 1 || asset.bytes > 40*1024*1024) {
    throw new Error('Invalid private animation asset descriptor.');
  }
  const current = installedSceneModels();
  if (await cacheMatches(current, asset)) return current;
  const url = new URL('https://storage.googleapis.com/storage/v1/b/' + asset.bucket + '/o/' + encodeURIComponent(asset.object));
  url.search = new URLSearchParams({ alt: 'media', generation: asset.generation });
  const response = await fetchPrivatePack(url);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== asset.bytes || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) {
    throw new Error('Private animation asset pack failed its size or checksum check.');
  }
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'ais-animation-assets-'));
  try {
    const archive = path.join(temp, 'models.aispack');
    await fs.writeFile(archive, bytes, { mode: 0o600, flag: 'wx' });
    return installSceneModelPack(archive);
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(await ensureAnimationAssets()); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
