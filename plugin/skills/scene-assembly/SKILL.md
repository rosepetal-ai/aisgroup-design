---
name: scene-assembly
description: Assemble an AIS industrial animation from references and a free-form description using reusable cabinets, signal towers, marked metal panels, human rigs, materials and the shared player. Use for scene construction and asset selection.
---

# Scene assembly

Take the quotation, photos, original animation and description as supplied. Establish which source supports the sequence, physical arrangement, finish, manufacturer identity and claims separately. A missing drawing can leave the geometry illustrative. Preserve prompted facts and identify any geometry that matters to interpreting them.

For physical hardware, use the local studio MCP asset collection when available with kind `machine-model` and `exists: true`. Fetch the selected camera, lens, light, extrusion, foot, bracket, roller or Compact exterior with `get_asset`. Keep the supplied proportions and mounting geometry. When a required part has no suitable model, study its pivot, supports and motion from the supplied references. A close view should show the joint, sightline or contact that explains the action. Name any illustrative geometry in the handoff. [Model selection and integration](references/industrial-models.md)

In the full studio use the local MCP’s `search_library` with collection `assets` and kind `scene-component`, then `get_asset` on the chosen ID. The [working station kit](../live-animation/examples/station-kit/README.md) is the direct route inside the plugin. Reuse the whole cabinet with its mounted lamp, feet and door. Preserve the signal state and wiring direction implied by the action. A lamp indicating a running batch must follow the batch clock. A metal mark takes its construction from the machine reference; the pharma reference uses an opal insert behind cut metal. Equipment colours and customer branding come from this brief.

Before creating meshes, name the single physical event and the components that make it happen. From both camera positions, trace product to support, actuator to mount, panel to enclosure and cabinet feet to floor. Give a person an identifiable task and enough space and time to perform it in appropriate clothing. Use [motion review](../scene-motion-review/SKILL.md) to evaluate that sequence.

Prove the selection against both example briefs in the kit. In the transfer case, seek before pickup, at lift and after set-down. The fingers, carton and actuator must refer to the same moving load. In the cabinet case, seek across Run and Stop. Only the cabinet mechanism and its status are needed. The run lamp and caption must agree, with no operator, carton, or special scope colour. Test the shared player on both; hiding the captions must preserve the controls and machine status.

Apply the [AIS simplicity rule](../ais-brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).
