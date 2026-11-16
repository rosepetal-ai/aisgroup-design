"""AIS brand pattern: one generator for every piece (cards, letterhead, decks, posts, print).

Geometry is the approved printed-card reference (flat-topped hexagons, R = short side / 12.5,
hairline 1.6/550 of the short side, radial fade from one corner, one light band at 45 degrees).
Three treatments share that lattice so every piece reads as one family:
  lines  - the agreed corner field (outline cells)            -> covers, cards, bands
  dots   - the same lattice drawn as vertex points             -> light grounds, letterhead, slides
  facets - faint lattice + a short run of tinted cells          -> hero areas, posts, roll-ups

usage: python3 pattern.py <out.svg> <w> <h> <lines|dots|facets> <tr|tl|br|bl> <navy|white> [reach] [piece-short-side]
       python3 pattern.py --assets [--check]   rewrite (or only compare) every shipped field listed in ASSETS
w/h in any unit (mm for print, px for screen); reach = field radius as a multiple of the short side.
"""
import sys
from math import cos, sin, pi, sqrt, hypot

TONE = {'navy': ('#ffffff', '#7C9FD7', 0.12), 'white': ('#3664B3', '#3664B3', 0.16),
        # decks: a plain #7C9FD7 hairline at about 25 % on navy, no light band
        'hairline': ('#7C9FD7', '#7C9FD7', 0.278)}


def lattice(w, h, R, corner):
    """Cell centres of a flat-topped grid anchored on the corner, ordered by distance."""
    cx, cy = (w if 'r' in corner else 0), (h if 'b' in corner else 0)
    sx, sy = (-1 if 'r' in corner else 1), (-1 if 'b' in corner else 1)
    dx, dy = 1.5 * R, sqrt(3) * R
    for i in range(int((w + 2 * R) / dx) + 2):
        for j in range(-1, int((h + 2 * dy) / dy) + 2):
            yield cx + sx * (R + i * dx - R), cy + sy * (j * dy + (i % 2) * dy / 2)


def fade(d, reach):
    t = min(1, d / reach)
    return (1 - t * t * (3 - 2 * t)) ** 1.15


def render(w, h, mode, corner='tr', ground='navy', reach_k=1.04, short=None, flat=False):
    # short: the PIECE's short side when the field is only part of it (a deck panel, a band)
    # flat: no 45-degree light band, each line keeps only its own fade (contact bands)
    short = short or min(w, h); R = short / 12.5; sw = short * 1.6 / 550; reach = reach_k * short
    ink, accent, base_op = TONE[ground]
    cx, cy = (w if 'r' in corner else 0), (h if 'b' in corner else 0)
    sx, sy = (-1 if 'r' in corner else 1), (-1 if 'b' in corner else 1)
    out, seen = [], set()
    cells = sorted(lattice(w, h, R, corner), key=lambda c: hypot(c[0] - cx, c[1] - cy))
    for n, (x, y) in enumerate(cells):
        pts = [(x + R * cos(pi * k / 3), y + R * sin(pi * k / 3)) for k in range(6)]
        f = fade(hypot(x - cx, y - cy), reach)
        if f < .03:
            continue
        if mode == 'facets' and n in FACET_RUN:
            # a short diagonal run of tinted cells near the corner: the "inspected" cells
            op = (.16, .11, .08, .06, .045)[FACET_RUN.index(n)] * (1.3 if ground == 'white' else 1)
            d = 'M' + 'L'.join(f'{a:.2f},{b:.2f}' for a, b in pts) + 'Z'
            out.append(f'<path d="{d}" fill="{accent}" fill-opacity="{op:.3f}"/>')
        for e in range(6):
            a, b = pts[e], pts[(e + 1) % 6]
            if mode == 'dots':
                key = (round(a[0], 1), round(a[1], 1))
                if key in seen:
                    continue
                seen.add(key); fv = fade(hypot(a[0] - cx, a[1] - cy), reach)
                if fv > .03:
                    out.append(f'<circle cx="{a[0]:.2f}" cy="{a[1]:.2f}" r="{sw * 2.1:.2f}" fill="{ink}" fill-opacity="{(base_op * 2.6 * fv):.3f}"/>')
                continue
            mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2; key = (round(mx * 2, 1), round(my * 2, 1))
            if key in seen:
                continue
            seen.add(key); fe = fade(hypot(mx - cx, my - cy), reach)
            if fe < .03:
                continue
            k = .55 if mode == 'facets' else 1     # facets: the lattice steps back behind the tinted run
            d = f'M{a[0]:.2f},{a[1]:.2f}L{b[0]:.2f},{b[1]:.2f}'
            out.append(f'<path d="{d}" stroke="{ink}" stroke-opacity="{base_op * .9 * fe * k:.3f}" stroke-width="{sw:.2f}"/>')
            if ground == 'navy' and not flat:
                out.append(f'<path d="{d}" stroke="url(#light)" stroke-opacity="{fe * k:.3f}" stroke-width="{sw:.2f}"/>')
    u = short / 550; x1, y1 = cx + sx * 430 * u, cy - sy * 60 * u; x2, y2 = cx - sx * 50 * u, cy + sy * 420 * u
    head = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="xMaxYMin slice">'
    if flat:
        return head + f'<g fill="none">{"".join(out)}</g></svg>'
    return (head +
            f'<defs><linearGradient id="light" gradientUnits="userSpaceOnUse" x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}">'
            '<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".05"/>'
            '<stop offset=".55" stop-color="#fff" stop-opacity=".55"/><stop offset=".68" stop-color="#fff" stop-opacity=".05"/>'
            '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'
            f'<g fill="none">{"".join(out)}</g></svg>')


