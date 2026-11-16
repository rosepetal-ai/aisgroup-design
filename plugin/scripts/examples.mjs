#!/usr/bin/env node
// The marketing kit as clean HTML examples for the brand guide: writes <guide>/public/examples/<type>/<slug>/
// with index.html and only the files it uses, pictures as web copies (long side 1600 px at most), the print PDF
// next to it when it is under 10 MB, the shared CSS and fonts once in examples/shared/, and examples/index.json.
// Texts are copied as they are; only the paths change.
//   npm run examples
// AIS_GUIDE points at the guide (default: ../guide in this repo). The marketing kit comes from the private bucket
// (npm run kit:pull at the repo root, or KIT=<folder>). Needs ImageMagick (convert, identify).
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GUIDE = path.resolve(process.env.AIS_GUIDE || path.join(ROOT, '../guide'));
const OUT = path.join(GUIDE, 'public/examples');
const P = path.join(ROOT, 'pieces');
const DECKS = path.join(P, 'decks'); // decks/build.mjs writes each deck's HTML and media/ next to its content file
const MAX_PDF = 10 * 1024 * 1024, MAX_SIDE = 1600, KEEP_PNG = 150 * 1024;
const fail = (m) => { console.error(m); process.exit(1); };
const KIT = path.resolve(process.env.KIT || path.join(ROOT, '../marketing-kit')); // npm run kit:pull

// Files several pieces share go to examples/shared/<name>/ with their layout kept, so the CSS urls still work.
const SHARED = [[path.join(P, 'shared'), 'print'], [path.join(ROOT, 'print'), 'print'], [path.join(P, 'stationery'), 'stationery']];

