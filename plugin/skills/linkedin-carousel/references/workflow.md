# linkedin-carousel production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder.

One idea per slide, one message for the whole carousel, one action at the end.

**The engine enforces** the [shared workflow](../../_shared/WORKFLOW.md)'s *Brand rules the generators check* and the text check: the cover at least its slot's size (above 1.25× fails, above 1× warns; a video frame warns until a photograph exists); Spanish and Catalan thousands 30 000 and 7200, never 30.000; no render, CAD, 3D or middle-dot separators in text or alt text; round-label wine renders only; client logos blurred. Only `engine/render.mjs` on `engine/stage.html` and `templates/*.json` makes posts and carousels.

**With the studio tools** (no shell), steps 3 to 5 are: `edit_piece copy` the template `plan_piece` lists first (or a `pieces/posts` recipe); `update` each slide's `changes` with `shot` set to its index (`src` as the picture's `library/media/…` path); `export_piece enqueue render-pdf` with `saveAs`. Then step 6 on the exported PDF and slide PNGs.

## 1. Choose the type

| The message | Type | Template | Playbook |
| --- | --- | --- | --- |
| Which one would you reject: the defects a machine catches on one product | defects | `templates/carousel-defects.json` | `types/defects.md` |
| This machine, what it detects and the proof | product | `templates/carousel-product.json` | `types/product.md` |
| Quality control for one sector's line | sector | `templates/carousel-sector.json` | `types/sector.md` |
| One inspection: what fails and what catches it | application | `templates/carousel-application.json` | `types/application.md` |
| A partner's product that we distribute | partner | `templates/carousel-partner.json` | `types/partner.md` |
| How to do something: steps or numbers to gather | guide | `templates/carousel-guide.json` | `types/guide.md` |
| What happened at an event we attended | event (a recap) | `templates/carousel-event.json` | `types/event.md` |

**Read `types/<type>.md` before you make it.** One image and one idea is a post (`social-post`). An event still to come is announced once, in the event post.

Reference carousels (their pictures are still `review` in the catalogue), ES and EN: `pieces/posts/20-carousel-juice-hopper/` (juice, AIS Hopper), `21-carousel-vials-pharma/`, `22-carousel-cans-reference/`, `23-carousel-muesli-reference/` (the strongest). Start from the closest one.

## 2. Steps

1. **Brief.** Brand, language, audience, the one message, the one action. Then the playbook's questions. A customer named in the request sets the audience; never their name on slides without approval.
2. **Pictures first.** List every picture the slides need and check each exists at full size (`library/media/3d/renders/<machine>/`, the catalogue). A defects carousel needs a clean lineup or pair for the cover and one OK/NOK pair per defect with Spanish and English overlays (`<shot>_es.jpg`, `<shot>_en.jpg`). If one is missing, first look for an existing credible image. Record the gap privately; complete the independent source/copy work and only schedule the missing image work when the renderer has a turn.
3. **Recipe.** Copy the template or reference to `work/<slug>/recipe-<lang>.json`; `name` is `<brand>_carousel-<type>-<subject>_<lang>_<date>` (e.g. `ais-vision-systems_carousel-defects-juice-hopper_en_2026-10-29`). Adapt the narrative and slide count; cut a slide rather than pad one.
4. **Check.** `node engine/check.mjs work/<slug>/recipe-<lang>.json`. Fix every error; resolve or report every warning.
5. **Render** (Chromium, one job at a time):
   `python3 skills/_shared/scripts/safe_render.py -- node engine/render.mjs work/<slug>/recipe-<lang>.json`
   Output in `work/<slug>/out/`: the PDF, a PNG per slide, `_sheet.png`, `_copy.txt`, `_report.json`.
6. **Look.** Read the sheet, every slide, 2× crops of every overlay. Answer the [look checklist](../../brand-review/references/look-checklist.md) in writing; read it as a swipe; then the playbook's "Before publishing". Carousels with renders also get `render-review` before anyone sees them.
7. **Hand over.** The PDF goes to LinkedIn; PNGs for review or Instagram; `_copy.txt` is the post text. List what the person must confirm: rights, consent, figures, customer or partner approval, the machine's capability for each defect shown.

## 3. The slides

Layouts and fields: `docs/recipes.md` (The AIS layouts, Post and carousel slides).

