"""Cut a film from a cut list: rendered shots, app recordings on the rendered screen, brand captions. Writes an H.264 MP4.

usage: python3 cut.py CUT.json
CUT.json:
{
  "fps": 25, "width": 1920, "height": 1080, "out": "film.mp4",
  "music": {"file": "rosepetal_music_quiet-beauty_v01.m4a", "fade": 2.5},
  "shots": [
    {"video": "rosepetal_brand-intro_v01_16x9.mp4"},
    {"render": "shots/01-open/", "dur": 6.0},
    {"render": "plates/app.png", "dur": 5.0,
     "screen": {"mask": "plates/app_screen-mask.png", "corners": "plates/app_corners.json"},
     "app": {"video": "takes/profiler.mkv", "from": 31.9}},
    {"render": "shots/02-push/", "dur": 2.0,
     "screen": {"mask": "shots/02-push-mask/", "corners": "shots/02-push-corners/"},
     "app": {"frames": "monitor/frames/", "from": 17.0}},
    {"video": "rosepetal_end-card_en_v01_16x9.mp4"}
  ],
  "captions": [{"text": "First line|Second line", "from": 0.5, "to": 5.5}]
}
A "render", "mask" or "corners" entry is one file (held) or a folder with one file per output frame, in name order.
A "video" shot plays a file whole (the published brand intro and end card, unchanged), or for "dur" seconds.
A "video" or folder "render" shot may start "from" seconds in (an insert trimmed to its action); its screen folders follow.
"music" lays one track from the film's start, fading out over its last "fade" seconds, levelled to -14 LUFS, -1 dBTP.
An app source is a video ("video", any rate, resampled to the film's) or a folder of frames already at the film's
rate ("frames", one file per output frame), from a time in seconds.
A corners file flagged "corners_behind_camera" leaves that frame's screen as rendered.
A "screen" may set "transmission" (default 0.93, the Panel PC glass; 1 for a flat layout with the app on black).
Caption times are on the film's timeline. Paths are relative to the cut list.
Each shot is rendered once into `.cut-cache/` next to the cut list, keyed by its spec, its sources' dates and this
code; a re-cut renders only the shots that changed, then lays the captions and the music over the whole film.
"""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from captions import caption_frame  # noqa: E402
from screen_composite import composite, load  # noqa: E402


def sequence(path, n, start=0):
    """n paths: one file repeated, or a folder's files in name order from file `start` (the last held if short)."""
    p = Path(path)
    files = sorted(f for f in p.iterdir() if f.is_file()) if p.is_dir() else [p]
    return [files[min(start + i, len(files) - 1)] for i in range(n)]


def video_frames(path, start, n, fps, max_width):
    """Frame i of a video from start seconds, at the film's rate, as a float BGR image.
    Streamed one frame at a time and shrunk to max_width by ffmpeg: a 2880 px take held whole fills memory.
    Frames are asked for in order; past the end the last frame holds."""
    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                            '-of', 'csv=p=0', str(path)], capture_output=True, text=True, check=True).stdout
    w, h = map(int, probe.strip().split(','))
    if w > max_width:
        w, h = max_width, round(h * max_width / w / 2) * 2
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{start}', '-i', str(path), '-frames:v', str(n),
                            '-vf', f'fps={fps},scale={w}:{h}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'],
                           stdout=subprocess.PIPE)
    state = {'i': -1, 'frame': None}

    def get(i):
        while state['i'] < i:
            raw = dec.stdout.read(w * h * 3)
            if len(raw) < w * h * 3:
                if state['frame'] is None:
                    raise SystemExit(f'no frames from {path} at {start}s')
                break
            state['i'] += 1
            state['frame'] = np.frombuffer(raw, np.uint8).reshape(h, w, 3)
        return state['frame'].astype(np.float32) / 255
    return get


def app_frames(app, base, n, fps, max_width):
    if 'video' in app:
        return video_frames(base / app['video'], app.get('from', 0), n, fps, max_width)
    files = sorted(f for f in (base / app['frames']).iterdir() if f.is_file())
    first = round(app.get('from', 0) * fps)
    return lambda i: load(str(files[min(first + i, len(files) - 1)]))


