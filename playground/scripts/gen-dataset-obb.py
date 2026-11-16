# Builds dataset_obb.png from dataset_obj.png: same triangle and pentagon (cut from the original),
# each with its box rotated as an oriented bounding box. Drawn at 4x and downsampled for clean edges.
import math, sys
from PIL import Image, ImageDraw, ImageChops, ImageFilter
src, out = sys.argv[1], sys.argv[2]
K = 4
im = Image.open(src).convert('RGBA')
RED, BLUE = (205, 40, 79, 255), (23, 53, 110, 255)

def shape(box, want_blue):
    """Pixels of one colour inside `box`, the rest transparent."""
    crop = im.crop(box)
    px = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, a = px[x, y]
            if (b > r) != want_blue:
                px[x, y] = (0, 0, 0, 0)
    return crop.resize((crop.width * K, crop.height * K), Image.BICUBIC)

def rect(cx, cy, w, h, ang):
    a = math.radians(ang); c, s = math.cos(a), math.sin(a)
    return [(cx + x * c - y * s, cy + x * s + y * c) for x, y in ((-w/2, -h/2), (w/2, -h/2), (w/2, h/2), (-w/2, h/2))]

def outline(size, cx, cy, w, h, ang, stroke, colour):
    layer = Image.new('RGBA', size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    d.polygon(rect(cx, cy, w, h, ang), fill=colour)
    d.polygon(rect(cx, cy, w - 2 * stroke, h - 2 * stroke, ang), fill=(0, 0, 0, 0))
    return layer

def paste_rotated(canvas, sprite, centre, ang):
    rot = sprite.rotate(-ang, resample=Image.BICUBIC, expand=True)
    canvas.alpha_composite(rot, (round(centre[0] - rot.width / 2), round(centre[1] - rot.height / 2)))

W = 700 * K; size = (W, W)
# Boxes of the original (outer edge, 700 px): red 143–392 × 237–509, blue 364–571 × 289–481, strokes ≈ 12–13.
red_c, red_wh, red_ang = ((143 + 392) / 2 - 6, (237 + 509) / 2), (249, 272), -12
blue_c, blue_wh, blue_ang = ((364 + 571) / 2 + 14, (289 + 481) / 2 + 4), (207, 192), 12
stroke = 8.5

tri = shape((160, 270, 362, 470), want_blue=True)          # triangle, centre of its crop = its own centre
pen = shape((395, 300, 548, 470), want_blue=False)        # pentagon
tri_c = ((160 + 362) / 2, (270 + 470) / 2); pen_c = ((395 + 548) / 2, (300 + 470) / 2)

def moved(p, c0, c1, ang):
    """Where point p (rotating with the box centred at c0) lands once that box is at c1, turned by ang."""
    a = math.radians(ang); dx, dy = p[0] - c0[0], p[1] - c0[1]
    return (c1[0] + dx * math.cos(a) - dy * math.sin(a), c1[1] + dx * math.sin(a) + dy * math.cos(a))

red0 = ((143 + 392) / 2, (237 + 509) / 2); blue0 = ((364 + 571) / 2, (289 + 481) / 2)
canvas = Image.new('RGBA', size, (0, 0, 0, 0))
# Red group: box + triangle
red_layer = outline(size, red_c[0] * K, red_c[1] * K, red_wh[0] * K, red_wh[1] * K, red_ang, stroke * K, RED)
paste_rotated(red_layer, tri, [v * K for v in moved(tri_c, red0, red_c, red_ang)], red_ang)
# Blue box cuts a small gap where it crosses the red one (as in the original)
blue_box = outline(size, blue_c[0] * K, blue_c[1] * K, blue_wh[0] * K, blue_wh[1] * K, blue_ang, stroke * K, BLUE)
halo = blue_box.getchannel('A').filter(ImageFilter.MaxFilter(4 * K + 1))
red_layer.putalpha(ImageChops.subtract(red_layer.getchannel('A'), halo))
canvas.alpha_composite(red_layer)
canvas.alpha_composite(blue_box)
paste_rotated(canvas, pen, [v * K for v in moved(pen_c, blue0, blue_c, blue_ang)], blue_ang)
# Same visual centre as the original
l, t, r, b = canvas.getbbox()
cx, cy = (143 + 571) / 2 * K, (237 + 509) / 2 * K
canvas = ImageChops.offset(canvas, round(cx - (l + r) / 2), round(cy - (t + b) / 2))
canvas.resize((700, 700), Image.LANCZOS).save(out, optimize=True)
