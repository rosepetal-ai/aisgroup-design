"""Contact sheet of a deck's slide PNGs: python3 sheet.py <deck dir> <out.jpg> [cols] [width]"""
import glob, os, sys
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
w = int(sys.argv[4]) if len(sys.argv) > 4 else 560
fs = sorted(glob.glob(os.path.join(d, 'slides', '*.png')))
h = w * 9 // 16
rows = (len(fs) + cols - 1) // cols
sh = Image.new('RGB', (cols * (w + 16) + 16, rows * (h + 40) + 16), '#E2E8F0')
dr = ImageDraw.Draw(sh)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS)
    x, y = 16 + (i % cols) * (w + 16), 16 + (i // cols) * (h + 40)
    sh.paste(im, (x, y + 24))
    dr.text((x, y + 4), os.path.basename(f), fill='#0F1729')
sh.save(out, quality=86)
print(out, sh.size)
