#!/usr/bin/env python3
"""Before and after pairs for the guide's Social media page: the earlier marketing kit (before) beside the new render (after),
same piece, same language, same size. A post compares its 4:5 PNG; a carousel its slide sheet. Pieces missing on
either side are skipped (nothing to compare).

    python3 pieces/posts/_build/pairs.py <before kit folder> <after folder: out/social> <pairs folder>

Writes <piece>_<lang>_before.jpg, _after.jpg, _pair.jpg (before left, after right, 40 px apart) and _pairs_sheet_<lang>.jpg.
"""
import glob, os, sys
from PIL import Image

before, after, dest = sys.argv[1:4]
os.makedirs(dest, exist_ok=True)
GAP, sheet = 40, {'es': [], 'en': []}


def find(folder, lang):
    """The piece's carousel sheet, or else its single 4:5 post."""
    for pat in (f'*_{lang}_*_4x5_sheet.png', f'*_{lang}_*_4x5.png'):
        f = sorted(glob.glob(os.path.join(folder, pat)))
        if f: return f[0]


for piece in sorted(os.listdir(after)):
    if not piece[:2].isdigit() or not os.path.isdir(os.path.join(before, piece)): continue
    for lang in sheet:
        a, b = find(os.path.join(before, piece), lang), find(os.path.join(after, piece), lang)
        if not (a and b): continue
        old = Image.open(a).convert('RGB'); new = Image.open(b).convert('RGB')
        if new.size != old.size: new = new.resize(old.size, Image.LANCZOS)
        pair = Image.new('RGB', (old.width * 2 + GAP, old.height), 'white'); pair.paste(old, (0, 0)); pair.paste(new, (old.width + GAP, 0))
        for name, im in (('before', old), ('after', new), ('pair', pair)): im.save(os.path.join(dest, f'{piece}_{lang}_{name}.jpg'), quality=90)
        sheet[lang].append(pair)

for lang, pairs in sheet.items():
    # Posts two pairs to a row, carousels one to a row across both columns.
    if not pairs: continue
    col = 1350; full = col * 2 + GAP; rows, row = [], []
    for p in pairs:
        if p.width / p.height > 4: rows.append([p.resize((full, round(p.height * full / p.width)), Image.LANCZOS)]); continue
        row.append(p.resize((col, round(p.height * col / p.width)), Image.LANCZOS))
        if len(row) == 2: rows.append(row); row = []
    if row: rows.append(row)
    rows.sort(key=lambda r: r[0].width == full)  # posts first, then carousels
    out = Image.new('RGB', (full + 2 * GAP, sum(max(i.height for i in r) for r in rows) + GAP * (len(rows) + 1)), '#F1F5F9'); y = GAP
    for r in rows:
        for k, im in enumerate(r): out.paste(im, (GAP + k * (col + GAP), y))
        y += max(i.height for i in r) + GAP
    out.save(os.path.join(dest, f'_pairs_sheet_{lang}.jpg'), quality=85)
print(f'pairs: {dest}')
