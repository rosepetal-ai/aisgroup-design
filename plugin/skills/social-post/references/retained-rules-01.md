# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-80868b4819bc

<!-- AIS-80868b4819bc -->
One image, one message, one action. The action goes in the caption, not on the image.

Source: plugin/skills/social-post/SKILL.md:11.

## AIS-dd6f30b56d4c

<!-- AIS-dd6f30b56d4c -->
| This is the machine and what it does | product | `templates/post-product.json` | `types/product.md` |

Source: plugin/skills/social-post/SKILL.md:17.

## AIS-997ff61b5ccb

<!-- AIS-997ff61b5ccb -->
| What it checks on one real product | callout | `templates/post-callout.json` | `types/callout.md` |

Source: plugin/skills/social-post/SKILL.md:18.

## AIS-9281869eb6ea

<!-- AIS-9281869eb6ea -->
| What the software reads on its real screen, or the defects a machine catches (defect tiles) | features | `templates/post-features.json` | `types/features.md` |

Source: plugin/skills/social-post/SKILL.md:19.

## AIS-ed3caa19fc2f

<!-- AIS-ed3caa19fc2f -->
| Come and see us at a fair | event | `templates/post-event.json` | `types/event.md` |

Source: plugin/skills/social-post/SKILL.md:20.

## AIS-dfdf253e96c8

<!-- AIS-dfdf253e96c8 -->
| Something happened at the company | news | `templates/post-news.json` | `types/news.md` |

Source: plugin/skills/social-post/SKILL.md:21.

## AIS-f4029348c7e3

<!-- AIS-f4029348c7e3 -->
| We were at an event; this is what we did | recap | `templates/post-recap.json` | `types/recap.md` |

Source: plugin/skills/social-post/SKILL.md:22.

## AIS-f8bb190477bf

<!-- AIS-f8bb190477bf -->
| The software working in production, one screen | software | `templates/post-software.json` | `types/software.md` |

Source: plugin/skills/social-post/SKILL.md:23.

## AIS-5c744572d285

<!-- AIS-5c744572d285 -->
| One figure from a published, approved case study | result | `templates/post-result.json` | `types/result.md` |

Source: plugin/skills/social-post/SKILL.md:24.

## AIS-8ae26b233fd3

<!-- AIS-8ae26b233fd3 -->
| Someone's exact words | quote | `templates/post-quote.json` | `types/quote.md` |

Source: plugin/skills/social-post/SKILL.md:25.

## AIS-a8ed632a2d85

<!-- AIS-a8ed632a2d85 -->
**Read `types/<type>.md` before you make it.** More than one idea, or a "which one would you reject" question with answers, is a carousel (`linkedin-carousel`). Isometric illustrations are paused: a recipe with one fails.

Source: plugin/skills/social-post/SKILL.md:27.

## AIS-562bfdbcb742

