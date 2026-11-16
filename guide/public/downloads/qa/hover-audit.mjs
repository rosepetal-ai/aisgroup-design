// Hovers every visible link and button and groups them by what actually changes.
// node hover-audit.mjs <url> [width]   One line per distinct (zone, kind, rest → hover) behaviour.
import { chromium } from 'playwright-core';
const [url, width = '1440'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +width, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
await p.addStyleTag({ content: '[class*=cookie],[id*=cookie],[class*=consent],[class*=event],astro-dev-toolbar{display:none!important}' });
const hex = (c) => { const m = c.match(/[\d.]+/g); if (!m) return c; const h = '#' + m.slice(0, 3).map((v) => (+v | 0).toString(16).padStart(2, '0')).join('').toUpperCase(); return m[3] !== undefined && +m[3] < 1 ? (+m[3] === 0 ? 'none' : h + '@' + m[3]) : h; };
const items = await p.$$('header a, header button, main a, main button, footer a, footer button');
const groups = new Map();
for (const el of items) {
  const info = await el.evaluate((e) => {
    const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
    if (!r.width || !r.height || c.visibility === 'hidden' || e.closest('[aria-hidden="true"]')) return null;
    const zone = e.closest('header') ? 'header' : e.closest('footer') ? 'footer' : 'main';
    const filled = c.backgroundColor !== 'rgba(0, 0, 0, 0)';
    const inline = !!e.closest('p, li') && e.tagName === 'A' && !filled;
    const kind = filled ? 'button' : e.querySelector('svg') ? 'link+icon' : inline ? 'inline-link' : 'link';
    return { zone, kind, text: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24) };
  });
  if (!info) continue;
  const snap = () => el.evaluate((e) => { const c = getComputedStyle(e); const svg = e.querySelector('svg'); return { color: c.color, bg: c.backgroundColor, deco: c.textDecorationLine, border: c.borderColor, tr: svg ? getComputedStyle(svg).transform : 'none', dur: c.transitionDuration.split(',')[0] }; });
  try {
    await el.scrollIntoViewIfNeeded({ timeout: 2000 });
    const rest = await snap(); await el.hover({ timeout: 2000, force: true }); await p.waitForTimeout(450); const hov = await snap();
    await p.mouse.move(1, 1); await p.waitForTimeout(250);
    const d = [];
    if (rest.color !== hov.color) d.push(`colour ${hex(rest.color)}→${hex(hov.color)}`);
    if (rest.bg !== hov.bg) d.push(`bg ${hex(rest.bg)}→${hex(hov.bg)}`);
    if (rest.deco !== hov.deco) d.push(`underline ${rest.deco}→${hov.deco}`);
    if (rest.tr !== hov.tr) d.push('arrow nudges');
    const sig = `${info.zone.padEnd(6)} ${info.kind.padEnd(11)} rest ${hex(rest.color)}${rest.deco !== 'none' ? ' underlined' : ''}${rest.bg.includes('0, 0, 0, 0') ? '' : ' on ' + hex(rest.bg)} | hover: ${d.join(', ') || 'NOTHING CHANGES'} | ${rest.dur}`;
    if (!groups.has(sig)) groups.set(sig, []);
    groups.get(sig).push(info.text);
  } catch { /* off-screen or covered */ }
}
await b.close();
console.log(`${url} @${width}: ${groups.size} distinct link/hover behaviours`);
for (const [sig, texts] of [...groups].sort()) console.log(`  ${String(texts.length).padStart(3)}  ${sig}   e.g. «${texts[0]}»`);
