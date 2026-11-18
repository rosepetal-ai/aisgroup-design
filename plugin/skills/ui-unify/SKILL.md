---
name: ui-unify
description: "04. Redesign or unify a Vue app on our components, keeping behaviour."
---

# ui-unify

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

1. Redesigning a whole app: follow [redesign](references/redesign.md) from its first step. A colour preset only bridges screens not yet moved.
2. Inventory the screen, dependencies, variants and states. Read unify.md and run ui-audit first. Use the package blocks before composing your own; other products are examples, not layouts to copy, and the package wins over the app's own design notes.
3. Before removing any text, button or interaction, read the app's tests and decision docs. Owner decisions stay unless the guide makes them impossible; list the overridden ones for the owner.
4. List every view (routes, dialogs, panels) and redo each one completely before the next: our components from the package or registry (the adapter's migration map gives each target), the page system, texts in our voice, behaviour kept, then both checks and its screenshots ([redesign](references/redesign.md), step 5). Swapping components alone is not a redesign.
5. Preserve dataset/image cards, facts, forms, actions and error states. Do not remove working content to make the screenshot simpler.
6. Build the affected app, run its tests and verify interactions and both themes. Look at each changed screen in a browser against the guide and say which screens were not seen. Keep unresolved differences explicit.

Read only the reference needed for this task.

- [redesign](references/redesign.md)
- [unify](references/unify.md)
- [page system](references/page-system.md)

## Done

A redesign is done when `ui-contract.mjs audit` gives `legacyFree: true` and `ui-states.mjs` gives `statesFree: true` on every route, in both themes, at desktop and phone width ([redesign](references/redesign.md), step 6). Look at every failure screenshot yourself before reporting. A redesign that skips either check is not finished.
