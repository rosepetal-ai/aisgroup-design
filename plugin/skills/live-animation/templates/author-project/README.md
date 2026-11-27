# AIS inspection animation

The editable station lives in `skills/live-animation/examples/enclosed-inspection/`. Start with the supplied brief, keep the sourced claims, and adapt the station story and product evidence there. The shared player, materials and hall are included in this project. The example README describes its illustrative hardware and its inspection cycle.

Use Node.js 22.12 or later. The first build uses npm to install the pinned tools and retrieves the pinned private model pack using the signed-in AIS Firebase or Google Cloud account. Later builds reuse its local cache. The standalone HTML includes its models, fonts, styles and player and can be opened offline.

From the project folder run:

```sh
npm ci --include=dev
npm run build
```

Open `index.html` to review the animation. After editing, run `npm run build` again. Use `npm run dev` for a live local preview while authoring.

To run the supplied desktop and phone checks, install the matching browser with `npx playwright install chromium`, then run `npm run check`. Alternatively set `CHROME_BIN` to an existing compatible Chrome or Chromium executable before running the check. Update the expected inspection outcomes for each new brief.

A local model library can also be selected with `AIS_SCENE_MODELS_DIR`, pointing at the folder that contains `industry/`. For an offline installation on another computer, use the separately supplied AIS model pack.

For a 4× view of a physical connection, run `npm run detail -- index.html detail.png <seconds> <x> <y> [view]` from this project. Choose x and y in the delivery image from 0 (left or top) to 1 (right or bottom). The renderer draws the selected quarter of the view at full resolution. Use the `reject` view for the opposite side of the pad. Inspect both faces of a contact over time in the player.

To export the built scene as a silent H.264 MP4 at 25 fps, install FFmpeg and Playwright Chromium (`npx playwright install chromium`), then run `npm run film -- animation.mp4` from the project directory. The export keeps the timed captions, logo and inspection evidence, and hides the interactive controls. Use `--no-captions` for a clean plate or `--size 1280x720` for a smaller export. Choose a new output filename for each export.
