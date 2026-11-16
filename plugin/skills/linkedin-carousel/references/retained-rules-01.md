# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-a02a37e9cec4

<!-- AIS-a02a37e9cec4 -->
One idea per slide, one message for the whole carousel, one action at the end.

Source: plugin/skills/linkedin-carousel/SKILL.md:11.

## AIS-84cc3d076e62

<!-- AIS-84cc3d076e62 -->
**The engine enforces** the [shared workflow](../_shared/WORKFLOW.md)'s *Brand rules the generators check* and the text check: the cover at least its slot's size (above 1.25× fails, above 1× warns; a video frame warns until a photograph exists); Spanish and Catalan thousands 30 000 and 7200, never 30.000; no render, CAD, 3D or middle-dot separators in text or alt text; round-label wine renders only; client logos blurred. Only `engine/render.mjs` on `engine/stage.html` and `templates/*.json` makes posts and carousels.

Source: plugin/skills/linkedin-carousel/SKILL.md:13.

## AIS-2d2f2d44f9d4

<!-- AIS-2d2f2d44f9d4 -->
**With the studio tools** (no shell), steps 3 to 5 are: `edit_piece copy` the template `plan_piece` lists first (or a `pieces/posts` recipe); `update` each slide's `changes` with `shot` set to its index (`src` as the picture's `library/media/…` path); `export_piece enqueue render-pdf` with `saveAs`. Then step 6 on the exported PDF and slide PNGs.

Source: plugin/skills/linkedin-carousel/SKILL.md:15.

## AIS-1307823cb8f8

<!-- AIS-1307823cb8f8 -->
| The message | Type | Template | Playbook |

Source: plugin/skills/linkedin-carousel/SKILL.md:19.

## AIS-47e8320e388d

<!-- AIS-47e8320e388d -->
| Which one would you reject: the defects a machine catches on one product | defects | `templates/carousel-defects.json` | `types/defects.md` |

Source: plugin/skills/linkedin-carousel/SKILL.md:21.

## AIS-b93b754f0bd8

<!-- AIS-b93b754f0bd8 -->
| This machine, what it detects and the proof | product | `templates/carousel-product.json` | `types/product.md` |

Source: plugin/skills/linkedin-carousel/SKILL.md:22.

## AIS-0ca1f6e08534

<!-- AIS-0ca1f6e08534 -->
| Quality control for one sector's line | sector | `templates/carousel-sector.json` | `types/sector.md` |

Source: plugin/skills/linkedin-carousel/SKILL.md:23.

## AIS-9e53ad2137ba

<!-- AIS-9e53ad2137ba -->
| One inspection: what fails and what catches it | application | `templates/carousel-application.json` | `types/application.md` |

Source: plugin/skills/linkedin-carousel/SKILL.md:24.

## AIS-c89e4a8fd375

<!-- AIS-c89e4a8fd375 -->
| A partner's product that we distribute | partner | `templates/carousel-partner.json` | `types/partner.md` |

Source: plugin/skills/linkedin-carousel/SKILL.md:25.

## AIS-7a94505ada45

<!-- AIS-7a94505ada45 -->
| How to do something: steps or numbers to gather | guide | `templates/carousel-guide.json` | `types/guide.md` |

Source: plugin/skills/linkedin-carousel/SKILL.md:26.

## AIS-fa11f9b07bef

<!-- AIS-fa11f9b07bef -->
| What happened at an event we attended | event (a recap) | `templates/carousel-event.json` | `types/event.md` |

Source: plugin/skills/linkedin-carousel/SKILL.md:27.

## AIS-240a592caa9b

<!-- AIS-240a592caa9b -->
**Read `types/<type>.md` before you make it.** One image and one idea is a post (`social-post`). An event still to come is announced once, in the event post.

Source: plugin/skills/linkedin-carousel/SKILL.md:29.

## AIS-d443f64fcfad

Historical wording: explicitly superseded by AIS-5798fe4281be. Apply the dated resolution to the conflicting clause; preserve other clauses and this exact historical wording.

<!-- AIS-d443f64fcfad -->
Reference carousels (their pictures are still `review` in the catalogue), ES and EN: `pieces/posts/20-carousel-juice-hopper/` (juice, AIS Hopper), `21-carousel-vials-pharma/`, `22-carousel-cans-reference/`, `23-carousel-muesli-reference/` (the strongest). Start from the closest one.

