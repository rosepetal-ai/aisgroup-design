# Recipe reference

A recipe is one JSON file that describes one piece: a post, a carousel or a video. `engine/render.mjs` turns it into files; `engine/check.mjs` checks it without rendering. Start from a file in `templates/`, never from scratch. Examples are starting points, not approved campaigns: replace bracketed copy and empty figures with verified details. Footage slots and library review warnings must be resolved before publication.

## The recipe

| Field | Required | What |
| --- | --- | --- |
| `name` | yes | File name stem, lower case: `brand_type_lang_date`, e.g. `ais-vision-systems_carousel-hopper_es_2026-10-20` |
| `kind` | yes | `post` (one image), `carousel` (3 to 10 slides, LinkedIn PDF) or `video` |
| `brand` | yes | The brand that delivers the work: `ais-group`, `ais-vision-systems`, `ais-vision-automation`, `ais-scanology`, `rosepetal` |
| `lang` | yes | `en`, `es` or `ca`. One language per recipe; another language is another recipe, written natively |
| `formats` | no | Posts: `4x5` (default), `1x1`, `191x1` (link, 1200 × 628), `9x16`. Carousels: `4x5` (default), `1x1`. Video: `16x9` (default), `1x1`, `4x5`, `9x16` |
| `outputs` | no | Posts `png`; carousels `pdf` and `png`; video `mp4`; a lone lower third `mov`. Any kind can add `mp4` for a motion version |
| `copy` | posts | The text that goes with the post on LinkedIn. Checked with the same rules; ends with an approved call to action |
| `captions` | video | `[{ "from": 0.5, "to": 2.4, "text": "Line one|line two" }]`, burned in |
| `fps` | no | 25 |
| `shots` | yes | The slides or shots, in order |

File paths (`src`, `bgSrc`, `portrait`, `a.src`, `b.src`, `layers[].src`) can be:
- `@guide/…`: the brand guide's `public/` folder (logos, imagery references, illustrations)
- `@lib/…`: `library/` (approved media; check `library/catalog.json`)
- anything else: relative to the recipe file

Every file should be in `library/catalog.json`. Unknown files give a warning, files under review give a warning, rejected files stop the render.

## Photographs in a layout

Photographs lead: most slides open with the picture at the top and the words under it. Posts and carousels carry no caption or overline (the check fails them); in video a `caption` names what the picture is (the product, the place, the year) on an ink chip in its corner. Product renders registered in the library use `"evidence": "render"`. Product shots must be registered JPEG, PNG or WebP photographs/renders under `library/media/` (or the curated `brand/library/`). SVG product shots, including wrappers around photographs or other SVGs, fail validation. Pure vector diagrams and icons require `"diagram": true`; they cannot contain embedded/linked imagery or claim render evidence. The flat-label wine content-hash ban still applies to every asset. Drawings use `"evidence": "illustration"` and are currently paused for this studio.

Use pictures at about their own size: a 1280 px video frame fills a photo band 1080 px wide, never a whole tall slide. On a carousel’s inner slides the render warns above 1.25× and fails above 2×; a carousel cover fails above 1.25× and a single post’s picture above 1.5× (both warn above 1×).

**One grid per piece.** On posts and carousels the photo bands of a piece (the `hero` band and every white `panel`) share one height: the smaller of their `split` and the tallest band every photo in the piece fills at no more than 1.25× (1.5× on a single post, whose picture size the post system sets; never under 40 % of the slide). The words hang a fixed distance under the band, so the headline sits at the same height on every slide. A picture too narrow to fill the width sharply (under about 860 px on a carousel, about 675 px on a single post) is shown whole on section grey at the same limit at most, like a figure; that is a sign the piece needs a better original. `library/media/real/` holds the stills cut from AIS's own photos and videos; each catalog entry says where it came from and what to confirm.

In the studio editor, select the closing `contact` slide to edit each contact row’s label and detail, reorder rows or add another. The rendered slide uses those two fields; check the preview and layout warnings after changing them.

## Headlines

Write headlines as sentences, and put the message in them: a cover says what the product does, and the post text names the product. The engine breaks them into balanced lines on its own; put a `|` where a phrase must start a new line. Three lines at most. A display headline that needs more than three lines steps down a size; if it still does not fit, the render fails and says so.

## The AIS layouts

