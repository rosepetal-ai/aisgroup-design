# Product post

**Look:** as the approved kit post (`pieces/posts/01-hopper/`, the guide's *How a post is built*): **blue**, the machine working on its line from the top edge down to a brand-blue panel with the headline and the logo; `"look": "blue"`, `"bleed": 1.15`. Every post carries the hexagon corner, drawn by the engine. The post system in `docs/recipes.md` covers the other looks.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-product.json` (the approved Hopper post, one blue `hero` shot, `4x5`). Approved example: `pieces/posts/01-hopper/` (ES and EN).

## What it is for, and when not

One machine, whole, on the studio sweep, with its name and what it does. It says "this is what we build".

- What it checks on one real product, with chips on the parts: **callout**.
- The defects it catches, as pictures: **features** (defect tiles) or a defects carousel.
- A software screen: **software** or **features**.
- Context, detections and proof together: a product carousel.

## The template

A blue `hero` shot: the machine working on its line, from the top edge down to the brand-blue panel with the headline and the logo.

## The brief

- Which machine? Its exact name.
- What does it check? One line from its article, datasheet or brochure (`pieces/brochures/<machine>/`).
- Will it go to Instagram too? Add `1x1` to `formats`; the studio exports the 4x5.

## The picture

- **Qualifies:** the machine on its line: a real photo of that exact machine, sharp, or its approved in-line render (`library/media/3d/renders/<machine>/`, as the AIS Hopper's `hopper_juice_infeed_cover.jpg`). The exterior views on grey (`library/media/3d/machines/<machine>/_01_3q-left_light.jpg`) belong to `showcase` posts with the light look. Never another model's picture.
- **Available today:** AIS Hopper final (`hopper/hopper_01_3q-left_light.jpg`, 3000 px). Historical note: AIS KARIKÓ and AIS REV 360 Compact had 700 px previews; inspect current files rather than assuming they still exist only as previews in `library/media/3d/machine-previews/`: they would be upscaled past the limit. Say so, offer another type (features with defect tiles, callout) and ask for the final.
- **Framing:** `bleed` 1.15 and `focus` so the line runs off the side; the render fails a subject under 55 % of its band (`picture-empty`).
- **Never:** the "kariko-real" hero, `real/rev360_inside-render.jpg`, corrupt product badges (preserve approved AIS demo packaging), any wrong or physically implausible machine, any view with open guards or internals.

## Structure

One `hero`: `look: "blue"`, `src`, `evidence: "render"` for renders (no caption appears), `bleed`, `focus`, `headline`. No `text`, no `items`, no caption chip.

## Words

- **Headline:** what it does, two lines at most, plain ("El tapón y el llenado, revisados en la línea"; "Cap and fill level, checked on the line").
- **Copy:** what it checks, on what, how it is set up; one approved call to action. Write the sentences around it anew every time. Never say how the picture was made.

## Mistakes to avoid

- A similar machine's picture because the right one is missing.
- A preview stretched into a post.
- Adding a `text` line or chips: details belong in the caption or a carousel.
- Claims only another model's datasheet supports.

## Before publishing

- The line and the caption match the machine's article or brochure.
- The machine view is `approved` in the catalogue.
