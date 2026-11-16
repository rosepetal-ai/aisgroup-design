// Page-side measurements shared by build.mjs and verify.mjs (run with page.evaluate).
//
// measureBands: no large empty bands. The content width (128 to 1792) is cut into 80 px
// vertical strips; in each strip that holds content, the empty runs between blocks and after the last block down to the
// slide's content bottom are measured; so are the band from the top margin (96) to the slide's first block and the band
// from its last block to the bottom margin (984). (Space beside a short headline is not a band.) Decoration never counts as content: the hexagon fields (.hex), the wipe, scrims, the logo
// (a signature on the margin), the slide number and the year. Headlines count as wide as their longest line; a logo wall
// or a phase grid counts by its cells (data-band). Slides marked data-band-exempt (cover and divider: a title set low
// on a blue ground is their composition) report their number but never fail.
export const measureBands = () => [...document.querySelectorAll('.slide')].map((s) => {
    const sb = s.getBoundingClientRect();
    const boxes = [...s.querySelectorAll('[data-k="text"], .pic, img[data-k="img"], .rl, .panel, [data-k="vec"], [data-band]')]
      .filter((e) => !e.matches('.hex, .logo, .num, .t-meta, .wipe, .scrim') && !e.closest('.num') && !e.closest('[data-band-skip]'))
      .map((e) => {
        const b = e.getBoundingClientRect();
        let l = b.left, r = b.right;
        if (e.dataset.k === 'text' && e.matches('.mi, .t-num')) { const rg = document.createRange(); rg.selectNodeContents(e); const rr = [...rg.getClientRects()].filter((x) => x.width > 1); if (rr.length) { l = Math.min(...rr.map((x) => x.left)); r = Math.max(...rr.map((x) => x.right)); } }
        return {l: l - sb.left, r: r - sb.left, t: Math.max(0, b.top - sb.top), b: Math.min(1080, b.bottom - sb.top)};
      })
      .filter((b) => b.r - b.l > 1 && b.b - b.t > 0);
    let worst = 0, at = null;
    const bottom = Math.min(984, Math.max(...boxes.map((b) => b.b)));
    const top = Math.max(96, Math.min(...boxes.map((b) => b.t)));
    if (984 - bottom > worst) { worst = 984 - bottom; at = {x: 'all', y: Math.round(bottom)}; }
    if (top - 96 > worst) { worst = top - 96; at = {x: 'all', y: 96}; }
    for (let x = 128; x < 1792; x += 80) {
      const iv = boxes.filter((b) => Math.min(b.r, x + 80) - Math.max(b.l, x) >= 20).map((b) => [b.t, b.b]).sort((p, q) => p[0] - q[0]);
      if (!iv.length) continue;
      const m = [iv[0].slice()];
      for (const [t, b] of iv.slice(1)) { const last = m[m.length - 1]; if (t <= last[1]) last[1] = Math.max(last[1], b); else m.push([t, b]); }
      const runs = [].concat(m.slice(1).map((v, k) => [v[0] - m[k][1], m[k][1]]), [[Math.max(0, bottom - m[m.length - 1][1]), m[m.length - 1][1]]]);
      for (const [g, y] of runs) if (g > worst) { worst = g; at = {x, y: Math.round(y)}; }
    }
    return {gap: worst / 1080, at, exempt: s.hasAttribute('data-band-exempt')};
  });

// measureRhythm: the spacing audit (5 Nov). Every vertical gap between a block and the nearest block under it (overlapping
// by 20 px or more) must come from the set below when it is a rhythm gap (up to 64 px). The one free distance is where a
// content block is centred under its headline: deck.js snaps that offset to the 8 px baseline, so gaps of 65 to 120 px must
// be multiples of 8; larger gaps are composition, which measureBands governs. Divider numbers (optical overhang), the
// year and data labels that follow their bar or month (data-free-x) are not held to the column grid. Every text block must start on a grid column (128 + n × 142), unless it captions the picture
// above it (same left edge) or is centred in its cell. Blocks: text, pictures, rules, vectors; a hexagon with its number
// is one block. Text never runs into the top or bottom margin (96 / 984). Decoration (hexagon fields, logo, slide number)
// is not audited.
export const RHYTHM = [0, 8, 16, 24, 40, 64];
export const measureRhythm = (set) => [...document.querySelectorAll('.slide')].map((s) => {
    const sb = s.getBoundingClientRect(), out = [];
    const els = [...s.querySelectorAll('[data-k="text"], .pic, .rl, .panel, [data-k="vec"], .hexwrap')]
      .filter((e) => !e.matches('.hex, .logo, .num, .wipe, .scrim, .t-meta') && !e.closest('.num, .mk, [data-band-skip]') && !(e.parentElement.closest('.hexwrap')));
    const B = els.map((e) => { const b = e.getBoundingClientRect(); return {e, l: Math.round(b.left - sb.left), r: Math.round(b.right - sb.left), t: Math.round(b.top - sb.top), b: Math.round(b.bottom - sb.top)}; })
      .filter((b) => b.r - b.l > 1 && b.b - b.t > 0);
    const name = (x) => x.e.matches('.pic, .panel') ? 'picture' : x.e.matches('.rl') ? 'rule' : x.e.matches('.hexwrap') ? 'hexagon' : `"${x.e.textContent.trim().slice(0, 24)}"`;
    for (const a of B) {
      const below = B.filter((c) => c !== a && c.t >= a.b - 1 && Math.min(a.r, c.r) - Math.max(a.l, c.l) >= 20).sort((p, q) => p.t - q.t)[0];
      if (!below) continue;
      // A shorter block beside a taller one in the same row: the gap under the row belongs to the taller one.
      if (B.some((c) => c !== a && c.t < a.b && c.b > a.b && c.b <= below.t + 1 && Math.min(c.r, below.r) - Math.max(c.l, below.l) >= 20)) continue;
      const g = below.t - a.b;
      if (g <= 64 ? !set.includes(Math.max(0, g)) : g <= 120 && g % 8) out.push(`gap ${g} px: ${name(a)} / ${name(below)} (y ${a.b})`);
    }
    for (const a of B) if (a.e.dataset.k === 'text' && (a.b > 986 || a.t < 94)) out.push(`text outside the margins (y ${a.t} to ${a.b}): ${name(a)}`);
    const cols = Array.from({length: 12}, (_, n) => 128 + n * 142);
    for (const a of B.filter((x) => x.e.dataset.k === 'text' && !x.e.closest('.hexwrap'))) {
      if (getComputedStyle(a.e).textAlign === 'center' || a.e.closest('[data-free-x]') || a.e.matches('.t-num')) continue;
      const lft = a.l;
      if (cols.some((c) => Math.abs(c - lft) <= 1)) continue;
      if (B.some((p) => p.e.matches('.pic') && Math.abs(p.l - lft) <= 1 && a.t >= p.b - 1 && a.t - p.b <= 64)) continue;
      out.push(`text off the grid at x ${lft}: ${name(a)}`);
    }
    return out;
  });

