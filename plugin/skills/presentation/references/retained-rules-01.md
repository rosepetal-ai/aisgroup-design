# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-99fcd9907fe4

<!-- AIS-99fcd9907fe4 -->
Then read [the shared workflow](../_shared/WORKFLOW.md): the sources, generators and brand rules every piece shares; it wins over anything below. Commands run from the plugin folder. Production rules: [production-rules.md](../_shared/references/production-rules.md).

Source: plugin/skills/presentation/SKILL.md:9.

## AIS-0d9918899894

<!-- AIS-0d9918899894 -->
Decks are content files rendered by one engine, the approved "Hoy + azul" system: `decks/` (`build.mjs`, `layouts.mjs` and `layouts.css` for the layouts, `bands.mjs` for the spacing and empty-band checks, `verify.mjs`, `runtime/` for the stage and presenter, `to_pptx.py`, `assets/` with Inter, logos, Lucide icons, the hexagon fades, client logos and pictures). It is the only presentation generator. The approved decks are the references: `pieces/decks/corporate-2026/` (General 2026), `automotive/`, `beverage/`, `biscuits/`, `canning/` and `wine/`. Reusable sections are in `decks/sections/*.es.json`.

Source: plugin/skills/presentation/SKILL.md:11.

## AIS-243820c76308

<!-- AIS-243820c76308 -->
1920 × 1080, 128 px side margins, 12 columns of 102 px with 40 px gutters, top and bottom margins 96, 8 px baseline. The headline starts at (128, 96); content follows 64 px under it.

Source: plugin/skills/presentation/SKILL.md:15.

## AIS-de4457db88e7

