# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-4605c523bb95

<!-- AIS-4605c523bb95 -->
**`panel`, white, context:** products entering, with a caption, the reason the defect is missed. No `text`.

Source: plugin/skills/linkedin-carousel/types/application.md:44.

## AIS-a8cb000df774

<!-- AIS-a8cb000df774 -->
**`panel`, dark, what it detects:** the system's views of a product, with a caption, and a headline that lists what it detects. No rows.

Source: plugin/skills/linkedin-carousel/types/application.md:45.

## AIS-5929af7ba9a5

<!-- AIS-5929af7ba9a5 -->
**`panel`, white, on the line:** the machine on a real line, with a caption, and how it installs as the headline.

Source: plugin/skills/linkedin-carousel/types/application.md:46.

## AIS-730db1e92065

<!-- AIS-730db1e92065 -->
**`contact`, brand blue:** the headline, `action`, and two rows (web, phone). No `text`.

Source: plugin/skills/linkedin-carousel/types/application.md:47.

## AIS-fd94323c381d

<!-- AIS-fd94323c381d -->
**Cover:** "AIS REV 360".

Source: plugin/skills/linkedin-carousel/types/application.md:51.

## AIS-6495d2fa6445

<!-- AIS-6495d2fa6445 -->
**Accent:** the cover is a name, so the accent goes on the context slide and the contact slide. The rest are plain.

Source: plugin/skills/linkedin-carousel/types/application.md:52.

## AIS-aeac22d1f559

<!-- AIS-aeac22d1f559 -->
**Context:** "El defecto suele estar *en la cara que no miras*".

Source: plugin/skills/linkedin-carousel/types/application.md:53.

## AIS-ae7985eee433

<!-- AIS-ae7985eee433 -->
**What it detects:** "Burbujas, despegues, textos y códigos", caption "Las vistas del AIS REV 360 de una botella PET". The four cells the slide used to carry are now the headline; misaligned labels and where each defect sits can go in the copy.

Source: plugin/skills/linkedin-carousel/types/application.md:54.

## AIS-8371cefd7a53

<!-- AIS-8371cefd7a53 -->
**On the line:** "Sobre el transportador que ya tienes".

Source: plugin/skills/linkedin-carousel/types/application.md:55.

## AIS-5c532093615c

<!-- AIS-5c532093615c -->
**Contact:** "Pruébalo *con tus envases*" and the action "Pruébalo con tus productos". No closing line on the slide; an offer such as "Trae unas muestras y revisamos sus etiquetas contigo" goes in the copy if anywhere.

Source: plugin/skills/linkedin-carousel/types/application.md:56.

## AIS-435815607603

<!-- AIS-435815607603 -->
**Copy:** where the defect hides, what the system does (cameras of high resolution and deep learning, in the line), "Las imágenes son del sistema en una planta real", and the call to action.

Source: plugin/skills/linkedin-carousel/types/application.md:57.

## AIS-ab5e60443db1

<!-- AIS-ab5e60443db1 -->
"Cuatro cámaras" or any camera count for the REV 360.

Source: plugin/skills/linkedin-carousel/types/application.md:61.

## AIS-7c2599319a5d

<!-- AIS-7c2599319a5d -->
Defects outside AIS's REV 360 articles.

Source: plugin/skills/linkedin-carousel/types/application.md:62.

## AIS-7215851196bb

<!-- AIS-7215851196bb -->
A defect picture made by a generator, or a "result" drawn by hand.

Source: plugin/skills/linkedin-carousel/types/application.md:63.

## AIS-4e8659834321

<!-- AIS-4e8659834321 -->
Repeating the post-callout picture or its message.

Source: plugin/skills/linkedin-carousel/types/application.md:64.

## AIS-e884dbec53f4

<!-- AIS-e884dbec53f4 -->
Icon cells for the defects when the system's own views show them.

Source: plugin/skills/linkedin-carousel/types/application.md:65.

## AIS-9604d8550803

<!-- AIS-9604d8550803 -->
Rows or a body line on a white slide: the picture drops under 40 % and the check fails ("picture-small").

Source: plugin/skills/linkedin-carousel/types/application.md:66.

## AIS-3465fcf2793f

<!-- AIS-3465fcf2793f -->
The customers whose products, labels and line appear approve their use. Ask marketing for the clean master.

Source: plugin/skills/linkedin-carousel/types/application.md:70.

## AIS-d3e5e7a7d434

