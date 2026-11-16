#!/usr/bin/env python3
"""Rebuilds every marked picture of the LinkedIn kit (pieces/posts/*/assets) from the library renders, so a re-render of
the products (same paths) reaches the posts and carousels with one command (scripts/social-kit.mjs runs this first).

Marks come from the brand overlay renderer (brand/downloads/overlays/overlay.mjs); boxes come from the library's own
overlay specs or from the difference between the OK and the NOK render, never drawn by eye. The pictures are embedded
unchanged in SVG, so no browser is needed here. One chip size everywhere (CHIP px on the 1080 canvas), "OK" or "NOK"
without a count, chip labels in lower case, and every comparison with the reference (OK) on the left or on top
.

    python3 pieces/posts/_build/assets.py          (from the plugin folder)
"""
import base64, io, json, os, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
POSTS = os.path.join(ROOT, 'pieces/posts')
REN = os.path.join(ROOT, 'library/media/3d/renders')
OVERLAY = os.path.join(ROOT, 'brand/downloads/overlays/overlay.mjs')
CALLOUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'callout.mjs')
CHIP = 28  # a chip's 12 px label reads about CHIP px on the 1080 px post
LANGS = ('es', 'en')
NOK = {'result': 'reject', 'text': 'NOK', 'detail': ''}
OK = {'result': 'pass', 'text': 'OK', 'detail': ''}
READ = {'es': ('legible', 'ilegible'), 'en': ('legible', 'illegible')}


def jpeg_uri(im):
    b = io.BytesIO(); im.convert('RGB').save(b, 'JPEG', quality=94)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()


def svg_uri(svg):
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()


def overlay(im, verdict, items, shown):
    """im: PIL image (already cropped); items in its pixels; shown: px it takes across the 1080 canvas."""
    spec = {'image': jpeg_uri(im), 'width': im.width, 'height': im.height, 'tone': 'light',
            'displayWidth': round(shown * 12 / CHIP), 'items': items}
    if verdict: spec['verdict'] = verdict
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f: json.dump(spec, f, ensure_ascii=False)
    try: svg = subprocess.run(['node', OVERLAY, f.name], capture_output=True, text=True, check=True).stdout.strip()
    finally: os.unlink(f.name)
    return {'svg': svg, 'w': im.width, 'h': im.height}


def pair(a, b, side=True):
    """Reference first: a is the OK picture (left, or top), b the NOK one."""
    g = round(0.012 * (a['w'] * 2 if side else a['h'] * 2))
    w, h = (a['w'] + g + b['w'], max(a['h'], b['h'])) if side else (max(a['w'], b['w']), a['h'] + g + b['h'])
    bx, by = (a['w'] + g, 0) if side else (0, a['h'] + g)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="100%" height="100%" fill="#fff"/>'
           f'<image href="{svg_uri(a["svg"])}" width="{a["w"]}" height="{a["h"]}"/><image href="{svg_uri(b["svg"])}" x="{bx}" y="{by}" width="{b["w"]}" height="{b["h"]}"/></svg>')
    return {'svg': svg, 'w': w, 'h': h}


def save(piece, name, o):
    d = os.path.join(POSTS, piece, 'assets'); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, name), 'w').write(o['svg']); return name


def spec(folder, stem, lang):
    return json.load(open(os.path.join(REN, folder, f'{stem}_{lang}.json')))


