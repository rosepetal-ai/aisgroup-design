# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-c5eb8b84ad3d

<!-- AIS-c5eb8b84ad3d -->
const pb = p.getBoundingClientRect();

Source: plugin/print/render.mjs:53.

## AIS-9bb2b95b07a1

<!-- AIS-9bb2b95b07a1 -->
const stop = p.querySelector('.band, .foot');

Source: plugin/print/render.mjs:54.

## AIS-60c22fcc43e2

<!-- AIS-60c22fcc43e2 -->
const limit = stop ? stop.getBoundingClientRect().top : pb.bottom;

Source: plugin/print/render.mjs:55.

## AIS-a47792bd0c78

<!-- AIS-a47792bd0c78 -->
const content = p.querySelector('.page-content, .cover-bottom');

Source: plugin/print/render.mjs:56.

## AIS-7c04818076f3

<!-- AIS-7c04818076f3 -->
const blocks = content ? [...content.querySelectorAll(':scope > *')] : [];

Source: plugin/print/render.mjs:57.

## AIS-4b0a1ba0f33c

<!-- AIS-4b0a1ba0f33c -->
const lowest = blocks.reduce((b, e) => Math.max(b, e.getBoundingClientRect().bottom), 0);

Source: plugin/print/render.mjs:58.

## AIS-bf26f470a363

<!-- AIS-bf26f470a363 -->
const overflowing = [...p.querySelectorAll('*')].filter((e) => e.scrollHeight > e.clientHeight + 1 && getComputedStyle(e).overflow === 'hidden' && !e.matches('.page, .frame, .tile, .hero') ).map((e) => e.className || e.tagName);

Source: plugin/print/render.mjs:59.

## AIS-d9b3bbb09f2a

<!-- AIS-d9b3bbb09f2a -->
const gaps = []; let dead = null, fromBottom = null, bandGap = null, footPos = null;

Source: plugin/print/render.mjs:62.

## AIS-d4f17d9b8843

<!-- AIS-d4f17d9b8843 -->
const band = p.querySelector('.band');

Source: plugin/print/render.mjs:63.

## AIS-0d4fcba6ef84

<!-- AIS-0d4fcba6ef84 -->
if (!p.querySelector('.cover-head') && content) {

Source: plugin/print/render.mjs:64.

## AIS-4b83e161ab4f

<!-- AIS-4b83e161ab4f -->
const ink = [...content.querySelectorAll('img, svg, .hx')].map((e) => e.getBoundingClientRect());

Source: plugin/print/render.mjs:65.

## AIS-c3339e33caa4

<!-- AIS-c3339e33caa4 -->
const tw = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);

Source: plugin/print/render.mjs:66.

## AIS-c10c961bc619

<!-- AIS-c10c961bc619 -->
for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.textContent.trim()) { const r = document.createRange(); r.selectNodeContents(n); ink.push(...r.getClientRects()); }

Source: plugin/print/render.mjs:67.

## AIS-b45dadafb371

<!-- AIS-b45dadafb371 -->
const bs = ink.filter((b) => b.height > 0 && b.width > 0).sort((a, b) => a.top - b.top);

Source: plugin/print/render.mjs:68.

## AIS-5badade5da61