<!-- AIS-d3e5e7a7d434 -->
The four defects match AIS's REV 360 articles.

Source: plugin/skills/linkedin-carousel/types/application.md:71.

## AIS-ee251ecada68

<!-- AIS-ee251ecada68 -->
Template: `templates/carousel-defects.json` (AIS REV 360 Compact on canned food, Spanish, five slides; English: `pieces/posts/22-carousel-cans-reference/recipe-en.json`). It is the reference for every product we inspect.

Source: plugin/skills/linkedin-carousel/types/defects.md:5.

## AIS-b94b052a8f29

<!-- AIS-b94b052a8f29 -->
One machine, one product, the defects it catches, told as a question the reader answers. The cover shows a lineup of the relevant products and asks which one you would reject; each inner slide answers it for one thing the machine checks (the label, the container, the printed code), so the set walks round the product: that is the "360°". It answers "what would it catch on my product?".

Source: plugin/skills/linkedin-carousel/types/defects.md:9.

## AIS-349ec13d9de7

<!-- AIS-349ec13d9de7 -->
The machine itself, its parts and how it is installed: **product**.

Source: plugin/skills/linkedin-carousel/types/defects.md:11.

## AIS-1aa503edc440

<!-- AIS-1aa503edc440 -->
One inspection on real system output: **application**.

Source: plugin/skills/linkedin-carousel/types/defects.md:12.

## AIS-61a32e49718a

<!-- AIS-61a32e49718a -->
Which machine, which product, and the product's real dimensions (the separate product-render skill builds the renders from them).

Source: plugin/skills/linkedin-carousel/types/defects.md:16.

## AIS-aafeafa82327

<!-- AIS-aafeafa82327 -->
Which defects? Start with the original marketing material and [the defect matrix](../references/defect-matrix.md), then check evidence for that exact machine, product and configuration. Show one defect per answer slide. Make additional carousels in the same system for further defects rather than omitting them or overcrowding a slide. Unverified machine claims and images remain clearly blocked drafts.

Source: plugin/skills/linkedin-carousel/types/defects.md:17.

## AIS-0c3738f23118

<!-- AIS-0c3738f23118 -->
The pictures are renders from `product-render`: a lineup, then a good/defective pair per defect, all on section grey.

Source: plugin/skills/linkedin-carousel/types/defects.md:18.

## AIS-f933eedfaa69

<!-- AIS-f933eedfaa69 -->
**`hero`, brand blue:** the clean `lineup` render, or a clean pair when no lineup qualifies (the juice reference uses its tamper pair), `split` 0.6. Use the actual product count and layout, not a fixed count of three. Headline: the question, filling two lines naturally, accent on its closing phrase ("¿Cuál de estas latas|*rechazarías*?", "Which of these cans|*would you reject*?"). A shorter question leaves a blank band above the logo, and padding it onto two lines reads wrong. No caption.

Source: plugin/skills/linkedin-carousel/types/defects.md:22.

## AIS-5f7ad3d08465

<!-- AIS-5f7ad3d08465 -->
**`panel`, white, the answer:** the same `lineup` with its overlay (the reveal is an intentional clean/reveal reuse). Headline: which one, and what is wrong ("La del centro:|etiqueta torcida"). Caption: what the picture is ("Tres latas de muestra").

Source: plugin/skills/linkedin-carousel/types/defects.md:23.

## AIS-3de69105642f

<!-- AIS-3de69105642f -->
**`panel`, white:** the second defect's pair, good and defective side by side. "Envase" / "La de la derecha:|lata abollada" / "Dos latas, antes de etiquetar" (not "sin etiqueta": that reads as the defect).

Source: plugin/skills/linkedin-carousel/types/defects.md:24.

## AIS-19f57dae40f8

<!-- AIS-19f57dae40f8 -->
**`panel`, white:** the third defect's pair, stacked when the subject is round and seen from above. "Lote y fecha" / "La de abajo:|código ilegible" / "Dos tapas, vistas desde arriba".

Source: plugin/skills/linkedin-carousel/types/defects.md:25.

## AIS-570faeff8be7

<!-- AIS-570faeff8be7 -->
**`contact`, brand blue:** a new question that brings the cover's back to the reader's line ("¿Qué latas rechazaría|*en tu línea*?", "What would it reject|*on your line*?"), one approved action, web and phone. Never the template's headline with one word swapped.

Source: plugin/skills/linkedin-carousel/types/defects.md:26.

## AIS-089409cb17d4

