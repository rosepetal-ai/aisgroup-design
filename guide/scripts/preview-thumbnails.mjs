#!/usr/bin/env node
// Captures the thumbnail of every card on the component indexes (Product components, Blocks, Website components) from
// the built guide: the ?mini preview at the card's frame size, 2x for sharp screens, into public/previews/mini/.
// The indexes show these images, so a card appears at once instead of loading a live page per card.
// Run it again whenever a component's first example changes, or a new component is added (the build warns about a
// missing one and shows the live preview meanwhile):
//   npm run build -w guide && node guide/scripts/preview-thumbnails.mjs     (then build again)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const GUIDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(GUIDE, 'dist'), OUT = path.join(GUIDE, 'public/previews/mini');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let file = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(fs.readFileSync(file));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

// Every language shows the same previews: the English indexes list them all.
const sources = ['en/components', 'en/web-components'].flatMap((p) => [...fs.readFileSync(path.join(DIST, p, 'index.html'), 'utf8').matchAll(/data-thumb="([^"]+)" data-preview="([^"]+)"/g)].map((m) => ({ file: m[1], url: m[2] })));
if (!sources.length) throw new Error('No component cards found in dist: build the guide first.');

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
// The card frame is 252 x 170 px at three columns; the preview is laid out at twice that and shown at half size.
const page = await browser.newPage({ viewport: { width: 504, height: 340 }, deviceScaleFactor: 1 });
for (const { file, url } of sources) {
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800); // preview-mini.js refits until 1.5 s after load
  await page.screenshot({ path: path.join(OUT, path.basename(file)), animations: 'disabled' });
}
await browser.close(); server.close();
console.log(`preview-thumbnails: ${sources.length} images -> ${path.relative(process.cwd(), OUT)}`);
