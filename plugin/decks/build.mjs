// AIS decks, "Hoy + azul": build one deck from its content file.
//   flock /tmp/ais-marketing-render.lock nice -n 15 node decks/build.mjs pieces/decks/<deck>/content.<lang>.json [--html-only] [--slides 1,3,4]
// Writes next to the content file: <file>.html (single file, CSS and JS inline; pictures, fonts and logos in media/, relative
// paths), then (not with --html-only) the checks in Chromium, slides/NN.png at 1920 × 1080, <file>.pdf (Chromium page.pdf,
// vector text) and <file>.pptx (editable, to_pptx.py from the measured page); build/ keeps layout.json and checks.txt.
// Fails (exit 1) on any check. In Spanish and Catalan a point for thousands (30.000) stops it before any output.
// The fixed stage, the presenter and print rules adapt frontend-slides (MIT, Zara Zhang): see runtime/LICENSE-frontend-slides.txt.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {renderSlide, imagesOf} from './layouts.mjs';
import {measureAlignment} from './alignment.mjs';
import {measureBands, measureRhythm, RHYTHM, measureFoot, footReport} from './bands.mjs';
import {bannedImage, isVideoFrame} from '../print/image-rules.mjs';
import {pointThousands} from '../engine/copy.mjs';
import { pythonPath } from '../scripts/setup.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const assetRootAt = process.argv.indexOf('--asset-root');
const STUDIO = assetRootAt >= 0 ? path.resolve(process.argv[assetRootAt+1]) : path.resolve(HERE, '..'); // the plugin root: picture paths in the content are relative to it
const ASSETS = path.join(HERE, 'assets');
const PY = pythonPath(); // the plugin's venv (npm run setup) has Pillow and python-pptx
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const htmlOnly = args.includes('--html-only');
const contentPath = path.resolve(args[0] || '');
if (!fs.existsSync(contentPath)) { console.error('content file not found'); process.exit(2); }
const out = path.dirname(contentPath);
const deck = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const base = deck.meta?.file;
if (!/^[A-Za-z0-9_-]+$/.test(base || '')) { console.error('meta.file must be a plain file name'); process.exit(2); }

// Sections included by reference, as in the current builder.
const expand = (slides, base) => slides.flatMap((s) => s.include ? expand(JSON.parse(fs.readFileSync(path.resolve(base, s.include), 'utf8')).slides, path.dirname(path.resolve(base, s.include))) : [s]);
const all = expand(deck.slides, path.dirname(contentPath));
// Spanish/Catalan numbers (guide, Localisation): 30 000 with a non-breaking space, 1285 without; never 30.000.
const lang = deck.meta?.lang || (path.basename(contentPath).match(/\.([a-z]{2})\.json$/) || [])[1];
if (['es', 'ca'].includes(lang)) {
  const hits = [];
  const walk = (o, k, where) => {
    if (typeof o === 'string') { if (!['src', 'image', 'include', 'file', 'layout', 'icon'].includes(k)) for (const m of pointThousands(o)) hits.push(`${where} ${k}: ${m} in "${o.slice(0, 60)}"`); }
    else if (Array.isArray(o)) o.forEach((x) => walk(x, k, where));
    else if (o && typeof o === 'object') for (const [a, b] of Object.entries(o)) walk(b, a, where);
  };
  all.forEach((sl, i) => walk(sl, '', `slide ${i + 1}`));
  if (hits.length) { console.error('CHECKS FAILED: Spanish number with a point for thousands (write 30 000 / 1285):\n - ' + hits.join('\n - ')); process.exit(1); }
}
for (const [i,slide] of all.entries()) {
  for (const src of imagesOf(slide)) if (/(sabadell[-_]facade|sabadell-building|office-map)/i.test(src) && !slide.image?.streetViewReason?.trim()) throw new Error(`slide ${i+1}: use the registered Sabadell aerial for facilities; a street view requires image.streetViewReason`);
}
const parts = all.filter((s) => s.layout === 'divider').map((s) => s.part || s.title);
const pick = opt('--slides') ? opt('--slides').split(',').map(Number).sort((a, b) => a - b) : all.map((_, i) => i + 1);

