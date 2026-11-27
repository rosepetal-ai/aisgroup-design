// AIS Group detection overlays. One renderer for the brand guide, designers and AI agents:
// give it an image and the detections, get back an SVG drawn to the brand overlay spec.
//
//   node overlay.mjs spec.json > result.svg
//
// Spec (coordinates in image pixels, origin top left):
// {
//   "image": "blister.webp",          // href written into the SVG; omit for an overlay-only layer
//   "width": 600, "height": 400,      // image size in pixels
//   "tone": "light",                  // "light" or "dark": brightness of the image under the overlays
//   "displayWidth": 430,              // width the image will be shown at; every size below is at that width
//   "verdict": { "result": "pass", "text": "OK", "detail": "10/10" },
//   "items": [
//     { "type": "box", "x": 150, "y": 112, "w": 60, "h": 63, "label": "tablet", "value": "0.98" },
//     { "type": "mask", "points": [[10, 10], [80, 12], [70, 60]], "label": "chip", "state": "defect" },
//     { "type": "read", "x": 40, "y": 30, "w": 120, "h": 24, "text": "LOT A2319" },
//     { "type": "measure", "from": [20, 300], "to": [220, 300], "value": "42.0 mm" }
//   ]
// }
// Every item takes an optional "state": "found" (default) or "defect", and an optional "chip" side to try first
// ("above", "aboveRight", "below", "belowRight", "right", "left"), e.g. "right" to keep the label on the background.
// Mask points must come from a tool (the system's export or a segmentation model), never traced by eye.
//
// The drawing (sizes in display px):
// - found box: 2 px corner brackets on a 1 px hairline; defect box: a full 2 px frame over an 8% tint.
// - every line has a 1 px casing in the colour it contrasts with most (white under the dark blue and red on light
//   images, ink under the light blue and red on dark ones), so it holds 3:1 on any picture;
// - label tab: solid in the state colour, flush on the box's corner, Inter 12 px (class Semibold, value Medium,
//   tabular figures), white text on light images and ink on dark ones (4.5:1 or more); a defect tab leads with an x;
// - mask: 20% tint (28% for a defect) inside a smooth 2 px edge; its tab sits over the mask's highest point;
// - reading: a highlighter tint and a 2 px rule under the text, the read value in a mono tab beside it;
// - measurement: a 2 px dimension line with extension ticks and closed arrowheads, the value set in a break of the line;
// - verdict: one 28 px chip, top left, solid success-solid or danger with white Inter 13 px and a Lucide icon.
// Labels never cover a box, mask, other label or the verdict while a free place exists.

const STATE = {
  light: { found: '#3664B3', defect: '#DC2626', on: '#FFFFFF', casing: '#FFFFFF' },
  dark: { found: '#A7BFE4', defect: '#F87171', on: '#0F1729', casing: '#0F1729' },
};
// Solid status backgrounds that carry white text at 4.5:1 or more.
const VERDICT = { pass: '#15803D', reject: '#DC2626' };
const SANS = 'Inter, Arial, sans-serif';
const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
// Lucide check and x on a 24 px grid.
const ICON = { pass: 'M20 6 9 17l-5-5', reject: 'M18 6 6 18M6 6l12 12' };
// Inter and JetBrains Mono capitals are 0.73 em tall: text is centred on them, not on the font box.
const CAP = 0.73;

