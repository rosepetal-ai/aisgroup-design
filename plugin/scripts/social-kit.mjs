// Re-renders the whole LinkedIn kit (every post and carousel in pieces/posts, ES and EN) in one go, so new product
// renders in the library (same paths) reach every piece:
//   1. pieces/posts/_build/assets.py rebuilds the marked pictures (chips, pairs) from library/media/3d/renders;
//   2. engine/render.mjs renders each piece into out/social/<piece>/ and runs every check;
//   3. one contact sheet per language, out/social/_sheet_es.png and _sheet_en.png (each piece's first slide);
//   4. with --kit <folder>, the finished files are copied to <folder>/<NN Title>/ under the kit's names (KIT_NAMES):
//      "01 AIS Hopper ES.png" and its text "01 AIS Hopper ES.txt"; a carousel "20 Carrusel zumo AIS Hopper ES.pdf" and
//      its slides "… ES 01.png"; each piece's folder is emptied first; nothing is copied when a check fails;
//   5. with --before <old kit folder> --pairs <folder>, before and after pairs for the guide's Social media page
//      (pieces/posts/_build/pairs.py: the old file beside the new one, same size).
//
//   flock /tmp/ais-marketing-render.lock nice -n 15 node scripts/social-kit.mjs [--kit <folder>] [--no-assets] [--only 20,21]
//     [--before <old kit folder> --pairs <folder>]
//
// Pieces that are not finished stay out of the kit (Social media: show only finished work); see SKIP.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = path.join(ROOT, 'pieces/posts'), OUT = path.join(ROOT, 'out/social');
const SKIP = {
  '12-event-enomaq-blocked': 'ENOMAQ 2027 attendance is not confirmed: the stand, hall and dates are placeholders',
  '24-carousel-guide-roi': 'no real line or counters to show yet: a text-only carousel outside the one post system',
};
// The kit's folder for each piece: its number and the subject people know it by, in Spanish (the guide's Marketing kit).
const KIT_NAMES = {
  '01-hopper': '01 AIS Hopper', '02-kariko': '02 AIS KARIKÓ', '03-rev360-standard': '03 AIS REV 360 STANDARD', '04-rev360-compact': '04 AIS REV 360 COMPACT',
  '05-rev360-cables': '05 AIS REV 360 Cables', '06-rev360-pharma': '06 AIS REV 360 PHARMA', '07-opticais': '07 OPTICAIS',
  '09-rosepetal-software': '09 Rosepetal en una panadería', '10-news-cluster': '10 Packaging Cluster', '11-recap-packaging-talks': '11 Packaging Talks 2026',
  '13-quote-rosepetal': '13 José Racionero', '14-result-daymsa': '14 Daymsa', '15-callout-code-legibility': '15 Lote y fecha',
  '20-carousel-juice-hopper': '20 Carrusel zumo AIS Hopper', '21-carousel-vials-pharma': '21 Carrusel viales AIS REV 360 PHARMA',
  '22-carousel-cans-reference': '22 Carrusel latas AIS REV 360 COMPACT', '23-carousel-muesli-reference': '23 Carrusel muesli OPTICAIS', '25-carousel-partner-v275': '25 Carrusel Omron V275',
};
// An engine file (brand_type_lang_date_4x5[_NN].png, …_4x5.pdf, …_copy.txt) under its kit name; the slide sheet and
// other formats stay in out/social.
const kitName = (title, file) => {
  const m = file.match(/_(es|en)_[0-9-]+_(?:4x5(?:_(\d\d))?\.(png|pdf)|copy\.(txt))$/);
  if (!m) return null;
  const [, lang, slide, ext, txt] = m;
  return `${title} ${lang.toUpperCase()}${slide ? ` ${slide}` : ''}.${ext || txt}`;
};
const argv = process.argv.slice(2), opt = {};
for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
const only = typeof opt.only === 'string' ? opt.only.split(',') : null;

if (!opt['no-assets']) {
  const a = spawnSync('python3', [path.join(POSTS, '_build/assets.py')], { stdio: 'inherit', cwd: ROOT });
  if (a.status) { console.error('The marked pictures could not be rebuilt.'); process.exit(1); }
}

const pieces = fs.readdirSync(POSTS).filter((d) => /^\d\d-/.test(d) && fs.existsSync(path.join(POSTS, d, 'recipe-es.json')))
  .filter((d) => !only || only.some((n) => d.startsWith(n)));
const failed = [];
for (const d of pieces) {
  if (SKIP[d]) { console.log(`\n${d}: left out (${SKIP[d]})`); continue; }
  const out = path.join(OUT, d);
  fs.rmSync(out, { recursive: true, force: true });
  const recipes = ['es', 'en'].map((l) => path.join(POSTS, d, `recipe-${l}.json`)).filter((f) => fs.existsSync(f));
  console.log(`\n${d}`);
  const r = spawnSync('node', [path.join(ROOT, 'engine/render.mjs'), ...recipes, '--out', out], { stdio: 'inherit', cwd: ROOT });
  if (r.status) failed.push(d);
}

// Contact sheets: every piece's first picture, in kit order, per language.
const done = pieces.filter((d) => !SKIP[d] && fs.existsSync(path.join(OUT, d)));
const browser = await chromium.launch();
for (const lang of ['es', 'en']) {
  const firsts = done.map((d) => {
    const f = fs.readdirSync(path.join(OUT, d)).sort().find((x) => x.includes(`_${lang}_`) && /_4x5(_01)?\.png$/.test(x));
    return f && path.join(OUT, d, f);
  }).filter(Boolean);
  const p = await browser.newPage({ viewport: { width: 2400, height: 400 } });
  await p.setContent(`<body style="margin:0;padding:24px;background:#F1F5F9;display:grid;grid-template-columns:repeat(8,1fr);gap:16px;font:14px Inter,sans-serif">${firsts.map((f) => `<figure style="margin:0"><img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="width:100%;display:block"><figcaption>${path.basename(path.dirname(f))}</figcaption></figure>`).join('')}</body>`);
  await p.screenshot({ path: path.join(OUT, `_sheet_${lang}.png`), fullPage: true }); await p.close();
}
await browser.close();
console.log(`\ncontact sheets: ${path.relative(process.cwd(), OUT)}/_sheet_es.png, _sheet_en.png`);

if (failed.length) { console.log(`\nChecks failed in: ${failed.join(', ')}. Nothing copied to the kit.`); process.exit(1); }
if (typeof opt.kit === 'string') {
  for (const d of done) {
    const title = KIT_NAMES[d];
    if (!title) { console.log(`${d}: no kit name in KIT_NAMES, not copied`); continue; }
    const to = path.join(path.resolve(opt.kit), title);
    fs.rmSync(to, { recursive: true, force: true }); fs.mkdirSync(to, { recursive: true });
    for (const f of fs.readdirSync(path.join(OUT, d))) {
      const name = kitName(title, f);
      if (name) fs.copyFileSync(path.join(OUT, d, f), path.join(to, name));
    }
    console.log(`kit  ${to}`);
  }
}
if (typeof opt.before === 'string' && typeof opt.pairs === 'string') {
  const p = spawnSync('python3', [path.join(POSTS, '_build/pairs.py'), path.resolve(opt.before), OUT, path.resolve(opt.pairs)], { stdio: 'inherit', cwd: ROOT });
  if (p.status) process.exit(1);
}
