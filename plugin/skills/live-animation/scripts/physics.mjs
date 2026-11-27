// node physics.mjs <url> [fromWall:toWall] : steps the whole piece at STEP wall seconds (default 1/60) through DEV
// seeks and checks every solid the piece declares (DEV `__anim.bodies()` / `__plBodies()`):
//   - nothing passes through anything: a moving body inside another body or a wall by more than TOL (1.5 mm);
//   - nothing floats: a body at rest touches something under it (within 3 mm);
//   - nothing jumps: a body seen in two consecutive frames moves at most VMAX (4 m/s).
// Each body: { id, shape: 'box' | 'cyl', c: [x,y,z] centre (m), q: [x,y,z,w] orientation, h: [hx,hy,hz] half extents
// (box) or r, hh (cylinder along its local y), moving: true for products, kickers and anything that moves, visible
// (false while out of sight, e.g. inside the tunnels where a stream wraps), anchored: true for a part held by its
// mechanism (a pad on its rod: never «floating») }.
// Static walls (conveyor top, guides, chutes, bins and trays as their walls and floor, machine openings' jambs) are
// bodies with moving: false. Pairs that may touch by design (a can on the belt) touch within TOL, never more.
// Env: W/H (320 × 200: the scene is drawn small, only the state matters), STEP, TOL, VMAX. Exit 1 on any fault.
import { cli, range as isRange } from './args.mjs';
import { launchBrowser, prepPage, waitLive } from './lib.mjs';

const [url, range] = cli('node physics.mjs <url> [fromWall:toWall]   (env STEP=0.01667 wall s, TOL=0.0015 m, VMAX=4 m/s, W, H)', { min: 1, check: (a) => (a[1] ? isRange(a[1]) : null) });
const STEP = Number(process.env.STEP ?? 1 / 60), TOL = Number(process.env.TOL ?? 0.0015), VMAX = Number(process.env.VMAX ?? 4);

const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: Number(process.env.W ?? 320), height: Number(process.env.H ?? 200) } });
await prepPage(p, { logWarnings: true });
await waitLive(p, `${url}${url.includes('?') ? '&' : '?'}t=0`, 800);
if (await p.locator('[data-anim-stage][data-anim-kind="ui-film"]').count()) {
  await b.close();
  console.log('N/A: recorded UI contains no simulated rigid bodies');
  process.exit(3);
}
const end = await p.evaluate(() => (window.__anim?.wall ?? window.__plWall).wallOf(1e9));
const [w0, w1] = range ? range.split(':').map(Number) : [0, end];

