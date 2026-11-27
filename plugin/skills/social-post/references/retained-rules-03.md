# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-63332532c67b

<!-- AIS-63332532c67b -->
The defects it catches, as pictures: **features** (defect tiles) or a defects carousel.

Source: plugin/skills/social-post/types/product.md:14.

## AIS-3d934b4c1f49

<!-- AIS-3d934b4c1f49 -->
A software screen: **software** or **features**.

Source: plugin/skills/social-post/types/product.md:15.

## AIS-e56da559eeb2

<!-- AIS-e56da559eeb2 -->
Context, detections and proof together: a product carousel.

Source: plugin/skills/social-post/types/product.md:16.

## AIS-b9e27b387348

<!-- AIS-b9e27b387348 -->
A `showcase` shot: the machine whole on section grey `#F1F5F9`, the headline at the top, the logo at the foot, no band and no edge.

Source: plugin/skills/social-post/types/product.md:20.

## AIS-435602ebb0a6

<!-- AIS-435602ebb0a6 -->
Which machine? Its exact name.

Source: plugin/skills/social-post/types/product.md:24.

## AIS-660b77e0d614

<!-- AIS-660b77e0d614 -->
What does it check? One line from its article, datasheet or brochure (`pieces/brochures/<machine>/`).

Source: plugin/skills/social-post/types/product.md:25.

## AIS-eff9d5ea0e60

<!-- AIS-eff9d5ea0e60 -->
Will it go to Instagram too? Add `1x1`.

Source: plugin/skills/social-post/types/product.md:26.

## AIS-0b3a4369d1b4

<!-- AIS-0b3a4369d1b4 -->
**Qualifies:** the machine's exterior view from `library/media/3d/machines/<machine>/` (`_01_3q-left_light.jpg`, on the same grey as the post), or a real photo of that exact machine, whole, sharp. Never another model's picture.

Source: plugin/skills/social-post/types/product.md:30.

## AIS-16dfeba956ba

<!-- AIS-16dfeba956ba -->
**Available today:** AIS Hopper final (`hopper/hopper_01_3q-left_light.jpg`, 3000 px). Historical note: AIS KARIKÓ and AIS REV 360 Compact had 700 px previews; inspect current files rather than assuming they still exist only as previews in `library/media/3d/machine-previews/`: they would be upscaled past the limit. Say so, offer another type (features with defect tiles, callout) and ask for the final.

Source: plugin/skills/social-post/types/product.md:31.

## AIS-7e1e33e68c05

<!-- AIS-7e1e33e68c05 -->
**Framing:** `scale` about 1.1 to 1.2 and `focus` [50, 52 to 55] so the machine fills the post down to the logo.

Source: plugin/skills/social-post/types/product.md:32.

## AIS-e5330186b39c

<!-- AIS-e5330186b39c -->
**Never:** the "kariko-real" hero, `real/rev360_inside-render.jpg`, corrupt product badges (preserve approved AIS demo packaging), any wrong or physically implausible machine, any view with open guards or internals.

Source: plugin/skills/social-post/types/product.md:33.

## AIS-28e5fb0a7023

<!-- AIS-28e5fb0a7023 -->
One `showcase`: `src`, `evidence: "render"` (for the machine views; no caption appears), `scale`, `focus`, `headline`. No `text`, no `items`, no caption chip.

Source: plugin/skills/social-post/types/product.md:37.

## AIS-8cdcb7e52e09

<!-- AIS-8cdcb7e52e09 -->
**Headline:** what it does, two lines at most, plain ("El tapón y el llenado, revisados en la línea"; "Cap and fill level, checked on the line").

Source: plugin/skills/social-post/types/product.md:41.

## AIS-46d950ca12e5

<!-- AIS-46d950ca12e5 -->
**Copy:** what it checks, on what, how it is set up; one approved call to action. Write the sentences around it anew every time. Never say how the picture was made.

Source: plugin/skills/social-post/types/product.md:42.

