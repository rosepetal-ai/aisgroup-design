# Product UI audit

Source rules: product-ui/references/using-components.md and pages.md; design-language/references/accessibility.md and themes.md.

## From the code

Run `scripts/ui-contract.mjs audit` on the app's `src` or the changed Vue, CSS and i18n files. Its families:

- **template**: literal colours, stock palette classes, radius overrides and raw radii in CSS, middle dots and Unicode arrows (templates, script strings and i18n values), capitals and letter-spacing on product text (`caps`; keyboard keys, shortcuts and `code` excepted), icons in dialog footer buttons, dialogs that never close on a click outside, Sign out in the account menu.
- **foreign-ui, foreign-icons, foreign-theme**: PrimeVue, Vuetify and other kits, their icons and their themes; each finding names its migration map.
- **brand-name, logo-file**: names not written as the guide writes them, and logo files that are not the official ones.
- **page-composition**: boxes inside boxes, a bordered box around a table, dashed boxes, an icon tile beside a title, rows of identical figure tiles.

Small text and side-by-side grids with `items-start` are checks: candidates to look at, not failures. Comments and data strings can produce candidates; open each one before calling it a violation.

## In the browser

The code cannot prove contrast, sizes on screen, clipping or keyboard use. Run `scripts/ui-states.mjs` on the running app (ui-unify/references/redesign.md, step 6): it opens every menu, popover, select, tooltip, dialog and sheet on each route, in both themes, at 1440 and 390 px, and fails on clipped or wrapped labels, overlays off screen, sideways scrolling, text under 14 px, targets under 24 px, button heights off the scale or mixed in one row, and console errors. Look at every failure screenshot yourself.

Report file and line, source rule, evidence and fix; list the checks that did not run as unverified.
