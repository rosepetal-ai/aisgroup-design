# Light and dark themes

The Rosepetal app uses light and dark themes built from the same tokens.

## Where each theme applies

| Surface | Light | Dark |
| --- | --- | --- |
| **Rosepetal app** | Default | The user’s choice, or the system setting until they choose. `.dark` on `<html>`. |
| **Websites** | Always | No dark theme and no switch. AIS uses deep-blue `#10254C` sections and a brand-blue closing band; Rosepetal’s dark themes are previews only (`?theme=`). See [Web components](../../web-design/references/web-components.md#on-dark). |
| **Print** | Always | Covers and bands in brand blue or navy, with the white logo. |
| **Presentations** | White slides | Brand-blue openings and closings. No dark deck. |
| **Social media** | White posts | Brand-blue posts and banners. See [Social media](../../marketing/references/social.md). |
| **Email** | Always | None. |
| **Charts** | White ground | Night `#0B1220` ground, in the app’s dark mode. See [Charts](#charts). |
| **This guide** | Always | None: the guide is light, and shows the dark theme in its previews. |

## Tokens

Every value below is read from `packages/design/styles.css` when the guide is built. Under each token, the package’s own note on its use.

### What changes

<details>
<summary>What stays the same</summary>

The palette scales (blue 50–950, neutral 0–900 and the status and data hues) have one value each; dark mode only points the tokens at other steps. See [Colour](colour.md).

</details>

## Contrast

WCAG 2.2 AA: 4.5:1 for text, 3:1 for icons and field borders. Computed from the tokens above.

## Components

The same components in both themes. Every component page has a light and dark switch above its previews.

## Logos and favicons

- **Logos:** blue on light grounds, white on brand blue, navy and the dark theme. The app’s top bar carries the white logo in both themes: brand blue in light, the dark card in dark.
- **App icons and app favicons:** the white mark on the brand-blue tile, the same in both themes.
- **Website favicons:** the bare mark, blue in light mode and white in dark mode.

Files and sizes are on [Logos](../../brand-guidelines/references/logos.md#favicons).

## Charts

The chart toolkit has a light and a dark Vega-Lite config and a light and a dark ECharts theme. The dark ones set the night ground, light text and the dark data steps: the first series `#517FC9` and violet `#A855F7`; orange, cyan, pink and teal stay the same. See [Data visualisation](data.md).

## Images and screenshots

- **Photographs and renders** are the same in both themes; never darken, tint or invert them.
- **Product screens** in marketing show the app in light mode, as the websites do. A dark screen goes only in a piece that is dark as a whole, and one piece never mixes the two.
- **Detection overlays** keep their kit colours and switch to the light steps only on dark pictures (see [Imagery](imagery.md)), whatever the theme of the page around them.