## AIS-160a05a55868

<!-- AIS-160a05a55868 -->
A similar machine's picture because the right one is missing.

Source: plugin/skills/social-post/types/product.md:46.

## AIS-e205eeee9082

<!-- AIS-e205eeee9082 -->
A preview stretched into a post.

Source: plugin/skills/social-post/types/product.md:47.

## AIS-40ea26c03e0d

<!-- AIS-40ea26c03e0d -->
Adding a `text` line or chips: details belong in the caption or a carousel.

Source: plugin/skills/social-post/types/product.md:48.

## AIS-6fa3a6e178df

<!-- AIS-6fa3a6e178df -->
Claims only another model's datasheet supports.

Source: plugin/skills/social-post/types/product.md:49.

## AIS-9448219732d9

<!-- AIS-9448219732d9 -->
The line and the caption match the machine's article or brochure.

Source: plugin/skills/social-post/types/product.md:53.

## AIS-713133c483b8

<!-- AIS-713133c483b8 -->
The machine view is `approved` in the catalogue.

Source: plugin/skills/social-post/types/product.md:54.

## AIS-46be2ea74f91

<!-- AIS-46be2ea74f91 -->
**Look (post system; `docs/recipes.md`, *The post system*):** navy: the words in « » in every language on solid brand blue, sized to fill, name and role on one line; no portrait and no photo. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Source: plugin/skills/social-post/types/quote.md:3.

## AIS-a4eb206871ba

<!-- AIS-a4eb206871ba -->
Template: `templates/post-quote.json` (one `quote` shot, brand `rosepetal`, formats `4x5` and `1x1`).

Source: plugin/skills/social-post/types/quote.md:7.

## AIS-676225bdc6e7

<!-- AIS-676225bdc6e7 -->
A person's exact words, with their name, role and a small portrait. The post is white: the logo is at the top, and the quote mark, the words and the person sit at the foot.

Source: plugin/skills/social-post/types/quote.md:11.

## AIS-6d4e9483ffd6

<!-- AIS-6d4e9483ffd6 -->
Words someone did not say exactly: not a quote. Never paraphrase.

Source: plugin/skills/social-post/types/quote.md:13.

## AIS-5520e89f164b

<!-- AIS-5520e89f164b -->
A customer's words without their written approval: not yet. Ask for the approval first.

Source: plugin/skills/social-post/types/quote.md:14.

## AIS-12ea3ae66882

<!-- AIS-12ea3ae66882 -->
A long argument: a video (the interview type in `brand-video`) or a carousel.

Source: plugin/skills/social-post/types/quote.md:15.

## AIS-3ff6e630b002

<!-- AIS-3ff6e630b002 -->
José Racionero, CEO and co-founder of Rosepetal.

Source: plugin/skills/social-post/types/quote.md:19.

## AIS-bb78ee185187

<!-- AIS-bb78ee185187 -->
The words are «Una estimación personal no es una tasa de fallos medida.». He said them exactly so at 13:04 of Rosepetal's VISION 2026 interview (YouTube dVtk_PbZgHU).

Source: plugin/skills/social-post/types/quote.md:21.

## AIS-f37707d9f32e

<!-- AIS-f37707d9f32e -->
The portrait is a square cropped from the 1080p interview.

Source: plugin/skills/social-post/types/quote.md:22.

## AIS-fb8ed893ec85

<!-- AIS-fb8ed893ec85 -->
The words are on white, at the foot.

Source: plugin/skills/social-post/types/quote.md:23.

## AIS-a7520852cf50

<!-- AIS-a7520852cf50 -->
Who said it, and their role as they write it.

Source: plugin/skills/social-post/types/quote.md:27.

## AIS-23b30a68dd3c

<!-- AIS-23b30a68dd3c -->
The source: a video and minute, or a document and page.

Source: plugin/skills/social-post/types/quote.md:28.

## AIS-40cb677759e4

