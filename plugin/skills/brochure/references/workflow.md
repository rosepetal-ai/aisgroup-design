# brochure production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder. Production rules: [production-rules.md](../../_shared/references/production-rules.md).

Sales pieces that beat the original marketing PDFs: more and better real pictures, calm pages, every brochure built from the same components. The design references are the current pieces in `pieces/brochures/` (master: `pieces/brochures/compact/compact.es.html`).

**This is the only brochure, catalogue, one-pager and datasheet system.** Datasheets: the sheet HTML `pieces/datasheets/<key>/<key>.es.html` is the source (reference `pieces/datasheets/cables/cables.es.html`): edit it, export with `print/render.mjs`, look at the PDF, then `npm run mcp:pin`, which re-extracts `datasheets/data.json` and re-pins the sheet so the MCP accepts it. Never edit `data.json` by hand. The generators and the rules each one enforces are listed in [the shared workflow](../../_shared/WORKFLOW.md) (*Brand rules the generators check*). Never use a hexagon not drawn by `print/pattern.py` or the brochure, catalogue and datasheet pages in the guide's kit: those layouts are rejected. Don't copy from them or show them.

**The frame is fixed, always like the accepted examples.** Every brochure, catalogue and datasheet copies the cover head (brand blue, hexagon field, white logo, white title and lede), the cover icon row, the page numbers and the closing contact band verbatim from its reference (`pieces/brochures/hopper/hopper.es.html`, datasheets `pieces/datasheets/cables/cables.es.html`), with no local styles for them. A redesign, a «make it new» or a «do what marketing had» changes the content, the pictures and the inner page layout, never the frame. `print/render.mjs` fails a piece that leaves it (*off the family frame*: cover not brand blue, no white logo or hexagon field, title not white at 34 pt, no contact band, an extra brand-blue block). Before you deliver, put page 1 beside Hopper's page 1: if they don't read as the same family, it is wrong, whatever the checks say.

## Read when needed

- `references/print-system.md`: the files, every component, the page sets, shorter pieces and other languages. Read it before building or rebuilding a piece.
- `references/mcp-editing.md`: editing the seven Spanish technical sheets and any piece through `edit_piece` and `export_piece`.

## Steps

1. **Content.** Start from the accepted piece in `pieces/brochures/<piece>/` and its published example; marketing's original PDF only when the person supplies it. Read it with pdftotext; to see it, check cached previews first or rasterise under the shared wrapper with `pdftoppm -r 50`. Keep every fact and every detection; restore the original's figures (100 % de la producción, cadences, sizes, 21 CFR Part 11…) using the better-sourced AIS figure for the exact model; record alternatives privately. The current chosen figures are in the shared workflow. Drop superlatives ("impecable", "de vértigo", "casi nulos") and claims without conditions. Names exact: AIS Vision Systems, AIS Hopper, AIS REV 360 STANDARD / COMPACT / PHARMA, AIS REV 360 Cables, AIS KARIKÓ, OPTICAIS, AIS Vacuum, Rosepetal, TrazAIS. Sentence case, no full stop at the end of titles, Spanish number format from the guide ([Localisation](../../communications/references/localisation.md)): no separator up to four digits, a non-breaking space from five (7200, 30 000), dates 10/2028.
2. **Pictures: gather everything, then choose.** Make contact sheets and look at every candidate:
   - The piece's own `assets/` folder. Verdicts, crops and blur regions for pictures taken from marketing's originals: [original-images.json](original-images.json).
   - `library/catalog.json` and `library/media/**` (not `rejected`); blurred originals in `library/media/originals/`.
   - The AIS website's media (aisvision.com product and journal images).
   - Detection tiles: `library/media/3d/renders/<machine>/det/*_tile.jpg` (cropped on the defect). Ask the brand team for a missing tile; until it exists the check goes in `.options` as an icon, never a stand-in picture of another defect.
   - Machine pictures (exterior, guards closed): `library/media/3d/machines/<machine>/` (finals) and `library/media/3d/machine-previews/` (700 px: too small for print, note it). Alt text describes the machine like a photo; it never says render, CAD or 3D.
   - Video frames (`ffmpeg -ss t -i f -frames:v 1`) when sharp and free of overlays.
   Rules: real photos, screens and footage, our exterior machine views, product stills and detection tiles first; a generated or composited picture only if it passes `brand-review` step 1 at print size (no garbled text, smeared detail, impossible light, CGI cleanrooms, wrong machine); never show one model as another; customer material is allowed with client brands, wineries, appellations and logos blurred (soft Gaussian over every label, nothing invented; unblurred originals stay in `library/media/originals/`); never repeat a picture within a document, even under another name (the checker fails it); round-label wine renders only (`pieces/datasheets/standard/assets/wine_det-*_tile.jpg`; the old flat-label set fails by hash); copy what you use into the piece's `assets/`.
   - **Rebuilds follow the original.** Same image subjects and density as marketing's original; a page or product (e.g. C8 GlobalVision) appears only if the original has it.
3. **Build** from `print/templates/machine.es.html` (change `../` to `../../shared/`) or from the closest existing piece.
4. **Render** (one Chromium job at a time, always under the lock): `python3 skills/_shared/scripts/safe_render.py -- node print/render.mjs pieces/brochures/<piece>/<name>.es.html`. It must pass: no overflow, 6 mm or more above footer and band, no picture enlarged past 1.25× or used twice, cover 240 ppi or more and not a video frame (unless the only real picture is soft: mark it `data-cover-ok="<why>"` and tell the person), no flat-label wine, nothing under 8.5 pt, no review wording (render, CAD, 3D, middle-dot separators), and in Spanish and Catalan no point in thousands (30 000, never 30.000). It reports ppi; under 150 is soft in print: use a better original or note it.
5. **Look** at every preview at full size, then compare with sibling pieces:
   - Hexagon icons use the shared `.hx` centring rule. Keep the SVG viewport centred; digit-only optical padding must not affect icons. The exporter checks each icon centre within 0.1 CSS px. Remove redundant headings above named detection tiles. Necessary equipment/software/options headings use ink h3 text at 11 pt and weight 500, without tracking; no old small blue p.sub lines.
   - Every tile shows its defect; crops keep machines, screens and labels whole.
   - Nothing letterboxed in a pale panel unless it is a deliberate cut-out; no dead band over 25 mm; no widow in a title.
   - Same components, spacing and voice as the other pieces.
   - Ready to publish: scan text and alt text for internal production notes (render, test, pendiente, borrador, confirmar); keep approved AIS demo product identities, and check pictures for identifying client marks.
6. **Deliver** the reviewed local PDF with its editable HTML or data, assets and shared components. Record what was checked and the remaining gaps in `RESULTS.md`. Never mark a file as final or upload it unless asked.

## Past mistakes, do not repeat

- Small pictures floating in big pale panels; lists stretched to fill a page; hairlines everywhere. Pages must look calm and full.
- Repeating a picture in the same document; a machine brochure that never shows the machine.
- Using the Standard model photo as COMPACT or PHARMA; using generated cleanroom images.
- Test renders (400 px, noisy) shipped as tiles; blurred labels that are still legible.
- Copy that says "speed and diameters per project" next to a restored "hasta 300 m/min".
- Starting extra agents or renderers the session doesn't allow.

Print body heading spacing is in print/assets/editorial.css; retain that link when copying a piece. It preserves specification-table spacing while the existing system owns closing bands and their checks.
