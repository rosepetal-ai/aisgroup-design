// node explainer-look.mjs <url> <outdir> [W H] : an explainer (references/explainer.md) for looking: moments in Auto, each
// held view at a few moments (clicked on the bar, or chosen in the menu on phones), a chapter button clicked (the menu
// open on narrower bars), the timeline hovered,
// then Space and the arrows checked. Console problems are printed. Run through safe.sh.
//   env TIMES=0,4,21 (Auto, story s)  VIEWS=Wide,Station,Reject (as the bar names them)  VTIMES=12,26,33.6
import fs from 'node:fs';
import { launchBrowser, prepPage, waitLive, seekTo, hideChrome } from './lib.mjs';
const [url, out, W = '1600', H = '1000'] = process.argv.slice(2);
if (!url || !out || url === '--help') { console.log('usage: node explainer-look.mjs <url> <outdir> [W H]   (env TIMES, VIEWS, VTIMES)'); process.exit(url === '--help' ? 0 : 2); }
const times = (process.env.TIMES ?? '0,4,21,26,29,31.5,33.6,45,60,84').split(',').map(Number);
const views = (process.env.VIEWS ?? 'Wide,Station,Reject').split(',').filter(Boolean);
fs.mkdirSync(out, { recursive: true });
const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: +W, height: +H } });
const issues = await prepPage(p, { logWarnings: true });
await waitLive(p, `${url}?t=${times[0]}`, 2500);
await hideChrome(p);
const tag = `${W}x${H}`;
for (const t of times) {
  await seekTo(p, t);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/${tag}-auto-${t}.png` });
}
const phone = +W < 600;
for (const v of views) {
  if (phone) {
    await p.click('[data-slot=player-bar] button[aria-label="Speed and chapters"]');
    await p.waitForTimeout(300);
    await p.getByRole('menuitemradio', { name: v }).click();
  } else await p.getByRole('radio', { name: v }).click().catch(async () => p.locator('[data-slot=toggle-group-item]', { hasText: v }).click());
  for (const t of (process.env.VTIMES ?? '12,26,33.6').split(',').map(Number)) {
    await seekTo(p, t);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/${tag}-${v.toLowerCase()}-${t}.png` });
  }
}
// back to Auto, a scene moment; the menu open; the timeline hovered at a chapter
if (phone) {
  await p.click('[data-slot=player-bar] button[aria-label="Speed and chapters"]');
  await p.waitForTimeout(300);
  await p.getByRole('menuitemradio', { name: 'Auto' }).click();
} else await p.locator('[data-slot=toggle-group-item]', { hasText: 'Auto' }).click();
await seekTo(p, 26);
await p.waitForTimeout(800);
// wide bars show the chapters and speeds as buttons (one is clicked and the jump printed); narrower ones, the menu
const menu = p.locator('[data-slot=player-bar] button[aria-label="Speed and chapters"]');
if (await menu.isVisible()) {
  await menu.click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${tag}-menu.png` });
  await p.keyboard.press('Escape');
} else {
  const chapter = p.getByRole('group', { name: 'Chapter' }).locator('[data-slot=toggle-group-item]').nth(3);
  const name = (await chapter.textContent()).trim();
  await chapter.click();
  await p.waitForTimeout(800);
  console.log(`chapter button «${name}»: story ${(await p.evaluate(() => window.__plT)).toFixed(2)}`);
  await p.screenshot({ path: `${out}/${tag}-chapters.png` });
}
const line = await p.locator('[data-slot=slider]').boundingBox();
await p.mouse.move(line.x + line.width * 0.4, line.y + line.height / 2);
await p.waitForTimeout(700);
await p.screenshot({ path: `${out}/${tag}-hover.png` });
// keyboard: Space plays, arrows seek
await p.mouse.move(5, 5);
await p.locator('body').click({ position: { x: 5, y: 300 } });
const t0 = await p.evaluate(() => window.__plT);
await p.keyboard.press('ArrowRight');
await p.waitForTimeout(200);
const t1 = await p.evaluate(() => window.__plT);
await p.keyboard.press('Space');
await p.waitForTimeout(1500);
const t2 = await p.evaluate(() => window.__plT);
const playing = await p.getAttribute('[data-play]', 'aria-label');
console.log(`keys: story ${t0.toFixed(2)} → right ${t1.toFixed(2)} → space+1.5s ${t2.toFixed(2)}, play button now «${playing}»`);
await p.screenshot({ path: `${out}/${tag}-playing.png` });
console.log(issues.length ? issues.join('\n') : 'console clean');
await b.close();
