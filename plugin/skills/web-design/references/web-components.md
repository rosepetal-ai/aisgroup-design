# Website components

Live website components, their source code and the rules for using them.

## Set up

How the three sites are built. Each is an Astro site that takes its tokens and shared components from `@aisgroup/web` (`packages/web` in this repo), the website counterpart of the products’ `@aisgroup/design`, and keeps its own pages, header and content.

1. `@aisgroup/web/styles.css` first: the brand’s tokens ([ais-tokens.css](../../../brand/downloads/ais-tokens.css), `--ais-*`), the site roles below (`--web-*`) and each brand’s settings, chosen with `data-brand` on `<html>` (`ais-group`, `ais-vision` or `rosepetal`): logo height, call-to-action size and the details that differ.
2. Tailwind v4 for layout, with its text sizes pointed at the brand styles (`--text-base: var(--ais-text-body)` and so on). The components need no Tailwind.
3. A dark section or theme sets the roles again; the components never change. Rosepetal’s own CSS reads them through its `--rp-*` names.
4. Inter, self-hosted (see [Typography](../../design-language/references/typography.md)), and Lucide icons (see [Icons](../../design-language/references/icons.md)): the arrow is 24 px in split buttons and 20 px in compact buttons and text links.

| Role | Light | Token | Use |
| --- | --- | --- | --- |
| Page (`--web-page`) | `#FFFFFF` | `--ais-neutral-0` | Page, header, menus |
| Surface (`--web-surface`) | `#F8FAFC` | `--ais-neutral-50` | Behind pictures and films |
| Section (`--web-section`) | `#F1F5F9` | `--ais-neutral-100` | Section grey |
| Ink (`--web-ink`) | `#0F1729` | `--ais-neutral-900` | Text and titles |
| Muted (`--web-muted`) | `#4B5563` | `--ais-neutral-600` | Secondary text, card meta |
| Line (`--web-line`) | `#E2E8F0` | `--ais-neutral-200` | Rules, card rules, the header rule |
| Line strong (`--web-line-strong`) | `#64748B` | `--ais-neutral-500` | Fields and outlined buttons (3:1) |
| Action (`--web-action`) | `#17356E` | `--ais-blue-700` | Primary button, closing band |
| Action hover (`--web-action-hover`) | `#10254C` | `--ais-blue-800` | Primary button on hover |
| Link (`--web-link`) | `#3664B3` | `--ais-blue-500` | Links, text actions, focus ring |
| Link hover (`--web-link-hover`) | `#1E4591` | `--ais-blue-600` | Links on hover |
| Hover fill (`--web-hover-fill`) | `#F1F5F9` | `--ais-neutral-100` | Outlined buttons and menu items on hover |

The images each site uses are in [Web assets](assets.md).

## Components

The components of `@aisgroup/web`, live and with their Astro code. Each site imports them as they are: `import SplitButton from '@aisgroup/web/components/split-button'`.