// Inter advance widths in em (weights 500 and 600, measured), so tabs get equal padding.
const INTER = {
  500: ' .27!.3".49#.64$.65%.99&.65\'.31(.37).37*.52+.67,.3-.46..3/.37:.3;.32<.67=.67>.67?.53@.98A.71B.66C.73D.72E.6F.59G.75H.74I.27J.58K.69L.57M.91N.76O.77P.64Q.77R.65S.65T.65U.74V.71W1X.7Y.7Z.64[.37].37_.46a.57b.62c.58d.62e.59f.38g.62h.6i.25j.25k.56l.25m.89n.6o.6p.62q.62r.39s.54t.34u.6v.57w.83x.56y.58z.56Ø.77É.6À.71Ó.77–.5×.67',
  600: ' .25!.32".52#.64$.65%1&.66\'.33(.37).37*.54+.67,.32-.47..32/.38:.32;.33<.67=.67>.67?.54@1A.73B.66C.74D.72E.61F.59G.75H.75I.28J.58K.7L.57M.92N.76O.77P.65Q.77R.65S.65T.66U.74V.73W1.02X.72Y.71Z.65[.37].37_.47a.57b.62c.58d.62e.59f.39g.63h.61i.26j.26k.57l.26m.9n.61o.61p.62q.62r.4s.55t.35u.61v.59w.84x.57y.59z.57Ø.77É.61À.73Ó.77–.5×.67',
};
const table = (src) => Object.fromEntries([...src.matchAll(/(.)(\d*\.?\d+)/gu)].map(([, ch, w]) => [ch, Number(w)]));
const WIDTHS = { 500: table(INTER[500]), 600: table(INTER[600]) };
const TABULAR = 0.63; // tabular figures share one width
const textWidth = (s, size, { mono = false, weight = 500 } = {}) =>
  [...String(s)].reduce((sum, ch) => sum + (mono ? 0.6 : /\d/.test(ch) ? TABULAR : WIDTHS[weight][ch] ?? 0.6), 0) * size;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderOverlay(spec) {
  const { width: W, height: H, tone = 'light', items = [], verdict } = spec;
  const k = W / (spec.displayWidth ?? W); // image px per display px
  const st = STATE[tone] ?? STATE.light;
  const S = 2 * k; // brackets, frames, edges and dimension lines
  const snap = (v) => Math.round(v / k) * k; // on the display pixel grid, so 2 px lines stay sharp
  const colour = (it) => (it.state === 'defect' ? st.defect : st.found);
  const out = [];
  const labels = []; // tabs are placed after every shape is known
  const taken = []; // rectangles tabs must not cover: every item, the verdict, placed tabs

  // A line over its casing: the casing is 1 px wider on each side, in the colour the line contrasts with most.
  const cased = (d, col, width = S, cap = 'square', join = 'miter') =>
    `<path d="${d}" fill="none" stroke="${st.casing}" stroke-opacity="0.9" stroke-width="${width + 2 * k}" stroke-linecap="${cap}" stroke-linejoin="${join}"/>` +
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="${width}" stroke-linecap="${cap}" stroke-linejoin="${join}"/>`;
  const prefer = (order, side) => (side && order.includes(side) ? [side, ...order.filter((o) => o !== side)] : order);

  for (const it of items) {
    const col = colour(it), bad = it.state === 'defect';
    if (it.type === 'box' || it.type === 'read') {
      const x = snap(it.x), y = snap(it.y), w = snap(it.x + it.w) - x, h = snap(it.y + it.h) - y;
      const rect = { x, y, w, h };
      if (it.type === 'read') {
        // A highlighter over the text and a 2 px rule under it.
        out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" fill-opacity="${bad ? 0.2 : 0.14}"/>`, cased(`M${x},${y + h}H${x + w}`, col, S, 'butt'));
        if (it.text) labels.push({ rect, parts: [it.text], col, bad, mono: true, flush: false, order: prefer(['right', 'left', 'below', 'above'], it.chip) });
      } else {
        if (bad) {
          out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" fill-opacity="0.08"/>`, cased(`M${x},${y}H${x + w}V${y + h}H${x}Z`, col));
        } else {
          // Corner brackets, a fifth of the short side (6 to 14 px), on a 1 px hairline inside their stroke.
          const a = Math.min(Math.max(0.2 * Math.min(w, h), 6 * k), 14 * k, w / 2, h / 2), i = k / 2;
          const brackets = [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]
            .map(([cx, cy, dx, dy]) => `M${cx + dx * a},${cy}H${cx}V${cy + dy * a}`).join('');
          out.push(cased(`M${x + i},${y + i}H${x + w - i}V${y + h - i}H${x + i}Z`, col, k), cased(brackets, col));
        }
        const parts = [it.label, it.value].filter(Boolean);
        if (parts.length) labels.push({ rect, parts, col, bad, flush: true, order: prefer(['above', 'aboveRight', 'below', 'belowRight', 'right', 'left'], it.chip) });
      }
      taken.push(rect);
    } else if (it.type === 'mask') {
      // Smooth closed contour through the points (Catmull-Rom), so round parts keep round edges.
      // "smooth": false keeps straight edges for square parts.
      const P = it.points, n = P.length;
      const d = it.smooth === false || n < 4
        ? `M${P.map((p) => p.join(',')).join('L')}Z`
        : `M${P[0].join(',')}` + P.map((p1, j) => {
            const p0 = P[(j - 1 + n) % n], p2 = P[(j + 1) % n], p3 = P[(j + 2) % n];
            return `C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
          }).join('') + 'Z';
      out.push(`<path d="${d}" fill="${col}" fill-opacity="${bad ? 0.28 : 0.2}"/>`, cased(d, col, S, 'round', 'round'));
      const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
      const rect = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
      taken.push(rect);
      // The tab sits over the highest point (or under the lowest, beside the outermost), not over the bounding box's corner.
      const top = P.reduce((a, p) => (p[1] < a[1] ? p : a)), low = P.reduce((a, p) => (p[1] > a[1] ? p : a));
      const parts = [it.label, it.value].filter(Boolean);
      if (parts.length) labels.push({ rect, parts, col, bad, flush: false, anchor: { top: top[0], low: low[0] }, order: prefer(['aboveCentre', 'belowCentre', 'right', 'left', 'above', 'aboveRight'], it.chip === 'above' ? 'aboveCentre' : it.chip === 'below' ? 'belowCentre' : it.chip) });
    } else if (it.type === 'measure') {
      const [x1, y1] = it.from, [x2, y2] = it.to;
      const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy, ny = ux;
      const e = 8 * k, al = 8 * k, aw = 3 * k; // extension ticks each side; arrowheads 8 px long, 6 px wide
      const fs = 12 * k, th = 20 * k, pad = 7 * k;
      const tw = it.value ? snap(2 * pad + textWidth(it.value, fs, { weight: 600 })) : 0;
      const along = Math.abs(ux) >= Math.abs(uy) ? tw : th; // what the tab takes along the line
      const inline = it.value && (Math.abs(ux) > 0.98 || Math.abs(uy) > 0.98) && len >= along + 2 * (al + 10 * k);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, gap = inline ? along / 2 + 4 * k : 0;
      const line = inline
        ? `M${x1},${y1}L${mx - ux * gap},${my - uy * gap}M${mx + ux * gap},${my + uy * gap}L${x2},${y2}`
        : `M${x1},${y1}L${x2},${y2}`;
      const ticks = `M${x1 - nx * e},${y1 - ny * e}L${x1 + nx * e},${y1 + ny * e}M${x2 - nx * e},${y2 - ny * e}L${x2 + nx * e},${y2 + ny * e}`;
      const head = (px, py, dx, dy) => `M${px},${py}L${px + dx * al + nx * aw},${py + dy * al + ny * aw}L${px + dx * al - nx * aw},${py + dy * al - ny * aw}Z`;
      out.push(cased(line + ticks, col, S, 'butt'),
        `<path d="${head(x1, y1, ux, uy)}${head(x2, y2, -ux, -uy)}" fill="${col}" stroke="${st.casing}" stroke-opacity="0.9" stroke-width="${2 * k}" stroke-linejoin="miter" paint-order="stroke"/>`);
      const rect = { x: Math.min(x1, x2) - e, y: Math.min(y1, y2) - e, w: Math.abs(x2 - x1) + 2 * e, h: Math.abs(y2 - y1) + 2 * e };
      if (it.value) {
        if (inline) labels.push({ rect, parts: [it.value], col, bad, at: [mx - tw / 2, my - th / 2], measure: true });
        else labels.push({ rect, parts: [it.value], col, bad, measure: true, flush: false, order: prefer(['aboveCentre', 'belowCentre', 'right', 'left'], it.chip) });
      }
      taken.push(rect);
    }
  }

  // Verdict geometry first, so no tab lands on it.
  let verdictSvg = '';
  if (verdict) {
    // The only solid status colour that is not tied to an item: 28 px, white Inter Semibold 13 px, Lucide icon,
    // the short reason after a hairline divider.
    const pass = verdict.result !== 'reject';
    const fs = 13 * k, h = 28 * k, pad = 10 * k, icon = 14 * k, gap = 7 * k, sep = 9 * k;
    const main = verdict.text ?? (pass ? 'OK' : 'NOK');
    const detail = verdict.detail ?? '';
    const x = 12 * k, y = 12 * k, base = y + h / 2 + (fs * CAP) / 2;
    const tx = x + pad + icon + gap, rule = tx + textWidth(main, fs, { weight: 600 }) + sep;
    const w = snap((detail ? rule + sep + textWidth(detail, fs) : rule - sep) + pad - x);
    taken.push({ x, y, w, h, soft: true });
    verdictSvg = `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${pass ? VERDICT.pass : VERDICT.reject}"/>` +
      `<path transform="translate(${x + pad},${y + (h - icon) / 2}) scale(${icon / 24})" d="${ICON[pass ? 'pass' : 'reject']}" fill="none" stroke="#FFFFFF" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>` +
      (detail ? `<rect x="${snap(rule)}" y="${y + 8 * k}" width="${k}" height="${h - 16 * k}" fill="#FFFFFF" fill-opacity="0.5"/>` : '') +
      `<text y="${base}" fill="#FFFFFF" font-family="${SANS}" font-size="${fs}" style="font-variant-numeric:tabular-nums"><tspan x="${tx}" font-weight="600">${esc(main)}</tspan>${detail ? `<tspan x="${snap(rule) + k + sep}" font-weight="500">${esc(detail)}</tspan>` : ''}</text></g>`;
  }

  // Label tabs: 20 px, solid state colour, Inter 12 px (read values in JetBrains Mono). A box's tab sits flush on its
  // outer corner; a mask's floats 4 px over its highest point; a reading's sits 4 px beside the text.
  // Each takes the first place inside the margins that covers nothing; failing that, the place that covers least.
  const m = 12 * k;
  const area = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  for (const L of labels) {
    const { rect: r, parts, col, bad, mono = false } = L;
    const fs = 12 * k, h = 20 * k, pad = 7 * k, icon = bad ? 10 * k : 0, igap = bad ? 5 * k : 0, between = 5 * k;
    const weight = (i) => (mono ? 500 : L.measure || i === 0 ? 600 : 500);
    const w = snap(pad + icon + igap + parts.reduce((s, p, i) => s + textWidth(p, fs, { mono, weight: weight(i) }), 0) + (parts.length - 1) * between + pad);
    let left, top;
    if (L.at) [left, top] = L.at;
    else {
      const o = L.flush ? S / 2 : 0, g = L.flush ? -S / 2 : 4 * k; // flush: on the stroke's outer edge
      const ax = L.anchor ?? { top: r.x + r.w / 2, low: r.x + r.w / 2 };
      const spots = {
        above: [r.x - o, r.y - h - g], aboveRight: [r.x + r.w + o - w, r.y - h - g],
        below: [r.x - o, r.y + r.h + g], belowRight: [r.x + r.w + o - w, r.y + r.h + g],
        right: [r.x + r.w + g, L.flush ? r.y - o : r.y + (r.h - h) / 2], left: [r.x - w - g, L.flush ? r.y - o : r.y + (r.h - h) / 2],
        aboveCentre: [ax.top - w / 2, r.y - h - g], belowCentre: [ax.low - w / 2, r.y + r.h + g],
      };
      const fits = ([x, y]) => x >= m - 0.01 && y >= m - 0.01 && x + w <= W - m + 0.01 && y + h <= H - m + 0.01;
      const cost = ([x, y], c = 0) => taken.reduce((s, t) => { const q = t.soft ? c : 0; return s + (t === r ? 0 : area({ x: x - q, y: y - q, w: w + 2 * q, h: h + 2 * q }, t)); }, 0);
      const cands = L.order.map((q) => spots[q]);
      const inside = cands.filter(fits);
      // First choice: covering nothing and 4 px clear of the verdict and other labels; then covering nothing; then covering least.
      const best = inside.find((c) => cost(c, 4 * k) === 0) ?? inside.find((c) => cost(c) === 0) ?? inside.sort((a, b) => cost(a) - cost(b))[0] ?? cands[0];
      [left, top] = best;
      left = Math.max(m, Math.min(left, W - w - m));
      top = Math.max(m, Math.min(top, H - h - m));
    }
    left = snap(left); top = snap(top);
    taken.push({ x: left, y: top, w, h, soft: true });
    const base = top + h / 2 + (fs * CAP) / 2;
    let x = left + pad + icon + igap, spans = '';
    parts.forEach((p, i) => { spans += `<tspan x="${x}" font-weight="${weight(i)}">${esc(p)}</tspan>`; x += textWidth(p, fs, { mono, weight: weight(i) }) + between; });
    out.push(`<g><rect x="${left}" y="${top}" width="${w}" height="${h}" fill="${col}"/>` +
      (bad ? `<path transform="translate(${left + pad},${top + (h - icon) / 2}) scale(${icon / 24})" d="${ICON.reject}" fill="none" stroke="${st.on}" stroke-width="3.25" stroke-linecap="round"/>` : '') +
      `<text y="${base}" fill="${st.on}" font-family="${mono ? MONO : SANS}" font-size="${fs}" style="font-variant-numeric:tabular-nums">${spans}</text></g>`);
  }
  out.push(verdictSvg);

  const img = spec.image ? `<image href="${esc(spec.image)}" width="${W}" height="${H}"/>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${img}${out.join('')}</svg>`;
  // Round coordinates inside attributes only (not the image's href); label text keeps its exact digits.
  return svg.replace(/ ([\w-]+)="([^"]*)"/g, (all, name, v) => (name === 'href' ? all : ` ${name}="${v.replace(/\d+\.\d{3,}/g, (n) => String(Math.round(n * 100) / 100))}"`));
}

// CLI: node overlay.mjs spec.json > out.svg
if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import('node:fs');
  process.stdout.write(renderOverlay(JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))) + '\n');
}