// Media: every picture copied once into media/ (the folder travels with the HTML).
for (const d of ['media', 'slides', 'build']) fs.rmSync(path.join(out, d), {recursive: true, force: true});
fs.mkdirSync(path.join(out, 'media'), {recursive: true});
const resolveSrc = (src) => src.startsWith('tpl:') ? path.join(ASSETS, src.slice(4)) : src.startsWith('~/') ? path.join(process.env.HOME, src.slice(2)) : path.resolve(STUDIO, src);
const copied = new Map(), names = new Set();
const place = (abs, prefix = '') => {
  if (copied.has(abs)) return copied.get(abs);
  if (!fs.existsSync(abs)) throw new Error('missing file: ' + abs);
  let name = prefix + path.basename(abs).toLowerCase().replace(/[^a-z0-9._-]+/g, '-'), k = 2;
  while (names.has(name)) name = `${k++}-${name}`;
  names.add(name);
  fs.copyFileSync(abs, path.join(out, 'media', name));
  copied.set(abs, 'media/' + name);
  return 'media/' + name;
};
for (const f of ['Inter.ttf', 'InterMedium.ttf', 'InterSemiBold.ttf', 'OFL-Inter.txt']) fs.copyFileSync(path.join(ASSETS, f), path.join(out, 'media', f));
const srcs = [...new Set(pick.flatMap((n) => imagesOf(all[n - 1])))];
const dims = JSON.parse(execFileSync(PY, ['-I', '-c', `import json,sys
from PIL import Image
print(json.dumps({f:Image.open(f).size for f in sys.argv[1:]}))`, ...srcs.map(resolveSrc)]).toString());
// Cover quality is reported without changing the approved full-bleed composition.
const imageWarnings = [];
for (const n of pick) {
  const slide = all[n - 1];
  for (const src of imagesOf(slide)) {
    const file = resolveSrc(src), banned = bannedImage(file);
    if (banned) throw new Error(`slide ${n}: ${banned}`);
    if (slide.layout === 'cover' && isVideoFrame(file)) throw new Error(`slide ${n}: video frames are forbidden on covers: ${src}`);
  }
  if (slide.layout === 'cover') {
    const native = dims[resolveSrc(slide.image.src)];
    const c = slide.image.crop;
    const [w, h] = c ? [c[2] - c[0], c[3] - c[1]] : native;
    const scale = Math.max(920 / w, 1080 / h);
    if (scale > 1.005) imageWarnings.push(`slide ${n}: cover source ${w}×${h}, enlarged ${scale.toFixed(2)}x to fill 920×1080; use a sharper original when available; panel stays full bleed`);
  }
}
imageWarnings.forEach((w) => console.warn('WARNING: ' + w));
// Customer logos reversed to white for blue grounds: the logo's own alpha, filled white (no redraw).
const whiteLogo = (src) => {
  const abs = resolveSrc(src), dest = path.join(out, 'media', 'white-' + path.basename(abs));
  if (!fs.existsSync(dest)) execFileSync(PY, ['-I', '-c', `import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGBA');w=Image.new('RGBA',im.size,(255,255,255,0));w.putalpha(im.getchannel('A'));w.save(sys.argv[2])`, abs, dest]);
  return 'media/white-' + path.basename(abs);
};
const ctx = {
  parts,
  img: (src) => { const abs = resolveSrc(src); const [w, h] = dims[abs]; return {url: place(abs), w, h}; },
  asset: (rel) => place(path.join(ASSETS, rel)),
  whiteLogo,
  // Lucide icons (ISC), inline so they take the text colour.
  icon: (n) => fs.readFileSync(path.join(ASSETS, 'icons', n + '.svg'), 'utf8').replace(/<svg/, '<svg width="100%" height="100%"'),
};
let part = -1;
const slidesHtml = all.map((s, i) => {
  if (s.layout === 'divider') part++;
  if (!pick.includes(i + 1)) return '';
  return renderSlide(s, {...ctx, n: i + 1, part});
}).join('\n');

