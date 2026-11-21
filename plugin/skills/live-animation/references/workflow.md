# Live animations: workflow

How a live animation is built, checked and released. Read the [rules](rules.md) first; they decide what the piece looks like. The reference piece is the pharma line on the Rosepetal website (`/animations/pharma-line`).

## How a piece is built

| File | Holds |
| --- | --- |
| `story.ts` | The beat sheet `T`, extra cuts `CUT` and the speed curve `WARP` (slower where there is reading or a key physical moment), with `wallOf` and `storyOf`. Everything else reads its times from here. |
| `world.ts` | The scene and `SHOTS`: held shots with a slow move, joined by cuts (`track` follows the subject, `tall` widens portrait close-ups); the pushes into and pulls out of the Panel PC's screen; the physics hooks. |
| `ui/` | The filmed app (`app.ts`, copied from the real software), the explanation column (`index.ts`, `COLUMNS`), captions and panels (`panels.ts`), and the copy with its reading-time check (`data.ts`). |
| `views.ts`, `views.worker.ts` | The virtual camera images, made off the main thread in a WebGL2 `OffscreenCanvas` worker (with a main-thread fallback) and handed over as `ImageBitmap`s, so going live and playback never wait on GPU readbacks. |
| `main.ts` | One clock: wall seconds through `WARP` to story time. `?t=` holds a moment; development builds expose the debug hooks. |

### Piece contract

Every script works on any `/animations/*` page that keeps this contract.

- **Stage markup:** `data-anim-stage` on the stage container (it toggles `.is-type`, `.is-live`, `.is-still` and `.is-full`), `data-poster` on the poster `<img>`, `data-open` on the opening title's wrapper (its words inside `[data-mask] > span`), `data-full` on the full-screen button.
- **Performance marks:** `anim:model`, `anim:labels`, `anim:light`, `anim:assets`, `anim:compiled`, `anim:captures`, `anim:live`. The pharma piece uses the `pl:` prefix; `perf.mjs` reads both.
- **Development globals:** `window.__anim = { seek, wall: { wallOf, storyOf }, cam, scene, camera, THREE, renderer }`. The scripts also accept the pharma piece's `__plSeek`, `__plWall` and `__pl`.

## Process

1. **Content:** the original storyboard is the checklist; every claim, figure and beat stays.
2. **Shots** (rules, «Camera, framing and pace»): one subject a shot, whole and clear; long lenses outside, symmetric views inside; cameras well inside the geometry they film (check with `pick.mjs`); cuts on action and match cuts into and out of the machine; no compound moves, no worm's-eye views.
3. **Rhythm:** every caption and column holds, settled, characters ÷ 15 s + 1 s (+ 1.5 s for a picture or a chart). Key physical moments get a speed ramp in `WARP` (ease in, hold, ease out), back at full speed before any physics that plays in real seconds. Caption, column and cut change together.
4. **Review loop:** film the piece in wall time (`film.mjs` with `SHEET=…`), inspect every frame of every transition on desktop and at 390 × 844, fix, film again. Compare with the previous version, never only with itself.
5. **One workspace:** make every edit, including parallel agents' edits, in the website's working repository; copy into a release checkout only at release time.
6. **Release:** pass every automated gate below, then publish to a preview channel for review.

## Tools

The scripts are in `scripts/`. Run them from there, always through `safe.sh`: it starts a job only when enough memory is free, runs it in a capped scope that the kernel stops before anything else, and waits on the shared render lock (`/tmp/ais-marketing-render.lock`), reporting who holds it. One Chromium at a time; stop the dev server when you are not capturing. They need Playwright (from the nearest `package.json` that lists it, or `AIS_PLAYWRIGHT_ROOT`) and ImageMagick.

