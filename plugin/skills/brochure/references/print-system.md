# The print system

| Path | What |
| --- | --- |
| `print/system.css` | The only stylesheet. Components below. Edit design here, once, for all pieces |
| `print/assets/` | Inter, AIS white logo, hexagon fields, `icons.js` (130 Lucide icons: `<i data-i="name">`) |
| `print/render.mjs` | Checks and exports PDF and `previews/<name>-N.png` (110 ppi) |
| `print/templates/machine.es.html` | Three-page structure with slots and Conservas content; must be adapted and given assets |
| `pieces/shared` | Symlink to `print/` (pieces link `../../shared/…`) |
| `pieces/brochures/<piece>/` | One folder per piece: HTML, `assets/`, PDF, `previews/` |

Components (nothing else; inline custom properties only: `--n --ar --fx --fy --h --y --len --c`):
- **Covers are impeccable**: the hero is the sharpest, best-composed image the piece has, printing at 240 ppi or more, never a video frame, never soft, cluttered or motion-blurred. Machines on covers show the machine working, with its product on the line. If no such image exists, ask the brand team for one before building the cover; `print/render.mjs` fails a cover under 240 ppi or named or catalogued as a video frame.
- **Cover**: `.cover-head` (logo 20 mm AIS, `.logo.rosepetal` 38 mm; h1 product name, one paragraph that ends with the headline facts) + `.hero` (real photo, full bleed, `--fx/--fy`) + `.cover-bottom .facts` (three `.fact`: hexagon icon, label, one line).
- **Inner page**: `.page-content`, a factual `h2` with at most one `.lead`, `.block` sections and `.foot`. Omit redundant detection-group labels; necessary table/options subheads are ink `h3.editorial-heading` at 11 pt, weight 500. No eyebrows or running headers.
- **Pictures**: `.tiles` (one picture per detection, name under it; `--n` per row, `--ar` aspect, `--fx/--fy` to keep the defect in frame), `.photo` (`--h`, `.grow`, `.cutout`), `.split` (`.wide`, `.rev`).
- **Lists**: `.specs` (two columns, square bullet), `.options` (hexagon icon and label, `--n`), `.note` (qualifier, pale).
- **Product zones**: `.application` > `.zones-figure` (image + `.key` at `--y`) + `.zone` titles level with their keys.
- **Last page**: `.page.last`, `.band` after `</main>` (contact: "Envíanos muestras…", web, phone; Rosepetal: "Solicita una demo", email, web).

Page set for a machine: 1 cover, 2 "Qué inspecciona" (every detection a picture tile; checks with no picture as `.options` icons), 3 "Equipo y software" (machine or inspection photo in `.split`, `.specs`, `.options`, band). Catalogues: cover, an applications page (`.application`), one page per system on the page 2 and 3 patterns, benefits and band.

**Shorter pieces.** A "one-page" or flyer request: use the number of sides asked for; if unspecified, one A4 side. A two-sided sheet uses the cover plus one `.page.inner.last` with the tiles, key specs and band. A single A4 side uses one `.page.inner.last`: h2 + lead, one `.photo` of the machine, the detection `.tiles`, the band. Never squeeze three pages of content onto one; cut to the strongest detections and record omissions privately.

**Other languages.** Same file structure, `<name>.<lang>.html` with `<html lang="en">`, every word written natively (British English, not word for word), band in that language ("Send us samples of your containers", alt text too). English numbers: 7,200 and 30,000, dates 10/2028; units with a space (500 ml). Publication copy: `AIS <Product> EN.pdf`.
