---
name: explainer-story
description: Turn a free-form quotation, description, photographs or machine footage into the chapters, shots, evidence and optional captions of an AIS viewer-controlled 3D explainer. Use when planning a new scene, adapting an RSM-style story to another process or correcting an explainer whose action is hard to follow.
---

# Telling the story of a machine

Accept the brief in the form supplied. Extract what enters, what the machine senses or changes, how the mechanism acts, where the product goes and what the operator can verify. Record the source of each stated rate, dimension, option and result. A stated claim can come from the user's prompt. Choose illustrative staging for unspecified geometry and keep that distinction in the handover.

## Choose the chapters

Start with an overview that locates the station in the line. Move in and follow one identifiable product through the decisive event. Stay until its destination and the next product's path are clear. Show the software or operator's view when the source establishes what they see. Pull back for the supplied result or the observable outcome. A short station may need just three chapters. [RSM sequence and worked brief](references/rsm-and-new-brief.md)

Give each chapter a short navigation label and a concrete question the shot answers. Mark the featured product, its support, the start and end of the action, the camera target and any required evidence. For a concealed action, decide which angle, cutaway or optional slow-motion detail actually exposes it. During an authored camera move, keep the subject visible through the change of view.

## Fit the scene to the series

Use the full-window stage with a title-safe logo and the shared AIS PlayerBar along the bottom. Reframe the mechanism for the space above the controls. Use the design system's label tabs on parts, the verified screen on the physical HMI, and its verdict on the corresponding item. Show a temporary evidence plate only when it adds information the viewer can use at that moment. Borrow the machine finishes, hardware identity and commercial highlight colours from this brief's evidence. [Player and overlay implementation](../live-animation/references/explainer.md)

Treat captions as one optional layer. With narration captions enabled, use short lines for a causal explanation or a supplied figure. Keep action visible above them. With captions hidden, the camera, product motion, anchored labels, evidence and selected chapter still explain the event. A mode switch, seek or resize must respect the viewer's choice. Give the desktop action a pressed state and its phone menu item a checked state. The control's accessible name stays stable.

## Check one cycle in the delivered player

1. Seek to just before the event, the intervention and its visible consequence. Compare the product identity, pose, verdict and displayed evidence. Jump back to the middle from Results and repeat on the other branch when the film offers one.
2. Watch at normal speed with captions hidden. Identify the subject, its support and what changed from the working camera. Reframe any event whose essential motion is only apparent in text. Recheck with captions enabled on desktop and phone.
3. For an English player with optional captions, open a paused URL in a captioned beat and run the command below from this skill's directory. A localized player can pass its caption control name as a third argument. The test checks the rendered timed caption layer, both control states, a seek-and-return and the player's clock on desktop and phone.

```sh
../live-animation/scripts/safe.sh node scripts/captions.mjs "$URL" '[data-scene-caption]'
```

Carry the approved shot plan into the [live-animation skill](../live-animation/SKILL.md) for construction, physical review and release.

Apply the [AIS simplicity rule](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).
