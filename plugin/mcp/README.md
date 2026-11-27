# AIS Group Design studio MCP

A local stdio MCP server that makes and edits AIS Group marketing pieces (posts, carousels, brochures, catalogues, technical sheets, decks, stationery) with the studio's own generators. It plans, edits working copies, checks them against the brand rules and exports them. The client's model writes the words and reviews the result; the server never calls a model, opens a network port or publishes anything.

The plugin starts it (`.claude-plugin/plugin.json` runs `mcp/start.mjs`). To run it in another MCP host:

```json
{ "mcpServers": { "ais-studio": { "command": "node", "args": ["<plugin folder>/mcp/start.mjs"] } } }
```

## Tools

| Tool | What it does |
| --- | --- |
| `plan_piece` | Start here. From the request (and any supplied files as `media`), returns the piece type, the instructions to read, the closest templates and library pictures. Makes nothing. |
| `studio_status` | What the studio makes, what it can't, and what setup is missing. |
| `search_library` | Skills, templates or library assets (the catalogue and the curated photos in `brand/library/`, by their clean names), filtered by product, status, type, origin and language; 8 per page. |
| `read_instructions` | One instruction, template or supplied text that `plan_piece` or `search_library` returned, 3000 characters at a time. |
| `get_asset` | One library asset: review status and why, origin, size and its `path` (or that the file is missing). |
| `inspect_media` | A supplied photo or video: metadata, or one preview image of at most 960 px. |
| `edit_piece` | Works on a copy, never on the source: `copy`, `inspect`, `slots`, `update`, `validate`. Posts and carousels change by field (`changes`), technical sheets by `printChanges`, brochures, catalogues and decks by slot (`slotChanges`). Every update needs the `digest` of the previous reply as `expectedDigest`, and validates. |
| `export_piece` | `enqueue` runs the generator: `render-png` (a post), `render-pdf` (a carousel, brochure, sheet or deck: PDF and page PNGs, plus PPTX for decks), `render-html`. `saveAs` copies the file to the working folder. `status` waits up to 25 s for the job; also `list` and `cancel`. |

Resources: `ais://studio/status` and `ais://studio/chunk/{ref}/{offset}`.

## Replies

Every reply is one JSON object, as `structuredContent` and as text:

- Success: `{ ok: true, …result, next }`. `next` is one line saying what to call after it.
- Refusal (`isError: true`): `{ ok: false, error, fix }`. `fix` says what to do or what to tell the user: resend with the current digest, use a library path, ask the user for the missing photo.

A reply is at most 16 000 bytes; a narrower page or chunk is the fix when it would be larger.

## Typical calls

A post from a library photo:

1. `plan_piece { intent, kind: "post" }`, then `read_instructions` on its `refs`.
2. `edit_piece { action: "copy", pieceId: "sede-sabadell", source: "templates/post-news.json" }`.
3. `edit_piece { action: "update", pieceId, expectedDigest, changes: [{ field: "src", value: "library/media/real/ais_sabadell-building.jpg" }, { field: "headline", value: "…" }] }`.
4. `export_piece { action: "enqueue", pieceId, operation: "render-png", saveAs: "post.png" }`, then `status` until `succeeded`, then open the PNG.

One headline in a brochure: `copy` with `source: "pieces/brochures/hopper/hopper.es.html"`, `slots`, `update` with one `slotChanges` entry, `enqueue render-pdf`. Details for brochures and technical sheets: [editing with the studio tools](../skills/brochure/references/mcp-editing.md).

### A live machine explainer

Pass the marketer’s free-form description to `plan_piece`. Set `kind: "live-animation"` when the format is already known. The plan identifies the live-animation, explainer-story, scene-assembly and scene-motion-review skill refs. Follow `read_instructions` through its returned offsets.

