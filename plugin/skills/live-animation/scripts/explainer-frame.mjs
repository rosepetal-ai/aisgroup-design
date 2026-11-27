// Run on a paused viewer-controlled explainer, at a beat with visible station labels.
import assert from 'node:assert/strict';
import { chromium, CHROME_ARGS } from './lib.mjs';

const url = process.argv[2];
if (!url) throw new Error('Pass the URL of a paused explainer.');
const browser = await chromium.launch({ args: CHROME_ARGS, executablePath: process.env.CHROME_BIN || undefined });
try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url);
    const bar = page.locator('[data-slot="player-bar"]');
    await bar.waitFor();
    const canvas = page.locator('canvas:visible').first();
    await canvas.waitFor();
    const frame = await canvas.evaluate(el => {
      let { left, right, top, bottom } = el.getBoundingClientRect();
      for (let host = el.parentElement; host; host = host.parentElement) {
        const css = getComputedStyle(host);
        const box = host.getBoundingClientRect();
        if (css.overflowX !== 'visible') { left = Math.max(left, box.left); right = Math.min(right, box.right); }
        if (css.overflowY !== 'visible') { top = Math.max(top, box.top); bottom = Math.min(bottom, box.bottom); }
      }
      return { left, top, right, bottom };
    });
    assert.ok(frame.left <= 1 && frame.top <= 1 && frame.right >= width - 1 && frame.bottom >= height - 1,
      `Canvas clipped at ${width} × ${height}: ${JSON.stringify(frame)}`);
    const rect = await bar.boundingBox();
    assert.ok(rect && rect.y > height * 0.66 && rect.y + rect.height <= height + 1, 'Controls outside the lower stage');
    const markers = await page.locator('.hud-dot, .hud-leader-tip').evaluateAll(nodes =>
      nodes.filter(node => node.checkVisibility({ opacityProperty: true })).length);
    assert.equal(markers, 0, 'Legacy circular equipment markers visible');
    console.log(`${width} × ${height}: full canvas, lower player, no legacy marker circles`);
    await page.close();
  }
} finally {
  await browser.close();
}
