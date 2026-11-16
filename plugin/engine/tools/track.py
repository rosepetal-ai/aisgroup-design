"""Tracks objects through a clip so detection overlays follow the real footage.

python tools/track.py footage/clip.mp4 out.json x,y,w,h[@frame] ...
Boxes are pixels on the given frame (default 0); an object entering later starts there, and is null before. Writes one [x, y, w, h] per frame per object, in percent of the frame,
and a check video next to the JSON with the tracked boxes drawn on, to review before rendering.
"""
import json, sys
import cv2

src, out, *boxes = sys.argv[1:]
cap = cv2.VideoCapture(src)
frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
H, W = frames[0].shape[:2]
check_frames = [f.copy() for f in frames]
tracks = []
for b in boxes:
    spec, _, at = b.partition('@'); at = int(at or 0)
    box = tuple(int(v) for v in spec.split(','))
    t = cv2.TrackerCSRT_create(); t.init(frames[at], box)
    tr = [None] * at + [box]
    for f in frames[at + 1:]:
        found, nb = t.update(f)
        tr.append(nb if found else tr[-1])  # hold the last box if the object is lost for a frame
    tracks.append(tr)
    for f, bx in zip(check_frames, tr):
        if bx: x, y, w, h = bx; cv2.rectangle(f, (int(x), int(y)), (int(x + w), int(y + h)), (215, 159, 124), 3)
check = cv2.VideoWriter(out.replace('.json', '.check.mp4'), cv2.VideoWriter_fourcc(*'mp4v'), cap.get(cv2.CAP_PROP_FPS), (W, H))
for f in check_frames: check.write(f)
check.release()
pct = [[b and [round(b[0] / W * 100, 2), round(b[1] / H * 100, 2), round(b[2] / W * 100, 2), round(b[3] / H * 100, 2)] for b in tr] for tr in tracks]
json.dump(pct, open(out, 'w'))
print(f'{len(pct)} objects, {len(pct[0])} frames -> {out}')
