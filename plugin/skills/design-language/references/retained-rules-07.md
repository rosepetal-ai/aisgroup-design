# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-36e390194b0a

<!-- AIS-36e390194b0a -->
Every value below is read from `packages/design/styles.css` when the guide is built. Under each token, the package’s own note on its use.

Source: guide/src/content/guide/en/themes.mdx:32.

## AIS-2da765b37c57

<!-- AIS-2da765b37c57 -->
The palette scales (blue 50–950, neutral 0–900 and the status and data hues) have one value each; dark mode only points the tokens at other steps. See [Colour](/en/colour/).

Source: guide/src/content/guide/en/themes.mdx:42.

## AIS-2a508af53335

<!-- AIS-2a508af53335 -->
WCAG 2.2 AA: 4.5:1 for text, 3:1 for icons and field borders. Computed from the tokens above.

Source: guide/src/content/guide/en/themes.mdx:46.

## AIS-5c4bebd53c4f

<!-- AIS-5c4bebd53c4f -->
The same components in both themes. Every component page has a light and dark switch above its previews.

Source: guide/src/content/guide/en/themes.mdx:52.

## AIS-81702cf57fbf

<!-- AIS-81702cf57fbf -->
**Logos:** blue on light grounds, white on brand blue, navy and the dark theme. The app’s top bar carries the white logo in both themes: brand blue in light, the dark card in dark.

Source: guide/src/content/guide/en/themes.mdx:58.

## AIS-da71610213e0

<!-- AIS-da71610213e0 -->
**App icons and app favicons:** the white mark on the brand-blue tile, the same in both themes.

Source: guide/src/content/guide/en/themes.mdx:59.

## AIS-09162dc8d195

<!-- AIS-09162dc8d195 -->
**Website favicons:** the bare mark, blue in light mode and white in dark mode.

Source: guide/src/content/guide/en/themes.mdx:60.

## AIS-ddfc0f68a7b7

