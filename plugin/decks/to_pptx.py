"""Editable PowerPoint from the measured HTML layout (build/layout.json).

Every headline, paragraph and label is a real text box in Inter, every picture keeps its full file with a crop
(so sales can re-crop it in PowerPoint), rules and panels are shapes. Icons, logos and the hexagon pattern are
PNGs at 3x. Slide size 13.333 x 7.5 in; 1 px of the 1920 px canvas = 6350 EMU = 0.5 pt.
Usage: python -I to_pptx.py build/layout.json out.pptx
"""
import json
import os
import sys

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Pt

EMU = 6350
# Inter first-baseline differences measured against the PDF across the six decks
# in the native LibreOffice render, in 1920px deck units. Preserve line spacing.
BASELINE_DELTA = {22: 3.49, 28: 3.32, 38: 4.34, 44: 5.15, 76: -1.20, 120: -5.06, 240: -15.03}
FONTS = {400: 'Inter', 500: 'Inter Medium', 600: 'Inter SemiBold'}


def E(v):
    return Emu(int(round(v * EMU)))


def add_rect(slide, it):
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, E(it['x']), E(it['y']), E(max(it['w'], 0.5)), E(max(it['h'], 0.5)))
    shp.fill.solid()
    shp.fill.fore_color.rgb = RGBColor.from_string(it['fill'].upper())
    if it.get('alpha', 1) < 0.999:
        sf = shp.fill._xPr.find(qn('a:solidFill'))
        clr = sf[0]
        a = clr.makeelement(qn('a:alpha'), {'val': str(int(it['alpha'] * 100000))})
        clr.append(a)
    shp.line.fill.background()
    shp.shadow.inherit = False
    # LibreOffice also follows the theme reference despite an empty effectLst.
    # Explicitly disable theme effects so flat HTML panels and rules stay flat.
    shp._element.find(qn('p:style')).find(qn('a:effectRef')).set('idx', '0')
    return shp


def add_text(slide, it):
    # A little extra width absorbs small metric differences between Chromium and Office; alignment is kept.
    # Left-aligned text gets its measured line width (balanced headlines break in the same places in Office).
    base_w = it['w'] if it['align'] in ('right', 'end', 'center') else min(it['w'], it.get('tw', it['w']))
    extra = base_w * 0.03 + 6
    x, w = it['x'], base_w + extra
    if it['align'] in ('right', 'end'):
        x -= extra
    elif it['align'] == 'center':
        x -= extra / 2
    tb = slide.shapes.add_textbox(E(x), E(it['y'] - BASELINE_DELTA.get(round(it['size']), 0)), E(w), E(it['h']))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.TOP
    # Collapse runs into paragraphs at hard breaks.
    paras = [[]]
    for r in it['runs']:
        parts = r['t'].split('\n')
        for i, part in enumerate(parts):
            if i:
                paras.append([])
            if part:
                paras[-1].append({'t': part, 'b': r['b']})
    # Trim edge whitespace per paragraph.
    for p in paras:
        if p:
            p[0]['t'] = p[0]['t'].lstrip()
            p[-1]['t'] = p[-1]['t'].rstrip()
    for i, runs in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = {'right': PP_ALIGN.RIGHT, 'end': PP_ALIGN.RIGHT, 'center': PP_ALIGN.CENTER}.get(it['align'], PP_ALIGN.LEFT)
        para.line_spacing = Pt(it['lh'] * 0.5)
        para.space_before = para.space_after = Pt(0)
        for r in runs or [{'t': '', 'b': False}]:
            run = para.add_run()
            run.text = r['t']
            f = run.font
            weight = 500 if r['b'] and it['weight'] < 500 else it['weight']
            f.name = FONTS.get(weight, 'Inter')
            f.size = Pt(it['size'] * 0.5)
            f.color.rgb = RGBColor.from_string(it['color'].upper())
            rpr = run._r.get_or_add_rPr()
            if it.get('ls'):
                rpr.set('spc', str(int(round(it['ls'] * 0.5 * 100))))
            # Same family for East Asian and complex scripts, so Office does not substitute.
            for tag in ('a:latin', 'a:ea', 'a:cs'):
                el = rpr.find(qn(tag))
                if el is None:
                    el = rpr.makeelement(qn(tag), {})
                    rpr.append(el)
                el.set('typeface', f.name)
    return tb


def clean_pic(pic, alt=''):
    # python-pptx writes the source file name as alt text; never expose working file names.
    nv = pic._element.find('.//' + qn('p:cNvPr'))
    if nv is not None:
        nv.set('descr', alt or '')
        nv.set('name', 'Imagen %s' % nv.get('id', ''))
    return pic