<!-- AIS-40cb677759e4 -->
The exact words. Listen at the timestamp, because automatic transcripts get words and names wrong ("Jensen Juan" for "Jensen Huang").

Source: plugin/skills/social-post/types/quote.md:29.

## AIS-df9e03211db4

<!-- AIS-df9e03211db4 -->
For a customer: who approved the quote in writing, and when.

Source: plugin/skills/social-post/types/quote.md:30.

## AIS-2cd05b88003d

<!-- AIS-2cd05b88003d -->
A portrait, and the person's consent to use it.

Source: plugin/skills/social-post/types/quote.md:31.

## AIS-064733e6c63a

<!-- AIS-064733e6c63a -->
**Qualifies:** a real square portrait of the person who spoke, from the same interview or supplied by them, clear of burnt-in captions and watermarks.

Source: plugin/skills/social-post/types/quote.md:35.

## AIS-e16d3d97f004

<!-- AIS-e16d3d97f004 -->
**Size:** the portrait is shown at 160 px. The template's is 330 × 330; keep at least about 200 px square.

Source: plugin/skills/social-post/types/quote.md:36.

## AIS-2175d3cea30e

<!-- AIS-2175d3cea30e -->
**Fits today:** `rosepetal/jose-racionero_portrait.jpg`.

Source: plugin/skills/social-post/types/quote.md:37.

## AIS-cc2244515785

<!-- AIS-cc2244515785 -->
**Never acceptable:** a generated face, a portrait of someone else, or a frame that still shows the interview's subtitles or the Rosepetal mark.

Source: plugin/skills/social-post/types/quote.md:38.

## AIS-3d5f75d584d2

<!-- AIS-3d5f75d584d2 -->
One `quote`:

Source: plugin/skills/social-post/types/quote.md:42.

## AIS-6b38093c89e6

<!-- AIS-6b38093c89e6 -->
`quote`, `name`, `role` and `portrait`. Leave `bg` out: the quote sits on white, with no hexagon pattern;

Source: plugin/skills/social-post/types/quote.md:43.

## AIS-d623dca36cbd

<!-- AIS-d623dca36cbd -->
`consent`: who allowed the portrait, and when;

Source: plugin/skills/social-post/types/quote.md:44.

## AIS-65c414d5fe11

<!-- AIS-65c414d5fe11 -->
`permission`: who approved the words in writing and when, or for public words, the published source and minute.

Source: plugin/skills/social-post/types/quote.md:45.

## AIS-16a7a03fedde

<!-- AIS-16a7a03fedde -->
**Quote:** a short, complete sentence, exactly as said. Five lines at most: long quotes fail. Choose a whole sentence, never a fragment that changes the meaning.

Source: plugin/skills/social-post/types/quote.md:49.

## AIS-6be3c7b578d2

Historical wording: explicitly superseded by AIS-1ca2512d9817. Apply the dated resolution to the conflicting clause; preserve other clauses and this exact historical wording.

<!-- AIS-6be3c7b578d2 -->
**Quote marks:** the engine sets « » in every language. Don't type marks into the text.

Source: plugin/skills/social-post/types/quote.md:50.

## AIS-5fc06ef31aaf

<!-- AIS-5fc06ef31aaf -->
**Name and role:** "José Racionero", "CEO y cofundador de Rosepetal".

Source: plugin/skills/social-post/types/quote.md:51.

## AIS-370cbdfc126c

<!-- AIS-370cbdfc126c -->
**Copy:** where and when they said it and on what, where to watch or read the rest, then one call to action. Example: "En VISION 2026, José Racionero habló de cómo decidir si un sistema con IA es fiable: con datos medidos en la línea, no con impresiones. La entrevista completa está en nuestro canal. Envíanos muestras".

Source: plugin/skills/social-post/types/quote.md:52.

## AIS-f07622a2e2c1

<!-- AIS-f07622a2e2c1 -->
Paraphrasing, or "tidying" the words.

Source: plugin/skills/social-post/types/quote.md:56.