<!-- AIS-ddfc0f68a7b7 -->
Files and sizes are on [Logos](/en/logos/#favicons).

Source: guide/src/content/guide/en/themes.mdx:64.

## AIS-cc0a90bf175b

<!-- AIS-cc0a90bf175b -->
The chart toolkit has a light and a dark Vega-Lite config and a light and a dark ECharts theme. The dark ones set the night ground, light text and the dark data steps: the first series `#517FC9` and violet `#A855F7`; orange, cyan, pink and teal stay the same. See [Data visualisation](/en/data/).

Source: guide/src/content/guide/en/themes.mdx:68.

## AIS-fa0869b6ec91

<!-- AIS-fa0869b6ec91 -->
**Photographs and renders** are the same in both themes; never darken, tint or invert them.

Source: guide/src/content/guide/en/themes.mdx:74.

## AIS-839a31f5c593

<!-- AIS-839a31f5c593 -->
**Product screens** in marketing show the app in light mode, as the websites do. A dark screen goes only in a piece that is dark as a whole, and one piece never mixes the two.

Source: guide/src/content/guide/en/themes.mdx:75.

## AIS-7b49c9f0279d

<!-- AIS-7b49c9f0279d -->
**Detection overlays** keep their kit colours and switch to the light steps only on dark pictures (see [Imagery](/en/imagery/)), whatever the theme of the page around them.

Source: guide/src/content/guide/en/themes.mdx:76.

## AIS-01a238912068

<!-- AIS-01a238912068 -->
'Set all text in Inter (weights 400, 500 and 600) and code or machine values in JetBrains Mono. Use Arial only where Inter cannot be installed, and then for the whole piece.'

Source: guide/src/content/guide/en/typography.mdx:4.

## AIS-9294442883a5

<!-- AIS-9294442883a5 -->
'Websites and documents use only the ten text styles (`--ais-text-display` to `--ais-text-caption`), in documents at the point sizes below. Product interfaces use the product scale and video its own title sizes. Never invent a size, tracking or weight between them.'

Source: guide/src/content/guide/en/typography.mdx:5.

## AIS-328de5115553

<!-- AIS-328de5115553 -->
'Headlines are weight 500, sentence case, at most three lines, never all capitals. Semibold 600 is allowed only for video titles, document headings and chart titles; Bold 700 is never used for headings, except Arial Bold in email, which has no Medium.'

Source: guide/src/content/guide/en/typography.mdx:6.

## AIS-de8a6e69953e

<!-- AIS-de8a6e69953e -->
'Body text is 16 px on 1.6 leading, 68 characters per line by default and 75 at most, left aligned, never justified.'

Source: guide/src/content/guide/en/typography.mdx:7.

## AIS-99ea6543f4a5

<!-- AIS-99ea6543f4a5 -->
'Use tabular figures (`font-variant-numeric: tabular-nums`) wherever numbers line up in a column: table number cells, counters and prices. Not in running text or specification values.'

Source: guide/src/content/guide/en/typography.mdx:8.

## AIS-d4e7e3ffa752

<!-- AIS-d4e7e3ffa752 -->
'Text in chips, badges and buttons is centred on its cap height, never on the font box.'

Source: guide/src/content/guide/en/typography.mdx:9.

## AIS-da397852ebee

Historical wording: explicitly superseded by AIS-6e9225032282. Apply the dated resolution to the conflicting clause; preserve other clauses and this exact historical wording.

<!-- AIS-da397852ebee -->
Status colours (`#16A34A`, `#D97706`, `#DC2626`; solid green `#15803D`) mean status only and always come with a word or icon. Never use a colour outside the palette, and no gradients except the video night field.

Source: brand decisions.

## AIS-3cfe358f3a2a

<!-- AIS-3cfe358f3a2a -->
Balance about 70/30: light pieces are 70 % white or grey and 30 % blue. Flat brand blue alone reads as dull; alternate brand-blue and deep-blue bands instead.

Source: brand decisions.

## AIS-fd5300542e52

<!-- AIS-fd5300542e52 -->
Do not run global hex replaces across theme blocks: one can silently change another value, such as the light body grey.

Source: brand decisions.

## AIS-967ae3088d35

<!-- AIS-967ae3088d35 -->
Never retype a logo in a font. Website favicons: the bare mark on transparent, #17356E in light mode and white in dark mode (one SVG with prefers-color-scheme, plus light and dark PNGs), aligned with the tab text; AIS sites use the Λ, rosepetal.ai the Rosepetal «o» (`public/logos/favicons/<brand>/`, `public/web/<site>/`). No em dash in tab titles.

Source: brand decisions.

## AIS-362a05b44b2b

<!-- AIS-362a05b44b2b -->
Devices: the inspection frame (corner brackets, label, verdict), mono overline + hairline, masked type reveal, blue wipe, counting figures, night field (video only), the hexagon. The engine draws them; never imitate them by hand.

Source: brand decisions.

## AIS-23f087fa9d32

<!-- AIS-23f087fa9d32 -->
Pattern: an outline grid of flat-topped hexagons, hairline `#3664B3`/`#7C9FD7` at 15–30 % opacity, fading from one corner or edge, on navy or behind a text panel.

Source: brand decisions.

## AIS-15a245e92c4f

<!-- AIS-15a245e92c4f -->
Single hexagon: always holds an icon, step number or small mark. No empty hexagons.

Source: brand decisions.

## AIS-07e7d77d476e

<!-- AIS-07e7d77d476e -->
**Decorative patterns:** the five approved patterns (hexagon landscape Rolling and Dramatic, circuit globe, circuit traces and scan profiles) are decorative grounds and accents for slides, documents, web, video, posts and stands. Light, blue, deep-blue and transparent variants are allowed. One pattern per piece, never behind body text or tables. No glow or gradient fills; fading line opacity is allowed. Preserve complete cell-edge geometry.

Source: brand decisions.

## AIS-808768367a6a

<!-- AIS-808768367a6a -->
Icons inside a hexagon or tile have no background box. Loaders and icons behave alike (no backgrounds).

Source: brand decisions.

## AIS-b2e2494b0a38

<!-- AIS-b2e2494b0a38 -->
Light footer is deep blue `#10254C`. Dark sites continue the page background under a hairline, with no colour block. (guide `web.mdx`)

Source: brand decisions.

## AIS-0db3087a8fcf

<!-- AIS-0db3087a8fcf -->
Event and announcement card: on light sites brand blue with light-blue icons; it takes the opposite combination to the page.

Source: brand decisions.

## AIS-e65f09928ec5

<!-- AIS-e65f09928ec5 -->
Inconsistent variants of the same thing (many different buttons that do the same). Inconsistent hovers. Misaligned arrows and icons. Uneven section spacing.

Source: brand decisions.

## AIS-9891ab08b540

<!-- AIS-9891ab08b540 -->
**Conveyor colour:** the moving belt or chain is brown, grey or blue as appropriate; the side bars are metallic. Do not make the side bars green while leaving the belt itself metallic.

Source: brand decisions.

## AIS-39d457cfe410

<!-- AIS-39d457cfe410 -->
Illustrations explain how something works, photos prove it works. Never crop an illustration into a fragment, never use it in place of footage.

Source: brand decisions.

## AIS-551a7b50a8df

<!-- AIS-551a7b50a8df -->
One projection: 2:1 isometric, 45° azimuth and 30° elevation (`BRAND_VIEW` and `brandProjection` in rosepetal-web-static `iso-kit.ts`). Light and dark versions of every figure. Palette colours only.

Source: brand decisions.

## AIS-66d4e1d8217f

<!-- AIS-66d4e1d8217f -->
**Marketing templates: light illustrations only** (no dark versions for now). Do not use the anatomy illustrations in marketing templates: the studio's `product-figure` is **paused**, and a recipe that uses an illustration fails.

Source: brand decisions.

## AIS-a0fe113d70be

<!-- AIS-a0fe113d70be -->
Motion uses the duration and curve tokens and respects reduced-motion. No play and pause controls on purely decorative header effects. GSAP is fine for the hero. Transitions must be smooth, never bumpy.

Source: brand decisions.

## AIS-f735d2555812

Historical wording: explicitly superseded by AIS-5fbd35cd9fc7. Apply the dated resolution to the conflicting clause; preserve other clauses and this exact historical wording.

<!-- AIS-f735d2555812 -->
Mascot (Rosepetal documentation cat): a subtle wave on hover, not too much.

Source: brand decisions.

## AIS-df77debd0d1f

<!-- AIS-df77debd0d1f -->
The Rosepetal section on the AIS home uses the white Rosepetal logo instead of text. The Rosepetal band has the same top and bottom spacing as other sections. The customer-logo strip has no white rectangles behind logos.

Source: brand decisions.

## AIS-4f71e9f3f120

<!-- AIS-4f71e9f3f120 -->
Themes via `?theme=`: `charcoal`, `blue`, `brand`, `design`, `light`. The default is `light`, with no header toggle. Do not remove or rename any theme; keep both blue and charcoal.

Source: brand decisions.

## AIS-5ad23e3d5450

<!-- AIS-5ad23e3d5450 -->
Hero: a full-width video wall of real footage from all companies (Automation, Scanology, Rosepetal, AIS), in the style of picklerobot. No eyebrow text above the h1. Two-colour title only here.

Source: brand decisions.

## AIS-6eae1dec7aa0

<!-- AIS-6eae1dec7aa0 -->
logo at the foot, inner slides show only a step number in an outline hexagon at the bottom left;

Source: brand decisions.

## AIS-d6e4959a61ae

<!-- AIS-d6e4959a61ae -->
placeholders are words in the text colour with a 1 px dotted underline (`data-edit`), never [brackets];

Source: brand decisions.

## AIS-cd2367c53af8

<!-- AIS-cd2367c53af8 -->
No gradients and no glow, anywhere (stills, web, video). Fading line opacity in a pattern is fine.

Source: brand decisions.
