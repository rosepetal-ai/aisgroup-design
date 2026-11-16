// AIS decks, "Hoy + azul" (approved 5 Nov 2026): the slide layouts.
// Every slide is drawn on the fixed 1920 × 1080 stage with absolute boxes on the deck grid (128 px margins,
// 12 columns of 102 px with 40 px gaps: column n starts at 128 + (n − 1) × 142). Each element the PPTX needs carries
// data-k (text, img, rect, vec), the contract build.mjs measures, so to_pptx.py can draw it.

const G = (n) => 128 + (n - 1) * 142;          // column start
const S = (n) => n * 142 - 40;                  // width of n columns
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const box = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => `${k}:${typeof v === 'number' ? v + 'px' : v}`).join(';');

// Text: a leaf element (measured as one PPTX text box). mask: the masked line reveal for headlines.
const T = (cls, text, o = {}) => {
  const st = box(o.at || {}) + (o.i !== undefined ? `;--i:${o.i}` : '') + (o.style ? ';' + o.style : '');
  if (o.mask) return `<div class="mask${o.abs ? ' abs' : ''}" style="${box(o.at || {})}${o.style ? ';' + o.style : ''}"><div class="mi ${cls}" data-k="text" style="--i:${o.i || 0}">${md(text)}</div></div>`;
  return `<div class="${cls}${o.rv === false ? '' : ' rv'}${o.abs ? ' abs' : ''}" data-k="text" style="${st}">${md(text)}</div>`;
};
const Stack = (at, inner, cls = '', attrs = '') => `<div class="stack ${cls}" style="${box(at)}"${attrs}>${inner}</div>`;
const beat = (k) => ` data-beat="${k}"`;
const Rule = (o = {}) => `<div class="rl${o.cls ? ' ' + o.cls : ''}" data-k="rect" style="${box(o.at || {})}"></div>`;
const Rect = (at, color, cls = '') => `<div class="abs ${cls}" data-k="rect" style="${box(at)};background:${color}"></div>`;
// Picture frame; fit cover by default. A contain picture sits on its frame's colour.
const Pic = (ctx, src, at, o = {}) => {
  const im = ctx.img(src);
  let cropStyle = '';
  if (o.crop) {
    const [x, y, right, bottom] = o.crop, w = right - x, h = bottom - y;
    if (![x, y, right, bottom].every(Number.isFinite) || x < 0 || y < 0 || right > im.w || bottom > im.h || w <= 0 || h <= 0) throw new Error('Invalid original photograph crop');
    const scale = Math.max(at.width / w, at.height / h);
    cropStyle = `;position:absolute;width:${im.w * scale}px;height:${im.h * scale}px;left:${(at.width - w * scale) / 2 - x * scale}px;top:${(at.height - h * scale) / 2 - y * scale}px;object-fit:fill`;
  }
  return `<div class="pic${o.contain ? ' contain' : ''}" style="${box(at)}${o.bg ? ';background:' + o.bg : ''}"><img data-k="img" src="${im.url}" alt="${esc(o.alt || '')}" style="object-position:${o.pos || '50% 50%'}${cropStyle}"></div>`;
};
const Logo = (ctx, color, at) => `<img class="logo rv" data-k="vec" src="${ctx.asset(`logos/ais-vision-systems-${color}.svg`)}" alt="AIS Vision Systems" style="${box(at)};--i:0">`;
const Hex = (ctx, corner, at) => `<img class="hex" data-k="vec" src="${ctx.asset(`hex-deck-${corner}.svg`)}" alt="" style="${box(at)}">`;
const Num = (ctx, at) => `<div class="num" data-k="text"${at ? ` style="${box(at)}"` : ''}>${ctx.n}</div>`;
const Wipe = (at) => `<div class="wipe" style="${box(at)}"></div>`;
// A single flat-top hexagon outline (points left and right) that holds a number.
const HexOutline = (at, color, sw = 3) => {
  const {width: w} = at; const h = Math.round(w * Math.sqrt(3) / 2);
  const p = [[0, h / 2], [w / 4, 0], [3 * w / 4, 0], [w, h / 2], [3 * w / 4, h], [w / 4, h]].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return `<div class="abs rv" data-k="vec" style="${box({...at, height: h})}"><svg viewBox="${-sw} ${-sw} ${w + 2 * sw} ${h + 2 * sw}" width="100%" height="100%"><polygon points="${p}" fill="none" stroke="${color}" stroke-width="${sw}"/></svg></div>`;
};
// Labelled facts: label above value, rules between (spec block).
const Facts = (facts, o) => facts.map((f, k) => `<div class="fact"${o.beats === false ? '' : beat(k + 1)} style="--i:${(o.i0 || 2) + k}">${k ? Rule({cls: 'gap'}) : ''}${f.k ? `<div class="t-label ${o.kc} rv" data-k="text" style="--i:${(o.i0 || 2) + k}">${md(f.k)}</div>` : ''}<div class="${o.vcls || 't-body'} ${o.vc} rv" data-k="text" style="margin-top:${f.k ? 8 : 0}px;--i:${(o.i0 || 2) + k}">${md(f.v)}</div></div>`).join('');
const Points = (pts, o) => pts.map((p, k) => `<div${beat(k + 1)}>${k ? Rule({cls: 'gap'}) : ''}<div class="${o.cls || 't-body'} ${o.c} rv" data-k="text" style="--i:${(o.i0 || 3) + k}">${md(typeof p === 'string' ? p : p.text)}</div></div>`).join('');
const H2 = (title, cls, at, i = 0) => `<div class="mask" style="${box(at)}"><div class="mi t-h ${cls}" data-k="text" style="--i:${i}">${md(title)}</div></div>`;