<!-- AIS-de4457db88e7 -->
Grounds come from the layout, never from the content: white content slides; brand blue (#17356E) for the cover, a case (`split`), key figures (`figures`), the company slide (`columns`) and the closing; deep blue for section dividers. No gradients: photos have hard edges (full-panel photographs on blue and white).

Source: plugin/skills/presentation/SKILL.md:16.

## AIS-3e779ea6371c

<!-- AIS-3e779ea6371c -->
Type, a closed scale in Inter: display 120, headline 76, body 38 (never under 36), label 28, meta 22 (slide number only). Sentence case.

Source: plugin/skills/presentation/SKILL.md:17.

## AIS-a8053070e25a

<!-- AIS-a8053070e25a -->
Hexagons only as the layouts draw them: the corner fade on blue slides, the pale fade on white opening and statement slides, the flat-top hexagon holding a step or phase number.

Source: plugin/skills/presentation/SKILL.md:18.

## AIS-5aac2b7e9ea8

<!-- AIS-5aac2b7e9ea8 -->
The closing is "Gracias" with web, phone, LinkedIn and YouTube (`contacts[{k, v}]`), the logo top right.

Source: plugin/skills/presentation/SKILL.md:19.

## AIS-d604176006c4

Historical wording: explicitly superseded by AIS-1c7925882050. For cover photographs apply the newer faithful bounded EDSR process. Preserve compatible and non-cover constraints from this historical record.

<!-- AIS-d604176006c4 -->
Photos fill the 940 × 1080 side panel edge to edge wherever the source supports it at ≤1.3×. Cover panels remain 920 × 1080. Never generate, invent detail or upscale a file to disguise its real resolution. Search for a better original of the same subject; record any unresolved source limit.

Source: plugin/skills/presentation/SKILL.md:23.

## AIS-a42d89b47122

<!-- AIS-a42d89b47122 -->
Facilities: use `pieces/decks/corporate-2026/source-media/sabadell-aerial-photo.jpg` (`ais-sabadell-aerial-deck` in the library). Never substitute the soft street facade or a map on an office/company slide. Reuse of this specific facility photograph on company and contact slides is deliberate.

Source: plugin/skills/presentation/SKILL.md:24.

## AIS-a96a41a590f0

<!-- AIS-a96a41a590f0 -->
Stable Inter scale by layout: content headings 76/84; list names 44/60 and descriptions 38/52; three/four-column feature names 44/60 and body 38/52; figures 120/124 beside a photo; labels 28/38, number 22/32. Whitespace changes spacing, never the list type scale. Give actual screens and photographs priority over repetitive icon lists; `features.image` supports a proof photograph beside the original wording.

Source: plugin/skills/presentation/SKILL.md:25.

## AIS-1c868382c424

<!-- AIS-1c868382c424 -->
No content-slide empty band above 15% (162 px), excluding deliberate covers, numbered dividers and quotations. Both `build.mjs` and `verify.mjs` enforce it. Layout, source-pixel scale, facility identity and full-panel geometry are checked alongside 2 px alignment.

Source: plugin/skills/presentation/SKILL.md:26.

## AIS-f48b02e8ad8f

<!-- AIS-f48b02e8ad8f -->
Rebuilds preserve every original text, figure, name and usable picture. Review numbered before/after pairs against the accepted deck, then every final slide at 1920 × 1080; retain an accepted slide if a trial is not clearly better.

Source: plugin/skills/presentation/SKILL.md:27.

## AIS-ffc6b13ab430

Historical wording: explicitly superseded by AIS-8604d749edb5. The standalone template/master is retired. Exact original wording remains in the ledger; the live owner keeps only a pointer to the current editable-deck workflow.

<!-- AIS-ffc6b13ab430 -->
Rule [AIS-8604d749edb5](powerpoint.md#ais-8604d749edb5).

Exact historical source wording is preserved in evals/rules-ledger.json.

## AIS-fadc608ea73c

<!-- AIS-fadc608ea73c -->
**Brief.** Audience, language, the one message, how many slides, what it is for (a meeting, a section to insert in the corporate deck). Read the closest approved deck and section first; reuse their wording and pictures where true.

Source: plugin/skills/presentation/SKILL.md:32.

## AIS-2bbf9f6ee1d3

<!-- AIS-2bbf9f6ee1d3 -->
**Facts.** From AIS sources only: the machine's brochure (`pieces/brochures/<machine>/`), the approved decks in `pieces/decks/`. Rebuilding a deck keeps every original claim, figure and name as written; no superlatives, no figure without its source and conditions.

Source: plugin/skills/presentation/SKILL.md:33.

## AIS-50b926c8ab9f

<!-- AIS-50b926c8ab9f -->
**Write the section** as `decks/sections/<topic>.<lang>.json` = `{"slides": [ … ]}`, so other decks can include it. Then a deck that uses it, `pieces/decks/<deck>/content.<lang>.json`:

Source: plugin/skills/presentation/SKILL.md:34.

## AIS-7c4b28576152

<!-- AIS-7c4b28576152 -->
{ "meta": { "lang": "es", "title": "AIS Vision Systems, OPTICAIS", "file": "ais-vision-systems_opticais_2026_es" },

Source: plugin/skills/presentation/SKILL.md:36.

## AIS-579030a6a201

<!-- AIS-579030a6a201 -->
"slides": [ { "include": "../../../decks/sections/hopper.es.json" } ] }

Source: plugin/skills/presentation/SKILL.md:37.

## AIS-f6f6a2cffc08

<!-- AIS-f6f6a2cffc08 -->
A whole deck opens with a `cover` and ends with the `closing`; a section for the corporate deck opens with a `divider`.

Source: plugin/skills/presentation/SKILL.md:39.

## AIS-30d0cddf8634

<!-- AIS-30d0cddf8634 -->
**Build** (Chromium, one job at a time, under the lock):

Source: plugin/skills/presentation/SKILL.md:40.

## AIS-5ccacf622d59

<!-- AIS-5ccacf622d59 -->
python3 skills/_shared/scripts/safe_render.py -- node decks/build.mjs pieces/decks/<deck>/content.<lang>.json

Source: plugin/skills/presentation/SKILL.md:42.

## AIS-21363421e0ce

<!-- AIS-21363421e0ce -->
Writes `<file>.html` (one file, CSS and JS inline, with `media/` beside it), `slides/NN.png`, `<file>.pdf` (vector text) and `<file>.pptx` (Inter text boxes, re-croppable pictures) next to the content file, and `build/checks.txt`. It must end in `checks passed`, or it exits 1 listing: text under its floor size, outside the slide or its box, over other text or a picture, or inside the top and bottom margins; a gap outside the rhythm (label to value 8, caption 16, item 24, block 40, headline to content 64) or text off the column grid; an empty band over 15 % of the slide height; the slide number and footer out of place; a non-cover picture enlarged past 1.3× (cover enlargement warns), missing or repeated; the hexagon fade near text or over a picture; production words (render, CAD, 3D, " · ", →, TODO, pendiente, borrador); PPTX with library metadata or file names as alt text. In Spanish and Catalan a point in thousands (30.000) stops the build before any output: write 30 000 (non-breaking space) and 7200. `--html-only` writes just the HTML (no Chromium); `--slides 1,3,4` builds a selection.

Source: plugin/skills/presentation/SKILL.md:44.

## AIS-c8e0a244cd26

<!-- AIS-c8e0a244cd26 -->
Then `node decks/verify.mjs pieces/decks/<deck>/content.<lang>.json` (under the lock) walks every build step forwards, backwards and from the URL and fails if any frame differs from the exported slide. Both build and verification measure markers against the title's first line, row baselines, column rails, equal grid tracks and gaps, table columns and picture captions, with a 2 px tolerance (`build/alignment.json`, `build/verify/alignment.json`). Render the PPTX with LibreOffice and pass `--pptx-pdf <native-render.pdf>` to verification: actual text baselines and the complete visible text must match the PDF (`build/verify/pptx-baselines.json`). Personally inspect every exported PDF and native PPTX slide at full size.

Source: plugin/skills/presentation/SKILL.md:45.

## AIS-f9e9fd6c2022

<!-- AIS-f9e9fd6c2022 -->
Through the MCP: `plan_piece` lists the approved decks as templates; `edit_piece action:copy source:pieces/decks/<deck>/content.<lang>.json`, `action:slots`, then `slotChanges` (`s<slide>.<field path>`, e.g. `s3.title`, `s5.facts.1.v`, `s2.image.src`); `export_piece render-html`, then `render-pdf` (PDF, PNGs, PPTX), same `build.mjs`.

Source: plugin/skills/presentation/SKILL.md:46.

## AIS-0b7c0db9d4cb

<!-- AIS-0b7c0db9d4cb -->
**Hand over.** The PPTX, the PDF and the HTML folder, what was actually checked and any real remaining limits.

Source: plugin/skills/presentation/SKILL.md:48.

## AIS-43cb9aa674f0

<!-- AIS-43cb9aa674f0 -->
| Layout | Use | Fields |

Source: plugin/skills/presentation/SKILL.md:52.

## AIS-e3481e31e4e8

<!-- AIS-e3481e31e4e8 -->
| `cover` | First slide, brand blue, picture fills the right panel | `title`, `lead`, `image{src, pos, alt, crop?}` (optional original-pixel `[left,top,right,bottom]` crop), `meta` (year) |

Source: plugin/skills/presentation/SKILL.md:54.

## AIS-852caeaf1eae

<!-- AIS-852caeaf1eae -->
| `divider` | Section opener, deep blue, the deck's parts | `part`, `title` |

Source: plugin/skills/presentation/SKILL.md:55.

## AIS-c27804f5d50e

<!-- AIS-c27804f5d50e -->
| `agenda` | The parts of the deck | `title`, `items[{title}]` |

Source: plugin/skills/presentation/SKILL.md:56.

## AIS-f6b8b30d765d

<!-- AIS-f6b8b30d765d -->
| `statement` | One sentence, with a picture beside it if it has one | `title`, `lead`, `image` |

Source: plugin/skills/presentation/SKILL.md:57.

## AIS-a423cf5d66e1

<!-- AIS-a423cf5d66e1 -->
| `columns` | The company slide: names in columns, brand blue | `title`, `lead`, `columns[{title, items}]` |

Source: plugin/skills/presentation/SKILL.md:58.

## AIS-5aa9c0d9eaa8

<!-- AIS-5aa9c0d9eaa8 -->
| `split` | A case: picture beside its points, brand blue | `title`, `lead`, `image`, `points[{icon, text}]`, `wide` |

Source: plugin/skills/presentation/SKILL.md:59.

## AIS-107f850b4882

<!-- AIS-107f850b4882 -->
| `photo` | One picture to the slide edge; `panorama:true` uses a wide original below the text | `title`, `lead`, `image`, `panorama?` |

Source: plugin/skills/presentation/SKILL.md:60.

## AIS-ba005f7d52f9

<!-- AIS-ba005f7d52f9 -->
| `stage` | A machine on its line, facts, one detail picture | `title`, `lead`, `image`, `facts[{k, v}]`, `detail{image, title, text}` |

Source: plugin/skills/presentation/SKILL.md:61.

## AIS-393e5788e442

<!-- AIS-393e5788e442 -->
| `product` | One machine or product with facts | `title`, `lead`, `image` (`fit: contain`, `keep`), `facts[{k, v}]`, `tiles[{image, label}]` (two at most) |

Source: plugin/skills/presentation/SKILL.md:62.

## AIS-4992431cb2d7

<!-- AIS-4992431cb2d7 -->
| `phases`, `steps`, `milestones`, `gantt` | A process or a timeline | `items[{title, text}]`, `start`; `steps[{title, text, image}]`; `items[{date, text}]`; `months`, `rows[{label, from, to, tone}]`, `caption` |

Source: plugin/skills/presentation/SKILL.md:63.

## AIS-19b69e86a524

<!-- AIS-19b69e86a524 -->
| `features` | Icon or logo rows or columns | `title`, `lead`, `cols`, `items[{icon or logos or image, title, text}]` |

Source: plugin/skills/presentation/SKILL.md:64.

## AIS-f7e9bab2d7a7

<!-- AIS-f7e9bab2d7a7 -->
| `grid`, `mosaic` | Picture tiles (detections, product lines); one large picture beside tiles | `title`, `lead`, `cols`, `ratio`, `tiles[{image, label}]`; `image` |

Source: plugin/skills/presentation/SKILL.md:65.

## AIS-39283e567256

<!-- AIS-39283e567256 -->
| `figures`, `bars` | Verified numbers, brand blue / white | `figures[{value, label, text}]`, `image`; `bars[{label, value}]`, `caption` |

Source: plugin/skills/presentation/SKILL.md:66.

## AIS-4c2041aacf4b

<!-- AIS-4c2041aacf4b -->
| `logos` | Client references | `title`, `cols`, `logos[{src, name}]` |

Source: plugin/skills/presentation/SKILL.md:67.

## AIS-38114147f642

<!-- AIS-38114147f642 -->
| `closing` | "Gracias", brand blue | `title`, `contacts[{k, v}]` (Web, Teléfono, LinkedIn, YouTube) |

Source: plugin/skills/presentation/SKILL.md:68.

## AIS-c3e7d6be79e7

<!-- AIS-c3e7d6be79e7 -->
Every slide takes `notes` (speaker notes, also in the PPTX). Text: `\n` breaks a line, `**text**` is Medium. Icons are Lucide names from `decks/assets/icons/`. Pictures: `src` relative to the plugin folder, `tpl:` for `decks/assets/`, with `pos` (`"50% 40%"`), `fit: contain`, `bg` and `alt`. The engine sizes type within the scale, centres blocks on the baseline and keeps non-cover pictures within 1.3×; photographs fill their side panel when the real pixels support it. Smaller photographs dock to the outer edges at their real grade; never add a darker navy inset. Complete screens and cut-outs retain all their information. A cover always fills its 920 × 1080 panel, ignoring legacy `maxScale` and `fit: contain` fields; insufficient source pixels produce a warning, never a smaller panel.

Source: plugin/skills/presentation/SKILL.md:70.

## AIS-56dd4a3406a1

<!-- AIS-56dd4a3406a1 -->
One message per slide, about 40 words at most; the headline is a sentence that says the point, two lines at most. No eyebrow, tagline or line above the headline; no running footer (the slide number only). Long lists: split the slide or move detail to `notes`.

Source: plugin/skills/presentation/SKILL.md:74.

## AIS-242f43cf2627

<!-- AIS-242f43cf2627 -->
Names exactly as in the brand guide (AIS Vision Systems, AIS Group, OPTICAIS, AIS Hopper, AIS KARIKÓ, AIS REV 360…); keep "AIS REV 360" and "a 360°" on one line (non-breaking space).

Source: plugin/skills/presentation/SKILL.md:75.

## AIS-f20bccb12909

<!-- AIS-f20bccb12909 -->
Rebuilding a deck: every original text, figure and name stays, and every original picture that integrates; add nothing the original does not have.

Source: plugin/skills/presentation/SKILL.md:76.

## AIS-177e763642ad

<!-- AIS-177e763642ad -->
Real photos, real screens, our exterior machine views and product renders first; a generated picture only if it passes `brand-review` at its final size. Never a machine's internals, never another model's picture. Customer material with client logos blurred; client logos on a `logos` slide only where AIS may name the customer.

Source: plugin/skills/presentation/SKILL.md:77.

## AIS-0d3d2abdd0ae

<!-- AIS-0d3d2abdd0ae -->
Never repeat a picture in a deck (the build fails repeats). Round-label wine renders only. Covers: use the sharpest available original of the same subject; always fill the panel even when enlargement is needed (warn). Never a video frame or a flat-label wine render.

Source: plugin/skills/presentation/SKILL.md:78.

## AIS-040d7dbda0d6

<!-- AIS-040d7dbda0d6 -->
Another agent working in `pieces/decks/`: write your own section and deck folder; never overwrite an approved deck unless asked.

Source: plugin/skills/presentation/SKILL.md:82.

## AIS-7a3805ad315c

<!-- AIS-7a3805ad315c -->
`missing file:` from the build: picture paths are relative to the plugin folder, not to the content file.

Source: plugin/skills/presentation/SKILL.md:83.

## AIS-0366d6c23bec

<!-- AIS-0366d6c23bec -->
`no layout "…"`: only the layouts above exist; pick the closest one rather than adding a layout.

Source: plugin/skills/presentation/SKILL.md:84.

## AIS-89792b959261

<!-- AIS-89792b959261 -->
The PDF, PNGs and PPTX need Chromium and the plugin's Python (Pillow, python-pptx; `npm run setup`). Without them the HTML is still written with `--html-only`: report it.

Source: plugin/skills/presentation/SKILL.md:85.

## AIS-cb02a1f183c6

<!-- AIS-cb02a1f183c6 -->
Ten web text styles (tokens `--ais-text-*`). Document, datasheet, slide and email sizes are in the guide table (slides: 54/32/20 pt; email: Arial 18 px bold / 14 on 21 px).

Source: brand decisions.

## AIS-670305b84b76

<!-- AIS-670305b84b76 -->
**The logo signs, it does not lead.** Keep it small: about 20 mm on A4, 18 mm on a business card, 100 px in an email signature, 140 px on a 1920 slide. Minimums: AIS Group 72 px (15 mm in print), AIS Vision Systems 100 px (18 mm), Rosepetal 130 px (24 mm).

Source: brand decisions.

## AIS-5d3dd06a9631

<!-- AIS-5d3dd06a9631 -->
**Original texts stay; plant photos are cleared:** rebuilds keep every claim, figure and product name from marketing's originals (e.g. CE marking, 2-year warranty, 24/7 support, European plants in the biscuits deck; 45/25/20/10 sector split in the corporate deck; product names as written). Do not drop or soften them as «unverified». AIS has permission for the plant and customer photos it holds; use them (customer brands still blurred).

Source: brand decisions.

## AIS-a178efa5e99c

<!-- AIS-a178efa5e99c -->
**One pattern everywhere:** the printed-card reference geometry (R = short side / 12.5, hairline 1.6/550 of the short side, white 12 % + one 45° light band, smoothstep fade from one corner). Single generator `studio/print/pattern.py` (its `dots` and `facets` variants are not adopted). Wired into print (`print/assets/hex-printed-*.svg`), decks (`presentations/template/assets/hex-printed-cover.svg`, slide scale), posts (`engine/stage.html` hexes()), business cards and letterhead (`kit-2026/assets/hex-card.svg`, `hex-letter.svg`). The guide's marketing kit (`public/kit/kit.css` `.hexfield`: banners, rollup, case study, announcement, partner datasheet, LinkedIn banners) uses `public/kit/hex-field-{tr,tl,br,bl}.svg` from the same generator; the old tiled `hex.svg` + CSS mask is retired. Never draw a different hexagon grid by hand.

Source: brand decisions.

## AIS-c96cb6f2efea

<!-- AIS-c96cb6f2efea -->
Software screenshots sit in the browser mockup frame. No full-screen expand button: the images are decoration. Same aspect ratio on mobile, just smaller. Crop at panel borders. Never show test or admin data (for example «BYPASS ACTIVE», «User: admin», test template names).

Source: brand decisions.

## AIS-d93e0b643596

<!-- AIS-d93e0b643596 -->
case study, announcement, roll-up, 16:9 presentation, infographic, interactive walkthrough.

Source: brand decisions.

## AIS-aa06807e2c36

<!-- AIS-aa06807e2c36 -->
**Before-and-after deck** (`npm run deck` → `studio/out/presentation/before-after.pptx`) must be on brand and compare like with like (same piece type and subject).

Source: brand decisions.

## AIS-af2c28512679

<!-- AIS-af2c28512679 -->
| Deck or slides for a meeting | `presentation` (`studio/work/presentations/template/`) |

Source: brand decisions.

## AIS-b4d67b4b5520

<!-- AIS-b4d67b4b5520 -->
| Before-and-after comparison deck | `npm run deck`; local files by default |

Source: brand decisions.

## AIS-47508f095e49

<!-- AIS-47508f095e49 -->
**Guion de marca** is extracted in `assets/brand-intros/`: the official AIS logo guideline PDF, the Intro AIS and Intro Rosepetal videos, the AIS Vision general presentation template (.pptx), and an internal Hopper quote (.docx, not for publishing). Check the studio's kit and slide templates against the logo guideline and the corporate .pptx; the intro videos are real footage for `brand-video` once catalogued with `asset-library`.

Source: brand decisions.

## AIS-ce3e96f67a42

<!-- AIS-ce3e96f67a42 -->
Simple is not empty: white space is deliberate and balanced, never a leftover band or a small product floating in white. Fix by layout (pictures fill frames, larger type), never by stretching lists or adding text. Engine limits: print fails above 25 mm empty, decks at about 15 % of slide height, posts when the subject covers under about 55 % of its band.

Source: brand decisions.

## AIS-e91d7ac54419

<!-- AIS-e91d7ac54419 -->
Decks: one grid, three or four type sizes, one message per slide (split rather than shrink, every claim kept); the serious blue-and-white «Hoy» mix with some hexagons; close on «Gracias» with web, phone, LinkedIn and YouTube.

Source: brand decisions.

## AIS-8f62bd87b319

<!-- AIS-8f62bd87b319 -->
Reuse every original picture that can be integrated; drop one only if it cannot (low ppi at shown size, old logo or UI, watermark, duplicate) and say why. Never turn a slide text-only by dropping its picture. Use the strongest published figure where sources disagree; brand-guide names replace the originals' spellings.

Source: brand decisions.

## AIS-68e573c829a9

<!-- AIS-68e573c829a9 -->
const contentPath = path.resolve(process.argv[2] || '');

Source: plugin/decks/verify.mjs:15.

## AIS-0952c13de538

<!-- AIS-0952c13de538 -->
const out = path.dirname(contentPath);

Source: plugin/decks/verify.mjs:16.

## AIS-ed9f18f255c4

<!-- AIS-ed9f18f255c4 -->
const url = pathToFileURL(path.join(out, JSON.parse(fs.readFileSync(contentPath, 'utf8')).meta.file + '.html')).href;

Source: plugin/decks/verify.mjs:17.

## AIS-c23fd503453b

<!-- AIS-c23fd503453b -->
const vdir = path.join(out, 'build', 'verify');

Source: plugin/decks/verify.mjs:18.

## AIS-2fa8fce6ab29

<!-- AIS-2fa8fce6ab29 -->
const settle = async page => page.evaluate(async () => {

Source: plugin/decks/verify.mjs:23.

## AIS-cc2424fce3ba

<!-- AIS-cc2424fce3ba -->
const browser = await chromium.launch({headless: true, args: ['--disable-dev-shm-usage', '--disable-gpu']});

Source: plugin/decks/verify.mjs:29.

## AIS-f53a56ba0c26

<!-- AIS-f53a56ba0c26 -->
const errors = [];

Source: plugin/decks/verify.mjs:30.

## AIS-e163f95d9558

<!-- AIS-e163f95d9558 -->
const watch = (page) => {

Source: plugin/decks/verify.mjs:31.

## AIS-4360311ebd53

<!-- AIS-4360311ebd53 -->
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`console ${m.type()}: ${m.text()}`); });

Source: plugin/decks/verify.mjs:32.

## AIS-0f2e4c5a3483

<!-- AIS-0f2e4c5a3483 -->
page.on('pageerror', (e) => errors.push('page error: ' + e.message));

Source: plugin/decks/verify.mjs:33.

## AIS-36af943624e5

<!-- AIS-36af943624e5 -->
page.on('request', (r) => { if (!/^(file|data|blob|about):/.test(r.url())) errors.push('non-local request: ' + r.url()); });

Source: plugin/decks/verify.mjs:34.

## AIS-71d6e01a3fa7

<!-- AIS-71d6e01a3fa7 -->
const tag = (s, b) => `${String(s + 1).padStart(2, '0')}-${String(b).padStart(2, '0')}`;

Source: plugin/decks/verify.mjs:37.

## AIS-45ffceed97f1

<!-- AIS-45ffceed97f1 -->
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});

