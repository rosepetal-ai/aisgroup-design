# render-review production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder.

Passing checks proves little: every fault below passed the engine's checks once. Review in three layers, in order, and fix before showing anything.

## 1. Relevant measured checks

1. 3D renders come from AIS's internal render pipeline, whose build checks each product set. If a set reached you without that check, look for the same faults: a ground that isn't exactly `#F1F5F9`; a panel picture that isn't 4:3 or is under 1350 px wide; a blue cast on bare metal; label navy far from `#17356E`; an overlay box outside the picture; a reading box that touches its characters; a legible code printed grey; a defect that doesn't show without its overlay.
2. `python3 skills/_shared/scripts/safe_render.py -- node engine/render.mjs work/<slug>/recipe-<lang>.json` for every language: no errors, every warning explained. The engine fails a render whose baked-in overlay is cropped by its slot (`overlay-cropped`), text in the logo's clear space, chips outside the safe area, pictures shown over 2× their size.
3. `node engine/check.mjs templates/<the template>.json` if the piece is (or changed) a template; after an engine change, the carousel templates still render without errors.

## 2. By eye, slide by slide (Read every PNG, then 2× crops of every overlay)

At feed size (about 550 px wide):

- **The question can be answered.** On a "which one would you reject" cover, the defect is findable without the overlay. Labels level (camera at the products' mid-height), defect big enough to see.
- **The defect reads as that defect.** A dent bends reflections and catches light; a stain-like dark blob is not a dent. A crooked label is crooked, not curved by perspective.
- **The set is one system.** Brand-blue cover and contact, white panels, every product photo on the same section grey, no navy or night grounds between them. Same verdict pattern on every picture ("OK"; "NOK 1 defecto").
- **Nothing is cut.** Products, verdicts, chips and captions whole; the caption chip clear of the product.
- **No blank bands.** The photo bands keep one grid across the set, so a one-line cover headline leaves a gap above the logo. Write a fuller headline that fills two lines naturally ("¿Cuál de estas latas|*rechazarías*?"), never a short one padded onto two ("¿Cuál|rechazarías?"). The engine warns (`gap-soft`).
- **The footer breathes.** Clear air between the headline and the step number.
- **Hexagons stay faint and in their corner,** never behind words.
- **Isolated products:** no conveyor, chain, rails or hood in a product post.
- **Machines:** exterior only, guards closed, nothing inside visible; never captioned or named as render, CAD or 3D (captions, alt text, file names, PDF metadata).
- **Detection tiles:** one defect per tile, each cropped on its own defect, same light and framing across the machine's set.

At 2×:

- Every box on its defect, every chip above its box or beside its reading, none covering the evidence or a neighbour.
- Reading boxes padded round the characters; legible code black, illegible code visibly smeared.
- The button arrow optically centred: equal space either side of the words and arrow, arrow on the capitals' centre line.
- No artefacts: fringes, halos, an X of shadows, banding, clipped highlights.

The words:

- Each slide answers the cover's question in the same pattern; the story walks round the product.
- Spanish natural to a plant manager ("Envase", "Lote y fecha", not "Cuerpo", "Tapa"); English British and plant-floor ("Can body", "Batch and date", "The bottom one"); headlines broken by phrase, accent only on the closing phrase; the contact headline new for this piece.
- Captions say what the picture is and never read as the defect ("antes de etiquetar", not "sin etiqueta").

## 3. Independent reviewer when authorised

If the session doesn't allow agents, review it yourself and state that scope. Otherwise use an independent reviewer, not anchored on your reasoning. Give it the slide PNG paths for every language, the `_copy.txt` files, the approved template renders in `out/templates/` (`npm run templates`) as the standard, `linkedin-carousel/SKILL.md` and the type's playbook, and the decisions it must not re-argue (renders unlabelled, the cover-and-answer repeat, section grey ground, the overlay kit). Ask for findings per slide and language, ranked blocker / should fix / polish, each with a concrete fix, under 600 words, and whether the renders read as photographs or CG and why.

Weigh its findings against the guide's own words before acting (the guide puts chips above a box, not on the part). Fix what holds, then hand it over.

## 4. Grow the list

Add reusable guidance only for demonstrated recurring failures. A measured check belongs in the engine only when it verifies a meaningful invariant and its owner authorises the change. Avoid accumulating rules for isolated examples.