- **Arrow** (`arrow`): The arrow of split buttons, text actions and cards: 24 px in split buttons, 20 px elsewhere. [Live](https://aisgroup-design.web.app/en/web-components/arrow/)
- **Browser frame** (`browser-frame`): A product screen on a blue band: a light browser bar over the screen. Light sections use the plain window. [Live](https://aisgroup-design.web.app/en/web-components/browser-frame/)
- **Breadcrumb** (`breadcrumb`): Where a page sits, in a strip under the header. The current page is plain text. [Live](https://aisgroup-design.web.app/en/web-components/breadcrumb/)
- **Card** (`card`): One link with no box, in four layouts: stack, row, text and featured. [Live](https://aisgroup-design.web.app/en/web-components/card/)
- **Card grid** (`card-grid`): Cards in 2, 3 or 4 columns, or a list of rows. [Live](https://aisgroup-design.web.app/en/web-components/card-grid/)
- **Closing band** (`closing-band`): The end of a home page and of every AIS page: brand blue, the invitation and a white split button. [Live](https://aisgroup-design.web.app/en/web-components/closing-band/)
- **Cookie notice** (`cookie-consent`): One ink bar; Reject all and Accept all at equal weight. [Live](https://aisgroup-design.web.app/en/web-components/cookie-consent/)
- **Footer** (`footer`): Deep blue: the brand block, up to three link columns and the legal row. Each site gives its content. [Live](https://aisgroup-design.web.app/en/web-components/footer/)
- **Link card** (`link-card`): A link to a page under a rule: title, text and Read more, with an optional picture. [Live](https://aisgroup-design.web.app/en/web-components/link-card/)
- **Logo** (`logo`): A brand’s logo at its header height. [Live](https://aisgroup-design.web.app/en/web-components/logo/)
- **Split button** (`split-button`): The call to action: label and arrow segment, at the brand’s size or compact. [Live](https://aisgroup-design.web.app/en/web-components/split-button/)
- **Text link** (`text-link`): A text action with an arrow; a back link points left; in running text it is underlined. [Live](https://aisgroup-design.web.app/en/web-components/text-link/)
- **Video** (`video-embed`): A film that loads only when asked, on our own still. [Live](https://aisgroup-design.web.app/en/web-components/video-embed/)

## Actions

One filled call to action per view: the split button. The compact one goes in headers and cards. Text actions are links with an arrow. On a brand-blue band the button is white.

| Part | Split button | Compact |
| --- | --- | --- |
| **Height** | 52 px | 44 px |
| **Label** | Label style, 24 px from the left edge, 24 px to the arrow segment | 16 px and 16 px |
| **Arrow segment** | 52 px square, 24 px arrow, a 1 px divider in the label colour at 20% | 44 px square, 20 px arrow |

- **Primary:** brand blue with a white label; deep blue `#10254C` on hover and focus, blue-950 `#0B1220` while pressed. The segment stays put and the arrow inside moves 3 px (180 ms).
- **Secondary:** an outline for a second action beside the primary one: no fill, ink label, 1 px `#64748B` border; on hover the hover fill and an ink border.
- **White:** on a brand-blue band and on dark surfaces, with a brand-blue label; blue-50 `#EDF2FA` on hover.
- **Without arrow:** the label centred, 16 px each side, for an action that goes nowhere, such as a form’s Reset.
- **Disabled:** 55% opacity, no hover. **Focus:** the 2 px focus ring with a 2 px gap.

## Text links

Action blue in the Label style, with a 20 px arrow 8 px after the text; on hover and focus blue-600 `#1E4591`, a 1 px underline 4 px below and the arrow 3 px forward, without moving the layout. A back link puts the arrow on the left and moves it back. Inside running text (`p`, `li`, `dd`) a link takes the text’s size, has no arrow and is always underlined, at 40% of its colour, full on hover. Every standalone link has a 44 px target.

## Language picker

A square menu: the current language code with a chevron opens a 224 px list of every language in its own name, the current one in action blue with a check. Every link goes to the same page in the other language and carries `hreflang`. Only sites in more than one language show it.

## Breadcrumb

The site’s name comes first; the current page is plain text.

## Page opener

The H1 in Title size, never Display (Display is for the home page and campaign openers). Title on the left, intro on the right; they stack under 900 px. No eyebrow above the H1.

## Card links

A card is one link: no box, shadow or lift. Four layouts cover articles, resources, industries and lists.

| Layout | Use | Parts |
| --- | --- | --- |
| **Stack** | Grids of articles, resources and industries | Photograph at 8:5, then 24 px below: meta (date, category) in Small and muted, the title in Subheading with the arrow, the description in Body and muted |
| **Row** | Long lists | A 128 px thumbnail beside the title in Body, medium; 1 px rules between rows; two columns, one under 900 px |
| **Text** | Links without a picture | A 1 px rule on top, the title, the description and an optional text action |
| **Featured** | One lead item | Photograph at 4:3 on 7 of 12 columns, the copy on 5, the title in Heading; stacked under 900 px |

On hover and focus the title turns action blue, the arrow moves 3 px and the photograph eases to 103% (700 ms, enter curve). A product screen in a card is shown whole, in its window frame, and does not zoom. The grid has 2, 3 or 4 columns with 48 px gaps (32 px between columns under 1200 px); 4 and 3 columns drop to 2 under 1200 and 900 px, and every grid is one column under 600 px.

## Lead form

Label every field and use the shared 48 px controls. Ask for contact details, sector, role, location and the message. Privacy consent is required; marketing consent is optional. Keep the submission endpoint, integration keys and spam protection in the site’s private configuration. The preview sends no data.

## Video

YouTube films load only when asked. The frame is 16:9 with our own still, saved on the site so nothing loads from YouTube before the click, and a 64 px brand-blue play square; on hover the square turns deep blue and the still eases to 103%. A click, Enter or Space replaces it with the autoplaying youtube-nocookie player. Put the video ID in `data-video-id` and the film’s title in `aria-label` and `alt`. The package’s `VideoEmbed` does this.

## Product film

Our own films are self-hosted mp4, never YouTube: muted, with a poster, `playsinline`, loaded with `preload="metadata"`.

- **Product film:** a screen recording shown as a window: 1 px neutral-200 `#E2E8F0` border, 4 px corner, the raised shadow. It loops.
- **Industry film:** real footage, square, 16:9 on neutral-50 `#F8FAFC`, with the detections drawn over it in the [overlay style](../../design-language/references/imagery.md#detection-overlays).

A film plays only while at least 15% of it is on screen and the tab is visible, and never by itself with reduced motion. Under it, 16 px below: the current chapter on the left in Subheading, ending in a full stop, and a 44 px square play and pause button on the right, with a solid 18 px brand-blue Lucide play or pause and blue-50 `#EDF2FA` on hover.

## Closing band

Brand blue, the invitation as a Heading, one white split button to the contact page. Every home page ends with it, and so does every page of the AIS sites.

Rosepetal’s other pages end on the page: a 1 px rule, the invitation as a Heading with an optional line of muted text, and the brand-blue split button on the right; they stack on phones. They already close on product screens, so a blue band would compete with them.

## Cookie notice and event card

The cookie notice is one ink bar fixed to the bottom, the same in every theme: Settings as a quiet text action, then Reject all and Accept all, both white and of equal weight, so refusing takes no more effort than accepting. Settings opens Necessary (always on), Analytics and Marketing. Nothing that needs consent loads before the choice: analytics waits for Analytics, advertising and visitor tracking for Marketing, and films, maps and the form’s services load only when the visitor uses them. The choice is stored with the policy’s version and asked again after a year. A site that sets no such cookies shows no notice.

The event card waits until the visitor has chosen, then appears bottom right: brand blue on light pages, a white tile on dark ones, never the footer’s colour.

## On dark

A dark theme sets the same roles to the night palette; the parts stay the same, and primary buttons turn white. The sites are light: AIS uses this on its deep-blue sections and closing band, and Rosepetal keeps its dark themes as previews only (`?theme=`). Which surfaces have a dark theme is on [Light and dark themes](../../design-language/references/themes.md).

Each home page, on all three sites, has one deep-blue section mid-page: blue-800 `#10254C`, white headings, text and links in light blue `#A7BFE4`, and section grey and white alternating around it. On Rosepetal it is the workflow section. Product screens on a blue band sit in the [browser frame](/en/web-components/browser-frame/); on white and grey they keep the plain window.
