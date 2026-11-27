# The machine, the line and the Panel PC

The machine is rendered (Blender Cycles) as a photograph would show it, from the real CAD, exteriors only. The look and the transitions follow the pharma line film (`/animations/pharma-line` on the Rosepetal website). Realism rules for the products and labels are in `../product-render/references/realism.md`.

## The look

- A bright, clean hall: near-white floor with yellow walkway lines, soft daylight, no dark industrial mood.
- The stainless machine on the conveyor. Conveyor rails are stainless or black UHMW, never coloured. The line runs straight through the shot.
- The Panel PC is a stainless enclosure on legs beside the line, with a tower light (red, amber, green) on a mast. The app shows on its screen.
- Long wides don't repeat one leg and foot pattern: vary the spacing, or let the far line fall off softly.
- No glow, beams, flares, overlays or text in renders.

## The line rate

Calculate the product pitch from the sourced belt speed and throughput. For example, at 0.4 m/s and two products a second the centre-to-centre pitch is 200 mm. Slower is fine if it reads better.

## Shots

Every move is locked off or a straight dolly along the lens axis with eased ends: no orbits, arcs, pans or cranes, and the focal length stays fixed. No cabinet is cut by the frame edge: the machine, the Panel PC enclosure and the reject unit are each whole with a margin, or out of frame. The app plate, where the screen fills the frame, is the one exception. A shot starts 0.3 s before its action and ends 0.3 to 0.5 s after it settles. A locked-off shot runs as long as its caption needs; a frozen last frame shows.

| Shot | What it shows |
| --- | --- |
| Opening | A locked-off wide of the line with the machine and the Panel PC each whole, products running. The line runs off the frame edges; no invented upstream or downstream machine. |
| Reject | One shot per defect, locked off and tight: the defective product arrives with its defect toward the camera (its label at least 300 px tall at 1080p), a swing arm diverts it onto the reject conveyor, good products carry on. About 3 s. |
| Push-in | Its own shot, after a straight cut: it starts framed on the Panel PC (screen centred, the line soft behind) and moves straight in to the app plate (below). Never a pan from another viewpoint: turning that far in two seconds blurs into a whip. The edit then plays the app on that plate. |
| Pass inserts | Where Profiler says «Pass the product through»: first the product passing the photocell (a physical sensor, no beam), then the product entering the machine's tunnel, seen from outside (exteriors only: never the cameras, optics or lights inside). They show that each pass happens. |
| Pull-out | The reverse of the push-in: from the app plate back to the line as the batch starts. |
| Close | Wide, the line running, rejects resting at the lane's end stop. |

For a bottle line whose reference specifies a swing-arm diverter, the arm swings across the line just ahead of the bottle and the conveyor carries the bottle along its face onto a parallel reject conveyor, upright. Use the same reject mechanism and lane in every reject and in the wides. If the customer's real reject unit is unknown, build a credible one from the line's own parts and say it is invented. A photo or drawing of the real one replaces it when it arrives.

Physics is simulated before animating: the reject unit's stroke (the swing arm for bottles, or the unit the machine really has: the pharma line's kicker into a tray), the transfer across the dead plate, the product stopping at the end stop. Nothing passes through anything, nothing floats, and products tip only if the push would really tip them. The pusher fires as the product reaches it, and the product takes off from that contact, tilts a few degrees and settles back, then slows to a stop against the end stop or the product already there, always with a gap. Products on the line keep one speed and even spacing. Rejected products never bunch into each other.

## The app plate

The app segments play on the Panel PC itself, never floated full frame.

- One square-on pose of the Panel PC, no keystone.
- In a 1920 × 1080 frame, the screen's active area is 1280 × 800 px from (320, 104) to (1600, 904), roughly centred, with the caption band below it. The screen's centre sits about 1.36 m above the floor, a standing operator's height.
- The bezel, door, handle and screws are crisp. A subtle reflection on the glass is welcome; a hotspot over the app is not.
- Every push-in ends exactly on this pose, and every pull-out starts from it, so a move hands off to the app with nothing changing but the screen content.

## Passes the renderer delivers

For every frame with the screen in shot:

| File | Holds |
| --- | --- |
| `<id>_plate.png` | The render with the bare screen glass: the dark panel and its reflections. 16-bit. |
| `<id>_screen-mask.png` | The screen's anti-aliased active-area mask. |
| `<id>_screen-glass.png` | The plate with the mask as alpha. |
| `<id>_corners.json` | `corners_px` {tl, tr, br, bl} of the active area in image pixels (origin top left, y down), plus the camera and the line rate. |

Model the active area as an exact 16:10 rectangle with the real bezel. If a corner goes behind the camera, flag it (`corners_behind_camera`) and don't draw the screen in that frame.

## Labels and printed codes on rendered products

- **Labels** are built from the customer's real capture: crop each label where it faces its camera square on, remove the capture's lighting, and correct the colour against white paper in the shot (barcode or QR paper).
- **Label paper** takes the real paper's colour (warm ivory on a champagne label, for example), never white.
- **Printed codes are print-crisp at 100 %**:
  - rebuild the EAN-13 as vectors from the digits printed under the real bars;
  - rebuild the QR code from its real modules, thresholded onto its grid;
  - never encode new content.
- **Each defective product carries only its own defect**, measured from the edited capture: a second label offset as in the unwrap, a scratch at its real size.

## Review of the stills

Before the go to animate, deliver one still per shot plus the first and last frames of each move, a contact sheet, and a 100 % crop of a label next to the real capture. Check every still like a critic:
- zoom on each mark;
- physical sense: contact shadows, scale against the machine, reflections, reject motion;
- each label on the right object;
- the reject readable in one second.

## Briefing the render machine

Renders run on the render machine, briefed in one message per round. Each round changes only what it lists: «same scene, same look, same physics». Per shot:

- **id and length**: a short id (`H1`, `R1b`) and its frames at 25 fps;
- **camera**: its height and lens, locked off or one straight move, never an orbit;
- **frame**: what fills it and how much (the machine about a third of the width, whole), and what must read (the AIS mark, the defect at its size);
- **action and timing**: what moves when, in seconds (approach 0.5 s, the strike, 1 s held at rest);
- **hand-off**: the pose it must end or start on when it cuts to another shot (the push-in's first frame, the app plate).

It delivers a preview of every shot first, runs its own critic pass, then renders the finals without waiting unless that pass fails. Finals come as 16-bit plates, plus the screen's mask and corners on every shot where the screen is in view, packed one tar per shot with its sha256. On arrival, check the sha256, convert to 8-bit, sort into `plate/`, `mask/` and `corners/` folders, and look at the first, middle and last frames before cutting them in. Old shots stay on the render machine until the film is approved.
