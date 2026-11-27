"""Beat times of a music track: spectral-flux onsets, tempo by autocorrelation (70-160 BPM), phase by best fit.
usage: python3 beats.py track.m4a [seconds]   -> prints BPM, a confidence and writes track.beats.json
ponytail: a plain flux tracker, steady-tempo tracks only; librosa's beat_track if tempos drift."""
import json, subprocess, sys
import numpy as np

SR, HOP = 22050, 512


def envelope(path, secs):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-t', str(secs), '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, np.float32)
    n = (len(x) - 2048) // HOP
    frames = np.stack([x[i * HOP:i * HOP + 2048] * np.hanning(2048) for i in range(n)])
    mag = np.log1p(np.abs(np.fft.rfft(frames, axis=1)))
    flux = np.maximum(0, np.diff(mag, axis=0)).sum(axis=1)
    return (flux - flux.mean()) / (flux.std() + 1e-9)


def beats(env):
    fps = SR / HOP
    ac = np.correlate(env, env, 'full')[len(env) - 1:]
    lags = np.arange(len(ac))
    ok = (lags >= fps * 60 / 160) & (lags <= fps * 60 / 70)
    k = int(lags[ok][np.argmax(ac[ok])])
    y0, y1, y2 = ac[k - 1], ac[k], ac[k + 1]
    lag = k + 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2)  # sub-frame peak: a whole-frame lag drifts 2 % a beat
    n = int((len(env) - 1) / lag)
    score = [env[np.round(p + np.arange(n) * lag).astype(int).clip(0, len(env) - 1)].mean() for p in np.arange(0, lag, 0.25)]
    p = np.arange(0, lag, 0.25)[int(np.argmax(score))]
    t0 = (HOP + 1024) / SR  # flux frame i compares frames i and i+1; an onset reads near the later frame's centre
    return 60 * fps / lag, float(y1 / ac[0]), [round((p + m * lag) / fps + t0 - HOP / SR, 3) for m in range(n)]


def demo():
    """A click every 0.5 s (120 BPM) is found at 120 BPM with beats on the clicks."""
    t = np.arange(0, 10, 1 / SR)
    x = np.zeros_like(t)
    for c in np.arange(0.25, 10, 0.5):
        i = int(c * SR); x[i:i + 200] = np.random.default_rng(1).normal(0, 1, 200)
    import tempfile, os
    f = os.path.join(tempfile.mkdtemp(), 'c.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', f], input=x.astype(np.float32).tobytes(), check=True)
    bpm, _, b = beats(envelope(f, 10))
    assert abs(bpm - 120) < 3, bpm
    assert min(abs((b[2] - 0.25) % 0.5), 0.5 - abs((b[2] - 0.25) % 0.5)) < 0.05, b[:4]


if __name__ == '__main__':
    if sys.argv[1:] == ['--demo']:
        demo(); print('ok'); sys.exit()
    path = sys.argv[1]
    bpm, conf, b = beats(envelope(path, float(sys.argv[2]) if len(sys.argv) > 2 else 150))
    json.dump({'bpm': round(bpm, 2), 'confidence': round(conf, 3), 'beats': b}, open(path.rsplit('/', 1)[-1] + '.beats.json', 'w'))
    print(f'{path.rsplit("/", 1)[-1]}: {bpm:.1f} BPM, confidence {conf:.2f}, {len(b)} beats, first {b[:3]}')
