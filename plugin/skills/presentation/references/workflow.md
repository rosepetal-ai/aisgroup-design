# presentation production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md): the sources, generators and brand rules every piece shares; it wins over anything below. Commands run from the plugin folder. Production rules: [production-rules.md](../../_shared/references/production-rules.md).

Decks are content files rendered by one engine, the approved «Hoy + azul» system: `decks/` (`build.mjs`, `layouts.mjs` and `layouts.css` for the layouts, `bands.mjs` for the spacing and empty-band checks, `verify.mjs`, `runtime/` for the stage and presenter, `to_pptx.py`, `assets/` with Inter, logos, Lucide icons, the hexagon fades, client logos and pictures). It is the only presentation generator. The approved decks are the references: `pieces/decks/corporate-2026/` (General 2026), `automotive/`, `beverage/`, `biscuits/`, `canning/` and `wine/`. Reusable sections are in `decks/sections/*.es.json`.

## The system

- 1920 × 1080, 128 px side margins, 12 columns of 102 px with 40 px gutters, top and bottom margins 96, 8 px baseline. The headline starts at (128, 96); content follows 64 px under it.
- Grounds come from the layout, never from the content: white content slides; brand blue (#17356E) for the cover, a case (`split`), key figures (`figures`), the company slide (`columns`) and the closing; deep blue for section dividers. No gradients: photos have hard edges (full-panel photographs on blue and white).
- Type, a closed scale in Inter: display 120, headline 76, lead/list name 44, body 38 (never under 36), label 28, meta 22 (slide number only). Sentence case.
- Hexagons only as the layouts draw them: the corner fade on blue slides, the pale fade on white opening and statement slides, the flat-top hexagon holding a step or phase number.
- The closing is «Gracias» with web, phone, LinkedIn and YouTube (`contacts[{k, v}]`), the logo top right.

## Corporate quality defaults

- Photos fill the 940 × 1080 side panel edge to edge wherever the source supports it at ≤1.3×. Cover panels remain 920 × 1080. Never generate, invent detail or upscale a file to disguise its real resolution. Search for a better original of the same subject; record any unresolved source limit.
- Facilities: use `pieces/decks/corporate-2026/source-media/sabadell-aerial-photo.jpg` (`ais-sabadell-aerial-deck` in the library). Never substitute the soft street facade or a map on an office/company slide. Reuse of this specific facility photograph on company and contact slides is deliberate.
- Stable Inter scale by layout: content headings 76/84; list names 44/60 and descriptions 38/52; three/four-column feature names 44/60 and body 38/52; figures 120/124 beside a photo; labels 28/38, number 22/32. Whitespace changes spacing, never the list type scale. Give actual screens and photographs priority over repetitive icon lists; `features.image` supports a proof photograph beside the original wording.
- No content-slide empty band above 15% (162 px), excluding deliberate covers, numbered dividers and quotations. Both `build.mjs` and `verify.mjs` enforce it. Layout, source-pixel scale, facility identity and full-panel geometry are checked alongside 2 px alignment.
- Rebuilds preserve every original text, figure, name and usable picture. Review numbered before/after pairs against the accepted deck, then every final slide at 1920 × 1080; retain an accepted slide if a trial is not clearly better.
To edit in PowerPoint, start from the PPTX of the closest deck in the kit; those have real, editable text. New decks come from the presentation skill. The Word letter template stays.

## Steps

1. **Brief.** Audience, language, the one message, how many slides, what it is for (a meeting, a section to insert in the corporate deck). Read the closest approved deck and section first; reuse their wording and pictures where true.
2. **Facts.** From AIS sources only: the machine's brochure (`pieces/brochures/<machine>/`), the approved decks in `pieces/decks/`. Rebuilding a deck keeps every original claim, figure and name as written; no superlatives, no figure without its source and conditions.
3. **Write the section** as `decks/sections/<topic>.<lang>.json` = `{"slides": [ … ]}`, so other decks can include it. Then a deck that uses it, `pieces/decks/<deck>/content.<lang>.json`:
   ```json
   { "meta": { "lang": "es", "title": "AIS Vision Systems, OPTICAIS", "file": "ais-vision-systems_opticais_2026_es" },
     "slides": [ { "include": "../../../decks/sections/hopper.es.json" } ] }
   ```
   A whole deck opens with a `cover` and ends with the `closing`; a section for the corporate deck opens with a `divider`.
4. **Build** (Chromium, one job at a time, under the lock):
   ```sh
   python3 skills/_shared/scripts/safe_render.py -- node decks/build.mjs pieces/decks/<deck>/content.<lang>.json
   ```
   Writes `<file>.html` (one file, CSS and JS inline, with `media/` beside it), `slides/NN.png`, `<file>.pdf` (vector text) and `<file>.pptx` (Inter text boxes, re-croppable pictures) next to the content file, and `build/checks.txt`. It must end in `checks passed`, or it exits 1 listing: text under its floor size, outside the slide or its box, over other text or a picture, or inside the top and bottom margins; a gap outside the rhythm (label to value 8, caption 16, item 24, block 40, headline to content 64) or text off the column grid; an empty band over 15 % of the slide height; the slide number and footer out of place; a non-cover picture enlarged past 1.3× (cover enlargement warns), missing or repeated; the hexagon fade near text or over a picture; production words (render, CAD, 3D, middle-dot separators, →, TODO, pendiente, borrador); PPTX with library metadata or file names as alt text. In Spanish and Catalan a point in thousands (30.000) stops the build before any output: write 30 000 (non-breaking space) and 7200. `--html-only` writes just the HTML (no Chromium); `--slides 1,3,4` builds a selection.
   Then `node decks/verify.mjs pieces/decks/<deck>/content.<lang>.json` (under the lock) walks every build step forwards, backwards and from the URL and fails if any frame differs from the exported slide. Both build and verification measure markers against the title's first line, row baselines, column rails, equal grid tracks and gaps, table columns and picture captions, with a 2 px tolerance (`build/alignment.json`, `build/verify/alignment.json`). Render the PPTX with LibreOffice and pass `--pptx-pdf <native-render.pdf>` to verification: actual text baselines and the complete visible text must match the PDF (`build/verify/pptx-baselines.json`). Personally inspect every exported PDF and native PPTX slide at full size.
   Through the MCP: `plan_piece` lists the approved decks as templates; `edit_piece action:copy source:pieces/decks/<deck>/content.<lang>.json`, `action:slots`, then `slotChanges` (`s<slide>.<field path>`, e.g. `s3.title`, `s5.facts.1.v`, `s2.image.src`); `export_piece render-html`, then `render-pdf` (PDF, PNGs, PPTX), same `build.mjs`.
5. **Look.** `python3 decks/sheet.py pieces/decks/<deck> ~/.cache/ais-group-design/review/<deck>-sheet.jpg 4 560`, read the sheet, then every slide PNG at full size. Answer the [look checklist](../../brand-review/references/look-checklist.md) in writing: one idea per slide, a clear title, the picture supports the message, nothing cramped or empty.
6. **Hand over.** The PPTX, the PDF and the HTML folder, what was actually checked and any real remaining limits.

## Layouts (`"layout"` on each slide; fields)

| Layout | Use | Fields |
| --- | --- | --- |
| `cover` | First slide, brand blue, picture fills the right panel | `title`, `lead`, `image{src, pos, alt, crop?}` (optional original-pixel `[left,top,right,bottom]` crop), `meta` (year) |
| `divider` | Section opener, deep blue, the deck's parts | `part`, `title` |
| `agenda` | The parts of the deck | `title`, `items[{title}]` |
| `statement` | One sentence, with a picture beside it if it has one | `title`, `lead`, `image` |
| `columns` | The company slide: names in columns, brand blue | `title`, `lead`, `columns[{title, items}]` |
| `split` | A case: picture beside its points, brand blue | `title`, `lead`, `image`, `points[{icon, text}]`, `wide` |
| `photo` | One picture to the slide edge; `panorama:true` uses a wide original below the text | `title`, `lead`, `image`, `panorama?` |
| `stage` | A machine on its line, facts, one detail picture | `title`, `lead`, `image`, `facts[{k, v}]`, `detail{image, title, text}` |
| `product` | One machine or product with facts | `title`, `lead`, `image` (`fit: contain`, `keep`), `facts[{k, v}]`, `tiles[{image, label}]` (two at most) |
| `phases`, `steps`, `milestones`, `gantt` | A process or a timeline | `items[{title, text}]`, `start`; `steps[{title, text, image}]`; `items[{date, text}]`; `months`, `rows[{label, from, to, tone}]`, `caption` |
| `features` | Icon or logo rows or columns | `title`, `lead`, `cols`, `items[{icon or logos or image, title, text}]` |
| `grid`, `mosaic` | Picture tiles (detections, product lines); one large picture beside tiles | `title`, `lead`, `cols`, `ratio`, `tiles[{image, label}]`; `image` |
| `figures`, `bars` | Verified numbers, brand blue / white | `figures[{value, label, text}]`, `image`; `bars[{label, value}]`, `caption` |
| `logos` | Client references | `title`, `cols`, `logos[{src, name}]` |
| `closing` | «Gracias», brand blue | `title`, `contacts[{k, v}]` (Web, Teléfono, LinkedIn, YouTube) |

Every slide takes `notes` (speaker notes, also in the PPTX). Text: `\n` breaks a line, `**text**` is Medium. Icons are Lucide names from `decks/assets/icons/`. Pictures: `src` relative to the plugin folder, `tpl:` for `decks/assets/`, with `pos` (`"50% 40%"`), `fit: contain`, `bg` and `alt`. The engine sizes type within the scale, centres blocks on the baseline and keeps non-cover pictures within 1.3×; photographs fill their side panel when the real pixels support it. Smaller photographs dock to the outer edges at their real grade; never add a darker navy inset. Complete screens and cut-outs retain all their information. A cover always fills its 920 × 1080 panel, ignoring legacy `maxScale` and `fit: contain` fields; insufficient source pixels produce a warning, never a smaller panel.

## Words and pictures

- One message per slide, about 40 words at most; the headline is a sentence that says the point, two lines at most. No eyebrow, tagline or line above the headline; no running footer (the slide number only). Long lists: split the slide or move detail to `notes`.
- Names exactly as in the brand guide (AIS Vision Systems, AIS Group, OPTICAIS, AIS Hopper, AIS KARIKÓ, AIS REV 360…); keep "AIS REV 360" and "a 360°" on one line (non-breaking space).
- Rebuilding a deck: every original text, figure and name stays, and every original picture that integrates; add nothing the original does not have.
- Real photos, real screens, our exterior machine views and product renders first; a generated picture only if it passes `brand-review` at its final size. Never a machine's internals, never another model's picture. Customer material with client logos blurred; client logos on a `logos` slide only where AIS may name the customer.
- Never repeat a picture in a deck (the build fails repeats). Round-label wine renders only. Covers: use the sharpest available original of the same subject; always fill the panel even when enlargement is needed (warn). Never a video frame or a flat-label wine render.

## Known failure modes

- Another agent working in `pieces/decks/`: write your own section and deck folder; never overwrite an approved deck unless asked.
- `missing file:` from the build: picture paths are relative to the plugin folder, not to the content file.
- `no layout "…"`: only the layouts above exist; pick the closest one rather than adding a layout.
- The PDF, PNGs and PPTX need Chromium and the plugin's Python (Pillow, python-pptx; `npm run setup`). Without them the HTML is still written with `--html-only`: report it.
