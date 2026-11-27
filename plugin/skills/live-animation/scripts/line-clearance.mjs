import assert from 'node:assert/strict';
import { chromium, CHROME_ARGS } from './lib.mjs';

const [url, duration, actors, segments, obstacles] = process.argv.slice(2);
if (!url || !(Number(duration) > 0) || !actors || !segments || !obstacles) {
  throw Error(
    'Usage: node line-clearance.mjs URL seconds actorsCSV segmentsCSV obstaclesCSV (use - for no actors)',
  );
}
const browser = await chromium.launch({
  args: CHROME_ARGS,
  executablePath: process.env.CHROME_BIN || undefined,
});
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(
    () => window.__anim?.clearance && window.__anim?.transport,
  );
  const report = await page.evaluate((end) => {
    const a = window.__anim,
      actors = new Set(),
      segments = new Set(),
      obstacles = new Set(),
      faults = new Map();
    let frames = 0;
    for (let i = 0; i <= Math.ceil(end * 60); i++) {
      const t = Math.min(end, i / 60);
      a.seek(t);
      const body = a.clearance(),
        products = a.transport();
      for (const x of body.actors) actors.add(x);
      for (const x of body.obstacles) obstacles.add(x);
      for (const x of products.seen) segments.add(x);
      for (const x of body.hits) {
        if (!Number.isFinite(x.depth)) throw Error('Invalid depth at ' + t);
        if (x.crossed || x.depth > 0.002) {
          const key = x.actor + '/' + x.wall,
            prior = faults.get(key);
          if (!prior || x.depth > prior.depth) faults.set(key, { t, ...x });
        }
      }
      for (const x of products.hits)
        if (!faults.has(x)) faults.set(x, { t, fault: x });
      frames++;
    }
    return {
      frames,
      actors: [...actors],
      segments: [...segments],
      obstacles: [...obstacles],
      faults: [...faults.values()],
    };
  }, Number(duration));
  console.log(JSON.stringify(report));
  for (const [wanted, observed] of [
    [actors, report.actors],
    [segments, report.segments],
    [obstacles, report.obstacles],
  ]) {
    for (const name of wanted.split(',').filter((n) => n !== '-'))
      assert.ok(observed.includes(name), 'Missing coverage for ' + name);
  }
  assert.deepEqual(errors, []);
  assert.equal(report.faults.length, 0, 'Geometry failures in report');
} finally {
  await browser.close();
}
