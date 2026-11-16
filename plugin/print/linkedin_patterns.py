"""Five decorative brand patterns for grounds and accents across media.

Rolling and Dramatic hexagon landscapes, circuit globe, circuit traces and scan profiles.
Use one per piece, clear of body text, tables, logos and the subject of a photograph.
No glow or gradient fills; opacity-only fades preserve the complete source cell paths.

Colourways: brand blue, deep blue, white, section grey, transparent white strokes,
transparent brand-blue strokes. Sizes: LinkedIn portrait,
square tile, personal banner and company cover, 1920 x 1080, and A4 portrait 1240 x 1754.
SVGs scale to print size; transparent PNGs retain alpha.

  python3 print/linkedin_patterns.py [--out DIR] [pattern ...]
  AIS_PATTERNS_OUT=DIR node print/linkedin_patterns.mjs --raster-only
Chromium runs under flock /tmp/ais-marketing-render.lock.
"""
import random, re, sys
from functools import lru_cache
from math import sqrt, sin, cos, pi, tan, radians, hypot, floor, ceil
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from landscape import round1, cells as mesh_cells
from linkedin_banner_fields import field as banner_field, FIELDS as BANNER_FIELDS, OP as BANNER_OP, SKY_FADE as BANNER_SKY_FADE

S3 = sqrt(3)
ROOT = Path(__file__).resolve().parents[2]
OUT = next(p for p in [ROOT / 'guide/public', ROOT / 'design-system/guide/public', ROOT / 'rosepetal-design/public'] if p.is_dir()) / 'downloads/linkedin-patterns'
PATTERNS = ['hexagon-landscape-rolling', 'hexagon-landscape-dramatic', 'circuit-globe', 'circuit-traces', 'scan-profiles']
# Light strokes need more opacity than white strokes to retain the same quiet presence.
WAYS = {'blue-on-white': ('#17356E', '#FFFFFF', .48),
        'blue-on-grey': ('#17356E', '#F1F5F9', .48),
        'white-on-deep-blue': ('#FFFFFF', '#10254C', .40),
        'white-transparent': ('#FFFFFF', 'none', .40),
        'blue-transparent': ('#17356E', 'none', .48),
        'white-on-blue': ('#FFFFFF', '#17356E', .40)}
SIZES = [(1080, 1350), (1080, 1080), (1584, 396), (1512, 256), (1920, 1080), (1240, 1754)]
# Banners: the ink keeps to the right, where the kit's hexagon field sits (.hexzone, a third of the width).
REACH = {(1584, 396): .32, (1512, 256): .30}


def name(pattern, way, W, H): return f'ais-linkedin-background-{pattern}-{way}-{W}x{H}'
def f1(v): return f'{v:.1f}'
def path(pts): return 'M' + 'L'.join(f'{f1(p[0])},{f1(p[1])}' for p in pts)
def poly(pts): return path(pts) + 'Z'
def hairline(W, H): return max(1.0, min(W, H) * 1.6 / 550) if H > 500 else 1.15


def smooth_fade(d, reach):
    t = min(1, max(0, d) / reach)
    return (1 - t * t * (3 - 2 * t)) ** 1.15


class Camera:
    """Pinhole camera at pos, pitched down by `pitch` degrees; principal point pp (fractions of W, H); focal F px."""
    def __init__(self, W, H, pos, pitch, F, pp):
        self.c, self.F, self.px, self.py = pos, F, pp[0] * W, pp[1] * H
        a = radians(pitch)
        self.f, self.r, self.u = (0, -sin(a), cos(a)), (1, 0, 0), (0, cos(a), sin(a))

    def proj(self, p):
        d = (p[0] - self.c[0], p[1] - self.c[1], p[2] - self.c[2])
        x, y, z = (sum(a * b for a, b in zip(d, v)) for v in (self.r, self.u, self.f))
        if z <= 0.05: return None
        return self.px + self.F * x / z, self.py - self.F * y / z, z


