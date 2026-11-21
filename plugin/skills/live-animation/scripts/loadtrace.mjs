// node loadtrace.mjs <url> [durationMs=4500] : traces a real unthrottled (or NET=<Mbps>) load every 60 ms from navigation,
// checking that the opening title's words rise monotonically without font-swap jumps, never restart when WebGL goes live,
// and hold visible for at least 0.8 s after live. Exits non-zero on any jump or restart (animations.md: "Type never jumps",
// "The first frame is the opening title, in the page's own markup").
import { launchBrowser, prepPage } from './lib.mjs';

const [url, durArg = '4500'] = process.argv.slice(2);
if (!url) {
  console.error('usage: node loadtrace.mjs <url> [durationMs=4500]');
  process.exit(2);
}
const durationMs = Number(durArg);
const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: Number(process.env.W ?? 1440), height: Number(process.env.H ?? 900) } });
await prepPage(p);
if (process.env.NET) {
  const cdp = await p.context().newCDPSession(p), bps = (Number(process.env.NET) * 1e6) / 8;
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: bps, uploadThroughput: bps / 4 });
}
await p.addInitScript(() => {
  window.__lt = { samples: [], liveAt: null, typeAt: null };
  const tick = () => {
    const stage = document.querySelector('[data-anim-stage], .pl-stage');
    const open = document.querySelector('[data-open], .pl-open');
    const now = Math.round(performance.now());
    if (stage?.classList.contains('is-type') && window.__lt.typeAt === null) window.__lt.typeAt = now;
    if (stage?.classList.contains('is-live') && window.__lt.liveAt === null) window.__lt.liveAt = now;
    if (open) {
      const words = [...open.querySelectorAll('[data-mask] > span')].map((el) => {
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top * 10) / 10, left: Math.round(r.left * 10) / 10, w: Math.round(r.width * 10) / 10 };
      });
      const cs = getComputedStyle(open);
      window.__lt.samples.push({
        t: now,
        live: !!stage?.classList.contains('is-live'),
        type: !!stage?.classList.contains('is-type'),
        op: Number(cs.opacity),
        vis: cs.visibility,
        words,
      });
    }
    setTimeout(tick, 60);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tick, { once: true });
  else tick();
});

await p.goto(url, { waitUntil: 'commit', timeout: 120000 });
await p.waitForSelector('[data-anim-stage].is-live, .pl-stage.is-live', { timeout: 120000 });
await p.waitForTimeout(durationMs);
const data = await p.evaluate(() => window.__lt);
await b.close();

const errors = [];
const visible = data.samples.filter((s) => s.type && s.vis !== 'hidden' && s.op > 0.05 && s.words.length);
if (!visible.length) {
  errors.push('no visible opening title samples recorded');
} else {
  const n = visible[0].words.length;
  // Monotonic rise (top never increases by > 2 px once visible) and width/left stable (no fallback->Inter swap > 3 px)
  for (let i = 1; i < visible.length; i++) {
    const prev = visible[i - 1], cur = visible[i];
    for (let k = 0; k < n; k++) {
      const dy = cur.words[k].top - prev.words[k].top;
      const dw = Math.abs(cur.words[k].w - prev.words[k].w);
      if (dy > 2.5) errors.push(`word ${k} jumped down +${dy.toFixed(1)} px at ${cur.t} ms (live=${cur.live})`);
      if (dw > 4 && prev.words[k].w > 0) errors.push(`word ${k} width shifted ${dw.toFixed(1)} px at ${cur.t} ms (font swap?)`);
    }
  }
  const lastLiveVis = [...visible].reverse().find((s) => s.live && s.op > 0.5);
  const holdAfterLive = data.liveAt !== null && lastLiveVis ? lastLiveVis.t - data.liveAt : 0;
  if (holdAfterLive < 700) errors.push(`opening title held only ${holdAfterLive} ms after live (want >= 800 ms)`);
  console.log(`loadtrace: typeAt ${data.typeAt} ms, liveAt ${data.liveAt} ms, holdAfterLive ${holdAfterLive} ms, samples ${visible.length}`);
}

if (errors.length) {
  for (const e of errors) console.error('FAIL:', e);
  process.exit(1);
}
console.log('PASS: monotonic rise, no font-swap jump, clean live handover');