// Logo wall cells (13 logos: 5 + 5 + 3, the last row left-aligned on the same columns).
const LogoGrid = (ctx, logos, at, o) => {
  const cols = o.cols || 5, rows = Math.ceil(logos.length / cols);
  const cw = (at.width - (cols - 1) * (o.gap ?? 0)) / cols, rh = (at.height - (rows - 1) * (o.rowGap ?? 0)) / rows;
  let out = '';
  logos.forEach((l, k) => {
    const c = k % cols, r = Math.floor(k / cols);
    const inRow = Math.min(cols, logos.length - r * cols), shift = o.left ? 0 : (cols - inRow) * (cw + (o.gap ?? 0)) / 2;
    const x = at.left + shift + c * (cw + (o.gap ?? 0)), y = at.top + r * (rh + (o.rowGap ?? 0));
    const src = o.white ? ctx.whiteLogo(l.src) : ctx.img(l.src).url;
    const d = ctx.img(l.src);
    // Optical size: every logo gets about the same area (o.area), within its box; never enlarged.
    const s = Math.min(o.lw / d.w, o.lh / d.h, o.area ? Math.sqrt(o.area / (d.w * d.h)) : 1, 1.0);
    const w = Math.round(d.w * s), h = Math.round(d.h * s);
    out += `<img data-band-skip class="abs rv" data-k="img" src="${src}" alt="${esc(l.name)}" style="${box({left: Math.round(o.align === 'left' ? x : x + (cw - w) / 2), top: Math.round(y + (rh - h) / 2), width: w, height: h})};--i:${2 + k}">`;
  });
  if (o.cells) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out += `<div class="abs" data-band style="${box({left: Math.round(at.left + c * (cw + (o.gap ?? 0))), top: Math.round(at.top + r * (rh + (o.rowGap ?? 0)) + (rh - o.lh) / 2), width: Math.round(cw), height: o.lh})}"></div>`;
  if (o.rules) for (let r = 1; r < rows; r++) out += Rule({at: {position: 'absolute', left: at.left, width: at.width, top: Math.round(at.top + r * (rh + (o.rowGap ?? 0)) - (o.rowGap ?? 0) / 2 - 1)}});
  return out;
};

// ---------------------------------------------------------------------------------------------------------------
// The system: the serious blue-and-white deck of the original template, with brand-blue slides.
// Grid: 128 px side margins, 12 columns of 102 px and 40 px gutters, top margin 96, content ends at 984 (bottom margin 96),
// 8 px baseline. The headline always starts at (128, 96); content follows 64 px under its last line.
// Type scale (closed): display 120, headline 76, body 38 (400; 500 for names and item titles), label 28 (500), figure 240,
// meta 22 (slide number and year only). Colour: white content slides; brand blue for the cover, the company slide, case
// studies, key figures and the close; deep blue for section dividers. No gradients: photos have hard edges; on blue they
// sit in the grid, on white they run to the slide edge. Hexagons: the corner fade on every blue slide (top right; bottom
// right on the close), the pale hairline fade on white opening and statement slides only, and flat-top single hexagons
// holding step and phase numbers. The closed set of layouts is the object below: every slide uses one of them.
const HexPale = (ctx, corner, at) => `<img class="hex" data-k="vec" src="${ctx.asset(`hex-pale-${corner}.svg`)}" alt="" style="${box(at)}">`;
// One vertical rhythm (5 Nov polish): label to value 8, caption to picture 16, item to item 24 (a rule with 24 either side),
// block to block 40, headline to content 64, pictures 24 apart. Gaps above 96 px are composition (a block centred in the
// space under the headline) and the empty-band check governs them. Every text block starts on a grid column.
const R = {lv: 8, cap: 16, item: 24, block: 40, head: 64};
// The headline at (128, 96); content 64 under it. o.centre: the content sits centred in the space left under the headline
// down to the bottom margin (never closer than 64 to the headline).
const HeadThen = (title, cls, width, inner, o = {}) => Stack({left: 128, top: 96, width, bottom: o.centre ? 96 : undefined},
  H2(title, cls, {}, 0) + (inner ? `<div class="hbody${o.centre ? ' centre' : ''}">${inner}</div>` : ''));
