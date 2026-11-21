# Partner carousel

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/carousel-partner.json` (Omron V275, Spanish, four slides).

## What it is for, and when not

A partner's product that we distribute. The slides are: the product, the problem it solves, what it verifies, and who distributes it and how to reach us. The partner's name and product are written as the partner writes them.

- Our own machine: **product**.
- A fair where the partner's product is shown: the event post, then a recap. Never a "visit us" slide inside this carousel.

## The template

The same real Omron V275 photographs at full resolution (3072 px).

- The cover is a `split` band (0.64), like every other cover, with the name only.
- Two white slides follow, with the photo framed large at its true grade (`split` 0.62), a caption and one headline: context, and what it verifies.
- The blue contact slide has no picture, like every closing slide; the post text says who distributes it. Only three V275 photos exist, and all three are used above.

## The brief

- The partner and the product, as the partner writes them.
- What we are to them, in wording that is verified ("AIS Vision Systems distribuye en exclusiva los sistemas de Omron LVS").
- Certifications, exactly as the partner states them ("certificado por GS1").
- The partner's written permission for the photos and the name, and any brand rules they set.

## The picture

- **Qualifies:** real photos of the partner's product, ours or supplied by the partner with permission. Supplied credible views of the exact partner model are also valid when rights permit.
- **Size:** the 3072 × 1728 V275 photos fill the cover band and the framed pictures on the white slides easily.
- **Framing:**
  - The cover is `split` 0.64 with `focus` [32, 50]: the printer whole in the band, at its true grade, no fade.
  - The panels are `"bg": "white"` at `split` 0.62, with `focus` on the screen and the verifier head. The engine fails a panel whose picture gets under 40 % of the slide ("picture-small").
  - Every panel picture has a `caption` saying what it shows, on one line (about 55 characters): "El software del V275 marca una etiqueta defectuosa", "El cabezal del V275 sobre una etiqueta de prueba". A second line pushes the words off the slide.
- **Fits today:** `linkedin-2026/pdf-images/v275/img-001-000.png` (printer with the verifier), `img-002-001.png` (operator screen) and `img-003-002.png` (verifier head). This template uses all three.
- **Never acceptable:**
  - `v275/img-003-003.png`, a navy fill;
  - `v275/img-004-005.png`, the glowing hexagon wave;
  - the partner's logo pasted onto a slide;
  - a partner picture that fails credibility or misidentifies the model.

## Structure

1. **`hero`, dark cover:** photo in a `split` band, headline (the product name). No `text`, no icon chips.
2. **`panel`, white, context:** framed photo and caption, the problem as headline. No `text`.
3. **`panel`, white, what it verifies:** framed photo and caption, and a headline that lists what it verifies. No rows.
4. **`contact`, brand blue:** a question headline, `action`, and two rows (web, phone). No `text`; the distribution line goes in the copy.

## Words

- **Cover:** "Omron V275". The GS1 certification goes in the copy, not in chips.
- **Accent:** on the context slide and the contact slide only.
- **Context:** "Un código que no se lee *vuelve como devolución*".
- **What it verifies:** "Calidad de impresión, códigos y textos". The rows this slide used to carry are now the headline; logos and encoded data can go in the copy.
- **Contact:** "¿Verificamos *tus etiquetas*?" and the action "Solicita una demo"; the copy carries the distribution line "AIS Vision Systems distribuye en exclusiva los verificadores de Omron LVS.". The call to action may recur; the distribution line and the headline are written for each piece.
- **Copy:** what it verifies and when, the certification as stated, our role, and the call to action.

## Mistakes to avoid

- Claims the partner does not make, or a certification worded more strongly than theirs.
- Writing as if the product were ours. AIS Vision Systems signs as the distributor.
- An event slide at the end.
- Capitals or colons in headlines ("Inspecciona:"), and the partner's or our logo made larger than the engine sets it.

## Before publishing

- Omron's written permission for the photos and the name.
- The operator in `img-002-001.png` cannot be identified, or has consented.
- "En exclusiva" is still true.
