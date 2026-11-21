# Product carousel

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/carousel-product.json` (AIS REV 360 Cables, Spanish, five slides).

## What it is for, and when not

One machine explained. The slides are: what it is, the problem it solves, what it detects, the proof on its screen, and contact.

- One sector's line, its defects and the machine used there: **sector**.
- One inspection (labels) told through what fails: **application**.
- A partner's product: **partner**.
- One picture and its name: the product post (`social-post`).

## The template

AIS REV 360 Cables, with every picture a real frame from AIS's own video (`rev360-cables-video`): the factory floor, the tunnel, the camera mounts and the Rosepetal screen. The soft extrusion-line frame was dropped. Image first:

- a dark cover, the photo on a hard edge (`split` 0.64), the name only, logo at the foot;
- three white slides, each a large framed photo, its caption and one headline, with no body line and no rows;
- the blue contact slide, with no picture.

## The brief

- Which machine?
- What does it inspect? Take this from its article or datasheet.
- On what line, at what conditions?
- What is verified about it, and what is not? Counts such as "four cameras" must be verified for this model.
- Which real pictures exist? You need three or four: the machine in place, how it sees, the cameras or light, and the screen.

## The picture

- **Qualifies:** real frames or photos of this machine, each showing a different thing. The screen is the machine's own, running.
- **Size:** the 1280 × 600 Cables frames hold a band up to about 750 px tall (1.25×), a little over half the slide. The cover is set at `split` 0.64 and ends above the words, which keeps it inside that. On the white slides they are framed about 920 wide. A 1080 × 1350 picture can go full-bleed on the cover.
- **Framing:** `split` 0.64 on the cover and 0.62 on the white inner slides, each with a `caption` set under the picture. The white slides give the picture only the room the words leave, and the engine fails one under 40 % ("picture-small"): short words, bigger picture.
- **Fits today:**
  - the Cables set, `real/rev360-cables_factory-floor.jpg`, `_tunnel.jpg`, `_camera-mounts.jpg` and `_rosepetal-screen.jpg` (this template uses them), and `rev360/rev360-cables_side-tube.png`;
  - for another machine: `real/kariko_trade-fair.jpg` (AIS KARIKÓ), `advanced-factories-2026/still-machine-hmi.jpg` (AIS Hopper), and the exterior machine views in `library/media/3d/machines/<machine>/` (AIS Hopper final; KARIKÓ and REV 360 Compact are 700 px previews, too small for a slide).
  - The REV 360 set belongs to the application carousel.
- **Never acceptable:** the soft `real/rev360-cables_extrusion-line.jpg`, `real/rev360_inside-render.jpg`, wrong or physically implausible machines, machine views with open guards or internals, and corrupt product marks (preserve approved AIS demo labels).
- **If only two good pictures exist,** make the "what it detects" slide a `grid` without a photo. Never use a weak picture.

## Structure

1. **`hero`, dark cover:**
   - the machine photo;
   - `headline`: the product name (`AIS REV 360|Cables`);
   - no `text` and no `items`. The details belong on slides 2 to 4.
2. **`panel`, white, context:** photo and caption, the problem as headline. No `text`.
3. **`panel`, white, what it detects:** photo of the cameras and caption, and a headline that lists what it detects. No rows.
4. **`panel`, white, proof:** the screen and caption, headline. No `text`.
5. **`contact`, brand blue:** a question headline, `action`, and two rows (web, phone). No `text`.

## Words

- **Cover:** "AIS REV 360|Cables".
- **Context:** "Un defecto de superficie *no espera* a la revisión manual".
- **Accent:** the cover is a product name, so the accent goes on the context slide and the contact slide only. The other headlines are plain.
- **What it detects:** "Diámetro, agujeros, rayas y manchas, en cada metro". The three rows this slide used to carry are now the headline; the rest of the list (out of tolerance, missing material, bubbles) can go in the copy.
- **Proof:** "Cada defecto, con su imagen".
- **Contact:** "¿Lo probamos *con tus tubos*?" and the action "Envíanos muestras". There is no closing line on the slide; write a new headline for every piece.
- **Copy:** what it inspects and how (verified facts only), then "Las imágenes son del sistema en funcionamiento." and the same call to action as the contact slide.

## Mistakes to avoid

- An event slide ("Ven a vernos en…") inside a product carousel.
- An unverified camera count: use the exact model's AIS source. Hopper has three colour cameras plus an optional fourth.
- A soft frame kept because the slide "needs a picture".
- The cover picture again on an inner slide.
- Icon chips on the cover, or an accent on every headline (the check warns above two).
- A body line or rows on a white slide: the picture drops under 40 % and the check fails ("picture-small").
- Capitals, pills, glow, or hexagons drawn over the photos.

## Before publishing

- The customer site in the frames approves their use. Ask marketing for the clean video master.
- Every fact on the slides matches the product's article or datasheet.