<!-- AIS-089409cb17d4 -->
Every product picture uses `"evidence": "render"` (no "Ilustración" caption).

Source: plugin/skills/linkedin-carousel/types/defects.md:28.

## AIS-737f53cb3023

<!-- AIS-737f53cb3023 -->
**One pattern for every answer:** the headline points at the product ("La del centro", "La de la derecha", "La de abajo") and names the defect as a noun and an adjective ("etiqueta torcida", "lata abollada", "código ilegible"). English: "The middle one: crooked label".

Source: plugin/skills/linkedin-carousel/types/defects.md:32.

## AIS-da24852ed4c9

<!-- AIS-da24852ed4c9 -->
**Plain words a plant manager uses.** No overline or kicker above the headline ("Lote y fecha" style): what is checked goes in the post text.

Source: plugin/skills/linkedin-carousel/types/defects.md:33.

## AIS-8320b451046a

<!-- AIS-8320b451046a -->
**The verdicts and labels on the pictures** follow one pattern: "OK" on a good part, "NOK 1 defecto" on a reject, the chip names the defect, a reading shows what the system read.

Source: plugin/skills/linkedin-carousel/types/defects.md:34.

## AIS-7ca2ca92944c

<!-- AIS-7ca2ca92944c -->
**English** is British and plant-floor: "Can body", "Batch and date", "The bottom one", "The AIS REV 360 Compact checks…".

Source: plugin/skills/linkedin-carousel/types/defects.md:35.

## AIS-e8936d2be59e

<!-- AIS-e8936d2be59e -->
**Copy:** the question, what the machine checks and how ("revisa las latas a 360° en la propia línea: la etiqueta, el envase y el código de lote y fecha"), what it detects, the call to action. No figures.

Source: plugin/skills/linkedin-carousel/types/defects.md:36.

## AIS-8d8d259633ee

<!-- AIS-8d8d259633ee -->
A dark «night» slide for the pairs: a cover is white or blue, content slides are white, the closing slide is brand blue.

Source: plugin/skills/linkedin-carousel/types/defects.md:40.

## AIS-da710b03a40b

<!-- AIS-da710b03a40b -->
Product photos on two different grounds (grey and navy): every product photo on section grey.

Source: plugin/skills/linkedin-carousel/types/defects.md:41.

## AIS-cc5581db519a

<!-- AIS-cc5581db519a -->
A three-quarter cover view: every label slants and the defect hides.

Source: plugin/skills/linkedin-carousel/types/defects.md:42.

## AIS-610e2eecf750

<!-- AIS-610e2eecf750 -->
Two verdicts on one picture (a baked "OK 1/1" and an engine label "Correcta").

Source: plugin/skills/linkedin-carousel/types/defects.md:43.

## AIS-a7a395266eaa

<!-- AIS-a7a395266eaa -->
An upright product in a wide 2:1 slot: pairs of upright products go side by side.

Source: plugin/skills/linkedin-carousel/types/defects.md:44.

## AIS-4ea1b0da37db

<!-- AIS-4ea1b0da37db -->
Previews placed in a piece: only full-size renders, and no resolution warning left in the render report.

Source: plugin/skills/linkedin-carousel/types/defects.md:45.

## AIS-089a9409c8cb

<!-- AIS-089a9409c8cb -->
Headlines that list defects instead of answering the cover's question.

Source: plugin/skills/linkedin-carousel/types/defects.md:46.

## AIS-46cb297de2e4

<!-- AIS-46cb297de2e4 -->
A dent that reads as a stain, a code printed grey, a reading box that clips its characters, ground shadows from the lid's ring lights.

Source: plugin/skills/linkedin-carousel/types/defects.md:47.

## AIS-b5b34058dfc4

<!-- AIS-b5b34058dfc4 -->
The defects are in AIS's articles for that machine.

Source: plugin/skills/linkedin-carousel/types/defects.md:51.

## AIS-e21adf7cdb9d

<!-- AIS-e21adf7cdb9d -->
Every overlay chip sits on the background and every box on the defect, at 2×.

Source: plugin/skills/linkedin-carousel/types/defects.md:52.

## AIS-bf3d5a2972cd

<!-- AIS-bf3d5a2972cd -->
Spanish read by a native speaker; English written, not translated.

Source: plugin/skills/linkedin-carousel/types/defects.md:53.

## AIS-2135ec3cdc50

