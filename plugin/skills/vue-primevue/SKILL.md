---
name: vue-primevue
description: "04. PrimeVue colour bridge while migrating; licence and setup."
---

# vue-primevue

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../ais-brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

1. Confirm PrimeVue in package.json. Redesigning the app onto our components is ui-unify ([redesign](../ui-unify/references/redesign.md)); this preset only colours the screens not yet moved and goes at the end.
2. Stay on PrimeVue 4 with `@primeuix/themes@^2`, both MIT. PrimeVue 5 and `@primeuix/themes` 3 are under PrimeUI's commercial licence: never install or upgrade to them.
3. Get the files with design_code kind=primevue (name: preset, base, readme, tokens) and read adapter.md. Tailwind layers are theme, base, primevue, utilities.
4. Map each component with design_code kind=migration name=primevue. The preset supplies colours and radii only, not geometry, density, typography, icons or behaviour.
5. Run ui-audit (`node <plugin root>/scripts/ui-contract.mjs audit src`) on the changed screens and check both themes in the app.

Read only the reference needed for this task.

- [adapter](references/adapter.md)