Source: plugin/skills/linkedin-carousel/SKILL.md:31.

## AIS-356cb9d44074

<!-- AIS-356cb9d44074 -->
**Brief.** Brand, language, audience, the one message, the one action. Then the playbook's questions. A customer named in the request sets the audience; never their name on slides without approval.

Source: plugin/skills/linkedin-carousel/SKILL.md:35.

## AIS-2e09cfb13150

<!-- AIS-2e09cfb13150 -->
**Pictures first.** List every picture the slides need and check each exists at full size (`library/media/3d/renders/<machine>/`, the catalogue). A defects carousel needs a clean lineup or pair for the cover and one OK/NOK pair per defect with Spanish and English overlays (`<shot>_es.jpg`, `<shot>_en.jpg`). If one is missing, first look for an existing credible image. Record the gap privately; complete the independent source/copy work and only schedule the missing image work when the renderer has a turn.

Source: plugin/skills/linkedin-carousel/SKILL.md:36.

## AIS-f38b8b8c69fe

<!-- AIS-f38b8b8c69fe -->
**Recipe.** Copy the template or reference to `work/<slug>/recipe-<lang>.json`; `name` is `<brand>_carousel-<type>-<subject>_<lang>_<date>` (e.g. `ais-vision-systems_carousel-defects-juice-hopper_en_2026-10-29`). Adapt the narrative and slide count; cut a slide rather than pad one.

Source: plugin/skills/linkedin-carousel/SKILL.md:37.

## AIS-2bb9670c91de

<!-- AIS-2bb9670c91de -->
**Check.** `node engine/check.mjs work/<slug>/recipe-<lang>.json`. Fix every error; resolve or report every warning.

Source: plugin/skills/linkedin-carousel/SKILL.md:38.

## AIS-fd3b4cbeaecc

<!-- AIS-fd3b4cbeaecc -->
**Render** (Chromium, one job at a time):

Source: plugin/skills/linkedin-carousel/SKILL.md:39.

## AIS-a7d5ac621575

<!-- AIS-a7d5ac621575 -->
`python3 skills/_shared/scripts/safe_render.py -- node engine/render.mjs work/<slug>/recipe-<lang>.json`

Source: plugin/skills/linkedin-carousel/SKILL.md:40.

## AIS-bfc05ae1acef

<!-- AIS-bfc05ae1acef -->
Output in `work/<slug>/out/`: the PDF, a PNG per slide, `_sheet.png`, `_copy.txt`, `_report.json`.

Source: plugin/skills/linkedin-carousel/SKILL.md:41.

## AIS-0013a02a831c

<!-- AIS-0013a02a831c -->
**Look.** Read the sheet, every slide, 2× crops of every overlay. Answer the [look checklist](../brand-review/references/look-checklist.md) in writing; read it as a swipe; then the playbook's "Before publishing". Carousels with renders also get `render-review` before anyone sees them.

Source: plugin/skills/linkedin-carousel/SKILL.md:42.

## AIS-b7b9b5f42d11

<!-- AIS-b7b9b5f42d11 -->
**Hand over.** The PDF goes to LinkedIn; PNGs for review or Instagram; `_copy.txt` is the post text. List what the person must confirm: rights, consent, figures, customer or partner approval, the machine's capability for each defect shown.

Source: plugin/skills/linkedin-carousel/SKILL.md:43.

## AIS-601036d9887f

<!-- AIS-601036d9887f -->
Layouts and fields: `docs/recipes.md` (The AIS layouts, Post and carousel slides).

Source: plugin/skills/linkedin-carousel/SKILL.md:47.

## AIS-1f052b6f0413

<!-- AIS-1f052b6f0413 -->
| Layout | Use |

Source: plugin/skills/linkedin-carousel/SKILL.md:49.

## AIS-0d99dc467245

<!-- AIS-0d99dc467245 -->
| `hero` | Cover, in the post system (`docs/recipes.md`, *The post system*): light by default (white, the message headline at the top and nothing above it, the product group cropped close to fill its band); `"look": "blue"` (a hard-edged photograph over solid brand blue) when the feed needs blue. No `text`, no chips |

Source: plugin/skills/linkedin-carousel/SKILL.md:51.

## AIS-4e6055949f95

