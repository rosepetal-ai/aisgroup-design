---
name: product-ui
description: "04. Load before planning Rosepetal Vue tables, forms or product screens."
---

# product-ui

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

1. Read components.json and package.json to identify the actual stack. @rosepetal/design is the source for shadcn-vue components and styles.css is the Tailwind v4 theme.
2. Search design_code, read the registry item and existing package examples before composing a screen. Never scrape a deployed screen for source.
3. Read using-components.md for async states, tables, dialogs and dataset colours; design-language owns the general chart rules.
4. For PrimeVue or Vuetify use their adapter skill. For review, theme comparison or convergence use ui-audit, ui-theme-diff or ui-unify.

Read only the reference needed for this task. Use [the generated component registry](references/component-registry.md) for package source paths.

- [components](references/components.md)
- [node-red-widgets](references/node-red-widgets.md)
- [using-components](references/using-components.md)

Source rules, loaded only when needed:

- [Retained rules 01](references/retained-rules-01.md)
- [Retained rules 02](references/retained-rules-02.md)
- [Retained rules retained-updates-01](references/retained-updates-01.md)
- [Retained rules retained-resolutions](references/retained-resolutions.md)
