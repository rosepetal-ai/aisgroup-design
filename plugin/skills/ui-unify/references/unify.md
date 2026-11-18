# Unify an existing product UI

Use product-ui/references/using-components.md and registry/package code as the target; choose the relevant Vue adapter only after reading package.json. For a whole app on PrimeVue, Vuetify or its own styles, follow [redesign](redesign.md). Audit and inventory the current screen first. Preserve behaviour, image/dataset cards, content and state transitions while replacing one component family. Run the actual application build and tests, inspect both modes and test keyboard/async states. There is no automatic codemod; the browser check is `ui-states.mjs` ([redesign](redesign.md), step 6). Do not claim a check ran without its output.

## Take the product, not only the parts

The guide and the package are the target. A product already on them is an example of applying them, not a layout to copy: each app keeps the layout its own content needs. Use a block wherever one fits (TopBar with light and dark mode, PageLayout, LoginPage, ConfirmDialog) before composing your own. When the app’s own design notes disagree with the package, the package wins: rewrite the notes.

Before calling a screen done, check it against product-ui/references/using-components.md, in particular:

- borders and the pointer on buttons come from the package’s base styles (a version that has them), not the app;
- a selected row or item is `bg-muted font-medium`; status is a toned icon and the word;
- dialog footer buttons are text only; a dialog closes on a click outside or Esc, except while its action runs;
- the account menu ends with Log out;
- Cards side by side share their row’s height;
- corners and colours come only from the package tokens, and `ui-contract.mjs audit` reports nothing but checks.

When one finding is fixed, search the app for every other instance of it. Look at each changed screen in a browser, in light and dark, against the guide; when the app needs a sign-in you cannot do, say which screens were not seen.
