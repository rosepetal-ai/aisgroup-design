// The Firebase entry: the request body arrives already read (req.rawBody) and download links point at the guide.
import assert from 'node:assert/strict';
import { Readable, Writable } from 'node:stream';
import test from 'node:test';
import { createApp } from '../server.mjs';

test('function handler answers from rawBody and links files to the guide', async () => {
  const app = createApp({ filesBase: 'https://guide.example', trustProxy: true });
  const body = Buffer.from(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'design_assets', arguments: { query: 'rosepetal logo', kind: 'logo' } } }));
  const req = Object.assign(Readable.from([]), { method: 'POST', url: '/mcp', rawBody: body, socket: {},
    headers: { host: 'x', 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'x-forwarded-for': '1.2.3.4' },
    headersDistinct: { host: ['x'], 'content-type': ['application/json'], accept: ['application/json, text/event-stream'] } });
  const out = []; let status;
  const res = Object.assign(new Writable({ write(c, _e, cb) { out.push(Buffer.from(c)); cb(); } }), { headersSent: false, setHeader() {}, writeHead(s) { status = s; this.headersSent = true; } });
  await app.handle(req, res);
  await app.close();
  const text = Buffer.concat(out).toString();
  const json = JSON.parse(text.startsWith('{') ? text : text.split('\n').find((l) => l.startsWith('data:')).slice(5));
  assert.equal(status, 200);
  const result = JSON.parse(json.result.content[0].text);
  assert.ok(result.assets.length > 0);
  for (const a of result.assets) assert.match(a.url, /^https:\/\/guide\.example\/logos\//);
});

test('function mode does not serve files itself', async () => {
  const app = createApp({ filesBase: 'https://guide.example' });
  let status;
  const res = { setHeader() {}, writeHead(s) { status = s; }, end() {} };
  await app.handle({ method: 'GET', url: '/files/logos/rosepetal-blue.svg', headers: {}, socket: {} }, res);
  await app.close();
  assert.equal(status, 404);
});
