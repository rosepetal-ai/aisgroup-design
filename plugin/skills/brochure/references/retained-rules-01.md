# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-55ee9fce0b91

<!-- AIS-55ee9fce0b91 -->
Then read [the shared workflow](../../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder. Production rules: [production-rules.md](../../_shared/references/production-rules.md).

Source: plugin/skills/brochure/SKILL.md:9.

## AIS-3ec5ad52dd84

<!-- AIS-3ec5ad52dd84 -->
Sales pieces that beat the original marketing PDFs: more and better real pictures, calm pages, every brochure built from the same components. The design references are the current pieces in `pieces/brochures/` (master: `pieces/brochures/compact/compact.es.html`).

Source: plugin/skills/brochure/SKILL.md:11.

## AIS-1edc06ea6f42

<!-- AIS-1edc06ea6f42 -->
**This is the only brochure, catalogue, one-pager and datasheet system.** Datasheets: the sheet HTML `pieces/datasheets/<key>/<key>.es.html` is the source (reference `pieces/datasheets/cables/cables.es.html`): edit it, export with `print/render.mjs`, look at the PDF, then `npm run mcp:pin`, which re-extracts `datasheets/data.json` and re-pins the sheet so the MCP accepts it. Never edit `data.json` by hand. The generators and the rules each one enforces are listed in [the shared workflow](../../_shared/WORKFLOW.md) (*Brand rules the generators check*). Never use a hexagon not drawn by `print/pattern.py` or the brochure, catalogue and datasheet pages in the guide's kit: those layouts are rejected. Don't copy from them or show them.

Source: plugin/skills/brochure/SKILL.md:13.

## AIS-718834913878

<!-- AIS-718834913878 -->
**The frame is fixed, always like the accepted examples.** Every brochure, catalogue and datasheet copies the cover head (brand blue, hexagon field, white logo, white title and lede), the cover icon row, the page numbers and the closing contact band verbatim from its reference (`pieces/brochures/hopper/hopper.es.html`, datasheets `pieces/datasheets/cables/cables.es.html`), with no local styles for them. A redesign, a «make it new» or a «do what marketing had» changes the content, the pictures and the inner page layout, never the frame. `print/render.mjs` fails a piece that leaves it (*off the family frame*: cover not brand blue, no white logo or hexagon field, title not white at 34 pt, no contact band, an extra brand-blue block). Before you deliver, put page 1 beside Hopper's page 1: if they don't read as the same family, it is wrong, whatever the checks say.

Source: plugin/skills/brochure/SKILL.md:15.

## AIS-1270cf8d81ae

<!-- AIS-1270cf8d81ae -->
`references/print-system.md`: the files, every component, the page sets, shorter pieces and other languages. Read it before building or rebuilding a piece.

Source: plugin/skills/brochure/SKILL.md:19.

## AIS-18385f76fb82

<!-- AIS-18385f76fb82 -->
`references/mcp-editing.md`: editing the seven Spanish technical sheets and any piece through `edit_piece` and `export_piece`.

Source: plugin/skills/brochure/SKILL.md:20.

## AIS-81b3561561d1

<!-- AIS-81b3561561d1 -->
**Content.** Start from the accepted piece in `pieces/brochures/<piece>/` and its published example; marketing's original PDF only when the person supplies it. Read it with pdftotext; to see it, check cached previews first or rasterise under the shared wrapper with `pdftoppm -r 50`. Keep every fact and every detection; restore the original's figures (100 % de la producción, cadences, sizes, 21 CFR Part 11…) using the better-sourced AIS figure for the exact model; record alternatives privately. The current chosen figures are in the shared workflow. Drop superlatives ("impecable", "de vértigo", "casi nulos") and claims without conditions. Names exact: AIS Vision Systems, AIS Hopper, AIS REV 360 STANDARD / COMPACT / PHARMA, AIS REV 360 Cables, AIS KARIKÓ, OPTICAIS, AIS Vacuum, Rosepetal, TrazAIS. Sentence case, no full stop at the end of titles, Spanish number format from the guide ([Localisation](../../communications/references/localisation.md)): no separator up to four digits, a non-breaking space from five (7200, 30 000), dates 10/2028.

Source: plugin/skills/brochure/SKILL.md:24.

## AIS-dd3747858ed7

<!-- AIS-dd3747858ed7 -->
**Pictures: gather everything, then choose.** Make contact sheets and look at every candidate:

Source: plugin/skills/brochure/SKILL.md:25.

## AIS-2ffd577d8401

<!-- AIS-2ffd577d8401 -->
The piece's own `assets/` folder. Verdicts, crops and blur regions for pictures taken from marketing's originals: [original-images.json](original-images.json).

Source: plugin/skills/brochure/SKILL.md:26.

## AIS-321681cca732

<!-- AIS-321681cca732 -->
`library/catalog.json` and `library/media/**` (not `rejected`); blurred originals in `library/media/originals/`.

Source: plugin/skills/brochure/SKILL.md:27.

## AIS-a739af399480

<!-- AIS-a739af399480 -->
The AIS website's media (aisvision.com product and journal images).

Source: plugin/skills/brochure/SKILL.md:28.

## AIS-ffe36f83f881

<!-- AIS-ffe36f83f881 -->
Detection tiles: `library/media/3d/renders/<machine>/det/*_tile.jpg` (cropped on the defect). A missing tile is made with the `detection-tiles` skill; until it exists the check goes in `.options` as an icon, never a stand-in picture of another defect.

Source: plugin/skills/brochure/SKILL.md:29.

## AIS-5925dc0492f3

<!-- AIS-5925dc0492f3 -->
Machine pictures (exterior, guards closed): `library/media/3d/machines/<machine>/` (finals) and `library/media/3d/machine-previews/` (700 px: too small for print, note it). Alt text describes the machine like a photo; it never says render, CAD or 3D.

Source: plugin/skills/brochure/SKILL.md:30.

## AIS-3a364609d20c

<!-- AIS-3a364609d20c -->
Video frames (`ffmpeg -ss t -i f -frames:v 1`) when sharp and free of overlays.

Source: plugin/skills/brochure/SKILL.md:31.

## AIS-efeddedebb22

<!-- AIS-efeddedebb22 -->
Rules: real photos, screens and footage, our exterior machine views, product stills and detection tiles first; a generated or composited picture (many originals are) only if it passes `brand-review` step 1 at print size (no garbled text, smeared detail, impossible light, CGI cleanrooms, wrong machine); never show one model as another; customer material is allowed with client brands, wineries, appellations and logos blurred (soft Gaussian over every label, nothing invented; unblurred originals stay in `library/media/originals/`); never repeat a picture within a document, even under another name (the checker fails it); round-label wine renders only (`pieces/datasheets/standard/assets/wine_det-*_tile.jpg`; the old flat-label set fails by hash); copy what you use into the piece's `assets/`.

Source: plugin/skills/brochure/SKILL.md:32.

## AIS-d8d5c2767890

<!-- AIS-d8d5c2767890 -->
**Rebuilds follow the original.** Same image subjects and density as marketing's original; a page or product (e.g. C8 GlobalVision) appears only if the original has it.

Source: plugin/skills/brochure/SKILL.md:33.

## AIS-03ed589c4342

<!-- AIS-03ed589c4342 -->
**Build** from `print/templates/machine.es.html` (change `../` to `../../shared/`) or from the closest existing piece.

Source: plugin/skills/brochure/SKILL.md:34.

## AIS-5377bb4c65e2

<!-- AIS-5377bb4c65e2 -->
**Render** (one Chromium job at a time, always under the lock): `python3 skills/_shared/scripts/safe_render.py -- node print/render.mjs pieces/brochures/<piece>/<name>.es.html`. It must pass: no overflow, 6 mm or more above footer and band, no picture enlarged past 1.25× or used twice, cover 240 ppi or more and not a video frame (unless the only real picture is soft: mark it `data-cover-ok="<why>"` and tell the person), no flat-label wine, nothing under 8.5 pt, no review wording (render, CAD, 3D, middle-dot separators), and in Spanish and Catalan no point in thousands (30 000, never 30.000). It reports ppi; under 150 is soft in print: use a better original or note it.

Source: plugin/skills/brochure/SKILL.md:35.

## AIS-7892f61c2b84

<!-- AIS-7892f61c2b84 -->
**Look** at every preview at full size, then compare with sibling pieces:

Source: plugin/skills/brochure/SKILL.md:36.

## AIS-91b5f13f3f76

<!-- AIS-91b5f13f3f76 -->
Hexagon icons use the shared `.hx` centring rule. Keep the SVG viewport centred; digit-only optical padding must not affect icons. The exporter checks each icon centre within 0.1 CSS px. Remove redundant headings above named detection tiles. Necessary equipment/software/options headings use ink h3 text at 11 pt and weight 500, without tracking; no old small blue p.sub lines.

Source: plugin/skills/brochure/SKILL.md:37.

## AIS-0c3398420fd5

<!-- AIS-0c3398420fd5 -->
Every tile shows its defect; crops keep machines, screens and labels whole.

Source: plugin/skills/brochure/SKILL.md:38.

## AIS-27a72350e028

<!-- AIS-27a72350e028 -->
Nothing letterboxed in a pale panel unless it is a deliberate cut-out; no dead band over 25 mm; no widow in a title.

Source: plugin/skills/brochure/SKILL.md:39.

## AIS-e0c22d59d88c

<!-- AIS-e0c22d59d88c -->
Same components, spacing and voice as the other pieces.

Source: plugin/skills/brochure/SKILL.md:40.

## AIS-005b24fa90bd

<!-- AIS-005b24fa90bd -->
Ready to publish: scan text and alt text for internal production notes (render, test, pendiente, borrador, confirmar); keep approved AIS demo product identities, and check pictures for identifying client marks.

Source: plugin/skills/brochure/SKILL.md:41.

## AIS-afced6cff191

<!-- AIS-afced6cff191 -->
**Deliver** the reviewed local PDF with its editable HTML or data, assets and shared components. Record what was checked and the remaining gaps in `RESULTS.md`. Never mark a file as final or upload it unless asked.

Source: plugin/skills/brochure/SKILL.md:42.

## AIS-07be920e2383

<!-- AIS-07be920e2383 -->
Small pictures floating in big pale panels; lists stretched to fill a page; hairlines everywhere. Pages must look calm and full.

Source: plugin/skills/brochure/SKILL.md:46.

## AIS-2276c0b82f28

<!-- AIS-2276c0b82f28 -->
Repeating a picture in the same document; a machine brochure that never shows the machine.

Source: plugin/skills/brochure/SKILL.md:47.

## AIS-5fc0ee41f169

<!-- AIS-5fc0ee41f169 -->
Using the Standard model photo as COMPACT or PHARMA; using the website's AI cleanroom images.

Source: plugin/skills/brochure/SKILL.md:48.

## AIS-3beb2dd19a22

<!-- AIS-3beb2dd19a22 -->
Test renders (400 px, noisy) shipped as tiles; blurred labels that still read "Montsant".

Source: plugin/skills/brochure/SKILL.md:49.

## AIS-3ea05e3e893d

<!-- AIS-3ea05e3e893d -->
Copy that says "speed and diameters per project" next to a restored "hasta 300 m/min".

Source: plugin/skills/brochure/SKILL.md:50.

## AIS-e8927e299468

<!-- AIS-e8927e299468 -->
Starting extra agents or renderers the session doesn't allow.

Source: plugin/skills/brochure/SKILL.md:51.

## AIS-02e0f8be5ce4

<!-- AIS-02e0f8be5ce4 -->
Print body heading spacing is in print/assets/editorial.css; retain that link when copying a piece. It preserves specification-table spacing while the existing system owns closing bands and their checks.

Source: plugin/skills/brochure/SKILL.md:53.

## AIS-00fdef9921d2

<!-- AIS-00fdef9921d2 -->
The tools edit a working copy; the file in `pieces/` stays as it is. Say so when you hand over, and offer to apply the change to the source too.

Source: plugin/skills/brochure/references/mcp-editing.md:3.

## AIS-de055c6c2fc2

<!-- AIS-de055c6c2fc2 -->
`edit_piece copy`: `pieceId` is your own short name (e.g. `folleto-hopper`), `source` the HTML, e.g. `pieces/brochures/hopper/hopper.es.html`.

Source: plugin/skills/brochure/references/mcp-editing.md:7.

## AIS-7f1b9a41f31a

<!-- AIS-7f1b9a41f31a -->
`edit_piece slots`: every text, picture and alt text, with its page and id.

Source: plugin/skills/brochure/references/mcp-editing.md:8.

## AIS-fa5544e2686c

<!-- AIS-fa5544e2686c -->
`edit_piece update`: `slotChanges` with only the slots to change, and the `digest` from step 2 as `expectedDigest`. The reply validates the piece (`valid`, `errors`); fix any error before exporting.

Source: plugin/skills/brochure/references/mcp-editing.md:9.

## AIS-f5369da69b0e

<!-- AIS-f5369da69b0e -->
`export_piece enqueue render-pdf` (`saveAs` copies the PDF to the working folder), then `status` until it finishes. Open every page PNG it returns.

Source: plugin/skills/brochure/references/mcp-editing.md:10.

## AIS-56ec6454732b

<!-- AIS-56ec6454732b -->
A change the slots can't make (a new page, a different layout) is an edit to the source HTML with this skill, then steps 1 to 4.

Source: plugin/skills/brochure/references/mcp-editing.md:12.

## AIS-1ac12ac16444

<!-- AIS-1ac12ac16444 -->
`source` is `datasheets/data.json#<key>` (`hopper`, `kariko`, `cables`, `compact`, `pharma`, `standard`, `opticais`). Read the `print:<key>-technical-sheet` descriptor first. `printChanges` cover the cover summary under the model name (`cover_headline`), the inspection title and lead, technical and software text and table rows, and the cover, screen and technical images. The model name, cover facts, inspection tiles, layout and language are fixed. Copy that doesn't fit is refused: shorten it, or change the layout in the sheet HTML; never shrink type or drop content. Export with `render-pdf`.

Source: plugin/skills/brochure/references/mcp-editing.md:16.

## AIS-de889cc358e9

<!-- AIS-de889cc358e9 -->
The sheet HTML `pieces/datasheets/<key>/<key>.es.html` is the source; `datasheets/data.json` is extracted from it and pinned. After a reviewed edit to a sheet, look at its PDF, then re-extract and re-pin with `npm run mcp:pin`; until then the tools refuse that sheet.

Source: plugin/skills/brochure/references/mcp-editing.md:18.

## AIS-622ae1061b1a

<!-- AIS-622ae1061b1a -->
An export that comes back `blocked` rendered nothing: tell the user why (`reason`) and stop.

Source: plugin/skills/brochure/references/mcp-editing.md:22.

## AIS-e0e6e3ceec1d

<!-- AIS-e0e6e3ceec1d -->
Passing checks is not a review: look at every page before calling it done.

Source: plugin/skills/brochure/references/mcp-editing.md:23.

## AIS-7738100c267d

<!-- AIS-7738100c267d -->
| Path | What |

Source: plugin/skills/brochure/references/print-system.md:3.

## AIS-6e818700a73e

<!-- AIS-6e818700a73e -->
| `print/system.css` | The only stylesheet. Components below. Edit design here, once, for all pieces |

Source: plugin/skills/brochure/references/print-system.md:5.

## AIS-196916f807df

<!-- AIS-196916f807df -->
| `print/assets/` | Inter, AIS white logo, hexagon fields, `icons.js` (130 Lucide icons: `<i data-i="name">`) |

Source: plugin/skills/brochure/references/print-system.md:6.

## AIS-724866d4b254

<!-- AIS-724866d4b254 -->
| `print/render.mjs` | Checks and exports PDF and `previews/<name>-N.png` (110 ppi) |

Source: plugin/skills/brochure/references/print-system.md:7.

## AIS-1bce86539f7a

<!-- AIS-1bce86539f7a -->
| `print/templates/machine.es.html` | Three-page structure with slots and Conservas content; must be adapted and given assets |

Source: plugin/skills/brochure/references/print-system.md:8.

## AIS-956987eea0bb

<!-- AIS-956987eea0bb -->
| `pieces/shared` | Symlink to `print/` (pieces link `../../shared/…`) |

Source: plugin/skills/brochure/references/print-system.md:9.

## AIS-d06670e9ee27

<!-- AIS-d06670e9ee27 -->
| `pieces/brochures/<piece>/` | One folder per piece: HTML, `assets/`, PDF, `previews/` |

Source: plugin/skills/brochure/references/print-system.md:10.

## AIS-6e2048bb2fcc

<!-- AIS-6e2048bb2fcc -->
Components (nothing else; inline custom properties only: `--n --ar --fx --fy --h --y --len --c`):

Source: plugin/skills/brochure/references/print-system.md:12.

## AIS-d4e7c6aac0ac

<!-- AIS-d4e7c6aac0ac -->
**Covers are impeccable**: the hero is the sharpest, best-composed image the piece has, printing at 240 ppi or more, never a video frame, never soft, cluttered or motion-blurred. Machines on covers show the machine working, with its product on the line. If no such image exists, make one (`product-render`, machine stills) before building the cover; `print/render.mjs` fails a cover under 240 ppi or named or catalogued as a video frame.

Source: plugin/skills/brochure/references/print-system.md:13.

## AIS-c64edf9b1485

<!-- AIS-c64edf9b1485 -->
**Cover**: `.cover-head` (logo 20 mm AIS, `.logo.rosepetal` 38 mm; h1 product name, one paragraph that ends with the headline facts) + `.hero` (real photo, full bleed, `--fx/--fy`) + `.cover-bottom .facts` (three `.fact`: hexagon icon, label, one line).

Source: plugin/skills/brochure/references/print-system.md:14.

## AIS-b58b928076bf

<!-- AIS-b58b928076bf -->
**Inner page**: `.page-content`, a factual `h2` with at most one `.lead`, `.block` sections and `.foot`. Omit redundant detection-group labels; necessary table/options subheads are ink `h3.editorial-heading` at 11 pt, weight 500. No eyebrows or running headers.

Source: plugin/skills/brochure/references/print-system.md:15.

## AIS-ba15c0b205c2

<!-- AIS-ba15c0b205c2 -->
**Pictures**: `.tiles` (one picture per detection, name under it; `--n` per row, `--ar` aspect, `--fx/--fy` to keep the defect in frame), `.photo` (`--h`, `.grow`, `.cutout`), `.split` (`.wide`, `.rev`).

Source: plugin/skills/brochure/references/print-system.md:16.

## AIS-74447a4ad124

<!-- AIS-74447a4ad124 -->
**Lists**: `.specs` (two columns, square bullet), `.options` (hexagon icon and label, `--n`), `.note` (qualifier, pale).

Source: plugin/skills/brochure/references/print-system.md:17.

## AIS-2b94237ba1b3

<!-- AIS-2b94237ba1b3 -->
**Product zones**: `.application` > `.zones-figure` (image + `.key` at `--y`) + `.zone` titles level with their keys.

Source: plugin/skills/brochure/references/print-system.md:18.

## AIS-7d98bcdaff6a

<!-- AIS-7d98bcdaff6a -->
**Last page**: `.page.last`, `.band` after `</main>` (contact: "Envíanos muestras…", web, phone; Rosepetal: "Solicita una demo", email, web).

Source: plugin/skills/brochure/references/print-system.md:19.

## AIS-81cbae706980

<!-- AIS-81cbae706980 -->
Page set for a machine: 1 cover, 2 "Qué inspecciona" (every detection a picture tile; checks with no picture as `.options` icons), 3 "Equipo y software" (machine or inspection photo in `.split`, `.specs`, `.options`, band). Catalogues: cover, an applications page (`.application`), one page per system on the page 2 and 3 patterns, benefits and band.

Source: plugin/skills/brochure/references/print-system.md:21.

## AIS-a8878e70fc56

<!-- AIS-a8878e70fc56 -->
**Shorter pieces.** A "one-page" or flyer request: use the number of sides asked for; if unspecified, one A4 side. A two-sided sheet uses the cover plus one `.page.inner.last` with the tiles, key specs and band. A single A4 side uses one `.page.inner.last`: h2 + lead, one `.photo` of the machine, the detection `.tiles`, the band. Never squeeze three pages of content onto one; cut to the strongest detections and record omissions privately.

Source: plugin/skills/brochure/references/print-system.md:23.

## AIS-654586e4df62

<!-- AIS-654586e4df62 -->
**Other languages.** Same file structure, `<name>.<lang>.html` with `<html lang="en">`, every word written natively (British English, not word for word), band in that language ("Send us samples of your containers", alt text too). English numbers: 7,200 and 30,000, dates 10/2028; units with a space (500 ml). Publication copy: `AIS <Product> EN.pdf`.

Source: plugin/skills/brochure/references/print-system.md:25.

## AIS-ff1ec9a93c5a

<!-- AIS-ff1ec9a93c5a -->
**Keep it simple, everywhere.** Every page, screen, piece, skill and MCP tool: one purpose, the plainest layout, design and implementation that serve it (benchmarks: Linear's site, Apple Notes). Cut taglines, helper text and secondary labels; if something needs them to make sense, fix the layout. A decision ships only if it improves user, developer and agent experience at once and breaks nothing. It is the first essential in the guide (`src/essentials.ts`, so it opens brand.md) and wins whenever two rules disagree. **Main rule of the brand system:** stated word for word as essential 1 (EN, ES, CA), the opening line of every plugin skill, WORKFLOW, production-rules, brand-review item 1, the studio MCP instructions and every plan_piece reply (`mcp/tests/rule.test.mjs` keeps them identical). Enforced on text by `engine/text-check.mjs` (every kind; helper text, hype words, slogans, AI tells; ES, EN, CA, PT, FR); how to write is the plugin's `writing` skill and the guide's Voice section «Writing that reads as ours». Print keeps its small section labels. No text that sounds AI-written.

Source: brand decisions.

## AIS-0d653e25bb18

<!-- AIS-0d653e25bb18 -->
Blue logo on white. White (reversed) logo on blue, navy or dark photos. Black only for black-only print and the **AIS website headers on white**. The Rosepetal site is light, so its header uses the blue logo, 27 px tall (140 px wide), and 25 px (130 px, its minimum) on phones. (guide `logos.mdx`, `web.mdx`)

Source: brand decisions.

## AIS-b514c4b63a9a

<!-- AIS-b514c4b63a9a -->
**Rebuilds follow the original piece:** a page or product (e.g. C8 GlobalVision) appears only if marketing's original for that piece has it; image count and subjects match the original; covers ≥240 ppi, never a video frame (enforced by `print/render.mjs`).

Source: brand decisions.

## AIS-298a0b75b73b

<!-- AIS-298a0b75b73b -->
**Rules separate, never frame.** A divider goes between rows only: never after a list's last row, never stacked on the next section's rule; text centred between its rules. Two rules with only space between them are not acceptable. Enforced by `print/render.mjs` (fails on two rules with nothing between them). (guide Layout and shape rules)

Source: brand decisions.

## AIS-e8b427f958aa

<!-- AIS-e8b427f958aa -->
**Generated images are allowed when the result is good.** The end result is what matters. A generated or composited image (including those in marketing's original pieces) may be used if it looks credible at its print or feed size: no garbled or invented-looking text, no impossible geometry or light, no misrepresentation of which AIS machine it is, customer brands still blurred. Real material and our renders stay first choice; pick whatever gives the best final piece.

Source: brand decisions.

## AIS-22ae8d3450e6

<!-- AIS-22ae8d3450e6 -->
**Company line: «Engineering peace of mind» and «Automated quality control»**, exactly as on the marketing banner, in English. Use it on the LinkedIn covers; do not translate it or replace it with other copy. The company cover shows the range as a single-scene machine family shot (not one machine, not a collage).

Source: brand decisions.

## AIS-c5d992b5ffce

<!-- AIS-c5d992b5ffce -->
pieces are **image-first** (one sharp photo band, cover split about 0.64, white panel fails under 40 % picture);

Source: brand decisions.

## AIS-53adda69eeb0

<!-- AIS-53adda69eeb0 -->
**Print and documents** (`public/kit/*.html` on `kit.css`, `npm run kit` in `studio/`):

Source: brand decisions.

## AIS-f47673ec6358

<!-- AIS-f47673ec6358 -->
business cards (3 brands), letterhead, brochure (AIS REV 360);

Source: brand decisions.

## AIS-d0f0cbde317d

<!-- AIS-d0f0cbde317d -->
datasheet (own machine) and partner datasheet (Omron LVS);

Source: brand decisions.

## AIS-86c83338e466

<!-- AIS-86c83338e466 -->
3 mm bleed on print PDFs, text 5 mm inside trim;

Source: brand decisions.

## AIS-0e844d0ecbbb

<!-- AIS-0e844d0ecbbb -->
one closing block on print pieces.

Source: brand decisions.

## AIS-60b7f5bb2f0c

<!-- AIS-60b7f5bb2f0c -->
| LinkedIn company cover or personal banner | `linkedin-banner` |

Source: brand decisions.

## AIS-dcc7beb0aa07

<!-- AIS-dcc7beb0aa07 -->
| Print brochure, catalogue, one-pager | `brochure` (v2 print system only) |

Source: brand decisions.

## AIS-feb03d5c9fb0

<!-- AIS-feb03d5c9fb0 -->
| Print, email, slides, covers, infographics | `rosepetal-design/public/kit/*.html`, `npm run kit` |

Source: brand decisions.

## AIS-b1a859da9550

<!-- AIS-b1a859da9550 -->
original files for photos taken from video (soft in print);

Source: brand decisions.

## AIS-948d4009f5dd

<!-- AIS-948d4009f5dd -->
**Unreviewed material** in `assets/`: the mascot, coin and logo proposals and the datasheet PDFs are not reviewed.

Source: brand decisions.

## AIS-a2afbb589c99

<!-- AIS-a2afbb589c99 -->
Brochures, catalogues and datasheets keep the family frame: cover-head in brand blue with the white logo, the hex field, a 34 pt white title, the contact band on the last page. Never restyle a cover off it (enforced by print/render.mjs).

Source: brand decisions.

## AIS-46495cfa29bc

<!-- AIS-46495cfa29bc -->
Covers are impeccable: no video frames or soft images (≥240 ppi, enforced; data-cover-ok only with a written reason); machines with product; wine only with round-label renders.

Source: brand decisions.

## AIS-ee34f4a33762

<!-- AIS-ee34f4a33762 -->
Decks: the cover photo fills its panel edge to edge; markers sit on the title's first line (2 px); facility slides use the Sabadell aerial view.

Source: brand decisions.

## AIS-69e6df351b9a

<!-- AIS-69e6df351b9a -->
Generated imagery only when it looks credible at print/feed size; real material and our renders first.

Source: brand decisions.

## AIS-7eea6a0532f4

<!-- AIS-7eea6a0532f4 -->
// Checks (a failure stops the export):

Source: plugin/print/render.mjs:5.

## AIS-977792ccb25b

<!-- AIS-977792ccb25b -->
const args = process.argv.slice(2);

Source: plugin/print/render.mjs:26.

## AIS-18a323df1efe

<!-- AIS-18a323df1efe -->
const draft = args.includes('--draft');

Source: plugin/print/render.mjs:27.

## AIS-2f798c301f51

<!-- AIS-2f798c301f51 -->
const look = args.includes('--look'); // write previews even when checks fail, to look at the problem (never for delivery)

Source: plugin/print/render.mjs:28.

## AIS-692411002e46

<!-- AIS-692411002e46 -->
const file = path.resolve(args.find((a) => !a.startsWith('--')) || '');

Source: plugin/print/render.mjs:29.

## AIS-63747d58a0a3

<!-- AIS-63747d58a0a3 -->
if (!fs.existsSync(file)) { console.error('usage: render.mjs <piece.html> [--draft]'); process.exit(2); }

Source: plugin/print/render.mjs:30.

## AIS-6b623e25f528

<!-- AIS-6b623e25f528 -->
const dir = path.dirname(file), base = path.basename(file, '.html');

Source: plugin/print/render.mjs:31.

## AIS-36e7892ca939

<!-- AIS-36e7892ca939 -->
const FOOT = { bottom: 8.26, right: 15 };

Source: plugin/print/render.mjs:33.

## AIS-9585ee2f6564

<!-- AIS-9585ee2f6564 -->
const BANNED = /\b(borrador|draft|pendiente|por confirmar|to be confirmed|imagen ilustrativa|illustrative|render|renders|renderizado|CAD|3D model)\b|(?<![lL])\u00b7|\u00b7(?![lL])/i;

Source: plugin/print/render.mjs:34.

## AIS-3ff90c4c77bf

<!-- AIS-3ff90c4c77bf -->
const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage', '--font-render-hinting=none'] });

Source: plugin/print/render.mjs:36.

## AIS-5fa98749c376

<!-- AIS-5fa98749c376 -->
if (/\/(brochures|datasheets)\//.test(file) && /<p\s+class=["']sub["']/.test(fs.readFileSync(file, 'utf8')))

Source: plugin/print/render.mjs:39.

## AIS-235564d53614

<!-- AIS-235564d53614 -->
throw new Error('Replace print micro-labels with necessary ink editorial headings; detection tiles already name their subject.');

Source: plugin/print/render.mjs:40.

## AIS-66e393eda5bb

<!-- AIS-66e393eda5bb -->
const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });

Source: plugin/print/render.mjs:41.

## AIS-925fa7e3193f

<!-- AIS-925fa7e3193f -->
const r = await page.evaluate(([bannedSrc, pointSrc]) => {

Source: plugin/print/render.mjs:46.

## AIS-6076b51607c8

<!-- AIS-6076b51607c8 -->
const banned = new RegExp(bannedSrc, 'i'), point = new RegExp(pointSrc, 'g');

Source: plugin/print/render.mjs:47.

## AIS-263e970f806d

<!-- AIS-263e970f806d -->
const lang = (document.documentElement.lang || '').slice(0, 2);

Source: plugin/print/render.mjs:48.

## AIS-963343209485

<!-- AIS-963343209485 -->
const mm = (px) => px * 25.4 / 96;

Source: plugin/print/render.mjs:49.

## AIS-c74d6fbc187b

<!-- AIS-c74d6fbc187b -->
const pages = [...document.querySelectorAll('.page')];

Source: plugin/print/render.mjs:50.

## AIS-37c7ec39a654

<!-- AIS-37c7ec39a654 -->
const out = { bandToken: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--band-gap')) /* mm */, pages: [], images: [], text: [], banned: [], missing: [], icons: [], numbers: [], rules: [] };

Source: plugin/print/render.mjs:51.
