---
name: vue-vuetify
description: "04. Vuetify colour bridge while migrating; themes and limits."
---

# vue-vuetify

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

1. Confirm Vuetify in package.json. Redesigning the app onto our components is ui-unify ([redesign](../ui-unify/references/redesign.md)); these themes only colour the screens not yet moved and go at the end.
2. Get the files with design_code kind=vuetify (name: preset, base, readme, tokens) and read adapter.md. Switch between aisLight and aisDark.
3. Map each component with design_code kind=migration name=vuetify. Geometry, typography, density and icons need application adaptation; theme colours alone do not establish compliance.
4. Run ui-audit (`node <plugin root>/scripts/ui-contract.mjs audit src`) on the changed screens and check both themes in the app.

Read only the reference needed for this task.

- [adapter](references/adapter.md)
