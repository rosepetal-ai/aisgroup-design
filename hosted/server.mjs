#!/usr/bin/env node
// The AIS Group Design MCP: streamable HTTP at /mcp (stateless), and /health. Read-only. AIS_MCP_TOKEN adds an
// optional bearer check. createApp() is the request handler; function.mjs serves it as a Firebase function behind the
// guide's hosting (files then come from the guide itself), start() serves it locally with the snapshot's files at /files/….
//   npm run build -w hosted && npm start -w hosted
import crypto from 'node:crypto';
import fs from 'node:fs';
import { allowedDownload } from './download-policy.mjs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMcpHandler } from '@modelcontextprotocol/server';
import { load, serverFactory } from './download-tools.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BODY_BYTES = 64 * 1024;
const TYPES = { '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.zip': 'application/zip', '.woff2': 'font/woff2' };
TYPES['.mp4'] = 'video/mp4';

export function createApp({ dataDir = path.join(HERE, 'data'), token, baseUrl, filesBase, corsOrigin, ratePerMinute = 120, trustProxy = false } = {}) {
  if (!fs.existsSync(path.join(dataDir, 'catalogue.json'))) throw new Error(`No snapshot in ${dataDir}. Run npm run hosted:build first.`);
  const data = load(dataDir), root = path.resolve(dataDir) + path.sep;
  const handler = createMcpHandler(serverFactory({ data, baseUrl, filesBase }), { maxRequestBodySize: BODY_BYTES });
  const digest = (s) => crypto.createHash('sha256').update(s).digest();
  const authorised = (req) => !token || crypto.timingSafeEqual(digest(req.headers.authorization ?? ''), digest(`Bearer ${token}`));
  // ponytail: fixed one-minute window per client in this process' memory; a shared store if it ever runs as several replicas.
  let hits = new Map();
  const timer = setInterval(() => { hits = new Map(); }, 60_000).unref();
  const client = (req) => (trustProxy && String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim()) || req.socket.remoteAddress;

  // ponytail: one handler for both hosts; Firebase hands over req with the body already read (req.rawBody).
  const handle = async (req, res) => {
    const send = (status, body, headers = {}) => { res.writeHead(status, { 'content-type': 'application/json', ...headers }); res.end(body === undefined ? undefined : JSON.stringify(body)); };
    try {
      res.setHeader('x-content-type-options', 'nosniff');
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/health') return send(200, { ok: true, version: data.catalogue.version, builtAt: data.catalogue.builtAt });
      const isMcp = url.pathname === '/mcp', isFile = !filesBase && url.pathname.startsWith('/files/');
      if (!isMcp && !isFile) return send(404, { error: 'Not found' });
      // CORS is off unless AIS_MCP_CORS_ORIGIN names the one browser origin allowed; other browser origins are refused.
      const origin = req.headers.origin;
      if (isMcp && origin && origin !== corsOrigin) return send(403, { error: 'Origin not allowed' });
      if (origin && origin === corsOrigin) res.setHeader('access-control-allow-origin', origin), res.setHeader('vary', 'Origin');
      if (req.method === 'OPTIONS' && origin && origin === corsOrigin) return send(204, undefined, { 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'authorization, content-type, mcp-protocol-version, mcp-method, mcp-name', 'access-control-max-age': '600' });
      if (!authorised(req)) return send(401, { error: 'Unauthorised' }, { 'www-authenticate': 'Bearer' });
      const who = client(req), n = (hits.get(who) ?? 0) + 1;
      hits.set(who, n);
      if (n > ratePerMinute) return send(429, { error: 'Too many requests' }, { 'retry-after': '60' });

      if (isFile) {
        if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, { error: 'Method not allowed' }, { allow: 'GET, HEAD' });
        let file;
        try { file = path.resolve(root, decodeURIComponent(url.pathname.slice('/files/'.length))); } catch { return send(400, { error: 'Bad path' }); }
        if (!allowedDownload(file) || !file.startsWith(root) || !fs.statSync(file, { throwIfNoEntry: false })?.isFile()) return send(404, { error: 'Not found' });
        // Downloads are files, not pages: the sandbox stops an SVG or an HTML template from running scripts here.
        res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'content-length': fs.statSync(file).size, 'cache-control': 'private, max-age=3600', 'content-security-policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; font-src 'self'; sandbox" });
        if (req.method === 'HEAD') return res.end();
        return fs.createReadStream(file).pipe(res);
      }

      const chunks = [];
      let size = 0;
      if (req.rawBody) { size = req.rawBody.length; chunks.push(req.rawBody); }
      else for await (const c of req) { size += c.length; if (size > BODY_BYTES) break; chunks.push(c); }
      if (size > BODY_BYTES) return send(413, { error: 'Request too large' }, { connection: 'close' });
      const headers = new Headers();
      for (const [k, vs] of Object.entries(req.headersDistinct)) for (const v of vs) headers.append(k, v);
      // Behind a proxy (trustProxy) the public host and scheme are in x-forwarded-host and x-forwarded-proto; a configured
      // baseUrl still wins for every link the tools return (serverFactory).
      const forwarded = (h) => trustProxy && String(req.headers[h] ?? '').split(',')[0].trim();
      const self = `${forwarded('x-forwarded-proto') || 'http'}://${forwarded('x-forwarded-host') || req.headers.host || 'localhost'}`;
      const request = new Request(new URL(url.pathname + url.search, self), { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const response = await handler.fetch(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) for await (const c of response.body) res.write(c);
      res.end();
    } catch (e) {
      if (!res.headersSent) send(500, { error: 'Server error' }); else res.destroy();
      process.stderr.write(`${new Date().toISOString()} ${req.method} ${req.url}: ${e.stack ?? e}\n`);
    }
  };
  return { handle, close: async () => { clearInterval(timer); await handler.close(); } };
}

export async function start({ port = 8080, host = '0.0.0.0', ...options } = {}) {
  const app = createApp(options);
  const server = http.createServer(app.handle);
  server.requestTimeout = 30_000;
  await new Promise((ok, fail) => server.once('error', fail).listen(port, host, ok));
  const url = `http://${host === '0.0.0.0' ? 'localhost' : host}:${server.address().port}`;
  return { url, close: async () => { await app.close(); server.closeAllConnections(); await new Promise((ok) => server.close(ok)); } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = process.env;
  // No top-level await: the Functions runtime loads this file with require(), which refuses modules that await.
  start({ port: Number(env.PORT ?? 8080), host: env.HOST, token: env.AIS_MCP_TOKEN || undefined, baseUrl: env.AIS_MCP_BASE_URL?.replace(/\/$/, ''), corsOrigin: env.AIS_MCP_CORS_ORIGIN || undefined, ratePerMinute: Number(env.AIS_MCP_RATE_LIMIT ?? 120), trustProxy: env.AIS_MCP_TRUST_PROXY === '1' }).then((s) => {
    process.stderr.write(`AIS Group Design MCP on ${s.url}/mcp${env.AIS_MCP_TOKEN ? ' (bearer token required)' : ''}\n`);
    for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => s.close().then(() => process.exit(0)));
  });
}
