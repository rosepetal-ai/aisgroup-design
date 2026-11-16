#!/usr/bin/env node
// The components contract: the guide shows @rosepetal/design (packages/design) and nothing else. Run after the build
// (it reads guide/dist); it fails (exit 1) when the built guide and the package drift apart:
//   - a component folder (ui/<id>), a block or an examples folder the catalogue does not list, or a catalogue entry
//     with no folder, no file or no examples;
//   - a part with no page in English, Spanish or Catalan, no registry item or no line in /components.md, or a page,
//     preview or registry item for a part the package no longer has;
//   - a page whose code or example lines differ from the package's example, byte for byte;
//   - a registry item whose files are not the package's files (only the imports of other package files change, to
//     the shadcn aliases), or /downloads/ais-theme.css and r/theme.json not being styles.css less its @source lines;
//   - a component page that loads anything but its own previews: no script of a component on the page itself;
//   - the plugin's copy of the registry (plugin/brand/registry) or the hosted MCP's (hosted/data/r) not being the build's.
//   node scripts/check-components.mjs     (part of npm test, after npm run build)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'packages/design'), DIST = path.join(ROOT, 'guide/dist');
const LANGS = ['en', 'es', 'ca'];
const errors = [];
const fail = (msg) => errors.push(msg);
const read = (p) => fs.readFileSync(p, 'utf8');
const docs = JSON.parse(read(path.join(PKG, 'docs.json')));
const exists = (p) => fs.existsSync(p);
const dirs = (p) => (exists(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : []);
const filesIn = (p) => (exists(p) ? fs.readdirSync(p).filter((f) => fs.statSync(path.join(p, f)).isFile()).sort() : []);
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

if (!exists(path.join(DIST, 'r/registry.json'))) { console.error('check-components: build the guide first (npm run build).'); process.exit(1); }

// The catalogue, read as text so this runs on plain Node (catalog.ts is TypeScript).
const catalog = read(path.join(PKG, 'catalog.ts'));
const entries = (name) => {
  const body = catalog.match(new RegExp(`export const ${name}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\]`))?.[1] ?? '';
  return [...body.matchAll(/\{\s*id:\s*["'`]([a-z0-9-]+)["'`][\s\S]*?file:\s*["'`]([^"'`]+)["'`]/g)].map((m) => ({ id: m[1], file: m[2] }));
};
const components = entries('componentItems'), blocks = entries('blockItems');
const parts = [...components, ...blocks], ids = parts.map((p) => p.id);
if (!components.length || !blocks.length) fail('catalog.ts: could not read componentItems or blockItems.');

// 1. The package and its catalogue.
const uiDirs = dirs(path.join(PKG, 'ui'));
for (const d of uiDirs) if (!components.some((c) => c.id === d)) fail(`ui/${d}: not in catalog.ts componentItems.`);
for (const c of components) if (c.file !== `packages/design/ui/${c.id}`) fail(`catalog.ts ${c.id}: file is ${c.file}, not packages/design/ui/${c.id}.`);
for (const p of parts) if (!exists(path.join(ROOT, p.file))) fail(`catalog.ts ${p.id}: ${p.file} does not exist.`);
const exampleDirs = dirs(path.join(PKG, 'examples'));
for (const d of exampleDirs) if (!ids.includes(d)) fail(`examples/${d}: not in catalog.ts.`);
const examplesOf = (id) => filesIn(path.join(PKG, 'examples', id)).filter((f) => f.endsWith('.vue'));
for (const id of ids) if (!examplesOf(id).length) fail(`${id}: no examples in packages/design/examples/${id}/.`);
// A block file the catalogue does not list must travel with one that it lists (imported beside it).
const blockFiles = filesIn(path.join(PKG, 'blocks')).filter((f) => f.endsWith('.vue'));
const catalogued = blocks.map((b) => path.basename(b.file));
const importedBeside = new Set(catalogued.flatMap((f) => [...read(path.join(PKG, 'blocks', f)).matchAll(/from\s+['"]\.\/([^'"]+)['"]/g)].map((m) => m[1])));
for (const f of blockFiles) if (!catalogued.includes(f) && !importedBeside.has(f)) fail(`blocks/${f}: not in catalog.ts blockItems and no catalogued block imports it.`);

// 2. Pages, previews, registry and index in the build.
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&');
for (const lang of LANGS) {
  const built = dirs(path.join(DIST, lang, 'components'));
  for (const d of built) if (!ids.includes(d)) fail(`/${lang}/components/${d}/: a page for a part the package does not have.`);
  for (const id of ids) {
    const file = path.join(DIST, lang, 'components', id, 'index.html');
    if (!exists(file)) { fail(`/${lang}/components/${id}/: no page.`); continue; }
    const html = read(file);
    if (lang !== 'en') {
      const translated = docs.catalog[id];
      if (!translated?.name?.[lang] || !translated?.description?.[lang] || !decode(html).includes(translated.description[lang])) fail(`/${lang}/components/${id}/: missing translated catalogue metadata.`);
    }
    // The page's own scripts are inline and small: a component's code only ever loads inside its preview frames.
    // The one bundled script allowed is the guide's own client router (header and menu kept between pages).
    for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) if (!/\/_astro\/ClientRouter\.astro_astro_type_script_index_0_lang\.[\w-]+\.js$/.test(m[1])) fail(`/${lang}/components/${id}/: loads ${m[1]} on the page itself.`);
    if (/<astro-island/.test(html)) fail(`/${lang}/components/${id}/: hydrates a component on the page itself.`);
    // Every example: its frame, its line and its code, as in the package.
    const frames = [...html.matchAll(/<iframe[^>]*class="preview"[^>]*data-src="\/preview\/([^"]+)\/"|<iframe[^>]*class="preview"[^>]*src="\/preview\/([^"]+)\/"/g)].map((m) => m[1] ?? m[2]);
    const codes = [...html.matchAll(/<pre[^>]*data-language="vue"[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)].map((m) => decode(m[1]).replace(/\n$/, ''));
    const want = examplesOf(id).map((f) => f.replace('.vue', ''));
    if (!same(frames, want.map((w) => `${id}/${w}`))) fail(`/${lang}/components/${id}/: previews ${frames.join(', ') || 'none'}, package has ${want.join(', ')}.`);
    want.forEach((w, i) => {
      const src = read(path.join(PKG, 'examples', id, `${w}.vue`));
      const sourceAbout = src.match(/^<!--\s*([\s\S]*?)\s*-->\n*/)?.[1];
      const about = lang === 'en' ? sourceAbout : docs.examples[`${id}/${w}`]?.about?.[lang];
      if (lang !== 'en' && (!about || about === sourceAbout)) fail(`/${lang}/components/${id}/ ${w}: missing translated example metadata.`);
      if (lang !== 'en') {
        const name = docs.examples[`${id}/${w}`]?.name?.[lang];
        const heading = html.match(new RegExp(`<h2[^>]*id="${w}"[^>]*>([\\s\\S]*?)<\\/h2>`))?.[1];
        if (!name || !heading || decode(heading) !== name) fail(`/${lang}/components/${id}/ ${w}: missing translated example heading.`);
      }
      const code = src.replace(/^<!--[\s\S]*?-->\n*/, '').trim();
      if (codes[i] !== code) fail(`/${lang}/components/${id}/ ${w}: the code shown is not examples/${id}/${w}.vue.`);
      if (about && !html.includes(about.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')) && !decode(html).includes(about)) fail(`/${lang}/components/${id}/ ${w}: the line under the title does not match the example metadata for ${lang}.`);
    });
  }
}
// Web package examples and guide-owned web examples have their own preview routes.
const previews = dirs(path.join(DIST, 'preview')).filter((d) => !['web', 'web-guide'].includes(d));
for (const d of previews) {
  if (!ids.includes(d)) { fail(`/preview/${d}/: previews for a part the package does not have.`); continue; }
  const built = dirs(path.join(DIST, 'preview', d)), want = examplesOf(d).map((f) => f.replace('.vue', ''));
  if (!same(built, want)) fail(`/preview/${d}/: ${built.join(', ')}, package has ${want.join(', ')}.`);
}
for (const id of ids) if (!previews.includes(id)) fail(`/preview/${id}/: missing.`);

const registry = JSON.parse(read(path.join(DIST, 'r/registry.json')));
const names = registry.items.map((i) => i.name);
const extra = ['utils', 'theme'];
for (const n of names) if (!ids.includes(n) && !extra.includes(n)) fail(`r/registry.json: lists ${n}, which the package does not have.`);
for (const id of [...ids, ...extra]) if (!names.includes(id)) fail(`r/registry.json: does not list ${id}.`);
for (const f of filesIn(path.join(DIST, 'r'))) { const n = f.replace('.json', ''); if (n !== 'registry' && !names.includes(n)) fail(`r/${f}: not in r/registry.json.`); }

// A registry file is its package file with only the imports of other package files rewritten to the shadcn aliases.
const target = (p) => p.replace(/^ui\//, 'components/ui/').replace(/^blocks\//, 'components/blocks/');
const unalias = (spec) => spec.replace(/^@\/components\/ui\//, 'ui/').replace(/^@\/components\/blocks\//, 'blocks/').replace(/^@\/lib\//, 'lib/');
const pkgFile = (appPath) => appPath.replace(/^components\/ui\//, 'ui/').replace(/^components\/blocks\//, 'blocks/');
const resolveSpec = (file, spec) => (spec.startsWith('.') ? path.posix.normalize(path.posix.join(path.posix.dirname(file), spec)) : spec.startsWith('@/') ? unalias(spec) : spec).replace(/\.(ts|js)$/, '');
const importsSame = (a, b, file) => {
  const la = a.split('\n'), lb = b.split('\n');
  if (la.length !== lb.length) return false;
  return la.every((x, i) => {
    if (x === lb[i]) return true;
    const re = /^(.*(?:from\s+|import\s+))(['"])([^'"]+)\2(.*)$/;
    const ma = x.match(re), mb = lb[i].match(re);
    return ma && mb && ma[1] === mb[1] && ma[4] === mb[4] && resolveSpec(file, ma[3]) === resolveSpec(file, mb[3]);
  });
};
for (const id of [...ids, 'utils']) {
  const p = path.join(DIST, 'r', `${id}.json`);
  if (!exists(p)) { fail(`r/${id}.json: missing.`); continue; }
  const item = JSON.parse(read(p));
  if (components.some((c) => c.id === id)) {
    const want = filesIn(path.join(PKG, 'ui', id)).map((f) => `components/ui/${id}/${f}`);
    const got = item.files.map((f) => f.path).sort();
    if (!same(got, want.sort())) fail(`r/${id}.json: files ${got.join(', ')}, package has ${want.join(', ')}.`);
  }
  for (const f of item.files) {
    const src = path.join(PKG, pkgFile(f.path));
    if (!exists(src)) { fail(`r/${id}.json: ${f.path} is not a package file.`); continue; }
    if (!importsSame(read(src), f.content, pkgFile(f.path))) fail(`r/${id}.json: ${f.path} differs from packages/design/${pkgFile(f.path)} beyond its imports.`);
  }
}
const styles = read(path.join(PKG, 'styles.css')).replace(/^@source .*\n/gm, '');
if (read(path.join(DIST, 'downloads/ais-theme.css')) !== styles) fail('downloads/ais-theme.css: not packages/design/styles.css less its @source lines.');
if (JSON.parse(read(path.join(DIST, 'r/theme.json'))).files[0].content !== styles) fail('r/theme.json: not packages/design/styles.css less its @source lines.');

const index = read(path.join(DIST, 'components.md'));
const listed = [...index.split('## Node-RED')[0].matchAll(/^- \*\*[^*]+\*\* \(`([a-z0-9-]+)`\)/gm)].map((m) => m[1]);
for (const id of ids) if (!listed.includes(id)) fail(`components.md: no line for ${id}.`);
for (const id of listed) if (!ids.includes(id)) fail(`components.md: lists ${id}, which the package does not have.`);

// 3. The copies agents read: the plugin's registry (committed) and the hosted MCP's snapshot (built), as the build.
for (const [label, dir] of [['plugin/brand/registry', path.join(ROOT, 'plugin/brand/registry')], ['hosted/data/r', path.join(ROOT, 'hosted/data/r')]]) {
  if (!exists(dir)) { if (label.startsWith('plugin')) fail(`${label}: missing (npm run sync:plugin).`); continue; }
  const built = filesIn(path.join(DIST, 'r')), copy = filesIn(dir);
  for (const f of copy) if (!built.includes(f)) fail(`${label}/${f}: the build has no such item.`);
  for (const f of built) if (!copy.includes(f)) fail(`${label}/${f}: missing.`);
  else if (read(path.join(dir, f)) !== read(path.join(DIST, 'r', f))) fail(`${label}/${f}: differs from the build (${label.startsWith('plugin') ? 'npm run sync:plugin' : 'npm run build -w hosted'}).`);
}

if (errors.length) {
  console.error(`Components contract broken (${errors.length}):\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`Components contract holds: ${components.length} components and ${blocks.length} blocks, each with its pages in ${LANGS.join(', ')}, previews, registry item and index line, all from packages/design.`);