Historical wording: explicitly superseded by AIS-5798fe4281be. Apply the dated resolution to the conflicting clause; preserve other clauses and this exact historical wording.

<!-- AIS-2135ec3cdc50 -->
Products share this visual system; choose a meaningful slide count: one band grid, brand-blue cover and contact, white answers, one verdict style, the hexagon corner top right on the contact. Current references, ES and EN: `pieces/posts/20-carousel-juice-hopper/` (juice, AIS Hopper: tamper band, tilted cap, fill level), `21-carousel-vials-pharma/`, `22-carousel-cans-reference/`, `23-carousel-muesli-reference/`. More defects make another instalment in the same system, never a crowded slide.

Source: plugin/skills/linkedin-carousel/types/defects.md:57.

## AIS-dd784588dbba

<!-- AIS-dd784588dbba -->
Pictures: isolated products on the `#F1F5F9` sweep, no conveyors or rails; AIS demo labels with category-appropriate design, never a real brand. Missing pairs are a `product-render` job.

Source: plugin/skills/linkedin-carousel/types/defects.md:59.

## AIS-84eac5fd51f9

<!-- AIS-84eac5fd51f9 -->
A defect is shown only when that machine's articles, brochure (`pieces/brochures/<machine>/`) or [the defect matrix](../references/defect-matrix.md) back it for that product. Otherwise leave it out and say so.

Source: plugin/skills/linkedin-carousel/types/defects.md:60.

## AIS-1e9b5e094904

<!-- AIS-1e9b5e094904 -->
A simulated reading on a render is not a system result: no confidences on renders.

Source: plugin/skills/linkedin-carousel/types/defects.md:61.

## AIS-81d5ce21d586

<!-- AIS-81d5ce21d586 -->
Never publish a `--force` draft.

Source: plugin/skills/linkedin-carousel/types/defects.md:62.

## AIS-acefc82b003e

<!-- AIS-acefc82b003e -->
Template: `templates/carousel-event.json` (Rosepetal at 4YFN, MWC Barcelona 2026, English, four slides).

Source: plugin/skills/linkedin-carousel/types/event.md:5.

## AIS-1ad9e9053055

<!-- AIS-1ad9e9053055 -->
A recap after an event we took part in. The slides are: the stand, the demo, the talk, and how to see it if you missed us. **Recap, not announcement.**

Source: plugin/skills/linkedin-carousel/types/event.md:9.

## AIS-d1a2475285a5

<!-- AIS-d1a2475285a5 -->
An event still to come: the event post (`social-post`). It is announced once, there.

Source: plugin/skills/linkedin-carousel/types/event.md:11.

## AIS-662ab480ab0d

<!-- AIS-662ab480ab0d -->
One moment, one photo: the recap post (`social-post`).

Source: plugin/skills/linkedin-carousel/types/event.md:12.

## AIS-ab2c40559ae7

<!-- AIS-ab2c40559ae7 -->
Rosepetal at 4YFN, MWC Barcelona 2026 (2 to 5 March), on the Tech Barcelona stand. It is in English and uses real photos that Rosepetal published on rosepetal.ai:

Source: plugin/skills/linkedin-carousel/types/event.md:16.

## AIS-3052338ecc84

<!-- AIS-3052338ecc84 -->
a dark cover with the stand (`split` 0.64), the headline only, the logo at the foot;

Source: plugin/skills/linkedin-carousel/types/event.md:18.

## AIS-3085de24d766

<!-- AIS-3085de24d766 -->
two white slides, the demo and the talk, each a large framed photo with its caption and one headline;

Source: plugin/skills/linkedin-carousel/types/event.md:19.

## AIS-187376e9d691

<!-- AIS-187376e9d691 -->
the blue contact slide, with no picture.

Source: plugin/skills/linkedin-carousel/types/event.md:20.

## AIS-57cdf02264ae

<!-- AIS-57cdf02264ae -->
The event, its dates and our stand, as the organiser writes them.

Source: plugin/skills/linkedin-carousel/types/event.md:24.

## AIS-723bd2b6523b

<!-- AIS-723bd2b6523b -->
What we did: demos, talks, meetings.

Source: plugin/skills/linkedin-carousel/types/event.md:25.

## AIS-691c6ec1ecc5

<!-- AIS-691c6ec1ecc5 -->
Which photos, who took them, and whether they were published by us.

Source: plugin/skills/linkedin-carousel/types/event.md:26.

## AIS-73e1bed7e971