## AIS-73d41d4afd89

<!-- AIS-73d41d4afd89 -->
Trusting the automatic transcript without listening.

Source: plugin/skills/social-post/types/quote.md:57.

## AIS-f7c70b012e2c

<!-- AIS-f7c70b012e2c -->
A fragment cut so it says something the speaker did not mean.

Source: plugin/skills/social-post/types/quote.md:58.

## AIS-8bd9e5ec42b1

<!-- AIS-8bd9e5ec42b1 -->
A customer quote without written approval. Isaac Sainz of Daymsa is quoted in the case published on aisvision.com on 20 October 2020, which counts as the approval: his words go on a post as published there.

Source: plugin/skills/social-post/types/quote.md:59.

## AIS-8045128261b4

<!-- AIS-8045128261b4 -->
`permission` with "pending" or "pendiente": the check fails it.

Source: plugin/skills/social-post/types/quote.md:60.

## AIS-3f2f8594dfd6

<!-- AIS-3f2f8594dfd6 -->
Someone listened at the timestamp and the words match exactly.

Source: plugin/skills/social-post/types/quote.md:64.

## AIS-d4f863549157

<!-- AIS-d4f863549157 -->
The speaker, or for a customer their company, has confirmed the use in writing.

Source: plugin/skills/social-post/types/quote.md:65.

## AIS-f7e3055a091b

<!-- AIS-f7e3055a091b -->
The portrait's consent is recorded.

Source: plugin/skills/social-post/types/quote.md:66.

## AIS-46723ad8dcc8

<!-- AIS-46723ad8dcc8 -->
Template: `templates/post-recap.json` (one `hero` shot, format `4x5`).

Source: plugin/skills/social-post/types/recap.md:7.

## AIS-3ef9e0b91773

<!-- AIS-3ef9e0b91773 -->
After an event where we took part, such as a talk, a panel or a stand. It has one real photo of us there, with the topic as the headline.

Source: plugin/skills/social-post/types/recap.md:11.

## AIS-8ad3e83edd27

<!-- AIS-8ad3e83edd27 -->
Before the event: **event**.

Source: plugin/skills/social-post/types/recap.md:13.

## AIS-236123fc70a6

<!-- AIS-236123fc70a6 -->
Several moments (the stand, a demo, a talk): the carousel event type, which is a recap.

Source: plugin/skills/social-post/types/recap.md:14.

## AIS-63ad13d3b744

<!-- AIS-63ad13d3b744 -->
A visit to our own building, or other company news: **news**.

Source: plugin/skills/social-post/types/recap.md:15.

## AIS-d5fc1030fc9b

<!-- AIS-d5fc1030fc9b -->
Packaging Talks 2026.

Source: plugin/skills/social-post/types/recap.md:19.

## AIS-0705038c324d

<!-- AIS-0705038c324d -->
The event photographer's picture of the panel is shown at its true grade, ending on a hard edge.

Source: plugin/skills/social-post/types/recap.md:21.

## AIS-e4d6d3034291

<!-- AIS-e4d6d3034291 -->
The topic is the headline, on navy below, with the logo at the foot.

Source: plugin/skills/social-post/types/recap.md:22.

## AIS-fd209e1b4260

<!-- AIS-fd209e1b4260 -->
The photographer's permission is needed before publishing.

Source: plugin/skills/social-post/types/recap.md:23.

## AIS-98f81cd06149

<!-- AIS-98f81cd06149 -->
The event's name and year, and what we did there (a talk, a panel or a stand).

Source: plugin/skills/social-post/types/recap.md:27.

## AIS-53b35f624ca4

<!-- AIS-53b35f624ca4 -->
The topic, in the event's own words if there was a title.

Source: plugin/skills/social-post/types/recap.md:28.

## AIS-6db140a12cbe

<!-- AIS-6db140a12cbe -->
Who took the photo, and whether we may use it.

Source: plugin/skills/social-post/types/recap.md:29.