| Layout | Use |
| --- | --- |
| `hero` | Cover, in the post system (`docs/recipes.md`, *The post system*): light by default (white, the message headline at the top and nothing above it, the product group cropped close to fill its band); `"look": "blue"` (a hard-edged photograph over solid brand blue) when the feed needs blue. No `text`, no chips |
| `panel` | Content. White (`"bg": "white"`, `split` 0.6): picture edge to edge on top with its OK/NOK chips, one headline; no caption, no overline. The flat-top step number at the foot is the one swipe affordance. Content slides stay white: same margins and type as the cover |
| `grid` | Two to six cells: icons (dark, hexagon pattern) or real picture tiles (`src`, `focus`, `scale`) |
| `callout` | Chips naming what is checked on one real product |
| `event` | A trade fair: our stand framed above, the event's rows |
| `contact` | The last slide, solid brand blue with the hexagon corner top right: `headline`, one approved `action`, two `rows` without labels (web, phone), set on one line, then the logo; no picture |
| `stat`, `quote` | One verified figure (`note`, `basis`, `evidence`); someone's exact words (`permission`) |

- **A five-slide example** (not a required count): 1 the cover question (light, or blue when the feed needs it); 2 to 4 one answer each on white; 5 the contact on brand blue. 3 to 10 slides allowed; exactly one `contact`, last.
- **Hexagons:** flat-top everywhere. The cover and the closing slide carry the post system's hexagon corner (one size, hairlines thinning from the corner, top right, never over the picture or behind words); content slides carry only the step number. The engine draws them all.
- **No gradients** (`gradient` fails).
- **No huge empty space:** `picture-empty` (subject under 55 % of its band) and `empty-strip` (over 12 % between elements) fail; fix the picture, never add filler.
- **Stock photos:** context only, as `social-post` says.
- **One grid:** every photo band in the piece shares one height (the engine works it out); the headline hangs at the same height on every content slide.
- **The headline is visible in the picture:** each slide's headline says what that picture shows.
- **Product pictures** are isolated on the `#F1F5F9` sweep: no conveyors, rails or line scenery. Machines appear only as their exterior views.
- Contact rows: aisvision.com and +34 931 003 035 (Rosepetal: rosepetal.ai), no labels, no address.

## 4. Pictures

- First choice: real photographs, screens and footage; our exterior machine views (`library/media/3d/machines/`); product renders and detection tiles (`"evidence": "render"`, no caption saying so). Otherwise a generated or composited picture only if it passes `brand-review` step 1 at its final size.
- **Within a carousel a picture appears once**, except the deliberate clean and reveal pair of the same product (the OK/NOK overlay versions). Avoid repetition that adds no meaning. Across pieces, avoid pictures already published (ask what went out); the templates and reference sets are examples, so reusing their pictures is valid when useful; preserve accepted imagery rather than replacing everything. Check: `grep -ho '@lib/[^"]*' templates/*.json pieces/posts/*/recipe-*.json | sort | uniq -c`.
- **Status:** `approved`, use it; `review`, usable once the person confirms what the catalogue reason asks; `rejected`, never; not in the catalogue, add it with `asset-library` first.
- **Size:** a band is 1080 wide and `split` × 1350 tall; the picture's height must be at least that ÷ 1.25. On inner slides the render warns above 1.25× and fails above 2× (the cover fails above 1.25×); "resolution-soft" means a bigger original, not a hand-over.
- **Crop out** other brands, half-cut interface chrome, burnt-in subtitles (`burnedIn` fails the render). Customer material: client logos blurred.
- **No captions** on carousel pictures: the post text names them.
- **Comparisons** put the reference (OK) on the left, or on top; the headline names the faulty one ("La de la derecha: …").

## 5. Words

- Write as [writing](../../communications/SKILL.md) says. Sentence case; names exactly; headlines three lines at most, broken by phrase with `|`.
- **Accent** (`*words*`) on one or two slides (cover and contact), only on the closing phrase; its ¿ ? ¡ ! take the accent: `¿Cuál de estos zumos|*rechazarías*?`. Inner headlines plain.
- The contact headline is new for every piece, bringing the question back to the reader's line ("¿Lo probamos|*con tus botellas*?").
- The post text (`copy`): two to four sentences (the question, what the machine checks and how, what the pictures show), ending on the same approved action as the contact slide (`engine/copy.mjs`). No figures without a `stat`.
- Native Spanish and Catalan, British English, both written, not translated. No middle-dot separators, emoji or typed arrows.

## Optional LinkedIn pattern

Use the shared [LinkedIn pattern instructions](../../linkedin-banner/references/workflow.md#optional-linkedin-pattern) when a pattern is requested for this format. They define allowed fields, sizes, asset retrieval and protected word, logo and photo zones.