<!-- AIS-4e6055949f95 -->
| `panel` | Content. White (`"bg": "white"`, `split` 0.6): picture edge to edge on top with its OK/NOK chips, one headline; no caption, no overline. The flat-top step number at the foot is the one swipe affordance. Content slides stay white: same margins and type as the cover |

Source: plugin/skills/linkedin-carousel/SKILL.md:52.

## AIS-b883204cce37

<!-- AIS-b883204cce37 -->
| `grid` | Two to six cells: icons (dark, hexagon pattern) or real picture tiles (`src`, `focus`, `scale`) |

Source: plugin/skills/linkedin-carousel/SKILL.md:53.

## AIS-3f2fcbdee8b9

<!-- AIS-3f2fcbdee8b9 -->
| `callout` | Chips naming what is checked on one real product |

Source: plugin/skills/linkedin-carousel/SKILL.md:54.

## AIS-5d181f020a67

<!-- AIS-5d181f020a67 -->
| `event` | A trade fair: our stand framed above, the event's rows |

Source: plugin/skills/linkedin-carousel/SKILL.md:55.

## AIS-1b9645412c14

<!-- AIS-1b9645412c14 -->
| `contact` | The last slide, solid brand blue with the hexagon corner top right: `headline`, one approved `action`, two `rows` without labels (web, phone), set on one line, then the logo; no picture |

Source: plugin/skills/linkedin-carousel/SKILL.md:56.

## AIS-95645c3a2f78

<!-- AIS-95645c3a2f78 -->
| `stat`, `quote` | One verified figure (`note`, `basis`, `evidence`); someone's exact words (`permission`) |

Source: plugin/skills/linkedin-carousel/SKILL.md:57.

## AIS-668942ee7402

<!-- AIS-668942ee7402 -->
**A five-slide example** (not a required count): 1 the cover question (light, or blue when the feed needs it); 2 to 4 one answer each on white; 5 the contact on brand blue. 3 to 10 slides allowed; exactly one `contact`, last.

Source: plugin/skills/linkedin-carousel/SKILL.md:59.

## AIS-77b58a90d9f6

<!-- AIS-77b58a90d9f6 -->
**Hexagons:** flat-top everywhere. The cover and the closing slide carry the post system's hexagon corner (one size, hairlines thinning from the corner, top right, never over the picture or behind words); content slides carry only the step number. The engine draws them all.

Source: plugin/skills/linkedin-carousel/SKILL.md:60.

## AIS-23e3079f7e4c

<!-- AIS-23e3079f7e4c -->
**No gradients** (`gradient` fails).

Source: plugin/skills/linkedin-carousel/SKILL.md:61.

## AIS-efed7a59bc66

<!-- AIS-efed7a59bc66 -->
**No huge empty space:** `picture-empty` (subject under 55 % of its band) and `empty-strip` (over 12 % between elements) fail; fix the picture, never add filler.

Source: plugin/skills/linkedin-carousel/SKILL.md:62.

## AIS-422f9a3ba1e4

<!-- AIS-422f9a3ba1e4 -->
**Stock photos:** context only, as `social-post` says.

Source: plugin/skills/linkedin-carousel/SKILL.md:63.

## AIS-e17d7646b2b0

<!-- AIS-e17d7646b2b0 -->
**One grid:** every photo band in the piece shares one height (the engine works it out); the headline hangs at the same height on every content slide.

Source: plugin/skills/linkedin-carousel/SKILL.md:64.

## AIS-9bf3a0fe194b

<!-- AIS-9bf3a0fe194b -->
**The headline is visible in the picture:** each slide's headline says what that picture shows.

Source: plugin/skills/linkedin-carousel/SKILL.md:65.

## AIS-7b20a8e77b4f

<!-- AIS-7b20a8e77b4f -->
**Product pictures** are isolated on the `#F1F5F9` sweep: no conveyors, rails or line scenery. Machines appear only as their exterior views.

Source: plugin/skills/linkedin-carousel/SKILL.md:66.

## AIS-10ebf4fe3f45

<!-- AIS-10ebf4fe3f45 -->
Contact rows: aisvision.com and +34 931 003 035 (Rosepetal: rosepetal.ai), no labels, no address.

Source: plugin/skills/linkedin-carousel/SKILL.md:67.