// Picture slides: words in columns 1 to 6, the picture from column 7 to the right edge, full height (hard edged).
// Few words hold the column by size: 20 or fewer under the headline at headline size, 30 or fewer at lead size (44).
const PX = G(7), TW = S(6);
const Side = (title, cls, inner) => Stack({left: 128, top: 96, width: TW, bottom: 96}, H2(title, cls, {}, 0) + `<div class="hbody centre">${inner}</div>`);
const Facts4 = (facts, o = {}) => `<div class="facts">${Facts(facts, {kc: o.kc || 'c-action', vc: o.vc || 'c-ink', beats: o.beats, vcls: words(facts.map((f) => f.v)) <= 24 ? 't-lead' : 't-body'})}</div>`;
const Lead = (text, c = 'c-muted') => text ? T(`t-body ${c}`, text, {i: 1, style: `margin-bottom:${R.block}px`}) : '';
// A real photograph fills the side whenever its actual pixels support it. Small sources
// dock against the outer edges at <=1.3x; they never acquire a darker placeholder panel.
// Screens and cut-outs retain their complete content on the layout's own ground.
const SidePic = (ctx, im, o = {}) => {
  const d = ctx.img(im.src), W = 1920 - PX, H = o.h || 1080, top0 = o.top ?? 0;
  const scale = Math.max(W / d.w, H / d.h);
  const full = im.fit !== 'contain' && scale <= 1.3;
  if (full) return `<div data-side-photo="full">${Pic(ctx, im.src, {left: PX, top: top0, width: W, height: H}, {pos: im.pos, alt: im.alt})}</div>`;
  const w = Math.min(W, Math.floor(1.3 * d.w)), h = Math.min(H, Math.floor(1.3 * d.h));
  if (im.fit !== 'contain' && w >= .6 * W && h >= .52 * H) {
    const top = o.h && o.h < 1080 && o.top === undefined ? top0 : top0 + H - h;
    return `<div data-side-photo="limited">${Pic(ctx, im.src, {left:1920-w, top, width:w, height:h}, {pos:im.pos, alt:im.alt})}</div>`;
  }
  const sc = Math.min(im.maxScale ?? 1.25, (W-96)/d.w, (H-96)/d.h), pw=Math.round(d.w*sc), ph=Math.round(d.h*sc);
  return Rect({left:PX,top:top0,width:W,height:H}, im.bg || o.panel || 'var(--panel)', 'panel') +
    `<div data-side-photo="complete" class="pic" data-band-skip style="${box({left:PX+Math.round((W-pw)/2),top:top0+Math.round((H-ph)/2),width:pw,height:ph})}"><img data-k="img" src="${d.url}" alt="${esc(im.alt || '')}" style="object-fit:fill"></div>`;
};
const words = (xs) => xs.filter(Boolean).join(' ').replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length;
const lines = (t, w, px) => Math.max(1, Math.ceil(String(t || '').length * px * 0.52 / w));
const NumL = (ctx) => Num(ctx, {right: 1920 - PX + 40});
const HexNum = (n, w, k, cls = 't-body') => `<div class="hexwrap rv" style="--i:${2 + k};width:${w}px;height:${Math.round(w * Math.sqrt(3) / 2)}px">${HexOutline({left: 0, top: 0, width: w}, '#17356E', 2.5)}<div class="hexnum ${cls} c-brand" data-k="text">${n}</div></div>`;
const Icon = (ctx, name) => `<div class="ico rv" data-k="vec">${ctx.icon(name)}</div>`;
// Rows: a marker in column 1 (a number, a hexagon number or an icon), the name at headline size in columns 2 to 8 and
// what it holds in columns 9 to 12, on the name's baseline; rules between. Agenda, and phases, steps or features
// that have no pictures (four or fewer), so a short list fills the slide at a size that reads. Five rows (the agenda)
// close the item gap from 24 to 16 so they stay inside the bottom margin.
const Rows = (ctx, items, mark) => `<div class="rows4${items.length > 4 ? ' tight' : ''}" data-band>${items.map((it, k) => `<div${beat(k + 1)}>${k ? Rule({cls: 'gap'}) : ''}<div class="arow-in">${mark(it, k)}${T('t-h c-ink', it.title || '', {i: 2 + k})}${it.text ? T('t-body c-muted', it.text, {i: 2 + k}) : ''}</div></div>`).join('')}</div>`;
const LAYOUTS = {
  cover(s, ctx) {
    // The approved cover always fills its panel; source resolution never changes the composition.
    const at = {left: 1000, top: 0, width: 920, height: 1080};
    // The hexagon field stays clear of the words: a title of three lines or more goes without it.
    return {g: 'g-brand', exempt: true, html:
      (lines(s.title.replace(/\n/g, ' '), 820, 120) <= 2 && !/\n.*\n/.test(s.title) ? Hex(ctx, 'tr', {left: 480, top: 0}) : '') +
      Pic(ctx, s.image.src, at, {pos: s.image.pos, crop: s.image.crop, alt: s.image.alt}) + Wipe(at) +
      Logo(ctx, 'white', {left: 128, top: 96, width: 140}) +
      Stack({left: 128, top: 0, bottom: 168, width: 820, 'justify-content': 'flex-end'},
        T(`${lines(s.title.replace(/\n/g, ' '), 820, 120) > 3 ? 't-h' : 't-display'} c-white`, s.title, {mask: true, i: 0}) + T('t-body c-white', s.lead, {i: 3, style: `margin-top:${R.block}px`})) +
      T('t-meta c-light', s.meta, {abs: true, at: {left: 128, bottom: 40}, i: 4})};
  },
  divider(s, ctx) {
    return {g: 'g-deep', exempt: true, html:
      Hex(ctx, 'tr', {right: 0, top: 0}) +
      Stack({left: 128, top: 0, bottom: 168, width: 1300, 'justify-content': 'flex-end'},
        T('t-num c-light', String(ctx.part + 1).padStart(2, '0'), {i: 0, style: 'margin-left:-10px'}) +
        T('t-display c-white', s.title, {mask: true, i: 1, style: `margin-top:${R.block}px`}))};
  },
  statement(s, ctx) {
    // One sentence on white at display size from the top margin, its lead under it; with a picture, the picture fills the
    // rest of the slide edge to edge (left, right, bottom). Without one, the words sit centred. Pale hexagon fade top right.
    // A quote is a statement with an author, set like the quote post: on brand blue, the exact words in « » in every language
    // at display size in white, set low to the bottom margin, then the name in Semibold white and the role in light blue,
    // body size, 40 under the words. No quote glyph, rule, fill or picture. Like the cover, its low setting is the composition.
    if (s.author) {
      const by = T('t-body c-light', `**${s.author.name}**${s.author.role ? ', ' + s.author.role : ''}`, {i: 2, style: `margin-top:${R.block}px`});
      return {g: 'g-brand', exempt: true, html: Hex(ctx, 'tr', {right: 0, top: 0}) +
        Stack({left: 128, bottom: 96, width: S(11)}, T('t-display c-white', s.title, {mask: true, i: 0}) + by) + Num(ctx)};
    }
    const said = T('t-display c-ink', s.title, {mask: true, i: 0}) + (s.lead ? T(`${words([s.lead]) <= 30 ? 't-lead' : 't-body'} c-muted`, s.lead, {i: 2, style: `margin-top:${R.block}px`}) : '');
    if (s.image && ctx.img(s.image.src).w < 1536) return {g: 'g-white', html: Side(s.title, 'c-ink', s.lead ? T(`${words([s.lead]) <= 30 ? 't-lead' : 't-body'} c-muted`, s.lead, {i: 1}) : '') + SidePic(ctx, s.image) + NumL(ctx)};
    if (s.image) return {g: 'g-white', html:
      `<div class="stack" style="left:0;top:96px;width:1920px;bottom:0"><div style="padding:0 128px">${said}</div><div class="pic-fill" style="margin-top:${R.head}px">${Pic(ctx, s.image.src, {left: 0, top: 0, width: '100%', height: '100%'}, {pos: s.image.pos, alt: s.image.alt})}</div></div>`};
    return {g: 'g-white', html: (lines(s.title, 1664, 120) <= 2 ? HexPale(ctx, 'tr', {right: 0, top: 0}) : '') +
      Stack({left: 128, top: 96, bottom: 96, width: 1664, 'justify-content': 'center'}, said) + Num(ctx)};
  },
  agenda(s, ctx) {
    // The parts only: what each holds is helper text (keep-it-simple), so it goes to the notes.
    return {g: 'g-white', notes: s.items.map((it, k) => `${k + 1}. ${it.title}: ${it.text}`).join(' '), html: HeadThen(s.title, 'c-ink', 1664, Rows(ctx, s.items.map((it) => ({title: it.title})), (it, k) => T('t-h c-action', String(k + 1), {i: 2 + k})), {centre: true}) + Num(ctx)};
  },
  columns(s, ctx) {
    // On brand blue: up to four columns of three grid columns: place, rule, name, what it does.
    const n = s.columns.length;
    const cols = s.columns.map((c, k) => `<div class="col" data-band${beat(k + 1)}>` +
      (c.eyebrow ? T('t-label c-light', c.eyebrow, {i: 2 + k, style: `margin-bottom:${R.cap}px`}) : '') + Rule() +
      T('t-lead c-white', c.title, {i: 2 + k, style: `margin-top:${R.item}px;font-weight:500`}) +
      (c.items || []).map((it, j) => T('t-body c-light', it, {i: 2 + k, style: `margin-top:${j ? R.lv : R.item}px`})).join('') + '</div>').join('');
    return {g: 'g-brand', html: Hex(ctx, 'tr', {right: 0, top: 0}) +
      HeadThen(s.title, 'c-white', S(9), (s.lead ? T('t-body c-light', s.lead, {i: 1, style: `margin-bottom:${R.head}px;max-width:${S(8)}px`}) : '') +
        `<div class="gridc c${n === 5 ? 4 : Math.max(n, 2)}">${cols}</div>`, {centre: true}) + Num(ctx)};
  },
  logos(s, ctx) {
    return {g: 'g-white', html: H2(s.title, 'c-ink', {position: 'absolute', left: 128, top: 96, width: 1664}) +
      LogoGrid(ctx, s.logos, {left: 128, top: 160 + lines(s.title, 1664, 76) * 84, width: 1664, height: 824 - lines(s.title, 1664, 76) * 84}, s.logos.length <= 9 ? {cols: 3, lw: 400, lh: 160, area: 40000, rules: true, left: true, cells: true, gap: 40} : s.logos.length <= 12 ? {cols: 4, lw: 320, lh: 140, area: 30000, rules: true, left: true, cells: true, gap: 40} : {cols: 5, lw: 280, lh: 128, area: 24000, rules: true, left: true, cells: true, gap: 40}) + Num(ctx)};
  },
  split(s, ctx) {
    const nw = words([s.lead, ...(s.points || []).map((p) => p.text || p)]), big = nw <= 12 ? 't-h' : nw <= 30 ? 't-lead' : 't-body';
    // Case studies and company facts on brand blue: the words in columns 1 to 5, the picture from column 6 to the edges.
    return {g: 'g-brand', html:
      Side(s.title, 'c-white', (s.lead ? T(`${big} c-light`, s.lead, {i: 1, style: `margin-bottom:${R.block}px`}) : '') + `<div class="points">${Points(s.points || [], {c: 'c-white', cls: big})}</div>`) +
      SidePic(ctx, s.image) + NumL(ctx)};
  },
  photo(s, ctx) {
    if (s.panorama) {
      const width = S(11), im = ctx.img(s.image.src), height = Math.round(im.h * width / im.w / 8) * 8;
      return {g: 'g-white', html: HeadThen(s.title, 'c-ink', width,
        Lead(s.lead) + Pic(ctx, s.image.src, {position: 'relative', flex: 'none', left: 0, top: 0, width, height}, {contain: true, alt: s.image.alt}), {centre: true}) + Num(ctx), cls: 'panorama'};
    }
    return {g: 'g-white', html: Side(s.title, 'c-ink', s.lead ? T('t-body c-muted', s.lead, {i: 1}) : '') +
      SidePic(ctx, s.image) + NumL(ctx)};
  },
  stage(s, ctx) {
    // A machine on white: words and facts in columns 1 to 5; the machine (and its detail under it, 24 apart) to the edges.
    // The detail's caption is the last fact, so no caption floats away from its picture.
    const facts = [...(s.facts || []), ...(s.detail && (s.detail.title || s.detail.text) ? [{k: s.detail.title, v: s.detail.text}] : [])].map((f) => f.k ? f : {k: '', v: f.v});
    const h1 = s.detail ? 640 : 1080;
    return {g: 'g-white', html:
      Side(s.title, 'c-ink', Lead(s.lead) + Facts4(facts)) +
      SidePic(ctx, s.image, {h: h1}) +
      (s.detail ? SidePic(ctx, {src: s.detail.image, pos: s.detail.pos, fit: s.detail.fit, bg: s.detail.bg}, {h: 1080 - h1 - R.item, top: h1 + R.item}) : '') + NumL(ctx)};
  },
  product(s, ctx) {
    // Detections on white: words in columns 1 to 5; the live view against the top and right edges, cropped to drop the
    // counters and score labels (image.keep = share of the width kept, image.crop = share of the height kept from the top);
    // one or two detection tiles under it at a readable size, captioned 16 under the tile.
    const im = ctx.img(s.image.src), keepW = s.image.keep || 0.792, keepH = s.image.crop || 1;
    const lw = Math.min(1920 - PX, Math.round(im.w * keepW)), x0 = 1920 - lw, n = (s.tiles || []).length;
    const tw = n ? Math.floor((lw - (n - 1) * R.item) / n) : 0, th = n ? Math.round(tw * 484 / 684) : 0;
    const full = Math.round(im.h * keepH * lw / (im.w * keepW));
    const lh = n ? Math.min(full, 984 - 38 - R.cap - th - R.item) : Math.min(full, 1080);
    const sc = lw / (im.w * keepW);
    const live = `<div class="pic" style="${box({left: x0, top: 0, width: lw, height: lh})}"><img data-k="img" src="${im.url}" alt="${esc(s.image.alt || '')}" style="width:${Math.round(im.w * sc)}px;height:${Math.round(im.h * sc)}px;max-width:none;object-fit:fill"></div>`;
    const tiles = (s.tiles || []).map((t, k) => `<div${beat(k + 1)}>${Pic(ctx, t.image, {left: x0 + k * (tw + R.item), top: lh + R.item, width: tw, height: th}, {contain: true}) +
      T('t-label c-ink', t.label, {abs: true, at: {left: x0 + k * (tw + R.item), top: lh + R.item + th + R.cap, width: tw}, i: 5 + k})}</div>`).join('');
    return {g: 'g-white', html: Side(s.title, 'c-ink', Lead(s.lead) + Facts4(s.facts || [], {beats: false})) + live + tiles + NumL(ctx)};
  },
  phases(s, ctx) {
    // Four phases 2 × 2 or six 3 × 2: the number in a flat-top hexagon, the phase, one line.
    const start = s.start || 1, n = s.items.length, cols = n > 4 ? 3 : 2;
    if (n <= 4) return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, Rows(ctx, s.items, (it, k) => `<div class="mk">${HexNum(start + k, 102, k)}</div>`), {centre: true}) + Num(ctx)};
    const cells = s.items.map((it, k) => `<div class="phcell" data-band${beat(k + 1)}>${HexNum(start + k, 112, k)}<div class="t-body c-ink rv" data-k="text" style="font-weight:500;margin-top:${R.item}px;--i:${2 + k}">${md(it.title)}</div><div class="t-body c-muted rv" data-k="text" style="margin-top:${R.lv}px;--i:${2 + k}">${md(it.text)}</div></div>`).join('');
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, `<div class="gridc c${cols} rows">${cells}</div>`, {centre: true}) + Num(ctx)};
  },
  steps(s, ctx) {
    // Three or four steps across: the picture (if every step has one), then the number in a hexagon beside the step name.
    const n = s.steps.length, cols = Math.min(4, Math.max(2, n)), w = (1664 - (cols - 1) * 40) / cols;
    const pics = s.steps.every((st) => st.image), ph = Math.round(w * (cols === 4 ? 0.75 : 0.66));
    if (!pics) return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, Lead(s.lead) + Rows(ctx, s.steps, (it, k) => `<div class="mk">${HexNum(k + 1, 102, k)}</div>`), {centre: true}) + Num(ctx)};
    const cells = s.steps.map((st, k) => `<div class="phcell" data-band${beat(k + 1)}>` +
      (pics ? `<div class="pic-box" style="height:${ph}px;margin-bottom:${R.item}px">${Pic(ctx, st.image.src || st.image, {left: 0, top: 0, width: '100%', height: '100%'}, {pos: st.image.pos})}</div>` : '') +
      `<div class="steprow">${HexNum(k + 1, pics ? 72 : 112, k, pics ? 't-label' : 't-body')}</div>` +
      T('t-body c-ink', st.title, {i: 2 + k, style: `font-weight:500;margin-top:${R.item}px`}) +
      (st.text ? T('t-body c-muted', st.text, {i: 2 + k, style: `margin-top:${R.lv}px`}) : '') + '</div>').join('');
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, Lead(s.lead) + `<div class="gridc c${cols}">${cells}</div>`, {centre: true}) + Num(ctx)};
  },
  features(s, ctx) {
    // Up to four features across: an icon, logos or a picture on top, the name, one line.
    const n = s.items.length, cols = Math.min(4, s.cols || n), w = (1664 - (cols - 1) * 40) / cols;
    if (s.image) {
      const items=s.items.map((it,k)=>`<div${beat(k+1)}>${k?Rule({cls:'gap'}):''}${T('t-lead c-ink',it.title,{i:2+k,style:'font-weight:500;margin-top:16px'})}${it.text?T('t-body c-muted',it.text,{i:2+k,style:'margin-top:8px'}):''}</div>`).join('');
      return {g:'g-white',html:Side(s.title,'c-ink',Lead(s.lead)+`<div class="points evidence-points">${items}</div>`)+SidePic(ctx,s.image)+NumL(ctx)};
    }

    if (n <= 4 && !s.items.some((it) => it.image || it.logos)) return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, Lead(s.lead) + Rows(ctx, s.items, (it) => `<div class="mk">${it.icon ? Icon(ctx, it.icon) : ''}</div>`), {centre: true}) + Num(ctx)};
    const mixedLogos = s.items.some((it) => it.logos);
    const gridStyle = mixedLogos && s.items.some((it) => it.icon) ? ` style="row-gap:${R.item}px"` : '';
    const top = (it) => it.image ? `<div class="pic-box" style="height:${Math.round(w * 0.66)}px;margin-bottom:${R.item}px">${Pic(ctx, it.image.src || it.image, {left: 0, top: 0, width: '100%', height: '100%'}, {pos: it.image.pos})}</div>`
      : it.logos ? `<div class="logorow" data-band style="margin-bottom:${R.item}px">${it.logos.map((l) => { const d = ctx.img(l.src), sc = Math.min(1, 96 / d.h, (w - 40 * (it.logos.length - 1)) / it.logos.length / d.w); return `<img data-k="img" src="${d.url}" alt="" style="width:${Math.round(d.w * sc)}px;height:${Math.round(d.h * sc)}px">`; }).join('')}</div>`
      : it.icon ? `<div style="margin-bottom:${R.item}px${mixedLogos ? ';height:96px;display:flex;align-items:center' : ''}">${Icon(ctx, it.icon)}</div>` : '';
    const cells = s.items.map((it, k) => `<div class="phcell"${beat(k + 1)}>${top(it)}${Rule()}${it.title ? T('t-body c-ink', it.title, {i: 2 + k, style: `font-weight:500;margin-top:${R.item}px`}) : ''}${it.text ? T('t-body c-muted', it.text, {i: 2 + k, style: `margin-top:${it.title ? R.lv : R.item}px`}) : ''}</div>`).join('');
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, Lead(s.lead) + `<div class="gridc c${cols} rows"${gridStyle}>${cells}</div>`, {centre: true}) + Num(ctx)};
  },
  grid(s, ctx) {
    // Pictures in a grid of equal tiles (2 or 3 across), each captioned 16 under it.
    const n = s.tiles.length, cols = s.cols === 1 ? 1 : Math.min(4, Math.max(2, s.cols > 4 ? Math.ceil(n / 2) : s.cols || (n === 4 ? 2 : 3))), w = (1664 - (cols - 1) * 40) / cols, rows = Math.ceil(n / cols);
    if (cols === 1) {
      // Strips (scans, maps, close-ups wider than tall): one per row, all the same frame, the label beside it on column 7.
      const ims = s.tiles.map((t) => ctx.img(t.image.src || t.image));
      const fw = Math.min(S(6), ...ims.map((d) => Math.floor(1.25 * d.w)));
      const fh = Math.floor(Math.min((888 - lines(s.title, 1664, 76) * 84 - R.head - (n - 1) * R.block) / n, fw / (s.ratio || 3)) / 8) * 8;
      const rws = s.tiles.map((t, k) => `<div class="srow" data-band${beat(k + 1)}><div class="pic-box" style="width:${fw}px;height:${fh}px">${Pic(ctx, t.image.src || t.image, {left: 0, top: 0, width: '100%', height: '100%'}, {pos: t.image.pos, alt: t.label})}</div>${T('t-lead c-ink', t.label, {i: 2 + k})}</div>`).join('');
      return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, `<div class="strips">${rws}</div>`, {centre: true}) + Num(ctx)};
    }
    const avail = 888 - lines(s.title, 1664, 76) * 84 - R.head - (s.lead ? lines(s.lead, 1664, 38) * 52 + R.block : 0) - rows * (R.cap + 38) - (rows - 1) * 64 - 64;
    // Tiles fill the height, but never past 1.25× of the smallest picture's height (wide strips stay strips).
    const h = Math.min(Math.floor(avail / rows / 8) * 8, ...s.tiles.map((t) => Math.floor(1.25 * ctx.img(t.image.src || t.image).h)));
    const cells = s.tiles.map((t, k) => `<div class="phcell"${beat(k + 1)}><div class="pic-box" style="height:${h}px;max-width:${Math.floor(1.25 * ctx.img(t.image.src || t.image).w)}px">${Pic(ctx, t.image.src || t.image, {left: 0, top: 0, width: '100%', height: '100%'}, {pos: t.image.pos, alt: t.label})}</div>${T('t-label c-ink', t.label, {i: 2 + k, style: `margin-top:${R.cap}px`})}</div>`).join('');
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, Lead(s.lead) + `<div class="gridc c${cols} rows">${cells}</div>`, {centre: true}) + Num(ctx)};
  },
  mosaic(s, ctx) {
    // The main picture from column 6 to the edges; under the words, the detail pictures two by two.
    const tw = (TW - R.item) / 2, rows = Math.ceil((s.tiles || []).length / 2);
    const th = Math.min(Math.round(tw * 2 / 3), Math.floor((888 - lines(s.title, TW, 76) * 84 - R.head - (s.lead ? lines(s.lead, TW, 38) * 52 + R.block : 0) - rows * (R.cap + 38) - (rows - 1) * 40 - 64) / rows / 8) * 8);
    const tiles = (s.tiles || []).map((t, k) => `<div${beat(k + 1)}><div class="pic-box" style="height:${th}px">${Pic(ctx, t.image.src || t.image, {left: 0, top: 0, width: '100%', height: '100%'}, {pos: t.image.pos, alt: t.label})}</div>${T('t-label c-ink', t.label, {i: 3 + k, style: `margin-top:${R.cap}px`})}</div>`).join('');
    return {g: 'g-white', html: Side(s.title, 'c-ink', Lead(s.lead) + `<div class="tiles2">${tiles}</div>`) +
      SidePic(ctx, s.image) + NumL(ctx)};
  },
  milestones(s, ctx) {
    // A timeline as rows: the date in columns 1 to 3, what happened in columns 4 to 12, on one baseline.
    const dateColumns = s.dateWidth ? ` style="grid-template-columns:${s.dateWidth}px ${1624 - s.dateWidth}px"` : '';
    const rows = s.items.map((it, k) => `<div${beat(k + 1)}>${k ? Rule({cls: 'gap'}) : ''}<div class="mrow"${dateColumns}>${T('t-body c-action', it.date, {i: 2 + k, style: 'font-weight:500'})}${T('t-body c-ink', it.text, {i: 2 + k})}</div></div>`).join('');
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, `<div class="points">${rows}</div>`, {centre: true}) + Num(ctx)};
  },
  figures(s, ctx) {
    // Key figures on brand blue: the figure, its label 16 under it, one line; with a picture, the figures stack in columns
    // 1 to 5 at display size and the picture runs from column 6 to the edges.
    const colW = s.image ? TW : (1664 - (Math.max(2, s.figures.length) - 1) * 40) / Math.max(2, s.figures.length);
    const big = s.image || s.figures.some((f) => String(f.value).length * 0.6 * 240 > colW) ? 't-display' : 't-num';
    const figs = s.figures.map((f, k) => `<div class="fig"${beat(k + 1)}>${k && s.image ? Rule({cls: 'gap'}) : ''}${T(big + ' c-white', f.value, {i: 2 + k})}${T('t-body c-white', f.label, {i: 2 + k, style: `font-weight:500;margin-top:${R.cap}px`})}${f.text ? T('t-body c-light', f.text, {i: 2 + k, style: `margin-top:${R.lv}px`}) : ''}</div>`).join('');
    if (s.image) return {g: 'g-brand', html: Side(s.title, 'c-white', `<div class="points">${figs}</div>`) +
      SidePic(ctx, s.image) + NumL(ctx)};
    const cols = Math.max(2, s.figures.length);
    return {g: 'g-brand', html: Hex(ctx, 'tr', {right: 0, top: 0}) + HeadThen(s.title, 'c-white', S(9), `<div class="gridc c${cols}" style="width:1664px">${figs}</div>`, {centre: true}) + Num(ctx)};
  },
  table(s, ctx) {
    // Exact values on white (guide, Documents and presentations > Table): the headline, then the table on the 12 columns,
    // centred in the space under it. Column titles in body Medium secondary text over a 2 px neutral-300 rule; rows split by
    // 2 px neutral-200 hairlines with 24 above and below (16 from five rows); no fills, stripes, frames or vertical rules, no rule after the last
    // row. Numbers right-aligned in tabular figures (column num: true), the unit once in the column title. Each column spans
    // whole grid columns (span; the first defaults to 4, the rest share what is left); a caption 16 under the table holds a
    // condition for the whole table. At most five columns and six rows: anything larger belongs in the document.
    const cols = s.columns, rows = s.rows;
    if (cols.length < 2 || cols.length > 5) throw new Error(`table: ${cols.length} columns (2 to 5)`);
    if (rows.length < 1 || rows.length > 6) throw new Error(`table: ${rows.length} rows (1 to 6)`);
    const fixed = cols.reduce((a, c) => a + (c.span || 0), 0), free = cols.filter((c, k) => !c.span && k).length;
    const spans = cols.map((c, k) => c.span || (k ? Math.floor((12 - (cols[0].span || 4) - (fixed - (cols[0].span || 0))) / Math.max(1, free)) : 4));
    if (spans.reduce((a, b) => a + b, 0) > 12) throw new Error('table: the columns span more than 12 grid columns');
    const tpl = `grid-template-columns:${spans.map(S).map((w) => w + 'px').join(' ')}`;
    // Inter draws the hyphen digit-wide in tabular figures ("1 - 2"): a range's hyphen keeps its text width.
    const range = (h) => h.replace(/>([^<]*)</, (m, t) => '>' + t.replace(/(\d)-(\d)/g, '$1<span class="hy">-</span>$2') + '<');
    const cell = (c, k, text, head, i) => { const h = T(`t-body ${head ? 'c-muted th' : k ? 'c-ink' : 'c-ink rh'}${c.num ? ' tn' : ''}`, text, {i}); return c.num && !head ? range(h) : h; };
    const head = `<div class="trow thead" style="${tpl}">${cols.map((c, k) => cell(c, k, c.title, true, 2)).join('')}</div>${Rule({cls: 'gap head'})}`;
    const body = rows.map((r, j) => `<div${beat(j + 1)}>${j ? Rule({cls: 'gap'}) : ''}<div class="trow" style="${tpl}">${cols.map((c, k) => cell(c, k, r[k] ?? '–', false, 3 + j)).join('')}</div></div>`).join('');
    const cap = s.caption ? T('t-body c-muted', s.caption, {i: 4 + rows.length, style: `margin-top:${R.block}px`}) : '';
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, `<div class="tbl${rows.length > 4 ? ' tight' : ''}" data-band>${head}${body}</div>${cap}`, {centre: true}) + Num(ctx)};
  },
  bars(s, ctx) {
    // Horizontal bars (data.mdx): label in columns 1 to 4, the bar from column 5, the value at its end; the largest in
    // brand blue, the rest neutral; values as written, no axis, no gridlines.
    const max = Math.max(...s.bars.map((b) => +b.value)), full = 1792 - G(5) - 160;
    const rows = s.bars.map((b, k) => `<div class="brow"${beat(k + 1)}>${T('t-body c-ink', b.label, {i: 2 + k})}<div class="bwrap" data-free-x><div class="bar rv" data-k="rect" style="width:${Math.round(full * b.value / max)}px;background:${+b.value === max ? 'var(--brand)' : 'var(--line)'};--i:${2 + k}"></div>${T('t-body c-ink', String(b.value), {i: 2 + k, style: 'font-weight:500;font-variant-numeric:tabular-nums'})}</div></div>`).join('');
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, `<div class="bars" data-band>${rows}</div>` + (s.caption ? T('t-label c-muted', s.caption, {i: 9, style: `margin-top:${R.head - 4}px;font-weight:400`}) : ''), {centre: true}) + Num(ctx)};
  },
  gantt(s, ctx) {
    // A calendar: months across columns 4 to 12, each task a bar in its row; posventa (tone light) in the light blue.
    const x0 = G(4) - 128, span = 1664 - x0, m = s.months.length;
    const head = `<div class="grow"><div></div><div class="gm" data-free-x>${s.months.map((mo) => T('t-label c-muted', mo, {style: `width:${span / m}px`})).join('')}</div></div>`;
    const rows = s.rows.map((r, k) => `<div${beat(k + 1)}>${Rule({cls: 'gap'})}<div class="grow">${T('t-body c-ink', r.label, {i: 2 + k})}<div class="gbar"><div class="bar rv" data-k="rect" style="margin-left:${Math.round(span * r.from / m)}px;width:${Math.round(span * (r.to - r.from) / m)}px;background:${r.tone === 'light' ? 'var(--light)' : 'var(--brand)'};--i:${2 + k}"></div></div></div></div>`).join('');
    return {g: 'g-white', html: HeadThen(s.title, 'c-ink', 1664, `<div class="gantt" data-band>${head}${rows}</div>` + (s.caption ? T('t-label c-muted', s.caption, {i: 9, style: `margin-top:${R.block}px;font-weight:400`}) : ''), {centre: true}) + Num(ctx)};
  },
  closing(s, ctx) {
    // The original close: "Gracias", then web, phone, LinkedIn and YouTube, label over value, rules between, filling the
    // slide from the top margin; the logo signs top right, the hexagon fade bottom right.
    const rows = (s.contacts || []).map((c, k) => `<div${beat(k + 1)}>${k ? Rule({cls: 'gap'}) : ''}${T('t-label c-light', c.k, {i: 2 + k})}${T('t-h c-white', c.v, {i: 2 + k, style: `margin-top:${R.lv}px;font-variant-numeric:tabular-nums`})}</div>`).join('');
    return {g: 'g-brand', html: Hex(ctx, 'br', {right: 0, bottom: 0}) + Logo(ctx, 'white', {right: 128, top: 96, width: 140}) +
      Stack({left: 128, top: 96, bottom: 96, width: S(8)}, T('t-display c-white', s.title, {mask: true, i: 0}) + `<div class="hbody centre"><div class="points">${rows}</div></div>`)};
  },
};

