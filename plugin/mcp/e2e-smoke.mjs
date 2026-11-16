// End-to-end acceptance per piece type through the official MCP client. Finite; renders one at a time.
//   node mcp/media-smoke.mjs --e2e
// Scratch sources live in work/_e2e-<pid>/ (removed at the end), job outputs and the report in ~/.cache/ais-group-design/e2e-<pid>/.
// Deliverables are only read. For each type: route -> canonical generator, copy (pin) a small test piece, export HTML and
// PDF (+PNG/PPTX), confirm the shared template/pattern files are the canonical ones (path + sha256), compare one page or
// slide at 100 % with the reference's own preview, and confirm the checks fire (low-ppi cover, "30.000").
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DOC_KINDS, documentCommand, documentOutputs } from './documents.mjs';
import { preparePrint } from './print.mjs';
import { STUDIO } from '../engine/recipe.mjs';
import { pythonPath } from '../scripts/setup.mjs';

// One folder per run, so two runs at once never share (and delete) each other's scratch.
const RUN = 'e2e-' + process.pid, REL = 'work/_' + RUN;
const OUT = path.join(os.homedir(), '.cache/ais-group-design', RUN), SCRATCH = path.join(STUDIO, REL);
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'diff'), { recursive: true });
fs.rmSync(SCRATCH, { recursive: true, force: true }); fs.mkdirSync(SCRATCH, { recursive: true });
const sha = (p) => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rel = (p) => path.relative(STUDIO, p);
const matrix = [];
const row = (type, check, ok, detail = '') => { matrix.push({ type, check, ok: !!ok, detail: String(detail).slice(0, 400) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${type.padEnd(16)} ${check}${detail ? ': ' + String(detail).slice(0, 160) : ''}`); };

// A scratch copy of a v2 piece at the same depth, so its ../../shared/ links and assets/ resolve to the canonical files.
fs.symlinkSync('../../print', path.join(SCRATCH, 'shared'));
function v2Copy(folder, file, name, edit = (s) => s) {
  const dir = path.join(SCRATCH, 'v2', name); fs.mkdirSync(dir, { recursive: true });
  fs.symlinkSync(path.join(STUDIO, 'pieces/brochures', folder, 'assets'), path.join(dir, 'assets'));
  fs.writeFileSync(path.join(dir, file), edit(fs.readFileSync(path.join(STUDIO, 'pieces/brochures', folder, file), 'utf8')));
  return rel(path.join(dir, file));
}
// Pixel comparison at 100 %: share of pixels differing by more than 24 levels in any channel, plus a diff image.
function compare(type, ours, ref, limit = 0.005) {
  if (!ours || !fs.existsSync(ours) || !fs.existsSync(ref)) return row(type, 'page at 100 % vs reference', false, `missing ${ours} or ${ref}`);
  const r = spawnSync(pythonPath(), ['-I', '-c', `import sys
from PIL import Image, ImageChops
a=Image.open(sys.argv[1]).convert('RGB');b=Image.open(sys.argv[2]).convert('RGB')
if a.size!=b.size: print('size',a.size,b.size);sys.exit(0)
d=ImageChops.difference(a,b).convert('L').point(lambda v:255 if v>24 else 0)
print(sum(1 for v in d.getdata() if v)/(a.size[0]*a.size[1]));d.save(sys.argv[3])`, ours, ref, path.join(OUT, 'diff', type.replace(/\W+/g, '-') + '.png')], { encoding: 'utf8' });
  const v = r.stdout.trim();
  row(type, 'page at 100 % vs reference', /^[\d.e-]+$/.test(v) && Number(v) <= limit, `${(Number(v) * 100).toFixed(3)} % pixels differ (limit ${limit * 100} %), ${rel(ours)} vs ${rel(ref)}`);
}
// The reference for a template: the same recipe rendered by the generator directly, outside the MCP.
function reference(recipe, page) {
  const out = path.join(OUT, 'reference', path.basename(recipe, '.json'));
  spawnSync(process.execPath, [path.join(STUDIO, 'engine/render.mjs'), path.join(STUDIO, recipe), '--out', out], { cwd: STUDIO, encoding: 'utf8' });
  return (fs.existsSync(out) ? fs.readdirSync(out, { recursive: true }) : []).map((f) => path.join(out, f)).find((f) => page.test(f)) || path.join(out, 'missing');
}
// The template files a generator uses must be the canonical ones.
function canonical(type, pinned, files) {
  const bad = files.filter((f) => !fs.existsSync(path.join(STUDIO, f)) || (pinned[f] && pinned[f] !== sha(path.join(STUDIO, f))));
  row(type, 'same template/pattern files (path + sha256)', !bad.length, files.map((f) => `${f} ${sha(path.join(STUDIO, f)).slice(0, 12)}${pinned[f] ? ' pinned=' + pinned[f].slice(0, 12) : ''}`).join('; ') + (bad.length ? ' MISMATCH ' + bad.join(',') : ''));
}
// The server hides evidence paths from clients (they cost tokens); the harness reads the piece's record in its state.
const pinnedOf = (piece) => { const d = JSON.parse(fs.readFileSync(path.join(state, 'pieces', piece.pieceId, 'dependencies.json'))); return Object.fromEntries((d.files || []).map((f) => [String(f.path).replace(/^deps\//, '').replace(REL + '/shared/', 'print/'), f.digest])); };

const state = path.join(OUT, 'state');
const transport = new StdioClientTransport({ command: process.execPath, args: [path.join(STUDIO, 'mcp/server.mjs')], cwd: STUDIO, env: { PATH: process.env.PATH, HOME: os.homedir(), AIS_MCP_STATE: state }, stderr: 'pipe' });
const client = new Client({ name: 'ais-e2e', version: '1.0.0' });
async function call(name, args) { const r = await client.callTool({ name, arguments: args }); const t = r.content[0].text; if (r.isError) throw Error(t); return JSON.parse(t); }
// When safe_render refuses (it refuses any Chromium export while a Blender job runs), run the exact command the MCP job
// runs, on a copy of the same pinned piece, under the studio's render lock (flock /tmp/ais-marketing-render.lock nice -n 15).
// The row says so: it proves the generator and the pinned files, not the MCP's resource admission.
function direct(pieceId, operation) {
  const dir = path.join(OUT, 'direct', pieceId + '-' + operation); fs.cpSync(path.join(state, 'pieces', pieceId), dir, { recursive: true });
  const p = path.join(dir, 'recipe.json'), raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  let cmd, outputs;
  if (DOC_KINDS.includes(raw.kind)) { cmd = documentCommand(raw, dir, operation); outputs = () => documentOutputs(raw, dir); }
  else if (raw.kind === 'technical-sheet') {
    const html = preparePrint(raw, dir), base = path.basename(html, '.html'), d = path.dirname(html);
    cmd = [path.join(STUDIO, 'print/render.mjs'), html];
    outputs = () => [...fs.readdirSync(d).filter((f) => f.startsWith(base) && /\.(pdf|html)$/.test(f)).map((f) => path.join(d, f)), ...(fs.existsSync(path.join(d, 'previews')) ? fs.readdirSync(path.join(d, 'previews')).filter((f) => f.startsWith(base)).sort().map((f) => path.join(d, 'previews', f)) : [])];
  } else {
    cmd = [path.join(STUDIO, 'engine/render.mjs'), p, '--only', operation === 'render-pdf' ? 'png,pdf' : 'png', '--formats', '4x5', '--out', path.join(dir, 'out')];
    outputs = () => fs.existsSync(path.join(dir, 'out')) ? fs.readdirSync(path.join(dir, 'out')).sort().map((f) => path.join(dir, 'out', f)) : [];
  }
  const r = spawnSync('flock', ['/tmp/ais-marketing-render.lock', 'nice', '-n', '15', process.execPath, ...cmd], { cwd: STUDIO, encoding: 'utf8', timeout: 600000 });
  return { state: r.status === 0 ? 'succeeded' : 'failed', reason: 'direct under flock (MCP export refused while Blender runs)', log: (r.stdout || '') + (r.stderr || ''), artifacts: outputs().map((f) => ({ uri: pathToFileURL(f).href })) };
}
// Finite: a refused export is retried E2E_ATTEMPTS times (default 2), 30 s apart, then run directly as above.
async function job(pieceId, operation) {
  for (let attempt = 0; attempt < Number(process.env.E2E_ATTEMPTS || 2); attempt++) {
    let j = await call('export_piece', { action: 'enqueue', pieceId, operation });
    const deadline = Date.now() + 400000;
    while (['queued', 'running'].includes(j.state)) { if (Date.now() > deadline) throw Error('deadline'); await new Promise((r) => setTimeout(r, 400)); j = await call('export_piece', { action: 'status', jobId: j.id }); }
    if (j.state !== 'blocked' && !/refused|lock busy|another export is running/.test(j.reason || '')) return j;
    console.log(`      ${pieceId} ${operation} blocked (${j.reason}); retrying in 30 s`); await new Promise((r) => setTimeout(r, 30000));
  }
  return direct(pieceId, operation);
}
const art = (j, re) => j.artifacts.map((a) => fileURLToPath(a.uri)).filter((p) => re.test(p));
async function routed(type, intent, key, cmd) {
  const r = await call('plan_piece', { intent }); row(type, 'route -> canonical generator', r.generator?.key === key && JSON.stringify(r.generator).includes(cmd), `${r.generator?.key}: ${r.generator?.pdf || r.generator?.png || r.generator?.html}`);
}
async function document(type, pieceId, source, refPage, oursPage, files, limit) {
  const piece = await call('edit_piece', { action: 'copy', pieceId, source }); row(type, 'copy + pin + template checks', piece.valid, piece.errors?.join('; ') || piece.generator);
  if (!piece.valid) return null;
  canonical(type, pinnedOf(piece), files);
  const h = await job(pieceId, 'render-html'); row(type, 'HTML', h.state === 'succeeded' && art(h, /\.html$/).length, h.reason);
  const p = await job(pieceId, 'render-pdf'); const pdf = art(p, /\.pdf$/);
  row(type, 'PDF (+PNG/PPTX) from the canonical generator', p.state === 'succeeded' && pdf.length, `${p.state}: ${p.reason}${p.state === 'succeeded' ? '' : ' ' + String(p.log || '').slice(-500).replace(/\s+/g, ' ')}; ${p.artifacts.map((a) => path.basename(fileURLToPath(a.uri))).join(', ')}`);
  if (p.state !== 'succeeded') console.log(p.log?.slice(-1500));
  compare(type, art(p, oursPage)[0], path.join(STUDIO, refPage), limit);
  return p;
}

try {
  await client.connect(transport);
  // 1 Machine brochure (reference hopper/hopper.es.html): the test piece changes the document title only.
  await routed('machine brochure', 'Rehaz el folleto de AIS Hopper', 'brochure', 'print/render.mjs');
  const brochure = v2Copy('hopper', 'hopper.es.html', 'hopper', (s) => s.replace(/<title>[^<]*<\/title>/, '<title>AIS Hopper | prueba e2e</title>'));
  await document('machine brochure', 'e2e-brochure', brochure, 'pieces/brochures/hopper/previews/hopper.es-2.png', /previews\/hopper\.es-2\.png$/, ['print/system.css', 'print/assets/hex-printed-cover.svg', 'print/assets/hex-printed-close.svg', 'print/assets/icons.js']);

  // 2 Sector catalogue (reference catalogue-pharma/catalogue.es.html).
  await routed('sector catalogue', 'Catálogo farmacéutico', 'catalogue', 'print/render.mjs');
  const catalogue = v2Copy('catalogue-pharma', 'catalogue.es.html', 'catalogue-pharma', (s) => s.replace(/<title>[^<]*<\/title>/, '<title>Catálogo farmacéutico | prueba e2e</title>'));
  await document('sector catalogue', 'e2e-catalogue', catalogue, 'pieces/brochures/catalogue-pharma/previews/catalogue.es-02.png', /previews\/catalogue\.es-02\.png$/, ['print/system.css', 'print/assets/hex-printed-cover.svg', 'print/assets/icons.js']);

  // 3 Datasheet: the registered family binder (data.json#hopper -> print/render.mjs), the page 3 lead rewritten by the client.
  // (Cables is not used: its registered cover fails the cover rule, 108 ppi and a video frame; see the report.)
  await routed('datasheet', 'Ficha técnica de AIS Hopper', 'datasheet', 'mcp:pin');
  const hopperLead = JSON.parse(fs.readFileSync(path.join(STUDIO, 'datasheets/data.json'), 'utf8')).hopper.lead;
  try {
    let ds = await call('edit_piece', { action: 'copy', pieceId: 'e2e-datasheet', source: 'datasheets/data.json#hopper' });
    ds = await call('edit_piece', { action: 'update', pieceId: 'e2e-datasheet', expectedDigest: ds.digest, printChanges: [{ op: 'text', field: 'lead', value: hopperLead.replace(/\.$/, '') + ', según la línea.' }] });
    row('datasheet', 'copy + typed edit + validate', ds.valid, ds.errors?.join('; '));
    canonical('datasheet', pinnedOf(ds), ['print/system.css', 'print/assets/hex-printed-cover.svg', 'print/assets/hex-printed-close.svg', 'pieces/datasheets/hopper/hopper.es.html']);
    const p = await job('e2e-datasheet', 'render-pdf');
    row('datasheet', 'PDF + 4 page PNGs from print/render.mjs', p.state === 'succeeded' && art(p, /\.pdf$/).length && art(p, /-\d\.png$/).length === 4, `${p.state}: ${p.reason}`);
    if (p.state !== 'succeeded') console.log(p.log?.slice(-1500));
    compare('datasheet', art(p, /-1\.png$/)[0], 'pieces/datasheets/hopper/previews/hopper.es-1.png');
  } catch (e) { row('datasheet', 'family binder', false, e.message); }

  // 4 Deck section: the wine deck's cover plus the reusable Hopper machine section, through decks/build.mjs ("Hoy + azul").
  await routed('deck section', 'A deck section on AIS Hopper for the corporate presentation', 'deck', 'build.mjs');
  const wine = JSON.parse(fs.readFileSync(path.join(STUDIO, 'pieces/decks/wine/content.es.json'), 'utf8'));
  fs.mkdirSync(path.join(SCRATCH, 'deck'));
  fs.writeFileSync(path.join(SCRATCH, 'deck/content.es.json'), JSON.stringify({ meta: { ...wine.meta, file: 'e2e-section' }, slides: [wine.slides[0], { include: '../../../decks/sections/hopper.es.json' }] }, null, 2));
  // The reference: the same content built by decks/build.mjs directly, outside the MCP.
  spawnSync('flock', ['/tmp/ais-marketing-render.lock', process.execPath, 'decks/build.mjs', `${REL}/deck/content.es.json`], { cwd: STUDIO, encoding: 'utf8', timeout: 300000 });
  const deck = await document('deck section', 'e2e-deck', `${REL}/deck/content.es.json`, `${REL}/deck/slides/01.png`, /slides\/01\.png$/, ['decks/layouts.css', 'decks/layouts.mjs', 'decks/runtime/base.css', 'decks/assets/hex-deck-tr.svg']);
  if (deck) {
    const pptx = art(deck, /\.pptx$/)[0];
    row('deck section', 'PPTX written, clean metadata', pptx && !/python-pptx|Steve Canny/.test(spawnSync('unzip', ['-p', pptx, 'docProps/core.xml', 'docProps/app.xml'], { encoding: 'utf8' }).stdout), pptx ? rel(pptx) : 'no pptx');
  }

  // 5 Single post (templates/post-news.json): caption copy edited, the image must match the template's render.
  await routed('single post', 'LinkedIn post about AIS news', 'post', 'engine/render.mjs');
  let post = await call('edit_piece', { action: 'copy', pieceId: 'e2e-post', source: 'templates/post-news.json' });
  const bad = await call('edit_piece', { action: 'update', pieceId: 'e2e-post', shot: 0, expectedDigest: post.digest, changes: [{ field: 'headline', value: 'Hasta 30.000 unidades por hora' }] });
  row('single post', 'check fires: "30.000" refused by engine/copy.mjs', bad.updated === false && bad.errors.some((e) => /thousands/.test(e)), bad.errors?.find((e) => /thousands/.test(e)));
  post = await call('edit_piece', { action: 'update', pieceId: 'e2e-post', shot: 0, expectedDigest: post.digest, changes: [{ field: 'copy', value: post.copy || 'Prueba e2e. Solicita una demo' }] });
  row('single post', 'copy + validate', post.valid, post.errors?.join('; '));
  canonical('single post', {}, ['engine/stage.html', 'engine/render.mjs', 'engine/recipe.mjs', 'engine/copy.mjs']);
  const pp = await job('e2e-post', 'render-png');
  row('single post', 'PNG from engine/render.mjs', pp.state === 'succeeded' && art(pp, /\.png$/).length, `${pp.state}: ${pp.reason}`);
  compare('single post', art(pp, /4x5\.png$/)[0], reference('templates/post-news.json', /4x5\.png$/));

  // 6 Carousel (templates/carousel-defects.json): PDF + slide PNGs.
  await routed('carousel', 'Carrusel de defectos de zumo', 'carousel', 'engine/render.mjs');
  const car = await call('edit_piece', { action: 'copy', pieceId: 'e2e-carousel', source: 'templates/carousel-defects.json' });
  row('carousel', 'copy + validate', car.valid, car.errors?.join('; '));
  const cj = await job('e2e-carousel', 'render-pdf');
  row('carousel', 'PDF + slide PNGs from engine/render.mjs', cj.state === 'succeeded' && art(cj, /\.pdf$/).length && art(cj, /_\d\d\.png$/).length >= 3, `${cj.state}: ${cj.reason} ${String(cj.log || '').slice(-500).replace(/\s+/g, ' ')}`);
  compare('carousel', art(cj, /_02\.png$/)[0], reference('templates/carousel-defects.json', /_02\.png$/));

  // 7-8 Business card and letterhead: the kit build into a KIT_ROOT scratch folder, exported by export.mjs.
  const kit = spawnSync(pythonPath(), [path.join(STUDIO, 'stationery/build.py')], { env: { ...process.env, KIT_ROOT: path.join(SCRATCH, 'kit') }, encoding: 'utf8' });
  row('business card', 'kit build.py (KIT_ROOT scratch)', kit.status === 0, (kit.stdout + kit.stderr).trim());
  for (const [type, intent, key, src, ref] of [['business card', 'Tarjeta de visita para Laura', 'business-card', 'business-cards/laura-martin.html', 'pieces/stationery/business-cards/laura-martin-1.png'],
    ['letterhead', 'Letterhead for AIS Vision Systems', 'letterhead', 'letterhead/ais-vision-systems.html', 'pieces/stationery/letterhead/ais-vision-systems-1.png']]) {
    await routed(type, intent, key, 'export.mjs');
    row(type, 'same HTML as the delivered kit', sha(path.join(SCRATCH, 'kit', src)) === sha(path.join(STUDIO, 'pieces/stationery', src)), src);
    await document(type, 'e2e-' + key, `${REL}/kit/` + src, ref, /-1\.png$/, ['print/pattern.py', 'pieces/stationery/assets/hex-card.svg', 'pieces/stationery/assets/hex-card-bleed.svg', 'pieces/stationery/assets/hex-letter.svg']);
  }

  // Checks fire. (a) Low-ppi cover: the Hopper brochure with its cover photo at a quarter of its size.
  const hop = fs.readFileSync(path.join(STUDIO, 'pieces/brochures/hopper/hopper.es.html'), 'utf8');
  const hero = hop.match(/<figure class="hero"[^>]*><img src="assets\/([^"]+)"/)[1];
  const low = v2Copy('hopper', 'hopper.es.html', 'lowppi', (s) => s.replace(`src="assets/${hero}"`, 'src="cover-small.jpg"'));
  spawnSync(pythonPath(), ['-I', '-c', 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGB");im.resize((im.width//4,im.height//4)).save(sys.argv[2],quality=90)', path.join(STUDIO, 'pieces/brochures/hopper/assets', hero), path.join(STUDIO, path.dirname(low), 'cover-small.jpg')]);
  const lp = await call('edit_piece', { action: 'copy', pieceId: 'e2e-lowppi', source: low });
  const lj = await job('e2e-lowppi', 'render-pdf');
  row('checks', 'print/render.mjs fails a cover under 240 ppi', lj.state === 'failed' && /covers need 240 ppi/.test(lj.log || ''), (lj.log || '').split('\n').find((l) => /ppi; covers/.test(l)) || lj.reason);
  // (b) "30.000" in a Spanish print piece: MCP validation and print/render.mjs both refuse it.
  const num = v2Copy('hopper', 'hopper.es.html', 'number', (s) => s.replace('</h2>', ' hasta 30.000 unidades/hora</h2>'));
  const np = await call('edit_piece', { action: 'copy', pieceId: 'e2e-number', source: num });
  row('checks', 'MCP validate refuses "30.000" in print HTML', !np.valid && np.errors.some((e) => /thousands/.test(e)), np.errors?.[0]);
  const nr = spawnSync('flock', ['/tmp/ais-marketing-render.lock', 'nice', '-n', '15', process.execPath, 'print/render.mjs', num], { cwd: STUDIO, encoding: 'utf8', timeout: 300000 });
  row('checks', 'print/render.mjs fails "30.000"', nr.status !== 0 && /point for thousands.*: 30\.000 in/.test(nr.stdout), (nr.stdout.split('\n').find((l) => /thousands/.test(l)) || nr.stdout.slice(-200)).trim());
  for (const f of fs.readdirSync(path.join(STUDIO, path.dirname(num)))) if (/\.pdf$/.test(f)) fs.rmSync(path.join(STUDIO, path.dirname(num), f));
  // (c) "30.000" in a deck: refused by the MCP and by build.mjs before any output (no Chromium).
  fs.mkdirSync(path.join(SCRATCH, 'deck-number'));
  fs.writeFileSync(path.join(SCRATCH, 'deck-number/content.es.json'), JSON.stringify({ meta: { lang: 'es', title: 'Prueba', footer: 'Prueba', file: 'e2e-numero' }, slides: [{ layout: 'statement', eyebrow: 'AIS Hopper', title: 'Hasta 30.000 unidades por hora' }] }));
  const dn = await call('edit_piece', { action: 'copy', pieceId: 'e2e-deck-number', source: `${REL}/deck-number/content.es.json` });
  row('checks', 'MCP validate refuses "30.000" in a deck', !dn.valid && dn.errors.some((e) => /thousands/.test(e)), dn.errors?.[0]);
  const db = spawnSync(process.execPath, ['decks/build.mjs', `${REL}/deck-number/content.es.json`, '--html-only'], { cwd: STUDIO, encoding: 'utf8' });
  row('checks', 'build.mjs fails "30.000" before writing HTML', db.status === 1 && /30\.000/.test(db.stderr) && !fs.existsSync(path.join(SCRATCH, 'deck-number/e2e-numero.html')), db.stderr.split('\n')[1]);
} catch (e) { row('harness', 'run to completion', false, e.message); } finally {
  await client.close();
  fs.rmSync(SCRATCH, { recursive: true, force: true });
  const failed = matrix.filter((m) => !m.ok);
  fs.writeFileSync(path.join(OUT, 'matrix.json'), JSON.stringify({ when: new Date().toISOString(), state, matrix }, null, 2));
  fs.writeFileSync(path.join(OUT, 'RESULTS.md'), '# End-to-end results\n\n| Type | Check | Result | Detail |\n| --- | --- | --- | --- |\n' + matrix.map((m) => `| ${m.type} | ${m.check} | ${m.ok ? 'pass' : 'FAIL'} | ${m.detail.replace(/\|/g, '/')} |`).join('\n') + '\n');
  console.log(`\n${matrix.length - failed.length}/${matrix.length} passed. Report: ${path.join(OUT, 'RESULTS.md')}`);
  if (failed.length) process.exitCode = 1;
}
