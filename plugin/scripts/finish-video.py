"""Assemble approved opening/closing clips and mix a licensed bed under the finished picture."""
import argparse
import json
import math
import os
from pathlib import Path
import subprocess
import tempfile


def probe(file):
    result = subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', file
    ])
    info = json.loads(result)
    video = next(stream for stream in info['streams'] if stream['codec_type'] == 'video')
    duration = float(video.get('duration') or info['format']['duration'])
    if not math.isfinite(duration) or duration <= 0:
        raise ValueError(f'Invalid picture duration for {file}')
    return video, duration, any(s['codec_type'] == 'audio' for s in info['streams'])


def finish(body, output, intro=None, outro=None, music=None):
    if output.exists():
        raise FileExistsError(output)
    body_video, _, _ = probe(body)
    width, height = body_video['width'], body_video['height']
    inputs, filters, streams = [], [], []
    total = 0
    for i, file in enumerate(f for f in (intro, body, outro) if f):
        video, duration, sound = probe(file)
        if video['width'] * height != video['height'] * width:
            raise ValueError(f'{file} needs an approved version matching the body aspect ratio')
        inputs.extend(['-i', file])
        filters.append(f'[{i}:v]scale={width}:{height},setsar=1,fps=25,format=yuv420p,setpts=PTS-STARTPTS[v{i}]')
        src = f'[{i}:a:0]' if sound else 'anullsrc=r=48000:cl=stereo,'
        filters.append(f'{src}aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=duration={duration},asetpts=PTS-STARTPTS[a{i}]')
        streams.append(f'[v{i}][a{i}]')
        total += duration
    filters.append(''.join(streams) + f'concat=n={len(streams)}:v=1:a=1[v][program]')
    audio = '[program]'
    if music:
        inputs.extend(['-stream_loop', '-1', '-i', music])
        fade = min(1, total / 2)
        filters.append(f'[{len(streams)}:a:0]aresample=48000,atrim=duration={total},volume=-18dB,afade=t=out:st={total-fade}:d={fade}[bed]')
        filters.append('[program][bed]amix=inputs=2:duration=first:normalize=0[mixed]')
        audio = '[mixed]'
    filters.append(audio + 'loudnorm=I=-14:TP=-1:LRA=11[a]')
    # A failed encode leaves no deliverable; exclusive creation also protects concurrent exports.
    with tempfile.TemporaryDirectory(dir=output.parent) as folder:
        tmp = Path(folder) / 'finished.mp4'
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-filter_complex_threads', '1',
                        *inputs, '-filter_complex', ';'.join(filters), '-map', '[v]', '-map', '[a]',
                        '-c:v', 'libx264', '-threads', '2', '-crf', '18', '-color_primaries', 'bt709',
                        '-color_trc', 'bt709', '-colorspace', 'bt709', '-c:a', 'aac', '-ar', '48000',
                        '-b:a', '320k', '-movflags', '+faststart', tmp], check=True)
        os.link(tmp, output)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for key in ('body', 'output', '--intro', '--outro', '--music'):
        parser.add_argument(key, type=Path)
    finish(**vars(parser.parse_args()))
