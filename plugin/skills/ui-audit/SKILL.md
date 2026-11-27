---
name: ui-audit
description: "04. Load before auditing Rosepetal Vue snippets or existing product screens."
---

# ui-audit

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../ais-brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

1. Identify files and stack, then read audit.md and the product-ui references for only those components.
2. Run node <plugin root>/scripts/ui-contract.mjs audit <app/src> from the app's folder (the plugin root is two folders above this skill; files or folders; it skips node_modules and dist, and checks the stock components/ui and components/blocks only for being the package's current version). It reads templates and styles only, gives counts per rule and each finding with its fix. It does not prove visual compliance; small-text findings are checks, not failures. With the plugin installed, hooks also run it after every edit and before the agent stops (audit.md, Hooks).
3. Check keyboard, focus, loading, empty and failure states in the actual app in both themes; render/screenshot under the shared render lock when browser access is available.
4. Report file/line, source rule, observed behaviour and a concrete fix. Mark unavailable runtime checks as unverified.

Read only the reference needed for this task.

- [audit](references/audit.md)