## AIS-3e5c9e32cba2

<!-- AIS-3e5c9e32cba2 -->
First choice: real photographs, screens and footage; our exterior machine views (`library/media/3d/machines/`); product renders and detection tiles (`"evidence": "render"`, no caption saying so). Otherwise a generated or composited picture only if it passes `brand-review` step 1 at its final size.

Source: plugin/skills/linkedin-carousel/SKILL.md:71.

## AIS-599079036f91

<!-- AIS-599079036f91 -->
**Within a carousel a picture appears once**, except the deliberate clean and reveal pair of the same product (the OK/NOK overlay versions). Avoid repetition that adds no meaning. Across pieces, avoid pictures already published (ask what went out); the templates and reference sets are examples, so reusing their pictures is valid when useful; preserve accepted imagery rather than replacing everything. Check: `grep -ho '@lib/[^"]*' templates/*.json pieces/posts/*/recipe-*.json | sort | uniq -c`.

Source: plugin/skills/linkedin-carousel/SKILL.md:72.

## AIS-b4518eeaf3be

<!-- AIS-b4518eeaf3be -->
**Status:** `approved`, use it; `review`, usable once the person confirms what the catalogue reason asks; `rejected`, never; not in the catalogue, add it with `asset-library` first.

Source: plugin/skills/linkedin-carousel/SKILL.md:73.

## AIS-8ebac520dfbc

<!-- AIS-8ebac520dfbc -->
**Size:** a band is 1080 wide and `split` × 1350 tall; the picture's height must be at least that ÷ 1.25. On inner slides the render warns above 1.25× and fails above 2× (the cover fails above 1.25×); "resolution-soft" means a bigger original, not a hand-over.

Source: plugin/skills/linkedin-carousel/SKILL.md:74.

## AIS-eb253b19bdbb

<!-- AIS-eb253b19bdbb -->
**Crop out** other brands, half-cut interface chrome, burnt-in subtitles (`burnedIn` fails the render). Customer material: client logos blurred.

Source: plugin/skills/linkedin-carousel/SKILL.md:75.

## AIS-ab00fb99bda7

<!-- AIS-ab00fb99bda7 -->
**No captions** on carousel pictures: the post text names them.

Source: plugin/skills/linkedin-carousel/SKILL.md:76.

## AIS-44b42c3eb3f4

<!-- AIS-44b42c3eb3f4 -->
**Comparisons** put the reference (OK) on the left, or on top; the headline names the faulty one ("La de la derecha: …").

Source: plugin/skills/linkedin-carousel/SKILL.md:77.

## AIS-2b3de84f99fb

<!-- AIS-2b3de84f99fb -->
Write as [writing](../writing/SKILL.md) says. Sentence case; names exactly; headlines three lines at most, broken by phrase with `|`.

Source: plugin/skills/linkedin-carousel/SKILL.md:81.

## AIS-be0e258f6769

<!-- AIS-be0e258f6769 -->
**Accent** (`*words*`) on one or two slides (cover and contact), only on the closing phrase; its ¿ ? ¡ ! take the accent: `¿Cuál de estos zumos|*rechazarías*?`. Inner headlines plain.

Source: plugin/skills/linkedin-carousel/SKILL.md:82.

## AIS-3ea08c122546

<!-- AIS-3ea08c122546 -->
The contact headline is new for every piece, bringing the question back to the reader's line ("¿Lo probamos|*con tus botellas*?").

Source: plugin/skills/linkedin-carousel/SKILL.md:83.

## AIS-154a57dad7a3

<!-- AIS-154a57dad7a3 -->
The post text (`copy`): two to four sentences (the question, what the machine checks and how, what the pictures show), ending on the same approved action as the contact slide (`engine/copy.mjs`). No figures without a `stat`.

Source: plugin/skills/linkedin-carousel/SKILL.md:84.

## AIS-58488d0f3885

<!-- AIS-58488d0f3885 -->
Native Spanish and Catalan, British English, both written, not translated. No middle-dot separators, emoji or typed arrows.

Source: plugin/skills/linkedin-carousel/SKILL.md:85.

## AIS-a26e6e6e5f49