<!-- AIS-562bfdbcb742 -->
The current source set, with ES and EN recipes, is `pieces/posts/` (check review status per piece; renders go to each piece's `out/`). Look at the one closest to the request before writing.

Source: plugin/skills/social-post/SKILL.md:29.

## AIS-a7620038271e

<!-- AIS-a7620038271e -->
**Post export checks:** follow the [shared generator checks](../../_shared/WORKFLOW.md). `engine/render.mjs` validates source pixels, number formatting, prohibited production terms and separators, wine labels and customer-logo treatment before exporting the post.

Source: plugin/skills/social-post/SKILL.md:31.

## AIS-a058c9228edf

<!-- AIS-a058c9228edf -->
**With the studio tools** (no shell), steps 2 to 4 are: `edit_piece copy` the template `plan_piece` lists first (or a `pieces/posts` recipe); `update` its `changes` (`headline`, `text`, `copy` for the caption, `src` as the picture's `library/media/…` path); `export_piece enqueue render-png` with `saveAs`. Then step 5 on the exported PNG.

Source: plugin/skills/social-post/SKILL.md:33.

## AIS-41c3ee0822d2

<!-- AIS-41c3ee0822d2 -->
**Brief.** Brand, language, audience, the one message, the one action, formats (`4x5` default; `1x1` Instagram, `191x1` link share, `9x16` stories). Then the playbook's questions. Ask only what the request and the library can't answer. "For a ready-meals customer" means the words speak to that sector's plant manager; it never names a customer without approval.

Source: plugin/skills/social-post/SKILL.md:37.

## AIS-9eb4fcad4941

<!-- AIS-9eb4fcad4941 -->
**Recipe.** Copy the template to `work/<slug>/recipe-<lang>.json`; `name` is `<brand>_post-<subject>_<lang>_<date>` (e.g. `ais-vision-systems_post-kariko_es_2026-10-29`). Change words and picture; keep the structure. Spanish and English are two recipes from the same pictures.

Source: plugin/skills/social-post/SKILL.md:38.

## AIS-08c741ee237c

<!-- AIS-08c741ee237c -->
Output in `work/<slug>/out/`: a PNG per format, `_copy.txt` (the caption), `_report.json`.

Source: plugin/skills/social-post/SKILL.md:42.

## AIS-9304efadd6db

<!-- AIS-9304efadd6db -->
**Look.** Read every PNG at full size and at feed size (about 550 px wide), then 2× crops of the picture's subject. Answer the [look checklist](../../brand-review/references/look-checklist.md) in writing, then the playbook's "Before publishing".

Source: plugin/skills/social-post/SKILL.md:43.

## AIS-1899c7fd6795

<!-- AIS-1899c7fd6795 -->
**Hand over.** PNGs, `_copy.txt`, and what the person must confirm: rights, consent, customer approval, figures, the capability claim for that machine.

Source: plugin/skills/social-post/SKILL.md:44.

## AIS-99ac0aa333eb

<!-- AIS-99ac0aa333eb -->
**Image first.** The picture takes most of the post; the words are one headline, with nothing above or beside it (no product name, eyebrow or subtitle; the post text names the product). No body text, no rows, no icon chips (except the callout's chips).

Source: plugin/skills/social-post/SKILL.md:48.

## AIS-5e58af5b7350

<!-- AIS-5e58af5b7350 -->
**One post system** (`docs/recipes.md`, *The post system*): three looks on one grid, set with `"look"` on the shot. **Blue** for machine, screen and event photographs (the picture on top with a hard edge over a solid brand-blue panel; no fade or gradient anywhere, the engine fails `gradient`); **light** for products and detections (white, headline on top, the picture filling its band: renders cropped to their product group, `bleed` and `subject` in `docs/recipes.md`; the headline grows into room a wide group leaves); **navy** for results and quotes, on white with `"look": "light"`. Headline 68 px and up, 64 px margins, logo small at the foot, bottom left. Across a set, a third to half of the posts blue or navy; pick the look that keeps the feed alternating.

Source: plugin/skills/social-post/SKILL.md:49.

## AIS-5621fc448ba0

<!-- AIS-5621fc448ba0 -->
**The hexagon corner** on every post, one size, flat-top hairlines thinning out from the corner, flush to the edges: bottom right on blue, top right on light and navy, never over the picture, never behind words (the engine fails `hex-text`). Never draw it by hand; never put hexagons over a photo's subject.

Source: plugin/skills/social-post/SKILL.md:50.

## AIS-074875573273

<!-- AIS-074875573273 -->
**No huge empty space:** the render fails a subject under 55 % of its band (`picture-empty`) and an empty strip over 12 % between two elements (`empty-strip`). Fix the picture (crop, render, look), never add filler.

Source: plugin/skills/social-post/SKILL.md:51.

## AIS-73230c81f03c

<!-- AIS-73230c81f03c -->
**Pictures** at no more than 1.5× their native size on a post (the render fails above); every word at 4.5:1 against what is really behind it (checked on each render).

Source: plugin/skills/social-post/SKILL.md:53.

## AIS-a87d44a34852

<!-- AIS-a87d44a34852 -->
**No captions inside posts** (K8): the post text names the picture. A `stat` keeps its source to one line (`note`); a `quote` sets name and role on one line. Those two are the only second lines a post has. The night field and the mono overline are video devices, never on a post.

Source: plugin/skills/social-post/SKILL.md:54.

## AIS-6f42b046caa3

<!-- AIS-6f42b046caa3 -->
**A defect post** is a light `hero` or `callout`: one picture with its frame and chip from the overlay renderer (`brand/downloads/overlays/overlay.mjs`), boxes from the render's own overlay spec, never drawn by eye (`pieces/posts/02-kariko`, `06-rev360-pharma`; `pieces/posts/_build/assets.py` builds them). Comparisons put the reference (OK) on the left or on top.

Source: plugin/skills/social-post/SKILL.md:55.

## AIS-56f7e3406496

<!-- AIS-56f7e3406496 -->
**Re-rendering the kit:** `flock /tmp/ais-marketing-render.lock nice -n 15 node scripts/social-kit.mjs --kit <marketing kit>/4\ LinkedIn` rebuilds the marked pictures from the library renders, renders every post and carousel with their checks, writes the contact sheets to `out/social/` and copies the files to the kit only when every check passes.

Source: plugin/skills/social-post/SKILL.md:56.

## AIS-0ebbdd0e6252

<!-- AIS-0ebbdd0e6252 -->
**Products** are isolated on the sweep: no conveyors, rails or line scenery.

Source: plugin/skills/social-post/SKILL.md:57.

## AIS-f1ada6d47e2f

<!-- AIS-f1ada6d47e2f -->
**Accent** (`*words*`) on the headline's closing phrase only, or nothing. Its ¿ ? ¡ ! take the accent too: write `¿Cuál *rechazarías*?` and the engine colours the question mark with the phrase.

Source: plugin/skills/social-post/SKILL.md:58.

## AIS-c8dc93e7292d

<!-- AIS-c8dc93e7292d -->
First choice: real photographs, screens and footage; our exterior machine views; product renders and detection tiles. Otherwise a generated or composited picture only if it passes `brand-review` step 1 at its final size. Never a machine view with internals or open guards.

Source: plugin/skills/social-post/SKILL.md:62.

## AIS-6dfc68136f18

<!-- AIS-6dfc68136f18 -->
**Reuse across pieces.** Reuse accepted imagery when it serves the message; vary it where it matters; one post never shows the same picture twice. Record repeated pictures and their purpose privately. Check: `grep -ho '@lib/[^"]*' templates/*.json pieces/posts/*/recipe-*.json | sort | uniq -c`.

Source: plugin/skills/social-post/SKILL.md:63.

## AIS-86581ec73e94

<!-- AIS-86581ec73e94 -->
**Size:** never upscaled past 1.5× on a single post (the render warns above 1×, fails above 1.5×). A band across a 1080 post needs about 1000 px on the long side; full-bleed 4:5 about 1080 × 1350.

Source: plugin/skills/social-post/SKILL.md:65.

## AIS-bac0e055144f

<!-- AIS-bac0e055144f -->
**Crop out** other brands (stands, organisers' signs, other makers' machines), half-cut interface chrome and burnt-in subtitles (`burnedIn` makes the render fail). Customer material: client logos blurred.

Source: plugin/skills/social-post/SKILL.md:66.

## AIS-272237ddf261

<!-- AIS-272237ddf261 -->
**Alt text** says what the picture shows; never render, CAD, 3D or illustration.

Source: plugin/skills/social-post/SKILL.md:67.

## AIS-2afe48b64bd0

<!-- AIS-2afe48b64bd0 -->
Write as [writing](../../communications/SKILL.md) says. Sentence case; names exactly; three headline lines at most (`|` breaks a line).

Source: plugin/skills/social-post/SKILL.md:71.

## AIS-dfe23e85dd9a

<!-- AIS-dfe23e85dd9a -->
The caption (`copy`): two to four sentences (what it checks, on what, what the picture shows), ending on one approved call to action from `engine/copy.mjs`. Vary the sentence around it; never "Más información".

Source: plugin/skills/social-post/SKILL.md:72.

## AIS-e0f083c3b075

<!-- AIS-e0f083c3b075 -->
Figures only on a `stat` with `note` and `basis`. Capability claims come from AIS's own articles, datasheets or brochures for that exact machine.

Source: plugin/skills/social-post/SKILL.md:73.

## AIS-6763d761bf74

<!-- AIS-6763d761bf74 -->
Native Spanish and Catalan (space before %: 95 %); British English. No emoji, typed arrows, ticks, middle-dot separators or hashtag walls.

Source: plugin/skills/social-post/SKILL.md:74.

## AIS-daac3867841d

<!-- AIS-daac3867841d -->
**Look (post system; `docs/recipes.md`, *The post system*):** light: the picture with its chips under the headline, on white (`"look": "blue"` for a camera view or a photograph of the line). Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Source: plugin/skills/social-post/types/callout.md:3.

## AIS-a244d68e0421

<!-- AIS-a244d68e0421 -->
Template: `templates/post-callout.json` (one `callout` shot, format `4x5`).

Source: plugin/skills/social-post/types/callout.md:7.

## AIS-75531a702bb6

<!-- AIS-75531a702bb6 -->
One real product, as the system sees it, with chips naming the parts the machine checks. It says "this is what it looks at on your product". The chips are not detections: no box, no verdict, no reading.

Source: plugin/skills/social-post/types/callout.md:11.

## AIS-1fdfd4e426a9

<!-- AIS-1fdfd4e426a9 -->
The machine itself: **product**.

Source: plugin/skills/social-post/types/callout.md:13.

## AIS-689f0991d071

<!-- AIS-689f0991d071 -->
A defect found, with the inspection frame and a verdict: there is no template for it today. It needs a real system export (`"evidence": "system"`), so ask for one.

Source: plugin/skills/social-post/types/callout.md:14.

## AIS-e9a8789b8d79

<!-- AIS-e9a8789b8d79 -->
What one inspection detects across products: a carousel (application type).

Source: plugin/skills/social-post/types/callout.md:15.

## AIS-f6ccfaad8a43

<!-- AIS-f6ccfaad8a43 -->
The template is the older chip version (the AIS REV 360's four views of one wine bottle). The kit post (`pieces/posts/03-rev360-standard`) is the approved style: one cava bottle seen from the front and from behind, bright on the studio sweep, with the three inspection points drawn into the picture by `pieces/posts/_build/callout.mjs` (`assets.py`, `wine_callouts`): a small square node on the exact part, a horizontal hairline (#3664B3 on light, #7C9FD7 on navy), the labels stacked in Inter sentence case between the bottles. No icons, no glow, no pills, no gradients. The SVG goes in a `hero` (`"look": "blue"`, hard edge over the blue panel) and fills the picture band edge to edge.

Source: plugin/skills/social-post/types/callout.md:19.

## AIS-1e2faaaeb2e2

<!-- AIS-1e2faaaeb2e2 -->
Which product and which machine?

Source: plugin/skills/social-post/types/callout.md:23.

## AIS-9fc7ee97ad25

<!-- AIS-9fc7ee97ad25 -->
Which parts does the machine check? Take them from its article or datasheet, not from the picture.

Source: plugin/skills/social-post/types/callout.md:24.

## AIS-8258b57c579c

<!-- AIS-8258b57c579c -->
Has the customer whose label shows approved social use?

Source: plugin/skills/social-post/types/callout.md:25.

## AIS-14b138136544

<!-- AIS-14b138136544 -->
**Qualifies:** the system's own output, or a sharp photo of one real product, where every part you name is visible and large enough to point at.

Source: plugin/skills/social-post/types/callout.md:29.

## AIS-d83e90c7c760

<!-- AIS-d83e90c7c760 -->
**Size:** the picture is shown whole (`fit: "contain"`) at about 770 px wide. Keep at least about 900 px on the long side; the template's is 1188 × 1080.

Source: plugin/skills/social-post/types/callout.md:30.

## AIS-fcc850c3bbf8

<!-- AIS-fcc850c3bbf8 -->
**Framing:** no `split`. `imageSize` must be the file's real pixel size, or the chips land in the wrong place. Each chip has:

Source: plugin/skills/social-post/types/callout.md:31.

## AIS-87b9debc39ee

<!-- AIS-87b9debc39ee -->
`x`, `y`: the point on the part, in percent of the image;

Source: plugin/skills/social-post/types/callout.md:32.

## AIS-d10811a90687

<!-- AIS-d10811a90687 -->
`side`: `left` or `right`;

Source: plugin/skills/social-post/types/callout.md:33.

## AIS-923f23798f81

<!-- AIS-923f23798f81 -->
`labelY`: the label's height, in percent of the picture's box. Spread the labels so they never touch each other or the part.

Source: plugin/skills/social-post/types/callout.md:34.

## AIS-07b631799329

<!-- AIS-07b631799329 -->
`rev360/still-rev360-wine-four-views_blurred.png` (this template uses it);

Source: plugin/skills/social-post/types/callout.md:36.

## AIS-bbbaab0abdc9

<!-- AIS-bbbaab0abdc9 -->
`rev360/still-rev360-pet-four-views.png`, four views of a PET soap bottle, 1640 × 1048 (now used by carousel-application, slide 3). A customer label shows, so confirm approval.

Source: plugin/skills/social-post/types/callout.md:37.

## AIS-5acba188f6e1

<!-- AIS-5acba188f6e1 -->
**Never acceptable:** unreadable labels, impossible geometry/light, overlays hiding evidence, or a product image presented as a validated inspection result. Approved AIS demo labels are valid.

Source: plugin/skills/social-post/types/callout.md:38.

## AIS-93ee2b0b0291

<!-- AIS-93ee2b0b0291 -->
One `callout`: `src`, `imageSize`, `fit: "contain"`, `focus`, `headline`, and `items` (two to four chips, each with `icon`, `text`, `x`, `y`, `side` and `labelY`).

Source: plugin/skills/social-post/types/callout.md:42.

## AIS-5968d93164b0

<!-- AIS-5968d93164b0 -->
**Headline:** the parts it sees, with the accent on what makes it different. "Etiqueta, contraetiqueta *y cápsula*, a la vez".

Source: plugin/skills/social-post/types/callout.md:46.

## AIS-8361a4c5e1bc

<!-- AIS-8361a4c5e1bc -->
**Chips:** three in the template, four at most. Each is the part's name in one or two words ("Cápsula", "Etiqueta frontal", "Contraetiqueta"), never a defect or a verdict.

Source: plugin/skills/social-post/types/callout.md:47.

## AIS-097b6587b498

<!-- AIS-097b6587b498 -->
**Copy:** what it sees and how, using verified facts only, then one call to action (say the picture is the system's own only when it is). Example: "Con varias cámaras laterales, el AIS REV 360 ve la botella entera a la vez: la etiqueta, la contraetiqueta y la cápsula, sin orientarla. La imagen es del propio sistema. Envíanos muestras".

Source: plugin/skills/social-post/types/callout.md:48.

## AIS-4a2dc84353fa

<!-- AIS-4a2dc84353fa -->
Saying "cuatro cámaras" about the AIS REV 360. Four views are not four cameras, and the count is verified only for the REV 360 Cables. Write "varias cámaras".

Source: plugin/skills/social-post/types/callout.md:52.

## AIS-0e24927023be

<!-- AIS-0e24927023be -->
A chip line or leader that ends next to the part instead of on it. Check each one at 2× zoom. Leaders never cross.

Source: plugin/skills/social-post/types/callout.md:53.

## AIS-385006c58fe8

<!-- AIS-385006c58fe8 -->
A label that covers the text on the product label.

Source: plugin/skills/social-post/types/callout.md:54.

## AIS-35f770db4b3a

<!-- AIS-35f770db4b3a -->
A chip that names a defect the picture does not show, or "OK"/"NOK" on a chip.

Source: plugin/skills/social-post/types/callout.md:55.

## AIS-b61fc238e44f

<!-- AIS-b61fc238e44f -->
Adding `inspect` or `detect` to make it look like a result.

Source: plugin/skills/social-post/types/callout.md:56.

## AIS-12f90996fce1

<!-- AIS-12f90996fce1 -->
More than four chips, or long chip labels: the picture is the message, and the chips only point.

Source: plugin/skills/social-post/types/callout.md:57.

## AIS-3a92720fd672

<!-- AIS-3a92720fd672 -->
The customer still approves social use of the label: Racó del Convent (Unió Origen) in the template.

Source: plugin/skills/social-post/types/callout.md:61.

## AIS-da9295dc6998

<!-- AIS-da9295dc6998 -->
Every chip's line ends on its part, at 2× zoom.

Source: plugin/skills/social-post/types/callout.md:62.

## AIS-fc96c8b735ca

<!-- AIS-fc96c8b735ca -->
The parts named are ones the machine checks, according to its article.

Source: plugin/skills/social-post/types/callout.md:63.

## AIS-ad930c982e6c

<!-- AIS-ad930c982e6c -->
**Look (post system; `docs/recipes.md`, *The post system*):** blue: our stand across the top, with a hard edge over the brand-blue panel under the white headline. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Source: plugin/skills/social-post/types/event.md:3.

## AIS-b52ff81fe2e7

<!-- AIS-b52ff81fe2e7 -->
Template: `templates/post-event.json` (one `event` shot, formats `4x5` and `1x1`).

Source: plugin/skills/social-post/types/event.md:7.

## AIS-3527c18dc199

<!-- AIS-3527c18dc199 -->
It announces a trade fair before it happens: our stand across the top, the event name large, then the date and the place as two short rows. **The event is announced once, here.**

Source: plugin/skills/social-post/types/event.md:11.

## AIS-3f68114bd940

<!-- AIS-3f68114bd940 -->
After the event: **recap** for one photo, or the carousel event type (a recap) for several moments.

Source: plugin/skills/social-post/types/event.md:13.

## AIS-1af8c3d4f3f9

<!-- AIS-1af8c3d4f3f9 -->
A carousel is never a second announcement of the same event.

Source: plugin/skills/social-post/types/event.md:14.

## AIS-79914feedd98

<!-- AIS-79914feedd98 -->
Image first.

Source: plugin/skills/social-post/types/event.md:18.

## AIS-7bedb21ca493

<!-- AIS-7bedb21ca493 -->
Our AIS Vision Systems stand at Advanced Factories 2026 under its hexagon lights runs edge to edge across the top (`split` 0.4).

Source: plugin/skills/social-post/types/event.md:20.

## AIS-12a5e88d86a9

<!-- AIS-12a5e88d86a9 -->
Below it on navy: "Te esperamos en", ENOMAQ 2027 in large type, and two rows (the dates; the city, hall and stand).

Source: plugin/skills/social-post/types/event.md:21.

## AIS-914b7b9b7a19

<!-- AIS-914b7b9b7a19 -->
The logo signs at the foot.

Source: plugin/skills/social-post/types/event.md:22.

## AIS-6b056d769293

<!-- AIS-6b056d769293 -->
The square version drops the photo, because the rows and a photo do not fit.

Source: plugin/skills/social-post/types/event.md:23.

## AIS-1457d75da673

<!-- AIS-1457d75da673 -->
The event's name and year, written as the organiser writes them.

Source: plugin/skills/social-post/types/event.md:27.

## AIS-c3f3c5ab771e

<!-- AIS-c3f3c5ab771e -->
The dates, the venue and hall, and the stand number.

Source: plugin/skills/social-post/types/event.md:28.

## AIS-1ed1b372090f

<!-- AIS-1ed1b372090f -->
What we will show there. This goes in the caption (`copy`).

Source: plugin/skills/social-post/types/event.md:29.

## AIS-a47040b9ac5f

<!-- AIS-a47040b9ac5f -->
Which photo of our own stand or team, and whether the people in it consent.

Source: plugin/skills/social-post/types/event.md:30.

## AIS-575b3545b824

<!-- AIS-575b3545b824 -->
**Qualifies:** our own stand or team at a previous fair, real, with the people's consent. Show the stand itself, ours alone.

Source: plugin/skills/social-post/types/event.md:34.

## AIS-1a3d58a7e72f

<!-- AIS-1a3d58a7e72f -->
**Size:** the band is 1080 wide and `split` × 1350 tall (540 at 0.4). The template's photo is a 1152 × 1536 portrait, so the band uses its width; keep `scale` low enough to stay under the 1.5× limit.

Source: plugin/skills/social-post/types/event.md:35.

## AIS-2b455570514c

<!-- AIS-2b455570514c -->
`split` 0.4, edge to edge, with `focus` and `scale` set to keep our stand and **crop out other exhibitors' stands**, organisers' signs and other brands. The template uses `focus` [8, 80] and `scale` 1.35.

Source: plugin/skills/social-post/types/event.md:37.

## AIS-a3ff7643e5f9

<!-- AIS-a3ff7643e5f9 -->
The `caption` says which event and year the photo shows ("Nuestro stand en Advanced Factories 2026"), on an ink chip in the corner.

Source: plugin/skills/social-post/types/event.md:38.

## AIS-daf3fd81d9e4

<!-- AIS-daf3fd81d9e4 -->
For the square, `formats.1x1` sets `src` to `null`. The square drops the photo so the rows stay readable, and the hexagon pattern fills the space instead.

Source: plugin/skills/social-post/types/event.md:39.

## AIS-855097a8cdca

<!-- AIS-855097a8cdca -->
The hexagon pattern appears only below the photo, never over it.

Source: plugin/skills/social-post/types/event.md:40.

## AIS-88c68cf1da59

<!-- AIS-88c68cf1da59 -->
`advanced-factories-2026/af26_stand-hexagons.jpg`, our stand at Advanced Factories 2026 under the hexagon lights (this template uses it);

Source: plugin/skills/social-post/types/event.md:42.

## AIS-492a0ed85f3a

<!-- AIS-492a0ed85f3a -->
`real/latamcan2026_stand.jpg`, our team at LATAMCAN 2026;

Source: plugin/skills/social-post/types/event.md:43.

## AIS-b8a54b30989b

<!-- AIS-b8a54b30989b -->
`real/af2026_stand-machines.jpg` and `real/af2026_stand-portrait.jpg`, Advanced Factories 2026 (other exhibitors show in the background: crop them out);

Source: plugin/skills/social-post/types/event.md:44.

## AIS-c4c6a000d141

<!-- AIS-c4c6a000d141 -->
for Rosepetal: inspect the four MWC photos in carousel-event and reuse a suitable one when useful.

Source: plugin/skills/social-post/types/event.md:45.

## AIS-fbaadd95a4f7

<!-- AIS-fbaadd95a4f7 -->
**Never acceptable:** bottles or products that fail credibility; the organiser's or the venue's logos; other exhibitors' stands; a photo of a previous fair captioned as if it were the new one; stills from the Advanced Factories footage with visitors who have not consented.

Source: plugin/skills/social-post/types/event.md:46.

## AIS-37471c22a4ff

<!-- AIS-37471c22a4ff -->
One `event`:

Source: plugin/skills/social-post/types/event.md:50.

## AIS-c0dbd415c736

<!-- AIS-c0dbd415c736 -->
`src`, `split`, `focus`, `scale` and `caption`;

Source: plugin/skills/social-post/types/event.md:51.

## AIS-ad9f95dfe065

<!-- AIS-ad9f95dfe065 -->
`lead`: "Te esperamos en";

Source: plugin/skills/social-post/types/event.md:52.

## AIS-b8d023bfaaab

<!-- AIS-b8d023bfaaab -->
`event`: "ENOMAQ 2027";

Source: plugin/skills/social-post/types/event.md:53.