const css = ['runtime/stage.css', 'runtime/base.css', 'layouts.css'].map((f) => fs.readFileSync(path.join(HERE, f), 'utf8')).join('\n');
const js = fs.readFileSync(path.join(HERE, 'runtime/deck.js'), 'utf8');
const title = deck.meta?.title || 'AIS Vision Systems';
const html = `<!doctype html>
<html lang="${deck.meta?.lang || 'es'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>
${css}
</style></head>
<body>
<div class="deck-viewport"><main class="deck-stage">
${slidesHtml}
</main></div>
<div class="deck-count" aria-hidden="true"></div><div class="deck-notes" aria-live="polite"></div>
<script>
${js}
</script>
</body></html>
`;
const htmlPath = path.join(out, base + '.html');
fs.writeFileSync(htmlPath, html);
console.log('wrote', path.relative(process.cwd(), htmlPath), `(${pick.length} slides)`);
if (htmlOnly) process.exit(0);

// Editable PPTX: measure every data-k element in the exported page (same contract as the current deck builder), turn
// vectors into PNGs at 3x, then to_pptx.py.
async function pptx(page, browser) {
  await page.emulateMedia({media: 'screen'});
  const layout = await page.evaluate(() => {
    const px = (v) => Math.round(v * 100) / 100;
    const rgb = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(parseFloat); return {hex: p.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join(''), a: p.length > 3 ? p[3] : 1}; };
    return [...document.querySelectorAll('.slide')].map((s) => {
      const sb = s.getBoundingClientRect();
      const box = (e) => { const b = e.getBoundingClientRect(); return {x: px(b.left - sb.left), y: px(b.top - sb.top), w: px(b.width), h: px(b.height)}; };
      const items = [];
      s.querySelectorAll('[data-k]').forEach((e) => {
        const k = e.dataset.k, cs = getComputedStyle(e);
        if (k === 'rect') { const c = rgb(cs.backgroundColor); if (c && c.a > 0) items.push({k, ...box(e), fill: c.hex, alpha: c.a}); }
                else if (k === 'text') {
          const runs = [], base = rgb(cs.color).hex, fsz = parseFloat(cs.fontSize);
          // The browser's own line breaks (headlines are balanced, text-wrap: balance) become explicit breaks, so PowerPoint
          // and LibreOffice set the same lines instead of re-wrapping with their own metrics.
          let lastTop = null;
          const lined = (node) => {
            const t = node.textContent, parts = []; let cur = '';
            for (let i = 0; i < t.length; i++) {
              if (!/\s/.test(t[i])) {
                const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
                const rc = r.getClientRects()[0];
                if (rc) { if (lastTop !== null && rc.top > lastTop + fsz * 0.5) { parts.push(cur.replace(/\s+$/, '')); cur = ''; } lastTop = rc.top; }
              }
              cur += t[i];
            }
            parts.push(cur);
            return parts.map((x) => x.replace(/\s+/g, ' '));
          };
          const walk = (node, bold, col) => node.childNodes.forEach((c) => {
            if (c.nodeType === 3) lined(c).forEach((t, j) => { if (j) runs.push({t: '\n', b: bold}); if (t) runs.push({t, b: bold, c: col !== base ? col : null}); });
            else if (c.nodeName === 'BR') { runs.push({t: '\n', b: bold}); lastTop = null; }
            else walk(c, bold || c.nodeName === 'B', rgb(getComputedStyle(c).color).hex);
          });
          walk(e, false, base);
          const rg = document.createRange(); rg.selectNodeContents(e);
          const rr = [...rg.getClientRects()], eb = e.getBoundingClientRect();
          const tw = rr.length ? Math.max(...rr.map((r) => r.right)) - eb.left : eb.width;
          items.push({k, ...box(e), tw: px(tw), runs, size: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight), weight: parseInt(cs.fontWeight), color: base, ls: parseFloat(cs.letterSpacing) || 0, align: cs.textAlign, num: cs.fontVariantNumeric});
        } else if (k === 'img') {
          const pic = e.closest('.pic') || e, pos = cs.objectPosition.split(' ').map((v) => parseFloat(v) / 100);
          items.push({k, ...box(e), clip: box(pic), src: e.getAttribute('src'), nw: e.naturalWidth, nh: e.naturalHeight, fit: cs.objectFit === 'contain' ? 'contain' : 'cover', pos, alt: e.getAttribute('alt') || ''});
        } else if (k === 'vec') {
          const svg = e.tagName === 'IMG' ? null : e.querySelector('svg').outerHTML.replace(/currentColor/g, cs.color);
          items.push({k, ...box(e), svg, src: e.tagName === 'IMG' ? e.getAttribute('src') : null, opacity: parseFloat(cs.opacity || 1)});
        }
      });
      return {bg: rgb(getComputedStyle(s).backgroundColor).hex, notes: s.dataset.notes || '', items};
    });
  });
  const bdir = path.join(out, 'build'), vdir = path.join(bdir, 'vec');
  fs.mkdirSync(vdir, {recursive: true});
  const vpage = await browser.newPage({viewport: {width: 800, height: 800}});
  const cache = new Map(); let vi = 0;
  for (const sl of layout) for (const it of sl.items.filter((x) => x.k === 'vec')) {
    const key = (it.svg || it.src) + '|' + it.w + 'x' + it.h;
    if (!cache.has(key)) {
      const W = Math.ceil(it.w * 3), H = Math.ceil(it.h * 3);
      let svg = it.svg || fs.readFileSync(path.join(out, it.src), 'utf8').replace(/<\?xml[^>]*>/, '');
      svg = svg.replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1').replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1').replace('<svg', `<svg width="${W}" height="${H}"`);
      await vpage.setViewportSize({width: W, height: H});
      await vpage.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
      const f = path.join(vdir, `v${vi++}.png`);
      await vpage.screenshot({path: f, omitBackground: true, clip: {x: 0, y: 0, width: W, height: H}});
      cache.set(key, path.relative(out, f));
    }
    it.png = cache.get(key); delete it.svg;
  }
  fs.writeFileSync(path.join(bdir, 'layout.json'), JSON.stringify({meta: {title: deck.meta?.title || ''}, slides: layout}, null, 1));
  execFileSync(PY, ['-I', path.join(HERE, 'to_pptx.py'), path.join(bdir, 'layout.json'), path.join(out, base + '.pptx')], {stdio: 'inherit'});
}

