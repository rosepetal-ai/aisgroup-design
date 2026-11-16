"""Bounded, read-only source inspection. Derivatives are for model review, never artwork.

Only local PNG/JPEG/WebP and MP4 sources are accepted by the parent MCP. No network
protocols, arbitrary filters, transcription, verdicts or source-file changes.
"""
import ctypes
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import signal
import subprocess
import sys
import warnings

STUDIO = Path(__file__).resolve().parents[1]
# library/media is usually a link to the user's synced folder; AIS_INBOX holds pictures pasted into a request.
ROOTS = [STUDIO / 'library', STUDIO / 'library' / 'media', STUDIO / 'work', STUDIO / 'brand'] + ([Path(os.environ['AIS_INBOX'])] if os.environ.get('AIS_INBOX') else [])
MAX_PIXELS = 16_000_000
MAX_BYTES = 96 * 1024
# The shared supervisor: resource readings, lock, priority and owned-process cleanup on every OS.
_spec = importlib.util.spec_from_file_location('guard', STUDIO / 'skills/_shared/scripts/safe_render.py')
guard = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(guard)


def sha(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda: f.read(1024 * 1024), b''):
            h.update(b)
    return h.hexdigest()


def checked_source(spec):
    p = Path(spec['path']).resolve(strict=True)
    if not p.is_file() or not any(p.is_relative_to(r.resolve()) for r in ROOTS):
        raise ValueError('Source outside media roots')
    if p.stat().st_size > 256 * 1024 * 1024:
        raise ValueError('Source exceeds byte limit')
    with p.open('rb') as f:
        head = f.read(32)
    valid = {'image/png': head.startswith(b'\x89PNG\r\n\x1a\n'),
             'image/jpeg': head.startswith(b'\xff\xd8\xff'),
             'image/webp': head[:4] == b'RIFF' and head[8:12] == b'WEBP',
             'video/mp4': head[4:8] == b'ftyp'}
    if not valid.get(spec['mime']):
        raise ValueError('Source signature mismatch')
    return p


def peak_mib():
    """(worker, largest waited child) RSS high-water marks in MiB. Windows only knows the worker's."""
    try:
        import resource
    except ImportError:
        return guard.psutil.Process().memory_info().peak_wset / 1024**2, None
    scale = 1024**2 if sys.platform == 'darwin' else 1024  # ru_maxrss: bytes on macOS, KiB on Linux
    return (resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / scale,
            resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss / scale)


def run_worker(spec):
    from PIL import Image, ImageOps
    Image.MAX_IMAGE_PIXELS = MAX_PIXELS
    warnings.simplefilter('error', Image.DecompressionBombWarning)
    p = checked_source(spec)
    before = p.stat()
    out = Path(spec['output'])
    meta = {'mime': spec['mime'], 'bytes': before.st_size}
    if spec['mime'] == 'video/mp4':
        probe = subprocess.run(['ffprobe', '-v', 'error', '-protocol_whitelist', 'file,pipe',
            '-select_streams', 'v:0', '-show_entries',
            'stream=codec_name,width,height,avg_frame_rate,duration,start_time:format=duration',
            '-of', 'json', str(p)], stdin=subprocess.DEVNULL, capture_output=True, timeout=8, check=True)
        data = json.loads(probe.stdout)
        streams = data.get('streams', [])
        if len(streams) != 1:
            raise ValueError('Exactly one selected video stream is required')
        v = streams[0]
        duration = float(v.get('duration', data.get('format', {}).get('duration', 0)))
        w, h = int(v['width']), int(v['height'])
        if not math.isfinite(duration) or duration <= 0 or not 0 < w * h <= MAX_PIXELS:
            raise ValueError('Unsupported duration or frame dimensions')
        meta.update(width=w, height=h, durationSeconds=duration, frameRate=v.get('avg_frame_rate'), codec=v.get('codec_name'))
        if spec['action'] == 'preview':
            second = spec.get('seconds', 0)
            if second is None:
                second = 0
            if not math.isfinite(second) or not 0 <= second < duration:
                raise ValueError('Preview timestamp lies outside the source video')
            extracted = out / 'frame.jpg'
            subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-nostdin',
                '-protocol_whitelist', 'file,pipe', '-threads', '1', '-ss', str(second), '-i', str(p),
                '-map', '0:v:0', '-an', '-sn', '-dn', '-vf', 'scale=960:960:force_original_aspect_ratio=decrease',
                '-frames:v', '1', '-threads', '1', '-q:v', '3', '-y', str(extracted)],
                stdin=subprocess.DEVNULL, capture_output=True, timeout=12, check=True)
            image = Image.open(extracted)
            meta['requestedSeconds'] = second
    else:
        if before.st_size > 32 * 1024 * 1024:
            raise ValueError('Raster source exceeds 32 MiB inspection limit')
        image = Image.open(p)
        w, h = image.size
        if not 0 < w * h <= MAX_PIXELS or getattr(image, 'n_frames', 1) != 1:
            raise ValueError('Only a static raster up to 16 MP is supported')
        meta.update(width=w, height=h, hasAlpha=('A' in image.getbands() or 'transparency' in image.info))
    result = {'state': 'inspected', 'metadata': meta}
    if spec['action'] == 'preview':
        image = ImageOps.exif_transpose(image)
        alpha = 'A' in image.getbands() or 'transparency' in image.info
        image = image.convert('RGBA' if alpha else 'RGB')
        image.thumbnail((960, 960), Image.Resampling.LANCZOS)
        dest = out / ('preview.png' if alpha else 'preview.jpg')
        for n in range(6):
            if alpha:
                image.save(dest, 'PNG', optimize=False)
            else:
                image.save(dest, 'JPEG', quality=82 - min(n, 3) * 8)
            if dest.stat().st_size <= MAX_BYTES:
                break
            image.thumbnail((max(1, int(image.width * .8)), max(1, int(image.height * .8))), Image.Resampling.LANCZOS)
        if dest.stat().st_size > MAX_BYTES:
            raise ValueError('Preview exceeds byte budget')
        os.chmod(dest, 0o600)
        result.update(state='previewed', preview={'file': dest.name, 'mime': 'image/png' if alpha else 'image/jpeg',
            'width': image.width, 'height': image.height, 'bytes': dest.stat().st_size, 'sha256': sha(dest),
            'use': 'Reference inspection only; open original for fine-detail/final quality review'})
        if spec['mime'] == 'video/mp4':
            extracted.unlink(missing_ok=True)
    meta['sha256'] = sha(p)
    after = p.stat()
    if (before.st_size, before.st_mtime_ns, before.st_ctime_ns, before.st_ino) != (after.st_size, after.st_mtime_ns, after.st_ctime_ns, after.st_ino):
        raise ValueError('Source changed during inspection')
    worker, largest_child = peak_mib()
    result['decoderUsage'] = {
        'workerPeakRssMiB': worker,
        'largestChildPeakRssMiB': largest_child,
        'measurement': 'OS high-water marks, separate worker and largest waited child; not aggregate concurrent tree RSS',
    }
    return result