Search `search_library` with `collection: "assets"` and `filters: {"kind":"scene-component"}`. The local plugin registers a rigged operator, the pharma cabinet with signal tower, cut-metal panel lettering, the packing-transfer assembly and the shared PlayerBar. Fetch a selected ID using `get_asset`. Its local URI points into the installed plugin. Read its source ref to retain neighbouring files, scale and integration details. The operator and packing cell also return the bundled Rocketbox licence ref.

On a new installation, run `node scripts/animation-assets.mjs` from the plugin root to retrieve the internal model pack. The animation builder does this on the first build. Authentication uses an AIS Firebase CLI or Google Cloud CLI sign-in with read access to the private pack.

For the real hardware library, search the same collection with `filters: {"kind":"machine-model","exists":true}`. Fetch the chosen part using `get_asset`. The inventory includes prepared camera, optics, lights, MiniTec framing and conveyor hardware, and the REV 360 Compact exterior. An available entry returns a local GLB URI and provenance. Optional `sourceRegisterUri` points to a local conversion register. Missing files return a null URI. [Hardware selection](../skills/scene-assembly/references/industrial-models.md)

The local Three.js host builds the scene from the selected components. Verify the assembled player against the supplied brief. The component library carries illustrative hardware and workwear with review status. The hosted design MCP and its public catalogue have separate assets.

## Rendering

Exports run under `skills/_shared/scripts/safe_render.py`: one render at a time on the computer (`/tmp/ais-marketing-render.lock`), never while Blender runs, only with enough free memory, with a time limit and clean-up of every process it started. If the computer is busy, the job waits its turn (state `queued`, `reason` says why) for up to `AIS_RENDER_WAIT_SECONDS`, then ends `blocked` with nothing rendered. Profiles, budgets and measurements: [RENDER-SAFETY.md](RENDER-SAFETY.md).

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `AIS_MEDIA_LIBRARY` | `~/.cache/ais-group-design/media` (plugin setting "Media library folder") | Where the brand photos and videos are kept, linked as `library/media`; pictures download there on demand from the media bucket. |
| `AIS_SCENE_MODELS_DIR` | Installed internal scene model pack, then a sibling Rosepetal website checkout if present | Local `astro/public/models` folder with the prepared industry parts and Compact exterior. An explicit path overrides detection. |
| `AIS_MCP_STATE` | `<plugin data>/studio` | Working copies and export jobs. One server owns it at a time; a second session gets its own folder. |
| `AIS_INBOX` | `<plugin data>/inbox` | Where pasted or dropped pictures are copied before `plan_piece`. |
| `AIS_RENDER_WAIT_SECONDS` | `600` | How long an export waits for a busy computer before it is reported `blocked`. |
| `AIS_PYTHON` | the plugin's venv | Python with Pillow, python-pptx and PyMuPDF. |
| `AIS_PORTABLE_GUARD` | unset | `1` uses the macOS/Windows render guard on Linux (tests). |

Requirements: Node 20 or later, Chromium from Playwright, Python 3 with the packages in `requirements.txt`, Poppler (`pdftoppm`, `pdfinfo`, `pdffonts`) for print, `ffmpeg`/`ffprobe` to inspect video. `npm run setup` installs what it can; `studio_status` lists the rest.

## Limits

- It doesn't render or edit video, generate pictures, upload or publish.
- Technical sheets: the seven Spanish sheets only; other languages are not converted. The sheet HTML in `pieces/datasheets/` is the source; `datasheets/data.json` is extracted from it and pinned in `mcp/print-family.json`. After a reviewed edit to a sheet, look at its PDF, then re-extract and re-pin with `npm run mcp:pin`; until then the server refuses that sheet.
- Pictures come from the media library, the pieces and work folders or the inbox; anything else, and URLs, are refused.
- Rejected library assets are never suggested; `search_library` with `status: "rejected"` or `get_asset` still shows them and why.
- At most 4 queued exports, 100 records per state folder (archive it when full).

## Development

```sh
npm test               # unit and stdio tests
npm run mcp:smoke      # one edit and validation through the official client
npm run mcp:e2e        # every piece type end to end, with exports (one render at a time)
npm run budget         # tokens the plugin adds to every session
```