<!-- AIS-73e1bed7e971 -->
Are visitors recognisable? If so, do they consent?

Source: plugin/skills/linkedin-carousel/types/event.md:27.

## AIS-afcdaebccf25

<!-- AIS-afcdaebccf25 -->
The language. An international event can go in English.

Source: plugin/skills/linkedin-carousel/types/event.md:28.

## AIS-e66d7dab304d

<!-- AIS-e66d7dab304d -->
**Qualifies:** real photos of our stand, our demo and our talk at that event. Each slide shows a different moment.

Source: plugin/skills/linkedin-carousel/types/event.md:32.

## AIS-a046552eb60e

<!-- AIS-a046552eb60e -->
**Size:** at `split` 0.64 the cover band is at most 1080 × 864. On the white slides pictures are framed about 920 wide. The 1600 × 1204 and 1280 × 1707 photos fill both without enlargement.

Source: plugin/skills/linkedin-carousel/types/event.md:33.

## AIS-46f72d7f8e5a

<!-- AIS-46f72d7f8e5a -->
**Framing:** `split` 0.64 on the cover and 0.62 on the inner slides, with `focus` on the people and the demo. The inner slides are `"bg": "white"`, with a `caption` under the picture that says what the moment is; the engine fails one whose picture gets under 40 % ("picture-small"). Crop out other exhibitors' stands where they are not the hosts.

Source: plugin/skills/linkedin-carousel/types/event.md:34.

## AIS-f31689314dee

<!-- AIS-f31689314dee -->
`rosepetal/mwc2026_stand.jpg`, `mwc2026_demo.jpg` and `mwc2026_talk.jpg` (this template uses all three), and `mwc2026_visitors.jpg`;

Source: plugin/skills/linkedin-carousel/types/event.md:36.

## AIS-44418089328b

<!-- AIS-44418089328b -->
for AIS, `real/af2026_stand-machines.jpg` and `real/af2026_stand-portrait.jpg` (Advanced Factories 2026; the portrait can go full-bleed; crop out other exhibitors). The can demo frame `advanced-factories-2026/af26-can-demo_dents.png` (720 × 1280) is too narrow for a 920-wide frame without a soft warning, and its tile belongs to carousel-sector. `advanced-factories-2026/af26_stand-hexagons.jpg` is the event post's picture: reuse it in the recap only when it adds meaningful continuity.

Source: plugin/skills/linkedin-carousel/types/event.md:37.

## AIS-31446e739e81

<!-- AIS-31446e739e81 -->
the organiser's promotional artwork or logos;

Source: plugin/skills/linkedin-carousel/types/event.md:39.

## AIS-d3bb42af2966

<!-- AIS-d3bb42af2966 -->
close-ups of visitors without consent;

Source: plugin/skills/linkedin-carousel/types/event.md:40.

## AIS-e6a7157f0d2a

<!-- AIS-e6a7157f0d2a -->
photos from another event;

Source: plugin/skills/linkedin-carousel/types/event.md:41.

## AIS-800a10097fd0

<!-- AIS-800a10097fd0 -->
a repeated announcement photo that adds no meaning to the recap.

Source: plugin/skills/linkedin-carousel/types/event.md:42.

## AIS-3f1ba33568ae

<!-- AIS-3f1ba33568ae -->
**`hero`, dark cover:** the stand photo, headline. No `text`, no icon chips.

Source: plugin/skills/linkedin-carousel/types/event.md:46.

## AIS-601a5bf8f3a1

<!-- AIS-601a5bf8f3a1 -->
**`panel`, white, demos:** a photo and caption, headline. No `text`.

Source: plugin/skills/linkedin-carousel/types/event.md:47.

## AIS-666d5711ba49

<!-- AIS-666d5711ba49 -->
**`panel`, white, talks:** a photo and caption, headline. No `text`.

Source: plugin/skills/linkedin-carousel/types/event.md:48.

## AIS-2dacc061fcec

<!-- AIS-2dacc061fcec -->
**`contact`, brand blue:** a "missed us?" headline, `action`, and rows. Rosepetal has only the web row. No `text`.

Source: plugin/skills/linkedin-carousel/types/event.md:49.

## AIS-2c1899438d57

<!-- AIS-2c1899438d57 -->
**Cover:** "Four days *on the stand*". Where we were (the Tech Barcelona stand, Talent Arena) goes in the copy.

Source: plugin/skills/linkedin-carousel/types/event.md:53.

## AIS-c5bd956e5ad6

