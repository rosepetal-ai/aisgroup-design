# Pages

## Keep it simple

- One purpose per page, the plainest layout that serves it.
- Start from the component’s example in this guide, and for a whole page from the [page layout](/en/components/page-layout/) examples: list, detail, settings, dashboard, empty, no permission and error. The screen matches them.
- Sentence case for every title, label and button. No uppercase and no letter-spaced labels.
- No eyebrows, taglines, helper footnotes, subtitles that repeat the title or secondary labels. If a screen only makes sense with them, fix the layout.
- Items in a line are joined with commas or shown as a list, never with middle dots.
- Colour marks a status or a colour the user chose, always with words. No tinted backgrounds, strips or accent borders.

## Page header

PageLayout gives every page its header: the title, at most one muted line and the actions at the right.

- The title names the page («Users», «Dashboard»). A detail page takes the name of what it shows («Laura Vidal»).
- The muted line carries a fact («8 people can sign in»), not a description of the page. Leave it out when there is none.
- Never an icon tile, a greeting, a role, a badge or a count beside the title.

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

The list page is the toolbar (search, filters whose choices show as chips, the visible columns), the DataTable under it and the numbered pages under the table, all straight on the page, as in the [page layout](/en/components/page-layout/) tasks example. A role or a category is plain text, a status is a toned icon and the word, and the row actions sit behind the more button.

## Empty, no permission and errors

| Case | Use |
| --- | --- |
| Nothing yet, or no results | An Empty in the place of the list, as tall as the content it stands for, with the way out |
| No permission for the page | An Empty filling the content: the reason and who can help. The title stays. |
| The page could not load | An Empty filling the content: what failed, and Retry |
| One section could not load | An Alert with Retry in that section; the rest of the page stays |

A dashed border belongs only to the Empty. Never a short dashed box with one line of text and the page blank below it.

## Dashboards

- The title is «Dashboard» or the product’s own name for it. No greeting and no role.
- The figures go first, as one label-over-value row on the page.
- Then one Card per subject, with its title, one line and its action, and real content: rows, a bar with its numbers or a chart. Cards side by side share the height of their row.
- Never a grid of identical figure cards, a figure alone in a box, or a footnote about customising the page.

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
