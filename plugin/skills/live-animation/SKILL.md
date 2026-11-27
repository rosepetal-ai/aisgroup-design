---
name: live-animation
description: "Build and review AIS Three.js inspection films and viewer-controlled machine explainers, including the station, materials, scene-linked evidence and branded player."
---

# live-animation

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../ais-brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

Use this skill for live three.js solution pages on the website (`/animations/*`, pilot `pharma-line`) and their explainer variant with viewer controls, review rounds on pacing, camera work, overlays, UI alignment or loading, and before every release. Rendered videos belong to `brand-video`; static renders belong to `product-render`.

1. Read the [rules](references/rules.md) whole before touching a piece, and write every new review remark down as a rule before fixing it.
2. Read [live-animation workflow](references/workflow.md) for the piece contract (`data-anim-stage`, `window.__anim`), QA scripts (`scripts/`), asset rules, single-workspace hygiene and the release checklist.
3. Run every heavy WebGL capture and build through `scripts/safe.sh` (one Chromium at a time), pass every automated gate (`console.mjs`, `align.mjs`, `poster.mjs`, `loadtrace.mjs`, `fallback.mjs`, `perf.mjs`), and inspect desktop and `390×844` phone contact sheets before publishing to the preview channel.

Use [explainer story](../explainer-story/SKILL.md) for the RSM sequence and composition, [scene assembly](../scene-assembly/SKILL.md) for working machine assemblies, and [scene motion review](../scene-motion-review/SKILL.md) for body, product and equipment contacts.

For a new free-form brief, follow [building an AIS machine explainer](references/from-a-blank-brief.md). Build one sourced mechanism in the intended player, review its normal-speed action and verify the full assembly before extending it across the line.

For a scene built from scratch with a human handoff, start with the [working packing-transfer example](examples/packing-transfer/README.md). It ships a complete rigged person, a dimensioned actuator and an audit of the rendered contact surfaces. Choose a person whose clothing, proportions and range of motion suit the task before authoring the gesture. Fit the station around the actual reach and grip. Equipment finishes come from the references. A colour used in a quotation to distinguish scope belongs to that piece only.

When an operator is approved in a study, use that rig in the normal player. The [full-line adapter and contact check](examples/packing-transfer/README.md#using-the-operator-on-a-production-line) cover repeated stations, independent skeletons, product-specific grasps and backward seeks. Review the actual pickup and set-down from the delivery camera before handing over the film.

For operator handling, badges or suspect machine geometry, use the [physical scene review](references/physical-scene-review.md). Use it to match the supplied machine markings and highlight colours, fit the operator to the work, and check the rendered grips and mounts in motion.

For a viewer-controlled animation in an existing series, start with its approved full-window scene and overlay layout. Check the first working frame against that reference with [the composition check](references/explainer.md#matching-an-existing-series) before extending the film.


## Starting from a quotation or an existing animation

Accept the salesperson’s or marketer’s free-form request with the quotation, specifications, reference images or source project in the form supplied. Extract the audience, the machine’s sequence and the claims needed for the story. Track each displayed figure and qualifier back to the supplied page, drawing or source scene. Carry proposed options through as options. Keep pricing and other commercial details out of an engineering explainer unless requested. Ask a focused question if a conflict changes what the viewer would see or what AIS is promising.

Use the supplied project for customer-specific facts. Use the design MCP for shared brand resources and the studio catalogue for approved imagery. When an exact machine reference is missing, identify it; a catalogue image of a similar machine cannot establish its construction.

For an existing animation, run the original and capture representative shots before editing. Compare the revised shots with those captures and the quotation. Keep customer-specific facts and assets in the project. Add a reusable technique or check to the skill when it also applies to another machine, and try it against a different brief before treating it as a default.

## Starting an inspection explainer

For a guarded reader brief, create an editable project with `node scripts/animation-build.mjs create <project> --prepare-only` from the plugin directory. Read the free-form brief, adapt the product, visible action, identifiers, outcomes and copy in the new project, then run `node scripts/animation-build.mjs build <project>`. The project installs its own toolchain and retrieves the pinned hardware from private Cloud Storage on first build. Run the project’s playback check on its exported HTML. [Guarded reader example](examples/enclosed-inspection/README.md)

For an indexed line that diverts a failed carton sideways, start the editable project with `--example side-rejection`. Use its guided pad, level receiver and separate return stroke as an illustrative example when those actions fit the brief. Review the push from the moving camera and the mechanism view with captions hidden.

For a guarded carton reader, open the [working enclosed inspection scene](examples/enclosed-inspection/README.md) first. Reuse its full-window composition, hall, title, timed message and shared controls. Follow one carton from the overview into the reader shot, then show the evidence for that carton. Select the hardware for the actual brief. The reference build uses manufacturer frame profiles, feet, bearings and a mounted optical assembly.

Build one instrumented station first. Establish the product dimensions, direction and speed of travel, inspection point, observable defect and reject mechanism from the brief. Use [the transport example](examples/inspection-station/transport.mjs) for a seekable master clock. Draw each product, its missing part, its detection mark and its Monitor record from the same returned ID. Show its verdict after inspection. Draw the mark only while the marked surface is visible. The example uses illustrative dimensions.

Run `node --test examples/inspection-station/transport.test.mjs` from this skill directory. Check the same item before the sensor, after inference and during rejection, then seek backwards. Add a passing neighbour to the shot to make a mismatched mark visible.

For the first lighting pass, use [the RSM material implementation](examples/inspection-station/materials.ts) with the host’s Three.js installation. Share one palette across repeated parts. The brushed steel expects metre-scaled UVs and an environment reflection. The anodised aluminium handles parts with inconsistent tangent directions. Dispose the palette when tearing down the scene. Profile the opening wide view and the closest screen view separately on the target device. Check the silhouette, grain and legibility at the same camera position after optimisation.

Once the scene can seek and project part anchors, adapt [the explainer template](templates/explainer/page.astro) using [the integration guide](references/explainer.md). The host supplies the scene, story and UI layer. The starter includes the shared Vue PlayerBar and its imported components in `templates/explainer/vendor/aisgroup/design/`. Copy that directory to `src/vendor/@aisgroup/design/` in a new host, or use the host’s matching design-system package. Follow the integration guide for Vue, the alias and Tailwind sources. Replace the pharma inputs, claims and assets with the new piece’s sources. Test the assembled piece on desktop and phone. A passing transport test covers identity and timing. Inspect rendered evidence for occlusion, contrast, framing, logo clearance and whether the sensor image supports the claim.

To try the station independently, copy `examples/inspection-station/` into a Vite project with Three.js installed. Open that directory’s `index.html` through Vite and scrub from 1.9 to 3.5 seconds. Product three is missing its cap, passes the sensor, then drops through the gate while the next capped product stays on the belt. The range input is a development control. Replace it with the shared player when integrating a customer explainer.


For part labels and caption plates, inventory the reference by chapter and verify the rendered holds with `scripts/label-frames.mjs`. The [explainer guide](references/explainer.md#checking-labels-against-the-reference) includes the fixture and the cap-height check.
