# sales-documents production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md). Every word follows [writing](../../communications/SKILL.md) (*Proposal section*, *Case study*). Both documents are A4 on `print/system.css`, the same type, grid, hexagon field and contact band as the brochures; `print/render.mjs` checks them like any print piece.

| Document | When | Source to copy |
| --- | --- | --- |
| Proposal | A buyer asked for an offer for one line: what we install, what it costs, on what terms. Internal until sent to that customer; never published. | `pieces/sales/proposal/proposal.es.html` |
| Case study | A customer's result, told with their approval, for the web, a fair or a follow-up email. | `pieces/sales/case-study/case-study.es.html` |

## Proposal: five pages

1. **Cover:** project title (`h1`), one sentence on the machine and the task, the real picture of the proposed machine (cover 240 ppi or more), then customer, reference and date.
2. **La necesidad:** the line in a specification table (product, container, cadence, inspection point, spacing, reject) and the defects as tiles, real detections of that defect.
3. **La solución propuesta:** the machine's exterior picture and its table: machine, cameras, lighting, software, integration, reject. Figures only from the machine's datasheet.
4. **Alcance y calendario:** what is included and what the customer provides; the phases in the approved order: design, manufacture, FAT in Barcelona with the customer's samples, shipping and installation, SAT, training.
5. **Precio y condiciones:** the price table, then payment, lead time, SAT acceptance, 2-year warranty, support and validity, the two signatures and the contact band.

The example customer, Conservas del Norte, S.A., and every price in it are made up. Replace all of them; never copy a real customer, price or name from an internal quote into a template or example.

## Case study: two pages

1. **Cover:** the customer and what the system does (`h1`), one sentence of context, a real picture of their line, customer and sector in the facts, then the need and the solution.
2. **El resultado:** one figure with its basis (measured or estimated, by whom) and source, the customer's exact words with name and role, what the system checks, a second real picture, the contact band.

The example is the Daymsa case published on aisvision.com on 20 October 2020: every fact, the figure and the quote come from it, word for word.

**Approval.** A case study needs the customer's written approval of the name, quote, figures and pictures. Record it in `meta.approved_by` (who approved, and their role) and `meta.approved_on` (YYYY-MM-DD). Without both, `validate` reports it and `export_piece` refuses the piece; editing still works. A case already published on our website counts as approved: the Daymsa example records "Caso publicado, aisvision.com, 20 de octubre de 2020" and 2020-10-20.

## With the MCP

1. `edit_piece copy` with the source above, then `slots`.
2. `update` with `slotChanges`: any text or picture by its slot; `{ slot: <any cell of a row>, row: "add", text: "Concepto | 2 | 900" }` adds a row under it, `row: "remove"` removes it. Price rows may leave out the amount: quantity × unit price, the tax base, the tax (rate read from its label, "IVA (21 %)") and the total are recomputed on every update, and `validate` refuses a table that doesn't add up.
3. `export_piece enqueue render-pdf`, then open every page.

Another language: copy the HTML to `proposal.<lang>.html` (or `case-study.<lang>.html`), set `<html lang>` and write it in that language with the writing skill; numbers follow its Localisation rules.
