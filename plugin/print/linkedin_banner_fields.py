"""LinkedIn-only banner fields from the shared continuous surface in landscape.py.
Visibility is resolved before styling; no opaque cell fills or new geometry cuts.
Thin white edges melt into flat blue through opacity-only horizon and left masks,
with a feathered clearing and a fully clear inner zone for the words and logo.
  python3 linkedin_banner_fields.py [outdir]
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from landscape import cells, VARIANTS, LADDER, WIDTH, f2, round1

SW = 1.15
MESH_SW = 1.15         # preserve the shared geometry and its far-field sampling
LINE_STRENGTH = .85    # approved v3 B: preserve landscape presence
SKY_FADE = .34         # fraction of height over which the horizon melts into blue
INK, GROUND, OP = '#FFFFFF', '#17356E', .72
_CACHE = {}
FEATHER = 28           # px: the softness of the clearing round the words and the logo (Gaussian deviation)
FOG = (.06, .42)      # far fog: fraction of the depth range where the land starts and ends fading
M = 50                # shared motif clearing, retained for other patterns
CLEAR_MARGIN = 64     # approved B outer clearing
SKY_START = .10       # put the gentle start of the fade on the visible crest

def field(W, H, horizon, cell, ppx, keep, variant='rolling', left_fade=None):
    # Opacity masks change visibility only; shared surface and sampled edge paths stay intact.
    # Keep FIELDS stable: the other three LinkedIn motifs use its original composition.
    # These opacity fades belong only to the landscape.
    if left_fade:
        left_fade = (left_fade[0], left_fade[1] - 60)
    out = []
    key = (W, H, horizon, cell, ppx, variant)
    if key not in _CACHE: _CACHE[key] = cells(W, H, MESH_SW, VARIANTS[variant], horizon, cell * W, 0, ppx, worst_facing=True)
    hidden = lambda x, y: (left_fade and x < left_fade[1] - 2 * M) or any(a + 2 * M < x < c - 2 * M and b + 2 * M < y < e - 2 * M for a, b, c, e in keep)
    # Far fog: at banner heights the distant rows pile into a grey mesh band under the horizon; they fade out first.
    ds = [c[0] for c in _CACHE[key]]; d0, d1 = min(ds), max(ds)
    def fog(d):
        t = min(1, max(0, (d - d0 - FOG[0] * (d1 - d0)) / ((FOG[1] - FOG[0]) * (d1 - d0))))
        return 1 - t * t * (3 - 2 * t)
    for depth, step, d, (mx, my), coverage in _CACHE[key]:
        if hidden(mx, my): continue   # fully under the mask: left of the ramp, or deep inside a clearing
        k = OP * LINE_STRENGTH * LADDER[step] * coverage * fog(depth) if step is not None else 0
        if step is not None and k < .001: continue
        out.append(f'<path d="{d}"/>' if step is None else
                   f'<path d="{d}" stroke="{INK}" stroke-opacity="{k:.4f}"' + (f' stroke-width="{f2(SW * WIDTH[step])}"' if step else '') + '/>')
    ramp = ''.join(f'<stop offset="{k / 8:.3f}" stop-color="#FFF" stop-opacity="{(k / 8) ** 2 * (3 - 2 * k / 8):.3f}"/>' for k in range(9))
    x1, x0 = left_fade if left_fade else (0, -1)
    solid = ''.join(f'<rect x="{a - 12}" y="{b - 12}" width="{c - a + 24}" height="{e - b + 24}" rx="12"/>' for a, b, c, e in keep)
    holes = ''.join(f'<rect x="{a - CLEAR_MARGIN}" y="{b - CLEAR_MARGIN}" width="{c - a + 2 * CLEAR_MARGIN}" height="{e - b + 2 * CLEAR_MARGIN}" rx="{M}"/>' for a, b, c, e in keep)
    sky = ''.join(f'<stop offset="{k / 16:.4f}" stop-color="#FFF" stop-opacity="{(k / 16) ** 2 * (3 - 2 * k / 16):.4f}"/>' for k in range(17))
    mask = (f'<defs><linearGradient id="sky" x1="0" y1="{(horizon + SKY_START) * H}" x2="0" y2="{(horizon + SKY_START + SKY_FADE) * H}" gradientUnits="userSpaceOnUse">{sky}</linearGradient>'
            f'<mask id="horizon" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}"><rect width="{W}" height="{H}" fill="url(#sky)"/></mask>'
            f'<linearGradient id="ramp" gradientUnits="userSpaceOnUse" x1="{x0}" y1="0" x2="{x1}" y2="0">{ramp}</linearGradient>'
            f'<filter id="feather" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="{FEATHER}"/></filter>'
            f'<mask id="clear" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}">'
            f'<rect width="{W}" height="{H}" fill="url(#ramp)"/><g fill="#000" filter="url(#feather)">{holes}</g><g fill="#000">{solid}</g></mask></defs>')
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{mask}'
         f'<g mask="url(#horizon)"><g mask="url(#clear)" fill="none" stroke="none" stroke-width="{f2(SW)}" stroke-linejoin="round">{"".join(out)}</g></g></svg>')
    return round1(s)

FIELDS = {
    # company cover: words at x 520, top 40, 58 px (longest line ends by x 1076, glyphs y 35-165); page logo lower left
    'company':  dict(W=1512, H=256, horizon=.30, cell=.075, ppx=.84, keep=[(520, 35, 1076, 165)], left_fade=(760, 330)),
    # profile: words x 664, top 64, 60 px (end by x 1245, glyphs y 59-198); logo x 664-864, y 242-332
    'personal': dict(W=1584, H=396, horizon=.22, cell=.08, ppx=.84, keep=[(664, 59, 1245, 198), (664, 242, 864, 332)], left_fade=(900, 640)),
}

# Measured Chromium bounds in the unchanged kit layout. Each brand gets its own
# clearing so the terrain keeps its presence beside shorter lines and logos.
BANNERS = {'company-ais-vision-systems': [[520, 40, 905.59375, 160.625]],
 'company-ais-group': [[520, 40, 1054.4375, 160.625]],
 'company-rosepetal': [[520, 40, 1077.375, 160.625]],
 'personal-ais-vision-systems': [[664, 64, 1061.609375, 188.78125], [664, 228.953125, 814, 332]],
 'personal-ais-group': [[664, 64, 1214.109375, 188.78125], [664, 241.84375, 784, 332]],
 'personal-rosepetal': [[664, 64, 1239.90625, 188.78125], [664, 294, 864, 332]]}


def banner_field(banner):
    kind = banner.split('-')[0]
    return field(**{**FIELDS[kind], 'keep': BANNERS[banner]})


if __name__ == '__main__':
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else (Path(__file__).resolve().parents[2] / ('guide/public' if (Path(__file__).resolve().parents[2] / 'guide').is_dir() else 'rosepetal-design/public')) / 'kit'
    out.mkdir(parents=True, exist_ok=True)
    for name, kw in FIELDS.items():
        (out / f'linkedin-landscape-{name}.svg').write_text(field(**kw))
    for banner in BANNERS:
        svg = banner_field(banner)
        (out / f'linkedin-landscape-{banner}.svg').write_text(svg)
        print(banner, len(svg))
