# AIS Group brand guide

The brand guide for AIS Group, AIS Vision Systems and Rosepetal (Astro). It also builds what agents read: `/<lang>/brand.md`, `/components.md`, the shadcn-vue registry in `/r/` and the skills in `/skills/`, which the plugin (`../plugin`) and the hosted MCP (`../hosted`) copy.

From the repo root:

```
npm ci
npm run dev:guide          # http://localhost:4321
npm run build -w guide     # guide/dist/
```

| Path | What |
| --- | --- |
| `src/content/guide/<lang>/` | The pages, in English, Spanish and Catalan. Each page's `rules` feed brand.md and the skills. |
| `public/` | Logos, marketing tokens (`downloads/ais-tokens.css`, `downloads/ais-tokens.json`), fonts, icons, imagery, the kit. |
| `src/design/` | How the guide reads `@rosepetal/design` (`../packages/design`, through the workspace): its catalogue, examples and source. The guide never keeps a copy of the package. |
| `src/pages/[lang]/components/[id].astro`, `src/pages/preview/` | One page per component and block, each example rendered live from the package. |
| `src/pages/r/[name].json.ts` | The package as a shadcn-vue registry (`/r/<name>.json`, `/r/theme.json`). |
| `src/pages/components.md.ts` | The agents' component index (the hosted MCP's `design_components` and the plugin read it). |
| `src/pages/downloads/ais-theme.css.ts` | `/downloads/ais-theme.css`: the package's `styles.css`, the Tailwind theme of every site and product. |
| `firebase.json`, `.firebaserc` | Hosting for design.aisgroup.ai: project `aisgroup-design`, site `aisgroup-design`. Caching: `/_astro/` and fonts a year (immutable), images a day, downloads an hour, pages and agent files revalidate on every visit. |

`npm run build` is plain `astro build`: it needs nothing outside this repo.

`/mcp` is rewritten to the Firebase function `mcp` (europe-west1), the hosted MCP in `../hosted`, which this file also lists as its functions source. It answers once the function is published; the rest of the guide doesn't depend on it.

## Maintainer commands

They refresh files that are committed in `public/` and skip cleanly when their source is not there.

| Command | Reads | Writes |
| --- | --- | --- |
| `npm run sync -w guide` | The marketing folder's `assets/brand` next to this repo (`BRAND_ASSETS=<folder>`), the website repos (`RP_SITES=<folder>`) | `public/logos`, `public/imagery`, `public/charts`, `public/web`, `public/downloads/web/*.zip` |
| `npm run kit -w guide` | The marketing kit (`npm run kit:pull` at the repo root first, or `KIT=<folder>`) | `public/kit/files/`, `src/data/kit.json` (business cards are never copied) |
| `node guide/scripts/build-app-mark.mjs` | The logos in `public/logos` | The app marks and favicons (`--check` to compare) |

## Guide search

The sidebar search uses Pagefind 1.6.0, a build dependency pinned in this workspace.
The `guide-search-index` Astro integration indexes the rendered `main` content of
EN/ES/CA guide pages, including component documentation, after every successful
Astro build. Navigation, preview iframe pages and kit HTML are excluded. Pagefind
handles ranking, heading links, excerpts, accents and separate language indexes.
The static files live in `dist/pagefind/` and ship with the existing Firebase
Hosting output; no service, credentials or hosting configuration is required.

Use `npm run build -w guide` before testing search. Bare `astro dev` does not build
an index; the dialog reports its localized unavailable state there. The build hook
also runs when the existing deploy command invokes Astro directly. Indexing errors
fail the build, so publishing cannot silently skip a failed index generation.
See `tests/README.md` for retrieval and browser checks without a local server.
