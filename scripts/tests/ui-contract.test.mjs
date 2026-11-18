// The product-UI audit and theme diff, on the cases that broke them on real apps.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { audit, auditLogo, diff, officialLogos, report } from '../ui-contract.mjs';
import { themes } from '../../packages/vue-themes/generate.mjs';

const rules = (text, file = 'x.vue') => audit(text, file).map((f) => f.rule);
test('audit reads templates and styles, never script code or comments', () => {
  const vue = `<template>\n  <!-- old → new -->\n  <p>Ready</p>\n</template>\n<script setup>\n// tag → label\nconst fallback = '#ccc'\n</script>`;
  assert.deepEqual(rules(vue), []);
});
test('audit catches what the redesign forbids', () => {
  const vue = `<template>
  <h2 class="text-lg font-semibold">Copy</h2>
  <div class="bg-gray-100 text-[#123456]">x</div>
  <TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList>
  <Badge variant="success">Done</Badge>
  <Button class="rounded-xl">Go</Button>
  <span>Labels · Images</span>
  <div class="absolute inset-0 bg-card/80"></div>
  <v-btn color="blue">Save</v-btn>
  <p class="bg-success/10">Finished</p>
</template>`;
  const got = new Set(rules(vue));
  for (const r of ['heading-weight', 'stock-palette', 'raw-colour', 'pill-tabs', 'non-stock-variant', 'radius-override', 'separator', 'veil', 'named-colour', 'tinted-status']) assert(got.has(r), r);
});
test('audit leaves the reference app\'s own patterns alone', () => {
  const vue = `<template>
  <Skeleton class="size-9 rounded-full" />
  <Field orientation="horizontal" class="rounded-lg border p-4" />
  <Button variant="ghost" class="absolute inset-0 rounded-[inherit]" />
  <Button variant="ghost" class="w-full rounded-none" />
  <Button variant="topbar" size="icon" class="rounded-full" />
  <TabsList variant="line" />
  <code class="font-semibold">id</code>
  <span class="text-sm">Catalan col·lecció</span>
</template>`;
  assert.deepEqual(rules(vue), []);
});
test('index.html: the theme-color meta may name a colour', () => {
  assert.deepEqual(rules('<meta name="theme-color" content="#17356E" />\n<div style="color: #17356E"></div>', 'index.html'), ['raw-colour']);
});
test('a .css file: token definitions are fine, raw colours in rules are not', () => {
  assert.deepEqual(rules(':root {\n  --x: #fff;\n}\n.a { color: #000; }', 'a.css'), ['raw-colour']);
});
const canonical = fs.readFileSync(new URL('../../packages/design/styles.css', import.meta.url), 'utf8');
test('theme diff: the package against itself is clean', () => {
  const d = diff(canonical, canonical);
  assert.deepEqual([d.light.length, d.dark.length], [0, 0]);
});
test('theme diff ignores how a value is written, not what it is', () => {
  const light = themes(canonical).light;
  const css = canonical.replace(/--blue-50:\s*#EDF2FA/i, '--blue-50: #edf2fa').replace(/--radius:\s*8px/, '--radius: 0.5rem');
  assert.equal(diff(css, canonical).light.length, 0, `blue-50 ${light['blue-50']}, radius ${light.radius}`);
  assert.equal(diff(canonical.replace(/--blue-50:\s*#EDF2FA/i, '--blue-50: #000000'), canonical).light.some((x) => x.token === 'blue-50'), true);
});
test('theme parser: one-line and nested rules never leak into the theme', () => {
  const css = `${canonical}\n:root { --app-header-offset: 52px; }\n.topbar {\n  --background: #17356e;\n}\n@media (max-width: 640px) {\n  :root { --background: #000; }\n}\n`;
  assert.equal(themes(css).light.background, themes(canonical).light.background);
});

test('theme diff follows aliases independently in light and dark modes', () => {
  const source = ':root {\n--blue-700: #17356E;\n--blue-300: #7C9FD7;\n--primary: var(--blue-700);\n}\n.dark {\n--primary: var(--blue-300);\n}';
  const delta = diff(source.replace('#7C9FD7', '#FFFFFF'), source);
  assert(delta.dark.some(d => d.token === 'primary' && d.actual === '#FFFFFF'));
  assert(!delta.light.some(d => d.token === 'primary'));
});

// Legacy families: an app is only redesigned when none of these remain.
const family = (text, file) => audit(text, file).map((f) => `${f.rule} ${f.value}`);
test('foreign-ui: UI kit imports and plugins in script blocks and modules, not our own packages', () => {
  const vue = `<template><Button>Go</Button></template>\n<script setup>\nimport Button from 'primevue/button'\nimport { Card } from '@/components/ui/card'\nimport x from 'vuetify/components'\n</script>`;
  assert.deepEqual(family(vue, 'View.vue'), ['foreign-ui primevue/button', 'foreign-ui vuetify/components']);
  const main = `import PrimeVue from 'primevue/config'\nimport ToastService from 'primevue/toastservice'\nconst Lazy = () => import('element-plus')\napp.use(PrimeVue, { ripple: true })\napp.use(vuetify)\nimport { Dialog } from '@headlessui/vue'\nimport { Button } from '@aisgroup/design'\nimport x from 'primevue-like'`;
  const got = audit(main, 'main.ts');
  assert.deepEqual(got.map((f) => [f.line, f.rule]), [[1, 'foreign-ui'], [2, 'foreign-ui'], [3, 'foreign-ui'], [4, 'foreign-ui'], [5, 'foreign-ui'], [6, 'foreign-ui']]);
  assert.match(got[0].fix, /design_code kind=migration name=primevue/);
  assert.match(got[4].fix, /name=vuetify/);
});
test('foreign-ui: package.json dependencies, on their own line', () => {
  const pkg = JSON.stringify({ name: 'app', dependencies: { vue: '^3', primevue: '^4', '@primeuix/themes': '^1', primeicons: '^7' }, devDependencies: { '@primevue/auto-import-resolver': '^4', '@lucide/vue': '^1' } }, null, 2);
  assert.deepEqual(audit(pkg, 'app/package.json').map((f) => [f.line, f.rule, f.value]), [[5, 'foreign-ui', 'primevue'], [6, 'foreign-theme', '@primeuix/themes'], [7, 'foreign-icons', 'primeicons'], [10, 'foreign-ui', '@primevue/auto-import-resolver']]);
  assert.deepEqual(audit(pkg, 'app/other.json'), []);
});
test('foreign-icons: icon classes in templates and menu models, icon packages, the old lucide-vue-next', () => {
  const vue = `<template>\n<i class="pi pi-check" />\n<v-icon icon="mdi-account" />\n<i class="fa-solid fa-user"></i><i class="fas fa-bell"></i>\n<span class="material-icons">home</span><i class="bi bi-alarm"></i>\n<Check class="size-4" />\n<p>So far away, bi-weekly, sofa-bed, api pi-x</p>\n</template>\n<script setup>\nimport { Check } from '@lucide/vue'\nimport { X } from 'lucide-vue-next'\nconst items = [{ label: 'Save', icon: 'pi pi-save' }]\nimport '@mdi/font/css/materialdesignicons.css'\n// was pi pi-trash\n</script>`;
  assert.deepEqual(audit(vue, 'Menu.vue').map((f) => `${f.line} ${f.value}`), ['2 pi pi-check', '3 mdi-account', '4 fa-solid fa-user', '4 fas fa-bell', '5 material-icons', '5 bi bi-alarm', '11 lucide-vue-next', '12 pi pi-save', '13 @mdi/font/css/materialdesignicons.css']);
  assert.deepEqual(rules(`@import "primeicons/primeicons.css";`, 'main.css'), ['foreign-icons']);
});
test('foreign-theme: presets, PrimeVue variables, deep selectors, !important and app @theme scales', () => {
  const preset = `import { definePreset } from '@primeuix/themes'\nimport Aura from '@primevue/themes/aura'\nexport default definePreset(Aura, {})\nconst v = createVuetify({})`;
  assert.deepEqual(rules(preset, 'theme.ts'), ['foreign-theme', 'foreign-theme', 'foreign-theme', 'foreign-theme']);
  const vue = `<template><div style="color: red !important">x</div></template>\n<style scoped>\n:deep(.p-datatable) { color: var(--p-primary-color) !important; }\n::v-deep .x { --p-button-padding: 0; }\n</style>`;
  assert.deepEqual(family(vue, 'T.vue'), ['foreign-theme !important', 'foreign-theme --p-primary-color', 'foreign-theme :deep(', 'foreign-theme !important', 'foreign-theme --p-button-padding', 'foreign-theme ::v-deep']);
  const css = `@import "tailwindcss";\n@theme {\n  --color-brand-500: #2563eb;\n  --color-primary: #2563eb;\n  --font-sans: Inter, sans-serif;\n  --color-chart-1: var(--chart-1);\n  --spacing-18: 4.5rem;\n}\n@theme inline {\n  --color-primary: var(--primary);\n  --font-sans: var(--font-family);\n  @keyframes pulse { 50% { opacity: .5; } }\n}`;
  assert.deepEqual(audit(css, 'app.css').map((f) => `${f.line} ${f.value}`), ['3 --color-brand-500: #2563eb;', '4 --color-primary: #2563eb;', '5 --font-sans: Inter, sans-serif;']);
});
test('foreign-theme: our own theme pasted into the app passes', () => {
  assert.deepEqual(audit(canonical, 'src/ais-theme.css').filter((f) => f.rule !== 'raw-colour' && f.rule !== 'separator'), []);
});
test('brand-name: misspellings in template text, i18n strings, index.html and manifests', () => {
  const vue = `<template>\n<h1>Bienvenido a AISVision</h1>\n<p>Part of AIS GROUP, with RosePetal and AIS scanology</p>\n<img alt="Ais Vision Automation" src="/img/AISVision/logo.png" />\n<p>AIS Vision Systems, AIS Group, Rosepetal, AIS Vision Automation, AIS Scanology</p>\n</template>\n<script setup>\nconst t = 'AISVision'\n</script>`;
  assert.deepEqual(audit(vue, 'Home.vue').map((f) => `${f.line} ${f.value} ${f.fix.match(/«(.+)»/)[1]}`), ['2 AISVision AIS Vision Systems', '3 AIS GROUP AIS Group', '3 RosePetal Rosepetal', '3 AIS scanology AIS Scanology', '4 Ais Vision Automation AIS Vision Automation']);
  const es = `export default {\n  // AISVision in a comment\n  title: 'AISVision Nexus',\n  'RosePetal': "Rose Petal",\n  footer: \`AIS VISION SYSTEMS, S.L.\`,\n}`;
  assert.deepEqual(audit(es, 'src/i18n/es.ts').map((f) => `${f.line} ${f.value}`), ['3 AISVision', '4 Rose Petal', '5 AIS VISION SYSTEMS']);
  assert.deepEqual(audit(es, 'src/utils/strings.ts'), [], 'only i18n and locale files are text');
  assert.deepEqual(audit('{\n  "AISVision": "AISVision"\n}', 'src/locales/en.json').map((f) => f.line), [2]);
  assert.deepEqual(audit('<title>AIS VISION</title>', 'index.html').map((f) => f.value), ['AIS VISION']);
  assert.deepEqual(audit('{ "name": "RosePetal Cloud" }', 'public/site.webmanifest').map((f) => f.value), ['RosePetal']);
});
test('brand-name: never emails, domains, URLs, import paths, classes or identifiers', () => {
  const vue = `<template>\n<a href="mailto:info@RosePetal.ai">info@rosepetal.ai</a>\n<a href="https://AISVision.com/AISVision">aisvision.com</a>\n<div class="AISVision-header ROSEPETAL_X"><AISVisionLogo /></div>\n<p>{{ ROSEPETAL_API }} aisvision-nexus</p>\n</template>`;
  assert.deepEqual(rules(vue), []);
  const es = `import logo from '@/assets/AISVision/logo.png'\nexport default { mail: 'soporte@AISVision.com', web: 'www.AISVision.com', repo: 'aisvision-nexus', key: 'RosePetal_key' }`;
  assert.deepEqual(rules(es, 'src/i18n/es.ts'), []);
});

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ui-contract-'));
const write = (dir, files) => { for (const [f, body] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), body); } };
test('logo-file: logo-named images must be the official files, byte for byte', () => {
  const official = officialLogos(), dir = tmp();
  const real = fs.readFileSync(new URL('../../guide/public/logos/app/ais/favicon.ico', import.meta.url));
  const hex = fs.readFileSync(new URL('../../guide/public/examples/shared/print/assets/hex-printed-cover.svg', import.meta.url));
  write(dir, { 'public/favicon.ico': real, 'src/assets/brand/hex-cover.svg': hex, 'public/favicon.svg': '<svg/>', 'src/assets/brand/hex.svg': '<svg/>', 'src/assets/AisLogo.png': 'x', 'src/assets/checkmark.svg': '<svg/>', 'src/assets/catalogo.png': 'x', 'src/assets/logout.svg': '<svg/>', 'docs/marketing/shot.png': 'x', 'public/icons/icon-192.png': 'x', 'public/icons/icon-maskable-512.png': 'x' });
  const r = report([dir]);
  fs.rmSync(dir, { recursive: true, force: true });
  assert.deepEqual(r.findings.filter((f) => f.rule === 'logo-file').map((f) => f.value), ['public/favicon.svg', 'public/icons/icon-192.png', 'public/icons/icon-maskable-512.png', 'src/assets/AisLogo.png', 'src/assets/brand/hex.svg']);
  assert.match(r.findings[0].fix, /design_assets kind=favicon/);
  assert.match(audit('<p>AISVision</p>', 'x.html')[0].fix, /design_standards kind=guidelines section=brand-guidelines page=brands/);
  assert.deepEqual(auditLogo(real, 'favicon.ico', 'favicon.ico', official), []);
});
test('official-logos.json matches the guide\'s logo files, and the plugin carries the same audit', () => {
  const json = fs.readFileSync(new URL('../official-logos.json', import.meta.url), 'utf8');
  assert.deepEqual(JSON.parse(json), officialLogos(), 'run node scripts/ui-contract.mjs hashes');
  assert.equal(fs.readFileSync(new URL('../../plugin/scripts/official-logos.json', import.meta.url), 'utf8'), json);
  assert.equal(fs.readFileSync(new URL('../../plugin/scripts/ui-contract.mjs', import.meta.url), 'utf8'), fs.readFileSync(new URL('../ui-contract.mjs', import.meta.url), 'utf8'));
});
test('report: families, legacyFree, skipped folders; small-text stays advisory', () => {
  const dir = tmp();
  write(dir, {
    'package.json': '{ "dependencies": { "vue": "^3" } }',
    'src/App.vue': '<template><p class="text-xs">AIS Vision Systems</p></template>',
    'src/components/ui/button/Button.vue': '<template><i class="pi pi-check" /></template>',
    'src/components/blocks/Login.vue': '<template><h1 class="font-bold">x</h1></template>',
    'node_modules/primevue/index.js': "import 'primevue'", 'dist/app.js': "import 'primevue'", '.cache/x.ts': "import 'primevue'",
    'src/env.d.ts': "declare module 'primevue'",
  });
  const clean = report([path.join(dir, 'src'), dir]);
  assert.equal(clean.files, 2);
  assert.deepEqual([clean.legacyFree, clean.counts], [true, { 'small-text': 1 }]);
  assert.deepEqual(Object.keys(clean.families), ['template', 'foreign-ui', 'foreign-icons', 'foreign-theme', 'brand-name', 'logo-file']);
  write(dir, { 'src/main.ts': "import PrimeVue from 'primevue/config'\n", 'src/i18n/es.json': '{ "t": "AISVision" }' });
  const legacy = report([dir]);
  fs.rmSync(dir, { recursive: true, force: true });
  assert.equal(legacy.legacyFree, false);
  assert.deepEqual(legacy.families, { template: 0, 'foreign-ui': 1, 'foreign-icons': 0, 'foreign-theme': 0, 'brand-name': 1, 'logo-file': 0 });
});
test('audit stays linear on long files', () => {
  const ts = Array.from({ length: 20000 }, (_, i) => `export const k${i} = 'value ${i}'`).join('\n');
  const start = performance.now();
  audit(ts, 'src/i18n/es.ts');
  assert(performance.now() - start < 2000, 'a regex backtracks over the blanked regions');
});
