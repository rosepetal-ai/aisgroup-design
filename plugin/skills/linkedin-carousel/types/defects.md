# Defects carousel

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/carousel-defects.json` (AIS REV 360 Compact on canned food, Spanish, five slides; English: `pieces/posts/22-carousel-cans-reference/recipe-en.json`). It is the reference for every product we inspect.

## What it is for, and when not

One machine, one product, the defects it catches, told as a question the reader answers. The cover shows a lineup of the relevant products and asks which one you would reject; each inner slide answers it for one thing the machine checks (the label, the container, the printed code), so the set walks round the product: that is the "360°". It answers "what would it catch on my product?".

- The machine itself, its parts and how it is installed: **product**.
- One inspection on real system output: **application**.

## The brief

- Which machine, which product, and the product's real dimensions (the render pipeline builds the renders from them).
- Which defects? Start with the original marketing material and [the defect matrix](../references/defect-matrix.md), then check evidence for that exact machine, product and configuration. Show one defect per answer slide. Make additional carousels in the same system for further defects rather than omitting them or overcrowding a slide. Unverified machine claims and images remain clearly blocked drafts.
- The pictures are renders from AIS's render pipeline: a lineup, then a good/defective pair per defect, all on section grey.

## Structure

1. **`hero`, brand blue:** the clean `lineup` render, or a clean pair when no lineup qualifies (the juice reference uses its tamper pair), `split` 0.6. Use the actual product count and layout, not a fixed count of three. Headline: the question, filling two lines naturally, accent on its closing phrase ("¿Cuál de estas latas|*rechazarías*?", "Which of these cans|*would you reject*?"). A shorter question leaves a blank band above the logo, and padding it onto two lines reads wrong. No caption.
2. **`panel`, white, the answer:** the same `lineup` with its overlay (the reveal is an intentional clean/reveal reuse). Headline: which one, and what is wrong ("La del centro:|etiqueta torcida"). Caption: what the picture is ("Tres latas de muestra").
3. **`panel`, white:** the second defect's pair, good and defective side by side. "Envase" / "La de la derecha:|lata abollada" / "Dos latas, antes de etiquetar" (not "sin etiqueta": that reads as the defect).
4. **`panel`, white:** the third defect's pair, stacked when the subject is round and seen from above. "Lote y fecha" / "La de abajo:|código ilegible" / "Dos tapas, vistas desde arriba".
5. **`contact`, brand blue:** a new question that brings the cover's back to the reader's line ("¿Qué latas rechazaría|*en tu línea*?", "What would it reject|*on your line*?"), one approved action, web and phone. Never the template's headline with one word swapped.

Every product picture uses `"evidence": "render"` (no "Ilustración" caption).

## Words

- **One pattern for every answer:** the headline points at the product ("La del centro", "La de la derecha", "La de abajo") and names the defect as a noun and an adjective ("etiqueta torcida", "lata abollada", "código ilegible"). English: "The middle one: crooked label".
- **Plain words a plant manager uses.** No overline or kicker above the headline ("Lote y fecha" style): what is checked goes in the post text.
- **The verdicts and labels on the pictures** follow one pattern: "OK" on a good part, "NOK 1 defecto" on a reject, the chip names the defect, a reading shows what the system read.
- **English** is British and plant-floor: "Can body", "Batch and date", "The bottom one", "The AIS REV 360 Compact checks…".
- **Copy:** the question, what the machine checks and how ("revisa las latas a 360° en la propia línea: la etiqueta, el envase y el código de lote y fecha"), what it detects, the call to action. No figures.

## Mistakes to avoid

- A dark «night» slide for the pairs: a cover is white or blue, content slides are white, the closing slide is brand blue.
- Product photos on two different grounds (grey and navy): every product photo on section grey.
- A three-quarter cover view: every label slants and the defect hides.
- Two verdicts on one picture (a baked "OK 1/1" and an engine label "Correcta").
- An upright product in a wide 2:1 slot: pairs of upright products go side by side.
- Previews placed in a piece: only full-size renders, and no resolution warning left in the render report.
- Headlines that list defects instead of answering the cover's question.
- A dent that reads as a stain, a code printed grey, a reading box that clips its characters, ground shadows from the lid's ring lights.

## Before publishing

- The defects are in AIS's articles for that machine.
- Every overlay chip sits on the background and every box on the defect, at 2×.
- Spanish read by a native speaker; English written, not translated.

## The series

Products share this visual system; choose a meaningful slide count: one band grid, brand-blue cover and contact, white answers, one verdict style, the hexagon corner top right on the contact. Current references, ES and EN: `pieces/posts/20-carousel-juice-hopper/` (juice, AIS Hopper: tamper band, tilted cap, fill level), `21-carousel-vials-pharma/`, `22-carousel-cans-reference/`, `23-carousel-muesli-reference/`. More defects make another instalment in the same system, never a crowded slide.

- Pictures: isolated products on the `#F1F5F9` sweep, no conveyors or rails; AIS demo labels with category-appropriate design, never a real brand. Ask the brand team for missing pairs.
- A defect is shown only when that machine's articles, brochure (`pieces/brochures/<machine>/`) or [the defect matrix](../references/defect-matrix.md) back it for that product. Otherwise leave it out and say so.
- A simulated reading on a render is not a system result: no confidences on renders.
- Never publish a `--force` draft.
