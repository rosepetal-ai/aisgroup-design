#!/usr/bin/env node
// Snapshot what the hosted server serves into hosted/data/: the guide's agent Markdown, the rules, the tokens, the
// downloadable files, the examples' HTML sources, plus catalogue.json (every asset with its usage rule, quoted from
// the guide). The server reads nothing outside hosted/ at runtime.
//   npm run build -w hosted          (after npm run build -w guide; AIS_GUIDE_DIST=<built guide> to use another build)
import fs from 'node:fs';
import { readSkillSource } from './skill-source.mjs';
import { mergeDownloads } from './download-assets.mjs';
import { patternAssets } from '../plugin/engine/linkedin-patterns.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(process.env.AIS_GUIDE_DIST || path.join(HERE, '../guide/dist'));
const LIBRARY = path.join(HERE, '../library'); // the curated photos and their index (scripts/import-library.mjs)
const OUT = path.join(HERE, 'data');
const fail = (m) => { console.error(m); process.exit(1); };
if (!fs.existsSync(path.join(DIST, 'skills/index.json'))) fail(`No built guide at ${DIST}. Build it (npm run build -w guide) or set AIS_GUIDE_DIST.`);

const COPY = ['skills', 'en/brand.md', 'es/brand.md', 'ca/brand.md', 'components.md', 'r', 'logos', 'downloads', 'fonts',
  'kit/hex-field-tl.svg', 'kit/hex-field-tr.svg', 'kit/hex-field-bl.svg', 'kit/hex-field-br.svg'];
fs.rmSync(OUT, { recursive: true, force: true });
for (const p of COPY) {
  if (!fs.existsSync(path.join(DIST, p))) fail(`The guide build has no ${p}.`);
  fs.cpSync(path.join(DIST, p), path.join(OUT, p), { recursive: true });
}
// The curated library and public Downloads descriptor share the same source selection.
if (!fs.existsSync(path.join(LIBRARY, 'library.json'))) fail(`No library at ${LIBRARY} (node scripts/import-library.mjs).`);
fs.cpSync(LIBRARY, path.join(OUT, 'library'), { recursive: true });
// The examples' index, pages and stylesheets only: design_examples reads their source; pictures and PDFs stay on the site.
if (!fs.existsSync(path.join(DIST, 'examples/index.json'))) fail('The guide build has no examples/index.json (npm run examples -w plugin, then build the guide).');
fs.cpSync(path.join(DIST, 'examples'), path.join(OUT, 'examples'), { recursive: true, dereference: true, filter: (f) => fs.statSync(f).isDirectory() || /\.(html|css|json)$/.test(f) });

// Usage rules are quoted from the guide, never written here: a missing line fails the build, so guide edits surface.
const read = (p) => readSkillSource(OUT, p);
const plain = (s) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').replace(/^\s*(-|\d+\.)\s+/, '').trim().replace(/\s*See [^.]+\.$/, '');
const line = (file, start) => {
  const hit = read(file).split('\n').find((l) => plain(l.replace(/^\s*\|\s*/, '')).startsWith(start));
  if (!hit) fail(`Guide changed: no line starting "${start}" in ${file}. Update hosted/build.mjs.`);
  return hit;
};
const rule = (file, ...starts) => starts.map((s) => plain(line(file, s))).join(' ');
const cell = (file, label) => plain(line(file, label).split('|').filter((c) => c.trim()).at(-1));
const sentences = (s, n) => s.split(/(?<=\.)\s+(?=[A-Z])/).slice(0, n).join(' ');
const sentence = (file, start) => { const i = read(file).indexOf(start); if (i < 0) fail(`Guide changed: no "${start}" in ${file}. Update hosted/build.mjs.`); return sentences(plain(read(file).slice(i).split('\n')[0]), 1); };

