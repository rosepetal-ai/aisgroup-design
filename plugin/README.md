# AIS Group Design

Portable clients discover `plugin.json`, `mcp.json` and `skills/*/SKILL.md` in this folder. The Claude Code overlay at `.claude-plugin/plugin.json` preserves **Media library folder** and its existing studio environment. Both manifests use `ais-group-design` version `1.2.2`. The portable studio inherits `AIS_MEDIA_LIBRARY` from the caller; it uses standard `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` paths. The remote entry declares `https://design.aisgroup.ai/mcp`, which is not deployed yet.

`npm run validate:plugin -w plugin` checks the live source, and `node plugin/scripts/rules-ledger.mjs check` proves that every brand rule the ledger records is still in the skills.

`npm run package:plugin -w plugin -- --out=<new-directory>` creates a review upload with the proposed skills. It validates the Agent Plugins schemas, OpenAI overlay, Claude naming/size/archive constraints and the retained-rule ledger. It dereferences the confined `pieces/shared` symlink because Claude uploads prohibit symlinks. It omits nested ZIPs, held-back illustrations, private business cards and bulky cached media/example downloads. The full Git distribution retains those local production sources; the upload profile points omitted guide-download links at the hosted guide. Existing studio workflows that need omitted example media still need the synced media library or the full Git installation. No package command publishes anything.

The proposal has 26 separately discoverable skills covering the complete guide, studio, reviews and product-UI audit/theme-diff/unify workflows. Numbered branches are in descriptions and the mapping table so task skill names remain familiar. `writing` is merged into `communications` with its workflow and references retained; brochures keep ownership of product sheets/datasheets. `_shared` remains workflow support, not an independently triggered skill. Integration is deferred while other workers have uncommitted edits.

The AIS Group brand guide as Claude Code skills, and a studio that makes on-brand LinkedIn posts, carousels, brochures, catalogues, datasheets and decks from your photos and a short brief.

## Install

```
/plugin marketplace add rosepetal-ai/aisgroup-design
/plugin install ais-group-design@ais-group-design
```

The marketplace is the root of the repo (`.claude-plugin/marketplace.json`); it installs this folder. A local clone works too: `/plugin marketplace add <path to the clone>`.

Then, once per computer, ask Claude: «Set up AIS Group Design.» It installs the renderer and the Python packages it needs (a few minutes), then lists anything still missing.

The brand photos and videos download on demand from the private media bucket, the first time a piece uses them. You need the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), signed in with `gcloud auth login` as an account with «Storage Object Viewer» on the `aisgroup-design` project. For a full copy to work offline: `npm run media:pull`.

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
| communications | Voice, languages, documents, social, kit, video |
| web-design | The three websites and their components |
| product-ui | Rosepetal app screens and Node-RED panels |
| social-post, linkedin-carousel, linkedin-banner | LinkedIn pieces |
| brochure, presentation | Print pieces and decks |
| brand-video | Brand videos |
| brand-review, render-review | Checking a piece or a picture before it ships |
| asset-library | Finding approved photos, renders and footage |

The first five are copied from the brand guide (`guide/` in this repo) with `npm run sync:plugin` from the root. Change the guide, never these copies; `npm run guide -w plugin -- --check` fails when they drift.

## For developers

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
