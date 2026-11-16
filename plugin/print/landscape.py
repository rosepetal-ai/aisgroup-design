"""The hexagon landscape: flat-topped hexagon cells (the pattern's cell) draped on a surface with two or three crests,
seen from a low camera. Decorative brand grounds and accents across media, one per piece, clear of body text and tables.

Each lattice edge is sampled on the continuous surface and emitted once. Camera-ray
visibility removes genuinely occluded sections before SVG styling. No polygon fills
or centroid painter sorting; adjacent cells share identical world-space vertices.
No gradients, blur or glow.

Approved banner v3 B retains this surface and worst-facing coverage unchanged.
Used by linkedin_banner_fields.py (the Marketing kit's LinkedIn banners) and linkedin_patterns.py (the LinkedIn
backgrounds on the guide's Social media page).
"""
import re
from math import sqrt, sin, cos, pi, tan, radians, floor, ceil

S3 = sqrt(3)
LADDER = (1.0, .72, .5, .34, .22)           # opacity steps, near -> far (fixed per cell outline)
WIDTH = (1.0, .9, .8, .72, .65)             # hairline per step
MIN_W = 7.0                               # far-field cell width, in hairlines

# name -> surface and camera. Heights in cell radii; crests run across the view and wander sideways.
VARIANTS = {
    'rolling':  dict(amp=3.0, lz=28.0, lx=50.0, wander=1.2, pitch=8.0, fk=1.0),
    # Dramatic: gentler than the first cut (4.6/24/40, its near slopes folded cells flat), and calm near the camera.
    'dramatic': dict(amp=3.7, lz=30.0, lx=44.0, wander=1.4, pitch=9.0, fk=.95, calm=.25),
}


def f2(v): return f'{v:.4f}'


def round1(svg):
    """Every number to 0.1 px: the shipped files (a third smaller, the same picture at 1x and 2x)."""
    return re.sub(r'd="([^"]+)"', lambda m: 'd="' + re.sub(r'-?\d+\.\d+', lambda n: f'{float(n.group()):.1f}', m.group(1)) + '"', svg)


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


def surface(v):
    a, lz, lx, w = v['amp'], v['lz'], v['lx'], v['wander']
    def h(x, z):
        k = 2 * pi / lz
        return a * (0.62 * sin(k * z + w * sin(2 * pi * x / lx) + 0.4)
                    + 0.28 * sin(0.55 * k * z - 2 * pi * x / (1.7 * lx) + 1.9)
                    + 0.10 * sin(1.9 * k * z + 2 * pi * x / (0.8 * lx) + 0.7))
    return h


def visible_points(points, camera, height, spacing=.25):
    """Occlusion against the continuous height field, independent of painter order.

    Sample the camera ray at <= .25 world-unit intervals (four per cell radius).
    Endpoints are included; a point is hidden if terrain rises above its ray.
    Batching bounds temporary arrays. This also handles back-facing crest edges.
    """
    import numpy as np
    points = np.asarray(points)
    result = []
    for start in range(0, len(points), 256):
        p = points[start:start + 256]
        steps = max(2, ceil(float(p[:, 2].max()) / spacing))
        t = np.linspace(0, 1, steps + 1)[None, :]
        x = camera.c[0] + (p[:, 0:1] - camera.c[0]) * t
        z = camera.c[2] + (p[:, 2:3] - camera.c[2]) * t
        y = camera.c[1] + (p[:, 1:2] - camera.c[1]) * t
        # height supports arrays through the NumPy trigonometric functions.
        clearance = height(x, z) - y
        peak = np.argmax(clearance, axis=1)[:, None]
        # Refine the highest obstruction, including grazing silhouette rays.
        # A loose height epsilon makes rear edges leak across a crest in pixels.
        rt = np.clip((peak + np.linspace(-1, 1, 33)[None, :]) / steps, 0, 1)
        rx = camera.c[0] + (p[:, 0:1] - camera.c[0]) * rt
        rz = camera.c[2] + (p[:, 2:3] - camera.c[2]) * rt
        ry = camera.c[1] + (p[:, 1:2] - camera.c[1]) * rt
        result.extend(np.max(height(rx, rz) - ry, axis=1) < 1e-7)
    return result


def lattice_vertices(i, j):
    """Twice x and twice z/sqrt(3), exact even for negative columns."""
    return [(3*i+dx, 2*j+i%2+dz) for dx, dz in
            ((2, 0), (1, 1), (-1, 1), (-2, 0), (-1, -1), (1, -1))]