// measureFoot (final pass): the footer spacing is exact. The foot is the bottom margin: one 32 px line
// whose box runs from y 1008 to 1040 (40 from the bottom edge, top on the 8 px baseline, 24 under the content bottom 984).
// The slide number ends on the content edge: x 1792 (128 from the right edge) on full-width slides, x 940 (the right edge
// of grid column 6) when a picture holds the right half. The cover line (t-meta) starts on column 1 (x 128) on the same line.
// The logo signs the cover top left and the close top right, 96 from the top and 128 from the side.
// Measured per slide; verify groups the boxes by kind and fails any deviation over 1 px between slides of a kind, from the
// grid targets below, and any content closer than 24 px above a foot element in its column.
export const FOOT = {
  'number, full width': {bottom: 40, right: 128},
  'number, beside a picture': {bottom: 40, right: 980},
  'cover line': {bottom: 40, left: 128},
  'logo, cover': {top: 96, left: 128},
  'logo, close': {top: 96, right: 128},
};
export const measureFoot = () => [...document.querySelectorAll('.slide')].map((s) => {
  const sb = s.getBoundingClientRect();
  const rel = (e) => { const b = e.getBoundingClientRect(); return {l: b.left - sb.left, r: b.right - sb.left, t: b.top - sb.top, b: b.bottom - sb.top}; };
  const r2 = (x) => Math.round(x * 10) / 10;
  const foot = [...s.querySelectorAll('.num, .t-meta, .logo')].map((e) => {
    const b = rel(e);
    const kind = e.matches('.logo') ? (b.l < 960 ? 'logo, cover' : 'logo, close') : e.matches('.t-meta') ? 'cover line' : b.r > 1500 ? 'number, full width' : 'number, beside a picture';
    return {kind, top: r2(b.t), bottom: r2(1080 - b.b), left: r2(b.l), right: r2(1920 - b.r), t: b.t, l: b.l, r: b.r};
  });
  const content = [...s.querySelectorAll('[data-k="text"], .pic, .rl, [data-k="vec"], .hexwrap')]
    .filter((e) => !e.matches('.hex, .logo, .num, .t-meta, .wipe, .scrim') && !e.closest('.num, .hexwrap > *') && !(e.parentElement && e.parentElement.closest('.hexwrap')))
    .map((e) => ({e, ...rel(e)})).filter((x) => x.r - x.l > 1 && x.b - x.t > 0);
  const crowd = [];
  for (const f of foot.filter((f) => !f.kind.startsWith('logo'))) {
    const near = content.filter((c) => c.l < f.r + 24 && c.r > f.l - 24 && c.t < f.t && c.b > f.t - 24);
    // A picture that runs off the bottom edge beside the number is not above it; anything else within 24 px crowds the foot.
    for (const c of near) crowd.push(`${f.kind}: ${c.e.matches('.pic') ? 'picture' : '"' + c.e.textContent.trim().slice(0, 24) + '"'} ends at y ${Math.round(c.b)}, ${Math.round(f.t - c.b)} px above the foot (min 24)`);
  }
  return {foot: foot.map(({t, l, r, ...x}) => x), crowd};
});
// Groups the measured feet: returns the failures and the measured values per kind (min, max of each edge distance).
export const footReport = (per, targets = FOOT) => {
  const fails = [], kinds = {};
  per.forEach((p, k) => {
    p.crowd.forEach((c) => fails.push(`foot, slide ${k + 1}: ${c}`));
    p.foot.forEach((f) => {
      (kinds[f.kind] ||= []).push({slide: k + 1, ...f});
      const want = targets[f.kind] || {};
      for (const [edge, v] of Object.entries(want)) if (Math.abs(f[edge] - v) > 1) fails.push(`foot, slide ${k + 1}: ${f.kind} ${edge} ${f[edge]} px, grid ${v} px`);
    });
  });
  const values = {};
  for (const [kind, xs] of Object.entries(kinds)) {
    const edges = Object.keys(targets[kind] || {bottom: 1});
    values[kind] = {slides: xs.length, ...Object.fromEntries(edges.map((e) => { const v = xs.map((x) => x[e]); return [e, [Math.min(...v), Math.max(...v)]]; }))};
    for (const e of edges) { const v = xs.map((x) => x[e]); if (Math.max(...v) - Math.min(...v) > 1) fails.push(`foot: ${kind} ${e} varies ${Math.min(...v)} to ${Math.max(...v)} px between slides`); }
  }
  return {fails, values};
};
