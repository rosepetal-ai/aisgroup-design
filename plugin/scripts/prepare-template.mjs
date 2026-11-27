// Resolve a shipped template against exactly the source revision used to package this edition.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { templateCatalog } from './template-catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = path.join(root, 'templates/catalog.json');
const catalog = fs.existsSync(index) ? JSON.parse(fs.readFileSync(index)) : templateCatalog(root);
const home = process.env.AIS_PLUGIN_DATA || path.join(os.homedir(), '.cache/ais-group-design');
const cache = path.join(home, 'template-kits', catalog.revision);
const repository = 'https://github.com/rosepetal-ai/aisgroup-design.git';
const common = ['package.json', 'requirements.txt', 'engine/', 'templates/', 'print/', 'scripts/', 'skills/', 'library/catalog.json',
  'brand/fonts/', 'brand/logos/', 'brand/imagery/', 'brand/library/', 'brand/downloads/qa/', 'brand/downloads/icons/', 'brand/kit/*.svg'];
const families = {
  'social-video': ['brand/downloads/linkedin-patterns/*.svg', 'brand/downloads/video/', 'pieces/patterns/'],
  print: ['pieces/brochures/', 'pieces/datasheets/', 'pieces/sales/', 'datasheets/'],
  decks: ['decks/', 'pieces/decks/', 'pieces/brochures/'],
  stationery: ['stationery/', 'pieces/stationery/letterhead/', 'pieces/stationery/assets/', 'pieces/stationery/logos/', 'pieces/stationery/pictograms/', 'brand/kit/office/fonts/'],
};

function run(cmd, args, cwd, input) {
  const result = spawnSync(cmd, args, { cwd, input, stdio: [input ? 'pipe' : 'ignore', 2, 2], env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
  if (result.status !== 0) throw Error(result.error?.message || cmd + ' failed. See the preceding diagnostic.');
}

function runtime(family) {
  if (!fs.existsSync(index)) return root;
  const target = path.join(cache, family);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(cache, { recursive: true });
    const stage = fs.mkdtempSync(path.join(cache, '.prepare-'));
    try {
      const git = (...args) => run('git', args, stage);
      git('init', '-q');
      git('remote', 'add', 'origin', repository);
      git('config', 'remote.origin.promisor', 'true');
      git('config', 'remote.origin.partialclonefilter', 'blob:none');
      const paths = [...common, ...families[family]].map(p => '/plugin/' + p);
      run('git', ['sparse-checkout', 'set', '--no-cone', '--stdin'], stage, paths.join('\n') + '\n');
      git('fetch', '--quiet', '--no-tags', '--depth=1', '--filter=blob:none', 'origin', catalog.revision);
      git('checkout', '--quiet', '--detach', catalog.revision);
      // Print HTML uses pieces/shared. A junction also works on Windows without Git symlink privileges.
      const pieces = path.join(stage, 'plugin/pieces');
      fs.mkdirSync(pieces, { recursive: true });
      // Copy here because absolute junction targets would break when the staged directory moves.
      fs.cpSync(path.join(stage, 'plugin/print'), path.join(pieces, 'shared'), { recursive: true });
      fs.copyFileSync(index, path.join(stage, 'plugin/templates/catalog.json'));
      try { fs.renameSync(stage, target); } catch (error) { if (!fs.existsSync(target)) throw error; }
    } finally { fs.rmSync(stage, { recursive: true, force: true }); }
  }
  return path.join(target, 'plugin');
}

async function asset(id) {
  if (!Object.hasOwn(catalog.assets, id)) throw Error('Unknown approved media ID: ' + id);
  const { url, sha256 } = catalog.assets[id];
  const dir = path.join(home, 'approved-media', sha256);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, path.basename(url));
  const hash = data => createHash('sha256').update(data).digest('hex');
  if (fs.existsSync(dest) && hash(fs.readFileSync(dest)) === sha256) return dest;
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw Error('Media download returned HTTP ' + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (hash(bytes) !== sha256) throw Error('The hosted media differs from this release: ' + id);
  const tmp = dest + '.' + randomUUID();
  try { fs.writeFileSync(tmp, bytes); fs.renameSync(tmp, dest); }
  finally { fs.rmSync(tmp, { force: true }); }
  return dest;
}

const [id, name] = process.argv.slice(2);
if (!id || id === '--list') console.log(JSON.stringify(catalog, null, 2));
else if (id === '--asset') console.log(await asset(name));
else {
  if (!Object.hasOwn(catalog.entries, id)) throw Error('Unknown template ID. Use --list.');
  const { family, source } = catalog.entries[id];
  const cwd = runtime(family);
  if (!fs.existsSync(path.join(cwd, source))) throw Error('Template missing from prepared kit: ' + source);
  console.log(JSON.stringify({ cwd, source: path.join(cwd, source), family }));
}