def supervise(spec):
    budget = 512 if spec['mime'] == 'video/mp4' and spec['action'] == 'preview' else 256
    reserve = 2
    out = Path(spec['output'])
    receipt = {'budgetMiB': budget, 'reserveGiB': reserve, 'deadlineSeconds': 25, 'mode': spec['action'], 'preflight': guard.resources()}
    lock = None
    child = None
    known = {}
    try:
        lock = guard.lock('ais-marketing-render.lock')
        if not lock:
            return {'state': 'blocked', 'reason': 'Another render is running: preview again in a moment', 'resources': receipt}
        r = guard.resources()
        receipt['admission'] = r
        if r['available_gib'] < reserve + budget / 1024 or guard.pressure_high(r) or r['blender_pids']:
            return {'state': 'blocked', 'reason': 'The computer is busy (low memory or a 3D render running): preview again in a moment', 'resources': receipt}
        if not guard.PORTABLE:
            ctypes.CDLL(None).prctl(36, 1, 0, 0, 0)
        def stop(*_):
            raise KeyboardInterrupt
        signal.signal(signal.SIGTERM, stop)
        signal.signal(signal.SIGINT, stop)
        child = subprocess.Popen([sys.executable, str(Path(__file__).resolve()), '--worker'],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True,
            pass_fds=() if guard.WINDOWS else (lock.fileno(),))
        child.stdin.write(json.dumps(spec).encode());child.stdin.close()
        code, report, known = guard.supervise(child, 25, budget, reserve)
        receipt['supervision'] = report
        result = json.loads(child.stdout.read()) if code == 0 else {'state':'failed','reason':'Bounded media decoder stopped or failed'}
        if code:
            result['detail'] = child.stderr.read().decode(errors='replace')[-500:]
        result['exitCode'] = code
        result['resources'] = receipt
        return result
    except KeyboardInterrupt:
        return {'state': 'failed', 'reason': 'Media inspection cancelled', 'resources': receipt}
    finally:
        signal.signal(signal.SIGTERM, signal.SIG_IGN)
        signal.signal(signal.SIGINT, signal.SIG_IGN)
        if child:
            guard.cleanup(child, known)
            receipt['cleanupComplete'] = not guard.remaining(child, known)
        if lock:
            lock.close()
        (out / 'resources.json').write_text(json.dumps(receipt, indent=2) + '\n')


if __name__ == '__main__':
    guard.lower_priority()
    spec = json.loads(sys.stdin.read(4096))
    try:
        result = run_worker(spec) if '--worker' in sys.argv else supervise(spec)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'state': 'failed', 'reason': str(e)[:600]}))
