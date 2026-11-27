# Websites

Apply the brand system to website layout, content and navigation.

## Shared foundations

| Element | Specification |
| --- | --- |
| **Grid** | Content up to 1440 px wide, fluid 24–64 px margins, 12 columns and four breakpoints. See [Layout and shape](../../design-language/references/layout.md). |
| **Split button** | The call to action: 44 px tall on every site, in the header, in cards and on the page; square corners, label plus a separate 44 px arrow segment. |
| **Controls** | Header buttons and menus 44 px tall; form fields 48 px. Every target is at least 44 × 44 px. |
| **Header** | 76 px tall, in the page colour over a 1 px rule. Logo; navigation; on the right the actions: an optional secondary action as text, then the compact split button. No theme toggle. |
| **Logo in the header** | The official file only. AIS lockups 44 px tall, in black; Rosepetal wordmark 27 px tall (140 px wide), 25 px (130 px, its minimum) on phones, in blue. See [Logos](../../ais-brand-guidelines/references/logos.md#on-websites). |
| **Links and hovers** | One behaviour per kind, the same on every site. See [Motion](../../design-language/references/motion.md#links-and-hovers). |
| **Text styles** | The same role uses the same style on every site. See [Typography](../../design-language/references/typography.md#same-role-same-style). |
| **Tables and text blocks** | `.ais-table`, `.ais-figures`, `.ais-quote` and `.ais-note` from `@aisgroup/web/styles.css`, as [Documents and presentations](../../digital-documents/references/communications.md#table) sets them. Never a table on a blue band. |
| **Headlines** | Display (44–72 px) on the home page and campaign openers only, Title on phones under 600 px; Title (34–56 px) on every other page. See [Typography](../../design-language/references/typography.md). |
| **Section spacing** | `--ais-space-section` in total between two sections, never on both sides of each. |
| **Openers** | Full-bleed photo or video up to a 1920 px window, then centred; never cropping the subject. |
| **Footer** | Brand block, three link columns, legal row, and the «Part of AIS Group» line. Light sites use deep blue `#10254C`; dark sites continue the page background under a 1 px hairline, with no colour block. |
| **Cookie notice** | One component on every site: the full-width ink bar (`#0F1729`) fixed at the bottom, with the same colours and buttons in every theme. See [Website components](web-components.md#cookie-notice-and-event-card). |
| **Event and announcement cards** | On light sites, brand blue `#17356E` with a 1 px blue-600 `#1E4591` border, light-blue `#A7BFE4` eyebrow and icons, white title and neutral-200 `#E2E8F0` details. On dark sections and Rosepetal’s dark previews, a white tile. Square; never the footer colour. Shown only after the cookie choice, never together with it. |
| **Tab titles** | «Page title \| Brand», for example «AIS REV 360 \| AIS Vision Systems». No dashes, middle dots or brand-first titles. |
| **Favicons** | The bare mark from the website set: blue `#17356E` in light mode, white in dark mode, pixel-snapped at each size. See [Logos](../../ais-brand-guidelines/references/logos.md#favicons). |
| **Corners** | Square: buttons, fields, cards, menus, notices, photographs and films. A product screen shown as a window takes the window’s 4 px corner. See [Layout and shape](../../design-language/references/layout.md#shape). |
| **Motion** | Headline reveals, a fixed header during page transitions, 3 px arrow hovers. See Motion. |

The sites differ in mood, not in parts. When the same element exists on more than one site, it is built the same way. All three are light.

| Element | AIS Group | AIS Vision Systems | Rosepetal |
| --- | --- | --- | --- |
| **Header logo** | AIS Group, black, 44 px | AIS Vision Systems, black, 44 px | Rosepetal, blue, 27 px |
| **Header actions** | Contact | Language picker, Contact | Request access (text), Book a demo |
| **Page ending** | Closing band in brand blue | Closing band in brand blue | Closing band on the home page; on the page, under a 1 px rule, elsewhere |
| **Evidence** | The companies | Product photography, installations | Product films, screens, isometric figures |
| **Languages** | English | English, Spanish, Catalan and more | English |

## AIS Vision Systems

Hardware, presented as a precise industrial catalogue.

- **Light:** white and section grey (`#F1F5F9`), with deep blue (`#10254C`) for dark sections and the footer, and brand blue (`#17356E`) for the closing band.
- **Actions:** split buttons in brand blue (`#17356E`) with white labels, darkening to blue-800 `#10254C` on hover; links in action blue (`#3664B3`), darkening to blue-600 `#1E4591` on hover.
- **Evidence:** product photography and installations; the AIS REV 360 family carries the visual weight.
- Multilingual: English, Spanish, Catalan and more, each localised.

## Rosepetal

Software, on the same light pages as AIS, where the product screens carry the colour.

- **Light:** white, with neutral-50 `#F8FAFC` behind pictures and section grey `#F1F5F9`; ink text `#0F1729`, secondary text neutral-600 `#4B5563`, the deep-blue footer.
- **Actions:** split buttons in brand blue (`#17356E`) with white labels, deep blue `#10254C` on hover; links in action blue (`#3664B3`), blue-600 `#1E4591` on hover.
- **Evidence:** [product films](web-components.md#product-film), product screens shown as windows, and isometric figures of where the software runs (line, cabinet, operator panel).
- **Dark themes** stay as previews through `?theme=`, not as a choice for visitors: there is no theme toggle.

## AIS Group

Corporate and multi-brand. It introduces the companies and sends visitors to them, with the brand blue as its main surface and the five logos treated as equals.

## Checklist before publishing

- One H1 per page, in the correct tier.
- Every image has alt text in the page’s language.
- Contrast passes at 4.5:1 for body text (see Colour).
- The page works with reduced motion and with a 390 px wide screen.
- Pages are served with `Cache-Control: no-cache`; hashed assets are cached for a year.
- The [brand check](../../../brand/downloads/qa/brand-check.js), `type-check.mjs` and `hover-audit.mjs` pass on every template; see [Accessibility](../../design-language/references/accessibility.md#testing).
- Every hover, open menu, focus state, mobile menu and overlay is screenshotted in every theme. The scripts cannot see states.