<!-- AIS-c5bd956e5ad6 -->
**Accent:** on the cover and the contact slide only. Inner headlines are plain.

Source: plugin/skills/linkedin-carousel/types/event.md:54.

## AIS-df891542733f

<!-- AIS-df891542733f -->
**Demos:** "Camera, robot arm and our software".

Source: plugin/skills/linkedin-carousel/types/event.md:55.

## AIS-483abab70efb

<!-- AIS-483abab70efb -->
**Talks:** "What we have learnt building AI software".

Source: plugin/skills/linkedin-carousel/types/event.md:56.

## AIS-fb4e9f60a910

<!-- AIS-fb4e9f60a910 -->
**Contact:** "Missed us *in Barcelona*?" and the action "Book a demo". The offer ("we can show you the platform on your own images") goes in the copy.

Source: plugin/skills/linkedin-carousel/types/event.md:57.

## AIS-78e7e54b98e9

<!-- AIS-78e7e54b98e9 -->
**Copy:** thanks to the people who came and the hosts, what happened in one sentence, an offer for those who missed it, and the call to action.

Source: plugin/skills/linkedin-carousel/types/event.md:58.

## AIS-9be3ee773722

<!-- AIS-9be3ee773722 -->
Announcing: dates to come, "visit us", a stand number for a future fair.

Source: plugin/skills/linkedin-carousel/types/event.md:62.

## AIS-aaba0d51fd10

<!-- AIS-aaba0d51fd10 -->
Inflating the event: visitor counts, "the best", "everyone".

Source: plugin/skills/linkedin-carousel/types/event.md:63.

## AIS-52fb0f626928

<!-- AIS-52fb0f626928 -->
Stating the number of days wrong. Count them from the organiser's dates.

Source: plugin/skills/linkedin-carousel/types/event.md:64.

## AIS-362bb3d5bc35

<!-- AIS-362bb3d5bc35 -->
Reusing a photo from the announcement post.

Source: plugin/skills/linkedin-carousel/types/event.md:65.

## AIS-66b2c38df1ad

<!-- AIS-66b2c38df1ad -->
A body line under a photo: the headline carries the slide.

Source: plugin/skills/linkedin-carousel/types/event.md:66.

## AIS-29ed94229a37

<!-- AIS-29ed94229a37 -->
The photos were published by us, or their author has given permission.

Source: plugin/skills/linkedin-carousel/types/event.md:70.

## AIS-61af298606b9

<!-- AIS-61af298606b9 -->
Recognisable visitors appear only as event coverage, not in close-up.

Source: plugin/skills/linkedin-carousel/types/event.md:71.

## AIS-49d5cea00caf

<!-- AIS-49d5cea00caf -->
The event's name and dates match the organiser's.

Source: plugin/skills/linkedin-carousel/types/event.md:72.

## AIS-9ac5e5febe2e

<!-- AIS-9ac5e5febe2e -->
Template: `templates/carousel-guide.json` ("How to estimate the return of a vision system", English, five slides).

Source: plugin/skills/linkedin-carousel/types/guide.md:5.

## AIS-f1e68b7fba88

<!-- AIS-f1e68b7fba88 -->
A how-to. The slides are: the question, why it matters, what to gather, where to start, and talking to an engineer. It teaches something useful before any sale.

Source: plugin/skills/linkedin-carousel/types/guide.md:9.

## AIS-a55741ac32ce

<!-- AIS-a55741ac32ce -->
One machine: **product**.

Source: plugin/skills/linkedin-carousel/types/guide.md:11.

## AIS-c2842a59a0c7

<!-- AIS-c2842a59a0c7 -->
A result with a figure: the result post (`social-post`), with a published source.

Source: plugin/skills/linkedin-carousel/types/guide.md:12.

## AIS-0cbe53675a81

<!-- AIS-0cbe53675a81 -->
Five slides:

Source: plugin/skills/linkedin-carousel/types/guide.md:16.

## AIS-3af4ee557e05

<!-- AIS-3af4ee557e05 -->
a dark cover with the real bottling line (`split` 0.64), ending on a hard edge, the question only, and the logo at the foot;

Source: plugin/skills/linkedin-carousel/types/guide.md:18.

## AIS-9bff450158b8

<!-- AIS-9bff450158b8 -->
AIS KARIKÓ on a tray line, framed large on a white slide with one headline;

Source: plugin/skills/linkedin-carousel/types/guide.md:19.
