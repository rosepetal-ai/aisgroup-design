// Check the integrated PlayerBar on the customer's page. Pass its URL with the film paused if supported.
import assert from 'node:assert/strict';
import { checkButtonInk } from './button-ink.mjs';
import { chromium, CHROME_ARGS } from './lib.mjs';

const url = process.argv[2];
if (!url) throw new Error('Expected the explainer URL');
const browser = await chromium.launch({ args: CHROME_ARGS, executablePath: process.env.CHROME_BIN || undefined });
try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor:2 });
    await page.goto(url);
    const bar = page.locator('[data-slot="player-bar"]');
    const play = bar.locator('[data-play]');
    await play.waitFor();
    await bar.getByRole('slider').waitFor();
    const original = await play.getAttribute('aria-label');
    await play.click();
    await page.waitForFunction(label => document.querySelector('[data-play]')?.getAttribute('aria-label') !== label, original);
    await play.click();
    if (width === 1440) {
      await checkButtonInk(page,bar);
      const shifted=await page.addStyleTag({content:'[data-slot="player-bar"] [data-player-label]{transform:translateY(-3px)!important}'});
      try {
        await assert.rejects(checkButtonInk(page,bar),/offset/,'A shifted label must fail even with a centred button');
      } finally { await shifted.evaluate(el=>el.remove()); }
      const joins = await bar.locator('[data-slot="toggle-group"]:visible').evaluateAll(groups => groups.flatMap(group => {
        const items = Array.from(group.querySelectorAll('[data-slot="toggle-group-item"]'));
        return items.slice(1).map((item, i) => {
          const previous = items[i];
          const gap = item.getBoundingClientRect().left - previous.getBoundingClientRect().right;
          return {
            label: item.textContent.trim(), gap,
            border: parseFloat(getComputedStyle(previous).borderRightWidth) + parseFloat(getComputedStyle(item).borderLeftWidth),
          };
        });
      }));
      assert.ok(joins.length, 'No chapter or speed group on desktop');
      for (const join of joins) {
        assert.equal(join.border, 1, 'Shared border at ' + join.label);
        assert.ok(Math.abs(join.gap) < 0.1, 'Gap at ' + join.label);
      }
      console.log('Desktop shared 1 px dividers:', joins.length);
    } else {
      await bar.locator('button[aria-haspopup="menu"]:visible').click();
      const menu = page.getByRole('menu');
      await menu.waitFor();
      await checkButtonInk(page,menu);
      const rect = await menu.boundingBox();
      assert.ok(rect && rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= width && rect.y + rect.height <= height, 'Menu clipped');
      assert.ok(await menu.getByRole('menuitemradio').count(), 'Missing player options');
      await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'hidden' });
      console.log('Phone play/pause and options menu passed');
    }
    await page.close();
  }
} finally {
  await browser.close();
}
