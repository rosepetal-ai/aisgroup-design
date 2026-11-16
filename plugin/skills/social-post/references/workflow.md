# social-post production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder.

One image, one message, one action. The action goes in the caption, not on the image.

## 1. Choose the type

| The message | Type | Template | Playbook |
| --- | --- | --- | --- |
| This is the machine and what it does | product | `templates/post-product.json` | `types/product.md` |
| What it checks on one real product | callout | `templates/post-callout.json` | `types/callout.md` |
| What the software reads on its real screen, or the defects a machine catches (defect tiles) | features | `templates/post-features.json` | `types/features.md` |
| Come and see us at a fair | event | `templates/post-event.json` | `types/event.md` |
| Something happened at the company | news | `templates/post-news.json` | `types/news.md` |
| We were at an event; this is what we did | recap | `templates/post-recap.json` | `types/recap.md` |
| The software working in production, one screen | software | `templates/post-software.json` | `types/software.md` |
| One figure from a published, approved case study | result | `templates/post-result.json` | `types/result.md` |
| Someone's exact words | quote | `templates/post-quote.json` | `types/quote.md` |

**Read `types/<type>.md` before you make it.** More than one idea, or a "which one would you reject" question with answers, is a carousel (`linkedin-carousel`). Isometric illustrations are paused: a recipe with one fails.

