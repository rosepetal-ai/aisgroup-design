# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-381fb2d2d89b

<!-- AIS-381fb2d2d89b -->
Passing checks proves little: every fault below passed the engine's checks once. Review in three layers, in order, and fix before showing anything.

Source: plugin/skills/render-review/SKILL.md:11.

## AIS-f95d4fddf994

<!-- AIS-f95d4fddf994 -->
3D renders come from AIS's internal render pipeline, whose build checks each product set. If a set reached you without that check, look for the same faults: a ground that isn't exactly `#F1F5F9`; a panel picture that isn't 4:3 or is under 1350 px wide; a blue cast on bare metal; label navy far from `#17356E`; an overlay box outside the picture; a reading box that touches its characters; a legible code printed grey; a defect that doesn't show without its overlay.

Source: plugin/skills/render-review/SKILL.md:15.

## AIS-86b69a37e4f1

<!-- AIS-86b69a37e4f1 -->
`python3 skills/_shared/scripts/safe_render.py -- node engine/render.mjs work/<slug>/recipe-<lang>.json` for every language: no errors, every warning explained. The engine fails a render whose baked-in overlay is cropped by its slot (`overlay-cropped`), text in the logo's clear space, chips outside the safe area, pictures shown over 2× their size.

Source: plugin/skills/render-review/SKILL.md:16.

## AIS-d154c792aab2

<!-- AIS-d154c792aab2 -->
`node engine/check.mjs templates/<the template>.json` if the piece is (or changed) a template; after an engine change, the carousel templates still render without errors.

Source: plugin/skills/render-review/SKILL.md:17.

## AIS-d3b89aa80c84

<!-- AIS-d3b89aa80c84 -->
At feed size (about 550 px wide):

Source: plugin/skills/render-review/SKILL.md:21.

## AIS-7688ef67865e

