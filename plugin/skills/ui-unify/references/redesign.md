# Redesign an existing app

Moves a Vue app built on PrimeVue, Vuetify or its own styles onto our components, blocks, Lucide icons and brand, keeping every behaviour. The colour adapters (vue-primevue, vue-vuetify) only colour the screens not yet moved; they are not the redesign.

## 1. Read before changing

- Read the app's tests, decision docs (ADRs, `docs/`, CLAUDE.md, comments that name an owner or a date) and i18n files. List every text, button and interaction they guard.
- Owner decisions stay unless the guide makes them impossible. Keep a list of the ones the guide overrides, each with its rule, and give it to the owner. «Keep it simple» never removes a guarded text, button or interaction on its own.
- Run `node <plugin root>/scripts/ui-contract.mjs audit src` from the app's folder for the starting counts.

## 2. Set up

- Install `@aisgroup/design` from npm, never by copying files: `npm install @aisgroup/design@npm:@rosepetal/design`. An app that cannot take the package uses the shadcn-vue registry instead: `npx shadcn-vue@latest add https://design.aisgroup.ai/r/theme.json`, then each component and block it needs (`https://design.aisgroup.ai/r/<name>.json`; `design_code kind=components query=…` finds the names).
- `components.json` aliases: `components` `@/components`, `ui` `@/components/ui`, `utils` `@/lib/utils`. Import `src/assets/theme.css` after Tailwind.
- A Vite app with project references (`tsconfig.app.json`) also needs `compilerOptions.paths` (`"@/*": ["./src/*"]`) in the root `tsconfig.json`, or the CLI stops with «resolvedPaths: Required».
- In a pnpm workspace, run the CLI with `npm_config_ignore_workspace_root_check=true`, or pnpm refuses with `ERR_PNPM_ADDING_TO_ROOT`.
- Install `@aisgroup/design-lint` (`npm install -D @aisgroup/design-lint@npm:@rosepetal/design-lint`) and run `npx design-lint init` (it only lists what it would write), then `npx design-lint init --write`. The app gets the rules in ESLint, `lint:ui` with a baseline of today's findings, `check:ui`, a CI workflow and the UI section of `AGENTS.md`. The baseline is written once, before the redesign starts; every view you finish leaves its own findings at zero. Then bring the app's copies of the package's components to its current version with `npx design-lint sync --write` (without `--write` it lists them): an older copy brings back bugs the package has fixed.

## 3. Brand surfaces first

