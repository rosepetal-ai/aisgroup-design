// The product-UI audit and theme diff, on the cases that broke them on real apps.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { audit, diff } from '../ui-contract.mjs';
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
