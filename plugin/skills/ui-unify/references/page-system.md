# Page system in a redesign

Moving the components is not the redesign: each page also takes the guide's page system. The rules are in [Pages](../../product-ui/references/pages.md) and the models are the page-layout examples (`design_code kind=components name=page-layout`: list, detail, settings, dashboard, empty, no permission, error). Use this procedure on every route, after its component families have moved.

## 1. Find the page's kind

List, detail, settings, dashboard or a tool screen. Open the matching page-layout example and keep it beside the screen: the result should look like it.

## 2. Header

- Replace the app's own header with PageLayout: title, at most one muted line carrying a fact, actions at the right.
- Remove the icon tile, the greeting, the role pill and any badge or count beside the title. Keep the data behind them if the page shows it elsewhere; say which ones you removed.
- A back link or breadcrumb the app had stays where the app keeps it (top bar or sidebar) until PageLayout offers one; never a second title row.
- A module whose pages have their own section menu: in an app with a sidebar, move the sections into the sidebar as the module's second level and title each page with its section. Keep PageLayout's `#nav` only in apps without a sidebar.

## 3. Content

- Sections: the section header pattern (h2, at most one muted line, actions right) and their content, separated by space. Remove the Card or bordered box around a section that runs the page width; sections side by side are Cards in `grid gap-4 xl:grid-cols-2`.
- One surface level: take out cards and bordered boxes inside cards, and the bordered box around a table.
- Figures: one label-over-value row on the page, or inside the Card of their subject with its real content. A grid of identical figure cards goes.
- Status as a toned icon and the word; roles and categories as plain text; no coloured pills.

## 4. States

- Every list has its Empty in the list's place, as tall as the list.
- No permission for the page and a page that fails to load: an Empty filling the content (examples 08 and 09). A section that fails: an Alert with Retry in its place.
- Remove dashed boxes that are not the Empty.

## 5. Text

Sentence case, no uppercase or letter-spaced labels, no eyebrows, taglines, helper footnotes, subtitles that repeat the title or secondary labels, and items joined with commas, never middle dots. Texts and labels the app's tests or owner decisions guard stay; list the ones the guide overrides.

## 6. Check

- `node <plugin root>/scripts/ui-contract.mjs audit src`: the `page-composition` family, `caps` and `separator` report nothing on the route.
- Look at the route in a browser, light and dark, at 1440 and 390 wide, beside its page-layout example. Go through «Common defects» in Pages; say which routes were not seen.
