// Copies the marketing kit into the guide: public/kit/files/ gets every publishable file (PDF, PPTX, post PNG
// and its text) and a cover thumbnail of each, and src/data/kit.json lists them for the Marketing kit and Social media pages.
//   npm run kit     (the marketing kit from ../marketing-kit, after npm run kit:pull at the repo root; KIT=<folder> for another)
// The kit's files are named for people: the piece's title as the guide names it (the title on the cover; type and
// sector where the cover title is a sentence) and the language code, e.g. "Wine catalogue ES.pdf", "01 AIS Hopper EN.png".
// The site's copies are named for machines (brochure-hopper.pdf, linkedin-hopper-es.png); kit.json keeps each piece's
// human name, which the pages use as the download name.
// Needs pdftoppm, pdfinfo, ImageMagick and, for the Office thumbnails, LibreOffice. Business cards are never copied: the
// kit's cards carry real people's numbers. Files over 16 MB are left out and reported.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.resolve(process.env.KIT || path.join(ROOT, '../marketing-kit'));
if (!fs.existsSync(KIT)) { console.error(`No marketing kit at ${KIT}: run npm run kit:pull at the repo root, or set KIT.`); process.exit(1); }
const OUT = path.join(ROOT, 'public/kit/files');
const DATA = path.join(ROOT, 'src/data/kit.json');
const MAX = 16 * 1024 * 1024, WIDTH = 600;
if (!fs.existsSync(KIT)) { console.error(`No marketing kit at ${KIT}`); process.exit(1); }

const run = (cmd, args) => execFileSync('nice', ['-n', '15', cmd, ...args], { encoding: 'utf8' }).trim();
const tmp = fs.mkdtempSync(path.join(os.homedir(), '.cache', 'gdm-kit-'));
const skipped = [];

// A file goes in only if it exists and is small enough for the site; a file over the limit uses its lighter copy in the
// "Light copies" folder beside it when there is one (the decks' PDFs, made with ghostscript /printer).
function copy(src, name) {
  if (!fs.existsSync(src)) throw new Error(`Missing ${src}`);
  const web = path.join(path.dirname(src), 'Light copies', path.basename(src));
  if (fs.statSync(src).size > MAX && fs.existsSync(web)) src = web;
  const size = fs.statSync(src).size;
  if (size > MAX) { skipped.push(`${path.relative(KIT, src)} (${(size / 1048576).toFixed(1)} MB)`); return null; }
  fs.copyFileSync(src, path.join(OUT, name));
  return name;
}
const pages = (pdf) => Number(run('pdfinfo', [pdf]).match(/^Pages:\s+(\d+)/m)[1]);
function pdfThumb(pdf, name) {
  const base = path.join(tmp, name.replace(/\.jpg$/, ''));
  run('pdftoppm', ['-f', '1', '-l', '1', '-singlefile', '-jpeg', '-jpegopt', 'quality=85', '-scale-to-x', String(WIDTH), '-scale-to-y', '-1', pdf, base]);
  fs.copyFileSync(`${base}.jpg`, path.join(OUT, name));
  return name;
}
function imgThumb(src, name) {
  run('convert', [src, '-strip', '-resize', `${WIDTH}x`, '-quality', '85', path.join(OUT, name)]);
  return name;
}
// PowerPoint and Word files: their first page through LibreOffice.
function officeThumb(src, name) {
  run('soffice', [`-env:UserInstallation=file://${tmp}/lo`, '--headless', '--convert-to', 'pdf', '--outdir', tmp, src]);
  return pdfThumb(path.join(tmp, path.basename(src).replace(/\.[^.]+$/, '.pdf')), name);
}

// ponytail: overwrite in place, never wipe first: a crash mid-sync emptied the folder, and it also holds files
// this script doesn't make (brand intros, end cards). Remove a retired file by hand.
fs.mkdirSync(OUT, { recursive: true });
const items = [];

// Print: brochures, catalogues and datasheets, one PDF each.
const F = '1 Brochures and catalogues', D = '2 Datasheets', T = '3 Presentations', L = '4 LinkedIn posts', O = '5 Office kit';
const products = [['hopper', 'AIS Hopper'], ['kariko', 'AIS KARIKÓ'], ['rev360-cables', 'AIS REV 360 Cables'], ['rev360-compact', 'AIS REV 360 COMPACT Canning'],
  ['rev360-pharma', 'AIS REV 360 PHARMA'], ['rev360-standard', 'AIS REV 360 STANDARD']];
const print = [
  ...[['food', 'Food'], ['beverage', 'Beverage'], ['cosmetics', 'Cosmetics'], ['pharma', 'Pharmaceutical'], ['wine', 'Wine']]
    .map(([slug, sector]) => [`catalogue-${slug}`, `${F}/${sector} catalogue ES.pdf`]),
  ...[...products, ['vacuum', 'AIS Vacuum'], ['opticais', 'OPTICAIS'], ['rosepetal', 'Rosepetal']].map(([slug, name]) => [`brochure-${slug}`, `${F}/${name} ES.pdf`]),
  ...[...products, ['opticais', 'OPTICAIS']].map(([slug, name]) => [`datasheet-${slug}`, `${D}/${name} datasheet ES.pdf`]),
];
for (const [id, rel] of print) {
  const src = path.join(KIT, rel);
  items.push({ id, family: id.startsWith('datasheet') ? 'datasheet' : 'print', name: path.basename(rel, '.pdf'), pages: pages(src), thumb: pdfThumb(src, `${id}.jpg`), pdf: copy(src, `${id}.pdf`) });
}