def add_img(slide, it, base, tmp):
    src = os.path.join(base, it['src'])
    nw, nh = it['nw'], it['nh']
    # First resolve object-fit in the original CSS image box, then clip that result.
    # A box can run past the slide edge; fitting to the smaller visible clip box
    # would re-centre the photograph and lose content that the PDF shows.
    sc = (min if it['fit'] == 'contain' else max)(it['w'] / nw, it['h'] / nh)
    dw, dh = nw * sc, nh * sc
    ox = it['x'] + (it['w'] - dw) * it['pos'][0]
    oy = it['y'] + (it['h'] - dh) * it['pos'][1]
    clip = it['clip']
    cx, cy = max(clip['x'], ox), max(clip['y'], oy)
    right = min(clip['x'] + clip['w'], ox + dw)
    bottom = min(clip['y'] + clip['h'], oy + dh)
    cw, ch = right - cx, bottom - cy
    if cw <= 0 or ch <= 0:
        return None
    pic = slide.shapes.add_picture(light_copy(src, dw, dh, tmp), E(cx), E(cy), E(cw), E(ch))
    pic.crop_left = (cx - ox) / dw
    pic.crop_right = (ox + dw - right) / dw
    pic.crop_top = (cy - oy) / dh
    pic.crop_bottom = (oy + dh - bottom) / dh
    return clean_pic(pic, it.get('alt', ''))


def light_copy(src, dw, dh, tmp):
    """Keep pictures at most 2x their shown size so the file stays light; never enlarge."""
    im = Image.open(src)
    W, H = im.size
    k = min(1.0, 2 * dw / W, 2 * dh / H) if dw and dh else 1.0
    native = os.path.splitext(src)[1].lower() in ('.jpg', '.jpeg', '.png')
    if k > 0.9 and native:
        return src
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    im = im.resize((max(1, int(W * k)), max(1, int(H * k))), Image.LANCZOS)
    os.makedirs(tmp, exist_ok=True)
    out = os.path.join(tmp, os.path.splitext(os.path.basename(src))[0] + ('.png' if im.mode == 'RGBA' else '.jpg'))
    im.save(out, quality=90) if im.mode == 'RGB' else im.save(out)
    return out


def main(layout_path, out_path):
    base = os.path.dirname(os.path.dirname(os.path.abspath(layout_path)))
    data = json.load(open(layout_path))
    prs = Presentation()
    prs.slide_width = Emu(1920 * EMU)
    prs.slide_height = Emu(1080 * EMU)
    blank = prs.slide_layouts[6]
    tmp = os.path.join(base, 'build', 'pptx-media')
    meta = data['meta']
    prs.core_properties.title = meta.get('title', '')
    prs.core_properties.author = 'AIS Vision Systems'
    prs.core_properties.comments = ''
    prs.core_properties.keywords = ''
    prs.core_properties.last_modified_by = 'AIS Vision Systems'
    prs.core_properties.revision = 1
    import datetime
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0, tzinfo=None)
    prs.core_properties.created = now
    prs.core_properties.modified = now
    # The company field (app.xml) is empty in python-pptx's default package.
    from pptx.opc.constants import RELATIONSHIP_TYPE as RT
    import re
    app = prs.part.package.part_related_by(RT.EXTENDED_PROPERTIES)
    app._blob = re.sub(rb'<Company>[^<]*</Company>|<Company/>', b'<Company>AIS Vision Systems</Company>', app.blob)
    for sl in data['slides']:
        slide = prs.slides.add_slide(blank)
        bg = slide.background.fill
        bg.solid()
        bg.fore_color.rgb = RGBColor.from_string(sl['bg'].upper())
        for it in sl['items']:
            k = it['k']
            if k == 'rect':
                add_rect(slide, it)
            elif k == 'text':
                if any(r['t'].strip() for r in it['runs']):
                    add_text(slide, it)
            elif k == 'img':
                add_img(slide, it, base, tmp)
            elif k == 'vec':
                p = slide.shapes.add_picture(os.path.join(base, it['png']), E(it['x']), E(it['y']), E(it['w']), E(it['h']))
                clean_pic(p)
                if it.get('opacity', 1) < 0.999:
                    blip = p._element.find('.//' + qn('a:blip'))
                    blip.append(blip.makeelement(qn('a:alphaModFix'), {'amt': str(int(it['opacity'] * 100000))}))
        if sl.get('notes'):
            slide.notes_slide.notes_text_frame.text = sl['notes']
    prs.save(out_path)
    print('pptx', out_path, len(data['slides']), 'slides')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