Source: plugin/decks/verify.mjs:39.

## AIS-e19a8deaf485

<!-- AIS-e19a8deaf485 -->
const beats = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s) => Math.max(0, ...[...s.querySelectorAll('[data-beat]')].map((e) => +e.dataset.beat))));

Source: plugin/decks/verify.mjs:44.

## AIS-e1e25c769584

<!-- AIS-e1e25c769584 -->
const positions = beats.flatMap((n, s) => Array.from({length: n + 1}, (_, b) => [s, b]));

Source: plugin/decks/verify.mjs:45.

## AIS-9f44dc87e604

<!-- AIS-9f44dc87e604 -->
const hash = async () => page.evaluate(() => location.hash);

Source: plugin/decks/verify.mjs:46.

## AIS-2b92c3b1c907

<!-- AIS-2b92c3b1c907 -->
const h = await hash(), want = '#' + (s + 1) + (beats[s] ? '.' + b : '');

Source: plugin/decks/verify.mjs:50.

## AIS-f64398289b29

<!-- AIS-f64398289b29 -->
if (h !== want) errors.push(`walk: expected ${want}, the URL says ${h}`);

Source: plugin/decks/verify.mjs:51.

## AIS-6d6ec17837dd

<!-- AIS-6d6ec17837dd -->
if (k < positions.length - 1) { await page.keyboard.press('PageDown'); await settle(page); }

