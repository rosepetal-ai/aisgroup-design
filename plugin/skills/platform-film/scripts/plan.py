"""Turn a beat sheet into a cut list for cut.py: captions held long enough to read, app shots cut on the music.
usage: python3 plan.py sheet.json [cut.json]      python3 plan.py --demo

The sheet (paths relative to it):
  {"fps": 25, "width": 1920, "height": 1080, "out": "film.mp4",
   "music": {"file": "track.m4a", "fade": 2.5, "beats": "track.m4a.beats.json"},   # beats.py writes the grid
   "plate": {"render": "plate.png", "screen": {"mask": "...", "corners": "..."}},  # the Panel PC plate for app shots
   "beats": [{"caption": "Une phrase suffit pour annoter chaque élément.", "shots": [...]},
             {"caption": null, "shots": [{"render": "moves/12/plate/", "screen": {...}, "app": {"from": "continue"}}]}]}
A shot is a cut.py shot, plus:
  "plate": true          the app on the plate (merges the sheet's plate);
  "snap": false          keep the exact source window (a moment under a second, boxes that pop before the app moves on);
  "app": {"from": "continue"}   the screen continues where the previous shot's source ended (a pull-out after the app);
  "hold" on a beat       seconds; default characters / 15 + 2 (one line read plus the picture).
Rules (references/edit.md): a beat lasts its caption's hold + 0.5 s; when the picture runs short, its last shot grows
(an app shot to the next music beat, taking more of the recording; a render holds its last frame). Every grown app shot
is listed: look at the source frames it now reaches before you render. A shot that repeats the source of the shot
before it is an error."""
import json, subprocess, sys
from pathlib import Path


def frames(d, fps):
    return round(d * fps) / fps


def probe(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
                                capture_output=True, text=True, check=True).stdout)


def plan(sheet, base, grid=None):
    fps = sheet.get('fps', 25)
    plate = sheet.get('plate')
    grid = grid if grid is not None else (json.load(open(base / sheet['music']['beats']))['beats'] if sheet.get('music', {}).get('beats') else [])
    near = lambda t, after=False: min((b for b in grid if not after or b >= t - 1e-6), key=lambda b: abs(b - t), default=t)
    shots, captions, grown, t = [], [], [], 0.0
    for beat in sheet['beats']:
        t0, sh = t, []
        for s in beat['shots']:
            s = dict(s)
            if s.pop('plate', False):
                s = {**plate, **s}
            snap = s.pop('snap', True)
            if 'dur' not in s:
                s['dur'] = round(probe(base / s['video']) - s.get('from', 0), 2)
            planned = s['dur']
            if snap and 'app' in s and plate and s.get('render') == plate['render'] and grid:
                end = near(t + s['dur'])
                if abs(end - t - s['dur']) <= 0.25 and end - t >= 0.6:
                    s['dur'] = round(end - t, 3)
            s['_planned'] = planned
            t += frames(s['dur'], fps)
            sh.append(s)
        if beat.get('caption'):
            hold = beat.get('hold', round(len(beat['caption'].replace('|', '')) / 15 + 2, 1))
            need = hold + 0.5 - (t - t0)
            if need > 0:
                last = sh[-1]
                grow = (near(t + need, after=True) - t) if 'app' in last and grid else need
                last['dur'] = round(last['dur'] + grow, 3)
                t += frames(grow, fps)
            start = t0 + 0.3 + max(0, (t - t0 - hold - 0.5) / 2)
            captions.append({'text': beat['caption'], 'from': round(start, 2), 'to': round(start + hold, 2)})
        shots += sh
    errors = []
    for i, s in enumerate(shots):
        a = s.get('app', {})
        if a.get('from') == 'continue':
            p = shots[i - 1]
            a['from'] = round(p['app']['from'] + frames(p['dur'], fps), 3)
        if 'video' in a and s['dur'] - s['_planned'] > 0.3:
            grown.append(f"shot {i}: {a['video']} now {a['from']:.2f}-{a['from'] + s['dur']:.2f} s (planned to {a['from'] + s['_planned']:.2f})")
        if i and 'video' in a and shots[i - 1].get('app', {}).get('video') == a['video']:
            p = shots[i - 1]['app']
            if a['from'] < p['from'] + shots[i - 1]['dur'] - 0.05:
                errors.append(f"shot {i} repeats {a['video']} from {a['from']:.2f} s (the shot before ran to {p['from'] + shots[i - 1]['dur']:.2f} s)")
    for s in shots:
        s.pop('_planned')
    cut = {k: sheet[k] for k in ('fps', 'width', 'height', 'out') if k in sheet}
    if sheet.get('music'):
        cut['music'] = {k: v for k, v in sheet['music'].items() if k != 'beats'}
    cut.update(shots=shots, captions=captions)
    return cut, round(t, 2), grown, errors


def demo():
    """Holds, snapping, growth, continuation and the repeat check on a three-beat sheet."""
    P = {'render': 'p.png', 'screen': {'mask': 'm.png', 'corners': 'c.json'}}
    grid = [i * 0.5 for i in range(200)]
    sheet = {'plate': P, 'beats': [
        {'caption': 'x' * 30, 'shots': [{'plate': True, 'app': {'video': 'a.mp4', 'from': 1.0}, 'dur': 2.1}]},  # hold 4.0: grows
        {'caption': None, 'shots': [{'render': 'move/', 'dur': 2.0, 'app': {'video': 'a.mp4', 'from': 'continue'}}]},
        {'caption': 'y' * 15, 'shots': [{'plate': True, 'app': {'video': 'b.mp4', 'from': 0}, 'dur': 0.9, 'snap': False},
                                        {'plate': True, 'app': {'video': 'b.mp4', 'from': 0.5}, 'dur': 3.0}]}]}
    cut, total, grown, errors = plan(sheet, Path('.'), grid)
    s = cut['shots']
    assert abs(s[0]['dur'] - 4.5) < 1e-6, s[0]['dur']            # 2.0 snapped, then grown to the beat at 4.5 s (hold 4 + 0.5)
    assert abs(s[1]['app']['from'] - (1.0 + frames(4.5, 25))) < 1e-6, s[1]['app']  # continues where shot 0's source ended (whole frames)
    assert s[2]['dur'] == 0.9                                    # snap: false keeps its window
    assert len(grown) == 1 and len(errors) == 1, (grown, errors)  # shot 0 grew; shot 3 repeats b.mp4 0.5-0.9
    c0 = cut['captions'][0]
    assert abs(c0['to'] - c0['from'] - 4.0) < 1e-6 and c0['from'] == 0.3
    print('ok', total)


if __name__ == '__main__':
    if sys.argv[1:] == ['--demo']:
        demo(); sys.exit()
    src = Path(sys.argv[1])
    cut, total, grown, errors = plan(json.load(open(src)), src.parent)
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else src.with_name('cut.json')
    json.dump(cut, open(out, 'w'), indent=1, ensure_ascii=False)
    print(f'{total:.2f} s, {len(cut["shots"])} shots, {len(cut["captions"])} captions -> {out}')
    for g in grown: print('  grown, look at its frames:', g)
    for e in errors: print('  error:', e)
    sys.exit(1 if errors else 0)