def cells(W, H, sw, v, horizon, cell_px, x_shift=0.0, ppx=.5, worst_facing=False):
    """Visible shared edges of a single continuous flat-top hexagonal surface.

    Both consumers receive visible paths and coverage; each path is an
    open edge, emitted once. No cell ground fills, centroid sorting, edge-on cell
    deletion or patch pruning: those operations tore the projected mesh at crests.
    """
    import numpy as np
    F = v['fk'] * .95 * sqrt(W * H); pitch = radians(v['pitch'])
    py = horizon * H + F * tan(pitch)
    a = pitch + (H - py) / F
    cam_h = F * 2 * tan(a) / cell_px + v['amp']
    cam = Camera(W, H, (x_shift, cam_h, 0), v['pitch'], F, (ppx, py / H))
    z_near = cam_h / tan(a)
    # calm: the land flattens towards the camera (to `calm` of its height), so a near slope never folds its cells.
    calm = v.get('calm')
    def ramp(z, lib):
        if calm is None: return 1
        t = lib.clip((z - z_near) / (1.2 * v['lz']), 0, 1) if lib is np else min(1, max(0, (z - z_near) / (1.2 * v['lz'])))
        return calm + (1 - calm) * t * t * (3 - 2 * t)
    h0 = surface(v)
    h = lambda x, z: h0(x, z) * ramp(z, None)
    def nh(x, z):
        k = 2 * pi / v['lz']
        return ramp(z, np) * v['amp'] * (.62 * np.sin(k*z + v['wander']*np.sin(2*pi*x/v['lx']) + .4)
            + .28*np.sin(.55*k*z - 2*pi*x/(1.7*v['lx']) + 1.9)
            + .10*np.sin(1.9*k*z + 2*pi*x/(.8*v['lx']) + .7))
    zmax = F * 2 / (MIN_W * sw)
    edges = {}
    # Integer lattice keys ensure adjacent cells use bit-identical shared edges.
    for j in range(1, ceil(zmax / S3) + 1):
        half = max(ppx, 1-ppx)*W/F*j*S3 + 4
        for i in range(floor((x_shift-half)/1.5), ceil((x_shift+half)/1.5)+1):
            vertices = lattice_vertices(i, j)
            for k, va in enumerate(vertices):
                vb = vertices[(k+1)%6]; key = tuple(sorted((va, vb)))
                if key in edges: continue
                ax, az = va[0]/2, va[1]*S3/2
                bx, bz = vb[0]/2, vb[1]*S3/2
                qa, qb = cam.proj((ax,h(ax,az),az)), cam.proj((bx,h(bx,bz),bz))
                if not qa or not qb: continue
                if max(qa[0],qb[0]) < -4 or min(qa[0],qb[0]) > W+4 or max(qa[1],qb[1]) < -8 or min(qa[1],qb[1]) > H+8: continue
                n = max(12, min(192, ceil(((qa[0]-qb[0])**2+(qa[1]-qb[1])**2)**.5/.5)))
                pts = [(ax+(bx-ax)*t/n, az+(bz-az)*t/n) for t in range(n+1)]
                world = [(x,h(x,z),z) for x,z in pts]
                edges[key] = world
    all_points = [p for edge in edges.values() for p in edge]
    visible = visible_points(all_points, cam, nh)
    out, index = [], 0
    for edge in edges.values():
        run = []
        depth = sum(cam.proj(p)[2] for p in edge)/len(edge)
        step = min(4, int(4.6*max(0,depth-z_near)/max(zmax-z_near,1e-6)))
        def emit():
            if len(run) > 1:
                d = 'M'+'L'.join(f'{f2(p[0])},{f2(p[1])}' for p in run)
                # Subpixel projected cell spacing at a tangent otherwise piles many
                # correct edges into a bright band. Coverage follows the surface
                # normal; it does not remove cells or alter occlusion/topology.
                # worst_facing (banners): judge the edge by its most grazing point, so an edge that runs onto the
                # back of a crest fades instead of drawing a long sliver across the cells in front.
                eps = .001
                def face(x, y, z):
                    hx = (h(x+eps,z)-h(x-eps,z))/(2*eps)
                    hz = (h(x,z+eps)-h(x,z-eps))/(2*eps)
                    return (hx*(x-cam.c[0]) + cam_h-y + hz*z)/max(.1,cam_h-y)
                facing = min(face(*edge[i]) for i in range(0, len(edge), max(1, len(edge)//6))) if worst_facing else face(*edge[len(edge)//2])
                coverage = min(1., max(.02, facing/.5))**1.5
                out.append((depth, step, d, (sum(p[0] for p in run)/len(run),sum(p[1] for p in run)/len(run)), coverage))
        for p in edge:
            q = cam.proj(p)
            if visible[index]: run.append(q)
            else: emit(); run = []
            index += 1
        emit()
    return out
