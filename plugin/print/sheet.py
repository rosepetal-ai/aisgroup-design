"""Contact sheet of a piece's page previews: python3 shared/sheet.py <dir>/previews/<base> <out.jpg> [cols] [scale]"""
import sys, glob
from PIL import Image
base, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
scale = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
fs = sorted(glob.glob(base + '-*.png'), key=lambda f: int(f.rsplit('-', 1)[1].split('.')[0]))
ims = [Image.open(f).convert('RGB') for f in fs]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
o = Image.new('RGB', (cols * (w + 12), rows * (h + 12)), '#8A94A6')
for k, i in enumerate(ims): o.paste(i, ((k % cols) * (w + 12), (k // cols) * (h + 12)))
o = o.resize((int(o.width * scale), int(o.height * scale)), Image.LANCZOS)
o.save(out, quality=88)
print(out, o.size)
