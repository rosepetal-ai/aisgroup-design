import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { start } from '../server.mjs';
import { allowedDownload } from '../download-policy.mjs';

let server, client;
before(async () => {
  server = await start({ port: 0, host: '127.0.0.1' });
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
