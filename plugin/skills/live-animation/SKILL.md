---
name: live-animation
description: "04. Live web animations."
---

# live-animation

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

Use this skill for live three.js solution pages on the website (`/animations/*`, pilot `pharma-line`), review rounds on pacing, camera work, overlays, UI alignment or loading, and before every release. Rendered videos belong to `brand-video`; static renders belong to `product-render`.

1. Read the [rules](references/rules.md) whole before touching a piece, and write every new review remark down as a rule before fixing it.
2. Read [live-animation workflow](references/workflow.md) for the piece contract (`data-anim-stage`, `window.__anim`), QA scripts (`scripts/`), asset rules, single-workspace hygiene and the release checklist.
3. Run every heavy WebGL capture and build through `scripts/safe.sh` (one Chromium at a time), pass every automated gate (`console.mjs`, `align.mjs`, `poster.mjs`, `loadtrace.mjs`, `fallback.mjs`, `perf.mjs`), and inspect desktop and `390×844` phone contact sheets before publishing to the preview channel.
