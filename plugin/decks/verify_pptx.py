"""Compare actual text baselines in the exported PDF and a native PPTX-to-PDF render.

Usage: python3 decks/verify_pptx.py source.pdf libreoffice.pdf report.json
This reads rendered PDFs, not font bounding-box ascenders (which change with subsetting).
"""
import collections
import json
import re
import sys
import unicodedata
from pathlib import Path
import fitz


def normalize(text):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', text)).strip()


def spans(page):
    scale = 1920 / page.rect.width
    return [dict(text=normalize(s['text']), x=s['origin'][0] * scale,
                 y=s['origin'][1] * scale, size=round(s['size'] * scale, 1))
            for b in page.get_text('dict')['blocks'] for line in b.get('lines', [])
            for s in line['spans'] if normalize(s['text'])]


def compare(source, native):
    result = {'tolerance_px': 2, 'slides': [], 'failures': []}
    with fitz.open(source) as a, fitz.open(native) as b:
        if len(a) != len(b):
            result['failures'].append('Page count differs')
        for n, (pa, pb) in enumerate(zip(a, b), 1):
            left, right = spans(pa), spans(pb)
            measured, unmatched = [], []
            for s in left:
                matches = [t for t in right if t['text'] == s['text'] and abs(t['size'] - s['size']) < .1
                           and abs(t['x'] - s['x']) < 8 and abs(t['y'] - s['y']) < 70]
                if not matches:
                    unmatched.append(s)
                    continue
                t = min(matches, key=lambda t: abs(t['y'] - s['y']))
                delta = t['y'] - s['y']
                measured.append(dict(text=s['text'], font_size_px=s['size'], pdf_baseline=s['y'], pptx_baseline=t['y'], delta_px=delta))
                if abs(delta) > 2:
                    result['failures'].append(f"slide {n}: baseline delta {delta:.2f}px: {s['text'][:60]}")
            # A run can split at a font/weight change. Preserve the complete visible text
            # separately instead of accepting missing content as an unmatched run.
            # PDF engines paint SVG numerals and fallback hyphens in different object order.
            # Compare complete word/punctuation inventories, while exact positioned runs
            # above provide the reading-order and baseline evidence.
            text_a = collections.Counter(re.findall(r'\w+|[^\w\s]', normalize(pa.get_text())))
            text_b = collections.Counter(re.findall(r'\w+|[^\w\s]', normalize(pb.get_text())))
            if text_a != text_b:
                result['failures'].append(f'slide {n}: extracted visible text differs')
            if left and len(measured) / len(left) < .8:
                result['failures'].append(f'slide {n}: insufficient baseline pairing ({len(measured)}/{len(left)})')
            result['slides'].append(dict(slide=n, measured=measured, unmatched=unmatched))
    result['status'] = 'pass' if not result['failures'] else 'fail'
    return result


if __name__ == '__main__':
    report = compare(sys.argv[1], sys.argv[2])
    Path(sys.argv[3]).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    count = sum(len(s['measured']) for s in report['slides'])
    print(f"Native PPTX: {report['status']}; {count} baselines, {len(report['failures'])} failures")
    print('\n'.join(report['failures'][:20]))
    raise SystemExit(0 if report['status'] == 'pass' else 1)
