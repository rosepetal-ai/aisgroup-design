# Colour

The palette defines brand colour, status and data colours.

## Core colours

Eight colours carry the brand in every website, document, presentation, post and campaign: four blues and four neutrals. Every other colour in those pieces is a step of their scales or a status colour. Each blue has one job, so they never compete: brand blue says who we are, deep blue gives depth, action blue says «click», and light blue highlights on blue.

## Combinations

The four approved backgrounds and what goes on each. Every text pairing passes WCAG AA.

## Status

On dark backgrounds, the same three states use their dark-mode steps:

Status colours belong to interfaces, charts and inspection results. They always come with a word or an icon, so colour is never the only signal, and they never decorate.

## Balance

| Theme | Ground | Accent |
| --- | --- | --- |
| Light | White and section grey, about 70% | Blue, about 30% |
| Dark | Deep blue or night, about 70% | White and light content, about 30% |

These guide the graphic areas, not individual pixels; photographs do not count.

## Contrast

Ratios follow WCAG 2.2. Body text needs at least **4.5:1**; large text, 24 px or 18.7 px bold (14 pt), needs **3:1**. The app’s key pairs, in light and dark mode, are on [Light and dark themes](themes.md#contrast).

## Interface colours

Product interfaces, charts and dark mode need finer steps. They come from the same two scales, so they always stay in the family. Pick them by role first; the scales are the reference. Each role is a token of `@aisgroup/design`, shown here in both themes; every token, its contrast and where each theme applies are on [Light and dark themes](themes.md).

### Roles

### Blue scale

### Neutrals

One slate family for text, lines and surfaces. Its cool cast belongs with the blue; never mix in warm or pure greys.

## Data and illustration colours

Charts and product interfaces need more colours than the brand: chart series, tags, defect classes, dataset splits. Those are the six **data colours** (`--ais-data-1` to `-6`), validated for colour-blind readers and contrast and taken, like everything else, from the Rosepetal design system. They appear only in charts, product interfaces and data graphics, never in logos, layouts or as decoration. See [Data visualisation](data.md).

Illustrations use the neutrals for materials and colour only for meaning: blue for the camera signal, and the dark-mode success and error colours for pass and reject.

## Print

HEX and sRGB are the digital reference. Print references: use the RGB and hex values; Pantone and CMYK equivalents are not defined. Specify a blue ink matched to `#17356E`. Black appears only as the black logo, when a job can print nothing else.