export const LAYOUT_NAMES = Object.keys(LAYOUTS);

export function renderSlide(s, ctx) {
  const fn = LAYOUTS[s.layout];
  if (!fn) throw new Error(`no layout "${s.layout}" (layouts: ${LAYOUT_NAMES.join(', ')})`);
  const {g, cls = '', html, exempt, notes} = fn(s, ctx);
  return `<section class="slide ${g} L-${s.layout} ${cls}"${s.image?.role === 'facility' ? ' data-facility="true"' : ''}${s.image?.streetViewReason ? ` data-street-view="${esc(s.image.streetViewReason).replace(/"/g, '&quot;')}"` : ''}${exempt ? ' data-band-exempt' : ''} data-notes="${esc([s.notes, notes].filter(Boolean).join(' '))}">${html}</section>`;
}

// Every picture a slide uses (for copying into media/).
export function imagesOf(s) {
  const out = [];
  if (s.image?.src) out.push(s.image.src);
  if (s.detail?.image) out.push(s.detail.image);
  for (const t of s.steps || []) if (t.image) out.push(t.image.src || t.image);
  for (const t of s.items || []) { if (t.image) out.push(t.image.src || t.image); for (const l of t.logos || []) out.push(l.src); }
  for (const f of s.figures || []) if (f.image) out.push(f.image.src);
  for (const t of s.tiles || []) out.push(t.image.src || t.image);
  for (const l of s.logos || []) out.push(l.src);
  return out;
}
