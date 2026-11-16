// Canonical generator routes: every piece type routes to the accepted template; HTML first, PDF/PNG/PPTX on request.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Factory } from '../core.mjs';
import { STUDIO } from '../../engine/recipe.mjs';
import { needsMedia } from './needs.mjs';
const fixture = (t, o = {}) => { const f = new Factory({ state: fs.mkdtempSync(path.join(os.homedir(), '.cache/ais-group-design/mcp-gen-test-')), schedule: () => {}, ...o }); t.after(() => f.close()); return f; };
const call = (f, n, a) => f.call(n, a);
const status = (f, j) => call(f, 'export_piece', { action: 'status', jobId: j.id });
// A scratch source inside studio/work (the only root documents copy from), removed afterwards.
function scratch(t, name, html) {
  const dir = path.join(STUDIO, 'work/_e2e-1102/mcp-test', String(process.pid));
  fs.mkdirSync(path.join(dir, 'piece'), { recursive: true });
  try { fs.symlinkSync('../../../../print', path.join(dir, 'shared')); } catch {}
  fs.writeFileSync(path.join(dir, 'piece', name), html);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.relative(STUDIO, path.join(dir, 'piece', name));
}
// A scratch deck (content.es.json) in its own folder under studio/work.
function scratchDeck(t, slides) {
  const dir = path.join(STUDIO, 'work/_e2e-1102/mcp-test-deck', String(process.pid));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'content.es.json'), JSON.stringify({ meta: { lang: 'es', title: 'Prueba', file: 'prueba' }, slides }));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.relative(STUDIO, path.join(dir, 'content.es.json'));
}
const page = (body, head = '<link rel="stylesheet" href="../shared/system.css">') => `<!doctype html><html lang="es"><head><meta charset="utf-8">${head}</head><body><section class="page cover">${body}</section></body></html>`;

test('route returns the one canonical generator for every piece type', t => {
  const f = fixture(t);
  const cases = [['Rehaz el folleto de AIS Hopper', 'document', 'brochure', 'print/render.mjs'], ['Catálogo de bebidas', 'document', 'catalogue', 'print/render.mjs'],
    ['A one-pager flyer for OPTICAIS', 'document', 'one-pager', 'print/render.mjs'], ['Ficha técnica de KARIKÓ', 'document', 'datasheet', 'mcp:pin'],
    ['A deck section on wine for the corporate presentation', 'deck', 'deck', 'build.mjs'], ['LinkedIn post about Hopper', 'post', 'post', 'engine/render.mjs'],
    ['Carrusel de defectos de zumo', 'carousel', 'carousel', 'engine/render.mjs'], ['Tarjeta de visita para Pere', 'kit', 'business-card', 'export.mjs'],
    ['Letterhead for AIS Vision Systems', 'kit', 'letterhead', 'export.mjs']];
  for (const [intent, kind, key, cmd] of cases) {
    const r = call(f, 'plan_piece', { intent });
    assert.equal(r.kind, kind, intent); assert.equal(r.generator.key, key, intent);
    assert(JSON.stringify(r.generator).includes(cmd), intent); assert.match(r.generator.rejected, /machine-pieces/);
  }
  assert.deepEqual(call(f, 'studio_status', {}).generators.sort(), ['brochure', 'business-card', 'carousel', 'case-study', 'catalogue', 'datasheet', 'deck', 'letterhead', 'one-pager', 'pattern', 'post', 'proposal'].sort());
});

