// Flags visible text whose (size, weight, tracking, leading) is not one of the ten brand type styles.
// node type-check.mjs <url> [width]
import { chromium } from 'playwright-core';
const [url, width = '1440'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +width, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
const out = await p.evaluate(() => {
  const names = ['display', 'title', 'heading', 'subheading', 'lead', 'body', 'label', 'small', 'eyebrow', 'caption'];
  // Resolve each style from the page's own tokens at this viewport.
  const probe = document.createElement('span');
  document.body.append(probe);
  const styles = names.map((n) => {
    probe.style.cssText = `font-size:var(--ais-text-${n});line-height:var(--ais-text-${n}-leading);letter-spacing:var(--ais-text-${n}-tracking);font-weight:var(--ais-text-${n}-weight)`;
    const c = getComputedStyle(probe);
    return { n, size: parseFloat(c.fontSize), lh: parseFloat(c.lineHeight) / parseFloat(c.fontSize), ls: parseFloat(c.letterSpacing) || 0, w: +c.fontWeight };
  });
  probe.remove();
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const bad = new Map();
  let total = 0;
  for (const e of document.querySelectorAll('body *')) {
    if (!e.offsetParent || e.closest('script,style,svg,code,pre,kbd,[data-brand-check="skip"]')) continue;
    if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    total++;
    const c = getComputedStyle(e);
    const size = parseFloat(c.fontSize), ls = parseFloat(c.letterSpacing) || 0, w = +c.fontWeight;
    const lh = c.lineHeight === 'normal' ? NaN : parseFloat(c.lineHeight) / size;
    // Weight 600 is allowed as in-sentence emphasis and data labels (guide: Semibold).
    const ok = styles.some((s) => near(size, s.size, 0.6) && near(ls, s.ls, 0.15) && (w === s.w || w === 600) && near(lh, s.lh, 0.06));
    if (ok) continue;
    const zone = e.closest('header') ? 'header' : e.closest('footer') ? 'footer' : e.closest('nav') ? 'nav' : 'main';
    const key = `${zone} ${size}px/${w} ls ${ls.toFixed(2)} lh ${isNaN(lh) ? 'normal' : lh.toFixed(2)}`;
    if (!bad.has(key)) bad.set(key, { n: 0, eg: e.textContent.trim().slice(0, 28) });
    bad.get(key).n++;
  }
  return { styles, total, bad: [...bad].map(([k, v]) => `${String(v.n).padStart(3)}  ${k}  «${v.eg}»`) };
});
await b.close();
console.log(`${url} @${width}: ${out.bad.reduce((n, l) => n + +l.trim().split(' ')[0], 0)} of ${out.total} text elements off-style`);
out.bad.forEach((l) => console.log('  ' + l));