const faults = await p.evaluate(({ w0, w1, STEP, TOL, VMAX }) => {
  const wall = window.__anim?.wall ?? window.__plWall, seek = window.__anim?.seek ?? window.__plSeek;
  const bodiesOf = window.__anim?.bodies ?? window.__plBodies;
  if (!bodiesOf) return [{ w: 0, t: 0, kind: 'contract', what: 'the piece declares no bodies (DEV __anim.bodies / __plBodies)' }];
  // rotate v by quaternion q, or by its inverse
  const rot = (q, v, inv) => {
    const [x, y, z] = inv ? [-q[0], -q[1], -q[2]] : q, w = q[3];
    const ix = w * v[0] + y * v[2] - z * v[1], iy = w * v[1] + z * v[0] - x * v[2], iz = w * v[2] + x * v[1] - y * v[0], iw = -x * v[0] - y * v[1] - z * v[2];
    return [ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x];
  };
  const local = (s, pt) => rot(s.q, [pt[0] - s.c[0], pt[1] - s.c[1], pt[2] - s.c[2]], true);
  const world = (s, v) => { const r = rot(s.q, v, false); return [r[0] + s.c[0], r[1] + s.c[1], r[2] + s.c[2]]; };
  /** How deep pt is inside s (m, > 0 inside), s grown by `grow`. */
  function depth(s, pt, grow = 0) {
    const l = local(s, pt);
    if (s.shape === 'box') return Math.min(s.h[0] + grow - Math.abs(l[0]), s.h[1] + grow - Math.abs(l[1]), s.h[2] + grow - Math.abs(l[2]));
    return Math.min(s.r + grow - Math.hypot(l[0], l[2]), s.hh + grow - Math.abs(l[1]));
  }
  const thinBox = (s) => s.shape === 'box' && s.h[0] <= 0.001 && Math.abs(s.q[0]) + Math.abs(s.q[1]) < 1e-9;
  const upright = (s) => s.shape === 'cyl' && Math.abs(s.q[0]) + Math.abs(s.q[2]) < 1e-9;
  /** Deepest point of a strip inside an upright cylinder, including points between surface samples.
   *  At the strip's closest z, the cylinder's section is a rectangle. Test the rotated strip against
   *  the section of the cylinder inset by d, using the four separating axes of the two rectangles. */
  function stripDepth(strip, cyl) {
    const [hx, hy, hz] = strip.h;
    const dx = cyl.c[0] - strip.c[0], dy = cyl.c[1] - strip.c[1];
    const dz = Math.max(0, Math.abs(cyl.c[2] - strip.c[2]) - hz);
    const sin = 2 * strip.q[2] * strip.q[3], cos = 1 - 2 * strip.q[2] ** 2;
    const s = Math.abs(sin), c = Math.abs(cos);
    function overlaps(d) {
      const r = cyl.r - d, hh = cyl.hh - d;
      if (r <= dz || hh <= 0) return false;
      const chord = Math.sqrt(r ** 2 - dz ** 2);
      return Math.abs(dx) < hx * c + hy * s + chord
        && Math.abs(dy) < hx * s + hy * c + hh
        && Math.abs(dx * cos + dy * sin) < hx + chord * c + hh * s
        && Math.abs(dy * cos - dx * sin) < hy + chord * s + hh * c;
    }
    if (!overlaps(TOL)) return 0;
    let lo = TOL, hi = Math.min(cyl.r - dz, cyl.hh);
    while (hi - lo > 0.00001) {
      const d = (hi + lo) / 2;
      if (overlaps(d)) lo = d;
      else hi = d;
    }
    return (lo + hi) / 2;
  }
  // Cache unit samples. Flexible strips change segment length on every seek.
  // Keeping their dimensioned surface samples would retain the entire film in memory.
  const samples = { box: [], cyl: [] };
  const n = 6;
  for (let a = 0; a <= n; a++) for (let c = 0; c <= n; c++) for (const sg of [-1, 1]) {
    const u = -1 + 2 * a / n, v = -1 + 2 * c / n;
    samples.box.push([sg, u, v], [u, sg, v], [u, v, sg]);
  }
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * 2 * Math.PI, x = Math.cos(a), z = Math.sin(a);
    for (let k = 0; k <= 6; k++) samples.cyl.push([x, -1 + k / 3, z]);
    for (const f of [0.5, 0]) for (const sg of [-1, 1]) samples.cyl.push([x * f, sg, z * f]);
  }
  const surface = (s) => {
    const [hx, hy, hz] = s.shape === 'box' ? s.h : [s.r, s.hh, s.r];
    return samples[s.shape].map(([x, y, z]) => world(s, [x * hx, y * hy, z * hz]));
  };
  function bounds(s) {
    const axisY = rot(s.q, [0, 1, 0], false);
    if (s.shape === 'cyl') {
      return axisY.map((v) => Math.abs(v) * s.hh + Math.sqrt(Math.max(0, 1 - v * v)) * s.r + 1e-9);
    }
    const axisX = rot(s.q, [1, 0, 0], false), axisZ = rot(s.q, [0, 0, 1], false);
    return axisY.map((v, i) => Math.abs(axisX[i]) * s.h[0] + Math.abs(v) * s.h[1] + Math.abs(axisZ[i]) * s.h[2] + 1e-9);
  }
  const faults = [], seen = new Set();
  const fault = (w, t, kind, what) => { const k = `${kind} ${what} ${Math.floor(w)}`; if (seen.has(k)) return; seen.add(k); faults.push({ w: +w.toFixed(3), t: +t.toFixed(3), kind, what }); };
  let prev = new Map(), rest = new Map();
  let inspected = 0;
  for (let w = w0; w <= w1 + 1e-9; w += STEP) {
    const t = wall.storyOf(w);
    seek(t);
    const all = bodiesOf().filter((s) => s.visible !== false);
    for (const s of all) s.bounds = bounds(s);
    const moving = all.filter((s) => s.moving);
    inspected += moving.length;
    const now = new Map();
    for (const a of moving) {
      now.set(a.id, a.c);
      // through anything?
      for (const o of all) {
        if (o === a || (o.moving && o.id < a.id)) continue;
        if (Math.abs(a.c[0] - o.c[0]) > a.bounds[0] + o.bounds[0]
          || Math.abs(a.c[1] - o.c[1]) > a.bounds[1] + o.bounds[1]
          || Math.abs(a.c[2] - o.c[2]) > a.bounds[2] + o.bounds[2]) continue;
        let d = 0;
        if (thinBox(a) && upright(o) && a.h[0] <= TOL) {
          d = stripDepth(a, o);
        } else if (thinBox(o) && upright(a) && o.h[0] <= TOL) {
          d = stripDepth(o, a);
        } else if (!(thinBox(a) && thinBox(o) && Math.max(a.h[0], o.h[0]) <= TOL)) {
          for (const pt of surface(a)) d = Math.max(d, depth(o, pt));
          for (const pt of surface(o)) d = Math.max(d, depth(a, pt));
        }
        if (d > TOL) fault(w, t, 'through', `${a.id} in ${o.id} by ${(d * 1000).toFixed(1)} mm`);
      }
      // jumping?
      const was = prev.get(a.id);
      if (was) {
        const v = Math.hypot(a.c[0] - was[0], a.c[1] - was[1], a.c[2] - was[2]) / (STEP * 1); // per wall second
        if (v > VMAX) fault(w, t, 'jump', `${a.id} moved ${(v * STEP * 1000).toFixed(0)} mm in one frame`);
      }
      // floating, once still for 0.25 s?
      const still = was && Math.hypot(a.c[0] - was[0], a.c[1] - was[1], a.c[2] - was[2]) < 0.0002;
      rest.set(a.id, still ? (rest.get(a.id) ?? 0) + STEP : 0);
      if (rest.get(a.id) > 0.25 && !a.anchored) {
        const pts = surface(a), bottom = Math.min(...pts.map((pt) => pt[1])), low = pts.filter((pt) => pt[1] < bottom + 0.001);
        const held = all.some((o) => o !== a && low.some((pt) => depth(o, pt, 0.003) > 0));
        if (!held) fault(w, t, 'floating', `${a.id} at rest with nothing under it`);
      }
    }
    prev = now;
  }
  if (!inspected) faults.push({ w: w0, t: w0, kind: 'coverage', what: 'no visible moving bodies were measured in this interval' });
  return faults;
}, { w0, w1, STEP, TOL, VMAX });
await b.close();
for (const f of faults) console.log(`wall ${f.w} s (story ${f.t}): ${f.kind}: ${f.what}`);
console.log(`faults ${faults.length}`);
process.exit(faults.length ? 1 : 0);
