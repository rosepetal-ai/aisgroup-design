// Render one print piece of the shared template to a tagged A4 PDF and page PNGs, after checking it.
//   node print/render.mjs pieces/brochures/catalogue-beverage/catalogue.es.html [--draft]
// Writes <piece>.pdf and previews/<piece>-N.png next to the HTML. Run one at a time (one Chromium):
//   flock /tmp/ais-marketing-render.lock nice -n 15 node print/render.mjs <html>
// Checks (a failure stops the export):
//   - the cover photo prints at 240 ppi or more and is not a video frame;
//   - nothing overflows a page, no block runs into the footer or the contact band (6 mm clear);
//   - every image loads; no image file appears twice in the document; no old flat-label wine render (print/image-rules.mjs);
//   - no picture shown above 1.25x its native size (reported below 150 ppi as a warning);
//   - no dead white: at most 25 mm empty above the footer or contact band, or between two blocks (inner pages);
//   - last page: the content ends --band-gap (system.css) above the contact band, within 0.5 mm, measured to the letters and pictures;
//   - the page number sits 8 mm from the bottom and 15 mm from the right on every page; inner content ends 20 mm or more from the bottom;
//   - no text under 8.5 pt (the guide's print minimum; this template's smallest style);
//   - no review wording on the page or in alt text (draft, pending, illustrative, render, CAD, middle-dot separators);
//   - Spanish/Catalan numbers per the guide's Localisation: 30 000, never 30.000 (engine/copy.mjs POINT_THOUSANDS);
//   - no two horizontal rules with nothing between them (a list's last-row rule stacked on the next section's rule);
//   - slots marked .missing only in a --draft build; they are listed in work/brochures/MISSING.md.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isVideoFrame, bannedImage, PRINT_COVER_PPI } from './image-rules.mjs';
import { POINT_THOUSANDS } from '../engine/copy.mjs';

const args = process.argv.slice(2);
const draft = args.includes('--draft');
const look = args.includes('--look'); // write previews even when checks fail, to look at the problem (never for delivery)
const file = path.resolve(args.find((a) => !a.startsWith('--')) || '');
if (!fs.existsSync(file)) { console.error('usage: render.mjs <piece.html> [--draft]'); process.exit(2); }
const dir = path.dirname(file), base = path.basename(file, '.html');
// The page number's place (system.css .foot): its letters end this far from the page's bottom and right edges.
const FOOT = { bottom: 8.26, right: 15 };
const BANNED = /\b(borrador|draft|pendiente|por confirmar|to be confirmed|imagen ilustrativa|illustrative|render|renders|renderizado|CAD|3D model)\b|(?<![lL])\u00b7|\u00b7(?![lL])/i;

