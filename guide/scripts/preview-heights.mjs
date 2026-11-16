#!/usr/bin/env node
// Measures every component preview frame on the built guide (desktop, 1440 px wide) and writes their heights to
// src/data/preview-heights.json. The pages give each frame that height from the start, so nothing below a preview
// moves when it loads; the preview's own height message still corrects it on other widths or after a change.
//   npm run build -w guide && node guide/scripts/preview-heights.mjs     (then build again to use the heights)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const GUIDE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(GUIDE, 'dist'), OUT = path.join(GUIDE, 'src/data/preview-heights.json');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let file = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(fs.readFileSync(file));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

// The English pages that hold previews (the other languages show the same frames at the same width).
const pages = [];
const walk = (dir) => { for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
  const p = path.join(dir, d.name);
  if (d.isDirectory()) walk(p); else if (d.name === 'index.html' && fs.readFileSync(p, 'utf8').includes('class="preview"')) pages.push('/' + path.relative(DIST, path.dirname(p)) + '/');
} };
walk(path.join(DIST, 'en'));

const heights = {};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const url of pages) {
  await page.goto(base + url, { waitUntil: 'networkidle' });
  // Lazy frames load as they come near the screen: walk down the page, then wait for every frame to report.
  for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 600) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.waitForLoadState('networkidle'); await page.waitForTimeout(800);
  // A light/dark pair (.theme-previews) is half as wide, so taller: its frames have their own key.
  const found = await page.evaluate(() => [...document.querySelectorAll('iframe.preview')].map((f) => [new URL(f.src).pathname + new URL(f.src).search + (f.closest('.theme-previews') ? '#pair' : ''), parseFloat(f.style.height) || 0]));
  for (const [src, h] of found) if (h) heights[src] = Math.max(heights[src] || 0, Math.round(h));
}
await browser.close(); server.close();
fs.writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(heights).sort()), null, 1) + '\n');
console.log(`preview-heights: ${Object.keys(heights).length} frames on ${pages.length} pages -> ${path.relative(process.cwd(), OUT)}`);
