"""Before/after per page: python3 shared/compare.py <before-prefix> <after-prefix> <out-dir> <name>
Prefixes are page PNGs without "-N.png" (e.g. ../rev360-cables-source-rebrand-v4/previews/page and cables/previews/cables.es)."""
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
before, after, out, name = sys.argv[1:5]
os.makedirs(out, exist_ok=True)
font = ImageFont.truetype(os.path.join(os.path.dirname(__file__), 'assets/InterMedium.ttf'), 26)
def pages(prefix):
    fs = glob.glob(prefix + '-*.png')
    return {int(f.rsplit('-', 1)[1].split('.')[0]): f for f in fs}
b, a = pages(before), pages(after)
for n in sorted(set(b) | set(a)):
    ims = []
    for label, src in (('Antes', b.get(n)), ('Ahora', a.get(n))):
        im = Image.open(src).convert('RGB') if src else Image.new('RGB', (909, 1287), '#E2E8F0')
        im = im.resize((909, int(im.height * 909 / im.width)))
        ims.append((label, im))
    h = max(i.height for _, i in ims)
    o = Image.new('RGB', (909 * 2 + 60, h + 70), '#E2E8F0')
    d = ImageDraw.Draw(o)
    for k, (label, im) in enumerate(ims):
        x = 20 + k * (909 + 20)
        d.text((x, 18), f'{label}, página {n}', fill='#0F1729', font=font)
        o.paste(im, (x, 60))
    path = os.path.join(out, f'{name}-p{n}.jpg')
    o.save(path, quality=86)
    print(path)
