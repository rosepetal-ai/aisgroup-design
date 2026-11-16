# How AIS Group Design works

One repository, `rosepetal-ai/aisgroup-design`, holds everything; there are two MCP servers. One source feeds the components (the package `@aisgroup/design`) and one feeds the rules (the brand guide).

```
packages/design  = @aisgroup/design                         ← components, blocks, examples, product tokens (styles.css)
   │  npm workspaces: the guide and the playground import it; a tag vX.Y.Z publishes it to Artifact Registry
   ▼
guide/  = the brand guide (Astro)                            ← rules, marketing tokens, kit; shows the package
   │  npm run build -w guide  →  guide/dist/
   │     /<lang>/…            the guide pages (en, es, ca); /<lang>/components/<id>/ renders the package's examples
   │     /r/<name>.json       shadcn-vue registry: each component and block of the package with its source code
   │     /skills/…            the guide as agent skills, one per section of the tree
   │     /<lang>/brand.md     the rules as one Markdown file per language
   │     /components.md       index of every component and block of the package, the widgets and the Profiler parts
   │     /downloads, /logos, /fonts, /kit, /examples   (downloads/ais-theme.css is the package's styles.css)
   │
   ├─► Firebase Hosting, project aisgroup-design, site aisgroup-design: the website people browse
   │
   ├─► plugin/   npm run guide -w plugin  (scripts/sync-guide.mjs) copies the knowledge skills, logos, tokens and registry
   │
   └─► hosted/   npm run build -w hosted  (hosted/build.mjs) snapshots guide/dist/ into hosted/data/ for the hosted MCP

playground/  = the playground for the package's components and their variables (Vite)
```

## 1. Hosted MCP: `design.aisgroup.ai/mcp`

It's read-only and has no database. It's for developers and claude.ai: "what are the rules, give me the tokens, the logo, the button code".

**Where its data comes from.** It never reads the live site or Firebase at runtime. `npm run build -w hosted` copies these parts of the built guide (`guide/dist`) into `hosted/data/`:
- skills;
- `brand.md`;
- `components.md`;
- `r/`;
- logos;
- downloads;
- fonts;
- the hexagon SVGs;
- the examples' HTML and CSS.

It also writes `catalogue.json`, the list of assets. Each asset's usage rule is quoted word for word from the guide, so if a quoted line disappears from the guide, the build fails. That way the MCP can never say something the guide doesn't.

**Where it runs.**
- **Server:** a small Node HTTP handler (`hosted/server.mjs`) with three routes:
  - `/mcp`: MCP over streamable HTTP, stateless;
  - `/files/…`: the snapshot's files, only when run locally (as a function, download links point at the guide);
  - `/health`.
- **Address:** it's a Firebase function behind the guide's address: Firebase Hosting rewrites `/mcp` to it (`firebase.json` at the repo root), and everything else, download files included, is the static site.
- **Pictures and PDFs:** these are served by the guide site itself (Firebase), not by the MCP. `design_examples` returns their URLs.
- **Access:** a bearer token, the secret `AIS_MCP_TOKEN` (see `hosted/README.md`, Deploy and Connect).

**Tools** (`hosted/download-tools.mjs`), one per kind of download:

| Tool | Answers from |
|---|---|
| `design_code` | the package's `styles.css` as a Tailwind v4 theme; `r/<name>.json` for each component or block, with the install line `npx shadcn-vue@latest add https://design.aisgroup.ai/r/<name>.json`; the `@aisgroup/web` website components; the PrimeVue and Vuetify presets |
| `design_assets` | `catalogue.json`: logos, favicons, patterns and backgrounds, approved media and fonts, each with its rule and a download URL on the guide |
| `design_examples` | the marketing kit (documents with page and PDF URLs, the HTML source in chunks), product component views and approved images |
| `design_standards` | `ais-tokens.json` (DTCG, CSS or JS), the guide's skills searched by heading, and `brand.md` in en, es or ca |

**How components stay in sync.** The source of truth is `packages/design` in this repo; there is no copy to refresh. The guide's component pages, `/r/` and `components.md` read the package through the workspace on every build, so a merged change to a component shows everywhere at the next build:
1. Build: `npm run build` (guide, playground and the hosted snapshot).
2. Copy into the plugin: `npm run sync:plugin`.
3. Redeploy the guide and, when the snapshot changed, the MCP.

`npm test` fails if the shared core tokens (blue and neutral scales, font, status colours) drift between the package's `styles.css` and the guide's `ais-tokens.css` and `ais-tokens.json`.

