"""Brand caption plates for films: Inter Medium, white on the ink plate, one plate per line, with the guide's motion.

usage: python3 captions.py "First line|Second line" OUT.png [--width 1920 --height 1080 --band 164]
  Writes a transparent frame-size PNG with the caption centred in the bottom band.
In an edit, call caption_frame(text, t, t_in, t_out) per frame: it applies the enter (500 ms, rising 16 px at 1080p,
cubic-bezier(.16,1,.3,1)) and the leave (180 ms, cubic-bezier(.4,0,1,1)).
"""
import argparse
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT = Path(__file__).resolve().parents[3] / 'print/assets/InterMedium.ttf'
INK = (15, 23, 41)  # #0F1729
WHITE = (255, 255, 255)


def bezier(x1, y1, x2, y2):
    """CSS cubic-bezier easing as a function of progress 0..1."""
    def ease(x):
        lo, hi = 0.0, 1.0
        for _ in range(40):  # solve the curve's x(t) = x by bisection
            t = (lo + hi) / 2
            bx = 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3
            lo, hi = (t, hi) if bx < x else (lo, t)
        t = (lo + hi) / 2
        return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3
    return ease


ENTER, LEAVE = bezier(.16, 1, .3, 1), bezier(.4, 0, 1, 1)


@lru_cache(maxsize=64)
def plate(text, width=1920, height=1080, band=164):
    """The caption at rest: a transparent frame with one ink plate per line, centred in the bottom band."""
    scale = height / 1080
    size = round(40 * scale)
    font = ImageFont.truetype(str(FONT), size)
    lines = text.split('|')
    pad_y, pad_x, gap = round(.15 * size), round(.4 * size), round(6 * scale)
    ascent, descent = font.getmetrics()
    line_h = ascent + descent + 2 * pad_y
    block_h = len(lines) * line_h + (len(lines) - 1) * gap
    top = height - band + (band - block_h) // 2 if band else round(height * .95) - block_h
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for i, line in enumerate(lines):
        w = draw.textlength(line, font=font)
        x0 = round((width - w) / 2) - pad_x
        y0 = top + i * (line_h + gap)
        draw.rectangle([x0, y0, x0 + round(w) + 2 * pad_x, y0 + line_h], fill=INK + (255,))
        draw.text((x0 + pad_x, y0 + pad_y), line, font=font, fill=WHITE + (255,))
    return img


def caption_frame(text, t, t_in, t_out, width=1920, height=1080, band=164):
    """The caption layer at time t (seconds), or None when it is not on screen."""
    if t < t_in or t > t_out:
        return None
    rise = 16 * height / 1080
    if t < t_in + .5:
        p = ENTER((t - t_in) / .5)
        alpha, dy = p, rise * (1 - p)
    elif t > t_out - .18:
        alpha, dy = 1 - LEAVE((t - (t_out - .18)) / .18), 0
    else:
        alpha, dy = 1, 0
    layer = plate(text, width, height, band)
    if dy:
        layer = layer.transform(layer.size, Image.AFFINE, (1, 0, 0, 0, 1, -dy), resample=Image.BILINEAR)
    if alpha < 1:
        a = layer.getchannel('A').point(lambda v: round(v * alpha))
        layer = layer.copy(); layer.putalpha(a)
    return layer


def demo():
    assert abs(ENTER(0)) < 1e-6 and abs(ENTER(1) - 1) < 1e-6, 'easing runs 0 to 1'
    assert ENTER(.5) > .8, 'the enter curve front-loads its motion'
    assert caption_frame('a', 0.9, 1, 3) is None and caption_frame('a', 3.1, 1, 3) is None
    rest = plate('Un clic suffit pour annoter un défaut.')
    box = rest.getbbox()
    assert box and box[3] <= 1080 and box[1] >= 1080 - 164, 'the plate sits in the caption band'
    assert abs((box[0] + box[2]) / 2 - 960) <= 1, 'the plate is centred'


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('text', nargs='?')
    p.add_argument('out', nargs='?')
    p.add_argument('--width', type=int, default=1920)
    p.add_argument('--height', type=int, default=1080)
    p.add_argument('--band', type=int, default=164)
    p.add_argument('--demo', action='store_true')
    a = p.parse_args()
    if a.demo:
        demo(); print('ok')
    else:
        plate(a.text, a.width, a.height, a.band).save(a.out)