<!-- AIS-7688ef67865e -->
**The question can be answered.** On a "which one would you reject" cover, the defect is findable without the overlay. Labels level (camera at the products' mid-height), defect big enough to see.

Source: plugin/skills/render-review/SKILL.md:23.

## AIS-e11d7a155590

<!-- AIS-e11d7a155590 -->
**The defect reads as that defect.** A dent bends reflections and catches light; a stain-like dark blob is not a dent. A crooked label is crooked, not curved by perspective.

Source: plugin/skills/render-review/SKILL.md:24.

## AIS-0dc454939281

<!-- AIS-0dc454939281 -->
**The set is one system.** Brand-blue cover and contact, white panels, every product photo on the same section grey, no navy or night grounds between them. Same verdict pattern on every picture ("OK"; "NOK 1 defecto").

Source: plugin/skills/render-review/SKILL.md:25.

## AIS-e7b6bed3feb1

<!-- AIS-e7b6bed3feb1 -->
**Nothing is cut.** Products, verdicts, chips and captions whole; the caption chip clear of the product.

Source: plugin/skills/render-review/SKILL.md:26.

## AIS-41527d7cc486

<!-- AIS-41527d7cc486 -->
**No blank bands.** The photo bands keep one grid across the set, so a one-line cover headline leaves a gap above the logo. Write a fuller headline that fills two lines naturally ("¿Cuál de estas latas|*rechazarías*?"), never a short one padded onto two ("¿Cuál|rechazarías?"). The engine warns (`gap-soft`).

Source: plugin/skills/render-review/SKILL.md:27.

## AIS-ef317c078bb6

<!-- AIS-ef317c078bb6 -->
**The footer breathes.** Clear air between the headline and the step number.

Source: plugin/skills/render-review/SKILL.md:28.

## AIS-5752aacb6dcd

<!-- AIS-5752aacb6dcd -->
**Hexagons stay faint and in their corner,** never behind words.

Source: plugin/skills/render-review/SKILL.md:29.

## AIS-fe06bf5dad7f

<!-- AIS-fe06bf5dad7f -->
**Isolated products:** no conveyor, chain, rails or hood in a product post.

Source: plugin/skills/render-review/SKILL.md:30.

## AIS-ef5dfa3b34c8

<!-- AIS-ef5dfa3b34c8 -->
**Machines:** exterior only, guards closed, nothing inside visible; never captioned or named as render, CAD or 3D (captions, alt text, file names, PDF metadata).

Source: plugin/skills/render-review/SKILL.md:31.

## AIS-1b0cfca50196

<!-- AIS-1b0cfca50196 -->
**Detection tiles:** one defect per tile, each cropped on its own defect, same light and framing across the machine's set.

Source: plugin/skills/render-review/SKILL.md:32.

## AIS-64fe3e70994a

<!-- AIS-64fe3e70994a -->
At 2×:

Source: plugin/skills/render-review/SKILL.md:34.

## AIS-8079de7ab51d

<!-- AIS-8079de7ab51d -->
Every box on its defect, every chip above its box or beside its reading, none covering the evidence or a neighbour.

Source: plugin/skills/render-review/SKILL.md:36.

## AIS-253ccb49d217

<!-- AIS-253ccb49d217 -->
Reading boxes padded round the characters; legible code black, illegible code visibly smeared.

Source: plugin/skills/render-review/SKILL.md:37.

## AIS-931ccd5eea4a

<!-- AIS-931ccd5eea4a -->
The button arrow optically centred: equal space either side of the words and arrow, arrow on the capitals' centre line.

Source: plugin/skills/render-review/SKILL.md:38.

## AIS-4917068f3337

<!-- AIS-4917068f3337 -->
No artefacts: fringes, halos, an X of shadows, banding, clipped highlights.

Source: plugin/skills/render-review/SKILL.md:39.

## AIS-a4a6b08892fb

<!-- AIS-a4a6b08892fb -->
The words:

Source: plugin/skills/render-review/SKILL.md:41.

## AIS-25f823999f60

<!-- AIS-25f823999f60 -->
Each slide answers the cover's question in the same pattern; the story walks round the product.

Source: plugin/skills/render-review/SKILL.md:43.

## AIS-ea6c8a179e14

<!-- AIS-ea6c8a179e14 -->
Spanish natural to a plant manager ("Envase", "Lote y fecha", not "Cuerpo", "Tapa"); English British and plant-floor ("Can body", "Batch and date", "The bottom one"); headlines broken by phrase, accent only on the closing phrase; the contact headline new for this piece.

Source: plugin/skills/render-review/SKILL.md:44.

## AIS-0541cac71f7e

<!-- AIS-0541cac71f7e -->
Captions say what the picture is and never read as the defect ("antes de etiquetar", not "sin etiqueta").

Source: plugin/skills/render-review/SKILL.md:45.

## AIS-3c878a075a0f

<!-- AIS-3c878a075a0f -->
If the session doesn't allow agents, review it yourself and state that scope. Otherwise use an independent reviewer, not anchored on your reasoning. Give it the slide PNG paths for every language, the `_copy.txt` files, the approved template renders in `out/templates/` (`npm run templates`) as the standard, `linkedin-carousel/SKILL.md` and the type's playbook, and the decisions it must not re-argue (renders unlabelled, the cover-and-answer repeat, section grey ground, the overlay kit). Ask for findings per slide and language, ranked blocker / should fix / polish, each with a concrete fix, under 600 words, and whether the renders read as photographs or CG and why.

Source: plugin/skills/render-review/SKILL.md:49.

## AIS-0e6c8aa7664b

<!-- AIS-0e6c8aa7664b -->
Weigh its findings against the guide's own words before acting (the guide puts chips above a box, not on the part). Fix what holds, then hand it over.

Source: plugin/skills/render-review/SKILL.md:51.

## AIS-e102c22080ef

<!-- AIS-e102c22080ef -->
Add reusable guidance only for demonstrated recurring failures. A measured check belongs in the engine only when it verifies a meaningful invariant and its owner authorises the change. Avoid accumulating rules for isolated examples.

Source: plugin/skills/render-review/SKILL.md:55.

## AIS-e104a445bfd1

<!-- AIS-e104a445bfd1 -->
`node render.mjs specs/my-chart.vl.json > my-chart.svg` (add `--locale es` or `--locale ca`, and `--dark` for dark backgrounds).

Source: plugin/brand/downloads/charts/README.md:9.

## AIS-f046642458fb

<!-- AIS-f046642458fb -->
**Keep the computer responsive:** run at most one local Blender render at a time, at low priority and with a modest CPU limit; check available memory before starting further jobs.

Source: brand decisions.

## AIS-4a3da0dd4ff9

<!-- AIS-4a3da0dd4ff9 -->
Never glow, 3D, particles, a perspective wave, over a photo's subject, a photo masked into a hexagon, or other colours. One fade per piece.

Source: brand decisions.

## AIS-36fd90b37a06

<!-- AIS-36fd90b37a06 -->
«Bluff text» over showcase: posts with more words than picture. Large blank areas and plain layouts.

Source: brand decisions.

## AIS-ceb69893905b

<!-- AIS-ceb69893905b -->
**Proof, not promise.** Machines, installations, factories, interfaces and people are real, never generated; generated images are judged by the result, as the rule on generated images below sets out. (guide `imagery.mdx`)

Source: brand decisions.

## AIS-b726254ceaca

<!-- AIS-b726254ceaca -->
**Machines may be shown as CAD renders.** HOPPER, KARIKÓ and REV 360 Compact Pharma are rendered from their engineering STEP files as KeyShot-level content: images, animations, catalogues.

Source: brand decisions.

## AIS-0b812b9989e9

<!-- AIS-0b812b9989e9 -->
The CAD and its meshes stay local, never in Drive or git.

Source: brand decisions.

## AIS-f0dc3428dd52

<!-- AIS-f0dc3428dd52 -->
For these three machines, this replaces the rule that machines stay real photographs.

Source: brand decisions.

## AIS-9f0a1a858f53

<!-- AIS-9f0a1a858f53 -->
Each piece uses its own real picture, with no repeats across a set. Never upscale a picture past its medium’s limit: 1.25× its native size in print and on carousel slides, 1.3× in a deck’s photo panel, 1.5× on a single post. Vary photos: do not overuse the Hopper control-panel photo.

Source: brand decisions.

## AIS-60a3b2a68b34

<!-- AIS-60a3b2a68b34 -->
Imagery is grouped by communication intent with allowed use cases, not free choice. The guide uses no people images.

Source: brand decisions.

## AIS-2336c8c4e7d0

<!-- AIS-2336c8c4e7d0 -->
| «Can we use this generated or AI image?» | Judge the result: `brand-review` step 1. Product pictures and defect tiles come from AIS's render pipeline |

Source: brand decisions.

## AIS-f8670a1c9d0a

<!-- AIS-f8670a1c9d0a -->
| «Do we have a photo of X?», new photos and footage, rights | `asset-library` (`library/catalog.json`: approved, review, rejected) |

Source: brand decisions.

## AIS-67937adf903a

<!-- AIS-67937adf903a -->
Show only finished work; verify like a critic (zoom on every mark, physical sense, one defect per picture).

Source: brand decisions.

## AIS-b052f7875fd4

<!-- AIS-b052f7875fd4 -->
The header pattern only as a soft corner fade flush to the band's edges (top right on opening grounds, bottom right on closing grounds, hairline #7C9FD7 at about 25 %), never under a photo or behind text; one size per medium.

Source: brand decisions.

## AIS-64688c37474e

<!-- AIS-64688c37474e -->
Brochures, catalogues and datasheets come from ONE template in the accepted family (Cables v4, Hopper editorial, Vacuum); redesign means new pictures and inner layout only. Detection lists are photo grids, each tile cropped on its own defect. No draft badges or review text. «Do what marketing had» means their content, never their look.

Source: brand decisions.

## AIS-38e3245abb13

<!-- AIS-38e3245abb13 -->
Products in stills match real ones exactly (real line or packaging arrangement, faulty unit off centre, real liquid and labels); real models (Poly Haven) before procedural ones; if a defect will not read, pick another real defect. Renders keep the accepted baseline look and change one thing at a time; renders are matched side by side against a real photo of the same product.

Source: brand decisions.
