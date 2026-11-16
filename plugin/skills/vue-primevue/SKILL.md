---
name: vue-primevue
description: "04. Set up AIS PrimeVue + Tailwind presets, themes and component mappings."
---

# vue-primevue

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

1. Confirm PrimeVue in package.json. Read adapter.md and request design_code kind=primevue.
2. Use the generated preset from packages/vue-themes/primevue.mjs and the .dark selector. Tailwind layers are theme, base, primevue, utilities: PrimeVue is after base and before utilities.
3. Map component jobs to AIS rules. The preset supplies colours and radii; it does not complete component geometry, density, typography, icons or keyboard/async behaviour. Verify those in the application.
4. Run node packages/vue-themes/check-build.mjs and ui-audit for the changed screen.

Read only the reference needed for this task.

- [adapter](references/adapter.md)
