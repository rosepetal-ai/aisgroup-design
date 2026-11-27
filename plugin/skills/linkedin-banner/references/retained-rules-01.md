# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-a7dd41addd04

<!-- AIS-a7dd41addd04 -->
The banners are HTML artboards in `brand/kit/linkedin-banners.html` (a copy of the guide's kit page), exported at 2× by `npm run kit`. The finished set is in the guide's Marketing kit, under LinkedIn banners: start from it.

Source: plugin/skills/linkedin-banner/SKILL.md:11.

## AIS-be2d6438bcf5

<!-- AIS-be2d6438bcf5 -->
The company page cover and the team's profile banner for each brand with a LinkedIn page: AIS Vision Systems, AIS Group, Rosepetal.

Source: plugin/skills/linkedin-banner/SKILL.md:15.

## AIS-fd20bc6dd256

<!-- AIS-fd20bc6dd256 -->
**Ground and pattern:** brand blue `#17356E` (`.g-blue`) and the hexagon landscape (Rolling, white on blue), `brand/kit/linkedin-landscape-company.svg` or `-personal.svg` as `<img class="land">` over the whole artboard. Each field is drawn for these word and logo positions: it rises on the right with thin, quiet lines; opacity masks soften the horizon and left edge. A fully clear 24 px inner zone and a broad feathered clearing keep the words and logo on plain blue. The shared surface geometry stays intact. Never a photograph, a gradient, the circuit patterns or the plain corner field on this set.

Source: plugin/skills/linkedin-banner/SKILL.md:17.

## AIS-51d27795bc54

<!-- AIS-51d27795bc54 -->
**One line, nothing above it:** white, weight 500, one phrase per line, ending with a full stop. AIS Vision Systems: "Engineering peace of mind." (the company line, in English on every version, never translated). AIS Group: "Engineering the autonomous factory." Rosepetal: "Computer vision. Ready for production." (each site's headline). No overline, eyebrow, tagline or second line.

Source: plugin/skills/linkedin-banner/SKILL.md:18.

## AIS-a93252e3bf8b

<!-- AIS-a93252e3bf8b -->
**Logo:** none on company covers (LinkedIn lays the page logo over the lower left). Profile banners: the brand's white logo under the words at x 664, bottom 64 px; AIS Vision Systems 150 px wide, AIS Group 120 px, Rosepetal 200 px.

Source: plugin/skills/linkedin-banner/SKILL.md:19.

## AIS-c1ae7fcb8b38

<!-- AIS-c1ae7fcb8b38 -->
| Banner | Size (export 2×) | Covered | Words |

Source: plugin/skills/linkedin-banner/SKILL.md:23.

## AIS-c6d1c9e4a642

<!-- AIS-c6d1c9e4a642 -->
| Company | 1512 × 256 (3024 × 512), LinkedIn's Page spec, at most 3 MB | page logo about x 0–410 in the lower half; phones show about x 244–1268 and put the logo over x 290–490 at the foot | from x 520 to before x 1080, top 40 px, 58 px; the landscape rises on the right and fills the band under them |

Source: plugin/skills/linkedin-banner/SKILL.md:25.

## AIS-1365bde0fb1b

<!-- AIS-1365bde0fb1b -->
| Profile | 1584 × 396 (3168 × 792) | profile photo about x 0–634 in the lower 60 %; phones keep about x 200–1384 | from x 664, top 64 px, 60 px |

Source: plugin/skills/linkedin-banner/SKILL.md:26.

## AIS-b058fb5681be

<!-- AIS-b058fb5681be -->
The kit page has two reference artboards with these zones drawn (`zones-company`, `zones-personal`): check every banner against them.

Source: plugin/skills/linkedin-banner/SKILL.md:28.

## AIS-0bd647ea9807

<!-- AIS-0bd647ea9807 -->
**Which banner?** Company or profile, and which brand. A new line needs approved copy; otherwise keep the brand's line.

Source: plugin/skills/linkedin-banner/SKILL.md:32.

## AIS-8cb99bdf112d

<!-- AIS-8cb99bdf112d -->
**Artboard.** Edit `brand/kit/linkedin-banners.html`. Keep the classes that exist (`.co`, `.pe`, `.hl`, `.land`, `.logo`); don't invent new styles. A longer line or a moved logo needs a redrawn landscape: ask the design team rather than letting cells run behind the words.

Source: plugin/skills/linkedin-banner/SKILL.md:33.

## AIS-81e5e2a21f33

<!-- AIS-81e5e2a21f33 -->
**Export** (Chromium, under the lock): `python3 skills/_shared/scripts/safe_render.py -- npm run kit -- linkedin-banners`. It writes `out/kit/preview/linkedin-banners-<id>.png` at 2× and runs the guide's brand and contrast checks.

Source: plugin/skills/linkedin-banner/SKILL.md:34.

## AIS-225687b90075

<!-- AIS-225687b90075 -->
**Look.** Read each PNG at full size, then mock it on a page or profile at desktop and phone width (company cover at 1128 px wide with a 120 px logo tile at the lower left; phone at 390 px, cropped to about 4:1; profile at 804 px with a 152 px photo; phone cropped to about 3:1). Every word readable and clear of the logo or photo, the landscape never behind the words or the profile logo and still visible on the phone crop.

Source: plugin/skills/linkedin-banner/SKILL.md:35.

## AIS-b6ca1d6e418d

<!-- AIS-b6ca1d6e418d -->
**Hand over** the 2× PNGs, named for people: `Banner <brand> EN.png`, `Banner personal <brand> EN.png`.

Source: plugin/skills/linkedin-banner/SKILL.md:36.

## AIS-478f75dbc818

<!-- AIS-478f75dbc818 -->
An overline or a second line above or under the words.

Source: plugin/skills/linkedin-banner/SKILL.md:40.

## AIS-710bad5a574c

<!-- AIS-710bad5a574c -->
The words translated, reworded or set in capitals.

Source: plugin/skills/linkedin-banner/SKILL.md:41.

## AIS-aed0a0ab8634

<!-- AIS-aed0a0ab8634 -->
Words under the page logo on phones (they start before x 520).

Source: plugin/skills/linkedin-banner/SKILL.md:42.

## AIS-26c3243b381c

<!-- AIS-26c3243b381c -->
A logo on a company cover, doubling LinkedIn's page logo.

Source: plugin/skills/linkedin-banner/SKILL.md:43.

## AIS-c6f93e4131de

<!-- AIS-c6f93e4131de -->
Hexagon cells behind a word or the profile logo (a longer line without a redrawn landscape).

Source: plugin/skills/linkedin-banner/SKILL.md:44.

## AIS-9b37820a0bc2

<!-- AIS-9b37820a0bc2 -->
Keep the existing template and its default background unless a pattern is requested. In `edit_piece`, update the shot field `pattern`; `none` restores the default. Social recipes accept `pattern` at the recipe or shot level: `hexagon-landscape-rolling`, `hexagon-landscape-dramatic`, `circuit-globe`, `circuit-traces`, or `scan-profiles`. The colourway follows the shot’s ground (white, section grey, brand blue or deep blue) and the size its format (4:5, 1:1 or 16:9); banner sizes are rejected on posts and carousels. Find exact SVGs or a pattern zip with `search_library` (query `linkedin` and the pattern name), then `get_asset`. Never place the field behind words, logos or photos.

Source: plugin/skills/linkedin-banner/SKILL.md:48.

## AIS-3d674060216b

<!-- AIS-3d674060216b -->
The approved six kit banners retain Rolling. To make a requested banner variant, use `patternFile` in `engine/linkedin-patterns.mjs` with surface `linkedin-banner` and size `1584x396` or `1512x256`; keep the existing artboard and safe zones. Reproduce fields with `python3 print/linkedin_banner_fields.py`; pattern downloads with `node print/linkedin_patterns.mjs` under the shared resource supervisor. These scripts live in the repository and need no review-cache files. Print, Office and decks continue to use `print/pattern.py`.

Source: plugin/skills/linkedin-banner/SKILL.md:50.
