# Enclosed carton inspection

Illustrative practice brief. «A carton reaches an enclosed inspection station. Show a good read and then a failed read. Help a buyer understand which carton the result belongs to. There is no manual handling in this shot. Use our explainer format. We have no measured case-study results.»

Two cartons share an indexing belt and pass beneath a fixed reader in a guarded tunnel. Its end openings provide the transport clearance. The example assigns A to the intact code and B to a code with a missing strip. The same carton record selects its printed artwork, position, read time, evidence image and anchored verdict. Both cartons continue on the belt. Replay, backward seeks and chapter changes recompute those records from the same timeline.

The process and outcomes come from the brief. The guard, reader geometry, carton identifiers, cause of the unreadable code and thirteen-second sequence are illustrative. The evidence plate enlarges the printable artwork used in the scene. Its OK and NOK values are scripted outcomes. No camera capture, decoder, installation claim or performance measurement is implied.

## Adapt an incoming brief

Sales supplies ordinary notes and references. The author prepares the editable project, then translates its facts into [job.mjs](job.mjs). Keep article IDs and read outcomes exact. Set `transport` to `continuous` when the read takes place in motion, or `indexing` for a stop under the reader. At the closing hold verify the full article IDs inside their evidence plates and the results on their moving cartons. Set the opening title, chapter labels, captions and accessible description for the buyer. For a read-only inspection, write the captions against its six visible beats. Choose a taped carton or a paperboard sleeve around a carton when either construction matches the reference. Inspect a different package or process in its own geometry and timing.

One item record feeds the printed side, Code 39 artwork, evidence, verdict and downstream tracking frame. Use source artwork when a different printed mark or symbology is specified. The two-item inspection study illustrates the supplied outcomes. The reader and dimensions are illustrative until the brief identifies installed hardware.

Build the project and run its check against the resulting HTML. Then compare the visible words, print and actions to the original brief independently. On both screen sizes, seek through each inspection, follow the second article out of the guard, jump back to the first and play through with captions hidden.

## Show an indexed side reject

From the plugin root run `node scripts/animation-build.mjs create /path/to/scene --example side-rejection` for the working example. Add `--prepare-only` to adapt it before building.

Use `reject: "side-pusher"` for a brief that calls for a physical sideways transfer. This worked sequence uses two taped cartons on an indexed belt. The first passes the read and stays on the conveyor. The second fails, reaches a guided pad, transfers onto a level tray and stays there when the pad retracts. Both reads keep their original article IDs. Identify the actuator, receiver and cycle dimensions as illustrative unless the quotation specifies them.

Give the job a fourth chapter for the transfer and two additional captions covering the push and the return. The failed carton stops at 12.25 s, the pad makes contact at 12.85 s, the carton reaches the tray at 14.30 s and the pad starts back at 14.60 s. The passing carton advances again before the 16.65 s end. These are demonstration timings. Adapt the clock and camera together for a different sequence.

Use the Pusher view and Auto to inspect approach, contact, full extension and recovery. With captions hidden, follow the NOK frame onto the tray and the OK carton along the belt. At the closing hold both verdicts should still be visible on their cartons. Check that the reader guard leaves the logo on clear ground in the desktop shot. The case regression checks both item paths and the projected pad, contact point and receiver against the viewport and player. Its deliberately broken cases displace the pad, lower the tray, prevent the return or select the wrong article. For a different reject mechanism, check its own contact surfaces, supports and actual destination.

## Build from the installed plugin

From the installed plugin directory, prepare a new directory for the brief. Edit the copy of `skills/live-animation/examples/enclosed-inspection/job.mjs` inside that new directory.

```sh
node scripts/animation-build.mjs create /path/to/scene --prepare-only
node scripts/animation-build.mjs build /path/to/scene
npm --prefix /path/to/scene run check
```

The build retrieves the approved pack through an AIS account with read access and installs its pinned Node dependencies. The result is `/path/to/scene/index.html`. A developer with a local copy of the model library can set the following override.

## Use an existing Vite host

Set the environment variable below to use a local copy of the studio industry model library. The build imports selected manufacturer GLBs and the kraft texture directly from this directory and embeds them in the local preview. This example distributes source only.

```sh
export AIS_SCENE_MODELS_DIR=/path/to/astro/public/models
```

Use the [station kit](../station-kit/README.md) host dependencies. Preserve the plugin directory structure, including the shared design-system PlayerBar, station-kit hall, series stylesheet, inspection-station materials and brand overlay renderer. From the plugin root:

```sh
vite --config skills/live-animation/examples/enclosed-inspection/vite.config.mjs
vite build --config skills/live-animation/examples/enclosed-inspection/vite.config.mjs
node skills/live-animation/examples/enclosed-inspection/pack.mjs skills/live-animation/examples/enclosed-inspection/dist /tmp/inspection.html
```

Open the resulting file directly or through the development server. Seek to 3.4 seconds for carton A’s intact read, then to 8.4 seconds for carton B’s interrupted print. At 12.5 seconds the failed item has cleared the guard and carries its frame. Move back to 3.4 seconds and check that the evidence belongs to A again.

## Review

Use the RSM evidence plate on the desktop title-safe right and under the logo in portrait. During playback captions rise over 500 ms and exit over 180 ms. When paused, the current message is fully readable. The short inspection ends on its observable outcome. Include a quantified results shot only when the brief supplies those figures.

At 1440 × 900 and 390 × 844 the independent build was checked at both detection boundaries, after downstream travel and after backward seeks. The checks exercised play/pause, caption visibility, the desktop chapter button and the phone menu, and confirmed that opening the standalone file made no network requests. The entry, read, failure and outfeed were inspected in both viewports.

On the manufacturer-model build, the geometry regression sampled both carton bodies at 261 times. Their bases stayed within 0.00001 m of the belt top and their sampled bounds cleared the fixed hardware. A 0.15 m lateral displacement made the regression detect contact with the guard assembly. At both read holds, the optical ray met the corresponding printed face. With captions hidden, full-speed playback progressed from two pending reads to OK for A, then NOK for B.

For another product, replace the two sample articles, their printed evidence, station geometry, camera targets and the independent expected outcomes. Reuse the shared player, overlay renderer, materials, hall and scene typography.

Run the regression from the live-animation directory with a configured Playwright host:

```sh
scripts/safe.sh node examples/enclosed-inspection/check.mjs file:///tmp/inspection.html
```

## Illustrative hardware selection

The illustrative station uses the MiniTec 45 × 45 F frame, 45 × 90 F conveyor rails, 90 × 90 L columns, GD feet, angle connectors, guard hinges, bearings and drive/tensioning rollers from the local manufacturer library. The Basler ace 2 GigE body, Computar V1226-MPZ lens and SVL RM75 ring light share the source assembly’s optical origin. Its 25.4 mm extrusion slice extends along local Z. The camera and lens look along local +Z, the ring mounts at 30 mm, and the diffuser sits at 46.6 mm. Both read chapters bring the camera inside the wide overview framing. The Reader view holds the optical head and carton together.

Library asset provenance and model conversion details live in the local industry directory’s `sources.txt`. The source manufacturing-line assembly’s `station.ts` and `parts.ts` establish the axes, inspection head components and material roles. The hardware selection demonstrates one possible arrangement. The brief supplies no installed equipment list.

The direct-directory override `AIS_INDUSTRY_MODELS` accepts the industry folder itself.