const F = '1 Brochures and catalogues', D = '2 Datasheets', T = '3 Presentations', O = '5 Office kit';
const AVS = 'ais-vision-systems', RP = 'rosepetal';
// kit: the deck's name in the kit's Presentations folder (the guide's name and the language code).
const deck = (slug, dir, title, why, kit) => {
  const html = fs.readdirSync(path.join(DECKS, dir)).find((f) => /^ais-vision-systems_presentation-.*_es\.html$/.test(f));
  if (!html) fail(`No deck HTML in ${path.join(DECKS, dir)}: build it with node decks/build.mjs ${path.join('pieces/decks', dir)}/content.es.json`);
  return { type: 'presentation', slug, src: path.join(DECKS, dir, html), pdf: `${T}/${kit}.pdf`, title, brand: AVS, product: null, why };
};
// Every marketing-kit piece with an HTML source. Posts and carousels are not here: the engine composes them from
// recipes, with no HTML source of the final version.
const PIECES = [
  { type: 'catalogue', slug: 'food', src: 'brochures/catalogue-food/catalogue.es.html', pdf: `${F}/Food catalogue ES.pdf`, title: 'Food inspection catalogue', product: null,
    why: 'A sector catalogue that walks the line from sealing to code reading, one product per spread with its defects shown on real packs.' },
  { type: 'catalogue', slug: 'beverage', src: 'brochures/catalogue-beverage/catalogue.es.html', pdf: `${F}/Beverage catalogue ES.pdf`, title: 'Beverage inspection catalogue', product: null,
    why: 'Water, juice, wine and cava in one catalogue: inspection zones first, then each machine with defect tiles on the same container.' },
  { type: 'catalogue', slug: 'cosmetics', src: 'brochures/catalogue-cosmetics/catalogue.es.html', pdf: `${F}/Cosmetics catalogue ES.pdf`, title: 'Cosmetics inspection catalogue', product: null,
    why: 'Shows how one demo brand (pump bottle, tube, aerosol and jar) carries every defect, so the formats read as one family.' },
  { type: 'catalogue', slug: 'pharma', src: 'brochures/catalogue-pharma/catalogue.es.html', pdf: `${F}/Pharmaceutical catalogue ES.pdf`, title: 'Pharmaceutical inspection catalogue', product: null,
    why: 'The longest catalogue: vials, blisters, pouches and cartons, each format with the marking it checks and the machine that does it.' },
  { type: 'catalogue', slug: 'wine', src: 'brochures/catalogue-wine/catalogue.es.html', pdf: `${F}/Wine catalogue ES.pdf`, title: 'Wine inspection catalogue', product: null,
    why: 'A bottle-by-zone catalogue: closure and fill level, the label all round, then code reading and print verification.' },
  { type: 'brochure', slug: 'hopper', src: 'brochures/hopper/hopper.es.html', pdf: `${F}/AIS Hopper ES.pdf`, title: 'AIS Hopper brochure', product: 'AIS Hopper',
    why: 'The three-page machine brochure at its plainest: cover with three facts, the defects as a tile grid, then machine, software and contact.' },
  { type: 'brochure', slug: 'kariko', src: 'brochures/kariko/kariko.es.html', pdf: `${F}/AIS KARIKÓ ES.pdf`, title: 'AIS KARIKÓ brochure', product: 'AIS KARIKÓ',
    why: 'The cover shows the machine with trays on its conveyor, the product and the machine together as the brand asks.' },
  { type: 'brochure', slug: 'rev360-cables', src: 'brochures/cables/cables.es.html', pdf: `${F}/AIS REV 360 Cables ES.pdf`, title: 'AIS REV 360 Cables brochure', product: 'AIS REV 360 Cables',
    why: 'A short brochure for a non-packaging line: surface defects on cable and tube, cameras around the product, and a call for samples.' },
  { type: 'brochure', slug: 'rev360-compact', src: 'brochures/compact/compact.es.html', pdf: `${F}/AIS REV 360 COMPACT Canning ES.pdf`, title: 'AIS REV 360 COMPACT brochure for canning', product: 'AIS REV 360 COMPACT',
    why: 'The machine brochure adapted to one sector, canning, with the defects shown on the same can all round its perimeter.' },
  { type: 'brochure', slug: 'rev360-pharma', src: 'brochures/pharma/pharma.es.html', pdf: `${F}/AIS REV 360 PHARMA ES.pdf`, title: 'AIS REV 360 PHARMA brochure', product: 'AIS REV 360 PHARMA',
    why: 'Vial label inspection in three pages, with the machine size and materials stated plainly as the second-page headline.' },
  { type: 'brochure', slug: 'rev360-standard', src: 'brochures/standard/standard.es.html', pdf: `${F}/AIS REV 360 STANDARD ES.pdf`, title: 'AIS REV 360 STANDARD brochure', product: 'AIS REV 360 STANDARD',
    why: 'Thirteen label and finish checks laid out as an even tile grid, the densest page the brochure system allows.' },
  { type: 'brochure', slug: 'vacuum', src: 'brochures/vacuum/vacuum.es.html', pdf: `${F}/AIS Vacuum ES.pdf`, title: 'AIS Vacuum brochure', product: 'AIS Vacuum',
    why: 'One measurement, the shape of the lid, told with jars leaving the machine and the software that records each one.' },
  { type: 'brochure', slug: 'opticais', src: 'brochures/opticais/opticais.es.html', pdf: `${F}/OPTICAIS ES.pdf`, title: 'OPTICAIS brochure', product: 'OPTICAIS',
    why: 'Code reading and print verification: a row of cartons on the cover, one uncoded, and each marking checked against the recipe.' },
  { type: 'brochure', slug: 'rosepetal', src: 'brochures/rosepetal/brochure.es.html', pdf: `${F}/Rosepetal ES.pdf`, title: 'Rosepetal software brochure', brand: RP, product: 'Rosepetal',
    why: 'The Rosepetal brochure: a software product told with real screens, from annotation to a trained model, in the Rosepetal identity.' },
  ...[['hopper', 'AIS Hopper'], ['kariko', 'AIS KARIKÓ'], ['rev360-cables', 'AIS REV 360 Cables', 'cables'], ['rev360-compact', 'AIS REV 360 COMPACT Canning', 'compact', 'AIS REV 360 COMPACT'],
    ['rev360-pharma', 'AIS REV 360 PHARMA', 'pharma'], ['rev360-standard', 'AIS REV 360 STANDARD', 'standard'], ['opticais', 'OPTICAIS']].map(([slug, name, dir = slug, product = name]) => ({
    type: 'datasheet', slug, src: `datasheets/${dir}/${dir}.es.html`, pdf: `${D}/${name} datasheet ES.pdf`, title: `${product} datasheet`, product,
    why: `Four A4 pages for ${product}: what it inspects, the specification tables, software and integration, and a call for samples.` })),
  deck('corporate-2026', 'corporate-2026', 'General presentation 2026', 'The company deck: group, team, way of working, references and products, with divider slides between the five parts.', 'Corporate presentation 2026 ES'),
  deck('automotive', 'automotive', 'Automotive sector presentation', 'A sector deck built on the same slide layouts as the general one, with automotive cases and parts.', 'Automotive presentation ES'),
  deck('beverage', 'beverage', 'Beverage sector presentation', 'The longest sector deck: each machine for bottles and cans, its defects and the customers who use it.', 'Beverage presentation ES'),
  deck('biscuits', 'biscuits', 'Biscuit lines presentation', 'A short sector deck of twelve slides: the problem, the inspection and the result on biscuit lines.', 'Biscuits presentation ES'),
  deck('canning', 'canning', 'Canning sector presentation', 'A sector deck for canning: seams, labels and codes, with photos from customer lines.', 'Canning presentation ES'),
  deck('wine', 'wine', 'Wine inspection presentation', 'A twelve-slide deck for wineries: closure, fill level, label and code, one zone of the bottle at a time.', 'Wine presentation ES'),
  { type: 'stationery', slug: 'letterhead', src: 'stationery/letterhead/ais-vision-systems.html', pdf: `${O}/Letterhead/AIS Vision Systems letterhead ES.pdf`, title: 'AIS Vision Systems letterhead', product: null,
    why: 'A4 letterhead: the logo top left, the hexagon field in one corner and the company details in three blocks at the foot.' }
];
// In the kit but not published: the business cards.
const SKIPPED = ['stationery/business-cards (templates with demo contacts)', 'LinkedIn posts and carousels (no HTML source of the final version)'];

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' }).trim();
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const rel = (from, to) => path.relative(path.dirname(from), to).split(path.sep).join('/');
const written = new Map(); // destination -> source hash, so two different files never land on one name
const converted = new Map(); // source -> destination