const BRAND = 'en/brand.md', LOGOS = 'skills/brand-guidelines/references/logos.md', DOWNLOADS = 'skills/resources-assets/references/downloads.md';
const WEB = 'skills/web-design/references/web-components.md', WEB_ASSETS = 'skills/web-design/references/assets.md';
const rules = {
  logo: rule(BRAND, 'Use only the supplied logo files', 'Clear space is', 'Minimum widths'),
  'app-mark': rule(LOGOS, 'Software and browser tabs only.', 'Colours:', 'Sizes:'),
  'app-icon': rule(BRAND, 'Software uses the app mark') + ' ' + sentence(LOGOS, 'App icons are always'),
  favicon: cell(LOGOS, 'Favicon 16, 32, 48 px') + '. ' + rule(LOGOS, 'Favicons:'),
  pattern: rule('skills/design-language/references/patterns.md', 'The five patterns', 'Use white lines', 'No glow'),
  icon: sentences(plain(line('skills/design-language/references/icons.md', '130 icons')), 1) + ' ' + rule('skills/design-language/references/icons.md', 'Keep every project on the same Lucide'),
  chart: cell(DOWNLOADS, 'Chart toolkit'),
  web: sentences(plain(line(WEB, 'How the three sites are built')), 2) + ' ' + sentences(plain(line(WEB, '`@aisgroup/web/styles.css` first')), 1),
  font: rule(BRAND, 'Set everything in'),
  photo: sentences(plain(line(DOWNLOADS, 'Photographs, product views')), 3),
  stock: sentence(DOWNLOADS, 'Stock photographs link'),
  video: rule(DOWNLOADS, 'The brand intros, and'),
  poster: rule(DOWNLOADS, 'The brand intros, and'),
  code: 'Brand tools to run on your own files.',
  tokens: 'The tokens, version 1.0. Use design_tokens to get them in another format.'
};
// ponytail: the two lines above are the only words written here (they describe the server, not the brand).

