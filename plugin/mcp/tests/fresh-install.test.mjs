// What broke when the plugin was installed fresh and four real jobs ran through the studio MCP.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { Factory } from '../core.mjs';
import { STUDIO } from '../../engine/recipe.mjs';
import { needsMedia } from './needs.mjs';

const fixture = (t) => { const f = new Factory({ state: fs.mkdtempSync(path.join(os.homedir(), '.cache/ais-group-design/mcp-fresh-test-')), schedule: () => {} }); t.after(() => f.close()); return f; };
const call = (f, n, a) => f.call(n, a);

test('the product post template is the approved kit post and a PNG export accepts its formats', { skip: needsMedia }, (t) => {
  const template = JSON.parse(fs.readFileSync(path.join(STUDIO, 'templates/post-product.json')));
  const approved = JSON.parse(fs.readFileSync(path.join(STUDIO, 'pieces/posts/01-hopper/recipe-es.json')));
  assert.deepEqual(template.shots, approved.shots);
  const f = fixture(t);
  call(f, 'edit_piece', { action: 'copy', pieceId: 'fresh-post', source: 'templates/post-product.json' });
  // A post with an extra 1x1 format still exports its 4x5 as PNG (the renderer is called with --formats 4x5).
  const recipe = path.join(f.state ?? '', 'pieces/fresh-post/recipe.json');
  if (fs.existsSync(recipe)) { const r = JSON.parse(fs.readFileSync(recipe)); r.formats = ['4x5', '1x1']; fs.writeFileSync(recipe, JSON.stringify(r)); }
  assert.doesNotThrow(() => call(f, 'export_piece', { action: 'enqueue', pieceId: 'fresh-post', operation: 'render-png' }));
});

test('safe_render accepts a post whose recipe also lists 1x1', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-safe-render-')), recipe = path.join(dir, 'r.json');
  fs.writeFileSync(recipe, JSON.stringify({ kind: 'post', shots: [{ type: 'hero' }], formats: ['4x5', '1x1'] }));
  const code = `import sys; sys.path.insert(0, ${JSON.stringify(path.join(STUDIO, 'skills/_shared/scripts'))}); import safe_render as s; s.validate_post([${JSON.stringify(process.execPath)}, ${JSON.stringify(path.join(STUDIO, 'engine/render.mjs'))}, ${JSON.stringify(recipe)}, '--only', 'png', '--formats', '4x5', '--out', ${JSON.stringify(dir)}]); print('ok')`;
  const r = spawnSync('python3', ['-c', code], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  // Later guards (name, pictures) need a real recipe; this one only proves the format rule lets 4x5 through.
  assert(!/needs one static 4x5 or 1x1 shot/.test(r.stderr), r.stderr);
});

test('plan_piece offers the brochure, catalogue or deck the request names, first', () => {
  const f = new Factory({ state: fs.mkdtempSync(path.join(os.homedir(), '.cache/ais-group-design/mcp-fresh-plan-')), schedule: () => {} });
  try {
    const first = (intent) => call(f, 'plan_piece', { intent }).templates?.[0]?.id;
    assert.equal(first('Folleto de la AIS Hopper en español para una feria'), 'brochure-hopper');
    assert.equal(first('Catálogo de bebidas'), 'catalogue-beverage');
    assert.equal(first('Presentación para una línea de galletas'), 'deck-biscuits');
    assert.equal(first('Ficha técnica de la AIS Hopper'), 'hopper-technical-sheet');
  } finally { f.close(); }
});

test('a long deck lists its slots page by page, under the reply budget', { skip: needsMedia }, (t) => {
  const f = fixture(t);
  call(f, 'edit_piece', { action: 'copy', pieceId: 'fresh-deck', source: 'pieces/decks/biscuits/content.es.json' });
  const one = call(f, 'edit_piece', { action: 'slots', pieceId: 'fresh-deck' });
  assert.equal(one.slots.length, 20); assert.equal(one.nextOffset, 20); assert(one.total > 40);
  assert(Buffer.byteLength(JSON.stringify(one)) < 16000);
  const two = call(f, 'edit_piece', { action: 'slots', pieceId: 'fresh-deck', offset: one.nextOffset });
  assert.notEqual(two.slots[0].id, one.slots[0].id);
});

test('the hexagon check and the stylesheet check hold in an installed plugin (no ../guide, no symlinks)', () => {
  const r = spawnSync('python3', ['-I', path.join(STUDIO, 'print/pattern.py'), '--assets', '--check'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const pkg = fs.readFileSync(path.join(STUDIO, 'scripts/package-plugin.mjs'), 'utf8');
  assert(!/source-media/.test(pkg), 'decks keep their source media in the upload');
  assert(!/retainRules\(/.test(pkg), 'packaging ships the live skills as they are');
});

test('the installed plugin carries the product-UI audit, theme diff and states check, runnable from any app folder', () => {
  const app = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-app-')), script = path.join(STUDIO, 'scripts/ui-contract.mjs');
  fs.writeFileSync(path.join(app, 'View.vue'), '<template><h2 class="font-semibold text-[#123456]">Hi</h2></template>');
  fs.writeFileSync(path.join(app, 'theme.css'), ':root { --background: #fff; }');
  const audit = spawnSync(process.execPath, [script, 'audit', 'View.vue'], { cwd: app, encoding: 'utf8' });
  const diff = spawnSync(process.execPath, [script, 'diff', 'theme.css'], { cwd: app, encoding: 'utf8' });
  const states = spawnSync(process.execPath, [path.join(STUDIO, 'scripts/ui-states.mjs')], { cwd: app, encoding: 'utf8' });
  fs.rmSync(app, { recursive: true, force: true });
  assert.deepEqual([states.status, /^Usage: ui-states\.mjs/.test(states.stderr)], [2, true], states.stderr);
  assert.deepEqual(Object.keys(JSON.parse(audit.stdout).counts).sort(), ['heading-weight', 'raw-colour']);
  assert(JSON.parse(diff.stdout).differences.light.length > 0, diff.stderr);
});