# ------------------------------------------------------------------ hexagon landscape
LADDER = (1.0, .72, .5, .34, .22)           # opacity steps, near -> far (fixed per cell outline)
WIDTH = (1.0, .9, .8, .72, .65)             # hairline per step
MIN_W, MIN_H, MIN_ASPECT = 7.0, 2.6, .14    # smallest stroked cell (hairlines) and thinnest (edge-on slopes read as moire)
_LAND_CACHE = {}
LANDSCAPES = {
    'rolling':  dict(amp=3.0, lz=28.0, lx=50.0, wander=1.2, pitch=8.0, fk=1.0),
    'dramatic': dict(amp=3.7, lz=30.0, lx=44.0, wander=1.4, pitch=9.0, fk=.95, calm=.25),
}
LAND_SIZES = {(1080, 1350): dict(horizon=.54, cell=.12), (1080, 1080): dict(horizon=.50, cell=.12),
              (1584, 396): dict(horizon=.34, cell=.075, ppx=.8), (1512, 256): dict(horizon=.30, cell=.065, ppx=.82)}


def surface(v):
    a, lz, lx, w = v['amp'], v['lz'], v['lx'], v['wander']
    k = 2 * pi / lz
    return lambda x, z: a * (0.62 * sin(k * z + w * sin(2 * pi * x / lx) + 0.4)
                             + 0.28 * sin(0.55 * k * z - 2 * pi * x / (1.7 * lx) + 1.9)
                             + 0.10 * sin(1.9 * k * z + 2 * pi * x / (0.8 * lx) + 0.7))


def landscape_cells(W, H, sw, v, horizon, cell_px, ppx=.5):
    """Projected cells, far -> near: (depth, step or None, d, centre x). World unit = cell radius. The camera height puts
    the nearest cell at the bottom edge cell_px wide."""
    key = (W, H, sw, tuple(v.items()), horizon, cell_px, ppx)
    if key not in _LAND_CACHE:
        _LAND_CACHE[key] = [(depth, step, d, centre[0], coverage) for depth, step, d, centre, coverage in
            mesh_cells(W, H, sw, v, horizon, cell_px, ppx=ppx)]
    return _LAND_CACHE[key]


def landscape_svg(variant, W, H, way):
    ink, ground, op = WAYS[way]; sw = hairline(W, H); c = LAND_SIZES.get((W, H), dict(horizon=.50 if W > H else .54, cell=.10 if W > H else .12))
    cs = landscape_cells(W, H, sw, LANDSCAPES[variant], c['horizon'], c['cell'] * W, c.get('ppx', .5))
    reach = REACH.get((W, H), 0) * W
    body = []
    for depth, step, d, mx, coverage in cs:
        st = step
        if reach:
            t = (W - mx) / reach
            if t >= 1: continue
            if st is not None: st += int(t * 5)
            if st is not None and st >= len(LADDER): st = None
        if st is None: body.append(f'<path d="{d}"/>')
        else: body.append(f'<path d="{d}" stroke="{ink}" stroke-opacity="{op * LADDER[st] * coverage:.4f}"'
                          + (f' stroke-width="{sw * WIDTH[st]:.2f}"' if st else '') + '/>')
    # Share the committed banner horizon blend: opacity changes, original mesh paths stay whole.
    stops = ''.join(f'<stop offset="{k / 16:.4f}" stop-color="#FFF" stop-opacity="{(k / 16) ** 2 * (3 - 2 * k / 16):.4f}"/>' for k in range(17))
    defs = (f'<defs><linearGradient id="sky" x1="0" y1="{c["horizon"] * H}" x2="0" y2="{(c["horizon"] + BANNER_SKY_FADE) * H}" gradientUnits="userSpaceOnUse">{stops}</linearGradient>'
            f'<mask id="horizon" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}"><rect width="{W}" height="{H}" fill="url(#sky)"/></mask></defs>')
    return doc(W, H, ground, defs + f'<g mask="url(#horizon)" fill="none" stroke="none" stroke-width="{sw:.2f}" stroke-linejoin="round">{"".join(body)}</g>')


def doc(W, H, ground, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">' +
            (f'<rect width="{W}" height="{H}" fill="{ground}"/>' if ground != "none" else "") + body + "</svg>")


# ------------------------------------------------------------------ line motifs (globe, traces, profiles)
# element = (kind, geometry, mx, my, step[, width k])   kind: line, dot (x, y, r), ring (x, y, r), occ (ground-filled)
STEPS = (1.0, 0.7, 0.48, 0.32)       # depth steps, near -> far
DOT_K = 2.1                          # via radius in hairlines


