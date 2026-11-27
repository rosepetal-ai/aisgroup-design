# brand-video production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder.

Use the seven footage templates for footage, or the product interface clips below for a film of the Rosepetal app. An interview cuts real footage with its own sound (`voice`) and builds its captions from the transcript (`captionsFrom`, `corrections`); a person reads the captions before it ships.

| Type | Template | Length, formats |
| --- | --- | --- |
| Defect showcase | `templates/video-defect-showcase.json` | 10–20 s; 9x16, 4x5, 1x1 |
| Event teaser | `templates/video-event-teaser.json` | 8–15 s; 9x16, 4x5, 16x9 |
| Event recap | `templates/video-event-recap.json` | 30–60 s; 16x9, 9x16 |
| Announcement | `templates/video-announcement.json` | 15–20 s; 16x9, 4x5 |
| Sector film | `templates/video-sector-film.json` | 60–90 s; 16x9 + 20 s cutdown |
| Case study | `templates/video-case-study.json` | 60–90 s; 16x9, 9x16 |
| Interview | `templates/video-interview.json` | Full version any length, 16x9; social cut 45–60 s, 16x9, 1x1, 4x5 |

## Footage

- Real lines, real parts, real people (with consent). Each template shot has a `slot` saying what to film; until the footage exists the slot shows on screen, so a draft can be reviewed as an animatic.
- When the footage films the system's own screen showing the result (a NOK, a boxed defect, a date read), that screen is the proof: mark the shot `"evidence": "system"` and draw no inspection frame of ours over it. If the live view changes too fast to read, hold one real frame of it as a `still` (extract it with ffmpeg, catalogue it as a `video-frame`), as `video-defect-showcase` does. Look in `docs/brand-kit.md` and the catalogue before saying footage does not exist: AIS's LinkedIn videos and stand clips are there, with what each second shows.
- **Machine motion:** 3D renders, including the exterior turntable, hero reveal and on-the-line animations of AIS Hopper, AIS KARIKÓ and AIS REV 360 Compact, come from AIS's internal render pipeline, not this plugin. Reuse existing reviewed clips first; exterior only, guards closed, never captioned as render, CAD or 3D.
- **New real footage:** `library/media/brand-intros/` (the brand intros). Register them with `asset-library` before cutting from them.
- Footage in the library: `library/media/advanced-factories-2026/` (Advanced Factories 2026 stand, 720p, under review for consent), including `af26-can-demo-steady` (the can demo with the Rosepetal dents and the OPTICAIS date on the stand screen). Elsewhere: `rev360-cables-video` (AIS's REV 360 Cables video) and `ais-people-video` (AIS people at work, consent per person). Check `library/catalog.json`. The website clips (`web-*`) are rejected: never use them.
- **No handheld shake.** The guide rules it out, so stabilise phone footage before use (ffmpeg `vidstab`, two passes), catalogue the stabilised copy with the original as its `source`, and use that one, as `af26-can-demo-steady` does.
- **Cuts and dissolves.** Cut by default. `"dissolve": true` on a shot gives the guide's 13-frame cross-dissolve from the shot before, only within the same scene; `"wipe": true` is for beats (into a result, a claim, the end card).
- Hold shots 2 s or more (1.5 s in recaps). Social video opens on the most telling shot; only films over 60 s open with the logo. Every video ends on `end`.
- **Generated footage** is judged like any picture: real footage first; a generated or composited clip only if every frame passes `brand-review` step 1. If nothing good exists, keep the template's `slot` and ask for the footage.

## Product interface clips

Show the real application, not a staged one. Capture the actual screens of one product revision: its shell, navigation, page structure, density, full-screen editor, canvas and panels exactly as the app renders them. Real controls rearranged on a custom stage are a component demo, never a product film. How to capture: [product UI capture](product-ui-capture.md).

- Open on a readable full-screen view, then follow one real task with selective cursor movement, readable holds and zoom (the guide's standard curve, at most 2× relative). Titles and captions sit around the recording or between scenes, never in place of the app's layout.
- Capture at the density the final crop needs (DPR 3 for zooms). Never upscale a low-density recording or retouch UI text.
- The supplied SVG logo on the white closing card, no watermark mid-clip. Product status colours stay inside the UI; editorial graphics follow the guide.
- Before a clip goes into the library, check decoding, timestamps, playback, cursor and crops, the source revision, the poster and the captions, at native and feed size.

The MCP retrieves registered clips and inspects their frames; it does not render video.

## Detection boxes that follow real objects

Never place boxes by eye on moving footage. Mark the object, track it, review the check video, use the JSON:

```sh
python3 -m venv ~/.cache/vision-venv && ~/.cache/vision-venv/bin/pip install opencv-contrib-python-headless==4.10.0.84 numpy==1.26.4
~/.cache/vision-venv/bin/python -I engine/tools/track.py footage.mp4 footage.track.json 1012,331,53,100
```

In the shot: `"detect": [{ "label": "bottle", "conf": "0.97", "track": <the array> }]`, with `"evidence": "system"` only when the classes and confidences are the system's.

## Captions

Every video has captions; social video burns them in: `"captions": [{ "from": 0.4, "to": 2.6, "text": "First line|second line" }]`. Sentence case, one or two short lines.

## Render

```sh
node engine/check.mjs work/<slug>/recipe.json
python3 skills/_shared/scripts/safe_render.py -- node engine/render.mjs work/<slug>/recipe.json --formats 9x16     # one format first
```

The render runs Chromium and ffmpeg: one heavy job at a time, always under the lock. It takes roughly 2–3× the video length. Look at it by extracting frames (`ffmpeg -ss 3 -i file.mp4 -frames:v 1 ~/.cache/ais-group-design/review/<slug>/f03.png`) and reading them; go through the [look checklist](../../brand-review/references/look-checklist.md) and `brand-review` before handing over. Output is H.264, 25 fps, Rec. 709. A recipe with a single `lower-third` shot renders a transparent ProRes 4444 `.mov` for editors. The renderer carries each shot’s recorded voice. For a finished MP4, select a published intro or end card only if the edit calls for it and the picture does not already include it. List the approved downloads with `node scripts/prepare-template.mjs --list`; fetch the chosen asset with `node scripts/prepare-template.mjs --asset <id>`. The published Rosepetal soundtrack is cleared for both AIS and Rosepetal films and animations. Choose a take that leaves speech clear. From the prepared runtime, finish the film with `python3 scripts/finish-video.py body.mp4 finished.mp4 --intro intro.mp4 --music track.m4a`. Intro, outro and music are optional. Match the opening and closing aspect ratio to the body. Listen to the final mix for speech clarity and review both cuts before delivery.
