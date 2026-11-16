# Documents and presentations

How letters, proposals, brochures, reports and presentations are put together, and the five patterns they share.

## Composition

- Align left, keep one obvious reading order, and leave generous space between blocks.
- Use the same margins throughout a piece and respect the logos’ clear space.
- Balance a light piece at about 70% white and section grey and 30% blue; invert it for dark openings and closings.

## Formats

- **AIS Vision Systems letterhead ES**: Issuing brand in the header; contact and «Part of AIS Group» in the footer. Keep the writing area clear. [stationery-letterhead](../../../brand/kit/files/stationery-letterhead.pdf)
- **AIS Vision Systems letter ES**: Use the letter template for editable correspondence, with its 11 pt body text. Install Inter before editing; keep the header and footer in place. [office-word](../../../brand/kit/office/letter-ais-vision-systems.docx)

- **Technical and commercial proposal ES**: The customer’s need first, then the solution, the evidence and the next step. Product photography first, diagrams second. [sales-proposal](../../../brand/kit/files/sales-proposal.pdf)
- **Daymsa case study ES**: Name the customer and application, describe the problem and solution, and keep the result with its conditions. Use approved customer material. [sales-case-study](../../../brand/kit/files/sales-case-study.pdf)

- **AIS KARIKÓ EN**: Use the print system. On A4, the logo is 20 mm for AIS Vision Systems or 38 mm for Rosepetal. Keep each product’s specifications together. [brochure-kariko-en](../../../brand/kit/files/brochure-kariko-en.pdf)
- **Wine catalogue EN**: Organise the catalogue by application and product. Keep the original products, figures and picture subjects. [catalogue-wine-en](../../../brand/kit/files/catalogue-wine-en.pdf)

- **OPTICAIS datasheet ES**: Name the product on the cover. Group specifications by equipment, installation and software; put conditions with the figures. [datasheet-opticais](../../../brand/kit/files/datasheet-opticais.pdf)

- **Corporate presentation 2026 ES**: Open on brand blue with the issuing brand’s reversed logo and the company line. One message per slide, a headline of about twelve words and real pictures. Close with one next step and contact details. In joint presentations, AIS Group opens and the brands appear together in one block. [presentation-corporate-2026](../../../brand/kit/files/presentation-corporate-2026.pdf)

The AIS Vision Systems sector decks open with «Engineering peace of mind»; the corporate deck uses «Automated quality control». Keep these lines in English.

At 1920 × 1080, body text is 38 px on 52 px, leads 44 px on 60 px, labels 28 px on 38 px and slide numbers 22 px on 32 px. Headlines use 76 px on 84 px; display text uses 120 px on 124 px. Use the layout’s scale for the whole block.

### Technical report

Title page in brand blue; body text 10.5 pt on 15 pt Inter; numbered sections; tabular figures in tables. No print text below 8.5 pt.

### Email signature

Name, role, brand and phone; no images other than the logo; no slogans.

For charts, see [Data visualisation](../../design-language/references/data.md).

Every figure carries its conditions, as [Voice](../../communications/references/voice.md) requires. Name files with brand, type, language and ISO date: `rosepetal_datasheet_es_2026-10-14.pptx`.

## Patterns

Five patterns cover what a page needs beyond text and pictures. The print system and the deck layouts build them; never draw them by hand.

### Table

Exact values for several items, to look up or compare.

- **Column titles** in small Semibold secondary text, sentence case, over a `--ais-neutral-300` rule. No fill, never capitals.
- **Rows** split by `--ais-border` hairlines, none after the last row. No fills, stripes, frames or vertical rules.
- **Alignment:** text left; numbers right, in [tabular figures](../../design-language/references/typography.md), with their column title aligned the same way. The first column names the row, in ink.
- **Units** once, in parentheses in the column title: *Field of view (mm)*. When a column mixes units, the unit goes in the row’s name: *Labelling (h/month)*. Never in the cells.
- **Numbers** follow [Localisation](../../communications/references/localisation.md): 7200 and 30 000 in Spanish and Catalan, 7,200 and 30,000 in English; the same decimals down a column (2,0, not 2); dimensions with the multiplication sign, 100 × 56.
- **No value** is a dash (–), never *n/a*, *0* or an empty cell. A yes/no column shows the Lucide `check` in ink or the dash, never status colours.
- **Caption:** a condition for the whole table goes in one line of small secondary text under it, never in an asterisk. The table’s title is the heading above it.
- **Size:** a table takes the width of its text column. At most five columns and six rows on a slide and seven columns on an A4 page; split a longer table into groups, never across pages. Below 600 px a data table scrolls inside its own frame; type never shrinks to fit.
- **Ground:** white or section grey, never brand or deep blue; on blue, give the one number that matters as a key figure. Posts carry no tables.

