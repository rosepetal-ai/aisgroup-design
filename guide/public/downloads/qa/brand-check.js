/* AIS Group brand check. Load into any page (website, landing, HTML email, slide export) and run:
 *
 *   const report = await aisBrandCheck();        // { findings: [...], pass: true|false }
 *
 * From Playwright:  await page.addScriptTag({ path: 'brand-check.js' });
 *                   const report = await page.evaluate(() => aisBrandCheck());
 *
 * It fails the page on what the brand guide forbids: sideways scrolling, words or ranges broken across lines,
 * content spilling out of its box, fonts other than Inter and JetBrains Mono, colours outside the palette,
 * typed arrows, ticks, bullets and emoji, text under 12 px, images without alternatives and, when axe-core
 * is loaded, contrast and accessibility violations. Mark an element data-brand-check="skip" to exclude it
 * (third-party embeds only).
 */
(function () {
  // Every colour token in brand.css (upper-case hex).
  const PALETTE = new Set(('EDF2FA B8CDE6 A7BFE4 7C9FD7 517FC9 3664B3 1E4591 17356E 10254C 111A2E 0B1220 ' +
    'FFFFFF F8FAFC F1F5F9 E2E8F0 CBD5E1 94A3B8 64748B 4B5563 334155 1E293B 0F1729 ' +
    '16A34A D97706 DC2626 4ADE80 F59E0B F87171 15803D ' +
    'EA580C 0891B2 DB2777 8B5CF6 0D9488 A855F7 92400E FDD9A8 000000').split(' '));
  const FONTS = ['inter', 'jetbrains mono'];
  const GLYPHS = /[←-⇿✓-✘•▶►★☆➡➔➜]|\p{Extended_Pictographic}/u;

  const hex = (rgb) => {
    const m = rgb.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+%?))?\)/);
    if (!m) return null;
    const alpha = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    if (alpha < 1) return 'translucent';
    return [m[1], m[2], m[3]].map((v) => Math.round(+v).toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const path = (el) => {
    const bits = [];
    for (let e = el; e && e !== document.body && bits.length < 4; e = e.parentElement) {
      bits.unshift(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + [...e.classList].slice(0, 2).map((c) => '.' + c).join(''));
    }
    return bits.join(' > ');
  };
  const skipped = (el) => el.closest('[data-brand-check="skip"], script, style, noscript, template');
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

  window.aisBrandCheck = async function ({ axe = true } = {}) {
    const findings = [];
    const add = (rule, el, detail) => findings.push({ rule, where: el ? path(el) : 'page', detail });
    if (document.fonts) await document.fonts.ready;

    // 1. The page never scrolls sideways.
    const extra = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (extra > 0) add('overflow', null, `page is ${extra}px wider than the window`);

    // 2. Words, ranges and names never break across lines.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || skipped(el) || el.closest('pre, svg') || !visible(el)) continue;
      for (const m of n.textContent.matchAll(/\S{4,}/g)) {
        const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        if (new Set([...r.getClientRects()].filter((b) => b.width > 0.5).map((b) => Math.round(b.top))).size > 1) add('broken-word', el, `"${m[0]}" breaks across lines`);
      }
      if (/(?<![lL])\u00b7|\u00b7(?![lL])/u.test(n.textContent)) add('separator', el, 'Middle-dot separator; use layout, a new line or a comma. Only Catalan l·l is allowed.');
      // 3. No typed arrows, ticks, bullets or emoji outside code examples.
      if (!el.closest('code') && GLYPHS.test(n.textContent)) add('glyph', el, `typed symbol in "${n.textContent.trim().slice(0, 40)}"; use a Lucide icon`);
    }

    for (const el of document.body.querySelectorAll('*')) {
      if (skipped(el) || el.closest('svg') || !visible(el)) continue;
      for (const attr of ['alt', 'aria-label', 'title']) if (/(?<![lL])\u00b7|\u00b7(?![lL])/u.test(el.getAttribute(attr) || '')) add('separator', el, `Middle-dot separator in ${attr}; use layout or a comma.`);
      const cs = getComputedStyle(el);
      // 4. Nothing spills out of a box that does not scroll.
      const par = el.parentElement;
      if (par && getComputedStyle(par).overflowX === 'visible' && !['absolute', 'fixed'].includes(cs.position)) {
        const a = el.getBoundingClientRect(), b = par.getBoundingClientRect();
        if (a.right > b.right + 1 && b.width > 0) add('spill', el, `${Math.round(a.right - b.right)}px past its container`);
      }
      if (ownText(el)) {
        // 5. Brand fonts only, nothing under 12 px.
        const family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
        if (!FONTS.includes(family)) add('font', el, `font "${family}"`);
        if (parseFloat(cs.fontSize) < 12) add('text-size', el, `${cs.fontSize} text`);
        // 6. Palette colours only for text and its background.
        const c = hex(cs.color);
        if (c && c !== 'translucent' && !PALETTE.has(c)) add('colour', el, `text colour #${c} is not in the palette`);
      }
      const bg = hex(cs.backgroundColor);
      if (bg && bg !== 'translucent' && !PALETTE.has(bg)) add('colour', el, `background #${bg} is not in the palette`);
      // 7. Informative images need an alternative; decorative ones need alt="".
      if (el.tagName === 'IMG' && !el.hasAttribute('alt')) add('alt', el, 'image without an alt attribute');
    }

    // 8. Contrast and accessibility, when axe-core is on the page.
    if (axe && window.axe) {
      const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });
      for (const v of res.violations) for (const node of v.nodes) findings.push({ rule: 'a11y:' + v.id, where: node.target.join(' '), detail: v.help });
    }
    return { pass: findings.length === 0, findings };
  };
})();
