# Software post

**Look (post system; `docs/recipes.md`, *The post system*):** blue: the real screen across the top, with a hard edge over the brand-blue panel under the white headline. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-software.json` (one `hero` shot, brand `rosepetal`, format `4x5`).

## What it is for, and when not

The software working in production, shown as one real screen. It says "the software is real and usable". The brand that delivers the software signs it; for Rosepetal, that is `"brand": "rosepetal"`.

- What a product's software reads, named in one headline over its screen: **features**.
- A figure the screen shows: not a post. Counters are a run, not a result. A result needs a published, approved source (**result**).
- The machine around the screen: **product**.

## The template

Rosepetal's real bread inspection screen, measuring the length, width and shape of each baguette in real time.

- It is cropped at `scale` 1.15 and `focus` [65, 85] to remove the app's own header, which showed half a Rosepetal logo.
- The screen takes about two thirds of the post (`split` 0.64) and ends on a hard edge at its true grade.
- The headline sits on navy below, nothing above it, with the Rosepetal logo at the foot. There is no `text` line: what it measures is in the caption (`copy`).

## The brief

- Which software, which application, which sector?
- Is the screen from production or from a demo? The caption says which.
- What does it measure or decide? Read this from the screen itself, not from a brochure.
- Does the screen show customer names, products or data that need approval?

## The picture

- **Qualifies:** a real screenshot, or a sharp photo of the screen while the software is running. The live image and what it measures are readable in the band.
- **Size:** at `split` 0.64 the band is at most 1080 × 864, and it ends above the words, so in practice a little less. The template's picture is 1498 × 715. Remember that `scale` enlarges it too: the fit times `scale` must stay under 1.5×, so a wide screenshot needs its height; read the render's warnings.
- **Framing:**
  - `split` 0.64, with `scale` and `focus` set so the live image fills the band.
  - **Crop out half-cut chrome**: the app's header, menu bars, a logo cut in half, window borders. The template uses `scale` 1.15 and `focus` [65, 85].
- **Fits today:**
  - `real/rosepetal_bread-inspection-screen.jpg` (this template uses it);
  - `rev360/still-rev360-operator-screen.png`, Rosepetal on an AIS REV 360 (used by the application carousel cover);
  - `real/rev360-cables_rosepetal-screen.jpg` (used by carousel-product);
  - `rosepetal/rp_tuna-can-live-view.webp`, Rosepetal's live view of an open tuna can, 997 × 644 (used by the sector carousel's contact slide; too small for a 0.64 band).
- **Never acceptable:** generated dashboards, mock-ups shown as production, a demo screen captioned as production, and a screen with a composited "Ready for production" card or figures laid over it.

## Structure

One `hero`: `src`, `split`, `scale`, `focus` and `headline`. No `text` and no `items`; the logo signs at the foot.

## Words

- **Headline:** what the software does to the product, with the accent on the result: "El pan, *medido en tiempo real*".
- **Copy:**
  1. what it does, on what;
  2. where the screen comes from, only if that is true ("La pantalla es la del sistema en producción.");
  3. one call to action.

  Example: "Rosepetal inspecciona barras de pan en tiempo real: mide largo y ancho, aparta las que no cumplen y lleva la cuenta de los errores por tipo. La pantalla es la del sistema en producción. Solicita una demo".

## Mistakes to avoid

- Quoting the counters on the screen (67478 results, 9374 errors) as performance.
- "Impulsado por IA", "AI-powered" or "autoaprendizaje". The check fails them, and they say nothing.
- A demo captioned as production.
- A half-cut logo or header from the app itself left at the edge of the crop.
- Brand: a Rosepetal screen on an AIS machine is signed by the brand that delivers the piece. Ask if it is unclear.

## Before publishing

- The screen is from production, or the caption says it is a demo.
- No customer data shows, or the customer has approved it.
