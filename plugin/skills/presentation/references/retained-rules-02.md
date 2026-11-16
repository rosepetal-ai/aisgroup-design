# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-7f821c7f5de1

<!-- AIS-7f821c7f5de1 -->
if (all.length || !/^frames match/.test(report)) process.exitCode = 1;

Source: plugin/decks/verify.mjs:125.

## AIS-a50d775c01ad

<!-- AIS-a50d775c01ad -->
const failures = [], measurements = [];

Source: plugin/decks/alignment.mjs:3.

## AIS-6b4a4e09d4d4

<!-- AIS-6b4a4e09d4d4 -->
const rect = (e) => e.getBoundingClientRect();

Source: plugin/decks/alignment.mjs:4.

## AIS-00db55d1cad0

<!-- AIS-00db55d1cad0 -->
const baseline = (e) => {

Source: plugin/decks/alignment.mjs:5.

## AIS-62faaeefb94e

<!-- AIS-62faaeefb94e -->
const probe = document.createElement('span');

Source: plugin/decks/alignment.mjs:6.

## AIS-a8126bf47381

<!-- AIS-a8126bf47381 -->
e.prepend(probe); const y = rect(probe).top; probe.remove(); return y;

Source: plugin/decks/alignment.mjs:8.

## AIS-b43cb0bcb8ca

<!-- AIS-b43cb0bcb8ca -->
const check = (kind, actual, expected, detail) => {

Source: plugin/decks/alignment.mjs:10.

## AIS-f0e23a65a588

<!-- AIS-f0e23a65a588 -->
const delta = Math.abs(actual - expected);

Source: plugin/decks/alignment.mjs:11.

## AIS-5d9a823e2b67

<!-- AIS-5d9a823e2b67 -->
measurements.push({kind, actual, expected, delta, detail});

Source: plugin/decks/alignment.mjs:12.

## AIS-4f31659869d1

<!-- AIS-4f31659869d1 -->
if (delta > 2) failures.push(`${kind}: ${detail}: ${actual.toFixed(2)} vs ${expected.toFixed(2)} px (delta ${delta.toFixed(2)})`);

Source: plugin/decks/alignment.mjs:13.

## AIS-44cf147c9180

<!-- AIS-44cf147c9180 -->
const bounds = rect(slide);

Source: plugin/decks/alignment.mjs:16.

## AIS-bf5380cce57f

<!-- AIS-bf5380cce57f -->
if (slide.matches('.L-features,.L-phases,.L-steps')) {

Source: plugin/decks/alignment.mjs:18.

## AIS-4c16a84324bb

<!-- AIS-4c16a84324bb -->
check('row-title-scale', parseFloat(getComputedStyle(row.children[1]).fontSize), 44, `row ${n+1}`);

Source: plugin/decks/alignment.mjs:19.

## AIS-7f876b30a662

<!-- AIS-7f876b30a662 -->
if (row.children[2]) check('row-body-scale', parseFloat(getComputedStyle(row.children[2]).fontSize), 38, `row ${n+1}`);

Source: plugin/decks/alignment.mjs:20.

## AIS-7ab77acf8d5b

<!-- AIS-7ab77acf8d5b -->
const title=text.style.fontWeight==='500';

Source: plugin/decks/alignment.mjs:24.

## AIS-c9c5bd767a4a

<!-- AIS-c9c5bd767a4a -->
check(title?'feature-title-scale':'feature-body-scale',parseFloat(getComputedStyle(text).fontSize),title?44:38,`feature text ${n+1}`);

Source: plugin/decks/alignment.mjs:25.

## AIS-0134c242ed87

<!-- AIS-0134c242ed87 -->
check('photo-panel-left', rect(p).left-bounds.left, 980, 'full-panel photo');

Source: plugin/decks/alignment.mjs:28.

## AIS-11309291adc3

<!-- AIS-11309291adc3 -->
check('photo-panel-right', rect(p).right-bounds.left, 1920, 'full-panel photo');

Source: plugin/decks/alignment.mjs:29.

## AIS-06ed15f10aed

<!-- AIS-06ed15f10aed -->
if (slide.matches('.L-split,.L-figures,.L-photo,.L-statement,.L-mosaic')) {

Source: plugin/decks/alignment.mjs:31.

## AIS-96a529c96f3e

<!-- AIS-96a529c96f3e -->
check('photo-panel-top', rect(p).top-bounds.top, 0, 'full-panel photo');

Source: plugin/decks/alignment.mjs:32.

## AIS-eaba9a6746ca

<!-- AIS-eaba9a6746ca -->
check('photo-panel-height', rect(p).height, 1080, 'full-panel photo');

Source: plugin/decks/alignment.mjs:33.

## AIS-a36552c30177

<!-- AIS-a36552c30177 -->
if (slide.matches('.L-split,.L-figures')) {

Source: plugin/decks/alignment.mjs:36.

## AIS-6f746187487f

<!-- AIS-6f746187487f -->
const brightness = color => (color.match(/[\d.]+/g)||[]).slice(0,3).reduce((sum,channel,index)=>sum + Number(channel)*[.2126,.7152,.0722][index],0);

Source: plugin/decks/alignment.mjs:38.

## AIS-e3a046973f4e

<!-- AIS-e3a046973f4e -->
if (slide.classList.contains('g-brand') && brightness(getComputedStyle(p).backgroundColor) < brightness(getComputedStyle(slide).backgroundColor)-2)

Source: plugin/decks/alignment.mjs:39.

## AIS-43b368cfad7f

<!-- AIS-43b368cfad7f -->
failures.push('photo-placeholder: darker inset panel on a blue slide');

Source: plugin/decks/alignment.mjs:40.

## AIS-0096b066049b

<!-- AIS-0096b066049b -->
const p=rect(im.closest('.pic')), cs=getComputedStyle(im);

Source: plugin/decks/alignment.mjs:44.

## AIS-a94c875e35ad

<!-- AIS-a94c875e35ad -->
if (!slide.matches('.L-cover')) {

Source: plugin/decks/alignment.mjs:45.

## AIS-4db320bd0311

<!-- AIS-4db320bd0311 -->
const rendered=cs.objectFit==='fill'?rect(im):p;

Source: plugin/decks/alignment.mjs:46.

## AIS-4740143377fa

<!-- AIS-4740143377fa -->
const scale=cs.objectFit==='contain' ? Math.min(rendered.width/im.naturalWidth,rendered.height/im.naturalHeight) : Math.max(rendered.width/im.naturalWidth,rendered.height/im.naturalHeight);

Source: plugin/decks/alignment.mjs:47.

## AIS-5e07d4a241aa

<!-- AIS-5e07d4a241aa -->
measurements.push({kind:'source-pixel-scale',actual:scale,expected:1.3,delta:Math.max(0,scale-1.3),detail:im.getAttribute('src')});

Source: plugin/decks/alignment.mjs:48.

## AIS-07f6ba830709

<!-- AIS-07f6ba830709 -->
if (scale>1.305) failures.push(`source-pixel-scale: ${scale.toFixed(3)}x exceeds 1.3x`);

Source: plugin/decks/alignment.mjs:49.

## AIS-b5aba7a07fca

<!-- AIS-b5aba7a07fca -->
const holder=im.closest('[data-side-photo]');

Source: plugin/decks/alignment.mjs:51.

## AIS-6960294de819

<!-- AIS-6960294de819 -->
if (holder?.dataset.sidePhoto==='limited' && Math.max(940/im.naturalWidth,1080/im.naturalHeight)<=1.3 && slide.matches('.L-split,.L-figures'))

Source: plugin/decks/alignment.mjs:52.

## AIS-98cd605f3347

<!-- AIS-98cd605f3347 -->
failures.push('photo-panel: source supports a full panel but is inset');

Source: plugin/decks/alignment.mjs:53.

## AIS-9fa4b8269e9c

<!-- AIS-9fa4b8269e9c -->
slide.querySelectorAll('.pic img').forEach(im=> { if (/(sabadell[-_]facade|sabadell-building|office-map)/i.test(im.getAttribute('src')) && !slide.dataset.streetView) failures.push('facility-aerial: facade/map needs an explicit street-view purpose'); });

Source: plugin/decks/alignment.mjs:55.

## AIS-f61cdb09ad5b

<!-- AIS-f61cdb09ad5b -->
const title=slide.querySelector('.mask')?.textContent || '';

Source: plugin/decks/alignment.mjs:56.

## AIS-a313f59b8b4d

<!-- AIS-a313f59b8b4d -->
if (slide.dataset.facility==='true' || /^(Equipo propio|Nuestra oficina en España|Contáctanos)$/.test(title.trim())) {

Source: plugin/decks/alignment.mjs:57.

## AIS-4521383f2a8a

<!-- AIS-4521383f2a8a -->
const photos=[...slide.querySelectorAll('.pic img')];

Source: plugin/decks/alignment.mjs:58.

## AIS-0e5c4da8bfc1

<!-- AIS-0e5c4da8bfc1 -->
measurements.push({kind:'facility-aerial',actual:photos.some(im=>/sabadell-aerial/.test(im.getAttribute('src')))?1:0,expected:1,delta:photos.some(im=>/sabadell-aerial/.test(im.getAttribute('src')))?0:1,detail:'approved Sabadell aerial'});

Source: plugin/decks/alignment.mjs:59.

## AIS-7bf503647b25

<!-- AIS-7bf503647b25 -->
if (!photos.some(im=>/sabadell-aerial/.test(im.getAttribute('src')))) failures.push('facility-aerial: use the registered Sabadell aerial photograph');

Source: plugin/decks/alignment.mjs:60.

## AIS-b9f35fbe5c95

<!-- AIS-b9f35fbe5c95 -->
if (!slide.matches('.L-cover,.L-divider')) {

Source: plugin/decks/alignment.mjs:64.

## AIS-cd859cf0154a

<!-- AIS-cd859cf0154a -->
const stack = [...slide.children].find((e) => e.matches('.stack') && e.firstElementChild?.matches('.mask'));

Source: plugin/decks/alignment.mjs:65.

## AIS-2cd21ad021db

<!-- AIS-2cd21ad021db -->
const heading = stack?.querySelector(':scope>.mask>.mi.t-h');

Source: plugin/decks/alignment.mjs:66.

## AIS-1c93e2b853ef

<!-- AIS-1c93e2b853ef -->
if (heading) {

Source: plugin/decks/alignment.mjs:67.

## AIS-9a8f198d69f6

<!-- AIS-9a8f198d69f6 -->
const box = rect(heading), bounds = rect(slide);

Source: plugin/decks/alignment.mjs:68.

## AIS-d4a40099e630

<!-- AIS-d4a40099e630 -->
check('heading-left', box.left - bounds.left, 128, 'content heading');

Source: plugin/decks/alignment.mjs:69.

## AIS-2e78132a8657

<!-- AIS-2e78132a8657 -->
check('heading-top', box.top - bounds.top, 96, 'content heading');

Source: plugin/decks/alignment.mjs:70.

## AIS-2ded31e72dea

<!-- AIS-2ded31e72dea -->
const style = getComputedStyle(grid), tracks = style.gridTemplateColumns.split(' ').map(parseFloat);

Source: plugin/decks/alignment.mjs:76.

## AIS-8734383a7a93

<!-- AIS-8734383a7a93 -->
const cells = [...grid.children], columns = tracks.length, origin = rect(grid);

Source: plugin/decks/alignment.mjs:77.

## AIS-47f6ec7c309f

<!-- AIS-47f6ec7c309f -->
const gutter = parseFloat(style.columnGap), rowGap = parseFloat(style.rowGap) || 0;

Source: plugin/decks/alignment.mjs:78.

## AIS-5e051b9183ad

<!-- AIS-5e051b9183ad -->
const rowBounds = [], ruleRails = [];

Source: plugin/decks/alignment.mjs:79.

## AIS-71e1657720c8

<!-- AIS-71e1657720c8 -->
const column = n % columns, row = Math.floor(n / columns), box = rect(cell);

Source: plugin/decks/alignment.mjs:81.

## AIS-e0aa82c1e4ec

<!-- AIS-e0aa82c1e4ec -->
const left = origin.left + tracks.slice(0, column).reduce((a, b) => a + b, 0) + gutter * column;

Source: plugin/decks/alignment.mjs:82.

## AIS-43b9418668f8

<!-- AIS-43b9418668f8 -->
check('grid-column-rail', box.left, left, `grid ${g + 1} cell ${n + 1}`);

Source: plugin/decks/alignment.mjs:83.

## AIS-887b99a48049

<!-- AIS-887b99a48049 -->
check('grid-track-width', box.width, tracks[column], `grid ${g + 1} cell ${n + 1}`);

Source: plugin/decks/alignment.mjs:84.

## AIS-f49ac7803d5c

<!-- AIS-f49ac7803d5c -->
if (!rowBounds[row]) rowBounds[row] = {top: box.top, bottom: box.bottom};

Source: plugin/decks/alignment.mjs:85.

## AIS-960502dc0176

<!-- AIS-960502dc0176 -->
check('grid-row-top', box.top, rowBounds[row].top, `grid ${g + 1} cell ${n + 1}`);

Source: plugin/decks/alignment.mjs:86.

## AIS-3cb2b53b017b

<!-- AIS-3cb2b53b017b -->
const rule = [...cell.children].find((child) => child.classList.contains('rl'));

Source: plugin/decks/alignment.mjs:88.

## AIS-d827c841ea84

<!-- AIS-d827c841ea84 -->
if (rule) {

Source: plugin/decks/alignment.mjs:89.

## AIS-0b52f69e33bd

<!-- AIS-0b52f69e33bd -->
if (ruleRails[row] === undefined) ruleRails[row] = rect(rule).top;

Source: plugin/decks/alignment.mjs:90.

## AIS-933964c77937

<!-- AIS-933964c77937 -->
check('grid-rule-alignment', rect(rule).top, ruleRails[row], `grid ${g + 1} cell ${n + 1}`);

Source: plugin/decks/alignment.mjs:91.

## AIS-4ed95b0d9afc

<!-- AIS-4ed95b0d9afc -->
rowBounds.slice(1).forEach((row, n) => check('grid-row-gap', row.top - rowBounds[n].bottom, rowGap, `grid ${g + 1} row ${n + 2}`));

Source: plugin/decks/alignment.mjs:94.

## AIS-20e00c80c617

<!-- AIS-20e00c80c617 -->
const rows = [...table.querySelectorAll('.trow')], rails = [];

Source: plugin/decks/alignment.mjs:97.

## AIS-1c6789259184

<!-- AIS-1c6789259184 -->
const box = rect(cell);

Source: plugin/decks/alignment.mjs:99.

## AIS-fd1acec5a410

<!-- AIS-fd1acec5a410 -->
if (!rails[c]) rails[c] = box;

Source: plugin/decks/alignment.mjs:100.

## AIS-ebb8c59e61f7

<!-- AIS-ebb8c59e61f7 -->
check('table-column-left', box.left, rails[c].left, `row ${r + 1} column ${c + 1}`);

Source: plugin/decks/alignment.mjs:101.

## AIS-9074d38cd245

<!-- AIS-9074d38cd245 -->
check('table-column-right', box.right, rails[c].right, `row ${r + 1} column ${c + 1}`);

Source: plugin/decks/alignment.mjs:102.

## AIS-c7d7fa58e8a4

<!-- AIS-c7d7fa58e8a4 -->
const rows = [...group.querySelectorAll('.arow-in')];

Source: plugin/decks/alignment.mjs:106.

## AIS-b2fc2a39c06b

<!-- AIS-b2fc2a39c06b -->
const rails = [];

Source: plugin/decks/alignment.mjs:107.

## AIS-21efeb7759bf

<!-- AIS-21efeb7759bf -->
const children = [...row.children], marker = children[0], title = children[1], body = children[2];

Source: plugin/decks/alignment.mjs:109.

## AIS-6f1ba46ccfe9

<!-- AIS-6f1ba46ccfe9 -->
const firstCenter = rect(title).top + parseFloat(getComputedStyle(title).lineHeight) / 2;

Source: plugin/decks/alignment.mjs:110.

## AIS-1bb6425c02ff

<!-- AIS-1bb6425c02ff -->
const visibleMarker = marker.matches('.mk') ? marker.firstElementChild : marker;

Source: plugin/decks/alignment.mjs:111.

## AIS-16ed950b0baf

<!-- AIS-16ed950b0baf -->
if (visibleMarker) check('marker-first-line', (rect(visibleMarker).top + rect(visibleMarker).bottom) / 2, firstCenter, `row ${n + 1} ${title.textContent.slice(0, 40)}`);

Source: plugin/decks/alignment.mjs:112.

## AIS-f0159c4ac5d3

<!-- AIS-f0159c4ac5d3 -->
if (body) check('row-baseline', baseline(body), baseline(title), `row ${n + 1}`);

Source: plugin/decks/alignment.mjs:113.

## AIS-60891b073583

<!-- AIS-60891b073583 -->
if (rails[c] === undefined) rails[c] = rect(child).left;

Source: plugin/decks/alignment.mjs:115.

## AIS-365c368564db

<!-- AIS-365c368564db -->
check('column-rail', rect(child).left, rails[c], `row ${n + 1} column ${c + 1}`);

Source: plugin/decks/alignment.mjs:116.

## AIS-954a828d64bf

<!-- AIS-954a828d64bf -->
const gaps = rows.slice(1).map((row, n) => rect(row).top - rect(rows[n]).bottom);

Source: plugin/decks/alignment.mjs:119.

## AIS-1d4824d13a42

<!-- AIS-1d4824d13a42 -->
gaps.forEach((gap, n) => check('equivalent-row-gap', gap, gaps[0], `row ${n + 2}`));

Source: plugin/decks/alignment.mjs:120.

## AIS-9fff83a9cc31

<!-- AIS-9fff83a9cc31 -->
const cells = [...row.children].filter((e) => e.dataset.k === 'text');

Source: plugin/decks/alignment.mjs:123.

## AIS-a2336c15fa22

<!-- AIS-a2336c15fa22 -->
if (cells.length > 1) check('milestone-baseline', baseline(cells[0]), baseline(cells[1]), `milestone ${n + 1}`);

Source: plugin/decks/alignment.mjs:124.

## AIS-d1c684d6e56c

<!-- AIS-d1c684d6e56c -->
const number = hex.querySelector('.hexnum');

Source: plugin/decks/alignment.mjs:127.

## AIS-6bb1b11732a0

<!-- AIS-6bb1b11732a0 -->
if (number) check('hexagon-number-center', (rect(number).top + rect(number).bottom) / 2, (rect(hex).top + rect(hex).bottom) / 2, `hexagon ${n + 1}`);

Source: plugin/decks/alignment.mjs:128.

## AIS-9e881507159d

<!-- AIS-9e881507159d -->
const p = rect(picture), bounds = rect(slide);

Source: plugin/decks/alignment.mjs:131.

## AIS-3ea4fb6a1241

<!-- AIS-3ea4fb6a1241 -->
if (slide.classList.contains('L-cover')) {

Source: plugin/decks/alignment.mjs:132.

## AIS-db4df664462e

<!-- AIS-db4df664462e -->
check('cover-panel-left', p.left - bounds.left, 1000, 'full-bleed cover');

Source: plugin/decks/alignment.mjs:133.

## AIS-01f2f74dce23

<!-- AIS-01f2f74dce23 -->
check('cover-panel-top', p.top - bounds.top, 0, 'full-bleed cover');

Source: plugin/decks/alignment.mjs:134.

## AIS-c8ff036df4b1

<!-- AIS-c8ff036df4b1 -->
check('cover-panel-width', p.width, 920, 'full-bleed cover');

Source: plugin/decks/alignment.mjs:135.

## AIS-5a4593695227

<!-- AIS-5a4593695227 -->
check('cover-panel-height', p.height, 1080, 'full-bleed cover');

Source: plugin/decks/alignment.mjs:136.

## AIS-019753438d45

<!-- AIS-019753438d45 -->
if (p.left < bounds.left - 2 || p.right > bounds.right + 2 || p.top < bounds.top - 2 || p.bottom > bounds.bottom + 2) failures.push(`picture-frame outside slide: ${n + 1}`);

Source: plugin/decks/alignment.mjs:138.

## AIS-4745a09f8a86

<!-- AIS-4745a09f8a86 -->
if (!caption && picture.parentElement.matches('.pic-box')) caption = picture.parentElement.nextElementSibling;

Source: plugin/decks/alignment.mjs:140.

## AIS-2ee044f3c8ba

<!-- AIS-2ee044f3c8ba -->
if (caption?.matches('[data-k="text"]:not(.num):not(.t-meta)') && rect(caption).top >= p.bottom - 2 && rect(caption).top - p.bottom <= 66) {

Source: plugin/decks/alignment.mjs:141.

## AIS-e7728472f88b

<!-- AIS-e7728472f88b -->
if (getComputedStyle(caption).textAlign === 'center') check('picture-caption-center', (rect(caption).left + rect(caption).right) / 2, (p.left + p.right) / 2, `picture ${n + 1}`);

Source: plugin/decks/alignment.mjs:142.

## AIS-239358351666

<!-- AIS-239358351666 -->
else check('picture-caption-edge', rect(caption).left, p.left, `picture ${n + 1}`);

Source: plugin/decks/alignment.mjs:143.
