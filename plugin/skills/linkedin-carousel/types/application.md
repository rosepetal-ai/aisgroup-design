# Application carousel

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/carousel-application.json` (label inspection at 360°, AIS REV 360, Spanish, five slides). This type is new.

## What it is for, and when not

One inspection told through what fails. The slides are: the system on a real screen, why the defect is missed, what it detects on the system's own views, the machine on a real line, and contact. It answers "can you check my labels?".

- One machine explained, whatever it inspects: **product**.
- One sector's line: **sector**.

## The template

Label inspection at 360° with the AIS REV 360.

- The cover is dark: the real operator screen with the camera views, ending on a hard edge, the name on navy, and the logo at the foot.
- Then come cans entering the machine (white); a **dark panel** with the REV 360's four views of a PET bottle, "Burbujas, despegues, textos y códigos" (the system's own output instead of the four icon cells it replaced); the machine on a real line (white); and the blue contact slide, with no picture.

## The brief

- Which inspection, and which machine does it?
- What does it detect? Take this from AIS's articles. For the REV 360 they list bubbles, labels coming loose, misaligned labels, and text and codes. They name high-resolution cameras plus deep learning.
- What is not verified? "Four cameras" is not verified for the REV 360 and must not be said. It is verified only for the REV 360 Cables.
- Which real pictures exist? Does the customer approve them?

## The picture

- **Qualifies:** the system's real screen, the product entering the machine, the system's own views of a product, and the machine on a real line. Show what it detects on the real output, not as icons.
- **Size:** the cover's band at `split` 0.64 is at most 1080 × 864, a little less once it ends above the words. On the white panels, at `split` 0.62, pictures are framed about 920 wide. The REV 360 frames (1580 to 1680 px wide, 860 to 1080 tall) fill both without enlargement; the spray-cans frame is 720p, so watch its warning.
- **Framing:** `split` 0.64 on the cover and 0.62 on the panels. Slides 2 and 4 are `"bg": "white"`, with the `caption` under the picture; slide 3 has no `bg`, so it is dark, with the picture in a band, its caption on an ink chip and the words on navy. Set `focus` on the screen's camera views ([38, 40]), on the bottles ([50, 45]) and on the machine.
- **Fits today:**
  - `rev360/still-rev360-operator-screen.png`, `real/rev360_spray-cans-entering.jpg`, `rev360/still-rev360-pet-four-views.png` (customer label: confirm), `real/rev360_machine-on-line.jpg` (this template uses them), and `real/ais_sabadell-building.jpg`.
  - The wine four views belong to post-callout.
- **Never acceptable:**
  - `real/rev360_inside-render.jpg` shown as a photo;
  - bottles that fail credibility, whatever their origin;
  - images with brackets or rings drawn in.

## Structure

1. **`hero`, dark cover:** the operator screen, headline (the machine's name). No `text`, no icon chips.
2. **`panel`, white, context:** products entering, with a caption, the reason the defect is missed. No `text`.
3. **`panel`, dark, what it detects:** the system's views of a product, with a caption, and a headline that lists what it detects. No rows.
4. **`panel`, white, on the line:** the machine on a real line, with a caption, and how it installs as the headline.
5. **`contact`, brand blue:** the headline, `action`, and two rows (web, phone). No `text`.

## Words

- **Cover:** "AIS REV 360".
- **Accent:** the cover is a name, so the accent goes on the context slide and the contact slide. The rest are plain.
- **Context:** "El defecto suele estar *en la cara que no miras*".
- **What it detects:** "Burbujas, despegues, textos y códigos", caption "Las vistas del AIS REV 360 de una botella PET". The four cells the slide used to carry are now the headline; misaligned labels and where each defect sits can go in the copy.
- **On the line:** "Sobre el transportador que ya tienes".
- **Contact:** "Pruébalo *con tus envases*" and the action "Pruébalo con tus productos". No closing line on the slide; an offer such as "Trae unas muestras y revisamos sus etiquetas contigo" goes in the copy if anywhere.
- **Copy:** where the defect hides, what the system does (cameras of high resolution and deep learning, in the line), "Las imágenes son del sistema en una planta real", and the call to action.

## Mistakes to avoid

- "Cuatro cámaras" or any camera count for the REV 360.
- Defects outside AIS's REV 360 articles.
- A defect picture made by a generator, or a "result" drawn by hand.
- Repeating the post-callout picture or its message.
- Icon cells for the defects when the system's own views show them.
- Rows or a body line on a white slide: the picture drops under 40 % and the check fails ("picture-small").

## Before publishing

- The customers whose products, labels and line appear approve their use. Ask marketing for the clean master.
- The four defects match AIS's REV 360 articles.