<!-- AIS-5badade5da61 -->
if (bs.length) {

Source: plugin/print/render.mjs:69.

## AIS-a9fba3ad7de1

<!-- AIS-a9fba3ad7de1 -->
for (const b of bs.slice(1)) { if (mm(b.top - low) > 25) gaps.push(+mm(b.top - low).toFixed(1)); low = Math.max(low, b.bottom); }

Source: plugin/print/render.mjs:71.

## AIS-2489f3b69e0e

<!-- AIS-2489f3b69e0e -->
if (band) bandGap = +mm(band.getBoundingClientRect().top - low).toFixed(2);

Source: plugin/print/render.mjs:74.

## AIS-824e468516ee

<!-- AIS-824e468516ee -->
const foot = p.querySelector('.foot');

Source: plugin/print/render.mjs:77.

## AIS-bf76124fc1a7

<!-- AIS-bf76124fc1a7 -->
if (foot && getComputedStyle(foot).display !== 'none') {

Source: plugin/print/render.mjs:78.

## AIS-e3726fc5f4ea

<!-- AIS-e3726fc5f4ea -->
const r = document.createRange(); r.selectNodeContents(foot); const fb = r.getBoundingClientRect();

Source: plugin/print/render.mjs:80.

## AIS-316780cf58bf

<!-- AIS-316780cf58bf -->
out.pages.push({ page: i + 1, cover: !!p.querySelector('.cover-head'), gaps, dead, fromBottom, bandGap, footPos, overflow: p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1, clearance: blocks.length ? +mm(limit - lowest).toFixed(1) : null, clipped: overflowing });

Source: plugin/print/render.mjs:83.

## AIS-d9fb02271169

<!-- AIS-d9fb02271169 -->
const b = img.getBoundingClientRect();

Source: plugin/print/render.mjs:86.

## AIS-c5dacf6cc742

<!-- AIS-c5dacf6cc742 -->
const fit = getComputedStyle(img).objectFit, nw = img.naturalWidth, nh = img.naturalHeight;

Source: plugin/print/render.mjs:88.

## AIS-460a48c169f1

<!-- AIS-460a48c169f1 -->
if (nw && nh && b.width && b.height) scale = fit === 'contain' ? Math.min(b.width / nw, b.height / nh) : fit === 'cover' ? Math.max(b.width / nw, b.height / nh) : b.width / nw;

Source: plugin/print/render.mjs:90.

## AIS-ff42da59e115

<!-- AIS-ff42da59e115 -->
out.images.push({ src: decodeURIComponent(new URL(img.src).pathname), ok: img.complete && nw > 0, ppi: scale ? Math.round(96 / scale) : null, up: scale ? +scale.toFixed(2) : null, svg: /\.svg$/i.test(img.src), page: pages.indexOf(img.closest('.page')) + 1, alt: img.alt, coverOk: img.dataset.coverOk || '' });

Source: plugin/print/render.mjs:91.

## AIS-f28b98212af1

<!-- AIS-f28b98212af1 -->
if (img.alt && banned.test(img.alt)) out.banned.push(`alt: ${img.alt}`);

Source: plugin/print/render.mjs:92.

## AIS-97c52c09305b

<!-- AIS-97c52c09305b -->
if (['es', 'ca'].includes(lang)) for (const m of img.alt.matchAll(point)) out.numbers.push(`alt: ${m[0]}`);

Source: plugin/print/render.mjs:93.

## AIS-d168b8541b50

<!-- AIS-d168b8541b50 -->
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

Source: plugin/print/render.mjs:95.

## AIS-a2787b979a96

<!-- AIS-a2787b979a96 -->
const n = walker.currentNode, t = n.textContent.trim();

Source: plugin/print/render.mjs:97.

## AIS-4b579ae3a486

<!-- AIS-4b579ae3a486 -->
if (!t || !n.parentElement.closest('.page')) continue;

Source: plugin/print/render.mjs:98.

## AIS-16a47c238531

<!-- AIS-16a47c238531 -->
const s = parseFloat(getComputedStyle(n.parentElement).fontSize);

Source: plugin/print/render.mjs:99.

## AIS-25841abb63b8

<!-- AIS-25841abb63b8 -->
if (s < 8.5 * 96 / 72 - 0.05) out.text.push(`${t.slice(0, 40)} (${(s * 72 / 96).toFixed(1)} pt)`);

Source: plugin/print/render.mjs:100.

## AIS-f4522513cdc8

<!-- AIS-f4522513cdc8 -->
if (banned.test(t)) out.banned.push(t.slice(0, 80));

Source: plugin/print/render.mjs:101.

## AIS-231e479aa690

<!-- AIS-231e479aa690 -->
if (['es', 'ca'].includes(lang)) for (const m of t.matchAll(point)) out.numbers.push(`${m[0]} in "${t.slice(0, 60)}"`);

Source: plugin/print/render.mjs:102.

## AIS-d9619c0f7566

<!-- AIS-d9619c0f7566 -->
for (const m of document.querySelectorAll('.missing')) out.missing.push({ page: pages.indexOf(m.closest('.page')) + 1, what: m.dataset.missing || m.getAttribute('aria-label') || 'image' });

Source: plugin/print/render.mjs:104.

## AIS-30a098930132

<!-- AIS-30a098930132 -->
const box = icon.parentElement.getBoundingClientRect(), glyph = icon.getBoundingClientRect();

Source: plugin/print/render.mjs:106.

## AIS-86c63bea6422

<!-- AIS-86c63bea6422 -->
out.icons.push({ page: pages.indexOf(icon.closest('.page')) + 1,

Source: plugin/print/render.mjs:107.

## AIS-2e109a46f033

<!-- AIS-2e109a46f033 -->
const lines = [], ink = [];

Source: plugin/print/render.mjs:113.

## AIS-3a56cd8e0cde

<!-- AIS-3a56cd8e0cde -->
const cs = getComputedStyle(el), b = el.getBoundingClientRect();

Source: plugin/print/render.mjs:115.

## AIS-47d42cdd2513

<!-- AIS-47d42cdd2513 -->
if (!b.width || cs.visibility === 'hidden' || cs.display === 'none') continue;

Source: plugin/print/render.mjs:116.

## AIS-b88cc07489cf

<!-- AIS-b88cc07489cf -->
for (const side of ['Top', 'Bottom']) if (parseFloat(cs[`border${side}Width`]) >= .5 && cs[`border${side}Style`] !== 'none')

Source: plugin/print/render.mjs:117.

## AIS-c056acb6efbe

<!-- AIS-c056acb6efbe -->
lines.push({ y: side === 'Top' ? b.top : b.bottom, x0: b.left, x1: b.right, name: el.className || el.tagName });

Source: plugin/print/render.mjs:118.

## AIS-54db8ddcdd06

<!-- AIS-54db8ddcdd06 -->
if (el.matches('img, svg, video, canvas')) ink.push(b);

Source: plugin/print/render.mjs:119.

## AIS-7626485a6d8a

<!-- AIS-7626485a6d8a -->
const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);

Source: plugin/print/render.mjs:121.

## AIS-de5b4d2c729a

<!-- AIS-de5b4d2c729a -->
for (let n = walk.nextNode(); n; n = walk.nextNode()) if (n.textContent.trim()) { const r = document.createRange(); r.selectNodeContents(n); ink.push(...r.getClientRects()); }

Source: plugin/print/render.mjs:122.

## AIS-6a11a7416a8a

<!-- AIS-6a11a7416a8a -->
const A = lines[a], B = lines[c], gap = mm(B.y - A.y);

Source: plugin/print/render.mjs:125.

## AIS-db05add2702f

<!-- AIS-db05add2702f -->
if (gap > 20) break;

Source: plugin/print/render.mjs:126.

## AIS-ea0ffaad4ef1

<!-- AIS-ea0ffaad4ef1 -->
if (gap < .5 || x1 - x0 < .5 * Math.min(A.x1 - A.x0, B.x1 - B.x0)) continue;

Source: plugin/print/render.mjs:129.

## AIS-080c90fcdd9c

<!-- AIS-080c90fcdd9c -->
if (!ink.some((r) => r.bottom > A.y + 1 && r.top < B.y - 1 && r.right > x0 && r.left < x1))

Source: plugin/print/render.mjs:130.

## AIS-2aa8f8582432

<!-- AIS-2aa8f8582432 -->
out.rules.push(`page ${i + 1}: ${A.name} and ${B.name}, ${gap.toFixed(1)} mm apart`);

Source: plugin/print/render.mjs:131.

## AIS-f790009f8745

<!-- AIS-f790009f8745 -->
const rgb = (hex) => { const n = parseInt(hex.replace('#', ''), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };

Source: plugin/print/render.mjs:139.

## AIS-41ca74b871d3

<!-- AIS-41ca74b871d3 -->
const BRAND = rgb(getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()), WHITE = 'rgb(255, 255, 255)';

Source: plugin/print/render.mjs:140.

## AIS-6fd0255cb6e0

<!-- AIS-6fd0255cb6e0 -->
const head = pages[0]?.classList.contains('cover') && pages[0].querySelector(':scope > .cover-head');

Source: plugin/print/render.mjs:141.

## AIS-a114056a2455

<!-- AIS-a114056a2455 -->
if (!head) out.family.push('page 1 is not the system cover (section.page.cover > header.cover-head)');

Source: plugin/print/render.mjs:142.

## AIS-1ebe8dcfbf21

<!-- AIS-1ebe8dcfbf21 -->
if (getComputedStyle(head).backgroundColor !== BRAND) out.family.push('cover head is not brand blue');

Source: plugin/print/render.mjs:145.

## AIS-83296c9cce70

<!-- AIS-83296c9cce70 -->
if (mm(head.getBoundingClientRect().height) < 80) out.family.push(`cover head is ${mm(head.getBoundingClientRect().height).toFixed(1)} mm tall (the system's is 88 mm or more)`);

Source: plugin/print/render.mjs:146.

## AIS-bc74fbc95e81

<!-- AIS-bc74fbc95e81 -->
if (!logo || !/-white\.svg$/.test(logo.getAttribute('src') || '')) out.family.push('cover head has no white logo');

Source: plugin/print/render.mjs:147.

## AIS-9abb495a5bc3

<!-- AIS-9abb495a5bc3 -->
if (!head.querySelector('.hexfield')) out.family.push('cover head has no hexagon field');

Source: plugin/print/render.mjs:148.

## AIS-f7e907fb22ee

<!-- AIS-f7e907fb22ee -->
if (!h1 || getComputedStyle(h1).color !== WHITE || Math.abs(parseFloat(getComputedStyle(h1).fontSize) * 72 / 96 - 34) > .5) out.family.push('cover title is not white at 34 pt');

Source: plugin/print/render.mjs:149.

## AIS-e79b6ebf3ae7

<!-- AIS-e79b6ebf3ae7 -->
if (!pages.at(-1)?.querySelector('.band')) out.family.push('last page has no contact band');

Source: plugin/print/render.mjs:151.

## AIS-2c6f4cddf11b

<!-- AIS-2c6f4cddf11b -->
if (el.closest('.cover-head, .band') || getComputedStyle(el).backgroundColor !== BRAND) continue;

Source: plugin/print/render.mjs:153.

## AIS-4f2abce34c86

<!-- AIS-4f2abce34c86 -->
const b = el.getBoundingClientRect();

Source: plugin/print/render.mjs:154.

## AIS-3c4c2acbf50a

<!-- AIS-3c4c2acbf50a -->
if (mm(b.height) > 12 && mm(b.width) > 40) out.family.push(`page ${i + 1}: a brand-blue block outside the cover head and contact band (${el.className || el.tagName}, ${mm(b.width).toFixed(0)} × ${mm(b.height).toFixed(0)} mm)`);

Source: plugin/print/render.mjs:155.

## AIS-f7cb120fd470

<!-- AIS-f7cb120fd470 -->
if (Math.abs(icon.dx) > .1 || Math.abs(icon.dy) > .1)

Source: plugin/print/render.mjs:162.

## AIS-8326eaaab409

<!-- AIS-8326eaaab409 -->
failed.push(`icon off-centre on page ${icon.page}: ${icon.dx.toFixed(2)}, ${icon.dy.toFixed(2)} px`);

Source: plugin/print/render.mjs:163.

## AIS-07e6a4309e9b

<!-- AIS-07e6a4309e9b -->
const bad = p.overflow || (p.clearance !== null && p.clearance < 6) || p.clipped.length;

Source: plugin/print/render.mjs:167.

## AIS-5cdd79884eee

<!-- AIS-5cdd79884eee -->
if (bad) failed.push(`page ${p.page} layout`);

Source: plugin/print/render.mjs:169.

## AIS-e9c2d51d1afc

<!-- AIS-e9c2d51d1afc -->
if (!p.cover && p.dead > 25) failed.push(`page ${p.page}: ${p.dead} mm of empty page above the footer or contact band (25 mm at most): enlarge a picture, rebalance or tighten`);

Source: plugin/print/render.mjs:170.

## AIS-30477092efaf

<!-- AIS-30477092efaf -->
for (const g of p.gaps) failed.push(`page ${p.page}: ${g} mm of empty page between two blocks (25 mm at most)`);

Source: plugin/print/render.mjs:171.

## AIS-5182035d098b

<!-- AIS-5182035d098b -->
if (p.bandGap !== null) {

Source: plugin/print/render.mjs:173.

## AIS-148e3de6eff9

<!-- AIS-148e3de6eff9 -->
if (!(Math.abs(p.bandGap - r.bandToken) <= .5)) failed.push(`page ${p.page}: ${p.bandGap} mm above the contact band; the system's gap is ${r.bandToken.toFixed(1)} mm (give the free height to a picture or rebalance the page)`);

Source: plugin/print/render.mjs:175.

## AIS-b1b686783b81

<!-- AIS-b1b686783b81 -->
} else if (!p.cover && p.fromBottom !== null && p.fromBottom < 19.5) failed.push(`page ${p.page}: content ends ${p.fromBottom} mm from the bottom (20 mm at least)`);

Source: plugin/print/render.mjs:176.

## AIS-097b609c7fc1

<!-- AIS-097b609c7fc1 -->
if (p.footPos && (Math.abs(p.footPos.bottom - FOOT.bottom) > .5 || Math.abs(p.footPos.right - FOOT.right) > .5))

Source: plugin/print/render.mjs:177.

## AIS-081e80a8d09d

<!-- AIS-081e80a8d09d -->
failed.push(`page ${p.page}: page number at ${p.footPos.bottom} mm from the bottom and ${p.footPos.right} mm from the right (${FOOT.bottom} and ${FOOT.right} mm)`);

Source: plugin/print/render.mjs:178.

## AIS-6142049404ba

<!-- AIS-6142049404ba -->
const seen = new Map();

Source: plugin/print/render.mjs:180.

## AIS-8e82c03ddf72

<!-- AIS-8e82c03ddf72 -->
const key = path.basename(i.src);

Source: plugin/print/render.mjs:182.

## AIS-8c9fca940f4f

<!-- AIS-8c9fca940f4f -->
if (!i.ok) failed.push(`image not loaded: ${key}`);

Source: plugin/print/render.mjs:183.

## AIS-6a279ecbafaf

<!-- AIS-6a279ecbafaf -->
if (seen.has(i.src)) failed.push(`image used twice: ${key} (pages ${seen.get(i.src)} and ${i.page})`);

Source: plugin/print/render.mjs:184.

## AIS-bdbf8f925ab7

<!-- AIS-bdbf8f925ab7 -->
if (i.up > 1.25) failed.push(`image shown at ${i.up}x its size: ${key} (page ${i.page})`);

Source: plugin/print/render.mjs:186.

## AIS-1c67de08e5ea

<!-- AIS-1c67de08e5ea -->
const note = i.ppi && i.ppi < 150 ? ' LOW for print' : '';

Source: plugin/print/render.mjs:187.

## AIS-fe0169bc07bb

<!-- AIS-fe0169bc07bb -->
for (const i of r.images.filter((x) => !x.svg)) { const why = bannedImage(i.src); if (why) failed.push(`${why} (page ${i.page})`); }

Source: plugin/print/render.mjs:192.

## AIS-30ed6cec5648

<!-- AIS-30ed6cec5648 -->
if (i.coverOk) { console.log(` cover photo ${key} accepted below the cover bar: ${i.coverOk}`); continue; }

Source: plugin/print/render.mjs:196.

## AIS-adb89e99aafa

<!-- AIS-adb89e99aafa -->
if (i.ppi && i.ppi < PRINT_COVER_PPI) failed.push(`cover photo ${key} prints at ${i.ppi} ppi; covers need ${PRINT_COVER_PPI} ppi or more (use a sharper master or a print-size still)`);

Source: plugin/print/render.mjs:197.

## AIS-dc9905512146

<!-- AIS-dc9905512146 -->
if (isVideoFrame(key)) failed.push(`cover photo ${key} is a video frame; covers need a photograph or a print-size still`);

Source: plugin/print/render.mjs:198.

## AIS-84bea694be72

<!-- AIS-84bea694be72 -->
for (const t of r.family) failed.push(`off the family frame: ${t}`);

Source: plugin/print/render.mjs:200.

## AIS-12a67715cef4

<!-- AIS-12a67715cef4 -->
for (const t of r.text) failed.push(`text under 8.5 pt: ${t}`);

Source: plugin/print/render.mjs:201.

## AIS-4b7eea33e0d9

<!-- AIS-4b7eea33e0d9 -->
for (const t of r.banned) failed.push(`review wording on the page: ${t}`);

Source: plugin/print/render.mjs:202.

## AIS-3eb0635f7377

<!-- AIS-3eb0635f7377 -->
for (const t of [...new Set(r.rules)]) failed.push(`two rules with nothing between them: ${t}`);

Source: plugin/print/render.mjs:203.

## AIS-f679670e6165

<!-- AIS-f679670e6165 -->
for (const t of r.numbers) failed.push(`Spanish number with a point for thousands (write 30 000 with a non-breaking space, 1285 without): ${t}`);

Source: plugin/print/render.mjs:204.

## AIS-3b1129356ac2

<!-- AIS-3b1129356ac2 -->
if (r.missing.length) {

Source: plugin/print/render.mjs:205.

## AIS-ec6965ff5b52

<!-- AIS-ec6965ff5b52 -->
const lines = r.missing.map((m) => `- ${base}, page ${m.page}: ${m.what}`);

Source: plugin/print/render.mjs:206.

## AIS-0811531ef8e6

<!-- AIS-0811531ef8e6 -->
if (!draft) failed.push(`${r.missing.length} missing image(s); see MISSING.md or build with --draft`);

Source: plugin/print/render.mjs:208.

## AIS-08a0953db4c2

<!-- AIS-08a0953db4c2 -->
if (failed.length) { console.log('CHECKS FAILED:\n ' + failed.join('\n ')); if (!look) throw new Error('checks failed'); }

Source: plugin/print/render.mjs:210.

## AIS-2b6e2ad08258

<!-- AIS-2b6e2ad08258 -->
const pdf = path.join(dir, `${base}${draft ? '-draft' : ''}${failed.length ? '-failing' : ''}.pdf`);

Source: plugin/print/render.mjs:212.

## AIS-5364b1a35256

<!-- AIS-5364b1a35256 -->
if (t3.length) throw new Error('PDF has Type 3 fonts: ' + t3.join(', '));

Source: plugin/print/render.mjs:215.

## AIS-9ee0cf36ee0e

<!-- AIS-9ee0cf36ee0e -->
const prev = path.join(dir, 'previews');

Source: plugin/print/render.mjs:216.

## AIS-f87ad27fffdf

<!-- AIS-f87ad27fffdf -->
if (failed.length) process.exitCode = 1;

Source: plugin/print/render.mjs:222.

## AIS-85df8093e14e

<!-- AIS-85df8093e14e -->
const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

Source: plugin/print/image-rules.mjs:13.

## AIS-98639696258c

<!-- AIS-98639696258c -->
const entries = () => catalog ??= (() => { try { return JSON.parse(fs.readFileSync(path.join(STUDIO, 'library/catalog.json'), 'utf8')).assets || []; } catch { return []; } })();

Source: plugin/print/image-rules.mjs:29.

## AIS-a74858affcb7

<!-- AIS-a74858affcb7 -->
const FRAME_WORDS = /video frame|frame from|fotograma|\bframe \d{1,2}:\d{2}|from the \d{3,4}p (interview|video|film)|from AIS.s own (published )?(video|film)/i;

Source: plugin/print/image-rules.mjs:30.
