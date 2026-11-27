---
name: scene-motion-review
description: Review AIS live Three.js machinery and operators for credible contact, stance, load transfer, body mechanics and task timing in the delivered player. Use when authoring a new handoff, bend, step, guarded mechanism or correcting motion that looks implausible.
---

# Scene motion review

Name the action in one sentence with its subject, load, destination and cause. For «the packer sets a case on the pallet», identify who owns the case at each instant. Mark the actual grasping faces, both shoe contact patches, the pallet deck and the routes available around the table. For a reader station with a closed guard, the attendant can watch the screen while the actuator moves. Include a person when their action explains something in the brief.

## Block one action in the delivery camera

| Beat | What should be visible |
| --- | --- |
| Approach | The operator faces the task, sets their stance and reaches from the accessible side. The free hand has a destination. |
| Take the load | The support still carries the product while the hands close. The first displacement follows actual contact. |
| Move | The hand, wrist and load keep their relationship. A turn uses the pelvis and a step or a deliberate foot pivot. The knee tracks the working foot as the ankle, knee, hip and trunk share a low reach. |
| Place | The receiving surface takes the load before the fingers open. Fingers clear the rim, folded flap and neighbouring case. |
| Recover | The operator releases, shifts weight and returns within the time available. Show the foot lifting when changing a planted toe's direction. |

Start with these beats at actual playback speed. Model the reach for the task's depth and the person's proportions. If the pallet is unreachable, move the workstation or give the operator a step and enough time to take it. Preserve the original limb lengths. Use separate poses for different product sizes when one path forces the wrist through a wall. A stationary observer can remain still. A crowd of synchronised idle loops makes attention hard to read.

## Measure the action

1. Use the existing [grip inventory and contact check](../live-animation/examples/packing-transfer/README.md#using-the-operator-on-a-production-line) for object identity and engaged fingertip distance. Run the [whole-line clearance check](../live-animation/scripts/line-clearance.mjs) for the assembled equipment, actors and product stream.
2. At the worst pose measure solid penetration independently of contact. Sample the posed skin on the palm, thumb and all fingers, including the free hand. Use the actual product in its local frame. Resolve each open case into its walls, bottom and moving flaps. Its empty interior can receive a hand or a carton. Track the load itself against the stationary and moving equipment.
3. Record heel and toe during each planted interval. Measure both legs and the pelvis during the lowering, loaded turn and return. Compare joint motion, displacement and timing to a task reference or approved blocking for this scene. Declare why a bound was chosen and give the time of its worst excursion. The packer's squat and a standing reader attendant need different poses and bounds.
4. Run the [trajectory audit](references/trajectory-audit.md) for the declared task. Deliberately move a fingertip through a wall, slip one planted shoe or move a named case across a guard in a copied trace. Check that the named pair fails at the changed moment before using the gate on new work.
5. Watch the complete action from the delivery camera with captions off. Inspect pickup and recovery from a second view when a body or guard hides them. Check full speed again after the quantitative pass. Record the named geometry, unobserved regions, worst pose and a normal-speed clip. A pass covers the sampled pairs and recorded task bounds. Motion quality, fatigue and real machine suitability require their own evidence.

For a different brief, keep the procedure and replace the actor roles, evidence, supports, contact intervals and measured dimensions. The [two-brief regressions](scripts/audit-motion.test.mjs) exercise both a manually transferred case and an automated inspection path.

Apply the [AIS simplicity rule](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).
