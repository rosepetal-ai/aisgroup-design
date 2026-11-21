# Sector carousel

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/carousel-sector.json` (cans and canned food, AIS REV 360 COMPACT, Spanish, five slides).

## What it is for, and when not

Quality control for one sector's line. The slides are: the reader's line, what goes wrong there, what fails in that product, the machine on a real line in that sector, and contact. It speaks to people in that sector, not about one machine.

- One machine explained on its own: **product**.
- One inspection across sectors (labels on any container): **application**.

## The template

Cans with the AIS REV 360 COMPACT, in real frames from AIS's video of a customer's can line. Image first:

- a dark cover, the headline only;
- white slides with large framed photos, captions under them and one headline;
- slide 3, a dark "En pantalla" grid with two real detections from AIS's Advanced Factories 2026 stand screen instead of icons: Rosepetal's live view with two dents boxed inside a can, and OPTICAIS reading the date on a lid. The blurred seam screen stays dropped;
- the blue contact slide, with no picture.

## The brief

- Which sector, and which product in it (cans, bottles, jars)?
- Which machine is used there?
- Which defects matter in that sector? Take them from AIS's articles for that machine.
- Which real pictures of that machine exist on that sector's line? Does the customer approve them?

## The picture

- **Qualifies:** real frames of the machine on a line in that sector. Ideally three: the machine on the line, the product entering it, and a detail of the infeed. For slide 3, real system output showing the defects that matter in that sector: show the defect, not an icon of it.
- **Size:** the 1138 × 535 COMPACT frames hold a band up to about 670 px tall (1.25×), about half the slide, and never go full-bleed. The cover is set at `split` 0.64 and ends above the words; read the render's warnings. On the white slides they are framed about 920 wide. The grid tiles are 500 × 667 and 560 × 747: at `scale` 1.6 the dents tile is shown 1.4× and warns, so lower its `scale`.
- **Framing:** `split` 0.64 on the cover and 0.62 on the white inner slides, with `focus` on the product and the machine and the `caption` set under the picture. On the grid, `"tile": "5 / 6"` and `"hex": "none"`; each tile has `src`, `focus`, `scale` (and `box` to frame what it names), a name (`text`) and one `detail` line that says where it comes from.
- **Fits today:**
  - `real/rev360-compact_can-line.jpg`, `_cans-entering.jpg` and `_cans-on-guide.jpg`; the tiles `advanced-factories-2026/af26-can-demo_dents-tile.png` and `advanced-factories-2026/af26-can-demo_date-tile.png` (this template uses them); and `rosepetal/rp_tuna-can-live-view.webp` (confirm the tuna customer allows it);
  - the full stand frame `advanced-factories-2026/af26-can-demo_dents.png` and the stabilised clip `af26-can-demo-steady`, for a video;
  - for wine, `advanced-factories-2026/still-bottling-line.jpg` (used by the guide cover) and `rev360/still-rev360-wine-four-views_blurred.png` (used by post-callout).
  - Reuse these when they serve the message; seek other material only for a concrete content gap.
- **Never acceptable:**
  - `real/rev360-compact_seam-screen.jpg`, which is blurred and was dropped;
  - marketing's cannery composite;
  - cans or bottles with impossible geometry, melted label text or false evidence;
  - the "kariko-real" hero;
  - icons of defects where a real detection exists.

## Structure

1. **`hero`, dark cover:**
   - the machine on the sector's line;
   - `headline`: the reader's line;
   - no `text` and no icon chips.
2. **`panel`, white, context:** the product entering, with a caption, the problem as headline. No `text`.
3. **`grid`, dark, on screen:** two picture tiles (`"tile": "5 / 6"`), each tile a real detection with its name and one `detail` line saying which system and where.
4. **`panel`, white, in your line:** a detail and caption, and a headline on how it fits the line. No rows.
5. **`contact`, brand blue:** a question headline, `action`, and two rows (web, phone). No `text`.

## Words

- **Cover:** "Tu línea de latas, *a 360°*".
- **Accent:** only on the cover and the contact slide. Inner headlines are plain.
- **Context:** "Una lata abollada llega al cliente si nadie la ve".
- **Grid:** "Del golpe a la fecha impresa". Two tiles: "Golpes dentro de la lata" with "Rosepetal, en Advanced Factories 2026", and "La fecha, leída en la tapa" with "OPTICAIS, en Advanced Factories 2026". The name says what the picture shows; the detail says where it was. Other defects the machine catches (lithography, double seam) go in the copy.
- **In your line:** "Sin orientar la lata, a la velocidad de la línea". The rows this slide used to carry are now the headline.
- **Contact:** "¿Hablamos de *tu línea de conservas*?" and the action "Cuéntanos cómo es tu línea". No closing line on the slide.
- **Copy:** the sector's problem, what the machine does, "Las imágenes son del sistema en una planta real.", and the call to action.

## Mistakes to avoid

- A number of cameras that is not verified for the machine. Use the exact model's sourced camera configuration. Hopper has three colour cameras plus an optional fourth; do not transfer that to COMPACT.
- Defects the machine is not documented to catch in that sector.
- Keeping a blurred picture on the grid slide, or going back to icons when a real detection exists.
- A tile that is not real system output, or a tile shown above 1.25× (lower `scale`).
- Photos masked into hexagons, or the sector's stock imagery.
- An accent on every headline, or rows or a body line on a white slide: the photo drops under 40 % and the check fails ("picture-small").

## Before publishing

- The customer whose plant appears approves the frames. Ask marketing for the clean master.
- The defects listed match AIS's articles for that machine.
- The stand frames' visitors and can labels are cleared (see the `af26-can-demo` catalogue reasons), and Rosepetal's tuna customer allows the live view.