<!-- AIS-a26e6e6e5f49 -->
Use the shared [LinkedIn pattern instructions](../linkedin-banner/SKILL.md#optional-linkedin-pattern) when a pattern is requested for this format. They define allowed fields, sizes, asset retrieval and protected word, logo and photo zones.

Source: plugin/skills/linkedin-carousel/SKILL.md:89.

## AIS-60e2c5a5c192

<!-- AIS-60e2c5a5c192 -->
Products and defects to consider for a defects carousel, with the machine usually associated with each. This is a planning list, not proof of capability: a defect is shown only when that machine's articles, datasheet or brochure back it for that product and configuration. A render, a generated picture or an OCR-like overlay is never evidence of a machine reading.

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:3.

## AIS-f8b493dba2db

<!-- AIS-f8b493dba2db -->
Each answer slide shows one physically visible defect against a clean control of the same product, same camera and same light.

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:5.

## AIS-5b1453cd086b

<!-- AIS-5b1453cd086b -->
| Product | Machine | Defects to consider | Limits |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:9.

## AIS-747f95b02d91

<!-- AIS-747f95b02d91 -->
| Wine (red, white) | AIS REV 360 | Label rotated 180°; crooked, wrinkled, lifted or torn label; missing back label; missing or high capsule; missing collar; raised cork; low fill; front and back vintage mismatch | A sealed opaque capsule cannot prove the cork's state. Fill and closure claims need the exact configuration |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:11.

## AIS-b07f59f87e2b

<!-- AIS-b07f59f87e2b -->
| Cava, sparkling wine | AIS REV 360 | Skewed, lifted, torn, wrinkled or bubbled label; duplicate label; missing back label, collar, medallion or foil; vintage mismatch; broken cage wire | Vintage checks need the run specification. No closure integrity claim |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:12.

## AIS-23ad4ccc80f8

<!-- AIS-23ad4ccc80f8 -->
| Pharma glass vials | AIS REV 360 Compact Pharma | Missing or doubled label; skewed label; unreadable lot or expiry; damaged or misoriented Data Matrix; missing flip-off cap | A missing flip-off is not a confirmed reject action. Code grades need a real verifier result. No sterility claim |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:13.

## AIS-4f19ca42d8c2

<!-- AIS-4f19ca42d8c2 -->
| Heat-sealed ready-meal trays | AIS KARIKÓ | Product trapped in the seal; wrinkled seal; interrupted date print; unreadable barcode; foreign object; deformed pack | A picture cannot prove a microscopic leak or sterility |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:14.

## AIS-ef47f40e49d2

<!-- AIS-ef47f40e49d2 -->
| Orange juice, PET | AIS Hopper | Low fill; tilted or cross-threaded cap; broken tamper band; missing lot; cap presence | Fill thresholds and band inspection need configuration evidence |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:15.

## AIS-020b830a8ffd

<!-- AIS-020b830a8ffd -->
| Baby-food jars | AIS Vacuum | Raised vacuum button; missing date; tilted cap | Tilt does not prove lost vacuum; tilt detection is unconfirmed |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:16.

## AIS-436f31d857fc

<!-- AIS-436f31d857fc -->
| Food cans, plain and labelled | AIS REV 360 Compact | Body dent; label skew or wrong position; missing or smudged lot and date; external seam spike; missing pull ring | Many seam failures are internal; a seam cross-section explains, it never proves a live inspection |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:17.

## AIS-ae7a7dc448b2

<!-- AIS-ae7a7dc448b2 -->
| Food cartons (muesli) | OPTICAIS | Missing code; smudged lot or expiry; wrong expiry against the run specification; crushed top flap | Wrong-date checks need the expected date. Flap damage is unconfirmed |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:18.

## AIS-8d63262560c3

<!-- AIS-8d63262560c3 -->
| Cosmetic spray bottles | AIS REV 360 | Missing actuator; skewed label; actuator facing the wrong way | Actuator inspection is unconfirmed |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:19.

## AIS-1258dd837d0f

<!-- AIS-1258dd837d0f -->
| Cosmetic tubes | AIS Hopper | Missing cap; smeared crimp code; crooked crimp | Hopper use on tubes is unconfirmed. No fill claim on an opaque tube |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:20.

## AIS-6fdd0ee85127

<!-- AIS-6fdd0ee85127 -->
| Pharma blisters | to confirm | Missing tablet; broken tablet; wrong tablet colour; particle in the seal margin | Machine and supported checks unconfirmed |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:21.

## AIS-e614b5b381c1

<!-- AIS-e614b5b381c1 -->
| Prefilled syringes | to confirm | Bubble in the liquid; broken flange; misplaced needle shield | Machine unconfirmed. Never show a bare needle as a normal closed syringe |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:22.

## AIS-541f6134cdb3

<!-- AIS-541f6134cdb3 -->
| Pharma serialisation cartons | to confirm | Damaged Data Matrix; protruding leaflet; wrong pack label | A protruding leaflet is a packaging fault, not a safety feature. No fake decode |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:23.

## AIS-72c3a7e275a5

<!-- AIS-72c3a7e275a5 -->
| GS1 printed food labels | Omron V275 (partner) | Missing or damaged 1D or 2D code; wrong encoded data | Never invent a measured grade. Encoded-data checks need a real decoder output |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:24.

## AIS-ba100b7c7383

<!-- AIS-ba100b7c7383 -->
| Olive oil, beer | to confirm | Missing closure or crown; crooked front label; displaced neck label | Machine and camera view unconfirmed |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:25.

## AIS-ec8f630ea79c

<!-- AIS-ec8f630ea79c -->
| Cables and copper tubes | AIS REV 360 Cables | Surface scratch; missing colour stripe | A vendor's thresholds do not establish AIS performance |

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:26.

## AIS-761de459b35e

<!-- AIS-761de459b35e -->
A real product reference and one plausible visible defect, with a good control. Food photography on a demo label needs rights cleared, and its credit travels with every derivative.

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:30.

## AIS-d39e935c427b

<!-- AIS-d39e935c427b -->
A clean image, a Spanish and an English overlay, and a matched OK/NOK pair. A lineup has one defect findable without its overlay; no box on a clean unit unless it shows a reading.

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:31.

## AIS-e5b394049ef3

<!-- AIS-e5b394049ef3 -->
Proportions, closure contact, materials and light checked against real references.

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:32.

## AIS-05b09dbd0c7f

<!-- AIS-05b09dbd0c7f -->
Every image looked at at feed size and at 2×: labels, lot and date, barcode, box, caption, language and the machine claim.

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:33.

## AIS-6ea5312acfa0

<!-- AIS-6ea5312acfa0 -->
Source, rights, machine configuration and any open claim recorded privately. Passing a structural check is not readiness.

Source: plugin/skills/linkedin-carousel/references/defect-matrix.md:34.

## AIS-dcaca606771f

<!-- AIS-dcaca606771f -->
Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Source: plugin/skills/linkedin-carousel/types/application.md:3.

## AIS-3a63de5a1bd0

<!-- AIS-3a63de5a1bd0 -->
Template: `templates/carousel-application.json` (label inspection at 360°, AIS REV 360, Spanish, five slides). This type is new.

Source: plugin/skills/linkedin-carousel/types/application.md:5.

## AIS-ab7ba6f85494

<!-- AIS-ab7ba6f85494 -->
One inspection told through what fails. The slides are: the system on a real screen, why the defect is missed, what it detects on the system's own views, the machine on a real line, and contact. It answers "can you check my labels?".

Source: plugin/skills/linkedin-carousel/types/application.md:9.

## AIS-e310790f2d33

<!-- AIS-e310790f2d33 -->
One machine explained, whatever it inspects: **product**.

Source: plugin/skills/linkedin-carousel/types/application.md:11.

## AIS-1e2cf6c562bf

<!-- AIS-1e2cf6c562bf -->
One sector's line: **sector**.

Source: plugin/skills/linkedin-carousel/types/application.md:12.

## AIS-9a7ae5f03157

<!-- AIS-9a7ae5f03157 -->
Label inspection at 360° with the AIS REV 360.

Source: plugin/skills/linkedin-carousel/types/application.md:16.

## AIS-d4ba44fdf248

<!-- AIS-d4ba44fdf248 -->
The cover is dark: the real operator screen with the camera views, ending on a hard edge, the name on navy, and the logo at the foot.

Source: plugin/skills/linkedin-carousel/types/application.md:18.

## AIS-577d4e1c6c72

<!-- AIS-577d4e1c6c72 -->
Then come cans entering the machine (white); a **dark panel** with the REV 360's four views of a PET bottle, "Burbujas, despegues, textos y códigos" (the system's own output instead of the four icon cells it replaced); the machine on a real line (white); and the blue contact slide, with no picture.

