# Pages

## Keep it simple

- One purpose per page, the plainest layout that serves it.
- Start from the component’s example in this guide, and for a whole page from the [page layout](https://design.aisgroup.ai/en/components/page-layout/) examples: list, detail, settings, dashboard, empty, no permission and error. The screen matches them.
- Sentence case for every title, label and button. No uppercase and no letter-spaced labels.
- No eyebrows, taglines, helper footnotes, subtitles that repeat the title or secondary labels. If a screen only makes sense with them, fix the layout.
- Items in a line are joined with commas or shown as a list, never with middle dots.
- Colour marks a status or a colour the user chose, always with words. No tinted backgrounds, strips or accent borders.

## Product surfaces and alignment

Decorative icon boxes are forbidden throughout product UI. A meaningful glyph sits directly on its surface. An icon that performs an action belongs in a named button with a visible focus state.

- Use the neutral page canvas and the card surface for tables and cards. Image and text cards use the same outer surface in each theme, including while an image loads or fails.
- Give adjacent inputs, pickers and search fields the same resting fill in each theme. In a compound field the outer control paints the fill once.
- Use the shared header inset for a text-only table heading. Reserve indentation for row controls and nested content. Keep related filters together when the screen widens.
- Group short figures together. Give long lists their own space so they do not stretch every summary card. Switch layouts using the width available after a detail panel opens.
- Use a count badge with the notification bell. In tabbed popovers the active underline is enough. Check the avatar’s full circular outline on both edges at the rendered size.

## Page header

PageLayout gives every page its header: the title, at most one muted line and the actions at the right.

- The title names the page («Users», «Dashboard»). A detail page takes the name of what it shows («Laura Vidal»).
- The muted line carries a fact («8 people can sign in»), not a description of the page. Leave it out when there is none.
- Never an icon tile, a greeting, a role, a badge or a count beside the title.
- A module with several sections: in an app with a sidebar, the sections are the sidebar’s second level under the module and the title names the section. PageLayout’s side menu (`#nav`) is for apps without a sidebar.

## Sections

Content starts under the header and uses the page’s width. Sections follow one another with space between them (`flex flex-col gap-10`), never with a line or a box around them.

- A section header is the pattern in [«Compose, do not restyle»](using-components.md#compose-do-not-restyle): h2, at most one muted line, actions at the right.
- A summary with its action goes in a side column at the right: `grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]`.
- Sections side by side are Cards in `grid gap-4 xl:grid-cols-2`, as tall as their row ([Using the components](using-components.md)).
- Facts are a label-over-value grid; lists are rows divided by lines (`divide-y border-y`), the only lines on a page.

## One surface level

The page, then cards. Cards are for sections side by side, clickable entities, a summary and floating panels.

- Never a card or a bordered box inside a card. Inside a card, use rows divided by lines or a label-over-value grid.
- A table sits straight on the page, under its toolbar, or in the Card of its section. Never in a bordered box of its own.
- On the grey page, the toolbar’s fields take `bg-card`.

## Lists and tables

The list page is the toolbar (search, filters whose choices show as chips, the visible columns), the DataTable under it and the numbered pages under the table, all straight on the page, as in the [page layout](https://design.aisgroup.ai/en/components/page-layout/) tasks example. A role or a category is plain text, a status is a toned icon and the word, and the row actions sit behind the more button.

## Empty, no permission and errors

| Case | Use |
| --- | --- |
| Nothing yet, or no results | An Empty in the place of the list, as tall as the content it stands for, with the way out |
| No permission for the page | An Empty filling the content: the reason and who can help. The title stays. |
| The page could not load | An Empty filling the content: what failed, and Retry |
| One section could not load | An Alert with Retry in that section; the rest of the page stays |

Use a plain Empty with a title and an available recovery action. Keep a spinner for loading or a bare status glyph when it communicates a distinct state.

## Dashboards

- The title is «Dashboard» or the product’s own name for it. No greeting and no role.
- The figures go first, in the Figure cards block: label, value and an optional detail line, up to four in a row. Figures that belong together share one block; a second group starts its own row.
- Then one Card per subject, with its title, one line and its action, and real content: rows, a bar with its numbers or a chart. Cards side by side share the height of their row.
- Never figures laid out by hand, or a footnote about customising the page.

## Common defects

A screen that shows any of these is not finished:

- An icon on a tinted tile beside the page or section title.
- A greeting as the page title («Hello, Owner»), or a role pill beside it.
- A grid of identical cards, each with an icon, a label and a big number.
- A card inside a card, or a table in a bordered box of its own.
- A dashed box with one line of text and the page blank below it.
- Coloured pills for roles or categories that are not a status.
- Items joined with middle dots.
- Small uppercase, letter-spaced labels above sections.
- A helper footnote under the content that explains the screen.
- A subtitle that repeats the title, or a description under every section.
- Decorative colour: tinted backgrounds, coloured strips, accent borders.

`ui-contract.mjs audit` finds most of them (the page-composition family and the caps and separator rules). Look at the running screen for the rest.