Source: plugin/decks/verify.mjs:53.

## AIS-786d3f5e24df

<!-- AIS-786d3f5e24df -->
if (k > 0) { await page.keyboard.press('PageUp'); await settle(page); }

Source: plugin/decks/verify.mjs:58.

## AIS-b65681bc60a7

<!-- AIS-b65681bc60a7 -->
const direct = await browser.newPage({viewport: {width: 1920, height: 1080}});

Source: plugin/decks/verify.mjs:60.

## AIS-c9461e753945

<!-- AIS-c9461e753945 -->
const audit = await browser.newPage({viewport: {width: 1920, height: 1080}});

Source: plugin/decks/verify.mjs:70.

## AIS-a43a2258b165

<!-- AIS-a43a2258b165 -->
(await audit.evaluate(measureRhythm, RHYTHM)).forEach((r, k) => r.forEach((x) => errors.push(`spacing, slide ${k + 1}: ${x}`)));

Source: plugin/decks/verify.mjs:74.

## AIS-378aa959c250

<!-- AIS-378aa959c250 -->
const bands = await audit.evaluate(measureBands);

Source: plugin/decks/verify.mjs:75.

## AIS-963fdc69e3fb

<!-- AIS-963fdc69e3fb -->
bands.forEach((band,k)=> { if (!band.exempt && band.gap>.15) errors.push(`empty area, slide ${k+1}: ${(band.gap*100).toFixed(1)}% exceeds 15%`); });