const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage', '--font-render-hinting=none'] });
let failed = [];
try {
  if (/\/(brochures|datasheets)\//.test(file) && /<p\s+class=["']sub["']/.test(fs.readFileSync(file, 'utf8')))
    throw new Error('Replace print micro-labels with necessary ink editorial headings; detection tiles already name their subject.');
  const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await page.emulateMedia({ media: 'print' });
  const r = await page.evaluate(([bannedSrc, pointSrc]) => {
    const banned = new RegExp(bannedSrc, 'i'), point = new RegExp(pointSrc, 'g');
    const lang = (document.documentElement.lang || '').slice(0, 2);
    const mm = (px) => px * 25.4 / 96;
    const pages = [...document.querySelectorAll('.page')];
    const out = { bandToken: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--band-gap')) /* mm */, pages: [], images: [], text: [], banned: [], missing: [], icons: [], numbers: [], rules: [] };
    pages.forEach((p, i) => {
      const pb = p.getBoundingClientRect();
      const stop = p.querySelector('.band, .foot');
      const limit = stop ? stop.getBoundingClientRect().top : pb.bottom;
      const content = p.querySelector('.page-content, .cover-bottom');
      const blocks = content ? [...content.querySelectorAll(':scope > *')] : [];
      const lowest = blocks.reduce((b, e) => Math.max(b, e.getBoundingClientRect().bottom), 0);
      const overflowing = [...p.querySelectorAll('*')].filter((e) => e.scrollHeight > e.clientHeight + 1 && getComputedStyle(e).overflow === 'hidden' && !e.matches('.page, .frame, .tile, .hero') ).map((e) => e.className || e.tagName);
      // Dead white: more than 25 mm with no text or picture above the footer or contact band, or across the whole width between
      // two blocks. Measured on the ink, so a stretched spacer (.grow) doesn't hide it.
      const gaps = []; let dead = null, fromBottom = null, bandGap = null, footPos = null;
      const band = p.querySelector('.band');
      if (!p.querySelector('.cover-head') && content) {
        const ink = [...content.querySelectorAll('img, svg, .hx')].map((e) => e.getBoundingClientRect());
        const tw = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.textContent.trim()) { const r = document.createRange(); r.selectNodeContents(n); ink.push(...r.getClientRects()); }
        const bs = ink.filter((b) => b.height > 0 && b.width > 0).sort((a, b) => a.top - b.top);
        if (bs.length) {
          let low = bs[0].bottom;
          for (const b of bs.slice(1)) { if (mm(b.top - low) > 25) gaps.push(+mm(b.top - low).toFixed(1)); low = Math.max(low, b.bottom); }
          dead = +mm(limit - low).toFixed(1);
          fromBottom = +mm(pb.bottom - low).toFixed(2);
          if (band) bandGap = +mm(band.getBoundingClientRect().top - low).toFixed(2);
        }
      }
      const foot = p.querySelector('.foot');
      if (foot && getComputedStyle(foot).display !== 'none') {
        // The number's own box (a span around the text), so a flex or padding change can't hide a move.
        const r = document.createRange(); r.selectNodeContents(foot); const fb = r.getBoundingClientRect();
        footPos = { bottom: +mm(pb.bottom - fb.bottom).toFixed(2), right: +mm(pb.right - fb.right).toFixed(2) };
      }
      out.pages.push({ page: i + 1, cover: !!p.querySelector('.cover-head'), gaps, dead, fromBottom, bandGap, footPos, overflow: p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1, clearance: blocks.length ? +mm(limit - lowest).toFixed(1) : null, clipped: overflowing });
    });
    for (const img of document.images) {
      const b = img.getBoundingClientRect();
      // Displayed size of the visible picture: for object-fit: cover the image is scaled to cover the box.
      const fit = getComputedStyle(img).objectFit, nw = img.naturalWidth, nh = img.naturalHeight;
      let scale = 0;
      if (nw && nh && b.width && b.height) scale = fit === 'contain' ? Math.min(b.width / nw, b.height / nh) : fit === 'cover' ? Math.max(b.width / nw, b.height / nh) : b.width / nw;
      out.images.push({ src: decodeURIComponent(new URL(img.src).pathname), ok: img.complete && nw > 0, ppi: scale ? Math.round(96 / scale) : null, up: scale ? +scale.toFixed(2) : null, svg: /\.svg$/i.test(img.src), page: pages.indexOf(img.closest('.page')) + 1, alt: img.alt, coverOk: img.dataset.coverOk || '' });
      if (img.alt && banned.test(img.alt)) out.banned.push(`alt: ${img.alt}`);
      if (['es', 'ca'].includes(lang)) for (const m of img.alt.matchAll(point)) out.numbers.push(`alt: ${m[0]}`);
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode, t = n.textContent.trim();
      if (!t || !n.parentElement.closest('.page')) continue;
      const s = parseFloat(getComputedStyle(n.parentElement).fontSize);
      if (s < 8.5 * 96 / 72 - 0.05) out.text.push(`${t.slice(0, 40)} (${(s * 72 / 96).toFixed(1)} pt)`);
      if (banned.test(t)) out.banned.push(t.slice(0, 80));
      if (['es', 'ca'].includes(lang)) for (const m of t.matchAll(point)) out.numbers.push(`${m[0]} in "${t.slice(0, 60)}"`);
    }
    for (const m of document.querySelectorAll('.missing')) out.missing.push({ page: pages.indexOf(m.closest('.page')) + 1, what: m.dataset.missing || m.getAttribute('aria-label') || 'image' });
    for (const icon of document.querySelectorAll('.hx > svg')) {
      const box = icon.parentElement.getBoundingClientRect(), glyph = icon.getBoundingClientRect();
      out.icons.push({ page: pages.indexOf(icon.closest('.page')) + 1,
        dx: glyph.x + glyph.width / 2 - box.x - box.width / 2,
        dy: glyph.y + glyph.height / 2 - box.y - box.height / 2 });
    }
    // Rules separate content; two rules with no text or picture between them are a stacked divider.
    pages.forEach((p, i) => {
      const lines = [], ink = [];
      for (const el of p.querySelectorAll('*')) {
        const cs = getComputedStyle(el), b = el.getBoundingClientRect();
        if (!b.width || cs.visibility === 'hidden' || cs.display === 'none') continue;
        for (const side of ['Top', 'Bottom']) if (parseFloat(cs[`border${side}Width`]) >= .5 && cs[`border${side}Style`] !== 'none')
          lines.push({ y: side === 'Top' ? b.top : b.bottom, x0: b.left, x1: b.right, name: el.className || el.tagName });
        if (el.matches('img, svg, video, canvas')) ink.push(b);
      }
      const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) if (n.textContent.trim()) { const r = document.createRange(); r.selectNodeContents(n); ink.push(...r.getClientRects()); }
      lines.sort((a, b) => a.y - b.y);
      for (let a = 0; a < lines.length; a++) for (let c = a + 1; c < lines.length; c++) {
        const A = lines[a], B = lines[c], gap = mm(B.y - A.y);
        if (gap > 20) break;
        const x0 = Math.max(A.x0, B.x0), x1 = Math.min(A.x1, B.x1);
        // ponytail: 50 % horizontal overlap and a 0.5–20 mm gap; widen if a real stack slips through.
        if (gap < .5 || x1 - x0 < .5 * Math.min(A.x1 - A.x0, B.x1 - B.x0)) continue;
        if (!ink.some((r) => r.bottom > A.y + 1 && r.top < B.y - 1 && r.right > x0 && r.left < x1))
          out.rules.push(`page ${i + 1}: ${A.name} and ${B.name}, ${gap.toFixed(1)} mm apart`);
      }
    });
    // Family frame («the new generations go completely off theme, no same header»): every brochure,
    // catalogue and datasheet opens on the system's cover head (brand blue, white logo, white title at the system size,
    // hexagon field) and closes on the contact band; no other brand-blue block. A redesign changes pictures and inner
    // layout, never this frame. Measured on the rendered page, so a local <style> override fails too.
    out.family = [];
    const rgb = (hex) => { const n = parseInt(hex.replace('#', ''), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };
    const BRAND = rgb(getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()), WHITE = 'rgb(255, 255, 255)';
    const head = pages[0]?.classList.contains('cover') && pages[0].querySelector(':scope > .cover-head');
    if (!head) out.family.push('page 1 is not the system cover (section.page.cover > header.cover-head)');
    else {
      const h1 = head.querySelector('h1'), logo = head.querySelector('img.logo');
      if (getComputedStyle(head).backgroundColor !== BRAND) out.family.push('cover head is not brand blue');
      if (mm(head.getBoundingClientRect().height) < 80) out.family.push(`cover head is ${mm(head.getBoundingClientRect().height).toFixed(1)} mm tall (the system's is 88 mm or more)`);
      if (!logo || !/-white\.svg$/.test(logo.getAttribute('src') || '')) out.family.push('cover head has no white logo');
      if (!head.querySelector('.hexfield')) out.family.push('cover head has no hexagon field');
      if (!h1 || getComputedStyle(h1).color !== WHITE || Math.abs(parseFloat(getComputedStyle(h1).fontSize) * 72 / 96 - 34) > .5) out.family.push('cover title is not white at 34 pt');
    }
    if (!pages.at(-1)?.querySelector('.band')) out.family.push('last page has no contact band');
    pages.forEach((p, i) => { for (const el of p.querySelectorAll('*')) {
      if (el.closest('.cover-head, .band') || getComputedStyle(el).backgroundColor !== BRAND) continue;
      const b = el.getBoundingClientRect();
      if (mm(b.height) > 12 && mm(b.width) > 40) out.family.push(`page ${i + 1}: a brand-blue block outside the cover head and contact band (${el.className || el.tagName}, ${mm(b.width).toFixed(0)} × ${mm(b.height).toFixed(0)} mm)`);
    } });
    return out;
  }, [BANNED.source, POINT_THOUSANDS.source]);

  console.log(`${path.relative(process.cwd(), file)}: ${r.pages.length} pages`);
  for (const icon of r.icons) {
    if (Math.abs(icon.dx) > .1 || Math.abs(icon.dy) > .1)
      failed.push(`icon off-centre on page ${icon.page}: ${icon.dx.toFixed(2)}, ${icon.dy.toFixed(2)} px`);
  }
  console.log(`  ${r.icons.length} hexagon icons checked for centering`);
  for (const p of r.pages) {
    const bad = p.overflow || (p.clearance !== null && p.clearance < 6) || p.clipped.length;
    console.log(`  page ${p.page}: clearance ${p.clearance ?? '-'} mm${p.overflow ? ', OVERFLOW' : ''}${p.clipped.length ? ', clipped: ' + p.clipped.join(', ') : ''}`);
    if (bad) failed.push(`page ${p.page} layout`);
    if (!p.cover && p.dead > 25) failed.push(`page ${p.page}: ${p.dead} mm of empty page above the footer or contact band (25 mm at most): enlarge a picture, rebalance or tighten`);
    for (const g of p.gaps) failed.push(`page ${p.page}: ${g} mm of empty page between two blocks (25 mm at most)`);
    // Same space above the contact band on every piece: the token in system.css, never a page's leftovers.
    if (p.bandGap !== null) {
      console.log(`  page ${p.page}: ${p.bandGap} mm above the contact band (token ${r.bandToken.toFixed(1)} mm)`);
      if (!(Math.abs(p.bandGap - r.bandToken) <= .5)) failed.push(`page ${p.page}: ${p.bandGap} mm above the contact band; the system's gap is ${r.bandToken.toFixed(1)} mm (give the free height to a picture or rebalance the page)`);
    } else if (!p.cover && p.fromBottom !== null && p.fromBottom < 19.5) failed.push(`page ${p.page}: content ends ${p.fromBottom} mm from the bottom (20 mm at least)`);
    if (p.footPos && (Math.abs(p.footPos.bottom - FOOT.bottom) > .5 || Math.abs(p.footPos.right - FOOT.right) > .5))
      failed.push(`page ${p.page}: page number at ${p.footPos.bottom} mm from the bottom and ${p.footPos.right} mm from the right (${FOOT.bottom} and ${FOOT.right} mm)`);
  }
  const seen = new Map();
  for (const i of r.images.filter((x) => !x.svg)) {
    const key = path.basename(i.src);
    if (!i.ok) failed.push(`image not loaded: ${key}`);
    if (seen.has(i.src)) failed.push(`image used twice: ${key} (pages ${seen.get(i.src)} and ${i.page})`);
    seen.set(i.src, i.page);
    if (i.up > 1.25) failed.push(`image shown at ${i.up}x its size: ${key} (page ${i.page})`);
    const note = i.ppi && i.ppi < 150 ? '  LOW for print' : '';
    console.log(`  img p${i.page} ${key}: ${i.ppi ?? '?'} ppi${note}`);
  }
  // Covers are the piece's first impression and must be impeccable: the cover photo prints at 240 ppi or
  // more and is never a video frame. Video frames are named or catalogued as such; name copies so the origin survives.
  for (const i of r.images.filter((x) => !x.svg)) { const why = bannedImage(i.src); if (why) failed.push(`${why} (page ${i.page})`); }
  for (const i of r.images.filter((x) => !x.svg && x.page === 1)) {
    const key = path.basename(i.src);
    // data-cover-ok="<reason>": the piece's only real picture is soft or a video frame and ships anyway. Logged, so the gap stays visible.
    if (i.coverOk) { console.log(`  cover photo ${key} accepted below the cover bar: ${i.coverOk}`); continue; }
    if (i.ppi && i.ppi < PRINT_COVER_PPI) failed.push(`cover photo ${key} prints at ${i.ppi} ppi; covers need ${PRINT_COVER_PPI} ppi or more (use a sharper master or a print-size still)`);
    if (isVideoFrame(key)) failed.push(`cover photo ${key} is a video frame; covers need a photograph or a print-size still`);
  }
  for (const t of r.family) failed.push(`off the family frame: ${t}`);
  for (const t of r.text) failed.push(`text under 8.5 pt: ${t}`);
  for (const t of r.banned) failed.push(`review wording on the page: ${t}`);
  for (const t of [...new Set(r.rules)]) failed.push(`two rules with nothing between them: ${t}`);
  for (const t of r.numbers) failed.push(`Spanish number with a point for thousands (write 30 000 with a non-breaking space, 1285 without): ${t}`);
  if (r.missing.length) {
    const lines = r.missing.map((m) => `- ${base}, page ${m.page}: ${m.what}`);
    console.log('  missing images:\n    ' + lines.join('\n    '));
    if (!draft) failed.push(`${r.missing.length} missing image(s); see MISSING.md or build with --draft`);
  }
  if (failed.length) { console.log('CHECKS FAILED:\n  ' + failed.join('\n  ')); if (!look) throw new Error('checks failed'); }

  const pdf = path.join(dir, `${base}${draft ? '-draft' : ''}${failed.length ? '-failing' : ''}.pdf`);
  await page.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  const t3 = execFileSync('pdffonts', [pdf]).toString().split('\n').filter((l) => /Type 3/.test(l));
  if (t3.length) throw new Error('PDF has Type 3 fonts: ' + t3.join(', '));
  const prev = path.join(dir, 'previews');
  fs.mkdirSync(prev, { recursive: true });
  for (const f of fs.readdirSync(prev).filter((f) => f.startsWith(base + '-'))) fs.rmSync(path.join(prev, f));
  execFileSync('pdftoppm', ['-png', '-r', '110', pdf, path.join(prev, base)]);
  console.log(`  wrote ${path.relative(process.cwd(), pdf)} and previews/${base}-N.png`);
} finally { await browser.close(); }
if (failed.length) process.exitCode = 1;
