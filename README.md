# AIS Group design system

Everything the AIS Group brands share in design, in one repo: the brand guide, the product components, their playground, the Claude Code plugin and the hosted MCP.

| Folder | What it is |
| --- | --- |
| [`guide/`](guide/) | The brand guide (Astro), in English, Spanish and Catalan: brand, design language, communications, websites and the product design system. Deployed to Firebase Hosting as design.aisgroup.ai. |
| [`packages/design/`](packages/design/) | `@rosepetal/design`: the product components (shadcn-vue), brand blocks, examples and product tokens (`styles.css`). What every Rosepetal app installs. |
| [`packages/web/`](packages/web/) | `@aisgroup/web`: the websites' Astro components, examples and tokens (`styles.css`: brand.css, the web roles and each brand's settings). What the three company websites use. |
| [`playground/`](playground/) | The playground to try the package's components and change their variables (Vite). |
| [`plugin/`](plugin/) | The Claude Code plugin: the guide as skills, and the studio MCP that makes on-brand posts, brochures, datasheets and decks. |
| [`hosted/`](hosted/) | The hosted, read-only MCP (`design.aisgroup.ai/mcp`): the guide, tokens, components and assets for developers and claude.ai. A Firebase function, published with the guide. |
| [`library/`](library/) | The curated media library: the photo masters under clean names and `library.json` (every entry, with logos and icons pointing at the guide's official files). Imported with `node scripts/import-library.mjs`; served by both MCPs, not by the public guide. |
| `.claude-plugin/marketplace.json` | The plugin marketplace: installs `./plugin`. |

How the parts feed each other: [`plugin/docs/HOW-IT-WORKS.md`](plugin/docs/HOW-IT-WORKS.md). How to work here: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Get started

Requires Node 22 (and npm 10). npm workspaces: one `npm ci` at the root installs everything.

```bash
git clone https://github.com/rosepetal-ai/aisgroup-design.git
cd aisgroup-design
npm ci
npm run build        # the guide, the playground and the hosted MCP's snapshot of the guide
npm test             # tokens contract, package typecheck, plugin and hosted MCP tests, contracts and guide search
```

| Command | What it does |
| --- | --- |
| `npm run dev:guide` | The guide at http://localhost:4321 |
| `npm run dev:playground` | The playground at http://localhost:5173 (a component at `/#<id>`) |
| `npm run build` | `guide/dist`, `playground/dist` and `hosted/data` |
| `npm test` | `scripts/check-tokens.mjs`, the root tests, the package's `vue-tsc`, the `plugin` and `hosted` tests, the components, website and spec contracts and the guide's search (build first: they read `hosted/data` and `guide/dist`) |
| `npm run sync:sites` | Copies `@aisgroup/web` into the three websites next to this repo (`src/vendor/@aisgroup/web/`, with its fingerprint in their `package.json`) |
| `npm run sync:plugin` | Copies the built guide's skills, logos, tokens and registry, and `library/`, into `plugin/` (commit the result) |
| `npm run deploy:guide` | Builds and deploys the guide to Firebase (see Release) |
| `npm run <script> -w <folder>` | Any script of one part, e.g. `npm run typecheck -w @rosepetal/design`, `npm run setup -w plugin` |

CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm run build`, `npm test` and the plugin drift check on Node 22 for every push and pull request. It uses no secrets and deploys nothing.

### What each part needs

- **The guide** builds with plain `astro build` and needs nothing outside the repo. Its component pages, its shadcn-vue registry (`/r/<name>.json`), its agents' index (`/components.md`) and `/downloads/ais-theme.css` read `packages/design` through the workspace: there is no copy of the components in the guide.
- **The package** ships as source; apps compile it with Vite. Its README has the set-up for an app.
- **The playground** reads `../packages/design`. Its Assets page reads `playground/rp-assets/`, which is not versioned: see [`playground/README.md`](playground/README.md).
- **The plugin's studio** renders with Chromium and Python (`npm run setup -w plugin`, once per computer). Its pictures come from the media library, downloaded on demand from the private media bucket (see below).
- **The hosted MCP** serves only `hosted/data/`, a snapshot of the built guide and of `library/` (`npm run build -w hosted`).

### Tokens contract

The products take their tokens from `packages/design/styles.css`; the marketing tokens are the guide's `public/downloads/ais-tokens.css` and `ais-tokens.json`. The core values they share (the blue and neutral scales, the font, the status colours) must be the same: `npm test` fails if they drift (`scripts/check-tokens.mjs`). Change both in the same pull request.

## Release

Deploys are manual, from an up-to-date `dev` (the default branch), after `npm ci && npm run build && npm test`.

### The guide (Firebase Hosting)

Firebase project `aisgroup-design`, hosting site `aisgroup-design` (`guide/.firebaserc`, `guide/firebase.json`). You need access to the project and the Firebase CLI signed in (`npx firebase-tools login`).

```bash
npm run deploy:guide        # astro build, then firebase deploy --only hosting:aisgroup-design
```

### The package (`@rosepetal/design`, Artifact Registry)

A tag `vX.Y.Z` publishes that version: the workflow [`publish-design.yml`](.github/workflows/publish-design.yml) sets the version from the tag, checks the package has nothing of an app and publishes it to `private-node-packages` in Artifact Registry (repo secret `GCP_SA_KEY`).

```bash
git tag v0.1.0 && git push origin v0.1.0
```

Apps authenticate once with `npm_config_registry=https://registry.npmjs.org npx google-artifactregistry-auth` and install `@rosepetal/design` (see [`packages/design/README.md`](packages/design/README.md)).

### The hosted MCP (a Firebase function)

The MCP is the function `mcp` in [`hosted/`](hosted/), published with the guide from `guide/`: the hosting rewrites `/mcp` to it, so it answers at the guide's own address and its download links point at the guide's files. After `npm run build -w guide`:

```bash
cd guide && firebase deploy --only hosting:aisgroup-design,functions:mcp --project aisgroup-design
```

The functions predeploy step snapshots the built guide into `hosted/data` (`node ../hosted/build.mjs`). Publishing a function needs the project on the Blaze plan, the Firebase Admin role and the Service Account User role (`roles/iam.serviceAccountUser`); Firebase turns on the Google services it builds with on the first deploy. Limits, token and costs: [`hosted/README.md`](hosted/README.md).

### The plugin

Install it in Claude Code:

```
/plugin marketplace add rosepetal-ai/aisgroup-design
/plugin install ais-group-design@ais-group-design
```

A merge to the default branch releases it. Bump the version in `plugin/.claude-plugin/plugin.json` when the skills or the studio change.

## Media and the marketing kit

The brand photos, renders and videos (`media/`) and the delivered marketing kit (`marketing-kit/`) are in the private Cloud Storage bucket `gs://aisgroup-design-assets`, not in git. Access: a Google account with «Storage Object Viewer» on the `aisgroup-design` project (to publish changes, «Storage Object Creator»), the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) and `gcloud auth login`.

| Command | What it does |
| --- | --- |
| (nothing) | The studio downloads each picture the first time a piece uses it |
| `npm run media:pull` | A full local copy of the media library, for offline work and the media tests |
| `npm run media:push -w plugin` | Publishes new or changed media (adds and updates, never deletes) |
| `npm run kit:pull` / `npm run kit:push` | The marketing kit in `marketing-kit/`; then `npm run kit -w guide` refreshes the guide's kit pages |