- **Favicons and app icons:** download the official set (`design_assets kind=app-icon` and `kind=favicon`; software takes its brand's app set, the white mark on the blue tile) and replace the app's. Never redraw, recolour or generate a logo or icon; a script that draws one goes.
- **Logos:** the official files (`design_assets kind=logo`). Software the whole group uses is signed by AIS Group alone, once per screen; no row of company logos.
- **Names:** exactly as the guide writes them (AIS Group, AIS Vision Systems, Rosepetal); the audit's `brand-name` rule finds the rest. The app is named by the product and what it is, «Nexus ERP», with no company in front.
- **Login:** the `login-page` block. Software signed by AIS Group passes the white AIS Group logo (`logo-class="h-12 w-auto"`), the catalogue hexagon corner in `panel-art`, the full logo in `mark` for small screens and its own sign-in in `form` (example `login-page/03-group-app`). Rosepetal keeps the defaults.
- **Top bar and sidebar:** the `top-bar` block with the app mark and the app name in the link home (`BrandLogo brand="ais"`, example `top-bar/03-group-app`), and the `sidebar` component.

## 4. Notices and confirmations

- Notices are `toast()` from `vue-sonner`, with one `<Toaster />` in App.
- Confirmations asked from code are `useConfirm().ask()` from the `confirm-host` block, with one `<ConfirmHost />` in App and its translated labels.
- With many callers of PrimeVue's `useToast().add()` or `useConfirm().require()`, add the `bridge` of those entries (`design_code kind=migration name=primevue query=useToast`, then `query=useConfirm`): callers change only their import. New code calls `toast()` and `ask()`.

## 5. Every view, one at a time

Swapping components is not the redesign. Each view is rebuilt as if it were new, from our blocks and examples, with the app's data and behaviour.

- **List the views first.** Every route from the router, plus every dialog, drawer and panel, in a file in the app's repo (`docs/redesign-status.md`): view, route, status (old, in progress, done). Report from that list; a part is never «done» for the whole.
- **Shared parts before modules.** The layout, the dashboard, toolbars, empty states and shared dialogs go first, keeping their props and events, so module views reuse them.
- **For each view, all four together, then the next view:**
  1. **Components:** only ours. `design_code kind=migration name=primevue|vuetify|icons query=<component>` gives the target and its props; install anything missing from the registry, never hand-build or restyle one (classes only place it: grid, flex, gap, width).
  2. **Layout:** the page in `PageLayout`, then the [page system](page-system.md). Open the guide example of each component you use and make the view look like it, not like a restyled version of the old screen.
  3. **Texts:** every string the view shows, rewritten in every language to our voice (guide «Voice»: «Template text is copy too», «Writing that reads as ours»): short, plain, labels as names, no explanations of how the system works, no helper footnotes, greetings or filler. Placeholders, error meaning and key parity stay; owner-decided texts keep their content.
  4. **Behaviour:** handlers, stores, undo, permissions, keyboard paths and test ids stay. Tests: move their DOM drivers to our components (`.p-menu-item-label`, `.p-toast-message`, mocks of the old library) and keep every assertion. When a test fails because a guarded behaviour is gone, the behaviour comes back.
- **Check the view before the next one:** type check, its tests, the audit on its files, the states check on its route, and its screenshots (light and dark, 1920, 1440 and 390, every dialog open). Review each screenshot for boxes in boxes, blank gaps, mixed sizes, misalignment, clipped text, filler text and anything that differs from the examples. Fix, shoot again, then mark it done in the list.
- **Parallel agents:** split by module; each edits only its module and its i18n files and uses the shared parts as they are. Run type checks, test runs and browsers one at a time across agents (a shared lock file): parallel heavy runs exhaust memory.
- **Gaps in our system:** when this procedure, the guide, a block or a component didn't say what to do, write it in the report («MCP corrections»: what was missing, the change it needs) instead of inventing a local pattern.

## 6. Finish

- Run the audit until it reports `legacyFree: true`. Then remove PrimeVue or Vuetify, its theme and preset, and PrimeIcons or MDI from `package.json` and the setup; build and run the whole test suite again.
- Run the states check on the running app, on every route: `node <plugin root>/scripts/ui-states.mjs <app URL> <routes...> --login <hook.mjs> --theme-key <key>`, or `--config states.json` with the same options. The login hook is a module whose default export, `async ({ page, context, baseURL })`, signs in once; `--theme-key` is the localStorage key the app reads for light and dark (or `--dark-class` with the classes it puts on `<html>`). By default it runs both themes at 1920 × 1080, 1440 × 900 and 390 × 844. On each page it opens every menu, popover, select, combobox, tooltip, dialog and sheet of our components and fails on clipped or wrapped labels, overlays off screen, sideways scrolling, text under 14 px, targets under 24 px, button heights off the scale (36 px, 32 px in dense rows, 40 px in dialog footers, 44 px on touch screens) or mixed in one row, and console or page errors.
- Open the failure screenshots (`ui-states/`, failing elements outlined) and look at every one yourself before reporting. Fix the screen or the component use, never the check.
- Done means `legacyFree: true` from the audit and `statesFree: true` from the states check, on every route, in both themes, at desktop and phone width. A redesign that skips either is not finished.
- Check the keyboard, focus and the loading, empty and failure states in the running app. Report what was not verified and the owner decisions the guide overrode.
