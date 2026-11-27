import assert from 'node:assert/strict';
import { chromium, CHROME_ARGS } from '../../live-animation/scripts/lib.mjs';

const [url, selector = '[data-scene-caption]', name = 'Captions'] = process.argv.slice(2);
if (!url) throw Error('Usage: node captions.mjs pausedURL [captionSelector] [controlName]');
const browser = await chromium.launch({args: CHROME_ARGS, executablePath: process.env.CHROME_BIN || undefined});

async function check(page, phone) {
  await page.goto(url);
  const bar = page.locator('[data-slot="player-bar"]');
  const slider = bar.getByRole('slider');
  await slider.waitFor();
  const clock = async () => {
    const value = await slider.getAttribute('aria-valuenow');
    assert.ok(value !== null && Number.isFinite(Number(value)), 'Timeline needs an accessible time');
    return Number(value);
  };
  const menu = page.getByRole('menu');
  const trigger = bar.locator('button[aria-haspopup="menu"]:visible');
  async function control() {
    if (!phone) return bar.getByRole('button', {name, exact:true});
    if (!await menu.isVisible()) await trigger.click();
    return menu.getByRole('menuitemcheckbox', {name, exact:true});
  }
  async function dismiss() {
    if (await menu.isVisible()) {
      await page.keyboard.press('Escape');
      await menu.waitFor({state:'hidden'});
    }
  }
  async function caption(on) {
    await page.waitForFunction(({selector,on}) => {
      const visible = Array.from(document.querySelectorAll(selector)).some(el => {
        if (!el.textContent.trim() || !el.getClientRects().length) return false;
        return el.checkVisibility({opacityProperty:true, visibilityProperty:true});
      });
      return visible === on;
    }, {selector,on}, {timeout:3500});
  }
  async function set(on) {
    const toggle = await control();
    const attribute = phone ? 'aria-checked' : 'aria-pressed';
    assert.equal(await toggle.getAttribute(attribute), String(!on), 'Unexpected initial captions state');
    await toggle.click();
    const current = await control();
    assert.equal(await current.getAttribute(attribute), String(on), 'Caption state did not change');
    await dismiss();
    await caption(on);
  }
  const initial = await clock();
  await caption(true);
  await set(false);
  assert.equal(await clock(), initial, 'Toggling captions changed the paused time');
  // Exercise the real control and then return to the original beat, including for short films.
  const maximum = Number(await slider.getAttribute('aria-valuemax'));
  const firstKey = initial > maximum / 2 ? 'Home' : 'End';
  await slider.focus();
  await slider.press(firstKey);
  await page.waitForFunction(previous => Number(document.querySelector('[data-slot="player-bar"] [role="slider"]')?.getAttribute('aria-valuenow')) !== previous, initial, {timeout:3500});
  const sought = await clock();
  assert.notEqual(sought, initial, 'Timeline did not seek');
  await caption(false);
  // Return through the same control using its rendered orientation, track and thumb.
  const track = bar.locator('[data-slot="slider-track"]');
  const rect = await track.boundingBox();
  assert.ok(rect && maximum > 0, 'Timeline has no measurable track');
  const min = Number(await slider.getAttribute('aria-valuemin'));
  const fraction = (initial - min) / (maximum - min);
  const rtl = await track.evaluate(el => getComputedStyle(el).direction === 'rtl');
  const x = Math.min(rect.width - 1, Math.max(1, rect.width * (rtl ? 1 - fraction : fraction)));
  await track.click({position:{x,y:rect.height/2},force:true});
  await page.waitForFunction(previous => Number(document.querySelector('[data-slot="player-bar"] [role="slider"]')?.getAttribute('aria-valuenow')) !== previous, sought, {timeout:3500});
  const restored = await clock();
  assert.ok(Math.abs(restored-initial) <= Math.max(0.25, 2*maximum/rect.width),
    'Timeline failed to return to the captioned beat');
  await caption(false);
  await set(true);
  assert.equal(await clock(), restored, 'Enabling captions changed the paused time');
  return {viewport:page.viewportSize(),initial,sought,restored};
}
try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const page = await browser.newPage({viewport});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const result=await check(page,viewport.width<400);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify(result));
    await page.close();
  }
} finally {
  await browser.close();
}