def encoder(path, w, h, fps, quality):
    """An ffmpeg pipe that takes BGR frames: a near-lossless intermediate, or the final film."""
    x264 = ['-preset', 'veryfast', '-crf', '8', '-pix_fmt', 'yuv444p'] if quality == 'cache' else \
           ['-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{w}x{h}',
                             '-r', str(fps), '-i', '-', '-c:v', 'libx264', *x264, str(path)], stdin=subprocess.PIPE)


CODE = hashlib.sha1(b''.join((Path(__file__).parent / f).read_bytes() for f in ('cut.py', 'screen_composite.py'))).hexdigest()


def shot_key(shot, base, fps, w, h):
    """Changes when the shot's spec, any of its sources (date, size, file count) or the rendering code changes."""
    k = hashlib.sha1(json.dumps([shot, fps, w, h, CODE], sort_keys=True).encode())
    s, a = shot.get('screen') or {}, shot.get('app') or {}
    for rel in filter(None, (shot.get('render'), shot.get('video'), s.get('mask'), s.get('corners'), a.get('video'), a.get('frames'))):
        q = base / rel
        st = q.stat()
        k.update(f'{rel}:{st.st_mtime_ns}:{st.st_size}:{len(list(q.iterdir())) if q.is_dir() else 0}'.encode())
    return k.hexdigest()[:20]


def render_shot(shot, base, fps, w, h, path):
    """One shot, without captions, to an intermediate file; returns its frame count."""
    if 'video' in shot:
        src = base / shot['video']
        n = round(shot.get('dur', duration(src) - shot.get('from', 0)) * fps)
        clip = video_frames(src, shot.get('from', 0), n, fps, w)
        renders, screen = [None] * n, None
    else:
        n = round(shot['dur'] * fps)
        first = round(shot.get('from', 0) * fps)
        renders = sequence(base / shot['render'], n, first)
        screen = shot.get('screen')
    if screen:
        masks = sequence(base / screen['mask'], n, first)
        corners = sequence(base / screen['corners'], n, first)
        app = app_frames(shot['app'], base, n, fps, w)
    tmp = path.with_suffix('.part.mkv')
    enc = encoder(tmp, w, h, fps, 'cache')
    for i in range(n):
        frame = clip(i) if renders[i] is None else load(str(renders[i]))
        if screen:
            c = json.loads(corners[i].read_text())
            if not c.get('corners_behind_camera'):
                frame = composite(frame, load(str(masks[i])), c, app(i), screen.get('transmission', 0.93))
        if frame.shape[:2] != (h, w):
            frame = cv2.resize(frame, (w, h), interpolation=cv2.INTER_AREA)
        enc.stdin.write(np.clip(frame * 255 + .5, 0, 255).astype(np.uint8).tobytes())
    enc.stdin.close()
    if enc.wait():
        raise SystemExit(f'ffmpeg failed on {shot}')
    tmp.replace(path)
    return n


def cut(spec, base):
    fps, w, h = spec.get('fps', 25), spec.get('width', 1920), spec.get('height', 1080)
    out = base / spec.get('out', 'film.mp4')
    cache = base / '.cut-cache'
    cache.mkdir(exist_ok=True)
    segments, made = [], 0
    for shot in spec['shots']:
        seg = cache / f'{shot_key(shot, base, fps, w, h)}.mkv'
        if not seg.exists():
            render_shot(shot, base, fps, w, h, seg); made += 1
        segments.append(seg)
    print(f'{made} of {len(segments)} shots rendered, {len(segments) - made} from the cache', file=sys.stderr)
    (cache / 'list.txt').write_text(''.join(f"file '{s.name}'\n" for s in segments))
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(cache / 'list.txt'),
                            '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
    enc = encoder(out, w, h, fps, 'film')
    captions, size, i = spec.get('captions', []), w * h * 3, 0
    while True:
        raw = dec.stdout.read(size)
        if len(raw) < size:
            break
        t = i / fps
        layers = [l for c in captions if (l := caption_frame(c['text'], t, c['from'], c['to'], w, h)) is not None]
        if layers:
            frame = np.frombuffer(raw, np.uint8).reshape(h, w, 3).astype(np.float32) / 255
            for layer in layers:
                a = np.asarray(layer, np.float32) / 255
                frame = frame * (1 - a[..., 3:]) + a[..., 2::-1] * a[..., 3:]  # RGBA over BGR
            raw = np.clip(frame * 255 + .5, 0, 255).astype(np.uint8).tobytes()
        enc.stdin.write(raw)
        i += 1
    enc.stdin.close()
    if enc.wait() or dec.wait():
        raise SystemExit('ffmpeg failed')
    t0 = i / fps
    if spec.get('music'):
        add_music(out, base / spec['music']['file'], t0, spec['music'].get('fade', 2.5))
    return out, t0


