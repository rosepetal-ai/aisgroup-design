# Contributing

## Branches and pull requests

- `dev` is the default branch, where work comes together. A `main` branch for released states is planned (the repo has none yet). Nobody commits to them directly.
- Work on a feature branch from `dev`: `feat/<short-name>`, `fix/<short-name>` or `<your-name>/<topic>`.
- Open the pull request into `dev`. It is reviewed by the code owners of each folder it touches (`.github/CODEOWNERS`).
- CI must pass: `npm ci`, `npm run build`, `npm test` and the plugin drift check. Run them locally before you ask for a review.

## Commits

- Plain sentences that say what changed and why, in English: `Button: the modal size is 40 px, as the dialogs use`. `packages/design/` and `playground/` use conventional prefixes (`feat(design): …`, `fix(playground): …`); both are fine, one style per commit.
- One change per commit; no "fix", "update" or "changes" on their own.
- No AI attribution: no `Co-Authored-By` lines for tools and no "Generated with" lines, in commits, pull requests or files.
- No personal notes, logs, local paths (`/home/…`, caches) or secrets. `.env` files stay out (`.gitignore`); secrets live in the platform's secret store.

## The product components: only in `packages/design`

- Product components, blocks, examples and product tokens change only in `packages/design`. Nothing else in the repo keeps a copy of them.
- Try a change in the playground: `npm run dev:playground`. Its Preset page edits `styles.css` live and can save it.
- Each component or block has examples in `packages/design/examples/<id>/NN-name.vue`, whose first comment is the line the guide shows under the title. A new component also goes in `packages/design/catalog.ts` (its id, name, description and folder): the guide's pages, registry and index are built from it.
- Run `npm run typecheck -w @rosepetal/design` and `npm run build`; then look at the component's page in the guide (`npm run dev:guide`, `/en/components/<id>/`).
- To publish, tag `vX.Y.Z` (see README.md).

## The website components: only in `packages/web`

- Website components, examples and web tokens change only in `packages/web`; each component is used by at least two sites or documented in the guide. They are Astro with scoped styles on the `--ais-*` tokens and the `--web-*` roles: no Tailwind classes, no framework.
- A difference between sites is a brand setting in `styles.css` (`[data-brand="…"]`), never a fork of a component.
- Each component has examples in `packages/web/examples/<id>/NN-name.astro`, whose first comment is the line the guide shows under the title, and an entry in `packages/web/catalog.ts`.
- After a change, run `npm run build` and `npm test`, then `npm run sync:sites` and build each site; a site's build fails while its copy differs from the version its `package.json` names.

## The guide: documents and shows the packages, never copies them

- Pages are in `guide/src/content/guide/<lang>/` (English, Spanish, Catalan): change the three together. Each page's `rules` feed `brand.md` and the plugin's skills.
- The component pages, `/r/<name>.json`, `/components.md` and `/downloads/ais-theme.css` are built from `packages/design` through the workspace. Never paste component code, examples or product tokens into the guide: change the package, and the guide follows at the next build.
- Where the guide states a fact about the package (a token, a radius, an import path), keep it true when the package changes.
- Brand decisions (colours, type, logos, voice, layout rules) change only with the brand owners' agreement.
- After a guide change, run `npm run build` and `npm run sync:plugin`, and commit the plugin's refreshed copies in the same pull request (CI checks they match).

## Tokens contract

The blue and neutral scales, the font and the status colours are the same in `packages/design/styles.css` and the guide's `public/downloads/ais-tokens.css` and `ais-tokens.json`. Change them in both places in one pull request, reviewed by both owners; `npm test` fails if they drift.

## The plugin and the hosted MCP

- Knowledge skills (`plugin/skills/brand-guidelines`, `design-language`, `communications`, `web-design`, `product-ui`) and `plugin/brand/` are copies of the built guide: change the guide, then `npm run sync:plugin`.
- The studio MCP's tests: `npm test -w plugin`; the media tests run once the media library is on disk (`npm run media:pull`). Before a plugin release, `npm run verify -w plugin`.
- The hosted MCP's answers come from `hosted/data`, rebuilt by `npm run build`. A usage rule it quotes from the guide must still be in the guide, or its build fails: update `hosted/build.mjs` with the guide.
