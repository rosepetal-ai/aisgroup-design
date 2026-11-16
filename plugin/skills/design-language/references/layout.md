# Layout and shape

**Scope.** The grid, the breakpoints and the section spacing apply to websites and documents. Product interfaces (the Rosepetal app, the Profiler and the Node-RED panels) are full width and follow the [Using the components](../../product-ui/references/using-components.md) page: Tailwind breakpoints, 36 px toolbar buttons and the product type scale; Node-RED panels keep the FlowFuse grid and breakpoints. The spacing tokens, corners, shadows, borders and focus ring apply to both.

## Space

A 4 px base on an 8 px rhythm. The token name is the multiple of 8 px, so `--ais-space-100` is 8 px and `--ais-space-300` is 24 px.

| Level | Tokens | Use |
| --- | --- | --- |
| **Inside a component** | 050 to 300 (4–24 px) | Icon to label, button padding, card padding, list rows |
| **Between blocks** | `--ais-space-block`, 40–64 px | Between a heading group and its content, between rows of cards |
| **Between sections** | `--ais-space-section`, 64–128 px | Between page sections; fluid from 375 to 1440 px |

**The space between two sections is `--ais-space-section` in total.** Give it to one side of each section, or set it as the gap between them; padding every section top and bottom doubles it into empty bands.

Related things sit closer than unrelated ones. Space above a heading is always larger than the space below it, so the heading belongs to what follows.

## Grid

Content is at most 1440 px wide, with fluid side margins (`--ais-gutter`, 24–64 px) and a 12-column grid with 16–24 px gaps (`--ais-grid-gap`). Running text is 68 characters wide by default (`--ais-measure`) and never more than 75, even inside a wide column.

| Layout | Columns at 1200 px and up |
| --- | --- |
| **Text with a figure** | 7 + 5, text first |
| **Cards** | 4 + 4 + 4, or 3 + 3 + 3 + 3 for compact cards |
| **Two equal halves** | 6 + 6 |
| **Long text** | 8, starting at column 1 or 3 |

**Full-bleed openers.** A photograph or video that opens a page runs the full width of the window up to 1920 px, then stops growing and sits centred on a neutral margin. It never crops the subject.

## Breakpoints

| Name | From | Columns | Typical screens |
| --- | --- | --- | --- |
| **Base** | 0 | 4 | Phones |
| **sm** | 600 px | 8 | Large phones in landscape, small tablets |
| **md** | 900 px | 12 | Tablets, small laptops |
| **lg** | 1200 px | 12 | Laptops and desktops |
| **xl** | 1440 px | 12 | Wide screens: content stops growing, margins grow |

Write styles mobile-first with `min-width`. Components that live in different column widths adapt with container queries, not page breakpoints. Type is fluid, so no breakpoint exists just to change a font size.

## Print documents

A4 pages use their own grid: 15 mm margins, 12 columns of 10.4 mm with 5 mm gaps, and a 3 mm bleed on the PDF with text at least 5 mm inside the trim.

Type is Inter 400, 500 and 600, body at 10.5 pt and nothing under 8.5 pt.

Calm pages use white space instead of rules: a hairline only where a list needs one, one accent colour, no frame around a frame.

The logo signs the piece at 20 mm (AIS Vision Systems) or 38 mm (Rosepetal); a business card carries it at 18 mm.

A piece ends with one closing block.

The parts of a brochure are in the [Marketing kit](../../resources-assets/references/kit.md#print-system).

## Shape

Square is the brand’s default: it matches the logos, the buttons and the overlay kit. Websites, documents and marketing round only what is round in reality; product interfaces take their corners from `@rosepetal/design`.

- **Websites are square everywhere**, including cards, dropdowns, menus, dialogs, notices and cookie bars, so every edge lines up with the square buttons and the grid.
- **A product screen shown as a window** is the one exception: a screenshot or screen film in its 1 px frame takes the window’s 4 px corner (`--ais-radius-md`), because a window is round in reality, and may float on the raised shadow. The picture is never rounded on its own; photographs and footage stay square.
- **Product interfaces** take their corners from `@rosepetal/design`: the package is the reference for its components. It sets `--radius` (8 px) and `--radius-modal` (12 px, dialogs), and every component’s corner follows from them. Use its components and classes as they are; never type a radius or override one.
- One radius per component, and never two systems on one screen: a website never borrows the product’s rounded corners, and a product screen never squares a package component.
- Nested corners follow the outer one: in product, the package’s scale gives inner elements the smaller step; in square layouts, everything inside stays square.
- Never use pill shapes for buttons or tags, and never round a photograph.

## Elevation

Three levels. Borders do the work on the page; shadows only mark something floating above it.

- Cards, sections and tables are flat with a 1 px border (`--ais-border`, `#E2E8F0`). They never gain a shadow or lift on hover.
- Menus, dropdowns and popovers are raised (`--ais-shadow-raised`); dialogs and toasts sit on the overlay level (`--ais-shadow-overlay`) above a dimmed page.
- In dark interfaces, elevation comes from surface steps (`#0B1220`, `#111A2E`) and a 1 px `#1E293B` border, not from shadows.

## Borders and focus

| Token | Value | Use |
| --- | --- | --- |
| `--ais-border` | 1 px `#E2E8F0` | Dividers, cards, tables |
| `--ais-border-strong` | 1 px `#64748B` | Form fields and other control outlines, which need 3:1 against their background |
| `--ais-focus-ring` | 2 px `#3664B3` with a 2 px white gap | Every interactive element on keyboard focus (`:focus-visible`) |

The focus ring is never removed or recoloured, and it appears instantly.
