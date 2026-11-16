#!/usr/bin/env python3
"""Print boxes for the card PDFs: the page is trim + 3 mm bleed; set TrimBox and BleedBox so a printer sees the trim."""
import sys, fitz
from pathlib import Path
K = Path(__file__).resolve().parents[1]
MM = 72 / 25.4
for f in sys.argv[1:] or ['business-cards/laura-martin.pdf', 'business-cards/marc-puig.pdf']:
    p = K / f
    d = fitz.open(p)
    for pg in d:
        r = pg.mediabox
        pg.set_bleedbox(r)
        pg.set_trimbox(fitz.Rect(r.x0 + 3 * MM, r.y0 + 3 * MM, r.x1 - 3 * MM, r.y1 - 3 * MM))
    d.save(str(p) + '.tmp', garbage=3, deflate=True)
    d.close()
    Path(str(p) + '.tmp').replace(p)
    print(f, 'trim 85 x 55 mm, bleed 3 mm')