// Chromium: checks, PNG per slide, PDF with vector text.
const {chromium} = await import('playwright');
const browser = await chromium.launch({headless: true, args: ['--disable-dev-shm-usage', '--disable-gpu']});
try {
  const page = await browser.newPage({viewport: {width: 1920, height: 1080}, deviceScaleFactor: 1});
  await page.goto(pathToFileURL(htmlPath).href + '?export', {waitUntil: 'load'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.documentElement.dataset.snapped === '1');
  await page.waitForTimeout(150);
  const GAP = 0.15;
  // No large empty bands: the content width (128 to 1792) is cut into 80 px vertical strips; in each strip that
  // holds content, the empty run between two content blocks, or after its last block down to the slide's content bottom
  // (a short list beside a tall picture), is measured, and so is the space above the first block (from the top margin) and the
  // band from the slide's content bottom to the bottom margin (984). Decoration is not content (bands.mjs). The largest run, as a
  // share of the slide height, is reported per slide; over the threshold (default 15 %) the slide fails, cover and divider excepted.
  // The spacing audit (measureRhythm) fails any rhythm gap outside RHYTHM and any text off the column grid.
  const gaps = await page.evaluate(measureBands);
  const rhythm = await page.evaluate(measureRhythm, RHYTHM);
  const oldMarkers = await page.addStyleTag({content: '.arow-in>.mk{align-self:center!important;height:auto!important;display:flex;align-items:normal!important}'});
  const alignmentBefore = await page.evaluate(measureAlignment);
  await oldMarkers.evaluate((e) => e.remove());
  const alignment = await page.evaluate(measureAlignment);
  fs.mkdirSync(path.join(out, 'build'), {recursive: true});
  fs.writeFileSync(path.join(out, 'build', 'alignment.json'), JSON.stringify({beforeMarkerFix: alignmentBefore, after: alignment}, null, 2));
  const footFails = footReport(await page.evaluate(measureFoot)).fails;
  const problems = await page.evaluate(() => {
    const out = [], seen = new Map();
    const banned = [/\bTODO\b/, /\brender/i, /\bCAD\b/, /\b3D\b/, /(?<![lL])\u00b7|\u00b7(?![lL])/, /→/, /\bpendiente\b|placeholder|borrador/i];
    document.querySelectorAll('.slide').forEach((s, i) => {
      const n = i + 1, sb = s.getBoundingClientRect();
      const texts = [...s.querySelectorAll('[data-k="text"]')];
      const lineRects = (e) => { const r = document.createRange(); r.selectNodeContents(e); return [...r.getClientRects()].filter((x) => x.width > 1); };
      texts.forEach((e) => {
        const cs = getComputedStyle(e), fs = parseFloat(cs.fontSize);
        const min = e.matches('.t-meta,.num,.d1-div .t-label') ? 22 : e.matches('.t-label') ? 28 : 36;
        if (fs < min) out.push(`slide ${n}: text under ${min} px (${fs}): "${e.textContent.slice(0, 40)}"`);
        for (const r of lineRects(e)) if (r.right > sb.right - 2 || r.bottom > sb.bottom - 2 || r.left < sb.left || r.top < sb.top) { out.push(`slide ${n}: text outside slide: "${e.textContent.slice(0, 40)}"`); break; }
        if (e.scrollWidth > e.clientWidth + 2) out.push(`slide ${n}: text wider than its box: "${e.textContent.slice(0, 40)}"`);
        for (const r of banned) if (r.test(e.textContent)) out.push(`slide ${n}: banned text ${r}: "${e.textContent.slice(0, 50)}"`);
      });
      // Text never overlaps other text or a picture (scrims excepted: they are the ground).
      const tr = texts.map((e) => [e, lineRects(e)]);
      const hit = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      for (let a = 0; a < tr.length; a++) for (let b = a + 1; b < tr.length; b++)
        if (tr[a][1].some((x) => tr[b][1].some((y) => hit(x, y)))) out.push(`slide ${n}: text overlaps text: "${tr[a][0].textContent.slice(0, 30)}" / "${tr[b][0].textContent.slice(0, 30)}"`);
      const scrims = [...s.querySelectorAll('.scrim')].map((x) => x.getBoundingClientRect());
      const inside = (r, o) => r.left >= o.left - 1 && r.right <= o.right + 1 && r.top >= o.top - 1 && r.bottom <= o.bottom + 1;
      s.querySelectorAll('.pic').forEach((p) => { const pr = p.getBoundingClientRect(); tr.forEach(([e, rs]) => { if (rs.some((x) => { if (!hit(x, pr)) return false; const c = {left: Math.max(x.left, pr.left), right: Math.min(x.right, pr.right), top: Math.max(x.top, pr.top), bottom: Math.min(x.bottom, pr.bottom)}; return !scrims.some((sc) => inside(c, sc)); })) out.push(`slide ${n}: text on a picture: "${e.textContent.slice(0, 30)}"`); }); });
      // The hexagon field: nothing within 450 px of its corner, never over a picture.
      s.querySelectorAll('.hex').forEach((hx) => {
        const hb = hx.getBoundingClientRect(), br = /br/.test(hx.getAttribute('src'));
        const cx = hb.right, cy = br ? hb.bottom : hb.top;
        const near = (r) => Math.hypot(Math.max(r.left - cx, 0, cx - r.right), Math.max(r.top - cy, 0, cy - r.bottom)) < 450;
        tr.forEach(([e, rs]) => { if (rs.some(near)) out.push(`slide ${n}: hexagon field behind text "${e.textContent.slice(0, 30)}"`); });
        s.querySelectorAll('.pic').forEach((p) => { const r = p.getBoundingClientRect(); if (hit(r, hb)) out.push(`slide ${n}: hexagon field over a picture`); });
      });
      // Pictures: never above 1.25× (cover 1.0×), loaded, never repeated.
      s.querySelectorAll('img[data-k="img"]').forEach((im) => {
        if (!im.complete || !im.naturalWidth) { out.push(`slide ${n}: image not loaded ${im.getAttribute('src')}`); return; }
        const b = im.getBoundingClientRect(), fit = getComputedStyle(im).objectFit;
        const sc = fit === 'contain' ? Math.min(b.width / im.naturalWidth, b.height / im.naturalHeight) : fit === 'fill' ? b.width / im.naturalWidth : Math.max(b.width / im.naturalWidth, b.height / im.naturalHeight);
        const lim = s.classList.contains('L-cover') ? 1.0 : 1.3;
        if (!s.classList.contains('L-cover') && sc > lim + 0.005) out.push(`slide ${n}: picture enlarged ${sc.toFixed(2)}x (max ${lim}) ${im.getAttribute('src')}`);
        const src = im.getAttribute('src');
        if (seen.has(src) && !/sabadell-aerial-photo/.test(src)) out.push(`slide ${n}: picture repeats slide ${seen.get(src)} ${src}`); else seen.set(src, n);
      });
    });
    return out;
  });
  fs.mkdirSync(path.join(out, 'slides'), {recursive: true});
  const count = await page.locator('.slide').count();
  for (let k = 0; k < count; k++) await page.locator('.slide').nth(k).screenshot({path: path.join(out, 'slides', String(pick[k]).padStart(2, '0') + '.png')});
  await page.emulateMedia({media: 'print'});
  await page.pdf({path: path.join(out, base + '.pdf'), width: '1920px', height: '1080px', printBackground: true, tagged: true, preferCSSPageSize: true});
  await pptx(page, browser);
  // Office files carry AIS metadata, never the library defaults, and no working file names in alt text.
  const office = execFileSync(PY, ['-I', '-c', `import zipfile,re,sys
z=zipfile.ZipFile(sys.argv[1]);bad=[]
for n in z.namelist():
    if not re.match(r'(docProps/.*|ppt/slides/slide\\d+)\\.xml$',n):continue
    t=z.read(n).decode('utf8','replace')
    for w in ('python-pptx','Steve Canny'):
        if w in t:bad.append(n+': '+w)
    for d in re.findall(r'descr="([^"]*)"',t):
        if re.search(r'\\.(jpe?g|png|svg|webp|tiff?)\\b|^(v\\d+|img|image|media)[-_. ]?\\d*$',d,re.I):bad.append(n+': alt text "'+d+'"')
print('\\n'.join(bad))`, path.join(out, base + '.pptx')]).toString().trim();
  if (office) problems.push(...office.split('\n').map((l) => 'pptx metadata/alt: ' + l));
  alignment.forEach((r) => r.failures.forEach((x) => problems.push(`slide ${r.slide}: alignment: ${x}`)));
  rhythm.forEach((r, k) => r.forEach((x) => problems.push(`slide ${pick[k]}: spacing: ${x}`)));
  footFails.forEach((x) => problems.push(x));
  gaps.forEach((g, k) => { if (g.gap > GAP && !g.exempt) problems.push(`slide ${pick[k]}: empty band ${(g.gap * 100).toFixed(1)} % of the height (strip x ${g.at.x}, from y ${g.at.y}); max ${GAP * 100} %`); });
  const gapReport = 'empty bands (largest, % of height): ' + gaps.map((g, k) => `${pick[k]}: ${(g.gap * 100).toFixed(1)}${g.exempt ? ' (exempt)' : ''}`).join(', ');
  console.log(gapReport);
  fs.writeFileSync(path.join(out, 'build', 'checks.txt'), (problems.length ? problems.join('\n') + '\n' : 'checks passed\n') + gapReport + '\n' + imageWarnings.map((w) => 'WARNING: ' + w).join('\n') + '\n');
  console.log(problems.length ? 'CHECKS FAILED\n - ' + problems.join('\n - ') : 'checks passed');
  if (problems.length) process.exitCode = 1;
} finally { await browser.close(); }