## AIS-a2016687fdb7

<!-- AIS-a2016687fdb7 -->
Who to thank: the organisers, and the other panellists if we name them.

Source: plugin/skills/social-post/types/recap.md:30.

## AIS-f86ac1b105b6

<!-- AIS-f86ac1b105b6 -->
**Qualifies:** a real photo of us at that event, on stage or at the stand, taken by us or by the event photographer with permission.

Source: plugin/skills/social-post/types/recap.md:34.

## AIS-e0a32ad3dbf3

<!-- AIS-e0a32ad3dbf3 -->
**Size:** at `split` 0.66 the band is at most 1080 × 891, a little less once it ends above the words. The picture needs at least about 1080 px wide and 715 px of height; the template's is 1500 × 1002.

Source: plugin/skills/social-post/types/recap.md:35.

## AIS-8b469b4dd8b0

<!-- AIS-8b469b4dd8b0 -->
`split` 0.66 and `focus` [50, 50] on the stage. The picture takes about two thirds of the post.

Source: plugin/skills/social-post/types/recap.md:37.

## AIS-22853afffc4d

<!-- AIS-22853afffc4d -->
The photo is shown clean, so the backdrop's lettering stays readable. Nothing is laid over it.

Source: plugin/skills/social-post/types/recap.md:38.

## AIS-42d60fc95aa5

<!-- AIS-42d60fc95aa5 -->
Keep our people inside the band. It shrinks if the headline needs room, never below 30 %.

Source: plugin/skills/social-post/types/recap.md:39.

## AIS-a362fcd4ed56

<!-- AIS-a362fcd4ed56 -->
`real/packaging-talks2026_panel.jpg` (this template uses it);

Source: plugin/skills/social-post/types/recap.md:41.

## AIS-93b12c37b2e6

<!-- AIS-93b12c37b2e6 -->
`real/af2026_stand-machines.jpg` or `real/af2026_stand-portrait.jpg` (our stand at Advanced Factories 2026; crop out the other exhibitors in the background). The hexagon-lights view, `advanced-factories-2026/af26_stand-hexagons.jpg`, is the event post's picture;

Source: plugin/skills/social-post/types/recap.md:42.

## AIS-43d6452a60d1

<!-- AIS-43d6452a60d1 -->
for Rosepetal at 4YFN: all four MWC photos are now in carousel-event (`mwc2026_visitors.jpg` is its contact slide). Ask for another.

Source: plugin/skills/social-post/types/recap.md:43.

## AIS-2026ba52f582

<!-- AIS-2026ba52f582 -->
the event's promotional artwork, or other speakers' slides as the subject;

Source: plugin/skills/social-post/types/recap.md:45.

## AIS-36a81e51a1f8

<!-- AIS-36a81e51a1f8 -->
pictures from an organiser's site without permission;

Source: plugin/skills/social-post/types/recap.md:46.

## AIS-bd443e5342c8

<!-- AIS-bd443e5342c8 -->
a photo from another event.

Source: plugin/skills/social-post/types/recap.md:47.

## AIS-dfab469c4017

<!-- AIS-dfab469c4017 -->
One `hero`: `src`, `split`, `focus` and `headline` (the topic). There is no overline, no `text`, no `items` and no caption chip: the post text names the event, and the logo signs at the foot.

Source: plugin/skills/social-post/types/recap.md:51.

## AIS-22e30dfbdf89

<!-- AIS-22e30dfbdf89 -->
**Headline:** the topic itself, short, with the accent on its second half: "Digitalización *y trazabilidad*". Fewer words leave more picture.

Source: plugin/skills/social-post/types/recap.md:55.

## AIS-c33d631f0844

<!-- AIS-c33d631f0844 -->
**Copy:** what was discussed, thanks to the organisers and fellow panellists, then one call to action. Example: "En Packaging Talks 2026 hablamos de digitalización y trazabilidad en el envase. Gracias a la organización y a los compañeros de mesa. Cuéntanos cómo es tu línea". The call to action may recur; the thanks and the sentence before it are new for every post.

