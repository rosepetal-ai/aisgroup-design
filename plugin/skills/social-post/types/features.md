# Features post

**Look (post system; `docs/recipes.md`, *The post system*):** blue for a real screen (a hard edge over the brand-blue panel under the headline); light for defect tiles on white. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-features.json` (one white `panel` with the screen large, format `4x5`).

## What it is for, and when not

A product's software, shown large on its real screen, with one headline that names what it reads or does. It says "this is what it reads".

- The software running in production, without naming what it reads: **software**.
- The machine: **product**.
- Several features, each worth its own line: a carousel. A `grid` slide holds up to six cells, with icons or real picture tiles.

## The template

A white post, image first.

- The blue logo signs at the foot.
- The real OPTICAIS screen, reading a lot and an expiry date against the expected text, is framed large at its true grade (`split` 0.62).
- Then one headline, nothing above it: "Lee lote, caducidad *y códigos*". No rows: the specs go in the caption (`copy`).

## The brief

- Which product or software?
- What does it read or do? Use the exact wording from its page or datasheet, short enough for one headline.
- Is there a real screenshot? Does it show customer data?

## The picture

- **Qualifies:** a real screenshot, or a sharp frame of the product's own screen, where what the headline names can be seen. The title bar or product name shows, so the reader knows whose screen it is.
- **Size:** the framed picture is about 920 wide and up to `split` × 1350 tall (about 837 at 0.62), less the room the words take. The template's is 1024 × 620; a smaller screenshot gives a soft warning.
- **Framing:**
  - `"bg": "white"`, `split` 0.62, `focus` on what the headline names ([30, 40] in the template).
  - The engine fails the post if the words leave the picture under 40 % of its height ("picture-small"). Cut words, not the picture.
  - Crop out half-cut chrome at the edges, such as a logo or title cut in half, with `scale` and `focus`.
- **Fits today:**
  - `real/opticais_ocr-screen.jpg` (this template uses it);
  - `real/kariko_defect-screen.jpg`, AIS KARIKÓ (used by carousel-guide; its counters are a demo run);
  - `real/rev360-cables_rosepetal-screen.jpg` (used by carousel-product);
  - `advanced-factories-2026/af26-can-demo_date-tile.png`, OPTICAIS reading a date on a can lid at the AF 2026 stand, 560 × 747 (used by carousel-sector; too small to frame at 920 wide without a soft warning).
- **Never acceptable:**
  - `real/rev360-compact_seam-screen.jpg`: it is blurred, and carousel-sector dropped it;
  - generated interfaces, or mock-ups shown as real (the `web-*` website clips are rejected);
  - screens with invented brands;
  - a crop that loses the title bar.

## Variant: defect tiles (what a machine catches)

When the message is "what it catches on your product" and no real screen shows it, the post is a white `grid` of two or three square detection tiles. Reference: `pieces/posts/02-kariko/` (AIS KARIKÓ trays, ES and EN).

- Shot: `"type": "grid"`, `"bg": "white"`, `"hex": "none"`, `"tile": "5 / 6"`, `"evidence": "render"`, `headline` (what it sees, plain: "Lo que ve en la bandeja"), `items` of `{ "src", "text", "focus", "scale" }`.
- Tiles: `library/media/3d/renders/<machine>/det/` (see `detection-tiles`). Each tile shows one different defect, cropped on it; `text` names the defect in plant words ("Esquina deformada"). Never a tile of a defect that machine isn't documented to catch, and never the same defect twice.
- Copy: what the machine inspects, then "here are two of the defects it finds", then the call to action.

## Structure

One `panel` with `"bg": "white"`, `src`, `split`, `focus`, `headline`. No `text` and no `items`. It has no hexagon pattern, because the post has a photograph.

## Words

- **Headline:** what it reads or does, with the accent on the last item: "Lee lote, caducidad *y códigos*". One headline carries the whole message.
- **Copy:** what it reads, what it compares it with, and on what, then one call to action. Example: "OPTICAIS lee lotes, caducidades y códigos 1D y 2D en la línea, y los compara con lo que debería estar impreso. Para etiquetas, estuches o bobinas. Solicita una demo". The specs (Data Matrix, EAN13, ISO verification) belong here, not on the image.

## Mistakes to avoid

- Adding feature rows or a body line back. They shrink the screen, and under 40 % the check fails ("picture-small").
- Leaving out `"bg": "white"`: the screen would sit on navy with the old look.
- Reading the screen's counters (95,35 %, 99,25 %) as a result. They are a run, not a figure to quote.
- Features the screen does not show, or that belong to another product.
- A crop that loses the title bar, which leaves the reader asking whose screen it is.

## Before publishing

- The screen shows no customer names, labels or data that need approval.
- What the headline and the copy name matches the datasheet.
- No half-cut logo or title shows at the edge of the crop, at 2× zoom.