The current source set, with ES and EN recipes, is `pieces/posts/` (check review status per piece; renders go to each piece's `out/`). Look at the one closest to the request before writing.

**Post export checks:** follow the [shared generator checks](../../_shared/WORKFLOW.md). `engine/render.mjs` validates source pixels, number formatting, prohibited production terms and separators, wine labels and customer-logo treatment before exporting the post.

**With the studio tools** (no shell), steps 2 to 4 are: `edit_piece copy` the template `plan_piece` lists first (or a `pieces/posts` recipe); `update` its `changes` (`headline`, `text`, `copy` for the caption, `src` as the picture's `library/media/…` path); `export_piece enqueue render-png` with `saveAs`. Then step 5 on the exported PNG.

## 2. Steps

1. **Brief.** Brand, language, audience, the one message, the one action, formats (`4x5` default; `1x1` Instagram, `191x1` link share, `9x16` stories). Then the playbook's questions. Ask only what the request and the library can't answer. "For a ready-meals customer" means the words speak to that sector's plant manager; it never names a customer without approval.
2. **Recipe.** Copy the template to `work/<slug>/recipe-<lang>.json`; `name` is `<brand>_post-<subject>_<lang>_<date>` (e.g. `ais-vision-systems_post-kariko_es_2026-10-29`). Change words and picture; keep the structure. Spanish and English are two recipes from the same pictures.
3. **Check.** `node engine/check.mjs work/<slug>/recipe-<lang>.json`. Fix every error; resolve or report every warning.
4. **Render** (Chromium, one job at a time):
   `python3 skills/_shared/scripts/safe_render.py -- node engine/render.mjs work/<slug>/recipe-<lang>.json`
   Output in `work/<slug>/out/`: a PNG per format, `_copy.txt` (the caption), `_report.json`.
5. **Look.** Read every PNG at full size and at feed size (about 550 px wide), then 2× crops of the picture's subject. Answer the [look checklist](../../brand-review/references/look-checklist.md) in writing, then the playbook's "Before publishing".
6. **Hand over.** PNGs, `_copy.txt`, and what the person must confirm: rights, consent, customer approval, figures, the capability claim for that machine.

## 3. The look

- **Image first.** The picture takes most of the post; the words are one headline, with nothing above or beside it (no product name, eyebrow or subtitle; the post text names the product). No body text, no rows, no icon chips (except the callout's chips).
- **One post system** (`docs/recipes.md`, *The post system*): three looks on one grid, set with `"look"` on the shot. **Blue** for machine, screen and event photographs (the picture on top with a hard edge over a solid brand-blue panel; no fade or gradient anywhere, the engine fails `gradient`); **light** for products and detections (white, headline on top, the picture filling its band: renders cropped to their product group, `bleed` and `subject` in `docs/recipes.md`; the headline grows into room a wide group leaves); **navy** for results and quotes, on white with `"look": "light"`. Headline 68 px and up, 64 px margins, logo small at the foot, bottom left. Across a set, a third to half of the posts blue or navy; pick the look that keeps the feed alternating.
- **The hexagon corner** on every post, one size, flat-top hairlines thinning out from the corner, flush to the edges: bottom right on blue, top right on light and navy, never over the picture, never behind words (the engine fails `hex-text`). Never draw it by hand; never put hexagons over a photo's subject.
- **No huge empty space:** the render fails a subject under 55 % of its band (`picture-empty`) and an empty strip over 12 % between two elements (`empty-strip`). Fix the picture (crop, render, look), never add filler.
- **Stock photos** for context only (a line, a product, a plant): Unsplash, Pexels or CC0 licences, each download in its own folder under `~/.cache/ais-group-design/refs/`, never executed; in both catalogues as `"origin": "stock"`, `"status": "review"` with URL, author and licence. Never as our machine, software or a customer; no readable brands, no faces as the subject; sharp at 1080 px, graded cool.
- **Pictures** at no more than 1.5× their native size on a post (the render fails above); every word at 4.5:1 against what is really behind it (checked on each render).
- **No captions inside posts** (K8): the post text names the picture. A `stat` keeps its source to one line (`note`); a `quote` sets name and role on one line. Those two are the only second lines a post has. The night field and the mono overline are video devices, never on a post.
- **A defect post** is a light `hero` or `callout`: one picture with its frame and chip from the overlay renderer (`brand/downloads/overlays/overlay.mjs`), boxes from the render's own overlay spec, never drawn by eye (`pieces/posts/02-kariko`, `06-rev360-pharma`; `pieces/posts/_build/assets.py` builds them). Comparisons put the reference (OK) on the left or on top.
- **Re-rendering the kit:** `flock /tmp/ais-marketing-render.lock nice -n 15 node scripts/social-kit.mjs --kit <marketing kit>/4\ LinkedIn` rebuilds the marked pictures from the library renders, renders every post and carousel with their checks, writes the contact sheets to `out/social/` and copies the files to the kit only when every check passes.
- **Products** are isolated on the sweep: no conveyors, rails or line scenery.
- **Accent** (`*words*`) on the headline's closing phrase only, or nothing. Its ¿ ? ¡ ! take the accent too: write `¿Cuál *rechazarías*?` and the engine colours the question mark with the phrase.

## 4. Pictures

- First choice: real photographs, screens and footage; our exterior machine views; product renders and detection tiles. Otherwise a generated or composited picture only if it passes `brand-review` step 1 at its final size. Never a machine view with internals or open guards.
- **Reuse across pieces.** Reuse accepted imagery when it serves the message; vary it where it matters; one post never shows the same picture twice. Record repeated pictures and their purpose privately. Check: `grep -ho '@lib/[^"]*' templates/*.json pieces/posts/*/recipe-*.json | sort | uniq -c`.
- **Status:** `approved`, use it; `review`, usable once the person confirms what the catalogue reason asks; `rejected`, never; not in the catalogue, add it with `asset-library` first.
- **Size:** never upscaled past 1.5× on a single post (the render warns above 1×, fails above 1.5×). A band across a 1080 post needs about 1000 px on the long side; full-bleed 4:5 about 1080 × 1350.
- **Crop out** other brands (stands, organisers' signs, other makers' machines), half-cut interface chrome and burnt-in subtitles (`burnedIn` makes the render fail). Customer material: client logos blurred.
- **Alt text** says what the picture shows; never render, CAD, 3D or illustration.

## 5. Words

- Write as [writing](../../communications/SKILL.md) says. Sentence case; names exactly; three headline lines at most (`|` breaks a line).
- The caption (`copy`): two to four sentences (what it checks, on what, what the picture shows), ending on one approved call to action from `engine/copy.mjs`. Vary the sentence around it; never "Más información".
- Figures only on a `stat` with `note` and `basis`. Capability claims come from AIS's own articles, datasheets or brochures for that exact machine.
- Native Spanish and Catalan (space before %: 95 %); British English. No emoji, typed arrows, ticks, middle-dot separators or hashtag walls.

## Optional LinkedIn pattern

Use the shared [LinkedIn pattern instructions](../../linkedin-banner/references/workflow.md#optional-linkedin-pattern) when a pattern is requested for this format. They define allowed fields, sizes, asset retrieval and protected word, logo and photo zones.