def subject_crop(im, items, aspect, bleed=1.0, pad=0.05):
    """The crop that fills a slot of `aspect` (w/h) with the product: the box of every
    pixel that differs from the sweep, joined with the marks' boxes, padded 5 %. A row wider than `aspect` x `bleed` is cut at both
    sides, centred on the marks (bleed 1 = never wider than the slot)."""
    a = np.asarray(im.convert('RGB').filter(ImageFilter.GaussianBlur(2)), dtype=np.int16); H, W = a.shape[:2]
    edge = np.concatenate([a[2, :], a[-3, :], a[:, 2], a[:, -3]]); ground = np.median(edge, 0)
    m = np.abs(a - ground).max(2) > 22
    rows, cols = np.where(m.sum(1) > W * 0.01)[0], np.where(m.sum(0) > H * 0.01)[0]
    if not len(rows) or not len(cols): return None
    x0, y0, x1, y1 = cols.min(), rows.min(), cols.max(), rows.max()
    for it in items:
        if 'w' in it: x0, y0, x1, y1 = min(x0, it['x']), min(y0, it['y'] - 40), max(x1, it['x'] + it['w']), max(y1, it['y'] + it['h'])
    px, py = (x1 - x0) * pad, (y1 - y0) * pad; x0, x1, y0, y1 = max(0, x0 - px), min(W, x1 + px), max(0, y0 - py), min(H, y1 + py)
    w, h = x1 - x0, y1 - y0
    # Tight on the product; the slide centres what is left of its band. Only a row far wider than the slot is cut at the sides.
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    if w / h > aspect * bleed:
        w = h * aspect * bleed
        marks = [it for it in items if 'w' in it]
        if marks: cx = sum(it['x'] + it['w'] / 2 for it in marks) / len(marks)
    l = min(max(0, cx - w / 2), W - w); t = min(max(0, cy - h / 2), H - h)
    return tuple(int(round(v)) for v in (l, t, l + w, t + h))


def from_spec(folder, stem, lang, shown, crop=None, chip=None, reads=True, fit=None):
    """A library overlay spec, on its own picture, with the kit's chip size and verdict style. fit=(aspect, bleed): crop to the subject."""
    s = spec(folder, stem, lang); im = Image.open(os.path.join(REN, folder, s['image']))
    if fit and not crop: crop = subject_crop(im, s['items'], *fit)
    x0, y0 = (crop[0], crop[1]) if crop else (0, 0)
    if crop: im = im.crop(crop)
    items = []
    for it in s['items']:
        it = dict(it); it['x'] -= x0; it['y'] -= y0
        # This is a defect sample, not an angular reading exported by the system.
        if stem == 'cans_label-skew': it.pop('value', None)
        if it.get('type') == 'read' and reads:
            it['type'] = 'box'; it.pop('text', None)
            it['label'] = READ[lang][0 if s['verdict']['result'] == 'pass' else 1]
        if chip: it['chip'] = chip
        items.append(it)
    return overlay(im, OK if s['verdict']['result'] == 'pass' else NOK, items, shown)


def diffbox(a, b, fill=False, t=40):
    A = np.asarray(a.convert('RGB').filter(ImageFilter.GaussianBlur(3)), dtype=np.int16)
    B = np.asarray(b.convert('RGB').filter(ImageFilter.GaussianBlur(3)), dtype=np.int16)
    m = np.abs(A - B).max(2) > t
    if fill:  # the headspace that should hold juice: the rows where the two differ across the bottle
        rows = np.where(m.sum(1) > 30)[0]; cols = np.where(m[rows.min():rows.max()].any(0))[0]
        return int(cols.min()), int(rows.min()), int(cols.max()), int(rows.max())
    ys, xs = np.where(m); return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def juice():
    """20, AIS Hopper: lot, cap and fill, each the clean bottle (left) beside the faulty one (right)."""
    # The renders put the cap 100 px under the top edge, where the verdict sits: the sweep's top row is carried up by
    # HEAD px (plain background, nothing added to the bottle) so the verdict never covers the cap or its frame.
    D = os.path.join(REN, 'hopper/det'); HEAD = 90; C = (204, -HEAD, 996, 1200 - HEAD); P = '20-carousel-juice-hopper'
    def cut(im):
        w, h = im.size; t = Image.new('RGB', (w, h + HEAD)); t.paste(im.crop((0, 0, w, 1)).resize((w, HEAD)), (0, 0)); t.paste(im, (0, HEAD))
        return t.crop((C[0], 0, C[2], C[3] - C[1]))
    ok = Image.open(f'{D}/juice_det-ok.jpg').convert('RGB')
    for name, det, lab in [('lot', 'lot-missing', {'es': 'sin lote', 'en': 'no batch code'}),
                           ('tilt', 'tilted-cap', {'es': 'tapón', 'en': 'cap'}),
                           ('fill', 'fill-level', {'es': 'nivel', 'en': 'fill level'})]:
        nok = Image.open(f'{D}/zumo_det-{det}.jpg').convert('RGB'); x0, y0, x1, y1 = diffbox(ok, nok, det == 'fill-level'); p = 14
        for lang in LANGS:
            box = {'type': 'box', 'state': 'defect', 'x': x0 - p - C[0], 'y': y0 - p - C[1], 'w': x1 - x0 + 2 * p, 'h': y1 - y0 + 2 * p, 'label': lab[lang]}
            save(P, f'zumo_{name}-pair_{lang}.svg', pair(overlay(cut(ok), OK, [], 533), overlay(cut(nok), NOK, [box], 533)))


