# Building an AIS machine explainer from a free-form brief

Sales can paste the quotation, notes, claims and images as they have them. Extract the sequence yourself. For each claim keep the original unit, qualifier and source. A prompted result can appear as supplied. A product packshot establishes appearance. A screen establishes fields and states. Neither establishes the machine footprint, cycle time or installed hardware. Use an illustrative layout where the evidence ends. Ask only when the missing choice changes the explanation or commercial promise.

## Select assets before drawing the machine

For the [enclosed inspection example](../examples/enclosed-inspection/README.md), inspect the opening overview and a paused read. The approved visual direction uses the same continuous floor and hall, equipment-scale camera move, square evidence graphic, caption treatment and controls across both. Take that composition into comparable briefs. The specific reader and frame are illustrative selections for this example.

Use the studio media catalogue for product references, machine views, labels and lighting assets. Its Cloud Storage fetcher retrieves a selected file on demand. For a working 3D part, search the studio MCP asset collection for the machine model and check its availability, source and mounting axes. Use the engineering assembly when it matches the brief. If the brief leaves the hardware unspecified, identify the illustrative selection in the handover.

Apply Anatomy’s construction review to the assembled mechanism. At delivery size, follow the product and identify its support and destination. At four times the image scale or with a close inspection camera, follow the camera mount, guard joints, cable termination and load-bearing connections. Return to the delivery camera and watch the event at normal speed. A correct still cannot establish a credible movement.

For a brief describing two printed packages at a guarded reader, use the [editable job](../examples/enclosed-inspection/README.md#adapt-an-incoming-brief). The author translates the supplied notes into the product construction, identifiers, read outcomes and the words in the player. Keep the salesperson’s input free-form. Check the resulting evidence and article against the original notes after a backward seek. For a different process, change the mechanism and test the new action.

## Build the action before extending the line

1. Choose the event the viewer should understand with the captions hidden. For example, a reader identifies a carton and the reject pad sends that particular carton to the bin.
2. Draw the contact chain in metres. For that example it is the floor, frame, conveyor bed, belt and carton. Place the reader on a bracket, give it a sightline to the code, mount the actuator, leave a gap in the guide for the stroke and place the receiving surface under the discharge path. Include the support before, during and after each handoff.
3. Build one complete event in the intended full-size player, using the closest working example. Use the inspector and product identity in [inspection-station](../examples/inspection-station/) or the rig and opposing grips in [packing-transfer](../examples/packing-transfer/README.md). The same clock drives the visible part, inspected item, verdict, label and counter. Seek backwards across the event and verify the identities again.
4. Frame the station at delivery size. From the wide shot, read flow direction and the AIS intervention. In the close shot, see the code under the reader or the pad meet the carton. Add only the fasteners, hinges, supports and cables that explain construction at that distance. Check the shot in motion at normal speed before replicating the station.
5. Populate the whole line and run both contact and clearance checks on the assembled player. The rig's approved pose in isolation cannot establish clearance once the table, guards and adjacent station exist. Repeat for each selectable source line. Save the moment of the worst contact alongside the camera view.

## Brand decisions at the first frame

| Decision | Use in this series | A visible fault |
| --- | --- | --- |
| Composition and controls | Full-window scene, the series’ shared PlayerBar, approved labels and overlay renderer | A permanent explanatory sidebar squeezes the line, or a custom circle changes the verdict chip |
| Materials and colour | Shared material recipes for steel, aluminium, guards and belts. Use a scope accent only when this brief asks for one. Keep a supplied product or HMI identifiable. | Blue across the whole installation obscures scope. White bands painted across metal imitate highlights. |
| Machine identity | Follow the actual metalwork. The pharma hood uses lettering cut through metal with a recessed opal backing. Use the supplied mark, proportions and clear space on its intended panel | A logo floats over a lens or appears on a customer component with no source for it |
| Information | Preserve the supplied process and claims. Attach identifiers and readouts to the correct visible event. | A counter advances before the product, a reject shows a pass tick, or an illustrative detail becomes an installed specification |
| Type and dividers | Reuse the approved player components, font metrics, stroke tokens and touch targets. Inspect the rendered text bounds at desktop and phone sizes. | Added bullets, thicker doubled borders, decorative rules or text sitting low in a label |

If the brief calls for another AIS format, take the controls, overlays and layout from that format’s design authority. The contact and construction method still applies.

## Keep the hall and message continuous

Reuse the [RSM hall floor and air](../examples/station-kit/hall.ts) or the host’s pharma hall once per scene. Camera changes preserve floor coordinates, environment, exposure, fog colour and lights. Place the floor edge beyond opaque fog at the widest supported camera. At the overview, closest shot and transition midpoint, inspect an unobstructed strip of ground and sky. A horizon stripe, flash to a different clear colour or disappearing contact shadow requires a correction. Use the RSM title-safe margin, Inter Semibold opening title on clear space and Inter Medium timed captions on square ink plates. A phase name belongs on a chapter button; the caption describes what the viewer can see happening.

Run [the hall continuity check](../scripts/hall-continuity.mjs) on paused review URLs with a comma-separated list of story times across the camera move. It compares clear sky between shots and looks for a row-to-row colour step shared by both clear outer strips. Choose sample times whose outer strips show the hall. Inspect other parts of the frame by eye where equipment conceals those strips.

## Evidence of readiness

A new mechanism needs a working example and a deliberate broken case its check catches. For a new brief, record which supplied facts survived, which visual dimensions are illustrative, which bodies and motions the tests cover, and what the delivery camera actually showed. An assembly can be geometrically clear and still move badly. Watch the lead-in, loaded motion, release and recovery together. Check planted shoe translation and rotation, knee direction, changes of pace, free-hand clearance and what drives each moving part. Allow time to turn and recover before the next task. Prove the recipe on another brief before treating it as a repeatable default.


For a guarded station, the starter now measures what lies between the centre of the aperture and the printed face in the rendered scene. An opaque bracket in this path invalidates the shot even when the ray intersects the correct article farther away. This centre-ray check establishes alignment. A real field of view, depth of field, lighting or decode rate requires source data.

For a mechanism detail, seek the full-size station to initial contact, loaded travel and release. Render the physical joint at 4× with the project’s `npm run detail` command. Trace the mount back to the frame, the pad to the carton and the product’s base across both supports. Return to the normal camera with captions hidden to check that the buyer can follow the same event.
