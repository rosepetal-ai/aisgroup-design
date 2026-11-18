// The migration maps the design MCP serves (packages/vue-themes/migration): PrimeVue, Vuetify and icons to our components and Lucide.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = new URL('../../', import.meta.url);
const DIR = new URL('packages/vue-themes/migration/', ROOT);
const read = (n) => JSON.parse(fs.readFileSync(new URL(`${n}.json`, DIR), 'utf8'));
const maps = Object.fromEntries(['primevue', 'vuetify', 'icons'].map((n) => [n, read(n)]));
const lucide = createRequire(new URL('package.json', ROOT))('@lucide/vue');
const catalog = new Set([...fs.readFileSync(new URL('packages/design/catalog.ts', ROOT), 'utf8').matchAll(/\bid: ['"]([a-z-]+)['"]/g)].map((m) => m[1]));
// Components being added to packages/design: entries may target them, marked with needs, before they reach the catalog.
const PENDING = new Set(['data-table', 'number-field', 'calendar', 'range-calendar', 'date-picker', 'tags-input', 'multi-select', 'chart', 'stepper', 'pin-input', 'context-menu', 'command', 'tree', 'file-upload', 'timeline']);
const STATUS = new Set(['direct', 'compose', 'gap', 'remove']);
const dupes = (list) => list.filter((x, i) => list.indexOf(x) !== i);

for (const name of ['primevue', 'vuetify']) {
  test(`${name}: entries target real components, with needs for the pending ones`, () => {
    const { entries } = maps[name];
    assert.ok(entries.length > 100, 'the whole library is mapped');
    assert.deepEqual(dupes(entries.map((e) => e.from)), [], 'no duplicate from');
    for (const e of entries) {
      const at = `${name} ${e.from}`;
      assert.ok(STATUS.has(e.status), `${at}: status ${e.status}`);
      assert.ok(typeof e.import === 'string' && e.import, `${at}: import`);
      assert.ok(typeof e.notes === 'string' && e.notes.trim(), `${at}: notes`);
      assert.ok(Array.isArray(e.to), `${at}: to is a list`);
      if (['direct', 'compose'].includes(e.status)) assert.ok(e.to.length, `${at}: ${e.status} needs a target`);
      for (const t of e.to) assert.ok(catalog.has(t) || PENDING.has(t), `${at}: ${t} is neither in catalog.ts nor pending`);
      for (const n of e.needs ?? []) assert.ok(PENDING.has(n), `${at}: needs ${n} is not a pending component`);
      for (const t of e.to.filter((t) => !catalog.has(t))) assert.ok(e.needs?.includes(t), `${at}: ${t} is not in the catalog yet, so needs must name it`);
      for (const [k, v] of Object.entries(e.props ?? {})) assert.ok(typeof v === 'string' && v, `${at}: prop ${k}`);
    }
  });
  test(`${name}: every Lucide icon it names exists`, () => {
    const own = new Set(maps[name].entries.flatMap((e) => e.from.split(/[^A-Za-z0-9]+/))); // InputIcon, VIcon: the library's own components
    const named = [...JSON.stringify(maps[name]).matchAll(/\b([A-Z][A-Za-z0-9]*Icon)\b/g)].map((m) => m[1]).filter((n) => !own.has(n));
    assert.deepEqual([...new Set(named.filter((n) => !(n in lucide)))], []);
  });
}

test('icons: every target is an @lucide/vue export, every from unique, brands null with a note', () => {
  const { icons } = maps.icons;
  assert.equal(maps.icons.lucide, createRequire(new URL('package.json', ROOT))('@lucide/vue/package.json').version, 'the map names the installed Lucide');
  assert.deepEqual(dupes(icons.map((i) => i.from)), [], 'no duplicate from');
  const prefix = { primeicons: 'pi-', mdi: 'mdi-', fontawesome: 'fa-' };
  for (const i of icons) {
    assert.ok(i.from.startsWith(prefix[i.set]), `${i.from}: set ${i.set}`);
    if (i.to === null) assert.ok(i.notes, `${i.from}: a null target says why`);
    else assert.ok(/Icon$/.test(i.to) && i.to in lucide, `${i.from}: ${i.to} is not an @lucide/vue export`);
  }
  for (const set of ['mdi', 'fontawesome']) assert.ok(icons.filter((i) => i.set === set).length >= 150, `${set} has the common icons`);
});

// primeicons is not a dependency of this repo: PRIMEICONS_CSS names one or more primeicons.css files (path-delimited);
// a workspace install is used when present.
test('icons: every icon in the installed primeicons CSS is covered', (t) => {
  const files = (process.env.PRIMEICONS_CSS ?? '').split(path.delimiter).filter(Boolean);
  if (!files.length) try { files.push(createRequire(new URL('package.json', ROOT)).resolve('primeicons/primeicons.css')); } catch {}
  if (!files.length) return t.skip('primeicons is not installed: run with PRIMEICONS_CSS=<path to primeicons.css>');
  const covered = new Set(maps.icons.icons.filter((i) => i.set === 'primeicons').map((i) => i.from));
  for (const f of files) {
    const names = [...fs.readFileSync(f, 'utf8').matchAll(/\.(pi-[a-z0-9-]+):before/g)].map((m) => m[1]);
    assert.ok(names.length > 100, `${f} lists the icons`);
    assert.deepEqual(names.filter((n) => !covered.has(n)), [], `${f}: icons missing from icons.json`);
  }
});

test('the maps follow the writing rules: no middle dots, no Unicode arrows', () => {
  for (const [name, map] of Object.entries(maps)) assert.doesNotMatch(JSON.stringify(map), /[\u00b7\u2190-\u21ff]/, name);
});