test('v2 brochure: pinned on print/system.css, HTML first, PDF only on request through the document profile', async t => {
  let invocation;
  const f = fixture(t, { launch: (command, args, options) => {
    invocation = { command, args };
    const html = args[args.length - 1];
    return spawn(process.execPath, ['-e', `require('fs').writeFileSync(${JSON.stringify(html.replace(/\.html$/, '.pdf'))},'%PDF-1.7')`], { stdio: ['ignore', 'pipe', 'pipe'] });
  } });
  const piece = call(f, 'edit_piece', { action: 'copy', pieceId: 'cables', source: 'pieces/brochures/cables/cables.es.html' });
  assert(piece.valid, JSON.stringify(piece.errors)); assert.equal(piece.kind, 'print-html'); assert.equal(piece.generator, 'print/render.mjs');
  const deps = JSON.parse(fs.readFileSync(fileURLToPath(piece.dependencyEvidence)));
  assert(deps.files.some(x => x.path.endsWith('shared/system.css'))); assert(deps.files.some(x => x.path.endsWith('assets/hex-printed-cover.svg')));
  assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'cables', expectedDigest: 'x'.repeat(64), changes: [{ field: 'copy', value: 'x' }] }), /edited by slot/);
  const html = call(f, 'export_piece', { action: 'enqueue', pieceId: 'cables', operation: 'render-html' }); await f.pump();
  const h = status(f, html); assert.equal(h.state, 'succeeded', h.reason); assert.equal(invocation, undefined);
  assert.deepEqual(h.artifacts.map(a => path.basename(fileURLToPath(a.uri))), ['cables.es.html']);
  assert.throws(() => call(f, 'export_piece', { action: 'enqueue', pieceId: 'cables', operation: 'render-png' }), /render-html/);
  const pdf = call(f, 'export_piece', { action: 'enqueue', pieceId: 'cables', operation: 'render-pdf' }); await f.pump();
  const p = status(f, pdf); assert.equal(p.state, 'succeeded', p.reason + p.log);
  assert(invocation.args[0].endsWith('safe_render.py')); assert.equal(invocation.args[invocation.args.indexOf('--profile') + 1], 'document');
  assert(invocation.args.at(-2).endsWith('/print/render.mjs')); assert(invocation.args.at(-1).startsWith(path.join(f.state, 'jobs', pdf.id)));
  assert(p.artifacts.some(a => a.uri.endsWith('cables.es.pdf'))); assert(p.artifacts.some(a => a.uri.endsWith('cables.es.html')));
  const cwd = process.cwd(), out = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-save-')); process.chdir(out); t.after(() => { process.chdir(cwd); fs.rmSync(out, { recursive: true, force: true }); });
  const saved = call(f, 'export_piece', { action: 'enqueue', pieceId: 'cables', operation: 'render-pdf', saveAs: 'brochure.pdf' }); await f.pump();
  assert.equal(status(f, saved).saved, 'file://' + path.join(out, 'brochure.pdf')); assert.equal(fs.readFileSync(path.join(out, 'brochure.pdf'), 'utf8'), '%PDF-1.7');
  assert.throws(() => call(f, 'export_piece', { action: 'enqueue', pieceId: 'cables', operation: 'render-pdf', saveAs: 'brochure.pdf' }), /already exists/);
  assert.throws(() => call(f, 'export_piece', { action: 'enqueue', pieceId: 'cables', operation: 'render-pdf', saveAs: '../x.pdf' }));
});

