// Run with safe.sh. The page must pause on the requested second (?t= by default).
import fs from 'node:fs';
import path from 'node:path';
import { chromium, CHROME_ARGS } from './lib.mjs';

const [url, fixture, output] = process.argv.slice(2);
if (!url || !fixture || !output) throw new Error('Expected page URL, fixture JSON and output directory');
const config = JSON.parse(fs.readFileSync(fixture, 'utf8'));
fs.mkdirSync(output, { recursive: true });

// Runs inside Chromium. Compare rendered glyph pixels with the actual edges of their plates.
async function measurePlates({ selector, image }) {
  const img = new Image();
  img.src = 'data:image/png;base64,' + image;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

  function channels(color) {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
  }

  function glyph(tab) {
    const walker = document.createTreeWalker(tab, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const capital = /[A-Z0-9]/.exec(node.textContent);
      const match = capital ?? /[a-z]/.exec(node.textContent);
      if (!match) continue;
      const range = new Range();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + 1);
      return { rect: range.getBoundingClientRect(), cap: Boolean(capital) };
    }
    return null;
  }

  function inkGaps(plate, letter, foreground, background) {
    let first, last;
    for (let y = Math.ceil(plate.top) + 1; y < Math.floor(plate.bottom) - 1; y++) {
      for (let x = Math.ceil(letter.left); x < Math.floor(letter.right); x++) {
        const index = (y * img.width + x) * 4;
        let ink = 0, ground = 0;
        for (let channel = 0; channel < 3; channel++) {
          ink += (pixels[index + channel] - foreground[channel]) ** 2;
          ground += (pixels[index + channel] - background[channel]) ** 2;
        }
        if (ink < ground * 0.45) {
          first ??= y;
          last = y;
          break;
        }
      }
    }
    return first === undefined ? null : [
      Number((first - plate.top).toFixed(1)),
      Number((plate.bottom - last - 1).toFixed(1)),
    ];
  }

  const items = [];
  for (const tab of document.querySelectorAll(selector)) {
    const plate = tab.getBoundingClientRect();
    if (!plate.width || !plate.height || !tab.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    // A chip fading over a photograph has blended colours. Audit only settled, opaque plates.
    let opacity = 1;
    for (let el = tab; el; el = el.parentElement) opacity *= Number(getComputedStyle(el).opacity);
    if (opacity < 0.98) continue;
    const inside = plate.left >= 0 && plate.right <= innerWidth && plate.top >= 0 && plate.bottom <= innerHeight;
    const sample = glyph(tab);
    const style = getComputedStyle(tab);
    const gaps = inside && sample
      ? inkGaps(plate, sample.rect, channels(style.color), channels(style.backgroundColor))
      : null;
    items.push({ name: tab.textContent.trim(), inside, cap: sample?.cap, gaps });
  }
  return items;
}

const browser = await chromium.launch({ args: CHROME_ARGS, executablePath: process.env.CHROME_BIN || undefined });
try {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    for (const [time, expected, expectedPlain = []] of config.frames) {
      const position = new URL(url);
      position.searchParams.set(config.timeParam ?? 't', String(time));
      await page.goto(position.href);
      await page.waitForSelector(config.ready);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(700);
      const png = await page.screenshot({ path: path.join(output, width + '-' + time + '.png') });
      const items = await page.evaluate(measurePlates, { selector: config.tabs, image: png.toString('base64') });
      const missing = expected.filter(name => !items.some(item => item.name === name && item.inside && item.gaps));
      if (expectedPlain.length) {
        const visible = await page.locator(config.plainText).evaluateAll(elements => elements.filter(el => {
          if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
          const range = new Range();
          range.selectNodeContents(el);
          return Array.from(range.getClientRects()).every(r =>
            r.width > 0 && r.height > 0 && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight);
        }).map(el => el.textContent.trim()));
        missing.push(...expectedPlain.filter(name => !visible.includes(name)));
      }
      const alignment = items.filter(item => item.cap && item.gaps && Math.abs(item.gaps[0] - item.gaps[1]) > 2);
      console.log(JSON.stringify({ width, time, items, missing, alignment }));
      if (missing.length || alignment.length || items.some(item => !item.inside || !item.gaps)) process.exitCode = 1;
    }
    await page.close();
  }
} finally {
  await browser.close();
}