// A web copy: pictures over 1600 px or heavier than a small PNG become WebP q85; metadata goes either way.
function place(src, dest) {
  if (converted.has(src + '\0' + dest)) return converted.get(src + '\0' + dest);
  if (/guion-de-marca|Presupuesto/i.test(src)) fail(`Internal file referenced: ${src}`);
  const ext = path.extname(src).toLowerCase();
  let out = dest;
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    const [w, h] = run('identify', ['-format', '%w %h\n', src]).split('\n')[0].split(' ').map(Number);
    const keep = ext === '.png' && fs.statSync(src).size <= KEEP_PNG && Math.max(w, h) <= MAX_SIDE;
    out = keep ? dest : dest.replace(/\.[^.]+$/, '.webp');
    claim(out, src);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    if (!fs.existsSync(out)) run('convert', [src, '-auto-orient', '-strip', ...(keep ? [] : ['-resize', `${MAX_SIDE}x${MAX_SIDE}>`, '-quality', '85', '-define', 'webp:method=6']), out]);
  } else {
    claim(out, src);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    if (ext === '.css') fs.writeFileSync(out, relinkCss(fs.readFileSync(src, 'utf8'), src, out));
    else fs.copyFileSync(src, out);
  }
  converted.set(src + '\0' + dest, out);
  return out;
}
function claim(out, src) {
  const h = hash(src);
  if (written.has(out) && written.get(out) !== h) fail(`Two different files for ${out}`);
  written.set(out, h);
}

// Where a referenced file goes: next to the page if it sits in the piece's folder, else in examples/shared/.
function destination(file, pieceDir, folder) {
  if (file.startsWith(pieceDir + path.sep)) return path.join(folder, path.relative(pieceDir, file));
  const hit = SHARED.find(([dir]) => file.startsWith(dir + path.sep));
  if (!hit) fail(`No home for ${file}`);
  return path.join(OUT, 'shared', hit[1], path.relative(hit[0], file));
}

