// Inspection-point callouts (variant A on photo posts: square node, no tile; variant B with a
// zoom tile for decks and print). Used by assets.py for post 03. A node on the exact point, a horizontal hairline to a label column at the
// image edge, labels stacked on a fixed rhythm; optional zoom tile (square crop with the inspection frame inside).
// Sizes are design px times `k` (canvas px per design px).
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
const INTER = {
  500: ' .27!.3".49#.64$.65%.99&.65\'.31(.37).37*.52+.67,.3-.46..3/.37:.3;.32<.67=.67>.67?.53@.98A.71B.66C.73D.72E.6F.59G.75H.74I.27J.58K.69L.57M.91N.76O.77P.64Q.77R.65S.65T.65U.74V.71W1X.7Y.7Z.64[.37].37_.46a.57b.62c.58d.62e.59f.38g.62h.6i.25j.25k.56l.25m.89n.6o.6p.62q.62r.39s.54t.34u.6v.57w.83x.56y.58z.56Ø.77É.6À.71Ó.77–.5×.67á.57é.59í.25ó.6ú.6ñ.6°.4',
  600: ' .25!.32".52#.64$.65%1&.66\'.33(.37).37*.54+.67,.32-.47..32/.38:.32;.33<.67=.67>.67?.54@1A.73B.66C.74D.72E.61F.59G.75H.75I.28J.58K.7L.57M.92N.76O.77P.65Q.77R.65S.65T.66U.74V.73W1.02X.72Y.71Z.65[.37].37_.47a.57b.62c.58d.62e.59f.39g.63h.61i.26j.26k.57l.26m.9n.61o.61p.62q.62r.4s.55t.35u.61v.59w.84x.57y.59z.57Ø.77É.61À.73Ó.77–.5×.67á.57é.59í.26ó.61ú.61ñ.61°.4',
};
const table = (src) => Object.fromEntries([...src.matchAll(/(.)(\d*\.?\d+)/gu)].map(([, ch, w]) => [ch, Number(w)]));
const WIDTHS = { 500: table(INTER[500]), 600: table(INTER[600]) };
const tw = (s, size, weight = 500) => [...String(s)].reduce((a, ch) => a + (WIDTHS[weight >= 600 ? 600 : 500][ch] ?? 0.6) * (weight < 500 ? 0.985 : 1), 0) * size;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// "|" forces a line break, so a two-line text can be balanced by hand.
const wrap = (text, size, max, weight) => String(text).split('|').flatMap((part) => {
  const out = []; let line = '';
  for (const w of part.trim().split(' ')) { const t = line ? line + ' ' + w : w; if (tw(t, size, weight) > max && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
});
const CAP = 0.73;
const SANS = 'Inter, Arial, sans-serif';
const GROUND = {
  light: { line: '#3664B3', title: '#0F1729', text: '#475569', plate: null },
  navy: { line: '#7C9FD7', title: '#FFFFFF', text: '#CBD5E1', plate: null },
  photo: { line: '#3664B3', title: '#0F1729', text: '#475569', plate: '#FFFFFF' },
};

export function renderCallout(spec) {
  const { width: W, height: H, k = 1, ground = 'light', node = 'square', zoom = null, points = [] } = spec;
  const g = GROUND[ground];
  const im = spec.image; // { href, x, y, w, h, nw, nh }
  const sx = im.w / im.nw, sy = im.h / im.nh;
  const P = points.map((p) => ({ ...p, cx: im.x + p.x * sx, cy: im.y + p.y * sy, fx: im.x + (p.focus?.[0] ?? p.x) * sx, fy: im.y + (p.focus?.[1] ?? p.y) * sy })).sort((a, b) => a.cy - b.cy);
  const col = spec.column; // { side, x, width }
  const right = col.side !== 'left';
  const T = zoom ? zoom.size * k : 0, tgap = zoom ? 12 * k : 0;
  const fsT = (spec.title ?? 13) * k, fsX = (spec.text ?? 12) * k, lhT = fsT * 1.3, lhX = fsX * 1.4;
  const pad = g.plate ? 8 * k : 0;
  const textW = col.width - T - tgap - 2 * pad;
  const out = [];
  if (spec.background) out.push(`<rect width="${W}" height="${H}" fill="${spec.background}"/>`);
  // image.hidden: the picture is drawn by an earlier call (a second label column over the same picture).
  if (!im.hidden) out.push(`<image href="${esc(im.href)}" x="${im.x}" y="${im.y}" width="${im.w}" height="${im.h}" preserveAspectRatio="none"/>`);
  if (zoom) out.push(`<defs>${P.map((p, i) => `<clipPath id="t${i}"><rect width="${T}" height="${T}"/></clipPath>`).join('')}</defs>`);
  // Slots: each label block (and tile) sits so its leader stays horizontal; on a clash it moves down the fixed rhythm.
  const rhythm = (spec.gap ?? 12) * k;
  let prev = -Infinity; const issues = [];
  const blocks = P.map((p) => {
    const lines = p.text ? wrap(p.text, fsX, textW, 400) : [];
    const th = lhT + lines.length * lhX; // text block
    const h = Math.max(T, th + 2 * pad);
    // The leader lands on the title's centre line (text only) or anywhere inside the tile's middle half.
    let top = zoom ? p.cy - T / 2 : p.cy - pad - lhT / 2;
    if (top < prev + rhythm) top = prev + rhythm;
    const land = zoom ? [top + T * 0.2, top + T * 0.8] : [top + pad + lhT / 2 - 0.5, top + pad + lhT / 2 + 0.5];
    const straight = p.cy >= land[0] && p.cy <= land[1];
    if (!straight) issues.push(`${p.title}: the leader needs a bend (points too close)`);
    prev = top + h;
    return { p, lines, th, h, top, straight, ly: straight ? p.cy : (land[0] + land[1]) / 2 };
  });
  const lw = 1 * k, cas = 1 * k;
  const imgL = im.x, imgR = im.x + im.w;
  for (const b of blocks) {
    const { p } = b;
    const x0 = col.x; // column edge where the tile (or label) starts
    const end = right ? x0 : x0; // leader end
    const nodeR = (node === 'hex' ? 7 : 4) * k;
    const start = right ? p.cx + nodeR + 2 * k : p.cx - nodeR - 2 * k;
    let d;
    if (b.straight) d = `M${start},${p.cy}H${end}`;
    else { const xj = right ? end - 14 * k : end + 14 * k; d = `M${start},${p.cy}H${xj}V${b.ly}H${end}`; }
    // Over the picture the hairline is the frame blue on a white casing; over the ground it takes the ground's blue.
    const clipImg = `M${imgL},${im.y}H${imgR}V${im.y + im.h}H${imgL}Z`;
    out.push(`<clipPath id="ci${p.cx | 0}${p.cy | 0}"><path d="${clipImg}"/></clipPath>`);
    out.push(`<g clip-path="url(#ci${p.cx | 0}${p.cy | 0})"><path d="${d}" fill="none" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="${lw + 2 * cas}"/><path d="${d}" fill="none" stroke="#3664B3" stroke-width="${lw}"/></g>`);
    if (ground !== 'photo') {
      const outside = right ? `M${imgR},0H${W}V${H}H${imgR}Z` : `M0,0H${imgL}V${H}H0Z`;
      out.push(`<clipPath id="co${p.cx | 0}${p.cy | 0}"><path d="${outside}"/></clipPath><path clip-path="url(#co${p.cx | 0}${p.cy | 0})" d="${d}" fill="none" stroke="${g.line}" stroke-width="${lw}"/>`);
    }
    // Node on the exact point.
    if (node === 'hex') {
      const r = 6 * k, hx = (a) => [p.cx + r * Math.cos(a), p.cy + r * Math.sin(a)];
      const hd = 'M' + [0, 1, 2, 3, 4, 5].map((i) => hx((Math.PI / 3) * i).join(',')).join('L') + 'Z';
      out.push(`<path d="${hd}" fill="none" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="${2 * k + 2 * cas}" stroke-linejoin="miter"/><path d="${hd}" fill="none" stroke="#3664B3" stroke-width="${2 * k}" stroke-linejoin="miter"/>`);
      out.push(`<rect x="${p.cx - 1.5 * k}" y="${p.cy - 1.5 * k}" width="${3 * k}" height="${3 * k}" fill="#3664B3"/>`);
    } else {
      const s = 8 * k;
      out.push(`<rect x="${p.cx - s / 2 - cas * 1.5}" y="${p.cy - s / 2 - cas * 1.5}" width="${s + 3 * cas}" height="${s + 3 * cas}" fill="#FFFFFF"/><rect x="${p.cx - s / 2}" y="${p.cy - s / 2}" width="${s}" height="${s}" fill="#3664B3"/>`);
    }
    // Tile and label.
    const lgap = g.plate ? 0 : 8 * k; // the hairline stops 8 px before bare text; it meets a plate's edge
    let lx = right ? x0 + lgap : x0 - lgap - col.width;
    if (zoom) {
      const tx = right ? x0 : x0 - T, ty = b.top;
      const z = p.zoom ?? zoom.crop; // source px shown across the tile
      const s = T / (z * sx); // tile px per canvas px of the picture
      if (T / z > 1.25 * (spec.native ?? 1)) issues.push(`${p.title}: the tile shows the picture at ${(T / z).toFixed(2)}x its source pixels (1.25x at most)`);
      const i = blocks.indexOf(b);
      out.push(`<g transform="translate(${tx},${ty})"><g clip-path="url(#t${i})"><image href="${esc(im.href)}" x="${-(p.fx - im.x) * s + T / 2}" y="${-(p.fy - im.y) * s + T / 2}" width="${im.w * s}" height="${im.h * s}" preserveAspectRatio="none"/></g>` +
        `<rect x="${lw / 2}" y="${lw / 2}" width="${T - lw}" height="${T - lw}" fill="none" stroke="${ground === 'navy' ? '#7C9FD7' : '#3664B3'}" stroke-width="${lw}"/>` +
        '</g>');
      lx = right ? x0 + T + tgap : x0 - T - tgap - (col.width - T - tgap);
    }
    const ty = zoom ? b.top + (T - b.th - 2 * pad) / 2 : b.top;
    const wmax = Math.max(tw(p.title, fsT, 600), ...b.lines.map((l) => tw(l, fsX, 400)));
    const bx = right ? lx : lx + (zoom ? col.width - T - tgap : col.width) - wmax - 2 * pad;
    if (g.plate) out.push(`<rect x="${bx}" y="${ty}" width="${wmax + 2 * pad}" height="${b.th + 2 * pad}" fill="${g.plate}"/>`);
    const anchor = right ? '' : ' text-anchor="end"';
    const tx0 = right ? bx + pad : bx + wmax + pad;
    let y = ty + pad + lhT / 2 + (fsT * CAP) / 2;
    out.push(`<text x="${tx0}" y="${y}" fill="${g.title}" font-family="${SANS}" font-size="${fsT}" font-weight="600"${anchor}>${esc(p.title)}</text>`);
    y += lhT / 2 + lhX / 2 - (fsT * CAP) / 2 + (fsX * CAP) / 2 + 0;
    for (const l of b.lines) { out.push(`<text x="${tx0}" y="${y}" fill="${g.text}" font-family="${SANS}" font-size="${fsX}" font-weight="400"${anchor}>${esc(l)}</text>`); y += lhX; }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${out.join('')}</svg>`;
  return { svg, issues };
}

// CLI: node callout.mjs spec.json > out.svg  (spec as renderCallout takes it; exits 1 and names the problem when a leader
// would need a bend or a tile is enlarged too far).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = renderCallout(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')));
  process.stdout.write(r.svg);
  if (r.issues.length) { console.error(r.issues.join('\n')); process.exit(1); }
}
