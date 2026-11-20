// The Firebase entry: the request body arrives already read (req.rawBody) and download links point at the guide.
import assert from 'node:assert/strict';
import { Readable, Writable } from 'node:stream';
import test from 'node:test';
import { createApp } from '../server.mjs';
import { mcp } from '../function.mjs';

const RUN_HOST = 'mcp-4sqwbjj4zq-ew.a.run.app'; // the Cloud Run host the hosting rewrite calls the function on

// One tools/call through a handler, as the Firebase front end hands it over; the tool's answer text.
async function rpc(handle, name, args, headers = {}) {
  const all = { host: RUN_HOST, 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...headers };
  const req = Object.assign(Readable.from([]), { method: 'POST', url: '/mcp', socket: {}, headers: all, header: (k) => all[k.toLowerCase()],
    rawBody: Buffer.from(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })),
    headersDistinct: Object.fromEntries(Object.entries(all).map(([k, v]) => [k, [v]])) });
  const out = []; let status;
  const res = Object.assign(new Writable({ write(c, _e, cb) { out.push(Buffer.from(c)); cb(); } }), { headersSent: false, setHeader() {}, writeHead(s) { status = s; this.headersSent = true; } });
  await handle(req, res);
  const text = Buffer.concat(out).toString();
  const json = JSON.parse(text.startsWith('{') ? text : text.split('\n').find((l) => l.startsWith('data:')).slice(5));
  assert.equal(status, 200);
  return json.result.content[0].text;
}

test('function handler answers from rawBody and links files to the guide', async () => {
  const app = createApp({ filesBase: 'https://guide.example', trustProxy: true });
  const result = JSON.parse(await rpc(app.handle, 'design_assets', { query: 'rosepetal logo', kind: 'logo' }, { 'x-forwarded-for': '1.2.3.4' }));
  await app.close();
  assert.ok(result.assets.length > 0);
  for (const a of result.assets) assert.match(a.url, /^https:\/\/guide\.example\/logos\//);
});

test('the deployed function links to the public origin, never the Cloud Run host', async () => {
  const calls = [
    ['design_code', {}], ['design_code', { name: 'top-bar' }], ['design_code', { kind: 'tailwind' }], ['design_code', { kind: 'migration' }],
    ['design_code', { kind: 'primevue' }], ['design_code', { kind: 'vuetify', name: 'base' }], ['design_code', { kind: 'web' }], ['design_code', { kind: 'web', name: 'footer' }],
    ['design_assets', { kind: 'logo' }], ['design_assets', { kind: 'favicon' }], ['design_assets', { kind: 'photo' }], ['design_assets', { kind: 'font' }],
    ['design_examples', {}], ['design_examples', { type: 'software-view' }], ['design_examples', { id: 'software-top-bar' }], ['design_examples', { type: 'pdf' }], ['design_examples', { type: 'image' }],
    ['design_standards', {}], ['design_standards', { kind: 'guidelines' }], ['design_standards', { kind: 'rules' }],
  ];
  for (const [name, args] of calls) {
    const text = await rpc(mcp, name, args);
    assert(!text.includes('a.run.app'), `${name} ${JSON.stringify(args)} names the Cloud Run host`);
    // SVG namespaces (http://www.w3.org/…) are identifiers, not links.
    assert.doesNotMatch(text, /http:\/\/(?!www\.w3\.org\/)/, `${name} ${JSON.stringify(args)} has an http:// link`);
  }
  const list = JSON.parse(await rpc(mcp, 'design_code', {}));
  assert.equal(list.install, 'npx shadcn-vue@latest add https://aisgroup-design.web.app/r/<name>.json');
  assert.equal(JSON.parse(await rpc(mcp, 'design_code', { name: 'top-bar' })).install, 'npx shadcn-vue@latest add https://aisgroup-design.web.app/r/top-bar.json');
});

test('behind a trusted proxy, links follow x-forwarded-host and x-forwarded-proto', async () => {
  const forwarded = { 'x-forwarded-host': 'design.aisgroup.ai', 'x-forwarded-proto': 'https' };
  const trusted = createApp({ filesBase: 'https://guide.example', trustProxy: true });
  assert.equal(JSON.parse(await rpc(trusted.handle, 'design_code', { name: 'button' }, forwarded)).install, 'npx shadcn-vue@latest add https://design.aisgroup.ai/r/button.json');
  await trusted.close();
  const direct = createApp({ filesBase: 'https://guide.example' });
  assert.equal(JSON.parse(await rpc(direct.handle, 'design_code', { name: 'button' }, forwarded)).install, `npx shadcn-vue@latest add http://${RUN_HOST}/r/button.json`, 'forwarded headers are ignored unless trusted');
  await direct.close();
});

test('function mode does not serve files itself', async () => {
  const app = createApp({ filesBase: 'https://guide.example' });
  let status;
  const res = { setHeader() {}, writeHead(s) { status = s; }, end() {} };
  await app.handle({ method: 'GET', url: '/files/logos/rosepetal-blue.svg', headers: {}, socket: {} }, res);
  await app.close();
  assert.equal(status, 404);
});
