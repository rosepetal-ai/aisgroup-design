# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-59543377d1ed

<!-- AIS-59543377d1ed -->
Decks are content files rendered by one engine, the approved «Hoy + azul» system: `decks/` (`build.mjs`, `layouts.mjs` and `layouts.css` for the layouts, `bands.mjs` for the spacing and empty-band checks, `verify.mjs`, `runtime/` for the stage and presenter, `to_pptx.py`, `assets/` with Inter, logos, Lucide icons, the hexagon fades, client logos and pictures). It is the only presentation generator. The approved decks are the references: `pieces/decks/corporate-2026/` (General 2026), `automotive/`, `beverage/`, `biscuits/`, `canning/` and `wine/`. Reusable sections are in `decks/sections/*.es.json`.

Source: plugin/skills/presentation/SKILL.md:11.

## AIS-09b1155d3dde

<!-- AIS-09b1155d3dde -->
Type, a closed scale in Inter: display 120, headline 76, lead/list name 44, body 38 (never under 36), label 28, meta 22 (slide number only). Sentence case.

Source: plugin/skills/presentation/SKILL.md:17.

## AIS-ce0830b53005

<!-- AIS-ce0830b53005 -->
The closing is «Gracias» with web, phone, LinkedIn and YouTube (`contacts[{k, v}]`), the logo top right.

Source: plugin/skills/presentation/SKILL.md:19.

## AIS-3f9243d2dcda

<!-- AIS-3f9243d2dcda -->
Writes `<file>.html` (one file, CSS and JS inline, with `media/` beside it), `slides/NN.png`, `<file>.pdf` (vector text) and `<file>.pptx` (Inter text boxes, re-croppable pictures) next to the content file, and `build/checks.txt`. It must end in `checks passed`, or it exits 1 listing: text under its floor size, outside the slide or its box, over other text or a picture, or inside the top and bottom margins; a gap outside the rhythm (label to value 8, caption 16, item 24, block 40, headline to content 64) or text off the column grid; an empty band over 15 % of the slide height; the slide number and footer out of place; a non-cover picture enlarged past 1.3× (cover enlargement warns), missing or repeated; the hexagon fade near text or over a picture; production words (render, CAD, 3D, middle-dot separators, →, TODO, pendiente, borrador); PPTX with library metadata or file names as alt text. In Spanish and Catalan a point in thousands (30.000) stops the build before any output: write 30 000 (non-breaking space) and 7200. `--html-only` writes just the HTML (no Chromium); `--slides 1,3,4` builds a selection.

Source: plugin/skills/presentation/SKILL.md:44.

## AIS-ad77e54cc37d

<!-- AIS-ad77e54cc37d -->
| `closing` | «Gracias», brand blue | `title`, `contacts[{k, v}]` (Web, Teléfono, LinkedIn, YouTube) |

Source: plugin/skills/presentation/SKILL.md:68.
