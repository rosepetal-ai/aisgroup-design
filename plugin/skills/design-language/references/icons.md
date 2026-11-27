# Icons

Use the approved Lucide icons with consistent size, stroke and colour.

Product interfaces use bare glyphs. Remove the decorative tile behind an icon in a row, card, heading or empty state. Keep text-only labels on the normal text inset.

## The core set

130 icons for interfaces, documents, video and infographics, grouped by topic, from Lucide 1.48.0. Click an icon to open its SVG. The full library of more than 2,000 icons is at [lucide.dev](https://lucide.dev/icons/).

[All 130 icons, SVG (ZIP)](../../../brand/downloads/icons/ais-icons.zip)

## Install

| Where | How |
| --- | --- |
| **Rosepetal app (Vue)** | `npm install @lucide/vue`, then import by name: `import { DownloadIcon } from '@lucide/vue'`. This is what the Rosepetal design system uses. |
| **Websites (Astro, HTML)** | `npm install lucide-static` and inline the SVG file, or paste it from the core set. Inline SVG inherits the text colour. |
| **React** | `npm install lucide-react`, then `import { Download } from 'lucide-react'`. |
| **Figma** | The Lucide plugin from the Figma Community inserts icons as editable vectors at 24 px. |
| **Documents and slides** | Insert the SVG from the core set; Word, PowerPoint, Keynote and Google Slides keep it sharp. Recolour it to the text colour, never to a new colour. |

Keep every project on the same Lucide release line, and update all of them together, so an icon never changes shape between the website and the product.

```vue
<script setup>
import { DownloadIcon } from '@lucide/vue'
</script>

<button class="rp-btn"><DownloadIcon class="size-4" aria-hidden="true" /> Download</button>
```

## Size and stroke

| Size | Use | Stroke |
| --- | --- | --- |
| **16 px** | Buttons, table rows, inline with 14–16 px text, the product interface | 2 px on the grid (1.33 px rendered) |
| **20 px** | Navigation, inputs, menus | 2 px on the grid (1.67 px rendered) |
| **24 px** | Standalone icons, cards, lists of features | 2 px |
| **32–48 px** | Large feature icons on websites and slides | 2 px fixed: set `absoluteStrokeWidth` |

## Colour

Icons use `currentColor`, so they always match their label: ink for text, secondary text for metadata, action blue for links and actions, white on blue. Success, warning and error colours appear only when the icon means that status. Never fill an icon, never use two colours in one icon, never apply a gradient.

## With text

- The icon comes before its label, 8 px apart at every text size.
- It is centred on the label’s cap height, not on the line box, the same rule as overlay chips.
- An icon with no label needs an accessible name (`aria-label`), a tooltip and a 44 px touch target; in desktop product toolbars, a 36 px button.
- One icon per action. Do not decorate headings or paragraphs with icons.

## In infographics

Icons in infographics name the topic of a figure; the figure itself carries the message.

- Place the icon at 24 px in a 48 px square tile: blue-50 `#EDF2FA` with a brand blue `#17356E` icon on white, deep blue `#10254C` with a white icon on brand blue. Square corners, no border, no shadow.
- Without a tile, use 32 or 48 px with `absoluteStrokeWidth`, so the line stays 2 px.
- One icon per figure; a set of three uses three icons of equal visual weight.
- The figure uses the Subheading style with tabular figures; its label uses Small in secondary text.
- Figures follow the Voice page: real values with their conditions, never invented numbers.

## Meaning

| Icon | Means |
| --- | --- |
| `arrow-right` | Go to the next page or action; the arrow in text links and split buttons |
| `external-link` | Opens another website |
| `chevron-right`, `chevron-down` | Opens a level below, expands a section |
| `arrow-up-right` | Opens a document in a new view, such as a PDF or a datasheet |
| `download` | Saves a file |
| `play`, `pause` | Starts or pauses a video; the button shows the action, not the state |
| `x` | Closes or removes |
| `check`, `circle-check` | Done, passed |
| `triangle-alert` | Warning that needs attention |
| `circle-x` | Error or reject |
| `info` | Extra information |

## Never

- Unicode arrows, ticks and bullets (`→`, `✓`, `•`) or emoji: they change with every font.
- Another icon library, or icons redrawn, cropped or edited by hand.
- Filled, duotone or 3D icons.
- Icons as decoration, or more than one icon per action.
