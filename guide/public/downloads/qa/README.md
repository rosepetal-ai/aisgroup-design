# Brand check

`brand-check.js` checks a rendered page against the brand guide. Load it into any page (website, landing page, HTML email, slide export) and run it:

```js
const report = await aisBrandCheck(); // { pass, findings: [{ rule, where, detail }] }
```

From Playwright:

```js
await page.addScriptTag({ path: 'brand-check.js' });
const report = await page.evaluate(() => aisBrandCheck());
```

Load axe-core 4.13.0 first and the report also includes WCAG 2.2 AA violations. Run it at 1440 px and 375 px wide. A page ships with no findings.

| Rule | Fails when |
| --- | --- |
| `overflow` | The page scrolls sideways |
| `broken-word` | A word, range or file name breaks across lines |
| `spill` | An element sticks out of a box that does not scroll |
| `font` | Text is set in anything but Inter or JetBrains Mono |
| `text-size` | Text is smaller than 12 px |
| `colour` | A text or background colour is not a palette token |
| `glyph` | Typed arrows, ticks, bullets or emoji appear outside code; use Lucide icons |
| `alt` | An image has no `alt` attribute |
| `a11y:*` | axe-core reports a violation |

Mark third-party embeds `data-brand-check="skip"` to exclude them.

## Type and hover checks

`npm install` once, then run against any page:

```sh
node type-check.mjs <url> [width]    # lists visible text that matches none of the ten type styles
node hover-audit.mjs <url> [width]   # hovers every link and button, groups the distinct behaviours
```

Neither script sees open menus, focus or theme changes: screenshot those states in every theme before release.

## Language check

```sh
node language-check.mjs <folder of built pages>   # e.g. ../../../site/dist
```

Checks the Localisation conventions that spell checkers miss: % and thousands in Spanish and Catalan, the punt volat, typographic apostrophes, vós, British -ise spelling, written-out negatives and listed anglicisms. Each page is checked by the rules of its `<html lang>`; passages marked in another language are skipped. When a hit is a deliberate example of a wrong form (the guide quotes several), record it in `language-check.allow.json` under the page’s path instead of changing the text. Run LanguageTool and the Hunspell dictionaries as well: this check does not replace them.
