---
name: ui-theme-diff
description: "04. Compare product CSS tokens and detect PrimeVue/Vuetify theme drift."
---

# ui-theme-diff

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../ais-brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

1. Identify the candidate token file; the canonical one is <plugin root>/packages/design/styles.css (the plugin root is two folders above this skill). Read theme-diff.md.
2. Run node <plugin root>/scripts/ui-contract.mjs diff <candidate.css>; inspect missing, changed and unresolved tokens in both modes.
3. In the design-system repo only, run node packages/vue-themes/generate.mjs --check. Do not approve a difference or change brand values merely because the candidate uses them.

Read only the reference needed for this task.

- [theme-diff](references/theme-diff.md)
