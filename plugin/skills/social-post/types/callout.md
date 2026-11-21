# Callout post

**Look (post system; `docs/recipes.md`, *The post system*):** light: the picture with its chips under the headline, on white (`"look": "blue"` for a camera view or a photograph of the line). Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-callout.json` (one `callout` shot, format `4x5`).

## What it is for, and when not

One real product, as the system sees it, with chips naming the parts the machine checks. It says "this is what it looks at on your product". The chips are not detections: no box, no verdict, no reading.

- The machine itself: **product**.
- A defect found, with the inspection frame and a verdict: there is no template for it today. It needs a real system export (`"evidence": "system"`), so ask for one.
- What one inspection detects across products: a carousel (application type).

## The template

The template is the older chip version (the AIS REV 360's four views of one wine bottle). The kit post (`pieces/posts/03-rev360-standard`) is the approved style: one cava bottle seen from the front and from behind, bright on the studio sweep, with the three inspection points drawn into the picture by `pieces/posts/_build/callout.mjs` (`assets.py`, `wine_callouts`): a small square node on the exact part, a horizontal hairline (#3664B3 on light, #7C9FD7 on navy), the labels stacked in Inter sentence case between the bottles. No icons, no glow, no pills, no gradients. The SVG goes in a `hero` (`"look": "blue"`, hard edge over the blue panel) and fills the picture band edge to edge.

## The brief

- Which product and which machine?
- Which parts does the machine check? Take them from its article or datasheet, not from the picture.
- Has the customer whose label shows approved social use?

## The picture

- **Qualifies:** the system's own output, or a sharp photo of one real product, where every part you name is visible and large enough to point at.
- **Size:** the picture is shown whole (`fit: "contain"`) at about 770 px wide. Keep at least about 900 px on the long side; the template's is 1188 × 1080.
- **Framing:** no `split`. `imageSize` must be the file's real pixel size, or the chips land in the wrong place. Each chip has:
  - `x`, `y`: the point on the part, in percent of the image;
  - `side`: `left` or `right`;
  - `labelY`: the label's height, in percent of the picture's box. Spread the labels so they never touch each other or the part.
- **Fits today:**
  - `rev360/still-rev360-wine-four-views_blurred.png` (this template uses it);
  - `rev360/still-rev360-pet-four-views.png`, four views of a PET soap bottle, 1640 × 1048 (now used by carousel-application, slide 3). A customer label shows, so confirm approval.
- **Never acceptable:** unreadable labels, impossible geometry/light, overlays hiding evidence, or a product image presented as a validated inspection result. Approved AIS demo labels are valid.

## Structure

One `callout`: `src`, `imageSize`, `fit: "contain"`, `focus`, `headline`, and `items` (two to four chips, each with `icon`, `text`, `x`, `y`, `side` and `labelY`).

## Words

- **Headline:** the parts it sees, with the accent on what makes it different. "Etiqueta, contraetiqueta *y cápsula*, a la vez".
- **Chips:** three in the template, four at most. Each is the part's name in one or two words ("Cápsula", "Etiqueta frontal", "Contraetiqueta"), never a defect or a verdict.
- **Copy:** what it sees and how, using verified facts only, then one call to action (say the picture is the system's own only when it is). Example: "Con varias cámaras laterales, el AIS REV 360 ve la botella entera a la vez: la etiqueta, la contraetiqueta y la cápsula, sin orientarla. La imagen es del propio sistema. Envíanos muestras".

## Mistakes to avoid

- Saying "cuatro cámaras" about the AIS REV 360. Four views are not four cameras, and the count is verified only for the REV 360 Cables. Write "varias cámaras".
- A chip line or leader that ends next to the part instead of on it. Check each one at 2× zoom. Leaders never cross.
- A label that covers the text on the product label.
- A chip that names a defect the picture does not show, or "OK"/"NOK" on a chip.
- Adding `inspect` or `detect` to make it look like a result.
- More than four chips, or long chip labels: the picture is the message, and the chips only point.

## Before publishing

- The customer still approves social use of the label: Racó del Convent (Unió Origen) in the template.
- Every chip's line ends on its part, at 2× zoom.
- The parts named are ones the machine checks, according to its article.
