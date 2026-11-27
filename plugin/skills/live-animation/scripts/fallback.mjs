// node fallback.mjs <url> : verifies prefers-reduced-motion fallback (poster shown, .is-still set, never .is-live,
// opening title hidden) and desktop fullscreen button availability. Exits 1 on any failure.
import { launchBrowser, prepPage, STAGE_SEL } from './lib.mjs';

const url = process.argv[2];
if (!url) { console.error('usage: node fallback.mjs <url>'); process.exit(2); }
const failures = [];
const b = await launchBrowser();

// 1. Reduced motion: must stay on poster (.is-still), never .is-live, opening title hidden
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p = await ctx.newPage();
await prepPage(p);
await p.goto(url, { waitUntil: 'load', timeout: 120000 });
await p.waitForTimeout(1500);
const rm = await p.evaluate((sel) => {
  const stage = document.querySelector(sel);
  const poster = stage?.querySelector('.pl-poster, [data-poster]');
  const open = stage?.querySelector('.pl-open, [data-open]');
  const full = stage?.querySelector('.pl-full, [data-full]');
  return {
    still: !!stage?.classList.contains('is-still'),
    live: !!stage?.classList.contains('is-live'),
    posterVis: poster ? getComputedStyle(poster).visibility : null,
    posterLoaded: poster ? poster.complete && poster.naturalWidth > 0 : false,
    openDisplay: open ? getComputedStyle(open).display : null,
    fullPresent: !!full,
    fullVisible: full ? !full.hidden : false,
  };
}, STAGE_SEL);
await ctx.close();
await b.close();

console.log('fallback:', JSON.stringify(rm));
if (!rm.still) failures.push('reduced-motion did not set .is-still');
if (rm.live) failures.push('reduced-motion went .is-live');
if (rm.posterVis !== 'visible' || !rm.posterLoaded) failures.push('poster not visible/loaded under reduced-motion');
if (rm.openDisplay !== 'none') failures.push(`opening title not hidden under reduced-motion (${rm.openDisplay})`);
if (!rm.fullPresent || !rm.fullVisible) failures.push('fullscreen button missing or hidden on desktop');

if (failures.length) {
  for (const f of failures) console.error('FAIL:', f);
  process.exit(1);
}
console.log('PASS: reduced-motion poster fallback and fullscreen toggle verified');