<div class="table-wrap comms-scale">

| Medium | Cells | Column titles | Space | Rules |
| --- | --- | --- | --- | --- |
| **Documents and datasheets (A4)** | 9.5 pt on 13.5 pt | 8.5 pt Semibold | 2 mm above and below, 5 mm between columns | 0.25 mm |
| **Presentations (1920 × 1080)** | 38 px on 52 px | 38 px Medium | 24 px above and below (16 px from five rows), 40 px between columns | 2 px |
| **Websites** | Small, 14 px | Small Semibold | 12 px above and below, 24 px between columns | 1 px |
| **Product interface** | The `@aisgroup/design` Table as it ships: 14 px, hover and selected rows | Medium, in ink (they sort) | Number columns take `text-right tabular-nums` | `--border` |

</div>

The print system (`.table`), the deck `table` layout, `.ais-table` in `@aisgroup/web` and the AIS table style in the Word template build it. Never draw a table by hand or paste one as a picture.

### Specification block

One product’s properties, a label and its value per row.

- The label in secondary text, the value in ink, every value on the same column.
- Group a long list under small headings, such as Equipment and Installation.
- Use it instead of a bulleted list or a sentence that starts with the label. When the rows compare the same measures for several items, they are a table.

### Highlighted text

Four ways to make text stand out, and no others. None takes a fill, box, side bar, border, icon or shadow.

<a href="/kit/files/linkedin-quote-rosepetal-es.png" target="_blank" rel="noopener" aria-label="Rosepetal at VISION 2026, opens in a new tab">Rosepetal at VISION 2026</a>.

- **Emphasis:** Semibold on a few words, in the text’s own colour, at most once per paragraph. Never colour, italics, underline, capitals or a fill. A whole sentence that must stand out is the lead, or a slide of its own.
- **Key figure:** the number in brand blue (white on blue), Medium, in tabular figures; under it what it counts, in lower case; then its condition in secondary text (light blue on blue). No sign before the number: *up to* and *at least* go in the words. One to three in a row, all the same size; one row per page, slide or section.
- **Quote:** a named person’s exact words, in « » in every language, with “ ” inside them; under them the name in Semibold, then the role and company in secondary text. No quote-mark graphic, italics or rule; one per page, slide or post, at most 20 words on slides and posts. Never cut a person’s words without their approval. Unsigned praise or a case summary is not a quote: write it as text, without quotation marks.
- **Note:** one short sentence in small secondary text, under the block it qualifies, at most one per page. No label (*Note*), asterisk, fill, box, icon or warning colour. Slides carry no notes: the condition goes with its figure or table.

<div class="table-wrap comms-scale">

| Medium | Key figure: number / words / condition | Quote: words / person | Note |
| --- | --- | --- | --- |
| **Documents (A4)** | 34 pt Medium / 11 pt Semibold / 8.5 pt | 13 pt on 19 pt Medium / 9.5 pt | 8.5 pt, 4 mm under the block |
| **Presentations** | 240 px (120 px for long figures) / 38 px Medium / 38 px | On brand blue: 120 px / 38 px | None |
| **Websites** | Title / Body Medium / Small | Subheading Medium, 40 rem wide / Small | Small, 24 px under the block |
| **Posts** | The result post | The quote post | None |

</div>

### Comparison

Two states of the same subject: before and after, or correct and defective.

- The same subject, crop, scale and light in both pictures, the reference on the left.
- Under each picture, the state with its icon (circle-check in success green, circle-x in error red) and one line on the difference. Never a coloured frame.
- Two pictures only; further defects go in detection tiles.

### Process steps

A sequence the reader follows in order.

- Three to five steps in one row, each number in the single hexagon, joined by a hairline.
- A short title and one line under each.
- More than five steps, or steps that branch: split the sequence or use a diagram.
