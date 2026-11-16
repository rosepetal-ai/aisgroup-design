// Pinned snapshots of the canonical document sources, so MCP jobs export exactly what the accepted templates produce:
//   print-html  any pieces/**/*.html (or a work/ scratch copy) on print/system.css (v2 brochures, catalogues, one-pagers, built datasheets) -> print/render.mjs
//   deck        pieces/decks/<deck>/content.<lang>.json (+ its section includes)        -> decks/build.mjs ("Hoy + azul")
//   kit         pieces/stationery/{business-cards,letterhead}/*.html                                  -> kit-2026/_build/export.mjs
// The generator registry is print-family.json "generators". The MCP never edits these sources: the client edits them with
// the skill, then copies (pins) and exports. HTML comes first (render-html); the PDF/PNG/PPTX only on request (render-pdf).
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { STUDIO } from '../engine/recipe.mjs';
import { bannedImage } from '../print/image-rules.mjs';
import { printFamily } from './print.mjs';
import { PYTHON } from './media.mjs';
import { pointThousands } from '../engine/copy.mjs';
import { LAYOUT_NAMES } from '../decks/layouts.mjs';
import { priceTables } from './slots.mjs';
// A case study names a customer: it exports only with the customer's written approval recorded (writing skill, Case study).
export const APPROVAL = /^Customer approval missing/;

export const generators = printFamily.generators;
export const DOC_KINDS = ['print-html', 'deck', 'kit'];
const sha = (b) => createHash('sha256').update(b).digest('hex');
const within = (p, r) => p === r || p.startsWith(r + path.sep);
// Rejected older systems: never a source, never a dependency.
const REJECTED = /(^|\/)(_final|marketing-kit-review-2026-10-28|figures)(\/|$)|(^|\/)public\/kit\//;

export function documentKind(source) {
  if (typeof source !== 'string') return null;
  // The delivered kit, or a KIT_ROOT build of it elsewhere under work/ (same build.py, same pattern assets).
  if (/^(?:pieces|work)\/(?:[A-Za-z0-9_.-]+\/)*(business-cards|letterhead)\/[a-z0-9-]+\.html$/.test(source)) return 'kit';
  // A deck folder anywhere under work/ (the decks live in pieces/decks/; a copy elsewhere uses the same build.mjs).
  if (/^(?:pieces|work)\/(?:[A-Za-z0-9_.-]+\/)+content\.[a-z]{2}\.json$/.test(source)) return 'deck';
  if (/^(?:pieces|work)\/[A-Za-z0-9_./-]+\.html$/.test(source)) return 'print-html';
  return null;
}

// Copy the entry and every local file it references (src/href/url(), section includes) under dir/deps/<path from studio>.
export function snapshotDocument(dir, source) {
  const kind = documentKind(source);
  if (!kind) throw Error('Unsupported document source: v2 print HTML, deck content.<lang>.json or kit stationery HTML');
  if (REJECTED.test(source)) throw Error('Rejected system: ' + source + ' (use the v2 print system, the deck template or the kit build)');
  const roots = ['pieces', 'work', 'print', 'decks', 'stationery', 'brand'].map((r) => path.join(STUDIO, r)).filter((r) => fs.existsSync(r)).map((r) => fs.realpathSync(r)); // work/ is absent in a fresh install
  const files = [];
  const copy = (abs) => {
    const real = fs.realpathSync(abs);
    if (!roots.some((r) => within(real, r))) throw Error('Document dependency outside the repo source folders (pieces, print, decks, stationery, brand): ' + path.relative(STUDIO, abs));
    const rel = path.relative(STUDIO, abs);
    if (REJECTED.test(rel)) throw Error('Rejected system dependency: ' + rel);
    if (files.some((f) => f.path === 'deps/' + rel)) return;
    const bytes = fs.readFileSync(real);
    if (bytes.length > 48 * 1024 * 1024) throw Error('Document dependency too large: ' + rel);
    files.push({ path: 'deps/' + rel, source: real, digest: sha(bytes), bytes: bytes.length });
    const target = path.join(dir, 'deps', rel);
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes);
    if (/\.(html|css)$/.test(abs)) {
      const text = bytes.toString();
      const refs = [...text.matchAll(/(?:src|href)="([^"#]+)"/g), ...text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map((m) => m[1]);
      for (const ref of refs) {
        if (/^(mailto:|tel:)/i.test(ref)) continue;
        if (/^(https?:|data:|file:|\/)/i.test(ref) || ref.includes('?')) throw Error('External document dependency: ' + ref);
        copy(path.resolve(path.dirname(abs), ref));
      }
    }
    if (kind === 'deck' && abs.endsWith('.json')) {
      const walk = (slides) => { for (const s of slides || []) if (s.include) copy(path.resolve(path.dirname(abs), s.include)); };
      walk(JSON.parse(bytes.toString()).slides);
    }
  };
  copy(path.join(STUDIO, source));
  const raw = { kind, name: path.basename(source).replace(/\.(html|json)$/, '').replace(/[^a-zA-Z0-9_-]/g, '-'), source, entry: 'deps/' + source,
    lang: (source.match(/\.([a-z]{2})\.(html|json)$/) || [])[1] || 'es', generator: { 'print-html': 'print/render.mjs', deck: 'decks/build.mjs', kit: 'stationery/export.mjs' }[kind] };
  fs.writeFileSync(path.join(dir, 'dependencies.json'), JSON.stringify({ source, files }, null, 2));
  return raw;
}

const stale = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'dependencies.json'))).files.filter((f) => sha(fs.readFileSync(path.join(dir, f.path))) !== f.digest).map((f) => f.path);
const same = (dir, snap, studioRel) => { const p = path.join(dir, 'deps', snap); return fs.existsSync(p) && sha(fs.readFileSync(p)) === sha(fs.readFileSync(path.join(STUDIO, studioRel))); };