const assets = [];
const add = (kind, id, file, use) => { if (!fs.existsSync(path.join(OUT, file))) fail(`Missing ${file}.`); assets.push({ id, kind, file, use }); };
for (const l of read(BRAND).split('## Logo files')[1].split('\n## ')[0].split('\n').filter((l) => l.startsWith('- '))) {
  const [, brand, use, file] = l.match(/^- ([a-z-]+), (.+): \/(.+)$/) ?? fail(`Guide changed: logo line "${l}".`);
  add('logo', path.basename(file, '.svg'), file, use[0].toUpperCase() + use.slice(1));
}
// The app marks have their own colour rule: "blue on …, white on …, black only where …".
for (const part of sentence(LOGOS, 'Colours:').replace(/^Colours:\s*/, '').replace(/\.$/, '').split(', ')) {
  const c = part.split(' ')[0];
  for (const b of ['ais', 'rosepetal']) add('app-mark', `${b}-mark-${c}`, `logos/${b}-mark-${c}.svg`, `${b === 'ais' ? 'AIS Λ' : 'Rosepetal “o”'}: ${part}`);
}
const icon = (row) => cell(LOGOS, row);
// Two favicon kinds per mark: logos/app/<b>/ (the tile, for apps) and logos/favicons/<b>/ (bare, light and dark, for websites).
for (const [b, name] of [['ais', 'AIS'], ['rosepetal', 'Rosepetal']]) {
  const app = `logos/app/${b}`, web = `logos/favicons/${b}`;
  add('app-icon', `${b}-app-icon`, `${app}/app-icon.svg`, `${name}: ${icon('App icon')}`);
  add('app-icon', `${b}-app-icon-rounded`, `${app}/app-icon-rounded.svg`, `${name}: ${icon('Rounded icon')}`);
  add('app-icon', `${b}-maskable-512`, `${app}/maskable-512.png`, `${name}: ${icon('Maskable icon')}`);
  for (const f of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'site.webmanifest']) add('app-icon', `${b}-${path.basename(f, path.extname(f))}`, `${app}/${f}`, `${name}: ${f === 'site.webmanifest' ? 'web manifest with the icons' : `app icon, ${f.includes('apple') ? 'Apple touch (180 px)' : 'web manifest'}`}`);
  for (const f of ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'favicon-48.png']) add('favicon', `${b}-app-${f.replace('.', '-')}`, `${app}/${f}`, `${name} app favicon (tile, light and dark tabs)${f === 'favicon.ico' ? ', 16, 32 and 48 px in one file' : f.match(/\d+/) ? `, ${f.match(/\d+/)[0]} px` : ', SVG'}`);
  add('favicon', `${b}-web-favicon-svg`, `${web}/favicon.svg`, `${name} website favicon, SVG: blue in light mode, white in dark mode`);
  add('favicon', `${b}-web-favicon-ico`, `${web}/favicon.ico`, `${name} website favicon, light version, 16, 32 and 48 px in one file`);
  for (const n of [16, 32, 48]) for (const m of ['light', 'dark']) add('favicon', `${b}-web-favicon-${n}-${m}`, `${web}/favicon-${n}-${m}.png`, `${name} website favicon, ${n} px, ${m === 'light' ? 'blue for light mode' : 'white for dark mode'}`);
  add('favicon', `${b}-web-manifest`, `${web}/site.webmanifest`, `${name} website web manifest (tile icons)`);
}
const corner = { tl: 'top left', tr: 'top right', bl: 'bottom left', br: 'bottom right' };
for (const [k, v] of Object.entries(corner)) add('pattern', `hex-field-${k}`, `kit/hex-field-${k}.svg`, `Hexagon field fading from the ${v} corner`);
for (const a of patternAssets()) add('pattern', a.id, a.path.replace(/^brand\//, ''), a.reason);
add('icon', 'ais-icons', 'downloads/icons/ais-icons.zip', 'All 130 icons as SVG, with the Lucide licence');
for (const f of fs.readdirSync(path.join(OUT, 'downloads/icons/svg')).sort()) add('icon', `icon-${path.basename(f, '.svg')}`, `downloads/icons/svg/${f}`, `Lucide icon ${path.basename(f, '.svg')}`);
for (const f of ['ais-vega-config.json', 'ais-vega-config-dark.json', 'ais-echarts-theme.json', 'ais-echarts-theme-dark.json', 'render.mjs', 'README.md'])
  add('chart', `chart-${path.basename(f, path.extname(f))}`, `downloads/charts/${f}`, f.includes('vega') ? `Vega-Lite config${f.includes('dark') ? ', dark' : ''}` : f.includes('echarts') ? `ECharts theme for the product${f.includes('dark') ? ', dark' : ''}` : f === 'render.mjs' ? 'Chart renderer' : 'How to use the chart toolkit');
// Each site's zip holds its images and favicons; what is in it is the line under the site's heading on Web assets.
const siteAssets = (name) => read(WEB_ASSETS).split(`\n## ${name}\n`)[1]?.split('\n').find((l) => l.trim())?.trim() ?? fail(`Guide changed: no "## ${name}" on Web assets.`);
for (const [s, name] of Object.entries({ 'ais-group': 'AIS Group', 'ais-vision': 'AIS Vision Systems', rosepetal: 'Rosepetal' })) add('web', `web-${s}`, `downloads/web/${s === 'ais-vision' ? 'ais-vision-systems' : s}-web-assets.zip`, `Web assets for the ${name} site (zip), with its favicons: ${siteAssets(name)}`);
add('web', 'ais-web-theme-css', 'downloads/ais-web-theme.css', cell(DOWNLOADS, 'ais-web-theme.css'));
for (const f of fs.readdirSync(path.join(OUT, 'fonts')).sort()) add('font', path.basename(f, path.extname(f)).toLowerCase(), `fonts/${f}`, f.startsWith('OFL') ? 'Licence (SIL Open Font License)' : `Web font, ${f.replace(/\.woff2$/, '').replace(/-/g, ' ')}`);
// One asset per photo file, named as the library names it; what it is and where it came from is its usage note.
const VARIANT = { dark: 'dark version', tile: 'with labels', es: 'in Spanish' };
const library = JSON.parse(read('library/library.json'));
// A photo whose origin was never recorded may be generated: it is not published.
for (const e of library.entries.filter((e) => e.kind === 'photo' && e.origin !== 'unknown'))
  for (const v of e.variants) {
    const about = [e.title.includes(e.subjectLabel) ? e.title : `${e.subjectLabel}: ${e.title}`, ...v.variant.split('+').filter(Boolean).map((k) => VARIANT[k] ?? fail(`Unknown variant ${k} in ${v.file}.`))].join(', ');
    add('photo', path.basename(v.file, path.extname(v.file)), v.file, `${about}. ${library.origins[e.origin]}, ${v.width} × ${v.height} px.`);
  }
add('code', 'brand-check', 'downloads/qa/brand-check.js', cell(DOWNLOADS, 'brand-check.js'));
add('code', 'overlay', 'downloads/overlays/overlay.mjs', cell(DOWNLOADS, 'overlay.mjs'));
add('tokens', 'ais-theme-css', 'downloads/ais-theme.css', cell(DOWNLOADS, 'ais-theme.css'));
add('tokens', 'ais-tokens-css', 'downloads/ais-tokens.css', cell(DOWNLOADS, 'ais-tokens.css'));
add('tokens', 'ais-tokens-json', 'downloads/ais-tokens.json', cell(DOWNLOADS, 'ais-tokens.json'));

const version = read(BRAND).match(/^Version (\d+(?:\.\d+)*)/m)?.[1] ?? fail('Guide changed: no version line in brand.md.');
const downloads = JSON.parse(read('library/downloads.json'));
const merged = mergeDownloads(assets, downloads, file => fs.statSync(path.join(OUT, file), { throwIfNoEntry: false })?.isFile());
fs.writeFileSync(path.join(OUT, 'catalogue.json'), JSON.stringify({ version, builtAt: new Date().toISOString(), rules, assets: merged }, null, 1));
console.log(`hosted/data: guide ${version}, ${merged.length} assets, from ${DIST}`);