**How it keeps tokens down.**
- **Instructions and the four tool schemas:** about 513 tokens per session. Clients see lean schemas (types and enums only). The strict validation (lengths, patterns) runs on the server, so a bad call costs one short refusal instead of tokens in every session.
- **Every answer:** at most 20 KB. If it would be larger, the server refuses with "narrow it: a group, a kind, a query or an offset", instead of truncating.
- **Reading is in pieces:**
  - search returns 6 hits, each with an offset;
  - a page is read 6000 characters at a time;
  - assets come 20 per page and examples 15.
- **Search is keyword scoring over headings:** a heading hit counts 4×, there's a prefix match, and British and US spellings are folded. There are no embeddings. If agents miss pages, that's the upgrade.

## 2. Studio MCP, inside the Claude Code plugin (local)

It makes and edits real pieces: posts, carousels, brochures, catalogues, datasheets, decks and stationery. It runs on the user's computer, because it renders with Chromium, Python and the media library.

- **Start:** `.claude-plugin/plugin.json` launches `mcp/start.mjs` over stdio.
- **Tools** (`mcp/server.mjs`, `mcp/core.mjs`): `plan_piece`, `studio_status`, `search_library`, `read_instructions`, `get_asset`, `inspect_media`, `edit_piece` and `export_piece`.
- **Working copies:** it works on a copy, never on the source. A copy lives in the plugin's data folder (`AIS_MCP_STATE`), and every change carries the copy's digest, so stale edits are refused.
- **What can change:**
  - posts by field;
  - brochures, catalogues and decks by slot (text or picture);
  - technical sheets by `printChanges`. Their HTML in `pieces/datasheets` is the source; `datasheets/data.json` is extracted from it and pinned with `npm run mcp:pin`.
- **Pictures:** from the media library (catalogued in `library/catalog.json`, kept in the private bucket `gs://aisgroup-design-assets/media` and downloaded on demand, `scripts/media.mjs`), or from files the user supplies. The media library is not in git; the tests that need it are skipped without it (run them with `AIS_MEDIA_LIBRARY=<folder> npm test -w plugin`).
- **Rendering:** through `skills/_shared/scripts/safe_render.py`: one render at a time per computer, never while Blender runs, with a time and memory guard.
- **Keeping tokens down:**
  - replies are one JSON object of at most 16 000 bytes, with a `next` line;
  - `read_instructions` returns 3000 characters at a time;
  - `search_library` returns 8 per page.

## 3. Structure: the lead's tree

The guide's menu and the skills follow the same tree. Each node is one skill: a short `SKILL.md` with when to use it and the essential rules, plus one reference file per guide page, loaded only when needed.

| Tree node | Skill |
|---|---|
| 01 Brand guidelines (logo, colour, type, use) | `brand-guidelines`; Resources (downloads, assets): `resources-assets` |
| 02 Design language (principles, tokens, type, grid, layout, icons, motion, themes) | `design-language` |
| 03 Communications (print, documents, marketing, motion and video) | `communications` (plus the making skills: `brochure`, `presentation`, `social-post`, `linkedin-carousel`, `linkedin-banner`, `brand-video`) |
| 04 Digital design: web | `web-design` |
| 04 Digital design: product UI (shadcn-vue) | `product-ui` |

The knowledge skills are generated by the guide build (`guide/src/pages/skills/[...file].ts`) and copied into the plugin with `npm run sync:plugin` (from the root), so a skill can't drift from the guide. `npm run guide -w plugin -- --check` fails if they differ. The making skills (brochure, posts and so on) are the plugin's own. `npm run -s budget` checks each skill's token size.

## Release steps

From the repo root:

1. `npm ci`, then `npm run build` (guide, playground, hosted snapshot).
2. `npm run sync:plugin` when the guide changed (commit the plugin's refreshed copies), and `KIT=… DECKS=… npm run examples -w plugin` when the marketing kit changed.
3. `npm test` (tokens contract, package typecheck, plugin and hosted tests).
4. Deploy:
   - the guide: `npm run deploy:guide` (Firebase project `aisgroup-design`, site `aisgroup-design`);
   - the package: tag `vX.Y.Z`; the workflow publish-design.yml publishes `@aisgroup/design` to Artifact Registry;
   - the MCP: from `guide/`, `firebase deploy --only hosting:aisgroup-design,functions:mcp` publishes the guide and the function `mcp` together (see the README).