// The piece is on the accepted template: same shared stylesheet/template, same pattern assets, no banned picture.
export function checkDocument(raw, dir) {
  const errors = [], warnings = [];
  try {
    const changed = stale(dir); if (changed.length) errors.push('Snapshot changed after copy: ' + changed.slice(0, 3).join(', '));
    const entry = path.join(dir, raw.entry), text = fs.readFileSync(entry, 'utf8');
    const deps = JSON.parse(fs.readFileSync(path.join(dir, 'dependencies.json'))).files;
    for (const f of deps) if (/\.(jpe?g|png|webp)$/i.test(f.path)) { const why = bannedImage(path.join(dir, f.path)); if (why) errors.push(why); }
    const pattern = spawnSync(PYTHON, ['-I', path.join(STUDIO, 'print/pattern.py'), '--assets', '--check'], { encoding: 'utf8', timeout: 20000 });
    if (pattern.status !== 0) errors.push('Hexagon assets differ from print/pattern.py: ' + (pattern.stdout || pattern.stderr).trim().slice(0, 300));
    // Spanish/Catalan numbers (guide, Localisation): 30 000, never 30.000; the generators fail it too.
    if (['es', 'ca'].includes(raw.lang)) {
      const words = raw.kind === 'deck' ? JSON.stringify(JSON.parse(text).slides, (k, v) => ['src', 'image', 'include', 'file', 'layout'].includes(k) ? undefined : v)
        : text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*\balt="([^"]*)"[^>]*>/g, ' $1 ').replace(/<[^>]+>/g, ' ');
      for (const n of pointThousands(words).slice(0, 3)) errors.push(`Spanish number with a point for thousands: ${n} (write 30 000 with a non-breaking space, 1285 without)`);
    }
    if (raw.kind === 'print-html') {
      const sheets = [...text.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"|<link[^>]+href="([^"]+)"[^>]*rel="stylesheet"/g)].map((m) => path.relative(path.join(dir, 'deps'), path.resolve(path.dirname(entry), m[1] || m[2])));
      const css = sheets.map((s) => fs.realpathSync(path.join(STUDIO, s)));
      // An upload has no symlinks: pieces/shared is a copy of print/ there, so an identical file counts as print/system.css.
      const system = path.join(fs.realpathSync(STUDIO), 'print/system.css');
      if (sheets.length !== 1 || (css[0] !== system && sha(fs.readFileSync(css[0])) !== sha(fs.readFileSync(system)))) errors.push('Print pieces use exactly one stylesheet, print/system.css (found: ' + (sheets.join(', ') || 'none') + ')');
      else if (!same(dir, sheets[0], 'print/system.css')) errors.push('Pinned system.css differs from print/system.css');
      if (/<style[\s>]/i.test(text)) errors.push('Print pieces carry no <style> block: change print/system.css instead');
      for (const m of text.matchAll(/<script[^>]+src="([^"]+)"/g)) if (!/assets\/icons\.js$/.test(m[1])) errors.push('Unexpected script: ' + m[1]);
      if (!/<section class="page\b/.test(text)) errors.push('No .page sections: not a print-system piece');
      for (const p of priceTables(text, raw.lang).problems) errors.push('Price table: ' + p);
      if (/<meta name="ais-document" content="case-study">/.test(text)) {
        const meta = (k) => (text.match(new RegExp(`<meta name="ais-${k}" content="([^"]*)">`)) || [])[1]?.trim();
        const by = meta('approved-by'), on = meta('approved-on');
        if (!by || !/^\d{4}-\d{2}-\d{2}$/.test(on || '') || on > new Date().toISOString().slice(0, 10))
          errors.push('Customer approval missing: a case study exports only after the customer approved the name, quote, figures and pictures in writing; set meta.approved_by (who) and meta.approved_on (YYYY-MM-DD)');
      }
      for (const hex of ['hex-printed-cover.svg', 'hex-printed-close.svg']) {
        const pinned = deps.find((f) => f.path.endsWith('/assets/' + hex));
        if (pinned && pinned.digest !== sha(fs.readFileSync(path.join(STUDIO, 'print/assets', hex)))) errors.push('Pinned ' + hex + ' differs from the print/pattern.py asset');
      }
    } else if (raw.kind === 'deck') {
      const deck = JSON.parse(text);
      if (!/^[a-z0-9_-]+$/i.test(deck.meta?.file || '')) errors.push('Deck meta.file must be a plain file name');
      if (!Array.isArray(deck.slides) || !deck.slides.length || deck.slides.length > 60) errors.push('Deck needs 1 to 60 slides');
      if (deck.slides?.[0]?.layout && !['cover', 'divider'].includes(deck.slides[0].layout) && !deck.slides[0].include) warnings.push('A whole deck opens with a cover; a section with a divider');
      // Every slide, in the deck and in its pinned sections, uses one of the engine's layouts.
      const expand = (slides, base) => (slides || []).flatMap((s) => s.include ? expand(JSON.parse(fs.readFileSync(path.resolve(base, s.include), 'utf8')).slides, path.dirname(path.resolve(base, s.include))) : [s]);
      expand(deck.slides, path.dirname(entry)).forEach((s, i) => { if (!LAYOUT_NAMES.includes(s.layout)) errors.push(`Slide ${i + 1}: unknown layout "${s.layout}" (layouts: ${LAYOUT_NAMES.join(', ')})`); });
    } else if (raw.kind === 'kit') {
      const hex = text.match(/url\(\.\.\/assets\/(hex-(card|card-bleed|letter)\.svg)\)/);
      if (!hex) errors.push('Stationery must use the pattern field (../assets/hex-card-bleed.svg, hex-card.svg or hex-letter.svg)');
      else if (!same(dir, path.join(path.dirname(path.dirname(raw.source)), 'assets', hex[1]), 'pieces/stationery/assets/' + hex[1])) errors.push('Pinned ' + hex[1] + ' differs from the print/pattern.py asset');
      if (!/class="(card|letter)\b/.test(text)) errors.push('No .card or .letter board: not kit stationery');
    }
  } catch (e) { errors.push(e.message); }
  warnings.push('Source checks only: the export checks layout, pictures and cover; open every page after it');
  return { valid: !errors.length, errors: errors.slice(0, 12), warnings, errorCount: errors.length, warningCount: warnings.length };
}

// The generator command for an exported job (paths inside the pinned job folder).
export function documentCommand(raw, dir, op) {
  const entry = path.join(dir, raw.entry);
  if (raw.kind === 'deck') return [path.join(STUDIO, 'decks/build.mjs'), entry, ...(op === 'render-html' ? ['--html-only'] : [])];
  if (op === 'render-html') return null; // print and kit HTML is the pinned source itself
  return raw.kind === 'kit' ? [path.join(STUDIO, 'stationery/export.mjs'), entry] : [path.join(STUDIO, 'print/render.mjs'), entry];
}

// Files the generator wrote for this piece: the HTML, PDF, PPTX and page/slide PNGs.
export function documentOutputs(raw, dir) {
  const entry = path.join(dir, raw.entry), folder = path.dirname(entry), out = [];
  let base = path.basename(entry, '.html');
  if (raw.kind === 'deck') base = JSON.parse(fs.readFileSync(entry, 'utf8')).meta.file;
  for (const f of fs.readdirSync(folder)) if (f.startsWith(base) && /\.(html|pdf|pptx|png)$/.test(f)) out.push(path.join(folder, f));
  for (const sub of raw.kind === 'deck' ? ['slides'] : raw.kind === 'print-html' ? ['previews'] : [])
    if (fs.existsSync(path.join(folder, sub))) for (const f of fs.readdirSync(path.join(folder, sub)).sort()) if (f.endsWith('.png') && (raw.kind === 'deck' || f.startsWith(base))) out.push(path.join(folder, sub, f));
  return out;
}
