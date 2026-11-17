# Rosepetal Design playground

The playground to try the components of [`@aisgroup/design`](../packages/design) (Rosepetal's [shadcn-vue](https://www.shadcn-vue.com/) components) and change their variables. It reads the package straight from `../packages/design`.

## What's inside

- **Components**: each shadcn-vue component (`packages/design/ui`) on its own page: its props as controls, examples, and its files to copy or download.
- **Blocks** (`packages/design/blocks`): brand pieces built from the components, with no app logic: top bar, login page, confirm dialog, log terminal. Texts and data come from each app.
- **Preset**: the shadcn variables and the palette (`packages/design/styles.css`), changed live on the components. `rosepetal-ui` next to this repo picks them up in its dev server (`npm run dev` or `npm run dev:demo`); Save to styles.css writes them and a reload shows them.
- **Assets**: every image and video of `rosepetal-ui`, with where each one is used, from the bucket `gs://aisgroup-design/assets/` (see below).

## Getting started

Requires **Node 22**. From the repo root:

```bash
npm ci
npm run dev:playground     # http://localhost:5173, a component at /#<id> (e.g. /#button); the environment alone at /#app
```

The brand guide links each component page to the playground when it runs with `PUBLIC_PLAYGROUND_URL=http://localhost:5173`.

## rp-assets (in the bucket, not in git)

The copies of rosepetal-ui's images and videos (about 12 MB, customers' logos included) live in `gs://aisgroup-design/assets/` (`RP_ASSETS_BUCKET` to use another). The dev server pulls them into `rp-assets/` (in `.gitignore`) when it starts, with your `gcloud` account: it needs `gcloud auth login` and read access to the `aisgroup-design` project. The pull only adds and updates; it never deletes a local file. Without access it warns and serves what `rp-assets/` already has; the rest of the playground works without it.

The Assets page lists them from `src/data/assets.json`, which is committed. «Save to repo» moves and deletes each file in the bucket first and then in `rp-assets/`; a file the bucket refuses stays as it was in both, and the page shows the error. To add a file, upload it with `gcloud storage cp <file> gs://aisgroup-design/assets/<folder>/` and restart the dev server.

## Scripts

From the repo root, with `-w playground`:

| Command | What it does |
| --- | --- |
| `npm run dev -w playground` | Dev server: pulls the bucket into `rp-assets/` and serves it at `/rp-assets`. |
| `npm run build -w playground` | Type check and build into `playground/dist/`. |
| `npm run build:artifact -w playground` | Single-file build → `playground/artifact/index.html`, the page published as the Artifact. |
| `node scripts/assets-manifest.mjs` (in `playground/`) | Rebuilds `src/data/assets.json` from `rp-assets/` (usage is recomputed when `rosepetal-ui` is next to this repo, or `RP_UI=<checkout>`); without `rp-assets/` it leaves the list as it is. |

## Conventions

- Everything is built from shadcn-vue components; Rosepetal's look lives in their variants (`cva`) and the theme tokens in `packages/design/styles.css`.
- Every new online view decides its offline behaviour (see `rosepetal-ui`'s CLAUDE.md).
- Scrollbars are hidden app-wide; layouts aim to fit without scrolling.
- Asset clean-ups are done here (the Assets page, which changes the bucket, `rp-assets/` and `src/data/assets.json`), not in `rosepetal-ui`.
