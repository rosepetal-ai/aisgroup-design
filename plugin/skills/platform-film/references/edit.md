# The edit: compositing, captions, cutting, export

This is the edit of a customer or standalone film. It joins the brand intro, rendered shots of the machine, app recordings played on the rendered Panel PC screen, the brand captions, the end card and the soundtrack on one timeline, and `scripts/cut.py` does all of it from one cut list. A website film is assembled in its page instead ([site film](site-film.md)).

## The cut list

Run the film tools with Python 3, NumPy, OpenCV and Pillow, with ffmpeg and ffprobe on the path. The full studio’s setup installs the Python packages. The editor consumes the approved recordings, plates and soundtrack supplied for the film. Run the example commands below from the platform-film skill directory.

One JSON file per film, beside the material it cuts (the format is at the top of `scripts/cut.py`):

- the first shot is the brand intro and the last the end card, each a `video` shot that plays the published file unchanged (from the guide's «Video» downloads, in the film's language where one exists);
- a shot is a render (one held file or a folder of frames) and a duration;
- a shot with the screen in view adds the screen passes (`mask`, `corners`) and the app source (a recording and the second it starts from);
- captions are on the film's timeline, with the text from the beat sheet;
- `music` lays the Rosepetal soundtrack (the guide's «Downloads», «Music») from the start, fading out over the end card.

Don't type the cut list by hand. Write the beat sheet as JSON (each beat: its caption and its shots; the format is at the top of `scripts/plan.py`), run `python3 scripts/beats.py <track>` once for the soundtrack's beat grid, then `python3 scripts/plan.py film/sheet.json film/cut.json`. It applies the holds, cuts app shots on the music, continues a screen from the shot before (`"from": "continue"`), keeps sub-second moments exact (`"snap": false`), refuses a shot that repeats the source before it, and lists every app shot it lengthened: look at the frames each one now reaches before rendering.

`cut.py` keeps each rendered shot in `.cut-cache/` beside the cut list, so a re-cut renders only the shots that changed. Delete the folder when the film is delivered.

Run it under the memory budget (the script takes the shared lock):

```sh
MAX=2600M NEED_MB=2000 ../live-animation/scripts/safe.sh python3 scripts/cut.py film/cut.json   # safe.sh takes the shared lock itself; never wrap it in flock
```

Iterate on one beat with a short cut list of that beat only; cut the whole film once every beat reads right.

## Compositing the screen

`scripts/screen_composite.py` warps each app frame onto the screen's corners, dims it by the glass (transmission 0.93) and screen-blends it with the plate inside the mask, so the glass reflections stay on top of the app. Check the result at 100 %:

- the app's text is as sharp as the recording at that size, with no ringing at the screen edge;
- the bezel and the screen edge don't shift between the plate and the moving shots;
- in frames flagged `corners_behind_camera`, the screen is left as rendered.

## The moves between the line and the app

- **Push-in**: the screen is already live during the move (the app plays on it from the first frame where it is legible), and the shot ends on the app plate pose. The next shot is the app plate itself, so the hand-off is the same picture continuing.
- **On the plate**: app segments follow each other on the plate. A change of segment is a cut on the screen only; the bezel and the caption band don't move.
- **Pass inserts**: when Profiler says «Pass the product through», cut to the machine doing that pass, then back to the plate as the app shows the result. Trim an insert to its action with the shot's `from` (the bottle crossing, about 1.5 s), never its empty lead-in.
- **Pull-out**: starts on the plate pose with the app still playing, then reveals the line.
- **Long processes** (training, a batch) are shortened by a cut with the app's own progress visible on both sides. Never speed up the screen.
- No dissolves, wipes, zooms inside the app or motion graphics between shots: straight cuts and the camera's own moves.
- **Cut on the music.** App shots end on the soundtrack's beat (within a quarter second), and inside a long app action jump-cut to the next change of state rather than wait (a click, then the box it makes). The 3D moves keep their length; the app shots around them absorb the snapping.

## The defects

Give each defect its own beat in three shots, following the pharma reference:

1. the product pushed off the line (the reject close-up, its defect toward the camera);
2. the Monitor's reject dialog on the cabinet's screen, held open (a frame folder of the dialog, so `cut.py` holds its last frame), under the caption that says what the defect means for the customer («Sans code-barres, la bouteille n'est plus traçable.»);
3. the defect card: the real camera image full frame with the studio's inspection frame (`still` shot with `inspect` in image space, rendered by `engine/render.mjs` in a private `work/` recipe and cut in as a `video` shot). The reading names the element and its count against the rule (`Code-barres 0/1`, `Étiquette avant 2/1`), and the verdict is `NOK` with the rule type that caught it («Élément obligatoire absent», «Quantité non conforme», «Classe interdite»), so each reject pays off a rule the film explained. No caption over the card: it carries its own words, and a defect at the foot of the image puts its box where the caption would sit (use `verdict.side` when the verdict would leave the frame).

Use the full-frame card to keep the product, defect and verdict together. Keep the card enlargement under 2× (the check warns from 1.5×). Two defects never share a beat or a caption.

## Captions

- Each caption changes with the shot it describes and never runs over a cut to a new subject. Enter just after the cut and leave just before the next one.
- Holds come from the beat sheet (characters ÷ 15 + 1 s, plus 1 s when a picture must be read too). If the picture runs shorter, lengthen the hold on the app's last state, never the caption over the next shot.
- A lengthened app shot takes more of the recording: look at the source frames it now reaches. It must not run into the next beat's action (a dialog the next beat opens), repeat the next shot's start, or show a state the caption denies («Image not annotated» under «les images s'annotent seules»). Shorten the caption or start the shot earlier instead. A moment shorter than a second (boxes popping before auto mode moves on) keeps its exact window, unsnapped, and a screen that continues the previous shot (a pull-out after the app) starts where that shot's source ended.
- The caption sits in the bottom band (164 px at 1080p) below the screen on the app plate, and in the same place on rendered shots.
- Typography as written on the beat sheet: «» quotes, a narrow no-break space before «:» and «;» in French, typographic apostrophes.

## Sound

A customer or standalone film carries the Rosepetal soundtrack, levelled to −14 LUFS integrated with a true peak of −1 dBTP and fading out over the end card in 2.5 s (`cut.py` does both). It must still work muted, so the captions carry the meaning. No click sounds, whooshes or voice-over unless asked. A website film has no sound.

## Export

- 1920 × 1080, 25 fps (the guide's delivery; recordings at 30 fps are resampled by `cut.py`), H.264 (`libx264 -crf 17 -pix_fmt yuv420p -movflags +faststart`), which `cut.py` writes.
- Name the file after the customer and the version (`<customer>-<product>-v1.mp4`) and keep it with the customer's private material, never in a repository or on a public page.

## The final review

Watch the whole film at normal speed, then step through it. A fresh reviewer who has only the beat sheet and the film does the same. Check:

- every caption can be read in its hold, and says only what the picture shows;
- each hand-off between the line and the app is seamless (no bezel jump, no change of grade);
- the clock, the names and the counters agree across segments;
- each reject reads in one second, its defect toward the camera;
- no other customer's name, dataset, user name or e-mail is on screen;
- no stage is filled with invented material.

Each remark becomes a rule in this skill before it is fixed.