BLEED = {'vial_lineup': 1.0, 'carton_lineup': 1.0, 'cans_lineup': 1.0}  # how far a long row may run off the slide's sides


def subject_crop_of(folder, stem, lang, fit):
    """The OK picture's crop, so the NOK twin beside it is cut the same and the pair stays comparable."""
    s = spec(folder, stem, lang); return subject_crop(Image.open(os.path.join(REN, folder, s['image'])), s['items'], *fit)


def library_sets():
    """21 vials, 22 cans, 23 cartons: the library's own specs. Lineups alone; pairs side by side; code windows stacked."""
    sets = [('21-carousel-vials-pharma', 'rev360-compact-pharma', [(1, 'vial_lineup', None, None, 'below'), (2, 'vial_label-ok', 'vial_label-double', True, None), (3, 'vial_code-ok', 'vial_code-faint', True, 'right')]),
            ('22-carousel-cans-reference', 'rev360-compact', [(1, 'cans_label-ok', 'cans_label-skew', True, 'above', (645, 11, 1205, 914)), (2, 'cans_pair-ok', 'cans_pair-nok', True, None), (3, 'cans_code-ok', 'cans_code-smudged', False, None, (142, 50, 1742, 650))]),
            ('23-carousel-muesli-reference', 'opticais', [(1, 'carton_lineup', None, None, None)])]
    for piece, folder, cfg in sets:
        for lang in LANGS:
            for i, a, b, side, chip, *crop in cfg:
                shown, crop = 533 if side else 1080, crop[0] if crop else None  # crop: the lid closer, at its native pixels
                # the slot's shape on an inner slide (a 1080 x 866 band): one picture 1.25, side by side 0.62 each, stacked 2.5 each
                fit = (1.25, BLEED.get(a, 1.0)) if b is None else (0.62, 1.0) if side else None  # stacked windows keep their framing
                o = from_spec(folder, a, lang, shown, crop=crop, chip=chip, fit=fit)
                if b: o = pair(o, from_spec(folder, b, lang, shown, crop=crop or (fit and subject_crop_of(folder, a, lang, fit)), chip=chip), side)
                save(piece, f'slide-{i + 1}_{lang}.svg', o)


def carton_code():
    """23 slide 3 and post 15: the same code window, reference on top, smeared ink below, at native size (1080 px wide)."""
    O = os.path.join(REN, 'opticais'); crop = (527, 334, 1607, 729)
    for lang in LANGS:
        top = from_spec('opticais', 'carton_code-ok', lang, 1080, crop=crop)
        bad = from_spec('opticais', 'carton_code-smudged', lang, 1080, crop=crop)
        o = pair(top, bad, side=False)
        save('23-carousel-muesli-reference', f'slide-3_{lang}.svg', o)
        save('15-callout-code-legibility', f'code-stack_{lang}.svg', o)


