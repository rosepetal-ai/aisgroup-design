# Editing brochures and technical sheets with the studio tools

The tools edit a working copy; the file in `pieces/` stays as it is. Say so when you hand over, and offer to apply the change to the source too.

## Brochures, catalogues and one-pagers

1. `edit_piece copy`: `pieceId` is your own short name (e.g. `folleto-hopper`), `source` the HTML, e.g. `pieces/brochures/hopper/hopper.es.html`.
2. `edit_piece slots`: every text, picture and alt text, with its page and id.
3. `edit_piece update`: `slotChanges` with only the slots to change, and the `digest` from step 2 as `expectedDigest`. The reply validates the piece (`valid`, `errors`); fix any error before exporting.
4. `export_piece enqueue render-pdf` (`saveAs` copies the PDF to the working folder), then `status` until it finishes. Open every page PNG it returns.

A change the slots can't make (a new page, a different layout) is an edit to the source HTML with this skill, then steps 1 to 4.

## The seven Spanish technical sheets

`source` is `datasheets/data.json#<key>` (`hopper`, `kariko`, `cables`, `compact`, `pharma`, `standard`, `opticais`). Read the `print:<key>-technical-sheet` descriptor first. `printChanges` cover the cover summary under the model name (`cover_headline`), the inspection title and lead, technical and software text and table rows, and the cover, screen and technical images. The model name, cover facts, inspection tiles, layout and language are fixed. Copy that doesn't fit is refused: shorten it, or change the layout in the sheet HTML; never shrink type or drop content. Export with `render-pdf`.

The sheet HTML `pieces/datasheets/<key>/<key>.es.html` is the source; `datasheets/data.json` is extracted from it and pinned. After a reviewed edit to a sheet, look at its PDF, then re-extract and re-pin with `npm run mcp:pin`; until then the tools refuse that sheet.

## Every piece

- An export that comes back `blocked` rendered nothing: tell the user why (`reason`) and stop.
- Passing checks is not a review: look at every page before calling it done.
