#!/usr/bin/env node
// The plugin follows the brand guide (guide/ in this repo): its knowledge skills, logos, tokens and component registry
// are generated from the guide. Task entrypoints and workflows stay owned by the plugin.
//   npm run guide           copy them in (build the guide first: npm run build -w guide, from the repo root)
//   npm run guide -- --check exit 1 if anything here differs from the guide
// AIS_GUIDE points at the guide; the default is ../guide.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GUIDE = path.resolve(process.env.AIS_GUIDE || path.join(ROOT, '../guide'));
const dist = path.join(GUIDE, 'dist');
const check = process.argv.includes('--check');
const fail = (msg) => { console.error(msg); process.exit(1); };

if (!fs.existsSync(path.join(dist, 'skills/index.json'))) fail(`No built guide at ${GUIDE}. Run npm run build -w guide, or set AIS_GUIDE.`);
const newest = (dir) => fs.readdirSync(dir, { recursive: true }).reduce((t, f) => Math.max(t, fs.statSync(path.join(dir, f)).mtimeMs), 0);
if (newest(path.join(GUIDE, 'src')) > fs.statSync(path.join(dist, 'skills/index.json')).mtimeMs) fail('The guide changed since its last build. Run npm run build -w guide first.');

// Guide URLs become paths inside the plugin, relative to each file.
const relink = (text, file) => {
  const up = path.relative(path.dirname(file), ROOT) || '.';
  return text.replace(/\]\(\/(logos|downloads|imagery|illustrations|kit|library)\//g, (_, dir) => `](${up}/brand/${dir}/`);
};

const files = new Map(); // plugin path -> contents (Buffer or string)
const names = JSON.parse(fs.readFileSync(path.join(dist, 'skills/index.json'), 'utf8'));
const descriptor = path.join(dist, 'skills/guide-files.json');
if (!fs.existsSync(descriptor)) fail('Rebuild the guide: the skill reference ownership manifest is missing.');
const guideFiles = new Set(JSON.parse(fs.readFileSync(descriptor, 'utf8')));
const skillTexts = [];
for (const name of names) {
  const from = path.join(dist, 'skills', name);
  for (const f of fs.readdirSync(from, { recursive: true })) {
    const src = path.join(from, f);
    if (!fs.statSync(src).isFile()) continue;
    const to = path.join(ROOT, 'skills', name, f), text = fs.readFileSync(src, 'utf8');
    // Curated entrypoints, task workflows and ledger records are plugin inputs
    // to the guide. Never copy stale build output back over those inputs.
    skillTexts.push(text);
    if (guideFiles.has(`${name}/${f}`)) files.set(to, relink(text, to));
  }
}
for (const relative of guideFiles) {
  if (!names.includes(relative.split('/')[0]) || !/^[a-z-]+\/references\/[a-z-]+\.md$/.test(relative)) fail(`Invalid guide reference ownership: ${relative}`);
  if (!files.has(path.join(ROOT, 'skills', relative))) fail(`Missing generated guide reference: ${relative}`);
}
const components = path.join(ROOT, 'skills/product-ui/references/component-registry.md');
files.set(components, fs.readFileSync(path.join(dist, 'components.md'), 'utf8'));
for (const f of fs.readdirSync(path.join(GUIDE, 'public/logos'), { recursive: true })) {
  const src = path.join(GUIDE, 'public/logos', f);
  if (fs.statSync(src).isFile()) files.set(path.join(ROOT, 'brand/logos', f), fs.readFileSync(src));
}
// The banner kit the linkedin-banner skill builds from (brand/kit), file for file as the guide publishes it.
const kit = path.join(GUIDE, 'public/kit');
for (const f of ['linkedin-banners.html', 'kit.css', ...fs.readdirSync(kit).filter((n) => /^(hex-field|linkedin-landscape)-.*\.svg$/.test(n))])
  files.set(path.join(ROOT, 'brand/kit', f), fs.readFileSync(path.join(kit, f)));
// LinkedIn's optional pattern downloads are scoped assets, kept separate from print's plain hexagons.
const linkedin = path.join(GUIDE, 'public/downloads/linkedin-patterns');
for (const f of fs.readdirSync(linkedin, { recursive: true })) {
  const src = path.join(linkedin, f);
  if (fs.statSync(src).isFile()) files.set(path.join(ROOT, 'brand/downloads/linkedin-patterns', f), fs.readFileSync(src));
}
// The component registry (shadcn-vue items with the source of every Rosepetal component and block), for agents offline.
for (const f of fs.readdirSync(path.join(dist, 'r'))) files.set(path.join(ROOT, 'brand/registry', f), fs.readFileSync(path.join(dist, 'r', f)));
// The curated media library (the repo's library/, beside the guide): its photos and index, which search_library and
// get_asset read. The photos are not on the public guide, so they come from library/, not from the build.
const library = path.join(GUIDE, '../library');
if (!fs.existsSync(path.join(library, 'library.json'))) fail(`No media library at ${library} (node scripts/import-library.mjs).`);
for (const f of fs.readdirSync(library, { recursive: true })) {
  const src = path.join(library, f);
  if (fs.statSync(src).isFile()) files.set(path.join(ROOT, 'brand/library', f), fs.readFileSync(src));
}
// The product-UI audit and theme diff (ui-audit, ui-theme-diff skills) and the runtime states check (ui-unify) run from an
// installed plugin, in any app's folder: the scripts, the theme parser, the canonical styles.css and the Button and Badge
// variants (ui-rules.mjs reads them) keep their repo layout.
for (const f of ['scripts/ui-contract.mjs', 'scripts/ui-rules.mjs', 'scripts/ui-states.mjs', 'packages/vue-themes/generate.mjs', 'packages/design/styles.css', 'packages/design/ui/button/index.ts', 'packages/design/ui/badge/index.ts'])
  files.set(path.join(ROOT, f), fs.readFileSync(path.join(GUIDE, '..', f)));
// Every other guide file a skill links to (tokens, the brand check, chart theme, web templates…), and nothing more,
// from the built guide: some (theme.css) are generated by the build, not kept in public/.
const linked = new Set([...files.values(), ...skillTexts].filter((v) => typeof v === 'string').flatMap((t) => [...t.matchAll(/\]\([./]*\/?brand\/((?:downloads|imagery|illustrations|kit)\/[^)#\s]+)/g)].map((m) => m[1])));
for (const f of linked) {
  const src = path.join(dist, f);
  if (!fs.existsSync(src)) fail(`A skill links to ${f}, which the guide doesn't have.`);
  files.set(path.join(ROOT, 'brand', f), fs.readFileSync(src));
}

if (process.argv.includes('--list')) { await new Promise((resolve, reject) => process.stdout.write(JSON.stringify([...files.keys()], null, 2) + '\n', error => error ? reject(error) : resolve())); process.exit(0); }
const differs = [...files].filter(([to, body]) => !fs.existsSync(to) || !fs.readFileSync(to).equals(Buffer.from(body)));
// brand/registry and brand/library mirror the guide's registry and the library: a file they no longer have goes too.
const retired = ['brand/kit/office/presentation-ais-vision-systems.pptx', 'brand/kit/office/presentation-ais-vision-systems.pdf', 'brand/kit/files/office-powerpoint.jpg'].map(file => path.join(ROOT, file)).filter(file => fs.existsSync(file));
const stale = ['brand/registry', 'brand/library'].map((d) => path.join(ROOT, d)).filter((d) => fs.existsSync(d))
  .flatMap((d) => fs.readdirSync(d, { recursive: true }).map((f) => path.join(d, f))).filter((f) => fs.statSync(f).isFile() && !files.has(f)).concat(retired);
if (check) {
  if (differs.length || stale.length) fail(`Out of date with the guide (npm run guide): ${[...differs.map(([to]) => to), ...stale].map((f) => path.relative(ROOT, f)).join(', ')}`);
  console.log(`In step with the guide: ${files.size} files.`);
} else {
  for (const [to, body] of differs) { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.writeFileSync(to, body); }
  for (const f of stale) fs.rmSync(f);
  console.log(`Copied ${differs.length} of ${files.size} files from the guide${stale.length ? `, removed ${stale.length} the guide no longer has` : ''}.`);
}
