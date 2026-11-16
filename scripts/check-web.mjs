#!/usr/bin/env node
// The website contract: the guide's website pages show @aisgroup/web (packages/web), and the sites carry it unchanged.
// Run after the build (it reads guide/dist); it fails (exit 1) when they drift apart:
//   - a component folder or an examples folder the catalogue does not list, or a catalogue entry with no folder,
//     no index.ts or no examples;
//   - packages/web/brand.css not being the guide's ais-tokens.css (npm run sync:sites);
//   - a component with no page in English, Spanish or Catalan, no line in the Website components index, or a page or
//     preview for a component the package no longer has;
//   - a page whose code or example lines differ from the package's example, byte for byte;
//   - a site next to this repo whose src/vendor/@aisgroup/web is not this package, or whose package.json fingerprint
//     is not its copy's (npm run sync:sites).
//   node scripts/check-web.mjs     (part of npm test, after npm run build)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint, filesOf } from './check-vendor.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'packages/web'), DIST = path.join(ROOT, 'guide/dist');
const SITES_DIR = process.env.SITES_DIR ?? path.resolve(ROOT, '../../websites');
const SITES = ['aisvision-web-aisgroup', 'aisvision-web-aisvision', 'rosepetal-web-static/astro'];
const LANGS = ['en', 'es', 'ca'];
const errors = [];
const fail = (msg) => errors.push(msg);
const read = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => fs.existsSync(p);
const dirs = (p) => (exists(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : []);
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

if (!exists(path.join(DIST, 'preview/web'))) { console.error('check-web: build the guide first (npm run build).'); process.exit(1); }

// 1. The package, its catalogue and its tokens.
const catalog = read(path.join(PKG, 'catalog.ts'));
const items = [...catalog.matchAll(/\{\s*id:\s*'([a-z0-9-]+)'[\s\S]*?file:\s*'([^']+)'/g)].map((m) => ({ id: m[1], file: m[2] }));
const ids = items.map((i) => i.id);
if (!items.length) fail('catalog.ts: could not read componentItems.');
for (const d of dirs(path.join(PKG, 'components'))) if (!ids.includes(d)) fail(`components/${d}: not in catalog.ts.`);
for (const { id, file } of items) {
  if (file !== `packages/web/components/${id}`) fail(`catalog.ts ${id}: file is ${file}, not packages/web/components/${id}.`);
  if (!exists(path.join(PKG, 'components', id, 'index.ts'))) fail(`components/${id}: no index.ts.`);
}
for (const d of dirs(path.join(PKG, 'examples'))) if (!ids.includes(d)) fail(`examples/${d}: not in catalog.ts.`);
const examplesOf = (id) => (exists(path.join(PKG, 'examples', id)) ? fs.readdirSync(path.join(PKG, 'examples', id)).filter((f) => f.endsWith('.astro')).sort() : []);
for (const id of ids) if (!examplesOf(id).length) fail(`${id}: no examples in packages/web/examples/${id}/.`);
if (read(path.join(PKG, 'brand.css')) !== read(path.join(ROOT, 'guide/public/downloads/ais-tokens.css'))) fail('packages/web/brand.css: not the guide\'s ais-tokens.css (npm run sync:sites).');

const webDocs = JSON.parse(read(path.join(PKG, 'docs.json')));

// 2. Pages and previews in the build.
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&');
for (const lang of LANGS) {
  for (const d of dirs(path.join(DIST, lang, 'web-components'))) if (!ids.includes(d)) fail(`/${lang}/web-components/${d}/: a page for a component the package does not have.`);
  const index = path.join(DIST, lang, 'web-components', 'index.html');
  const listed = exists(index) ? [...read(index).matchAll(new RegExp(`href="/${lang}/web-components/([a-z0-9-]+)/"`, 'g'))].map((m) => m[1]) : [];
  for (const id of ids) {
    if (!listed.includes(id)) fail(`/${lang}/web-components/: no link to ${id}.`);
    const file = path.join(DIST, lang, 'web-components', id, 'index.html');
    if (!exists(file)) { fail(`/${lang}/web-components/${id}/: no page.`); continue; }
    const html = read(file);
    const frames = [...html.matchAll(/<iframe[^>]*class="preview"[^>]*src="\/preview\/web\/([^"]+)\/"/g)].map((m) => m[1]);
    const codes = [...html.matchAll(/<pre[^>]*data-language="astro"[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)].map((m) => decode(m[1]).replace(/\n$/, ''));
    const want = examplesOf(id).map((f) => f.replace('.astro', ''));
    if (!same(frames, want.map((w) => `${id}/${w}`))) fail(`/${lang}/web-components/${id}/: previews ${frames.join(', ') || 'none'}, package has ${want.join(', ')}.`);
    want.forEach((w, i) => {
      const src = read(path.join(PKG, 'examples', id, `${w}.astro`));
      const about = src.match(/^---\n\/\/\s*(.+)\n/)?.[1];
      if (!about) fail(`examples/${id}/${w}.astro: no first comment to say what it shows.`);
      if (codes[i] !== src.replace(/^---\n\/\/.*\n/, '---\n').trim()) fail(`/${lang}/web-components/${id}/ ${w}: the code shown is not examples/${id}/${w}.astro.`);
      // English shows the first comment; Spanish and Catalan show its translation from docs.json.
      const line = lang === 'en' ? about : webDocs.examples[`${id}/${w}`]?.about?.[lang];
      if (!line) fail(`docs.json examples["${id}/${w}"]: no ${lang} line.`);
      else if (!decode(html).includes(line)) fail(`/${lang}/web-components/${id}/ ${w}: the line under the title is not the example's ${lang === 'en' ? 'first comment' : `${lang} line in docs.json`}.`);
    });
  }
}
for (const d of dirs(path.join(DIST, 'preview/web'))) {
  if (!ids.includes(d)) { fail(`/preview/web/${d}/: previews for a component the package does not have.`); continue; }
  if (!same(dirs(path.join(DIST, 'preview/web', d)), examplesOf(d).map((f) => f.replace('.astro', '')))) fail(`/preview/web/${d}/: not the package's examples.`);
}
for (const id of ids) if (!dirs(path.join(DIST, 'preview/web')).includes(id)) fail(`/preview/web/${id}/: missing.`);

// 3. The sites' copies, when the sites are next to this repo.
const pkg = JSON.parse(read(path.join(PKG, 'package.json')));
const shipped = ['package.json', ...pkg.files].flatMap((e) => (fs.statSync(path.join(PKG, e)).isDirectory() ? filesOf(path.join(PKG, e)).map((f) => `${e}/${f}`) : [e])).sort();
const sites = SITES.filter((s) => exists(path.join(SITES_DIR, s, 'package.json')));
for (const site of sites) {
  const copy = path.join(SITES_DIR, site, 'src/vendor/@aisgroup/web');
  if (!exists(copy)) { fail(`${site}: no src/vendor/@aisgroup/web (npm run sync:sites).`); continue; }
  const got = filesOf(copy);
  if (!same(got, shipped) || got.some((f) => !fs.readFileSync(path.join(copy, f)).equals(fs.readFileSync(path.join(PKG, f))))) fail(`${site}: src/vendor/@aisgroup/web is not packages/web ${pkg.version} (npm run sync:sites).`);
  const want = JSON.parse(read(path.join(SITES_DIR, site, 'package.json'))).vendor?.['@aisgroup/web'];
  if (want?.version !== pkg.version || want?.integrity !== fingerprint(copy)) fail(`${site}: package.json's vendor entry is not the copy's version and fingerprint (npm run sync:sites).`);
}

if (errors.length) {
  console.error(`Website contract broken (${errors.length}):\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`Website contract holds: ${ids.length} components, each with its pages in ${LANGS.join(', ')} and previews from packages/web${sites.length ? `, and ${sites.length} sites on ${pkg.version}` : ''}.`);