Source: plugin/decks/verify.mjs:76.

## AIS-9697ad6f245e

<!-- AIS-9697ad6f245e -->
const alignment = await audit.evaluate(measureAlignment);

Source: plugin/decks/verify.mjs:78.

## AIS-f1db2a4fddb0

<!-- AIS-f1db2a4fddb0 -->
alignment.forEach((row) => row.failures.forEach((x) => errors.push(`alignment, slide ${row.slide}: ${x}`)));

Source: plugin/decks/verify.mjs:79.

## AIS-30ee27efee24

<!-- AIS-30ee27efee24 -->
const foot = footReport(await audit.evaluate(measureFoot));

Source: plugin/decks/verify.mjs:82.

## AIS-c04cd4b153ad

<!-- AIS-c04cd4b153ad -->
foot.fails.forEach((x) => errors.push(x));

Source: plugin/decks/verify.mjs:83.

## AIS-a94d97faa257

<!-- AIS-a94d97faa257 -->
const report = execFileSync(process.env.AIS_PYTHON || 'python3', ['-I', '-c', `import json,sys,os,glob

Source: plugin/decks/verify.mjs:90.

## AIS-0ff15710afd0

<!-- AIS-0ff15710afd0 -->
const nativeAt = process.argv.indexOf('--pptx-pdf');

Source: plugin/decks/verify.mjs:116.

## AIS-892de28b37f7

<!-- AIS-892de28b37f7 -->
if (nativeAt >= 0) {

Source: plugin/decks/verify.mjs:117.

## AIS-84571b3efc12

<!-- AIS-84571b3efc12 -->
catch (e) { errors.push('native PPTX baseline check failed: ' + String(e.stdout || e.message)); }

Source: plugin/decks/verify.mjs:119.

## AIS-c1c4d48be08a

<!-- AIS-c1c4d48be08a -->
const all = [...new Set(errors)];

Source: plugin/decks/verify.mjs:121.

## AIS-6b299528ae41

<!-- AIS-6b299528ae41 -->
const text = (all.length ? all.join('\n') + '\n' : '') + report + '\nfoot, measured:\n' + footText + '\n';

Source: plugin/decks/verify.mjs:122.