test('decks: plan lists the approved decks; copy, slots, update, validate and render-html build the edited deck in the "Hoy + azul" engine', { skip: needsMedia }, async t => {
  const f = fixture(t);
  const plan = call(f, 'plan_piece', { intent: 'Presentación de inspección de vino' });
  assert.equal(plan.kind, 'deck'); assert.equal(plan.templates[0].source, 'pieces/decks/wine/content.es.json');
  const piece = call(f, 'edit_piece', { action: 'copy', pieceId: 'wine', source: plan.templates[0].source });
  assert(piece.valid, JSON.stringify(piece.errors)); assert.equal(piece.kind, 'deck'); assert.equal(piece.generator, 'decks/build.mjs');
  const listed = call(f, 'edit_piece', { action: 'slots', pieceId: 'wine' });
  const title = listed.slots.find(x => x.type === 'text' && x.field === 'title' && x.slide > 1);
  const r = call(f, 'edit_piece', { action: 'update', pieceId: 'wine', expectedDigest: listed.digest, slotChanges: [{ slot: title.id, text: 'Control de calidad en bodega' }] });
  assert.equal(r.updated, true, JSON.stringify(r));
  assert(call(f, 'edit_piece', { action: 'validate', pieceId: 'wine' }).valid);
  const j = call(f, 'export_piece', { action: 'enqueue', pieceId: 'wine', operation: 'render-html' }); await f.pump();
  const s = status(f, j); assert.equal(s.state, 'succeeded', s.reason + s.log);
  const out = fileURLToPath(s.artifacts.find(a => a.uri.endsWith('.html')).uri), html = fs.readFileSync(out, 'utf8');
  assert.match(path.basename(out), /^ais-vision-systems_presentation-wine_es\.html$/);
  assert.match(html, /<style>[\s\S]*\.hbody\{/); assert.match(html, /src="media\/hex-deck-tr\.svg"/); assert(!/linear-gradient\(/.test(html.replace(/<style>[\s\S]*?<\/style>/, '')));
  assert(html.includes('Control de calidad en bodega'));
  assert.equal((html.match(/<section class="slide /g) || []).length, JSON.parse(fs.readFileSync(path.join(STUDIO, plan.templates[0].source))).slides.length);
  assert(!s.artifacts.some(a => /\.(pdf|pptx)$/.test(a.uri)));
  const bad = call(f, 'edit_piece', { action: 'copy', pieceId: 'bad', source: scratchDeck(t, [{ layout: 'quote', title: 'x' }]) });
  assert.equal(bad.valid, false); assert(bad.errors.some(e => /unknown layout "quote"/.test(e)));
});

test('stationery routes to the kit export and must use the pattern.py field', t => {
  const f = fixture(t);
  const piece = call(f, 'edit_piece', { action: 'copy', pieceId: 'letter', source: 'pieces/stationery/letterhead/ais-vision-systems.html' });
  assert(piece.valid, JSON.stringify(piece.errors)); assert.equal(piece.kind, 'kit'); assert.equal(piece.generator, 'stationery/export.mjs');
  const dir = path.dirname(fileURLToPath(piece.uri));
  fs.writeFileSync(path.join(dir, 'deps/pieces/stationery/assets/hex-letter.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  const checked = call(f, 'edit_piece', { action: 'validate', pieceId: 'letter' }); assert.equal(checked.valid, false);
  assert(checked.errors.some(e => /hex-letter\.svg differs|Snapshot changed/.test(e)));
});

test('rejected systems, other stylesheets, <style> blocks and flat-label wine renders fail', t => {
  const f = fixture(t);
  assert.throws(() => call(f, 'edit_piece', { action: 'copy', pieceId: 'v1', source: 'work/brochures/_final/AIS Hopper ES.pdf' }));
  assert.throws(() => call(f, 'edit_piece', { action: 'copy', pieceId: 'review', source: 'work/../marketing-kit-review-2026-10-28/x.html' }));
  const other = scratch(t, 'other.es.html', page('<p>x</p>', '<link rel="stylesheet" href="../shared/template.css">'));
  assert.equal(call(f, 'edit_piece', { action: 'copy', pieceId: 'other', source: other }).valid, false);
  const styled = scratch(t, 'styled.es.html', page('<p>x</p>', '<link rel="stylesheet" href="../shared/system.css"><style>h1{color:red}</style>'));
  const s = call(f, 'edit_piece', { action: 'copy', pieceId: 'styled', source: styled }); assert.equal(s.valid, false); assert(s.errors.some(e => /<style>/.test(e)));
  const flat = path.join(os.homedir(), '.cache/ais-group-design/det/rev360-standard/stillwine_det-label-double.jpg');
  if (fs.existsSync(flat)) {
    const src = scratch(t, 'wine.es.html', page('<img src="flat.jpg" alt="Botella">'));
    fs.copyFileSync(flat, path.join(STUDIO, path.dirname(src), 'flat.jpg'));
    const w = call(f, 'edit_piece', { action: 'copy', pieceId: 'wine', source: src }); assert.equal(w.valid, false); assert(w.errors.some(e => /flat-label/.test(e)));
  }
});

test('safe_render document profile admits only the canonical generators', () => {
  const run = (...cmd) => spawnSync('python3', [path.join(STUDIO, 'skills/_shared/scripts/safe_render.py'), '--profile', 'document', '--check', '--timeout', '300', '--', process.execPath, ...cmd], { cwd: STUDIO, encoding: 'utf8' });
  for (const ok of [['print/render.mjs', 'pieces/brochures/cables/cables.es.html'], ['decks/build.mjs', 'pieces/decks/wine/content.es.json', '--html-only'], ['stationery/export.mjs', 'pieces/stationery/letterhead/ais-vision-systems.html']]) {
    const r = run(...ok); assert([0, 75].includes(r.status), ok.join(' ') + r.stderr); assert(JSON.parse(r.stdout.split('\n')[0]).workload.units > 0);
  }
  for (const bad of [['figures/export.mjs', 'pieces/brochures/cables/cables.es.html'], ['print/render.mjs', 'pieces/brochures/cables/cables.es.html', '--look'], ['print/render.mjs', '/etc/hostname']]) assert.equal(run(...bad).status, 2, bad.join(' '));
});