def singles():
    """02 KARIKÓ tray, 06 PHARMA vial: one frame on one picture across the post's band."""
    tray = Image.open(os.path.join(POSTS, '02-kariko/assets/tray_foreign-body_full.jpg'))  # the CAT Alimentación tray, cut to the band
    vial_s = spec('rev360-compact-pharma', 'vial_label-double', 'es'); y0 = 560
    vial = Image.open(os.path.join(REN, 'rev360-compact-pharma', vial_s['image'])).crop((0, y0, 965, y0 + 724))
    for lang in LANGS:
        fb = {'es': 'cuerpo extraño', 'en': 'foreign body'}[lang]
        save('02-kariko', f'tray_foreign-body_{lang}.svg', overlay(tray, NOK, [{'type': 'box', 'state': 'defect', 'chip': 'above', 'label': fb, 'x': 480, 'y': 290, 'w': 330, 'h': 220}], 1080))
        it = dict(spec('rev360-compact-pharma', 'vial_label-double', lang)['items'][0]); it['y'] -= y0
        save('06-rev360-pharma', f'vial_label-double_{lang}.svg', overlay(vial, NOK, [it], 1080))


def wine_callouts(band=(1080, 920)):
    """03 REV 360 STANDARD: the same cava bottle seen from the front and from behind (two of the four views it sees at once),
    with the three inspection points as callouts (callout.mjs, variant A): a square node on the
    part, a horizontal hairline, the labels stacked in the gap between the bottles. Points are measured on the renders."""
    W, H = band[0] * 2, band[1] * 2                      # the picture at 2x the post's pixels
    f, top, bottom, axis = 0.638, 340, 2990, 1080        # frame scale; the bottle's top, foot and axis in the 2160 px frame
    y0 = round(top * f - (H - (bottom - top) * f) / 2)   # the bottle centred in the band's height
    xl, xr = 558, 1602                                   # the two bottle axes on the 2x canvas
    frames = [Image.open(os.path.join(REN, 'rev360-standard-wine', n)).convert('RGB') for n in ('cava_front-ok.jpg', 'cava_back-ok.jpg')]
    frames = [im.resize((round(im.width * f), round(im.height * f)), Image.LANCZOS) for im in frames]
    a, b = (np.asarray(im.crop((round(axis * f) - x, y0, round(axis * f) - x + W, y0 + H))).astype(float) for im, x in zip(frames, (xl, xr)))
    # Each half from its own frame; the floor shadow of the left bottle blends into the right frame over 240 px at the middle.
    m = np.clip((np.arange(W) - (W / 2 - 120)) / 240, 0, 1)[None, :, None]
    pic = Image.fromarray((a * (1 - m) + b * m).round().astype(np.uint8))
    sx = lambda y: round((y * f - y0))                   # a frame row to the canvas row
    words = {'es': ('Cápsula', 'Etiqueta frontal', 'Contraetiqueta'), 'en': ('Capsule', 'Front label', 'Back label')}
    for lang in LANGS:
        cap, front, back = words[lang]
        base = {'width': band[0], 'height': band[1], 'k': 2, 'ground': 'light', 'node': 'square', 'title': 13,
                'image': {'href': jpeg_uri(pic), 'x': 0, 'y': 0, 'w': band[0], 'h': band[1], 'nw': W, 'nh': H}}
        left = dict(base, column={'side': 'right', 'x': 420, 'width': 240},
                    points=[{'x': xl, 'y': sx(WINE_PTS['capsule']), 'title': cap}, {'x': xl, 'y': sx(WINE_PTS['front']), 'title': front}])
        right = dict(base, image=dict(base['image'], hidden=True), column={'side': 'left', 'x': 660, 'width': 240},
                     points=[{'x': xr, 'y': sx(WINE_PTS['back']), 'title': back}])
        parts = []
        for s in (left, right):
            with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as fh: json.dump(s, fh, ensure_ascii=False)
            try: parts.append(subprocess.run(['node', CALLOUT, fh.name], capture_output=True, text=True, check=True).stdout.strip())
            finally: os.unlink(fh.name)
        inner = parts[0][:parts[0].rindex('</svg>')] + parts[1][parts[1].index('>') + 1:]
        save('03-rev360-standard', f'cava_callout_{lang}.svg', {'svg': inner})


# Rows of the three points in the 2160 x 3298 frames (3d/cava.py front-ok and back-ok, finished with 3d/finish.py).
WINE_PTS = {'capsule': 700, 'front': 2150, 'back': 2400}


if __name__ == '__main__':
    juice(); library_sets(); carton_code(); singles(); wine_callouts()
    print('assets rebuilt')