@lru_cache(maxsize=8)
def globe(W, H, sw, cx, cy, Rs, tilt=24, roll=-18, lane=1.3, seed=7, lat=(-58, 80)):
    """Circuit traces on the parallels of a tilted sphere (orthographic), front half only; the depth step is how far a
    point has turned away from the viewer. Traces change lane at 45 degrees on the surface and end on solid vias."""
    g = 1080 / 12.5 / 3 * (sw / (1080 * 1.6 / 550))
    dphi = g * lane / Rs * 180 / pi
    ta, ra = radians(tilt), radians(roll)

    def P(phi, lam):
        p, l = radians(phi), radians(lam)
        x, y, z = cos(p) * sin(l), sin(p), cos(p) * cos(l)
        y, z = y * cos(ta) - z * sin(ta), y * sin(ta) + z * cos(ta)
        x, y = x * cos(ra) - y * sin(ra), x * sin(ra) + y * cos(ra)
        return cx + Rs * x, cy - Rs * y, z

    def bandz(z): return 0 if z > .62 else 1 if z > .38 else 2 if z > .17 else 3
    els, nodes = [], []

    def curve(pts):
        cur, cb = [], None
        for x, y, z in pts:
            if z <= 0.02:
                if len(cur) > 1: els.append(('line', path(cur), *cur[len(cur) // 2], cb))
                cur, cb = [], None; continue
            b = bandz(z)
            if cb is not None and b != cb:
                cur.append((x, y)); els.append(('line', path(cur), *cur[len(cur) // 2], cb)); cur = [(x, y)]
            else: cur.append((x, y))
            cb = b
        if len(cur) > 1: els.append(('line', path(cur), *cur[len(cur) // 2], cb))

    def node(phi, lam):
        x, y, z = P(phi, lam)
        if z < .15 or any(hypot(x - a, y - b) < sw * 7 for a, b in nodes): return
        nodes.append((x, y)); els.append(('dot', (x, y, sw * DOT_K), x, y, bandz(z)))

    lanes = [lat[0] + k * dphi for k in range(int((lat[1] - lat[0]) / dphi) + 1)]
    n = len(lanes)

    def seg(phi, l0, l1):
        k = max(2, int(abs(l1 - l0) / 1.5))
        return [P(phi, l0 + (l1 - l0) * i / k) for i in range(k + 1)]
    els.append(('line', path([(cx + Rs * cos(radians(i)), cy + Rs * sin(radians(i))) for i in range(361)]), cx - Rs, cy, 2))
    rnd = random.Random(seed); occ = {k: [] for k in range(n)}
    keq = min(range(n), key=lambda k: abs(lanes[k] - 8))
    curve(seg(lanes[keq], -180, 180)); occ[keq].append((-999, 999))
    kt = keq + 2                                         # the encoder track: ticks round one parallel
    if kt < n:
        occ[kt].append((-999, 999)); phi = lanes[kt]
        for i in range(0, 360, 2):
            a, b = P(phi - dphi * .3, i), P(phi + dphi * .3, i)
            if a[2] > .05 and b[2] > .05: els.append(('line', path([a[:2], b[:2]]), a[0], a[1], bandz(a[2])))
    curve([P(-80 + i, -34) for i in range(0, 171, 2)])  # one meridian: the globe's other direction

    def free(k, s, e):
        if not 0 <= k < n: return False
        gap = 3.2 / max(.2, cos(radians(lanes[k])))
        return all(e + gap < a or s - gap > b for a, b in occ[k])
    for it in range(4000):
        fine = it > 1500
        m = rnd.randint(1, 3) if fine else rnd.randint(2, 6); k0 = rnd.randint(0, max(0, n - m)); d = rnd.choice((-1, 1))
        s = rnd.uniform(-120, 100); e = s + (rnd.uniform(8, 30) if fine else rnd.uniform(14, 75))
        plan, ok = [], True
        for i in range(m):
            k = k0 + i
            if k >= n: ok = False; break
            cphi = max(.25, cos(radians(lanes[k])))
            ei = e + 3.0 * dphi / cphi * ((m - 1 - i) if d > 0 else i); si = s + rnd.choice((0, 0, 1, 2)) * dphi / cphi
            peel = rnd.random() < .65; k2 = k + d if peel else k
            if peel and not 0 <= k2 < n: ok = False; break
            dl = dphi / cphi; L2 = rnd.uniform(1.5, 4.5) * dphi / cphi if peel else 0
            spans = [(k, si - 2, ei + (dl / 2 if peel else 2))] + ([(k2, ei + dl / 2, ei + dl + L2 + 2)] if peel else [])
            if not all(free(*q) for q in spans): ok = False; break
            plan.append((k, si, ei, peel, k2, dl, L2, spans))
        if not ok: continue
        for k, si, ei, peel, k2, dl, L2, spans in plan:
            for kk, a, b in spans: occ[kk].append((a, b))
            pts = seg(lanes[k], si, ei)
            if peel: pts += seg(lanes[k2], ei + dl, ei + dl + L2); node(lanes[k2], ei + dl + L2)
            else: node(lanes[k], ei)
            node(lanes[k], si); curve(pts)
    return els


DIRS = [(1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1), (0, -1), (1, -1)]


def offset_line(pts, o):
    """The polyline offset by o to its left, mitred, so lanes keep one step apart through the 45-degree bends."""
    segs = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        L = hypot(x1 - x0, y1 - y0); nx, ny = -(y1 - y0) / L, (x1 - x0) / L
        segs.append(((x0 + nx * o, y0 + ny * o), (x1 + nx * o, y1 + ny * o)))
    out = [segs[0][0]]
    for (p0, p1), (q0, q1) in zip(segs, segs[1:]):
        d1, d2 = (p1[0] - p0[0], p1[1] - p0[1]), (q1[0] - q0[0], q1[1] - q0[1])
        den = d1[0] * d2[1] - d1[1] * d2[0]
        if abs(den) < 1e-9: out.append(p1); continue
        t = ((q0[0] - p0[0]) * d2[1] - (q0[1] - p0[1]) * d2[0]) / den
        out.append((p0[0] + d1[0] * t, p0[1] + d1[1] * t))
    out.append(segs[-1][1])
    return out


def bundle_paths(start, d0, turn, legs, n, ends, kind):
    """n parallel traces one grid step apart: a run along d0, a 45-degree run, a run along the new direction; each
    member's last run is longer by ends[m] steps, so the vias stagger."""
    l1, l2, l3 = legs
    d1 = DIRS[(DIRS.index(d0) + turn) % 8]; d2 = DIRS[(DIRS.index(d0) + (2 * turn if kind == 'L' else 0)) % 8]
    if kind == 'I': d1 = d2 = d0
    n1 = hypot(*d1); c = [start]
    c.append((c[-1][0] + d0[0] * l1, c[-1][1] + d0[1] * l1))
    c.append((c[-1][0] + d1[0] * l2 / n1, c[-1][1] + d1[1] * l2 / n1))
    c.append((c[-1][0] + d2[0] * l3, c[-1][1] + d2[1] * l3))
    res = []
    for m in range(n):
        p = offset_line(c, m - (n - 1) / 2)
        (xa, ya), (xb, yb) = p[-2], p[-1]; L = hypot(xb - xa, yb - ya)
        p[-1] = (xb + (xb - xa) / L * ends[m], yb + (yb - ya) / L * ends[m])
        res.append(p)
    return res


@lru_cache(maxsize=8)
def traces(W, H, sw, anchor, reach, seed=4, density=1.0):
    """PCB routing on a grid of pitch g (a quarter of the hexagon module): buses of 2-7 traces enter from the edges at
    the anchor and break out inwards; smaller buses fill the rest of the reach. Ends on vias (dots) or ring pads."""
    g = 1080 / 12.5 / 5 * (sw / (1080 * 1.6 / 550))
    nx, ny = round(W / g), round(H / g)
    kx, ky = anchor[0] / g, anchor[1] / g; rr = reach / g
    inside = lambda i, j: hypot(i - kx, j - ky) < rr * 1.02 and -5 <= i <= nx + 5 and -5 <= j <= ny + 5
    occ = set()
    cells_of = lambda p: {(round(x0 + (x1 - x0) * k / max(1, int(hypot(x1 - x0, y1 - y0) * 3))), round(y0 + (y1 - y0) * k / max(1, int(hypot(x1 - x0, y1 - y0) * 3))))
                          for (x0, y0), (x1, y1) in zip(p, p[1:]) for k in range(max(1, int(hypot(x1 - x0, y1 - y0) * 3)) + 1)}
    rnd = random.Random(seed); items = []
    sx_in, sy_in = (-1 if kx > nx / 2 else 1), (-1 if ky > ny / 2 else 1)
    tries = int(density * 26000 * min(1.0, (rr * rr) / 2400 + .35))
    for t in range(tries):
        phase = t / tries
        if phase < .3:      # a bus entering from one of the two edges at the anchor, heading inwards
            if rnd.random() < .5 and 0 < ky < ny + 1:
                (sx, sy), d0 = (kx - sx_in * 2, ky + sy_in * rnd.randint(2, max(3, int(min(rr, ny) * .8)))), (sx_in, 0)
            else:
                (sx, sy), d0 = (kx + sx_in * rnd.randint(2, max(3, int(min(rr, nx) * .8))), ky - sy_in * 2), (0, sy_in)
            n = rnd.randint(3, 7); L = [rnd.randint(4, 10), rnd.randint(2, 6), rnd.randint(3, 9)]; kind = rnd.choice(('L', 'S', 'S'))
        else:
            sx, sy, d0 = rnd.randrange(nx), rnd.randrange(ny), rnd.choice(DIRS[::2])
            big = phase < .6
            n = rnd.randint(2, 5) if big else rnd.randint(1, 3)
            L = [rnd.randint(3, 9), rnd.randint(2, 6), rnd.randint(2, 9)] if big else [rnd.randint(1, 5), rnd.randint(1, 4), rnd.randint(1, 5)]
            kind = rnd.choice(('L', 'L', 'S', 'S', 'I'))
        ends = sorted(rnd.choice((0, 1, 2, 3)) for _ in range(n))
        if rnd.random() < .5: ends = ends[::-1]
        ps = bundle_paths((sx, sy), d0, rnd.choice((-1, 1)), L, n, ends, kind)
        test = set()
        for p in ps:
            test |= cells_of(p)
            for q in (p[0], p[-1]): test |= {(round(q[0]) + a, round(q[1]) + b) for a in (-1, 0, 1) for b in (-1, 0, 1)}
        ring = {(i + a, j + b) for (i, j) in test for a in (-1, 0, 1) for b in (-1, 0, 1)}
        if not all(inside(*c) and c not in occ for c in ring): continue
        occ |= test
        s0 = 'none' if phase < .3 else rnd.choice(('via', 'via', 'via', 'pad'))
        for p in ps: items.append((p, s0, 'pad' if rnd.random() < .18 else 'via'))
    els, pr, vr = [], g * .3, sw * DOT_K

    def trim(q, r, at_end):
        q = list(q); i, j = (-1, -2) if at_end else (0, 1)
        (xa, ya), (xb, yb) = q[j], q[i]; Ln = hypot(xb - xa, yb - ya)
        if Ln > r: q[i] = (xb - (xb - xa) / Ln * r, yb - (yb - ya) / Ln * r)
        return q
    for p, s0, s1 in items:
        q0 = [(x * g, y * g) for x, y in p]; q = q0
        if s0 == 'pad': q = trim(q, pr, False)
        if s1 == 'pad': q = trim(q, pr, True)
        els.append(('line', path(q), *q0[len(q0) // 2], 0))
        for (x, y), k in ((q0[0], s0), (q0[-1], s1)):
            if k == 'pad': els.append(('ring', (x, y, pr), x, y, 0))
            elif k == 'via': els.append(('dot', (x, y, vr), x, y, 0))
    return els


@lru_cache(maxsize=8)
def profiles(W, H, sw, view, step=0.32, zr=(-3, 16), bands=(6, 9, 12.5, 16), widths=(1, .85, .72, .6), dx=0.08):
    """Laser-triangulation profiles over a rolling surface: one line across it every `step`, far -> near, each with a
    ground fill below it, so nearer profiles hide the ones behind."""
    pos, pitch, Fk, pp = view
    cam = Camera(W, H, pos=pos, pitch=pitch, F=W * Fk, pp=pp)
    a, l, ph = 1.3, 2.4, (0, 1.3, 2.1)
    h = lambda x, z: a * (0.55 * sin(0.9 * x / l + 0.45 * z / l + ph[0]) + 0.35 * sin(0.47 * x / l - 0.8 * z / l + ph[1])
                          + 0.16 * sin(1.6 * x / l + 0.25 * z / l + ph[2]))
    band = lambda z: next((i for i, b in enumerate(bands) if z < b), None)
    half = (max(pp[0], 1 - pp[0]) / Fk) * zr[1] * 1.3 + 4
    els = []
    zs = [zr[0] + i * step for i in range(int((zr[1] - zr[0]) / step) + 1)]
    for zi, z in reversed(list(enumerate(zs))):
        q = cam.proj((0, h(0, z), z))
        b0 = band(q[2]) if q else None
        if b0 is None or zi % (1, 1, 2, 2)[b0]: continue
        gapz = step * (1, 1, 2, 2)[b0]; run = []; x = -half
        while x <= half:
            q = cam.proj((x, h(x, z), z)); q2 = cam.proj((x, h(x, z - gapz), z - gapz))
            # Every profile is drawn whole: where two crowd together near the horizon the band's lower opacity
            # carries them, instead of breaking the line (that left stubs and steps).
            if q: run.append(q + (True,))
            x += dx
        run = [p for p in run if -80 < p[0] < W + 80]
        if len(run) < 2: continue
        xy = [(p[0], p[1]) for p in run]
        els.append(('occ', poly(xy + [(xy[-1][0], H + 60), (xy[0][0], H + 60)]), *xy[len(xy) // 2], b0))
        cur, cb = [], None
        for p in run:
            if not p[3]:
                if len(cur) > 1: els.append(('line', path(cur), *cur[len(cur) // 2], cb, widths[cb]))
                cur, cb = [], None; continue
            b = band(p[2]); b = 3 if b is None else b
            if cb is not None and b != cb:
                cur.append(p[:2]); els.append(('line', path(cur), *cur[len(cur) // 2], cb, widths[cb])); cur = [p[:2]]
            else: cur.append(p[:2])
            cb = b
        if len(cur) > 1: els.append(('line', path(cur), *cur[len(cur) // 2], cb, widths[cb]))
    return els


def chunks(pts, L):
    """A polyline cut into pieces of length L, so a fade steps along it piece by piece."""
    out, cur, acc = [], [pts[0]], 0.0
    for a, b in zip(pts, pts[1:]):
        d = hypot(b[0] - a[0], b[1] - a[1]); t0 = 0.0
        while d > 0 and acc + d * (1 - t0) >= L:
            t = t0 + (L - acc) / d
            p = (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
            cur.append(p); out.append(cur); cur = [p]; acc = 0.0; t0 = t
        acc += d * (1 - t0); cur.append(b)
    if len(cur) > 1: out.append(cur)
    return out


def render(els, W, H, sw, way, fade=None):
    """fade(x, y) -> 0..1, evaluated once per mark (per hexagon module along a line)."""
    ink, ground, op = WAYS[way]; out = []
    for e in els:
        kind, geo, mx, my, b = e[:5]; wk = e[5] if len(e) > 5 else 1
        w = f' stroke-width="{sw * wk:.2f}"' if wk != 1 else ''
        if kind == 'occ':
            if not fade or fade(mx, my) > .02: out.append(f'<path d="{geo}" fill="{ground}" stroke="none"/>')
            continue
        if kind == 'line' and fade:
            pts = [tuple(map(float, p.split(','))) for p in geo[1:].split('L')]
            for c in chunks(pts, sw * 550 / 1.6 / 12.5):
                m = c[len(c) // 2]; o = op * STEPS[b] * fade(*m)
                if o >= .012: out.append(f'<path d="{path(c)}" stroke-opacity="{o:.3f}" stroke-linecap="butt"{w}/>')
            continue
        o = op * STEPS[b] * (fade(mx, my) if fade else 1)
        if o < .012: continue
        if kind == 'line': out.append(f'<path d="{geo}" stroke-opacity="{o:.3f}"{w}/>')
        elif kind == 'dot': out.append(f'<circle cx="{f1(geo[0])}" cy="{f1(geo[1])}" r="{geo[2]:.2f}" fill="{ink}" stroke="none" fill-opacity="{o:.3f}"/>')
        elif kind == 'ring': out.append(f'<circle cx="{f1(geo[0])}" cy="{f1(geo[1])}" r="{geo[2]:.2f}" stroke-opacity="{o:.3f}"/>')
    return doc(W, H, ground, f'<g fill="none" stroke="{ink}" stroke-width="{sw:.2f}" stroke-linejoin="round" stroke-linecap="round">{"".join(out)}</g>')


def banner_fade(W, H):
    """Banners take the composition of the kit's LinkedIn banners (linkedin_banner_fields.py): the same soft clearing
    round the words and the profile logo (margin M, Gaussian FEATHER) and the same smooth ramp in from the left."""
    k = BANNER_FIELDS['company' if (W, H) == (1512, 256) else 'personal']
    from linkedin_banner_fields import M
    FEATHER = 30  # line motifs keep their established clearing; only landscapes follow banner B
    from math import erf
    def clear(x, y, b):   # the blurred box's darkness at (x, y): a box M larger than the words, blurred by FEATHER
        x0, y0, x1, y1 = b[0] - M, b[1] - M, b[2] + M, b[3] + M; s = FEATHER * sqrt(2)
        return .25 * (erf((x1 - x) / s) - erf((x0 - x) / s)) * (erf((y1 - y) / s) - erf((y0 - y) / s))
    def f(x, y):
        edge, end = k['left_fade']; t = min(1, max(0, (x - end) / (edge - end)))
        return t * t * (3 - 2 * t) * max(0, 1 - sum(clear(x, y, b) for b in k['keep']))
    return f


def plateau(d, reach, flat=.45):
    """Full strength out to `flat` of the reach, then the corner fade."""
    return 1 if d < flat * reach else smooth_fade(d - flat * reach, (1 - flat) * reach)


def landscape_banner(variant, W, H, way):
    """The kit banner's own field, in this colourway: the same cells, recoloured, with the ground drawn under it."""
    ink, ground, op = WAYS[way]
    k = BANNER_FIELDS['company' if (W, H) == (1512, 256) else 'personal']
    svg = banner_field(**k, variant=variant).replace('#17356E', '__GROUND__').replace('#FFFFFF', ink).replace('__GROUND__', ground)
    svg = re.sub(r'stroke-opacity="([\d.]+)"', lambda m: f'stroke-opacity="{float(m.group(1)) * op / BANNER_OP:.3f}"', svg)
    # The ground goes under the masked land, after the mask's definitions (never inside the mask).
    return svg.replace('</defs>', f'</defs><rect width="{W}" height="{H}" fill="{ground}"/>', 1)


def motif_svg(pattern, W, H, way):
    """Per pattern and size, the composition: posts keep the ink low or in the bottom right, banners on the right."""
    sw = hairline(W, H); banner = H < 500
    side = banner_fade(W, H) if banner else None
    if banner and pattern.startswith('hexagon-landscape'): return landscape_banner(pattern.rsplit('-', 1)[1], W, H, way)
    if pattern == 'circuit-globe':
        cx, cy, Rs = {(1080, 1350): (1100, 1390, 760), (1080, 1080): (1100, 1120, 700),
                      (1584, 396): (1660, 300, 560), (1512, 256): (1580, 210, 430)}.get((W, H), (W * 1.02, H * 1.03, min(W, H) * .65))
        return render(globe(W, H, sw, cx, cy, Rs), W, H, sw, way, side)
    if pattern == 'circuit-traces':
        if banner: return render(traces(W, H, sw, (W, H), .62 * W, density=1.6), W, H, sw, way, side)
        reach = 1.15 * W
        return render(traces(W, H, sw, (W, H), reach, density=1.4), W, H, sw, way, lambda x, y: plateau(hypot(W - x, H - y), reach))
    if pattern == 'scan-profiles':
        view = {(1080, 1350): ((0, 2.3, -6), 8, .78, (.5, .5)), (1080, 1080): ((0, 2.3, -6), 8, .9, (.5, .42)),
                (1584, 396): ((0, 2.3, -6), 6, .42, (.78, .3)), (1512, 256): ((0, 2.3, -6), 5, .36, (.8, .26))}.get((W, H), ((0, 2.3, -6), 8, .78 if H > W else .9, (.5, .5)))
        return render(profiles(W, H, sw, view), W, H, sw, way, side)
    return landscape_svg(pattern.rsplit('-', 1)[1], W, H, way)


def build(out=OUT, patterns=None, sizes=None):
    if patterns and any(p not in PATTERNS for p in patterns): raise ValueError('Unapproved LinkedIn pattern')
    if sizes and any(size not in SIZES for size in sizes): raise ValueError('Unsupported LinkedIn size')
    out.mkdir(parents=True, exist_ok=True); files = []
    for p in patterns or PATTERNS:
        for W, H in sizes or SIZES:
            for way in WAYS:
                f = out / f'{name(p, way, W, H)}.svg'; f.write_text(motif_svg(p, W, H, way)); files.append(f)
    return files


if __name__ == '__main__':
    args = sys.argv[1:]; out = OUT; sizes = None
    if '--size' in args:
        i = args.index('--size'); sizes = [tuple(map(int, args[i+1].split('x')))]; del args[i:i+2]
    if args[:1] == ['--out']: out = Path(args[1]); args = args[2:]
    for f in build(out, args or None, sizes): print(f)