Source: plugin/skills/linkedin-carousel/types/application.md:19.

## AIS-75282d43fd50

<!-- AIS-75282d43fd50 -->
Which inspection, and which machine does it?

Source: plugin/skills/linkedin-carousel/types/application.md:23.

## AIS-6865e0e8189c

<!-- AIS-6865e0e8189c -->
What does it detect? Take this from AIS's articles. For the REV 360 they list bubbles, labels coming loose, misaligned labels, and text and codes. They name high-resolution cameras plus deep learning.

Source: plugin/skills/linkedin-carousel/types/application.md:24.

## AIS-20448a61e732

<!-- AIS-20448a61e732 -->
What is not verified? "Four cameras" is not verified for the REV 360 and must not be said. It is verified only for the REV 360 Cables.

Source: plugin/skills/linkedin-carousel/types/application.md:25.

## AIS-b3d5fc1a7aad

<!-- AIS-b3d5fc1a7aad -->
Which real pictures exist? Does the customer approve them?

Source: plugin/skills/linkedin-carousel/types/application.md:26.

## AIS-42b3a4e72492

<!-- AIS-42b3a4e72492 -->
**Qualifies:** the system's real screen, the product entering the machine, the system's own views of a product, and the machine on a real line. Show what it detects on the real output, not as icons.

