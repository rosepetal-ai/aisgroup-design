import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { start } from '../server.mjs';
import { allowedDownload } from '../download-policy.mjs';
import { LIMITS } from '../tools.mjs';

let server, client;
before(async () => {
  server = await start({ port: 0, host: '127.0.0.1', ratePerMinute: 1000 }); // many calls in one minute; the limit has its own test
  client = new Client({ name: 'download-test', version: '1.0.0' });
  await client.connect(new StreamableHTTPClientTransport(new URL(server.url + '/mcp')));
});
after(async () => { await client?.close(); await server?.close(); });
const call = async (name, args) => {
  const r = await client.callTool({ name, arguments: args });
  assert(!r.isError, r.content[0].text);
  return JSON.parse(r.content[0].text);
};
test('four download surfaces are read-only, non-destructive and below 700 estimated tokens', async t => {
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map(t => t.name).sort(), ['design_assets', 'design_code', 'design_examples', 'design_standards']);
  const estimate = Math.ceil(client.getInstructions().length / 4) + tools.reduce((n, t) => n + Math.ceil(JSON.stringify(t).length / 4), 0);
  t.diagnostic(`instructions and schemas: ~${estimate} tokens`);
  assert(estimate < 700, `~${estimate}`);
  for (const tool of tools) { assert.equal(tool.annotations.readOnlyHint, true); assert.equal(tool.annotations.destructiveHint, false); }
});
test('Code searches existing components and serves both generated adapters', async () => {
  const r = await call('design_code', { query: 'button' });
  assert(r.items.some(i => i.name === 'button'));
  for (const kind of ['primevue', 'vuetify']) {
    const adapter = await call('design_code', { kind });
    assert.equal((await fetch(adapter.url)).status, 200);
    assert.equal((await fetch(adapter.mapping)).status, 200);
    assert(adapter.text.includes(kind === 'primevue' ? 'definePreset' : 'aisLight'));
  }
});
test('Code serves the websites\' package: every catalogued component, its source, examples and files', async () => {
  const list = await call('design_code', { kind: 'web' });
  const catalog = fs.readFileSync(new URL('../../packages/web/catalog.ts', import.meta.url), 'utf8');
  const ids = [...catalog.matchAll(/\{\s*id:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);
  assert.deepEqual(list.items.map(i => i.name).sort(), ids.sort());
  for (const f of list.setup) assert.equal((await fetch(f)).status, 200);
  const frame = await call('design_code', { kind: 'web', name: 'browser-frame' });
  assert(frame.text.includes('// components/browser-frame/BrowserFrame.astro') && frame.text.includes('// examples/browser-frame/'));
  for (const u of frame.urls) assert.equal((await fetch(u)).status, 200);
  const band = await call('design_code', { kind: 'web', name: 'closing-band' });
  assert(band.text.includes("tone"), 'closing band source has its page tone');
  const footer = await call('design_code', { kind: 'web', name: 'footer' });
  assert(footer.text.includes('<slot name="after"'), 'footer source has its after slot');
});
test('Examples exposes existing software HTML, registry source and images without publishing models', async () => {
  const views = await call('design_examples', { type: 'software-view' });
  assert(views.total > 0);
  const view = await call('design_examples', { id: views.examples[0].id });
  assert.match(view.text, /<!DOCTYPE html>|<html/i);
  assert(view.registry.endsWith('.json'));
  assert((await call('design_examples', { type: 'image' })).total > 0);
  assert((await call('design_examples', { type: 'pdf' })).total > 0);
  const models = await call('design_examples', { type: '3d-model' });
  assert.equal(models.total, 0); assert.match(models.pending, /Pending a brand decision/);
});
test('unapproved mascots remain empty; machine models are excluded from downloads and the snapshot', async () => {
  const mascots = await call('design_assets', { kind: 'mascot' });
  assert.equal(mascots.total, 0); assert.match(mascots.pending, /Held back/);
  for (const ext of ['glb', 'gltf', 'step', 'stp', 'stl', 'blend', 'obj', 'fbx', 'sldprt']) {
    assert.equal(allowedDownload(`downloads/machine.${ext}`), false);
    assert.equal((await fetch(`${server.url}/files/downloads/machine.${ext}`)).status, 404);
  }
  for (const file of fs.readdirSync(new URL('../data/', import.meta.url), { recursive: true })) assert(allowedDownload(file), file);
});

const refusal = async (name, args) => {
  const r = await client.callTool({ name, arguments: args });
  assert(r.isError, `${name} ${JSON.stringify(args)} should fail`);
  return JSON.parse(r.content[0].text).error;
};
// Every chunk of a design_code answer, joined; the first chunk's other fields.
const readAll = async (args) => {
  let first, text = '';
  for (let offset = 0; offset !== null;) {
    const r = await call('design_code', { ...args, offset });
    assert(r.text.length <= LIMITS.chunkChars);
    first ??= r; text += r.text; offset = r.next;
  }
  return { ...first, text };
};
const DATA = new URL('../data/', import.meta.url);

test('Code search matches each word, hyphens and case ignored, most hits first', async () => {
  for (const query of ['topbar', 'Top-Bar', 'top bar']) assert.equal((await call('design_code', { query })).items[0].name, 'top-bar', query);
  const shell = (await call('design_code', { query: 'login top bar sidebar app shell' })).items.map(i => i.name);
  // The shell blocks, PageLayout included, come before anything else
  assert.deepEqual(shell.slice(0, 4).sort(), ['login-page', 'page-layout', 'sidebar', 'top-bar'], shell.join(', '));
  assert.equal((await call('design_code', { query: 'zzz' })).items.length, 0);
  assert.equal((await call('design_code', { kind: 'web', query: 'browserframe' })).items[0].name, 'browser-frame');
  assert.equal((await call('design_examples', { type: 'software-view', query: 'topbar' })).examples[0].id, 'software-top-bar');
});

test('Code returns a component with its package examples, in chunks under the budget', async () => {
  const dir = new URL('../../packages/design/examples/top-bar/', import.meta.url);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue')).sort();
  const bar = await readAll({ name: 'top-bar' });
  assert.deepEqual(bar.examples, files.map(f => `examples/top-bar/${f}`));
  for (const f of files) assert(bar.text.includes(`// examples/top-bar/${f}\n${fs.readFileSync(new URL(f, dir), 'utf8')}`), f);
  assert.match(bar.text, /variant="topbar-/, 'the topbar button variants are shown');
  assert.equal(bar.install, `npx shadcn-vue@latest add ${server.url}/r/top-bar.json`);
  // The registry item alone is over the answer budget; it reads back whole, in order.
  const item = JSON.parse(fs.readFileSync(new URL('r/sidebar.json', DATA), 'utf8'));
  assert(JSON.stringify(item).length > LIMITS.responseBytes);
  const side = await readAll({ name: 'sidebar' });
  assert.equal(side.text.length, side.total);
  assert.deepEqual(side.files, item.files.map(f => f.path));
  assert(side.text.startsWith(item.files.map(f => `// ${f.path}\n${f.content}`).join('\n\n')));
  assert(side.examples.length > 0 && side.text.includes(`// ${side.examples[0]}\n`));
});

test('PrimeVue and Vuetify serve the preset, base.css, README and tokens by name', async () => {
  const want = { preset: null, base: 'base.css', readme: 'README.md', tokens: 'tokens.json' };
  for (const kind of ['primevue', 'vuetify']) {
    for (const [name, file] of Object.entries({ ...want, preset: `${kind}.mjs` })) {
      const r = await readAll({ kind, name });
      assert.equal(r.file, file);
      assert.deepEqual(r.names, Object.keys(want));
      assert.equal(r.text, fs.readFileSync(new URL(`downloads/vue-themes/${file}`, DATA), 'utf8'), `${kind} ${name}`);
      assert.equal((await fetch(r.url)).status, 200, r.url);
    }
    assert.equal((await call('design_code', { kind })).file, `${kind}.mjs`, 'the preset by default');
    for (const name of ['base.css', 'README.md', `${kind}.mjs`]) assert.equal((await call('design_code', { kind, name })).file, name, 'a file name works too');
    for (const name of ['nope', 'constructor', kind === 'primevue' ? 'vuetify.mjs' : 'primevue.mjs']) assert.match(await refusal('design_code', { kind, name }), /Names: preset, base, readme, tokens/);
  }
});

test('Code lists the migration maps of the snapshot', async () => {
  const list = await call('design_code', { kind: 'migration' });
  assert.deepEqual(list.maps.map(m => m.name), ['icons', 'primevue', 'vuetify']);
  for (const m of list.maps) {
    assert(m.entries > 0, m.name);
    const map = await readAll({ kind: 'migration', name: m.name });
    assert.deepEqual(JSON.parse(map.text), JSON.parse(fs.readFileSync(new URL(`migration/${m.name}.json`, DATA), 'utf8')));
  }
  assert.match(await refusal('design_code', { kind: 'migration', name: 'nope' }), /Maps: icons, primevue, vuetify/);
});

test('Examples advertises every type and refuses an unknown one with the full list', async () => {
  const { tools } = await client.listTools();
  const types = tools.find(t => t.name === 'design_examples').inputSchema.properties.type.enum;
  for (const t of ['brochure', 'catalogue', 'datasheet', 'presentation', 'stationery', 'post', 'software-view', 'pdf', 'image', '3d-model']) assert(types.includes(t), t);
  const error = await refusal('design_examples', { type: 'software' });
  for (const t of types) assert(error.includes(`"${t}"`), `${t} missing from: ${error}`);
});

test('the Tailwind theme defines each utility once', async () => {
  for (const [name, args] of [['design_code', { kind: 'tailwind' }], ['design_standards', { kind: 'tokens', format: 'tailwind' }]]) {
    const { text } = await call(name, args);
    const utilities = [...text.matchAll(/^@utility ([\w-]+)/gm)].map(m => m[1]);
    for (const u of ['no-scrollbar', 'scrollbar-thumb-transparent', 'scrollbar-track-transparent']) assert.equal(utilities.filter(x => x === u).length, 1, u);
    assert.equal(new Set(utilities).size, utilities.length, utilities.join(', '));
  }
});