# ponytail: fixed run (cell indices by distance from the corner), tune here if a piece needs a different rhythm
FACET_RUN = [2, 4, 7, 11, 16]

# Every hexagon field the generators ship, relative to studio/. Option A ("lines") only; the posts draw the same
# geometry live in engine/stage.html hexes(). Regenerate after any change here: python3 print/pattern.py --assets
ASSETS = {
    'print/assets/hex-printed-cover.svg': (80, 98, 'lines', 'tr', 'navy', 1.04, 105),   # brochure cover head, 80 x 98 mm
    'print/assets/hex-printed-close.svg': (100, 60, 'lines', 'br', 'navy', 1.04, 105, True),  # contact band and page foot: the cover's cell and stroke, 100 x 60 mm, flat (no light band, no mask)
    # decks: one corner fade per opening (top right) and closing (bottom right), cells R = 1080 / 12.5, fully faded
    # 450 px from the corner so it never reaches a photo or a text column
    'decks/assets/hex-deck-tr.svg': (520, 520, 'lines', 'tr', 'hairline', 0.42, 1080),
    'decks/assets/hex-deck-br.svg': (520, 520, 'lines', 'br', 'hairline', 0.42, 1080),
    'pieces/stationery/assets/hex-card.svg': (85, 55, 'lines', 'tr', 'navy', 1.04, 55),      # business card front
    'pieces/stationery/assets/hex-card-bleed.svg': (91, 61, 'lines', 'tr', 'navy', 1.04, 55),  # the same front with 3 mm bleed (the printed card)
    'pieces/stationery/assets/hex-letter.svg': (110, 120, 'lines', 'tr', 'white', 1.04, 105),  # letterhead corner
    '../guide/public/kit/hex-field-tr.svg': (1000, 1000, 'lines', 'tr', 'navy', 1.04, 1000),  # guide marketing kit: .hexfield (kit.css), sized to its zone short side
    '../guide/public/kit/hex-field-tl.svg': (1000, 1000, 'lines', 'tl', 'navy', 1.04, 1000),
    '../guide/public/kit/hex-field-br.svg': (1000, 1000, 'lines', 'br', 'navy', 1.04, 1000),
    '../guide/public/kit/hex-field-bl.svg': (1000, 1000, 'lines', 'bl', 'navy', 1.04, 1000),
}


def write_assets(check=False, root=None):
    from pathlib import Path
    root = Path(root or Path(__file__).resolve().parents[1])
    # The guide's copies (../guide/…) exist only in the monorepo; an installed plugin checks its own files.
    assets = {p: a for p, a in ASSETS.items() if not p.startswith('../') or (root / p).parent.exists()}
    stale = [p for p, a in assets.items() if not (root / p).exists() or (root / p).read_text() != render(*a)]
    if not check:
        for p in stale:
            (root / p).write_text(render(*ASSETS[p]))
    return stale


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--assets']:
        stale = write_assets('--check' in a)
        print(('stale: ' if '--check' in a else 'rewrote: ') + (', '.join(stale) or 'none'))
        sys.exit(1 if stale and '--check' in a else 0)
    if len(a) < 6:
        sys.exit(__doc__)
    svg = render(float(a[1]), float(a[2]), a[3], a[4], a[5], float(a[6]) if len(a) > 6 else 1.04, float(a[7]) if len(a) > 7 else None)
    open(a[0], 'w').write(svg)
