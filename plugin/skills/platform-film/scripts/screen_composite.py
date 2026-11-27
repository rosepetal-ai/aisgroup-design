"""Put a real app frame on a rendered screen: warp it to the screen's corners, dim it by the glass, add the glass reflections.

usage: python3 screen_composite.py PLATE MASK CORNERS_JSON APP OUT [--transmission 0.93]
  PLATE    the render with the bare screen glass (8- or 16-bit PNG)
  MASK     the screen's anti-aliased active-area mask (white = screen)
  CORNERS  JSON with corners_px {tl,tr,br,bl} in image pixels (origin top left, y down)
  APP      the app frame (any size; it should already have the screen's aspect)
For a sequence, call it once per frame with that frame's plate, mask and corners.
"""
import json
import sys

import cv2
import numpy as np


def load(path):
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise SystemExit(f'cannot read {path}')
    scale = 65535.0 if img.dtype == np.uint16 else 255.0
    img = img.astype(np.float32) / scale
    return img[..., :3] if img.ndim == 3 else img


def composite(plate, mask, corners, app, transmission=0.93):
    h, w = plate.shape[:2]
    c = corners['corners_px']
    quad = np.float32([c['tl'], c['tr'], c['br'], c['bl']])
    # Shrink with area averaging first (a warp alone aliases small UI text), then warp.
    scale = float(np.ptp(quad[:, 0])) / app.shape[1]
    if scale < 1:
        app = cv2.resize(app, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    ah, aw = app.shape[:2]
    src = np.float32([[0, 0], [aw, 0], [aw, ah], [0, ah]])
    warped = cv2.warpPerspective(app, cv2.getPerspectiveTransform(src, quad), (w, h),
                                 flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT)
    # Screen blend: the lit app seen through glass, the glass reflections on top of it.
    screen = 1 - (1 - warped * transmission) * (1 - plate)
    m = mask if mask.ndim == 2 else mask[..., 0]
    m = m[..., None]
    return plate * (1 - m) + screen * m


def main(argv):
    import argparse
    p = argparse.ArgumentParser()
    for name in ('plate', 'mask', 'corners', 'app', 'out'):
        p.add_argument(name)
    p.add_argument('--transmission', type=float, default=0.93)
    a = p.parse_args(argv)
    out = composite(load(a.plate), load(a.mask), json.load(open(a.corners)), load(a.app), a.transmission)
    cv2.imwrite(a.out, np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8))


def demo():
    # The app's corners land on the quad; outside the mask the plate is untouched.
    plate = np.full((40, 60, 3), .2, np.float32)
    mask = np.zeros((40, 60), np.float32); mask[10:30, 10:50] = 1
    app = np.ones((10, 16, 3), np.float32)
    corners = {'corners_px': {'tl': [10, 10], 'tr': [50, 10], 'br': [50, 30], 'bl': [10, 30]}}
    out = composite(plate, mask, corners, app)
    assert abs(out[0, 0, 0] - .2) < 1e-6, 'outside the screen stays the plate'
    assert out[20, 30, 0] > .9, 'the app shows inside the screen'


if __name__ == '__main__':
    if sys.argv[1:] == ['--demo']:
        demo(); print('ok')
    else:
        main(sys.argv[1:])