const LOCAL = (u) => u && !/^(#|data:|https?:|mailto:|tel:|\/\/|javascript:)/i.test(u);
const target = (u, base) => { const f = path.resolve(path.dirname(base), decodeURI(u.split(/[?#]/)[0])); if (!fs.existsSync(f)) fail(`Missing ${u} in ${base}`); return f; };
function relinkCss(css, src, out) {
  const swap = (u) => { const f = target(u, src); return rel(out, place(f, destination(f, path.dirname(src), path.dirname(out)))); };
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => LOCAL(u) ? `url(${q}${swap(u)}${q})` : m);
}
// HTML comments are left alone (the email signature's notes quote src="…" as text).
function relinkHtml(html, src, pieceDir, folder) {
  const index = path.join(folder, 'index.html');
  const swap = (u) => { if (!LOCAL(u)) return u; const f = target(u, src); return rel(index, place(f, destination(f, pieceDir, folder))); };
  return html.split(/(<!--[\s\S]*?-->)/).map((part, i) => i % 2 ? part : part
    .replace(/\b(src|href|poster)=(["'])([^"']*)\2/gi, (m, a, q, u) => `${a}=${q}${swap(u)}${q}`)
    .replace(/\bsrcset=(["'])([^"']*)\1/gi, (m, q, v) => `srcset=${q}${v.split(',').map((s) => { const [u, ...d] = s.trim().split(/\s+/); return [swap(u), ...d].join(' '); }).join(', ')}${q}`)
    .replace(/url\(\s*(&quot;|['"]?)([^'")&]+)\1\s*\)/g, (m, q, u) => LOCAL(u) ? `url(${q}${swap(u)}${q})` : m)).join('');
}

// Start clean; an earlier examples folder is backed up first.
if (!fs.existsSync(KIT)) fail(`No marketing kit at ${KIT}`);
if (fs.existsSync(OUT)) {
  const backup = path.join(os.homedir(), '.cache/ais-group-design/backups', `examples-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  fs.cpSync(OUT, backup, { recursive: true });
  fs.rmSync(OUT, { recursive: true });
  console.log(`Previous examples backed up to ${backup}`);
}

const entries = [];
for (const p of PIECES) {
  const src = path.isAbsolute(p.src) ? p.src : path.join(P, p.src);
  if (!fs.existsSync(src)) fail(`No source ${src}`);
  const folder = path.join(OUT, p.type, p.slug);
  const html = relinkHtml(fs.readFileSync(src, 'utf8'), src, path.dirname(src), folder);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'index.html'), html);
  const id = `${p.type}-${p.slug}`, url = `/examples/${p.type}/${p.slug}/`;
  let pdf;
  if (p.pdf) {
    const file = path.join(KIT, p.pdf);
    if (!fs.existsSync(file)) fail(`No PDF ${file}`);
    if (fs.statSync(file).size <= MAX_PDF) { fs.copyFileSync(file, path.join(folder, `${id}-es.pdf`)); pdf = `${url}${id}-es.pdf`; }
  }
  entries.push({ id, type: p.type, title: p.title, brand: p.brand ?? AVS, product: p.product, lang: 'es', html: url, ...(pdf && { pdf }), why: p.why });
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(entries, null, 1) + '\n');

// Clean means: nothing pointing at this machine, no logs, backups or review leftovers.
const files = fs.readdirSync(OUT, { recursive: true }).map((f) => path.join(OUT, f)).filter((f) => fs.statSync(f).isFile());
for (const f of files) {
  if (/\.(log|bak[^/]*|py|mjs|md)$|review|previews|\/build\//i.test(path.relative(OUT, f))) fail(`Leftover ${f}`);
  if (/\.(html|css|svg|js|json)$/.test(f) && /\/home\/|file:\/\/|\/Users\//.test(fs.readFileSync(f, 'utf8'))) fail(`Local path in ${f}`);
}
const bytes = files.reduce((n, f) => n + fs.statSync(f).size, 0);
const count = (t) => entries.filter((e) => e.type === t).length;
console.log(`${entries.length} examples (${['catalogue', 'brochure', 'datasheet', 'presentation', 'stationery'].map((t) => `${count(t)} ${t}`).join(', ')}), ${entries.filter((e) => e.pdf).length} with PDF, ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB in ${OUT}`);
console.log(`Not published: ${SKIPPED.join('; ')}.`);
