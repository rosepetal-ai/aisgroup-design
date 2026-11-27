# @aisgroup/design-lint

The AIS Group product UI rules for an app: in the editor and `eslint` through ESLint presets, at commit and in CI through the audit with a baseline, and in the browser through the states check. Every ESLint rule is a rule of the audit's table, so the editor, the audit, the agents' plugin hooks and CI report the same findings with the same fixes.

## Set up an app

```sh
npm install -D @aisgroup/design-lint
npx design-lint init                   # lists what it would write; changes nothing
npx design-lint init --write
```

`init` adds:

- `eslint.config.js` with the rules, when the app has no ESLint config. With a config of its own, it prints the two lines to add.
- The scripts `lint:ui` (the audit against `.ui-baseline.json`: the same rules ESLint shows in the editor, failing only on new findings) and `check:ui` (the states check, configured in `ui-states.json`).
- `.ui-baseline.json`: today's findings, so only new ones fail while an app moves onto the package.
- `.github/workflows/ui-checks.yml`: `lint:ui` on every pull request, and the built app in a browser at 1920, 1440 and 390 px wide in light and dark, with the screenshots kept.
- The UI section of `AGENTS.md` (and of `CLAUDE.md` where it exists), which points agents at the AIS Group Design plugin.

A second run changes nothing.

## ESLint

```js
import design from '@aisgroup/design-lint'

export default [
  // the app's own config: eslint-plugin-vue, typescript-eslint…
  ...design.configs.recommended,
]
```

`recommended` fails on errors and warns on checks (candidates to look at, such as 12 px text). `migration` has the same rules as warnings. Vue and script files keep the app's parsers; stylesheets, i18n JSON and `package.json` are read as text, so put the presets last. Files under `components/ui/` and `components/blocks/` are the package's own components: they are only checked for being its current version.

## Commands

- `design-lint audit [--baseline <file>] <files or folders...>`: the audit. Without a baseline it fails while any finding or foreign UI kit remains; with one, only on findings that are not in it.
- `design-lint sync [<src>] [--write]`: brings the app's copies of the package's components (`components/ui`, `components/blocks`) to the package's current version, and adds the parts an update needs. Without `--write` it only lists them. The audit and ESLint report a copy that differs (`stale-component`): an older copy keeps bugs the package has fixed, and a change belongs in the package, not in the copy.
- `design-lint states --config ui-states.json`: opens every route in a browser at 1920 × 1080, 1440 × 900 and 390 × 844, in light and dark, opens the menus, dialogs and overlays of our components, and fails on clipped labels, sideways scrolling, text under 14 px, small targets, button heights off the scale and console errors. Needs Playwright. `ui-states.json` holds `baseURL`, `routes`, and `login` (a module whose default export signs in once) when the app needs a session.
