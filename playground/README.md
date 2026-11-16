# Rosepetal Design playground

The playground to try the components of [`@aisgroup/design`](../packages/design) (Rosepetal's [shadcn-vue](https://www.shadcn-vue.com/) components) and change their variables. It reads the package straight from `../packages/design`.

## What's inside

- **Components**: each shadcn-vue component (`packages/design/ui`) on its own page: its props as controls, examples, and its files to copy or download.
- **Blocks** (`packages/design/blocks`): brand pieces built from the components, with no app logic: top bar, login page, confirm dialog, log terminal. Texts and data come from each app.
- **Preset**: the shadcn variables and the palette (`packages/design/styles.css`), changed live on the components. `rosepetal-ui` next to this repo picks them up in its dev server (`npm run dev` or `npm run dev:demo`); Save to styles.css writes them and a reload shows them.
- **Assets**: every image and video of `rosepetal-ui`, with where each one is used, from a local `rp-assets/` folder (see below).

## Getting started

Requires **Node 22**. From the repo root:

```bash
npm ci
npm run dev:playground     # http://localhost:5173, a component at /#<id> (e.g. /#button); the environment alone at /#app
```

The brand guide links each component page to the playground when it runs with `PUBLIC_PLAYGROUND_URL=http://localhost:5173`.

## rp-assets (not in git)

`rp-assets/` holds copies of rosepetal-ui's images and videos (about 12 MB), including customers' logos, so it stays out of this repo (it is in `.gitignore`). The Assets page lists them from `src/data/assets.json`, which is committed; without the folder the pictures don't load and the rest of the playground works.

Ask a code owner of `playground/` for a copy.

## Scripts

From the repo root, with `-w playground`:

| Command | What it does |
| --- | --- |
| `npm run dev -w playground` | Dev server (serves `rp-assets/` at `/rp-assets` when it is there). |
| `npm run build -w playground` | Type check and build into `playground/dist/`. |
| `npm run build:artifact -w playground` | Single-file build → `playground/artifact/index.html`, the page published as the Artifact. |
| `node scripts/assets-manifest.mjs` (in `playground/`) | Rebuilds `src/data/assets.json` from `rp-assets/` (usage is recomputed when `rosepetal-ui` is next to this repo, or `RP_UI=<checkout>`); without `rp-assets/` it leaves the list as it is. |

## Conventions

- Everything is built from shadcn-vue components; Rosepetal's look lives in their variants (`cva`) and the theme tokens in `packages/design/styles.css`.
- Every new online view decides its offline behaviour (see `rosepetal-ui`'s CLAUDE.md).
- Scrollbars are hidden app-wide; layouts aim to fit without scrolling.
- Asset clean-ups are done here (`rp-assets/` + `src/data/assets.json`), not in `rosepetal-ui`.
