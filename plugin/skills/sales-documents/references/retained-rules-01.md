# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-9f193f9c1793

<!-- AIS-9f193f9c1793 -->
Then read [the shared workflow](../../_shared/WORKFLOW.md). Every word follows [writing](../../communications/SKILL.md) (*Proposal section*, *Case study*). Both documents are A4 on `print/system.css`, the same type, grid, hexagon field and contact band as the brochures; `print/render.mjs` checks them like any print piece.

Source: plugin/skills/sales-documents/SKILL.md:9.

## AIS-91d71ed11495

<!-- AIS-91d71ed11495 -->
| Document | When | Source to copy |

Source: plugin/skills/sales-documents/SKILL.md:11.

## AIS-d131c103f60c

Historical wording: explicitly superseded by AIS-ef0a7ebc665e. Apply the dated resolution to the conflicting clause; preserve other clauses and this exact historical wording.

<!-- AIS-d131c103f60c -->
| Proposal | A buyer asked for an offer for one line: what we install, what it costs, on what terms. Internal until sent to that customer; never published. | `pieces/sales/proposal/proposal.es.html` |

Source: plugin/skills/sales-documents/SKILL.md:13.

## AIS-2d369bb09a90

<!-- AIS-2d369bb09a90 -->
| Case study | A customer's result, told with their approval, for the web, a fair or a follow-up email. | `pieces/sales/case-study/case-study.es.html` |

Source: plugin/skills/sales-documents/SKILL.md:14.

## AIS-eabdfee281a5

<!-- AIS-eabdfee281a5 -->
**Cover:** project title (`h1`), one sentence on the machine and the task, the real picture of the proposed machine (cover 240 ppi or more), then customer, reference and date.

Source: plugin/skills/sales-documents/SKILL.md:18.

## AIS-9cb387349095

<!-- AIS-9cb387349095 -->
**La necesidad:** the line in a specification table (product, container, cadence, inspection point, spacing, reject) and the defects as tiles, real detections of that defect.

Source: plugin/skills/sales-documents/SKILL.md:19.

## AIS-b17b56e30ad8

<!-- AIS-b17b56e30ad8 -->
**La solución propuesta:** the machine's exterior picture and its table: machine, cameras, lighting, software, integration, reject. Figures only from the machine's datasheet.

Source: plugin/skills/sales-documents/SKILL.md:20.

## AIS-d9f240fb7885

<!-- AIS-d9f240fb7885 -->
**Alcance y calendario:** what is included and what the customer provides; the phases in the approved order: design, manufacture, FAT in Barcelona with the customer's samples, shipping and installation, SAT, training.

Source: plugin/skills/sales-documents/SKILL.md:21.

## AIS-98304a6b3a68

<!-- AIS-98304a6b3a68 -->
**Precio y condiciones:** the price table, then payment, lead time, SAT acceptance, 2-year warranty, support and validity, the two signatures and the contact band.

Source: plugin/skills/sales-documents/SKILL.md:22.

## AIS-06ccc1a2eeec

<!-- AIS-06ccc1a2eeec -->
The example customer, Conservas del Norte, S.A., and every price in it are made up. Replace all of them; never copy a real customer, price or name from an internal quote into a template or example.

Source: plugin/skills/sales-documents/SKILL.md:24.

## AIS-a917abef6c68

<!-- AIS-a917abef6c68 -->
**Cover:** the customer and what the system does (`h1`), one sentence of context, a real picture of their line, customer and sector in the facts, then the need and the solution.

Source: plugin/skills/sales-documents/SKILL.md:28.

## AIS-58c92f2efb9b

<!-- AIS-58c92f2efb9b -->
**El resultado:** one figure with its basis (measured or estimated, by whom) and source, the customer's exact words with name and role, what the system checks, a second real picture, the contact band.

Source: plugin/skills/sales-documents/SKILL.md:29.

## AIS-e9dd452c544b

<!-- AIS-e9dd452c544b -->
The example is the Daymsa case published on aisvision.com on 20 October 2020: every fact, the figure and the quote come from it, word for word.

Source: plugin/skills/sales-documents/SKILL.md:31.

## AIS-5f0aa230907e

<!-- AIS-5f0aa230907e -->
**Approval.** A case study needs the customer's written approval of the name, quote, figures and pictures. Record it in `meta.approved_by` (who approved, and their role) and `meta.approved_on` (YYYY-MM-DD). Without both, `validate` reports it and `export_piece` refuses the piece; editing still works. A case already published on our website counts as approved: the Daymsa example records "Caso publicado, aisvision.com, 20 de octubre de 2020" and 2020-10-20.

Source: plugin/skills/sales-documents/SKILL.md:33.

## AIS-394954d5a9ec

<!-- AIS-394954d5a9ec -->
`edit_piece copy` with the source above, then `slots`.

Source: plugin/skills/sales-documents/SKILL.md:37.

## AIS-3555f6564bf8

<!-- AIS-3555f6564bf8 -->
`update` with `slotChanges`: any text or picture by its slot; `{ slot: <any cell of a row>, row: "add", text: "Concepto | 2 | 900" }` adds a row under it, `row: "remove"` removes it. Price rows may leave out the amount: quantity × unit price, the tax base, the tax (rate read from its label, "IVA (21 %)") and the total are recomputed on every update, and `validate` refuses a table that doesn't add up.

Source: plugin/skills/sales-documents/SKILL.md:38.

## AIS-ac70fe4c62aa

<!-- AIS-ac70fe4c62aa -->
`export_piece enqueue render-pdf`, then open every page.

Source: plugin/skills/sales-documents/SKILL.md:39.

## AIS-71c735658a63

<!-- AIS-71c735658a63 -->
Another language: copy the HTML to `proposal.<lang>.html` (or `case-study.<lang>.html`), set `<html lang>` and write it in that language with the writing skill; numbers follow its Localisation rules.

Source: plugin/skills/sales-documents/SKILL.md:41.
