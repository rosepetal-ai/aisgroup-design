// node perf.mjs <url> [seconds=0] : measures load marks, file transfer sizes (>20 KB), and playback frame times.
// Checks /proc/loadavg first (warns if load > 4). Exits 1 if any playback frame exceeds MAX_FRAME_MS (default 250).
// Env: W=1440, H=900, NET=<Mbps> (40 ms latency), MAX_FRAME_MS=250.
import fs from 'node:fs';
import { launchBrowser, LIVE_SEL, prepPage } from './lib.mjs';

const [url, secs = '0'] = process.argv.slice(2);
if (!url) { console.error('usage: node perf.mjs <url> [seconds=0]'); process.exit(2); }
if (fs.existsSync('/proc/loadavg')) {
  const load1 = Number(fs.readFileSync('/proc/loadavg', 'utf8').split(/\s+/)[0]);
  if (load1 > 4) console.warn(`WARN: /proc/loadavg 1m=${load1.toFixed(2)} (> 4): numbers may be noisy`);
}
const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: Number(process.env.W ?? 1440), height: Number(process.env.H ?? 900) } });
await prepPage(p);
if (process.env.NET) {
  const cdp = await p.context().newCDPSession(p), bps = (Number(process.env.NET) * 1e6) / 8;
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: bps, uploadThroughput: bps / 4 });
}
await p.goto(url, { waitUntil: 'commit', timeout: 120000 });
await p.waitForSelector(LIVE_SEL, { timeout: 90000 });
const load = await p.evaluate(() => ({
  live: Math.round(performance.now()),
  marks: performance.getEntriesByType('mark').filter((m) => /^(pl|anim):/.test(m.name)).map((m) => [m.name.replace(/^(pl|anim):/, ''), Math.round(m.startTime)]),
  fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
  files: performance.getEntriesByType('resource').filter((r) => r.transferSize > 20000).map((r) => [r.name.replace(location.origin, ''), Math.round(r.transferSize / 1024), Math.round(r.startTime), Math.round(r.responseEnd)]),
}));
console.log(`live by ${load.live} ms, first paint ${load.fcp} ms; ${load.marks.map(([n, t]) => `${n} ${t}`).join(', ')} (ms from navigation)`);
const kb = load.files.reduce((a, f) => a + f[1], 0);
console.log(`files over 20 KB: ${kb} KB`);
for (const [n, k, s, e] of load.files.sort((a, b) => b[1] - a[1])) console.log(`  ${String(k).padStart(5)} KB  ${s}–${e} ms  ${n}`);
let failed = false;
if (Number(secs) > 0) {
  await p.evaluate(() => { const d = (window.__fd = []); let last = performance.now(); const f = (n) => { d.push(n - last); last = n; requestAnimationFrame(f); }; requestAnimationFrame(f); });
  await p.waitForTimeout(Number(secs) * 1000);
  const d = await p.evaluate(() => window.__fd), s = [...d].sort((a, c) => a - c);
  const over = (ms) => d.filter((x) => x > ms).length;
  const maxAllowed = Number(process.env.MAX_FRAME_MS ?? 250);
  console.log(`frames ${d.length}, median ${s[d.length >> 1].toFixed(1)} ms, p95 ${s[Math.floor(d.length * 0.95)].toFixed(1)} ms, over 50 ms ${over(50)}, over 100 ms ${over(100)}, over 250 ms ${over(250)} (max ${s.at(-1).toFixed(0)} ms)`);
  if (over(maxAllowed) > 0) {
    console.error(`FAIL: ${over(maxAllowed)} frame(s) over ${maxAllowed} ms`);
    failed = true;
  }
}
await b.close();
if (failed) process.exit(1);