Source: plugin/skills/linkedin-carousel/types/application.md:30.

## AIS-8af926770aee

<!-- AIS-8af926770aee -->
**Size:** the cover's band at `split` 0.64 is at most 1080 × 864, a little less once it ends above the words. On the white panels, at `split` 0.62, pictures are framed about 920 wide. The REV 360 frames (1580 to 1680 px wide, 860 to 1080 tall) fill both without enlargement; the spray-cans frame is 720p, so watch its warning.

Source: plugin/skills/linkedin-carousel/types/application.md:31.

## AIS-83c229228a19

<!-- AIS-83c229228a19 -->
**Framing:** `split` 0.64 on the cover and 0.62 on the panels. Slides 2 and 4 are `"bg": "white"`, with the `caption` under the picture; slide 3 has no `bg`, so it is dark, with the picture in a band, its caption on an ink chip and the words on navy. Set `focus` on the screen's camera views ([38, 40]), on the bottles ([50, 45]) and on the machine.

Source: plugin/skills/linkedin-carousel/types/application.md:32.

## AIS-d88c3bce224b

<!-- AIS-d88c3bce224b -->
**Fits today:**

Source: plugin/skills/linkedin-carousel/types/application.md:33.

## AIS-56daf885e9d6

<!-- AIS-56daf885e9d6 -->
`rev360/still-rev360-operator-screen.png`, `real/rev360_spray-cans-entering.jpg`, `rev360/still-rev360-pet-four-views.png` (customer label: confirm), `real/rev360_machine-on-line.jpg` (this template uses them), and `real/ais_sabadell-building.jpg`.

Source: plugin/skills/linkedin-carousel/types/application.md:34.

## AIS-6d20e4533e9f

<!-- AIS-6d20e4533e9f -->
The wine four views belong to post-callout.

Source: plugin/skills/linkedin-carousel/types/application.md:35.

## AIS-0920ed7fc53f

<!-- AIS-0920ed7fc53f -->
**Never acceptable:**

Source: plugin/skills/linkedin-carousel/types/application.md:36.

## AIS-d540c71f32cf

<!-- AIS-d540c71f32cf -->
`real/rev360_inside-render.jpg` shown as a photo;

Source: plugin/skills/linkedin-carousel/types/application.md:37.

## AIS-9963d012bbd9

<!-- AIS-9963d012bbd9 -->
bottles that fail credibility, whatever their origin;

Source: plugin/skills/linkedin-carousel/types/application.md:38.

## AIS-7a9dd77f63b9

<!-- AIS-7a9dd77f63b9 -->
images with brackets or rings drawn in.

Source: plugin/skills/linkedin-carousel/types/application.md:39.

## AIS-74d23431837c

<!-- AIS-74d23431837c -->
**`hero`, dark cover:** the operator screen, headline (the machine's name). No `text`, no icon chips.

Source: plugin/skills/linkedin-carousel/types/application.md:43.
