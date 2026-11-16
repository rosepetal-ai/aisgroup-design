# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-be4435fa78f5

<!-- AIS-be4435fa78f5 -->
Then read [the shared workflow](../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder.

Source: plugin/skills/brand-review/SKILL.md:9.

## AIS-5e423b5cfa90

<!-- AIS-5e423b5cfa90 -->
The rules live in the guide (copied into the skills [brand-guidelines](../brand-guidelines/SKILL.md), [design-language](../design-language/SKILL.md) and [communications](../communications/SKILL.md)), the [production rules](../_shared/references/production-rules.md) and the [look checklist](references/look-checklist.md). This skill is the order to check them in. Quote the rule briefly in each finding.

Source: plugin/skills/brand-review/SKILL.md:11.

## AIS-dfad3d947ae3

<!-- AIS-dfad3d947ae3 -->
Images: Read them, then 2× crops of every logo, chip, screen, label and product (`python3 -c "from PIL import Image;im=Image.open('in.png');im.crop((x0,y0,x1,y1)).resize(((x1-x0)*2,(y1-y0)*2)).save('crop.png')"`). `identify file.png` for the size; `exiftool file.png` (or `identify -verbose`) for metadata.

Source: plugin/skills/brand-review/SKILL.md:16.

## AIS-84e8745d607c

<!-- AIS-84e8745d607c -->
Is it already judged? Search `library/catalog.json` for the file name or a near-identical picture (same size): an existing `rejected` or `review` verdict and its reason come first in the report.

Source: plugin/skills/brand-review/SKILL.md:19.

## AIS-1909ee19d5a5

<!-- AIS-1909ee19d5a5 -->
The main rule above wins over every check below: a piece with a tagline, helper text or a second purpose fails even if everything else passes.

Source: plugin/skills/brand-review/SKILL.md:23.

## AIS-0d4c4380a3ee

<!-- AIS-0d4c4380a3ee -->
**Keep it simple.** Run `node engine/text-check.mjs <file>` (edit_piece validate runs it too): any error fails, every warning gets a look. Then by eye: one purpose; nothing above or beside the headline on posts, carousels and decks (print keeps its small section labels); no tagline, helper text, subtitle or secondary label; text that reads as generated (see [writing](../writing/SKILL.md)) fails. A piece that only works with them fails on its layout.

Source: plugin/skills/brand-review/SKILL.md:25.

## AIS-3924b8ec1c61

<!-- AIS-3924b8ec1c61 -->
**Truth and credibility of the pictures** (judge the result, not the tool). Real photos, our product renders and our exterior machine views come first. A generated or composited picture passes only if, at 100 % and at its published size:

Source: plugin/skills/brand-review/SKILL.md:26.

## AIS-d0a3dacb934c

<!-- AIS-d0a3dacb934c -->
every letter on screens, labels and packs reads as real text (no garbled, melted or invented words, no invented customer brands; approved AIS demo product identities are valid);

Source: plugin/skills/brand-review/SKILL.md:27.

## AIS-250611dbf4de

<!-- AIS-250611dbf4de -->
geometry, light and reflections are possible (nothing floats, fuses, repeats or glows; no god-rays or sci-fi light);

Source: plugin/skills/brand-review/SKILL.md:28.

## AIS-77369ca958c5

<!-- AIS-77369ca958c5 -->
the machine is the AIS machine it is said to be (no logo pasted on another maker's machine, no invented camera or head, no interior or open-guard view);

Source: plugin/skills/brand-review/SKILL.md:29.

## AIS-5cabfcc44643

<!-- AIS-5cabfcc44643 -->
client brands are blurred, and it implies no customer, installation or measured result it doesn't have;

Source: plugin/skills/brand-review/SKILL.md:30.

## AIS-82ad9dc7c873

<!-- AIS-82ad9dc7c873 -->
it sits with the rest of the piece in light and grade.

Source: plugin/skills/brand-review/SKILL.md:31.

## AIS-0c30832bd938

<!-- AIS-0c30832bd938 -->
One failure is enough to reject it. Machines from engineering models: exterior only, guards closed. Invented customers, figures, quotes or certifications fail.

Source: plugin/skills/brand-review/SKILL.md:32.

## AIS-dfb4cf43359f

<!-- AIS-dfb4cf43359f -->
**Words that give the method away.** No internal production notes such as "render", "CAD", "borrador" or "pendiente" in visible text, captions, alt text, file names or metadata. Preserve approved AIS demo product marks and source-supported product terminology; do not use a blanket word veto to erase substantive content.

Source: plugin/skills/brand-review/SKILL.md:33.

## AIS-757e79c15711

<!-- AIS-757e79c15711 -->
**Claims.** No superlatives or absolutes ("100 % detección", "cero defectos", "el mejor"); a figure needs its relevant units and source conditions (a baseline only for a comparison); the defects shown must be ones that machine is documented to catch; AI is never the argument.

Source: plugin/skills/brand-review/SKILL.md:34.

## AIS-f2ddefbbcef3

<!-- AIS-f2ddefbbcef3 -->
**Names and lines.** AIS Vision Systems, AIS REV 360 (STANDARD, COMPACT, PHARMA, Cables), AIS Hopper, AIS KARIKÓ, OPTICAIS, Rosepetal, exactly; AIS never alone. The company line "Engineering peace of mind" / "Automated quality control" belongs on covers and banners only, exactly, in English.

Source: plugin/skills/brand-review/SKILL.md:35.

## AIS-392c07285ea7

<!-- AIS-392c07285ea7 -->
**Type.** Inter (JetBrains Mono for machine values); sentence case, never all caps; headlines weight 500, three lines at most; nothing under the minimums.

Source: plugin/skills/brand-review/SKILL.md:36.

## AIS-37337045a223

Historical wording: explicitly superseded by AIS-6e9225032282. Apply the dated resolution to the conflicting clause; preserve other clauses and this exact historical wording.

<!-- AIS-37337045a223 -->
**Colour and graphics.** The eight core colours and the four approved grounds with their pairings ([Colour](../design-language/references/colour.md)); status colours only for status, with a word. No gradients, glows or particles. The five approved decorative patterns may be used across media, one per piece, never behind body text or tables. Hexagons only as the faint outline pattern (one fade per piece, never over a photo's subject) or a single outline hexagon holding an icon or number; carousels close with the faint fade on the contact slide. Accent colour only on the headline's closing phrase, its ¿ ? ¡ ! included. Lucide icons only; no emoji, typed arrows or middle-dot separators.

Source: plugin/skills/brand-review/SKILL.md:37.

## AIS-afe518d1ab8c

<!-- AIS-afe518d1ab8c -->
**Logos.** Ours: the supplied file, right version for the ground, clear space, signing small at the foot, not leading (about 120 px wide on a 1080 px post, 140 px on a 1920 slide, 20 mm on A4 (Rosepetal 38 mm); never under the minimums: AIS Vision Systems 100 px, AIS Group 48 px, Rosepetal 130 px). The original marketing customer-logo wall is approved. For other third-party logos, use the actual rights/permission evidence; otherwise remove them and write the name in text.

Source: plugin/skills/brand-review/SKILL.md:38.

## AIS-3aa69dfd9fe7

<!-- AIS-3aa69dfd9fe7 -->
**Structure and format.** One message, one idea per slide, image first, one approved call to action (in the caption for posts), the issuing brand signs, "Part of AIS Group" endorses on its own line. LinkedIn feed posts are 4:5 (1080 × 1350) by default; carousels use a meaningful length (3–10 in the current social engine), with cover, useful content and contact as appropriate.

Source: plugin/skills/brand-review/SKILL.md:39.

## AIS-5e265dd905ec

<!-- AIS-5e265dd905ec -->
**Overlays** ([Imagery, Detection overlays](../design-language/references/imagery.md#detection-overlays)). Hairline boxes `#3664B3` (`#A7BFE4` on dark), red only for the defect; chips say what was expected, in words; one verdict (`OK`, or `NOK 1 defecto`), top left; nothing covers the evidence; readings and confidences only on real system output.

Source: plugin/skills/brand-review/SKILL.md:40.

## AIS-458d6bdd1857

<!-- AIS-458d6bdd1857 -->
**Does the picture prove the words?** At 2×: the frame is on the defect; exactly one defect; every product's state readable; no conveyors or rails in product posts; each reuse serves reveal, comparison or continuity; nothing upscaled past its medium’s limit (1.25× in print and carousels, 1.3× in a deck panel, 1.5× on a single post).

Source: plugin/skills/brand-review/SKILL.md:41.

## AIS-304b8e53ed96

<!-- AIS-304b8e53ed96 -->
**Customer material.** Client logos, wineries, appellations and codes blurred softly; honour actual documented customer restrictions without inventing another general permission gate.

Source: plugin/skills/brand-review/SKILL.md:42.

## AIS-5e1fdeeffafd

<!-- AIS-5e1fdeeffafd -->
**Language.** Native, not translated; Spanish ¿ ¡ and a space before % (95 %); Catalan l·l and ’; English British.

Source: plugin/skills/brand-review/SKILL.md:43.

## AIS-52673267a48c

<!-- AIS-52673267a48c -->
**Export.** Published PNG/JPG/PDF files carry no tool or prompt metadata (`exiftool -all= file.png` strips it) and a public file name with none of the words in step 2.

Source: plugin/skills/brand-review/SKILL.md:44.

## AIS-d8ef8be74b91

<!-- AIS-d8ef8be74b91 -->
Lead with the verdict: **reviewed for local delivery**, **fix** or **rebuild**. This is not a publishing action or a claim of user approval. Then the findings, worst first, each with where it is (slide, page, timecode), the rule, and the fix. List what the person must confirm (rights, consent, permissions for third-party logos, customer approval, figures). Offer to rebuild it with the closest skill (`social-post`, `linkedin-carousel`, `linkedin-banner`, `brochure`, `presentation`, `brand-video`) and say what that needs (a real photo, the figure's source, event details).

Source: plugin/skills/brand-review/SKILL.md:50.

## AIS-87a7ad80ee22

<!-- AIS-87a7ad80ee22 -->
The checks catch rule breaks, not wrong or dull work, so passing them proves little. Open every page, slide or frame at full size and at feed size (about 550 px wide), then answer these in writing before handing a piece over:

Source: plugin/skills/brand-review/references/look-checklist.md:3.

## AIS-ae4f81372ac5

<!-- AIS-ae4f81372ac5 -->
**What does the eye see first, and is it the one message?** At feed size, the headline and the proof can be read.

Source: plugin/skills/brand-review/references/look-checklist.md:5.

## AIS-cdeaf2aa4f2e

<!-- AIS-cdeaf2aa4f2e -->
**Does the picture prove the words?** Everything the headline claims is visible. "Leaves the line" needs the thing that removes it.

Source: plugin/skills/brand-review/references/look-checklist.md:6.

## AIS-a7f09065e05c

<!-- AIS-a7f09065e05c -->
**Does every mark sit on what it names?** The frame is on the defect, the chip says what was expected, and the verdict covers nothing that matters. Check each one at 2× zoom.

Source: plugin/skills/brand-review/references/look-checklist.md:7.

## AIS-f48f79a98581

<!-- AIS-f48f79a98581 -->
**Is there exactly one defect?** No second product that could be mistaken for it, and nothing half-hidden or cut so its state is unclear.

Source: plugin/skills/brand-review/references/look-checklist.md:8.

## AIS-b8086278b337

<!-- AIS-b8086278b337 -->
**Does it make physical sense?** Sizes in proportion, parts supported, nothing passing through anything.

Source: plugin/skills/brand-review/references/look-checklist.md:9.

## AIS-3b1a330f795c

<!-- AIS-3b1a330f795c -->
**Does it hold up against the guide?** Less text, one real image, the logo signing rather than leading, photos at their true grade.

Source: plugin/skills/brand-review/references/look-checklist.md:10.

## AIS-c5ccf80a7bd1

<!-- AIS-c5ccf80a7bd1 -->
If any answer is no, fix it and look again. When the same mistake could happen again, propose a check for the engine rather than fixing one piece.

Source: plugin/skills/brand-review/references/look-checklist.md:12.

## AIS-41467851b911

<!-- AIS-41467851b911 -->
Never publish anything rendered with `--force`; it is for drafts that still have placeholders.

Source: plugin/skills/brand-review/references/look-checklist.md:14.

## AIS-13156b771c19

<!-- AIS-13156b771c19 -->
const report = await aisBrandCheck(); // { findings: [...], pass: true|false }

Source: plugin/brand/downloads/qa/brand-check.js:3.

## AIS-6566436bd02d

<!-- AIS-6566436bd02d -->
const report = await page.evaluate(() => aisBrandCheck());

Source: plugin/brand/downloads/qa/brand-check.js:6.

## AIS-b6e66b4a78e1

<!-- AIS-b6e66b4a78e1 -->
const PALETTE = new Set(('EDF2FA B8CDE6 A7BFE4 7C9FD7 517FC9 3664B3 1E4591 17356E 10254C 111A2E 0B1220 ' +

Source: plugin/brand/downloads/qa/brand-check.js:16.

## AIS-4fc59603f4cd

<!-- AIS-4fc59603f4cd -->
const FONTS = ['inter', 'jetbrains mono'];

Source: plugin/brand/downloads/qa/brand-check.js:20.

## AIS-4e0908451c2d

<!-- AIS-4e0908451c2d -->
const GLYPHS = /[←-⇿✓-✘•▶►★☆➡➔➜]|\p{Extended_Pictographic}/u;

Source: plugin/brand/downloads/qa/brand-check.js:21.

## AIS-9370a42b364e

<!-- AIS-9370a42b364e -->
const hex = (rgb) => {

Source: plugin/brand/downloads/qa/brand-check.js:23.

## AIS-407a2407c690

<!-- AIS-407a2407c690 -->
const m = rgb.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+%?))?\)/);

Source: plugin/brand/downloads/qa/brand-check.js:24.

## AIS-79a56845fc73

<!-- AIS-79a56845fc73 -->
if (!m) return null;

Source: plugin/brand/downloads/qa/brand-check.js:25.

## AIS-37d6ad0bde09

<!-- AIS-37d6ad0bde09 -->
const alpha = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);

Source: plugin/brand/downloads/qa/brand-check.js:26.

## AIS-3131169fbe48

<!-- AIS-3131169fbe48 -->
if (alpha < 1) return 'translucent';

Source: plugin/brand/downloads/qa/brand-check.js:27.

## AIS-8b888499eb2e

<!-- AIS-8b888499eb2e -->
const path = (el) => {

Source: plugin/brand/downloads/qa/brand-check.js:30.

## AIS-476365cef340

<!-- AIS-476365cef340 -->
const bits = [];

Source: plugin/brand/downloads/qa/brand-check.js:31.

## AIS-aa0e0735ec08

<!-- AIS-aa0e0735ec08 -->
const skipped = (el) => el.closest('[data-brand-check="skip"], script, style, noscript, template');

Source: plugin/brand/downloads/qa/brand-check.js:37.

## AIS-6f9a29d2d1ee

<!-- AIS-6f9a29d2d1ee -->
const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };

Source: plugin/brand/downloads/qa/brand-check.js:38.

## AIS-985616b6706d

<!-- AIS-985616b6706d -->
const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

Source: plugin/brand/downloads/qa/brand-check.js:39.

## AIS-23a234f2f224

<!-- AIS-23a234f2f224 -->
const findings = [];

Source: plugin/brand/downloads/qa/brand-check.js:42.

## AIS-b6b7f7b8437d

<!-- AIS-b6b7f7b8437d -->
const add = (rule, el, detail) => findings.push({ rule, where: el ? path(el) : 'page', detail });

Source: plugin/brand/downloads/qa/brand-check.js:43.

## AIS-d9019ec0423e

<!-- AIS-d9019ec0423e -->
if (document.fonts) await document.fonts.ready;

Source: plugin/brand/downloads/qa/brand-check.js:44.

## AIS-4ecc9f5022bc

<!-- AIS-4ecc9f5022bc -->
const extra = document.documentElement.scrollWidth - document.documentElement.clientWidth;

Source: plugin/brand/downloads/qa/brand-check.js:47.

## AIS-5565adb5525b

<!-- AIS-5565adb5525b -->
if (extra > 0) add('overflow', null, `page is ${extra}px wider than the window`);

Source: plugin/brand/downloads/qa/brand-check.js:48.

## AIS-c246091b6601

<!-- AIS-c246091b6601 -->
const el = n.parentElement;

Source: plugin/brand/downloads/qa/brand-check.js:53.

## AIS-71784556d8b7

<!-- AIS-71784556d8b7 -->
if (!el || skipped(el) || el.closest('pre, svg') || !visible(el)) continue;

Source: plugin/brand/downloads/qa/brand-check.js:54.

## AIS-9d2f0593bcd7

<!-- AIS-9d2f0593bcd7 -->
const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);

Source: plugin/brand/downloads/qa/brand-check.js:56.

## AIS-1d21f227a5f6

<!-- AIS-1d21f227a5f6 -->
if (new Set([...r.getClientRects()].filter((b) => b.width > 0.5).map((b) => Math.round(b.top))).size > 1) add('broken-word', el, `"${m[0]}" breaks across lines`);

Source: plugin/brand/downloads/qa/brand-check.js:57.

## AIS-467a7b9b474d

<!-- AIS-467a7b9b474d -->
if (/(?<![lL])\u00b7|\u00b7(?![lL])/u.test(n.textContent)) add('separator', el, 'Middle-dot separator; use layout, a new line or a comma. Only Catalan l·l is allowed.');

Source: plugin/brand/downloads/qa/brand-check.js:59.

## AIS-399344a43911

<!-- AIS-399344a43911 -->
if (!el.closest('code') && GLYPHS.test(n.textContent)) add('glyph', el, `typed symbol in "${n.textContent.trim().slice(0, 40)}"; use a Lucide icon`);

Source: plugin/brand/downloads/qa/brand-check.js:61.

## AIS-5ba40c4cff90

<!-- AIS-5ba40c4cff90 -->
if (skipped(el) || el.closest('svg') || !visible(el)) continue;

Source: plugin/brand/downloads/qa/brand-check.js:65.

## AIS-498f0ac0bd43

<!-- AIS-498f0ac0bd43 -->
for (const attr of ['alt', 'aria-label', 'title']) if (/(?<![lL])\u00b7|\u00b7(?![lL])/u.test(el.getAttribute(attr) || '')) add('separator', el, `Middle-dot separator in ${attr}; use layout or a comma.`);

Source: plugin/brand/downloads/qa/brand-check.js:66.

## AIS-1d0a83f419f3

<!-- AIS-1d0a83f419f3 -->
const cs = getComputedStyle(el);

Source: plugin/brand/downloads/qa/brand-check.js:67.

## AIS-b97291d4def6

<!-- AIS-b97291d4def6 -->
const par = el.parentElement;

Source: plugin/brand/downloads/qa/brand-check.js:69.

## AIS-f0c8dc89a5d7

<!-- AIS-f0c8dc89a5d7 -->
if (par && getComputedStyle(par).overflowX === 'visible' && !['absolute', 'fixed'].includes(cs.position)) {

Source: plugin/brand/downloads/qa/brand-check.js:70.

## AIS-1553818e2815

<!-- AIS-1553818e2815 -->
const a = el.getBoundingClientRect(), b = par.getBoundingClientRect();

Source: plugin/brand/downloads/qa/brand-check.js:71.

## AIS-acf208c490b4

<!-- AIS-acf208c490b4 -->
if (a.right > b.right + 1 && b.width > 0) add('spill', el, `${Math.round(a.right - b.right)}px past its container`);

Source: plugin/brand/downloads/qa/brand-check.js:72.

## AIS-fbfb7f273c5e

<!-- AIS-fbfb7f273c5e -->
if (ownText(el)) {

Source: plugin/brand/downloads/qa/brand-check.js:74.

## AIS-cb629e884cab

<!-- AIS-cb629e884cab -->
const family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();

Source: plugin/brand/downloads/qa/brand-check.js:76.

## AIS-d4e34950ba20

<!-- AIS-d4e34950ba20 -->
if (!FONTS.includes(family)) add('font', el, `font "${family}"`);

Source: plugin/brand/downloads/qa/brand-check.js:77.

## AIS-24ae9057f9bf

<!-- AIS-24ae9057f9bf -->
if (parseFloat(cs.fontSize) < 12) add('text-size', el, `${cs.fontSize} text`);

Source: plugin/brand/downloads/qa/brand-check.js:78.

## AIS-54e71eb3f43b

<!-- AIS-54e71eb3f43b -->
const c = hex(cs.color);

Source: plugin/brand/downloads/qa/brand-check.js:80.

## AIS-3fd4bea55c0f

<!-- AIS-3fd4bea55c0f -->
if (c && c !== 'translucent' && !PALETTE.has(c)) add('colour', el, `text colour #${c} is not in the palette`);

Source: plugin/brand/downloads/qa/brand-check.js:81.

## AIS-f4e373edc78e

<!-- AIS-f4e373edc78e -->
const bg = hex(cs.backgroundColor);

Source: plugin/brand/downloads/qa/brand-check.js:83.

## AIS-d9bc995d590a

<!-- AIS-d9bc995d590a -->
if (bg && bg !== 'translucent' && !PALETTE.has(bg)) add('colour', el, `background #${bg} is not in the palette`);

Source: plugin/brand/downloads/qa/brand-check.js:84.

## AIS-e00d936ca977

<!-- AIS-e00d936ca977 -->
if (el.tagName === 'IMG' && !el.hasAttribute('alt')) add('alt', el, 'image without an alt attribute');

Source: plugin/brand/downloads/qa/brand-check.js:86.

## AIS-2957c96fcb5f

<!-- AIS-2957c96fcb5f -->
if (axe && window.axe) {

Source: plugin/brand/downloads/qa/brand-check.js:90.

## AIS-f5319a5911ec

<!-- AIS-f5319a5911ec -->
const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });

Source: plugin/brand/downloads/qa/brand-check.js:91.

## AIS-447476f2c925

<!-- AIS-447476f2c925 -->
for (const v of res.violations) for (const node of v.nodes) findings.push({ rule: 'a11y:' + v.id, where: node.target.join(' '), detail: v.help });

Source: plugin/brand/downloads/qa/brand-check.js:92.
