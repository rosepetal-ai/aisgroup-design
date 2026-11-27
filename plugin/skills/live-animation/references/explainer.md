# Explainers

The rule book's «Two variants» section is the spec: read it first. This file says how. The finished example is the pharma line's explainer, `/animations/pharma-line/explainer`.

## 1. What it is

The catalogue piece's scene, UI layer and story, driven by the viewer. Nothing in the scene changes: the same engine, shots, captions, column and Monitor. Added on top:

- **One control bar**: `@aisgroup/design`'s `PlayerBar` block, a Vue island. Play and pause, 5 s back and forward, the timeline with the chapters, the time, the camera views and full screen; under them the chapters and the speeds as text buttons, so the viewer navigates by name (11-26: «the player had text buttons to navigate the animation»). On narrower bars they move into one menu. Space and the arrows.
- **Chapters**: the story's sections (`story.ts T`), named for the viewer, marked on the timeline.
- **Views**: Auto is the film's own camera. Held views (Wide, Station, Reject) hold one of the scene's poses while the line runs.
- **Labels and the chapter's name** in held views.
- **The logo** on the scene at the top left, no header.

## 2. Where things are

| What | Where |
| --- | --- |
| The bar | The design system’s `blocks/PlayerBar.vue` and the Slider’s `timeline` variant (`ui/slider`), included in the starter below. |
| From a local plugin install | The starter includes the shared player source in `templates/explainer/vendor/aisgroup/design/`. In a new project copy it to `src/vendor/@aisgroup/design/`, install the dependencies below, configure the alias and include the vendored Vue and TypeScript in the Tailwind source scan. An existing host can use its fingerprinted copy. |
| Into a site | `node scripts/vendor-design.mjs <site>/astro` (design-system): copies the block and what it imports to `src/vendor/@aisgroup/design/`, fingerprinted in the site's `package.json` `vendor`, checked before every build. The site aliases `@aisgroup/design` there (`astro.config.mjs`). Re-run it after any change to the block. Once `@rosepetal/design` is published with the block, depend on it as rosepetal-ui does (`"@aisgroup/design": "npm:@rosepetal/design@…"`) and drop the copy. |
| The explainer's own code | `astro/src/<piece>/explainer/`: `chapters.ts` (chapters, views, labels: the only file that is the piece's), `main.ts` (the viewer's clock), `player.ts` (state shared with the bar), `overlay.ts` (chapter name, labels), `Bar.vue` (the block on that state), `explainer.css` (page, website form, one Tailwind root). |
| The page | `astro/src/pages/animations/<piece>/explainer.astro`: standalone (no site header or footer), `noindex`. |
| The template | `templates/explainer/` in this skill: the six files above, `page.astro`, `align.json`. |
| The engine's hooks | `world.ts`: `view(pose)`, `project(point)`, `anchors()`, `sample(x, y, w, h)` (async), `SHOT_TIMES`. `ui/index.ts`: `createUi(root, { lift })`. Optional: the catalogue never calls them. |

## 3. Build one from the template

Work in the piece's working tree; the catalogue page must stay byte-for-byte the same in behaviour.

1. **Dependencies** (once per site), from `astro/`, through `safe.sh`:
   `npm install @astrojs/vue@5.1.4 vue@^3.5.24 reka-ui@^2.11.0 @vueuse/core@^15.0.0 class-variance-authority@^0.7.1 clsx@^2.1.1 tailwind-merge@^3.7.0 @lucide/vue@^1.54.0 tw-animate-css@^1.4.0` (Astro 5 takes `@astrojs/vue` 5; 7 needs Astro 7). Add `vue()` to `integrations` and the `@aisgroup/design` alias, then vendor the bar (section 2).
2. **Copy the template**: `templates/explainer/explainer/*` to `astro/src/<piece>/explainer/`, `page.astro` to `astro/src/pages/animations/<piece>/explainer.astro`, `align.json` to `scripts/configs/<piece>-explainer.align.json`; replace `__PIECE__` with the piece's folder name. Fix the page's preloads (the piece's model, light and labels: copy them from the catalogue page) and its alt text, title and description.
3. **Engine hooks**: if the piece's `world.ts` and `ui/index.ts` don't have them yet, copy them from the pharma explainer's commit (35539ef8, `world.ts` and `ui/index.ts`: about 60 lines). `anchors()` returns the parts the labels name, measured from the scene's own objects (a model's bounding box, the Panel PC's screen corners, the format's measured sizes), never guessed.
4. **`chapters.ts`** (the piece's content):
   - Chapters from the story's beats: name each for the viewer in sentence case, one line each that says *where* it happens and never what the caption at that moment says (rule book: No redundancy). A «how it works» moment is a chapter. The opening and results chapters have no line (their titles name them).
   - `HIDDEN`: where the chapter's name may not stand: under the opening title, while the camera is on the software (from 0.5 s before the app fills the frame until the pull out lands), from the results on.
   - Views: Auto (`pose: null`) first, then the scene's own shots as held views, each `[px,py,pz, tx,ty,tz, f, fov]` like `SHOTS`. Try candidates with `camtest.mjs` at two or three story moments; keep the subject whole, the logo's corner calm and the caption band clear. `chapter: true` only on a view whose top left stays clear (the pharma line: only Wide; the conveyor loop runs behind every closer view).
   - Labels per view: `[part, words]`, one per subject, the part's name as the chapter calls it («Ejector» in «How the ejector works»).
5. **Look** (section 6), fix, then the gates.

## 4. The control bar

- Props: `duration` and `time` (the viewer's seconds at 1×: `story.ts wallOf`), `chapters` (`{ at, name }`, wall seconds), `views`, `speeds`, `fullscreen`, `isFullscreen`, `step` (5), `keys`, `text` (labels for ES/CA pages). Models: `playing`, `view`, `speed`. Events: `seek(time)`, `fullscreen`.
- Website form: square corners (the page sets `--radius: 0` on `:root`, so the portalled menu and tooltips are square too), 36 px controls, a white bar 100 px tall with its two rows (56 px with one), hairline `#E2E8F0`, the raised shadow. Placed at the bottom of the title-safe area across it (`explainer.css .ple-bar`).
- Layout by the bar's own width (container queries): from 1152 px two rows and no menu; under 1152 px one row, the chapters and speeds in the menu; under 896 px the views join them; under 576 px only play, the timeline and the menu.
- Chapter buttons are labels of one to four words: a chapter with a longer name gives `button` in `chapters.ts` («Codes» for «Codes against the order»). The chapter's name on the scene keeps the full name. The page measures the bar for the lift (`main.ts barLift`), so captions and the column clear either height.
- The time is two numbers either side of the timeline (elapsed, total), never «0:35 / 2:52».
- The piece owns the clock (`explainer/main.ts`): it writes `player.time` at most every 0.1 s (under half a pixel on the track), stops at the end, starts again from the top when played there, holds `?t=` paused.
- `Bar.vue` renders the server's state (paused at 0) until mounted, so hydration never disagrees with the page (a mismatch is a console warning: the console gate fails).
- The UI layer keeps clear of it: `createUi(root, { lift: () => 56 + 16 })` raises the captions, the column's content and the filmed screen.

## 5. Chapters, views, labels, the logo

- **Held views hold between the opening title and the results** (`heldSpan`); the titles keep the film's frame, made for them. The software's push, framing and pull out stay the film's in every view.
- **The chapter's name** (24 px Medium, line 16 px secondary) stands under the logo on the title-safe edge, only in a view marked `chapter`, and never on phones while the subject is raised over the panel (the evidence span). In Auto the captions speak; the pressed chapter button (or the menu) and the timeline's tooltip name the chapter.
- **Labels**: the overlay kit's tab (20 px, 12 px Medium, ink on white, 1 px hairline) on a 32 px, 1 px ink leader; only in held views, only between the opening and the results, not on the software; a label that would cover the logo, the chapter's name or a title is hidden for that frame; under the UI layer, so the column covers them.
- **The logo**: the guide's file at the site header's height (Rosepetal 27 px, 25 px on phones), on the title-safe corner, no box. `main.ts` reads the frame under it (and its clear space) on every cut, seek and view change and every 1.5 s through a move, and shows the white file where it has clearly better contrast than the blue (worst quarter of the pixels, 15 % hysteresis; cross-fade 180 ms). The read is asynchronous (`world.sample`: a pixel buffer and a fence); never `readPixels` straight off the canvas, never `drawImage` of the WebGL canvas (section 7).

## 6. Gates

The explainer exposes the catalogue's DEV contract (`__plSeek`, `__plWall`, `__plT`, `.pl-stage`, `data-poster`, `data-open`, `data-full` on the bar's full-screen button), so the scripts run on it unchanged:

```
cd <skill>/scripts
# Set URL to the running explainer, CFG to its measured alignment JSON,
# and OUT to a local capture folder.
./safe.sh node console.mjs "$URL"
./safe.sh node align.mjs "$URL" "$CFG"
./safe.sh node poster.mjs "$URL" "$OUT/poster"
./safe.sh node fallback.mjs "$URL"
./safe.sh node loadtrace.mjs "$URL"
```

Then `perf.mjs` on a production build (release.md, with the preview started by `node node_modules/.bin/astro preview`, so `kill` reaches it), next to the catalogue page from the same build: the explainer must not add long frames to the catalogue's.

Look at desktop (1600 × 1000) and phone (390 × 844): moments in Auto, each held view at two or three moments, a chapter button clicked (the menu open on narrower bars), the timeline hovered, Space and the arrows. `./safe.sh node explainer-look.mjs <url> <dir> [W H]` does all of it (env `TIMES`, `VIEWS`, `VTIMES`), then `node sheet.mjs <dir> <sheet.jpg>`; it finds the bar's controls by role and name («Speed and chapters», `[data-play]`, `[data-slot=toggle-group-item]`).

Pharma explainer, 11-26: console, align, poster (RMSE 0.012 to 0.028), fallback and loadtrace PASS. perf: go-live frame 67 ms at 20 Mbps (catalogue 450 to 483 ms); playback 6 frames over 250 ms, the catalogue 4 at the same moments (about 2 s and 14 to 19 s after live) with the load average 4 to 7: those come from the shared scene.

## 7. Faults met

| What you see | Cause | Fix |
| --- | --- | --- |
| The menu opens off screen (`translate(0, -200%)` for good) | its trigger inside a `Tooltip`: the trigger's anchor registers with the tooltip's popper, the menu never gets one | the `Tooltip` outside the whole `DropdownMenu`, on a wrapper span (PlayerBar does it) |
| «GPU stall due to ReadPixels» in the console, frames of 300 ms to 1.9 s | reading the WebGL canvas synchronously (`readPixels`, or `drawImage` of it into a 2D canvas every 300 ms) | `world.sample`: a pixel buffer and a fence, read a frame or two later, only on cuts, seeks, view changes and every 1.5 s |
| go-live frame of 450 to 680 ms | the first composer render compiles the post-processing passes | a warm-up `world.render` of the scene alone before the reveal; never `ui.update` there (it moved the CSS title's words: loadtrace failed) |
| A gate «exposes neither … __plSeek (need DEV server)» on the dev port | `kill $P` after `npx astro preview` killed npx, not astro: the leftover preview servers took the next ports | start the preview with `node node_modules/.bin/astro preview` |
| The shell running a command dies (exit 144) | `pkill -f <pattern>` matched its own command line | find the server's PID by its port (`ss -ltnp`) |
| The chapter's name over a black slot frame or a post | the film's close shots and every closer held view fill the top left | the name only where a view keeps the top left clear (section 5) |
| The end titles over the machine in a held view | the held pose replaced the film's title frame | held views only between the opening and the results |
| A capture right after editing the vendored block errors | Vite re-optimises and reloads the page | load the page once (`curl`) before capturing |

## 8. A piece received from outside

The second explainer (11-26) came built by another agent as a Vite + TypeScript + three.js + GSAP page. Its 3D stayed; the page layer was rebuilt on the rule book's «Two variants» rules. How:

- **Before and after at the same moments, first.** One capture script for both (`scripts/look.mjs` there: the piece's `window.__player = { timeline, ready }`, `?t=`, `?demo=`, controls found by role and name, so the old chips and the new bar are both found), the before from a worktree of the tag on its own port, stopped before the after starts; sheets side by side in the project’s review directory.
- **The bar in a plain Vite app**: `node scripts/vendor-design.mjs <dir>` (design-system) works on any folder with a `package.json`; add `@vitejs/plugin-vue`, `@tailwindcss/vite`, the `@aisgroup/design` alias in `vite.config.ts`, a `*.vue` shim for `tsc` (exclude `src/vendor`: vue-tsc checks it upstream), and one Tailwind root (`@import "tailwindcss" source(none)`, the vendored `styles.css`, `@source` on the bar's `.vue`). Loaded as static Inter (fontsource), set `--font-family: Inter, …` on `:root`: the vendored tokens name `Inter Variable`. Mount the bar with `createApp(Bar).mount(el)` on a reactive state the clock owns (`explainer/player.ts`).
- **A demo with its own clock**: PlayerBar's `actions` slot (it gets `menu: true` inside the menu, under 768 px: give a `DropdownMenuItem` there, a `Button` in the row). In the demo, switch the state the bar reads: `duration`, `chapters` (the steps), `views: []`, `time` from the demo's clock; `seek` and `playing` act on it; restore all on the way back.
- **Chapter presses** reach the piece as a `seek` to a chapter's exact time: tell them from a scrub by that and a jump of more than 0.5 s, then fly the camera into Auto (`explorer.setManual(pose); explorer.backToTour()`).
- **The stage that filled a 1920 × 1080 box fills the window**: size the renderer and the camera from the stage; `lensFor(fov, aspect, hero, lift)` (the piece's `logic/cameraKeys.ts`) widens the vertical field for stages narrower than 16:9 (down to 0.9:1), applies the titles' framing (`HERO`: zoom and shift as fractions of the stage) and lifts the picture by half the bar's room, all through `camera.setViewOffset`, so no pose changes.
- **The kit's marks from the 3D**: project the product's bounding box's 8 corners for its frame; hide it where a ray from the camera to its top meets an opaque, visible part of its line (skip transparent and additive materials: fans, lasers). Draw the frames first, then each tab on the first free corner.
- **Gates**: `npm run typecheck`, `npm test` and `npm run build` through `safe.sh`; the before's tests that described the old HUD are rewritten to the new one, the physics, schedule and determinism tests unchanged.

| What you see | Cause | Fix |
| --- | --- | --- |
| A label never shows where parts stand close (the third of three machines) | its leader brushed the corner of the neighbour's tab | the leader's clear box stops 8 px short of the part; then a leader twice as long |
| Two defect tabs on top of each other | two flagged products in consecutive rows | each tab on the first corner of its frame that covers no other frame or tab; none free: the frame alone |
| The logo stays blue on a dark ground after a view change | the probe read the frame mid-flight and nothing drew after the camera stopped | when the picture has rested 250 ms since the last read, draw once more and read |
| The titles' framing jumps in as a view hands back to the film | it applied the moment the camera's mode changed | ease it in and out over 1 s |
| The results' labels unreadable at the end | they stood over the dark floor | a stronger titles' framing (zoom 1.65, shift 0.2 × 0.27) so they stand on the light wall |
| The end frame after an orbit caught the camera mid-blend | the capture waited 0.8 s | let the camera settle (2.8 s) before the end frame |


## Checking labels against the reference

Inventory each source label by shot, wording, object and role. Map part names to anchors, process claims to captions and verdicts to the inspected product. For a demo with its own clock, walk each step through the player on desktop and through the phone menu. Confirm the title, step caption and product are visible together.

Keep part tabs 20 px high with Inter Medium at 12 px. Flex-center a child text span on both axes as appropriate and apply `text-box: trim-both cap alphabetic` to that span. Inspect a capital or lining digit at native size. Compare the visible ink with the plate edges. Lowercase descenders extend below the baseline.

Save the expected words independently of the scene code. Select each settled caption and each required part, including the busiest rejection frame. Use selectors for opaque plates with solid text and background colours. For example, a piece that holds at `?t=9` can use this fixture.

```json
{
  "ready": "#app.ready",
  "tabs": ".lbl__tab, .mark__tab, .verdict, .cap span",
  "frames": [[9, ["Rotary Sandwich Machine outfeed", "Eight lanes on a 500 mm belt,"]]]
}
```

Run `scripts/safe.sh node scripts/label-frames.mjs <page-url> <fixture.json> <capture-directory>` from the skill directory. Use `timeParam` in the fixture for a different pause parameter. The script checks desktop (1440 × 900) and phone (390 × 844), writes the frames and reports missing words, clipped plates and unequal top/bottom ink clearance. The tolerance is 2 CSS px between the two gaps, equivalent to 1 px off centre. Lowercase-only text is checked for presence. Inspect the saved frames for correct leader endpoints and occlusion. If a bank of identical parts is labelled, a visible end unit can provide a clear anchor. Check the same shot with the defect marks and evidence displayed.

For unplated titles or result counts, add their selector as `plainText` and their expected strings as the third entry of a frame. Pick a hold after the count finishes. Check each rendered line against the viewport, especially long technical terms on phones.

### Shared controls and source fidelity

Use the design-system PlayerBar for viewer-controlled explainers. On desktop verify play/pause, seeking, chapters, speed, views when provided, and fullscreen. On a phone exercise the menu, select a chapter, and return from any separate demo. Set each horizontal toggle group’s orientation explicitly. At native size measure the sum of the neighboring border widths. Each interior divider is 1 CSS px. Run `scripts/safe.sh node scripts/player-controls.mjs <page-url>` to test those joins, play/pause and the phone menu in the assembled page. Preserve keyboard focus and the selected chapter’s brand colour.

For each number and factual label in the film, record where it comes from in the brief or original scene. Keep the units and qualifiers. Identify simulated readings, staging decisions and differences between the written brief and a photograph in the review notes. A sample station’s dimensions, defect rate and evidence images belong to that example.

### Operators working at a machine

Use the written brief, including a free-form prompt, as a source for rate, scope and sequence. A photo can establish the visible mounting, finish or belt colour. Keep the product photo and the HMI test record identified separately when they show different articles.

For manual work, review the film at the pick, insertion, release and deepest bend. Start with the product and its contact points. Solve the arms to those targets, fit shoulders and sleeves to the solved joints, then check the figure in the actual camera. Inspect the visible gloves, head, legs and shoes against the guards, table, carton and floor. For walking or lowering a load, animate foot placement and knee bend. Film both sides of a mirrored station. Place the label clear of the face and the working hands.

On the machine close-up, check how each pictured component is supported. Show the gland and cable termination, the mount holding the head, the transfer height and the route into the next operation. Keep known interfaces and dimensions when improving the surfaces. Compare the same moment at the same camera position before and after an edit.

A reusable Three.js figure is in `examples/operator/workwear.ts`. The upright upper body takes its origin at the hip and faces +z. Place it at 0.62 m for the example proportions. Use `lowerBody()` for a standing operator or `packingLegs().update(hip, yaw, step, dx, dz)` for a case transfer. Fit sleeves to the shot’s shoulder and grip targets. The mask, cap and uniform are illustrative wardrobe choices.

## Matching an existing series

When a brief asks for another scene like an approved explainer, keep that piece open at its overview, closest machine shot and final frame. Reuse its camera framing, lighting, surface materials, overlay styles and player. Bring the new line, prompted claims and sequence into that composition. Use supplied photos to model the product and equipment and the real software capture on its Panel PC. A reference gallery beside the canvas changes the format. Only show evidence beside a shot when that beat calls for it.

Inspect the first working station on desktop and a 390 × 844 phone. Look at the entire frame beside the approved piece, including operator reach, object scale, separation between gloves and product, and what the metal reflects. Use the neutral operator example where wardrobe is undocumented. Reserve identifying colours for their documented role. Inspect visible labels at full scale: square white tabs, centred type, single hairlines and bare leader ends.

Run `scripts/safe.sh node scripts/explainer-frame.mjs <paused-shot-url>` on the viewer-controlled version. It measures the visible canvas after clipping by its ancestors and checks the bottom player and legacy circular markers at both viewport sizes. Use the rendered label inventory and frame comparison for missing labels, unfamiliar marker implementations and material fidelity.

The AIS typography rule centres capitals and numerals inside controls. Wrap the words in a cap-trimmed label, including custom action slots. The player control check now measures actual painted capitals in buttons on desktop and menu items on phone, with a one CSS pixel centre tolerance. Descenders can extend below the common baseline.
