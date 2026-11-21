# Colour

The palette defines brand colour, status and data colours.

## Core colours

Eight colours carry the brand in every website, document, presentation, post and campaign: four blues and four neutrals. Every other colour in those pieces is a step of their scales or a status colour. Each blue has one job, so they never compete: brand blue says who we are, deep blue gives depth, action blue says «click», and light blue highlights on blue.

- **Brand blue** `#17356E`: Logo, primary buttons, brand surfaces
- **Deep blue** `#10254C`: Deep sections, footers, button hover
- **Action blue** `#3664B3`: Links and text actions
- **Light blue** `#A7BFE4`: Highlights and links on blue
- **Text** `#0F1729`: Headlines and body text
- **Secondary text** `#4B5563`: Intros, captions, metadata
- **Section grey** `#F1F5F9`: Alternate section backgrounds
- **White** `#FFFFFF`: Pages, text on blue, reversed logo

## Combinations

The four approved backgrounds and what goes on each. Every text pairing passes WCAG AA.

See them on [the live guide](https://design.aisgroup.ai/en/colour/#combinations).

## Status

- `#15803D` success: Success
- `#D97706` warning: Warning
- `#DC2626` danger: Error

On dark backgrounds, the same three states use their dark-mode steps:

- `#4ADE80` success-dark: Success, dark
- `#F59E0B` warning-dark: Warning, dark
- `#F87171` danger-dark: Error, dark

Status colours belong to interfaces, charts and inspection results. They always come with a word or an icon, so colour is never the only signal, and they never decorate.

## Balance

| Theme | Ground | Accent |
| --- | --- | --- |
| Light | White and section grey, about 70% | Blue, about 30% |
| Dark | Deep blue or night, about 70% | White and light content, about 30% |

These guide the graphic areas, not individual pixels; photographs do not count.

## Contrast

Ratios follow WCAG 2.2. Body text needs at least **4.5:1**; large text, 24 px or 18.7 px bold (14 pt), needs **3:1**. The app’s key pairs, in light and dark mode, are on [Light and dark themes](themes.md#contrast).

See them on [the live guide](https://design.aisgroup.ai/en/colour/#contrast).

## Interface colours

Product interfaces, charts and dark mode need finer steps. They come from the same two scales, so they always stay in the family. Pick them by role first; the scales are the reference. Each role is a token of `@aisgroup/design`, shown here in both themes; every token, its contrast and where each theme applies are on [Light and dark themes](themes.md).

### Roles

- Primary button (`--primary`): `#17356E` light, `#7C9FD7` dark
- Primary button, hover (`--primary-hover`): `#10254C` light, `#A7BFE4` dark
- Links, text actions and focus rings (`--info`): `#3664B3` light, `#7C9FD7` dark
- Text (`--foreground`): `#0F1729` light, `#F1F5F9` dark
- Secondary text (`--muted-foreground`): `#4B5563` light, `#94A3B8` dark
- Page background (`--background`): `#FFFFFF` light, `#0B1220` dark
- Page behind the cards (`--page`): `#F1F5F9` light, `#0B1220` dark
- Cards, popovers and menus (`--card`): `#FFFFFF` light, `#111A2E` dark
- Dividers and borders (`--border`): `#E2E8F0` light, `#1E293B` dark
- Top bar (`--topbar`): `#17356E` light, `#111A2E` dark
- Highlights on blue (`--brand-muted`): `#A7BFE4` light, `#A7BFE4` dark
- Success (`--success`): `#15803D` light, `#4ADE80` dark
- Warning (`--warning`): `#D97706` light, `#F59E0B` dark
- Error (`--destructive`): `#DC2626` light, `#F87171` dark
- First chart series (`--chart-1`): `#3664B3` light, `#517FC9` dark

### Blue scale

- `#EDF2FA` blue-50: Soft surface
- `#B8CDE6` blue-100: Info tint
- `#A7BFE4` blue-200: Light blue
- `#7C9FD7` blue-300: Dark action
- `#517FC9` blue-400: Dark chart
- `#3664B3` blue-500: Action
- `#1E4591` blue-600: Action hover
- `#17356E` blue-700: Brand
- `#10254C` blue-800: Deep section
- `#111A2E` blue-900: Dark card
- `#0B1220` blue-950: Dark page

### Neutrals

One slate family for text, lines and surfaces. Its cool cast belongs with the blue; never mix in warm or pure greys.

- `#FFFFFF` neutral-0: White
- `#F8FAFC` neutral-50: Navigation
- `#F1F5F9` neutral-100: Section
- `#E2E8F0` neutral-200: Divider
- `#CBD5E1` neutral-300: Strong divider
- `#94A3B8` neutral-400: Dark muted text
- `#64748B` neutral-500: Field border
- `#4B5563` neutral-600: Secondary text
- `#334155` neutral-700: Dark field border
- `#1E293B` neutral-800: Dark surface
- `#0F1729` neutral-900: Text

## Data and illustration colours

Charts and product interfaces need more colours than the brand: chart series, tags, defect classes, dataset splits. Those are the six **data colours** (`--ais-data-1` to `-6`), validated for colour-blind readers and contrast and taken, like everything else, from the Rosepetal design system. They appear only in charts, product interfaces and data graphics, never in logos, layouts or as decoration. See [Data visualisation](data.md).

Illustrations use the neutrals for materials and colour only for meaning: blue for the camera signal, and the dark-mode success and error colours for pass and reject.

## Print

HEX and sRGB are the digital reference. Print references: use the RGB and hex values; Pantone and CMYK equivalents are not defined. Specify a blue ink matched to `#17356E`. Black appears only as the black logo, when a job can print nothing else.