// Sales documents: the proposal and the case study, one PDF each.
for (const [id, name] of [['sales-proposal', 'Technical and commercial proposal ES'], ['sales-case-study', 'Daymsa case study ES']]) {
  const src = path.join(KIT, '6 Sales documents', `${name}.pdf`);
  items.push({ id, family: 'sales', name, pages: pages(src), thumb: pdfThumb(src, `${id}.jpg`), pdf: copy(src, `${id}.pdf`) });
}

// Presentations: PDF and the editable PPTX.
for (const [id, name] of [['presentation-corporate-2026', 'Corporate presentation 2026 ES'], ['presentation-automotive', 'Automotive presentation ES'],
  ['presentation-beverage', 'Beverage presentation ES'], ['presentation-biscuits', 'Biscuits presentation ES'], ['presentation-canning', 'Canning presentation ES'],
  ['presentation-wine', 'Wine presentation ES']]) {
  const base = path.join(KIT, T, name);
  items.push({ id, family: 'deck', name, pages: pages(`${base}.pdf`), thumb: pdfThumb(`${base}.pdf`, `${id}.jpg`), pdf: copy(`${base}.pdf`, `${id}.pdf`), pptx: copy(`${base}.pptx`, `${id}.pptx`) });
}

// LinkedIn: each post's PNG and text, each carousel's PDF, slides and text, in Spanish and English. A folder is
// "NN Title" and holds "NN Title ES.png" (a carousel: "NN Title ES.pdf" and "NN Title ES 01.png"…) and "NN Title ES.txt".
// The site id comes from the kit order: the number and the piece's slug in pieces/posts of ais-group-design.
const slugs = { '01': 'hopper', '02': 'kariko', '03': 'rev360-standard', '04': 'rev360-compact', '05': 'rev360-cables', '06': 'rev360-pharma', '07': 'opticais',
  '09': 'rosepetal-software', '10': 'news-cluster', '11': 'recap-packaging-talks', '13': 'quote-rosepetal', '14': 'result-daymsa', '15': 'callout-code-legibility',
  '20': 'carousel-juice-hopper', '21': 'carousel-vials-pharma', '22': 'carousel-cans-reference', '23': 'carousel-muesli-reference', '24': 'carousel-guide-roi',
  '25': 'carousel-partner-v275', '26': 'features-kariko', '27': 'carousel-application-labels', '28': 'carousel-event-mwc', '29': 'carousel-product-hopper', '30': 'carousel-sector-canning' };
for (const dir of fs.readdirSync(path.join(KIT, L)).filter((d) => /^\d\d /.test(d)).sort()) {
  const folder = path.join(KIT, L, dir), files = fs.readdirSync(folder), n = dir.slice(0, 2);
  if (!slugs[n]) throw new Error(`No site id for ${dir}: add its number to slugs`);
  const carousel = files.includes(`${dir} ES.pdf`);
  const item = { id: `linkedin-${slugs[n]}`, family: carousel ? 'carousel' : 'post', langs: {} };
  for (const lang of ['es', 'en']) {
    const name = `${dir} ${lang.toUpperCase()}`, id = `${item.id}-${lang}`, out = { name };
    if (files.includes(`${name}.txt`)) out.text = copy(path.join(folder, `${name}.txt`), `${id}.txt`);
    if (carousel) {
      const slides = files.filter((f) => f.startsWith(`${name} `) && /\d\d\.png$/.test(f)).sort();
      out.slides = slides.map((s, k) => imgThumb(path.join(folder, s), `${id}-${k + 1}.jpg`));
      out.pdf = copy(path.join(folder, `${name}.pdf`), `${id}.pdf`);
    } else {
      out.thumb = imgThumb(path.join(folder, `${name}.png`), `${id}.jpg`);
      out.png = copy(path.join(folder, `${name}.png`), `${id}.png`);
    }
    item.langs[lang] = out;
  }
  items.push(item);
}

// LinkedIn banners: the company cover and the personal banner of each brand, in "4 LinkedIn posts/Banners". The PNG is its own
// thumbnail (a banner is light, and a 600 px copy would blur its words).
for (const [slug, brand] of [['ais-vision-systems', 'AIS Vision Systems'], ['ais-group', 'AIS Group'], ['rosepetal', 'Rosepetal']]) {
  for (const [kind, prefix] of [['company', 'Banner'], ['personal', 'Personal banner']]) {
    const name = `${prefix} ${brand} EN`, id = `banner-${kind}-${slug}`, png = copy(path.join(KIT, L, 'Banners', `${name}.png`), `${id}.png`);
    items.push({ id, family: 'banner', kind, brand, name, thumb: png, png });
  }
}

const letter = path.join(KIT, O, 'Letterhead/AIS Vision Systems letterhead ES.pdf');
items.push({ id: 'stationery-letterhead', family: 'office', name: 'AIS Vision Systems letterhead ES', pages: pages(letter), thumb: pdfThumb(letter, 'stationery-letterhead.jpg'), pdf: copy(letter, 'stationery-letterhead.pdf') });
items.push({ id: 'office-word', family: 'office', name: 'AIS Vision Systems letter ES', thumb: officeThumb(path.join(ROOT, 'public/kit/office/letter-ais-vision-systems.docx'), 'office-word.jpg'), file: '/kit/office/letter-ais-vision-systems.docx' });

items.push(...JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/patterns.json'), 'utf8')));
fs.writeFileSync(DATA, JSON.stringify(items, null, 1) + '\n');
fs.rmSync(tmp, { recursive: true, force: true });
const bytes = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`${items.length} pieces, ${fs.readdirSync(OUT).length} files, ${(bytes / 1048576).toFixed(1)} MB in public/kit/files.`);
if (skipped.length) console.log(`Too large for the site, not copied: ${skipped.join('; ')}.`);