| Script | Does | Gate |
| --- | --- | --- |
| `film.mjs <url> <dir> <spec>` | One load, then seeks: `t1,t2`, `from:to:step` (story seconds) or `w:from:to:step` (wall seconds). Env: `W`, `H`, `DPR`, `HIDE`, and `SHEET=<out.jpg>` for contact sheets. | visual |
| `sheet.mjs <dir> <out.jpg> [cols] [tile] [per]` | Labelled contact sheets, never overwriting a frame. | helper |
| `camtest.mjs <url> <dir> <cams.json>` | Tries camera candidates `[{name, t:[…], cam:[px,py,pz, tx,ty,tz, f, fov]}]` over the live scene and UI. | visual |
| `pick.mjs <url> <t> "x,y;x,y"` | Prints the mesh, material, world point and normal under stage pixels, to diagnose near-plane or geometry glitches. | debug |
| `console.mjs <url>` | Development warnings (reading holds, reject gate, physics rate, missing worker captures) and runtime errors. | exit 1 on any warning or error |
| `align.mjs <url> [config.json]` | Titles' left edges against the header logo (≤ 2.5 px) and dialogs' centres against the app's screen (≤ 1.5 px), at four desktop widths. | exit 1 on a miss |
| `poster.mjs <url> <dir>` | The poster against the live `t = 0` at three desktop widths and at 390 × 844 (ImageMagick RMSE). | exit 1 above 0.06 |
| `loadtrace.mjs <url> [ms]` | Traces a real load every 60 ms: words rise once, no font-swap jump, the title holds at least 0.8 s after live. | exit 1 on a jump or restart |
| `fallback.mjs <url>` | `prefers-reduced-motion: reduce` shows the still poster, and the full-screen button shows on desktop. | exit 1 on a failure |
| `hold.mjs <url> <prefix> <t,…> [full\|bare]` | Fresh loads held at each `t`; works on production and live pages without the debug hooks. | visual |
| `perf.mjs <url> <seconds>` | Load marks, files over 20 KB and playback frame times on a production build or the live site. Warns when the machine is busy (load average over 4). Env: `NET=20` (20 Mbps, 40 ms). | exit 1 if a frame takes over 250 ms |
| `cull.mjs bake\|write\|verify\|film\|peek` | Bakes the machine triangles any shot sees (desktop and phone), writes a culled GLB, and verifies frames pixel by pixel against the original. Env: `MODELS_DIR`, `SRC_GLB`, `DST_GLB`, `URL`, `DURATION`. | 0 differing pixels |

## Assets

- Light maps are resized only in float (a box filter on the RGBE data): some ImageMagick builds clamp HDR at 1 and darken every reflection.
- Models and light maps are not committed. Copy them into the release checkout when they change, and preload what the scene needs before live from the page (`<link rel="preload" crossorigin="anonymous">`).
- Render the poster again (2700 × 1000 WebP at `t = 0`, with the opening title and the full-screen button hidden) whenever the geometry, the lighting or the first frame's camera changes.
- Models are only for the page that shows them: never offer a model or a mesh as a download.

## Release checklist

- [ ] Every review remark is a rule in the piece's review log before its fix.
- [ ] The type check passes for the piece.
- [ ] `console.mjs` passes: no warnings or errors.
- [ ] `align.mjs` passes: titles on the logo's edge, dialogs centred, at four widths.
- [ ] `poster.mjs` passes on desktop and at 390 × 844; the poster is rendered again if the first frame changed.
- [ ] `loadtrace.mjs` and `fallback.mjs` pass.
- [ ] The whole piece filmed at `w:0:<end>:1.5` (`SHEET=…`), transitions inspected at 0.05 story seconds, phones filmed at the key moments, the close-ups and the evidence spans; inside shots checked with `pick.mjs`.
- [ ] If the model or the cameras changed: `cull.mjs bake`, `write` and `verify` (0 differing frames) before swapping the GLB.
- [ ] Production build; `perf.mjs` over playback (`NET=20` for the load, unthrottled for playback), with the machine's load average under 4: no frame over 250 ms, time to live noted.
- [ ] Release checkout: copy the code and the changed assets and poster, commit with explicit paths, build through `safe.sh`, and publish to the preview channel as its own command. Check that no other session published to that channel in between, and verify the new bundle live and the home page unchanged. Never production without the owner's go.
