# AIS Group Design

The AIS Group brand guide as Claude Code skills, and a studio that makes on-brand LinkedIn posts, carousels, brochures, catalogues, datasheets and decks from your photos and a short brief.

## Install

```
/plugin marketplace add rosepetal-ai/aisgroup-design
/plugin install ais-group-design@ais-group-design
```

The marketplace is the root of the repo (`.claude-plugin/marketplace.json`); it installs this folder. A local clone works too: `/plugin marketplace add <path to the clone>`.

The design MCP (`design.aisgroup.ai/mcp`) connects by itself: it is open, with no account or token.

The studio prepares itself the first time you ask for a piece: it installs the renderer and the Python packages it needs in the background (a few minutes, once). To do it beforehand, or to see anything still missing, ask Claude: «Set up AIS Group Design.»

The brand photos and videos download on demand from the media bucket, the first time a piece uses them; no account is needed. For a full copy to work offline, install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) and run `npm run media:pull`.

## Machine animations and product films

In a local Codex installation, add the marketplace with `codex plugin marketplace add rosepetal-ai/aisgroup-design --ref main` and install with `codex plugin add ais-group-design@ais-group-design`. Claude Code uses the install commands above. The full edition includes the local studio for recording and rendering tutorials. The smaller `claude-plugin` edition includes the standalone animation builder and film-editing helpers for clients that can run local commands.

Give the plugin a quotation or a plain-language brief, including the sequence to show and any available references. For a guarded reader or indexed side pusher, use the [editable starter](skills/live-animation/examples/enclosed-inspection/README.md). The first build needs Node 22.12+, npm and read access to the private AIS model pack through Firebase CLI or Google Cloud CLI. For a machine without network access, install the internal pack in advance and provide the npm dependencies. Finished HTML plays offline.

In the generated project, `npm run check` verifies playback and contacts. With Chromium and FFmpeg installed, `npm run film -- demo.mp4` renders the same scene frame by frame as a silent 25 fps MP4. For product films with recorded app screens, approved footage, music and edit points, follow the [platform-film workflow](skills/platform-film/SKILL.md). For restricted demos, arrange sign-in before recording.

## Make a piece

Paste or drag your photos into the terminal and say what you need:

- «A LinkedIn post about the AIS KARIKÓ on a tray line, in Spanish.»
- «Change the headline on page 2 of the OPTICAIS brochure to …»
- «A carousel from these four photos for the Hopper.»

Claude picks the template, writes the copy from what is true, checks it against the brand and shows you the result before anything is final.

## Skills

| Skill | For |
| --- | --- |
| brand-guidelines | Essentials, brand names, logos and the app mark |
| design-language | Colour, type, layout, images, icons, charts, motion, accessibility |
| communications | Voice, languages and copy in English, Spanish and Catalan |
| marketing | Choosing the right piece: brochure, post or carousel |
| social-post, linkedin-carousel, linkedin-banner | LinkedIn pieces |
| brochure | Brochures, catalogues and datasheets |
| presentation | Decks, as HTML, PDF and PowerPoint |
| sales-documents | Proposals, quotations and case studies |
| digital-documents | Reports, PDFs and tables |
| print-stationery | Business cards, letterheads and stationery |
| brand-video | Brand videos and animations |
| brand-review, render-review | Checking a piece or a picture before it ships |
| asset-library | Finding approved photos, renders and footage |
| resources-assets | Downloads and the design server's files |
| web-design | The websites and their components |
| live-animation, explainer-story, scene-assembly, scene-motion-review | Interactive machine explainers, shared RSM player, asset selection and contact checks |
| platform-film, product-render | Films of the actual software, machine shots and product stills |
| product-ui | Rosepetal app screens and Node-RED panels |
| ui-audit, ui-theme-diff, ui-unify | Auditing, comparing and redesigning Vue apps on our components |
| vue-primevue, vue-vuetify | Colour bridges for apps still on PrimeVue or Vuetify |
| agent-integration | Connecting other agents and MCP clients |
| setup | Installing the renderer, Chromium and Python |

The guide-based references are copied from the brand guide (`guide/` in this repo) with `npm run sync:plugin` from the root. Change the guide, never these copies; `npm run guide -w plugin -- --check` fails when they drift.

## Privacy

The skills, hooks and checks run on your computer and send nothing to AIS Group. What the design server and the guide record is in the [privacy statement](https://design.aisgroup.ai/en/privacy/).

## For developers

Portable clients discover `plugin.json`, `mcp.json` and `skills/*/SKILL.md` in this folder. The Claude Code overlay at `.claude-plugin/plugin.json` preserves **Media library folder** and its existing studio environment. Both manifests use `ais-group-design` version `1.6.0`. The portable studio inherits `AIS_MEDIA_LIBRARY` from the caller; it uses standard `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` paths. The remote entry declares `https://design.aisgroup.ai/mcp`, which is open: no token or header.

`npm run validate:plugin -w plugin` checks the live source, and `node plugin/scripts/rules-ledger.mjs check` proves that every brand rule the ledger records is still in the skills.

`npm run package:plugin -w plugin -- --out=<new-directory>` creates a review upload with the proposed skills. It validates the Agent Plugins schemas, OpenAI overlay, Claude naming/size/archive constraints and the retained-rule ledger. It dereferences the confined `pieces/shared` symlink because Claude uploads prohibit symlinks. It omits nested ZIPs, held-back illustrations, private business cards and bulky cached media/example downloads. The full Git distribution retains those local production sources; the upload profile points omitted guide-download links at the hosted guide. Existing studio workflows that need omitted example media still need the synced media library or the full Git installation. Add `--lite` for claude.ai and Anthropic's plugin directory, which take at most 512 files and 50 MiB: skills, hooks, the checks and the hosted design server, the standalone animation builder the film-editing helpers, editable recipes and on-demand production kits. No package command publishes anything.

The plugin has 32 separately discoverable skills covering the complete guide, studio, reviews and product-UI audit/theme-diff/unify workflows. Numbered branches are in descriptions and the mapping table so task skill names remain familiar. `writing` is merged into `communications` with its workflow and references retained; brochures keep ownership of product sheets/datasheets. `_shared` remains workflow support, not an independently triggered skill.

From the repo root (npm workspaces):

```
npm ci
npm run setup -w plugin     # Chromium and the Python venv, once
npm test -w plugin          # MCP tests; the media tests run once the library is on disk (npm run media:pull)
npm run verify -w plugin    # tests, guide drift and plugin validation
npm run sync:plugin         # copy skills, logos, tokens and the registry from the built guide (npm run build -w guide first)
claude plugin validate --strict plugin
```

The hosted, read-only server for design.aisgroup.ai is in `../hosted/`; see [its README](../hosted/README.md).

### Templates in the lightweight edition

The upload includes editable post, carousel and video recipes and a catalogue of print, deck and letterhead sources. On the marketing workstation, ask for a piece as usual. With shell access, the skill uses `node scripts/prepare-template.mjs <id>` to fetch a sparse copy of the exact release for that template family and returns its source and renderer directory. Git, Node 22+ and Python 3 are needed; video exports also use ffmpeg. Run the studio setup in the returned directory before the first export. A successful download is cached for repeat use. Library media download on demand. The catalogue also lists approved intro, end-card and soundtrack downloads; each is checked against its release checksum before use.