def duration(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
                                capture_output=True, text=True, check=True).stdout)


def add_music(film, track, length, fade):
    """Lay the track under the film from 0 s, fading out over the last `fade` s, at -14 LUFS integrated and -1 dBTP.
    Two passes: measure, then a linear gain. One-pass loudnorm missed by 1.3 LU on a 128 s film (11-25)."""
    tmp = film.with_suffix('.music.mp4')
    pre = f'aresample=48000,atrim=0:{length:.3f},afade=t=out:st={max(0, length - fade):.3f}:d={fade}'
    target = 'loudnorm=I=-14:TP=-1:LRA=11'
    log = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(track), '-af', f'{pre},{target}:print_format=json',
                          '-f', 'null', '-'], capture_output=True, text=True, check=True).stderr
    m = json.loads(log[log.rindex('{'):log.rindex('}') + 1])
    chain = (f'[1:a]{pre},{target}:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:measured_LRA={m["input_lra"]}'
             f':measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:linear=true,aresample=48000[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(film), '-i', str(track), '-filter_complex', chain,
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-shortest',
                    '-movflags', '+faststart', str(tmp)], check=True)
    tmp.replace(film)


def demo():
    """Self-check: a held picture, a video shot and music make a 2 s film with sound at -14 LUFS (within 0.5)."""
    import re
    import tempfile
    d = Path(tempfile.mkdtemp())
    Image.new('RGB', (320, 180), (23, 53, 110)).save(d / 'card.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'testsrc=size=320x180:rate=25:duration=1', str(d / 'clip.mp4')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=5', '-c:a', 'aac', str(d / 'm.m4a')], check=True)
    out, dur = cut({'width': 320, 'height': 180, 'shots': [{'render': 'card.png', 'dur': 1.0}, {'video': 'clip.mp4', 'from': 0.5},
                                                            {'video': 'clip.mp4', 'from': 0.5, 'dur': 0.5}],
                    'music': {'file': 'm.m4a', 'fade': 0.5}}, d)
    assert abs(dur - 2.0) < 0.05 and abs(duration(out) - 2.0) < 0.1, dur
    log = subprocess.run(['ffmpeg', '-nostats', '-i', str(out), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    lufs = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', log)[-1])
    assert -14.5 < lufs < -13.5, lufs
    before = {f.name for f in (d / '.cut-cache').glob('*.mkv')}
    out, dur2 = cut({'width': 320, 'height': 180, 'shots': [{'render': 'card.png', 'dur': 1.0}, {'video': 'clip.mp4', 'from': 0.5},
                                                            {'video': 'clip.mp4', 'from': 0.5, 'dur': 0.4}]}, d)
    after = {f.name for f in (d / '.cut-cache').glob('*.mkv')}
    assert len(after - before) == 1 and abs(dur2 - 1.9) < 0.05, (after - before, dur2)  # only the changed shot re-renders


if __name__ == '__main__':
    if sys.argv[1:] == ['--demo']:
        demo(); print('ok'); sys.exit()
    path = Path(sys.argv[1]).resolve()
    out, dur = cut(json.loads(path.read_text()), path.parent)
    print(f'{out} ({dur:.2f} s)')