Marketing's structure, built on the guide: a product carousel goes **hero → panel (context) → panel with rows (what it inspects) → panel or grid (proof) → contact**. Posts use the guide's four post grounds and their pairings (Colour, Combinations): brand blue by default (light-blue accent, white text), `"bg": "deep"` for deep blue (white type, light-blue secondary text, no accent colour), `"bg": "white"` and `"bg": "grey"` (section grey) with a brand-blue accent. The night field and the mono overline with its hairline are video devices. The closing is blue and the cover follows the post system; the content slides go on white (`"bg": "white"` on `panel` and `grid`: the photo edge to edge across the top, the words under it), and one blue slide in the middle can keep the rhythm. The hexagon pattern (`hex`: `tl`, `tr`, `bl`, `br`, `t`, `b`, `l`, `r` or `"none"`) is drawn on blue slides without a photograph, fading out from its corner; on a blue slide with a photo band (cover, event, contact) it sits only on the blue under the band, from the bottom right, away from the logo, never over the picture. Icons sit in single hexagons. Inner slides carry no logo, only the step number in an outline hexagon at the foot, left; on white inner slides the headline takes the largest size that keeps its phrase breaks (120, 96 or 72 px); the cover and the closing sign with the logo at the foot. Words between `*asterisks*` in a headline take the accent blue: only the closing phrase of the headline (anything else is an error), on one or two slides of a piece (more is a warning); plain headlines are the default.