Source: plugin/skills/social-post/types/recap.md:56.

## AIS-b8e91889caee

<!-- AIS-b8e91889caee -->
Saying we presented, launched or won something we did not.

Source: plugin/skills/social-post/types/recap.md:60.

## AIS-83f4a4b9a367

<!-- AIS-83f4a4b9a367 -->
Getting the names or companies of the other panellists wrong.

Source: plugin/skills/social-post/types/recap.md:61.

## AIS-4ef13ca79af8

<!-- AIS-4ef13ca79af8 -->
Reusing the photo from the event announcement.

Source: plugin/skills/social-post/types/recap.md:62.

## AIS-4adc80b23b85

<!-- AIS-4adc80b23b85 -->
Publishing the photographer's picture before they say yes.

Source: plugin/skills/social-post/types/recap.md:63.

## AIS-6da1e3c5d992

<!-- AIS-6da1e3c5d992 -->
The event photographer has given permission.

Source: plugin/skills/social-post/types/recap.md:67.

## AIS-885d98ecb349

<!-- AIS-885d98ecb349 -->
The other panellists' names and companies are right, if the caption names them.

Source: plugin/skills/social-post/types/recap.md:68.

## AIS-307b7245eb04

<!-- AIS-307b7245eb04 -->
**Look (post system; `docs/recipes.md`, *The post system*):** navy: the figure as large as the slide allows on solid brand blue, the source on one line, no picture. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Source: plugin/skills/social-post/types/result.md:3.

## AIS-9e9e69c802d9

<!-- AIS-9e9e69c802d9 -->
Template: `templates/post-result.json` (one `stat` shot, formats `4x5` and `1x1`).

Source: plugin/skills/social-post/types/result.md:7.

## AIS-1c0112459714

<!-- AIS-1c0112459714 -->
One verified figure, with its conditions, its basis and its source. It says "this is what it changed, for whom, measured how".

Source: plugin/skills/social-post/types/result.md:11.

## AIS-15df682ac260

<!-- AIS-15df682ac260 -->
A figure without a published, approved source: don't make the post. Ask where the figure is published.

Source: plugin/skills/social-post/types/result.md:13.

## AIS-29569e771952

<!-- AIS-29569e771952 -->
Counters read off a screen: not a result. They are a run.

Source: plugin/skills/social-post/types/result.md:14.

## AIS-3178a054618a

<!-- AIS-3178a054618a -->
A lab test: only as `"basis": "measured"`, with its conditions, and never presented as a production result.

Source: plugin/skills/social-post/types/result.md:15.

## AIS-73b22be837f2

<!-- AIS-73b22be837f2 -->
Daymsa, 95 %.

Source: plugin/skills/social-post/types/result.md:19.

## AIS-bb029e9938fe

<!-- AIS-bb029e9938fe -->
The figure is Daymsa's own estimate of the reduction in time and staff spent on quality inspection, after AIS installed the label and cap control on a bioestimulant packaging line.

Source: plugin/skills/social-post/types/result.md:21.

## AIS-a1dd521801d6

<!-- AIS-a1dd521801d6 -->
It was published in the case study on aisvision.com on 2020-10-20.

Source: plugin/skills/social-post/types/result.md:22.

## AIS-5d5d2e7e8927

<!-- AIS-5d5d2e7e8927 -->
The figure, its metric and its baseline.

Source: plugin/skills/social-post/types/result.md:26.

## AIS-4e7b4209b30b

<!-- AIS-4e7b4209b30b -->
The conditions: what was installed, on which line and product.

Source: plugin/skills/social-post/types/result.md:27.

## AIS-f4690d388969

<!-- AIS-f4690d388969 -->
Who measured or estimated it. That sets the basis: `measured`, `estimated`, `target` or `illustrative`.

Source: plugin/skills/social-post/types/result.md:28.
