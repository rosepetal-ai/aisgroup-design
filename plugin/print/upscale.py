"""Faithful tiled EDSR x2 for cover photographs; bounded before loading OpenCV.

Source algorithm: ais-group-design/print/upscale.py, c4acaef.
Usage: python print/upscale.py source.jpg source-edsr-x2.png EDSR_x2.pb
"""
import json
import os
import resource
import sys

MEMORY_KIB = 3000000
CPU_SET = {0, 1, 2, 3}

def limit_process():
    ceiling = MEMORY_KIB * 1024
    soft, hard = resource.getrlimit(resource.RLIMIT_AS)
    if hard != resource.RLIM_INFINITY:
        ceiling = min(ceiling, hard)
    if soft != resource.RLIM_INFINITY:
        ceiling = min(ceiling, soft)
    resource.setrlimit(resource.RLIMIT_AS, (ceiling, ceiling))
    priority = os.getpriority(os.PRIO_PROCESS, 0)
    if priority < 15:
        os.nice(15 - priority)
    allowed = os.sched_getaffinity(0) & CPU_SET
    if not allowed:
        raise RuntimeError('The bounded cover upscaler requires Linux CPU cores 0-3.')
    os.sched_setaffinity(0, allowed)
    return {'memoryBytes': ceiling, 'nice': os.getpriority(os.PRIO_PROCESS, 0), 'cpus': sorted(allowed)}

def upscale(src, dst, model):
    limit_process()
    import cv2
    import numpy as np
    cv2.setNumThreads(4)
    tile, overlap, factor = 160, 16, 2
    sr = cv2.dnn_superres.DnnSuperResImpl_create()
    sr.readModel(model)
    sr.setModel('edsr', factor)
    image = cv2.imread(src)
    if image is None:
        raise ValueError('Cannot read the source photograph')
    height, width = image.shape[:2]
    out = np.zeros((height * factor, width * factor, 3), np.float32)
    weight = np.zeros((height * factor, width * factor, 1), np.float32)
    for y in range(0, height, tile):
        for x in range(0, width, tile):
            y0, x0 = max(0, y - overlap), max(0, x - overlap)
            y1, x1 = min(height, y + tile + overlap), min(width, x + tile + overlap)
            enlarged = sr.upsample(image[y0:y1, x0:x1]).astype(np.float32)
            out[y0 * factor:y1 * factor, x0 * factor:x1 * factor] += enlarged
            weight[y0 * factor:y1 * factor, x0 * factor:x1 * factor] += 1
    if not cv2.imwrite(dst, np.clip(out / weight, 0, 255).astype(np.uint8)):
        raise ValueError('Cannot write the upscaled photograph')
    print(out.shape)

if __name__ == '__main__':
    if sys.argv[1:] == ['--check-limits']:
        print(json.dumps(limit_process()))
    elif len(sys.argv) == 4:
        upscale(*sys.argv[1:])
    else:
        raise SystemExit('Usage: upscale.py source.jpg source-edsr-x2.png EDSR_x2.pb')
