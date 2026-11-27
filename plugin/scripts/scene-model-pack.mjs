// Portable internal model library. Both commands use only local files and Node builtins.
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { gzipSync, gunzipSync } from 'node:zlib';
import { modelPackPaths } from '../mcp/industrial-models.mjs';
import { sceneCacheDir } from '../skills/scene-assembly/models-directory.mjs';

const format = 'ais-private-scene-models/v1';
const maximum = 40 * 1024 * 1024;
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
const notice = 'Internal AIS animation pilot. The source register preserves manufacturer notices and conversion details. The Compact exterior is AIS engineering material. Each source retains its own terms.';

function readPart(root, name) {
  const file = path.join(root, name);
  if (fs.realpathSync(file) !== file || !fs.lstatSync(file).isFile() || fs.statSync(file).size > maximum) {
    throw new Error('Expected a local registered model-library file: ' + name);
  }
  return fs.readFileSync(file);
}

function checkPart(name, bytes) {
  if (!bytes.length) throw new Error('Empty model-library file: ' + name);
  if (name.endsWith('.glb') && (bytes.length < 24 || bytes.toString('ascii', 0, 4) !== 'glTF'
      || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length
      || bytes.toString('ascii', 16, 20) !== 'JSON')) {
    throw new Error('Invalid GLB: ' + name);
  }
  if (name.endsWith('.webp') && (bytes.toString('ascii', 0, 4) !== 'RIFF'
      || bytes.toString('ascii', 8, 12) !== 'WEBP')) throw new Error('Invalid texture: ' + name);
}

export function makeSceneModelPack(source, archive) {
  const root = fs.realpathSync(source);
  const files = modelPackPaths.map((name) => {
    const bytes = readPart(root, name);
    checkPart(name, bytes);
    return { name, sha256: hash(bytes), data: bytes.toString('base64') };
  });
  const pack = gzipSync(JSON.stringify({ format, notice, files }), { level: 9 });
  const destination = path.resolve(archive);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const scratch = destination + '.' + randomUUID() + '.tmp';
  try {
    fs.writeFileSync(scratch, pack, { mode: 0o600, flag: 'wx' });
    fs.renameSync(scratch, destination);
  } finally {
    fs.rmSync(scratch, { force: true });
  }
  return { path: destination, sha256: hash(pack), files: files.length };
}

function decodePack(archive) {
  if (fs.statSync(archive).size > maximum) throw new Error('Excessive scene archive size');
  const packed = fs.readFileSync(archive);
  const data = JSON.parse(gunzipSync(packed, { maxOutputLength: maximum }).toString('utf8'));
  if (data.format !== format || !Array.isArray(data.files) || data.files.length !== modelPackPaths.length) {
    throw new Error('Incomplete or unsupported scene model pack');
  }
  const allowed = new Set(modelPackPaths);
  const files = data.files.map(({ name, sha256, data }) => {
    if (!allowed.delete(name)) throw new Error('Duplicate or unregistered asset: ' + name);
    if (typeof data !== 'string') throw new Error('Missing bytes: ' + name);
    const bytes = Buffer.from(data, 'base64');
    if (hash(bytes) !== sha256) throw new Error('Damaged scene model: ' + name);
    checkPart(name, bytes);
    return { name, sha256, bytes };
  });
  return { id: hash(packed), files };
}

function verifyInstalled(root, files) {
  if (!fs.lstatSync(root).isDirectory()) throw new Error('Expected an installed model directory');
  const actual = fs.realpathSync(root);
  for (const file of files) {
    const target = path.join(actual, file.name);
    const directory = path.dirname(target);
    fs.mkdirSync(directory, {recursive: true, mode: 0o700});
    if (fs.realpathSync(directory) !== directory) throw new Error('Unexpected model directory link');
    try {
      if (hash(readPart(actual, file.name)) === file.sha256) continue;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    // Restore a missing or damaged file from the already verified archive without exposing a partial GLB.
    const scratch = path.join(directory, '.restore-' + randomUUID());
    try {
      fs.writeFileSync(scratch, file.bytes, {flag: 'wx', mode: 0o600});
      fs.renameSync(scratch, target);
    } finally {
      fs.rmSync(scratch, {force: true});
    }
  }
}

export function installSceneModelPack(archive, cache = sceneCacheDir()) {
  const { id, files } = decodePack(archive);
  fs.mkdirSync(cache, { recursive: true, mode: 0o700 });
  const root = path.join(cache, id);
  if (!fs.existsSync(root)) {
    const staging = fs.mkdtempSync(path.join(cache, '.install-'));
    try {
      for (const { name, bytes } of files) {
        const target = path.join(staging, name);
        fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
        fs.writeFileSync(target, bytes, { flag: 'wx', mode: 0o600 });
      }
      try {
        fs.renameSync(staging, root);
      } catch (error) {
        // Simultaneous imports of the same pack may have committed this version already.
        if (!fs.existsSync(root)) throw error;
      }
    } finally {
      fs.rmSync(staging, { recursive: true, force: true });
    }
  }
  verifyInstalled(root, files);
  const pointer = path.join(cache, '.current-' + randomUUID());
  try {
    fs.writeFileSync(pointer, id + '\n', { flag: 'wx', mode: 0o600 });
    fs.renameSync(pointer, path.join(cache, 'current'));
  } finally {
    fs.rmSync(pointer, { force: true });
  }
  return root;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'create' && args.length === 2) console.log(JSON.stringify(makeSceneModelPack(...args)));
    else if (command === 'install' && args.length === 1) console.log(installSceneModelPack(args[0]));
    else throw new Error('Usage: node scripts/scene-model-pack.mjs create <models-directory> <output.aispack> | install <input.aispack>');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