| Type | Use | Fields |
| --- | --- | --- |
| `hero` | Carousel cover or single post: the product or the moment | `src`, `focus`, `scale`; full-bleed when the picture is big enough (at least about 1080 × 1350 for 4:5), otherwise `split` (0.4 to 0.66; about 0.64 for an image-led cover) puts it in a band across the top with a clean edge, no scrim; the band shrinks (to no less than 0.3 of the height) when the text needs the room; `fade` (full-bleed, default 0.62); `headline`, `items` (up to 3 icons with a short label) |
| `panel` | Context, what it inspects, proof | `src` (full-bleed or `split`), `headline`, `items` (rows: `icon`, `text`, `detail`, up to 5); `panelAt: "top"` on full-bleed pictures; `bg: "white"` puts the framed photo first (up to `split`, default 0.6) and the words under it; the photo takes the room the words leave, and the slide fails when that is under 40 % of the height. Cut words, not the photo: one headline, no caption, no body line, rows only when the picture still has its 40 % |
| `grid` | What it reads, six numbers to gather | `items` (2 to 6 cells: `icon`, `text`, `detail`); `src` + `split` puts a framed picture under the top row, sized to the room left; `bg: "white"` for the light version. Items with `src` show the real thing instead of an icon: a picture tile (`tile`, the aspect, default `"4 / 3"`; per item `focus`, `scale`, and `box` [x, y, w, h] in percent for a hairline frame on what it names), the name under it and one `detail` line. Two tiles, `"5 / 6"`, fill a 4:5 slide On a single post the picture tiles grow to the logo's clear space, and a picture too small to fill its tile sharply sits whole on section grey at 1.25× at most. |
| `callout` | What it checks on one product | `src` (a real photograph), `imageSize`, `fit: "contain"`, `caption`, `headline`, `items`: `icon`, `text`, `x`, `y` (the point, in percent of the image), `side` (`left`/`right`), `labelY` (percent of the picture's box). The chips name what is checked; they are not detections and carry no verdict |
| `event` | Trade show | `lead`, `event`, `rows` (`icon`, `text`, two or three; keep each on one line); `src` + `split` + `caption`: our stand, edge to edge across the top of a post with the logo at the foot (framed in a carousel) |
| `contact` | The closing slide | `headline`, `action` (approved list), `rows` (`text`: web and phone, on one line, without labels); no `text`; no picture: solid brand blue, the logo at the foot and the hexagon corner top right |
| `showcase` | Single post: one product/machine on its sweep, or a real photographic detail aligned to the page grid | `src`, `headline` (largest size that keeps two lines), `scale`, `focus`; `fit` defaults to `contain`. Sweeps use the section grey or `bg: "white"`. For a real photograph use `inset: true` to align its edges with the heading/logo margins; `fit: "cover"` fills that frame, so inspect the crop. The picture fills the space below the heading and fails under 50 % of the post (42 % on 1:1). Keep production method in the source record; no invented inspection overlay is needed |

Contact details, as on the websites: aisvision.com, +34 931 003 035, Can Camps, 10, 08202 Sabadell (written so in the templates; the websites add "Carrer de" and "(Barcelona)").

The isometric illustrations are paused: a recipe that uses one fails.

## The post system

Every single post and every carousel cover takes one of three looks on one grid: 64 px margins, headline 68 px (sentence case, accent only on the closing phrase), the logo small at the foot, bottom left. Set it with `"look"` on the first shot; without it the engine picks navy for `stat` and `quote`, light for carousel covers, `showcase` and `"evidence": "render"`, and blue for other photographs. `engine/stage.html` (`SYSTEM`) draws all three; `split`, `bg` and `hex` no longer shape a post.

- **Blue** (machine, screen and event photographs, and stock context): the picture from the top edge down to the words, with a hard bottom edge, never above 1.5× its native size (1.25× on a carousel cover); under it a solid brand-blue `#17356E` panel holds the white headline and the logo. No fade, no scrim and no gradient anywhere on a post or carousel (the render fails `gradient`). An overlay picture (SVG) stays whole, centred in the room above the words. Callout chips stay on the picture.
- **Light** (product, detection and carousel covers): white; the headline at the top; the picture filling its band under them, down to the logo's clear space. A render on the studio sweep (`"evidence": "render"`) is cropped to its product group, which the engine finds on the sweep (or `"subject": [x0, y0, x1, y1]`, fractions of the picture, when the sweep hides it): the group reaches 36 px from the sides and 32 px from the band's top and foot, at 1.5× its size at most; `"bleed"` (1 to 2) lets a long row run off both sides, as a line does past the frame; `"crop": "none"` keeps the whole frame. When a wide group leaves room, the headline grows into it (68 to 120 px, on the full measure; the hexagon corner moves to the bottom right if the words reach it). An overlay picture (SVG) is shown whole and centred in its room. Under 40 % of the slide fails (`picture-small`); an overlay picture the headline squeezes fails (`overlay-cropped`).
- **Navy** (results and quotes): solid brand blue `#17356E`, no picture; `"look": "light"` sets the same composition on white (figure in brand blue, text in ink), so the feed can alternate. A `stat` figure grows as large as the slide allows, with its source on one line under it. A `quote` sits in « » in every language, five lines at most, sized to fill, name and role on one line under it.
- **The hexagon corner:** on every post, one size (42 % of the short side), flat-top hairlines that thin out to nothing from the corner, flush to the edges: the guide's hairline `#7C9FD7` at 25 % on blue and navy, brand blue at 12 % on white. Bottom right on blue (under the picture), top right on light and navy, in the corner the words leave free. It never crosses a picture and never sits behind words: words or the logo inside its clear radius fail (`hex-text`).
- **Carousels:** the cover follows the system (light unless the feed needs blue); content slides stay white with the same margins and type, headline at the top, the picture under it, the step number at the foot; the closing slide is solid brand blue with its headline, the one action, web and phone on one line, the logo and the hexagon corner top right (no picture).
- **The feed:** across a set, blue (or navy) and white alternate, and no two similar pictures sit side by side; when a post could go either way, choose the look that keeps that balance.
- **No huge empty space:** on every slide the render measures each picture band and the rows. A subject covering under 55 % of its band fails (`picture-empty`); an empty strip over 12 % of the height between two elements fails (`empty-strip`); one at the top or foot over 25 % is reported. The numbers go to the report (`space`).
- **Stock photographs** for context only (licences with no attribution: Unsplash, Pexels, CC0), registered with `"origin": "stock"`; never as our machine, software or a customer.
- **Checks on every render:** each word at 4.5:1 or more against what is really behind it (the frame is shot again with the words hidden), and the 1.5× limit on a post's picture (1.25× in a carousel).

## Single posts

The post system above wins where this older section differs. A single post is not a carousel cover. Vary the composition across a set: `showcase` (product on grey), `grid` with real picture tiles on white, white `panel`, `callout`, `stat`, `quote`, and the blue `hero` band for photographs of people and places. On a single post:
- icons sit on square tiles without a border (brand-blue or deep tone on blue, section grey on white); the outline hexagon is kept for carousel step numbers;
- small text steps up (labels 32 px) so nothing reads as fine print at feed size;
- the render fails a **blank band** over 16 % of the post height, a picture stranded under 55 % of the width in a full-width band, and a **needless wrap**: a headline broken onto two lines (by `|` or otherwise) that fits on one;
- a `stat` figure grows to fill the post instead of leaving its top half empty.

The words never say how a picture was made (CAD, render, 3D, Blender, KeyShot) and never carry review notes ("borrador", "vista de prueba", "publicación de muestra", "draft"…): the copy check fails both, in the artwork and in the caption.

## Post and carousel slides

All slides take `seconds` (for the motion version) and `logo: false` to hide the logo on a first slide.

| Type | Use | Fields |
| --- | --- | --- |
| `cover` | First slide, or a single post | `headline`, `text`; `src` + `focus` [x%, y%] + `scale` for a photograph, or no `src` for the night field; `bg: "white"` (light) or `bg: "dark"` (night field, for a piece that opens dark) puts the photo in its own space (`split`, default 0.42); `photoAt: "top"` leads with the photo, text under it and the logo at the foot (the usual cover); `headlinePos: "top"` |
| `text` | One idea in words | `headline`, `text` (one line; longer goes in the post's `copy`); `bg` `white` (default) or `blue`; with `src` the photo takes `split` of the slide (default 0.42), at the foot or, with `photoAt: "top"`, leading; `fit: "contain"` shows a whole machine on section grey; without `src` the headline is large and the line sits at the foot |
| `list` | What it checks, what you will see | `headline`, `items` [{ `icon` (Lucide name), `text`, `detail` }], 2 to 5; `bg`; `src` puts a photo above the rows (`split`, default 0.34) |
| `still` | A photograph with the inspection frame | `src`, `imageSize` [w, h] in px, `fit` (`cover`/`contain`), `focus`, `scale`, `headline`, `headlinePos` (`top`/`bottom`), `inspect`, `detect`, `evidence` |
| `figure` | How it works: an illustration (or a result image) on white under the headline, with the overlay | `src`, `imageSize`, `scale`, `focus`, `headline`, `inspect`, `evidence: "illustration"`; `bg: "dark"` for the dark drawing. A drawing from `figures/` names its parts: set `inspect.target` (`"cap"`) and the engine takes the box from the drawing, so the frame is always on the part |
| `pair` | Detail and result: good part and defective twin | `a` and `b`: { `src` or `slot`, `label`, `focus`, `scale`, `inspect` (percent of that image) }; `headline`, `evidence`; `side: true` keeps upright products side by side on tall formats; `bg: "white"` for light pictures |
| `stat` | One verified figure | `value`, `unit`, `label`, `text`, `note` (metric, baseline, conditions, date), `basis` (`measured`/`estimated`/`target`/`illustrative`), `evidence` (`system`, `illustration`, `render` (3D render from real dimensions, unlabelled), or `case` with `source`: a figure published in an approved case study), `bg` |
| `stand` | Trade show | `lead`, `event`, `rows` [{ `icon`, `text` }] |
| `quote` | Someone’s exact words: a customer, or our own people where they said them in public | `quote`, `name`, `role`, `permission` (a customer: who approved it in writing, and when; our own people: where it was said and published); `portrait` needs `consent`. On a post the words sit at the foot, on white unless `bg` says otherwise; on a post `src` (`split` default 0.5) puts a photograph of the speaker across the top, the words in « » under it (three lines at most) and the logo at the foot |
| `cta` | Last slide of a carousel (or `contact`) | `headline`, `text`, `action` (exactly one of the approved calls to action), `url` |
| `title` | A headline on its own | `title`, `bg` |

## Video shots

The seven video types are in `templates/video-*.json`: defect showcase, event teaser, event recap, announcement, sector film, case study and interview (`templates/video-interview.json`). Keep their structure and lengths. Shots: `still`, `clip` (`src`, `in`, `out` seconds), `title`, `claims` (`words`, `each`, `hold`), `stat`, `stand`, `end` (`seconds`: 1.5 social, 3 standard, 5 brand film), `opening` (films over 60 s only), `lower-third` (`name`, `role`; alone in a recipe it renders as transparent ProRes). A `still` takes `"bg": "white"` (light mode) or `"bg": "grey"` (light mode on section grey #F1F5F9, the studio sweep of the renders, so a render shown whole with `"fit": "contain"` has no seam). Any shot takes `"wipe": true` to enter with the blue wipe (between beats: into a result, a claim, the end card) or `"dissolve": true` for the guide's 13-frame cross-dissolve from the shot before (same scene only; otherwise cut), `bgSrc` to put footage behind a card, `lowerThird` { name, role }, `slot` (what to film, shown until the footage exists) and per-format overrides under `formats`.

Speech (the interview template uses all three):

| Field | Where | What |
| --- | --- | --- |
| `voice` | shot | `true` on a `clip` plays its own sound; `{ "src", "in" }` on any shot plays another file's sound from `in` seconds, for the shot's length. The voices are mixed and levelled to −14 LUFS; a film without one stays silent |
| `captionsFrom` | recipe | A word-timing file, YouTube json3 or `[[seconds, word], …]`. The render turns the words under each voiced shot into captions, burns them in and writes an `.srt` next to the video. Ignored when `captions` is set |
| `corrections` | recipe | `[["wrong", "right"], …]`, applied to the captions from `captionsFrom`. Automatic transcripts get names wrong: a person reads the captions and adds every fix here |

Captions sit above a lower third while both are on screen.

Footage with marks baked in (published videos carry their own captions and a logo) lists them in its catalog entry as `"burnedIn": [{ "what": "captions", "box": [x0, y0, x1, y1] }]`, in percent of the source. The render fails any clip whose `scale` and `focus` let one into the frame.

## Square posts

Square formats have less height for the same photo band: give them a smaller `split` under `formats`, `{ "1x1": { "split": 0.4 } }`.

## Illustrations

Drawings explain how something works; photographs and footage prove that it does (Illustration, When to use one).
- Show a drawing whole, filling its column. A `figure` or `still` from `illustrations/` or `figures/` fails above `scale` 1.25: crop a photograph for detail, never a drawing.
- A video never uses a drawing as a stand-in for footage: the render fails. Use real footage, or a `slot` that says what to film.

## Evidence

Anything that shows a reading, a verdict or a figure says where it comes from:
- `"evidence": "system"`: exported by the system on a real run. Readings, classes and confidences are the system’s own.
- `"evidence": "illustration"`: made to explain. The engine prints «Illustration» on it, and a figure must be `"basis": "illustrative"`.

Use real photographs and footage for machines, installations, interfaces and people. Product renders may be used where the library permits them, with `"evidence": "render"`; all material still needs visual review.

An unfilled statistic may use `"value": "—"` while a draft is being prepared. The preview shows a dash and the check blocks export until a real number is entered; add its verified source and conditions. A footage `slot` is also reported as a draft warning, even if a stand-in image is present.

For a slide that must not be exported until its picture is supplied, set `"mediaRequired": true` on the shot. The check blocks export until a `src` is present and the draft `slot` is removed. This checks that a source was supplied, not that it was approved or accurately depicts the claim; review the image and rights separately.

## The inspection frame

On posts and carousels it follows the guide's overlay kit (Imagery, Detection overlays): a hairline box in the detection blue with corner ticks, red for a defect, a chip with the label, and one verdict at the top left of the picture. In video it is the brand device: brackets travel in, reading above, verdict below.

- `label` is a word that says what was expected (`tapón`, `tablet`, `MCU`), never a code.
- `verdict.text` is `OK` or `NOK`; `detail` is a short reason or a count that matches the boxes drawn (`1/1`).
- `value` (a reading) and detection `conf` only with `"evidence": "system"`.


`inspect`: `x`, `y`, `w`, `h` in percent of the frame, or of the image with `"space": "image"` and the shot’s `imageSize`; `state` (`found` or `defect`), `label`, `value` (counts up), `verdict` { `result` (`pass`/`reject`), `text`, `detail` }, `at` (frame offset). Detection boxes: `detect` [{ `label`, `conf`, `x`, `y`, `w`, `h` }] or `track` from `engine/tools/track.py` (see the video skill).

## What fails a render

From the recipe: structure (a carousel ends on one `cta` or `contact`, a video on `end`), missing fields, missing or rejected files, generated images of machines, people, installations or interfaces, missing `evidence`, placeholders in `[brackets]`, wrong brand or product names, forbidden claims, typed arrows and emoji, words in capitals, calls to action outside the approved set.

From the layout, on every settled frame: any text on a picture (posts; the logo sits at the foot of a `split` hero, off the band), the inspected part under 56 px (72 px on 1920 video), a chip or verdict over another named part of the drawing, headlines over three lines, text outside the safe area or into a photo, text in the logo’s clear space, the inspection frame under text, text under 26 px on posts (32 px on video), pictures enlarged more than 2× (a carousel cover more than 1.25×, a single post’s picture more than 1.5×), and everything `brand-check.js` reports (fonts, palette, glyphs, broken words, spills).

Warnings (soft pictures, assets under review, figures without context, Title Case) do not stop a render; read them.

## Video background experiments (local tests only)

A video shot can opt into `"videoPattern": {"type":"rolling", "seed":1112, "period":6}`;
`type` is `rolling` or `particles`. This independent video option does not extend the approved
LinkedIn `pattern` field. No guide or kit promotion is implied. It replaces the shot's flat fill;
photo/video layers still sit above it. `quiet` defaults to true, reserving the centre for a logo.
Use `{"type":"still","seconds":6,"videoPattern":{"type":"rolling","period":6,"loop":true}}`
for a logo-free cyclic plate. Particle plates require `loop:true` for cyclic convergence.
Use `opening` with `seconds:5` and the option for an official white logo with a brief
perspective/scale reveal (0.65–1.85 s), then a clean hold. Without the option the existing
opening is unchanged. Set recipe `fps:30` for these experiments. Motion is a function of
absolute frame time and seed; the six-second period closes position, opacity and velocity.
The rolling surface uses the approved `print/landscape.py` Rolling coefficients and lattice.
