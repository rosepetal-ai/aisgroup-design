---
name: product-render
description: "Art-direct and review photoreal AIS product and machine stills, from packshots and defect pairs to machine exteriors. Use for still images and machine plates used in films."
---

# product-render

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

Use this skill for still pictures of the products AIS machines inspect (bottles, vials, cans, jars, cartons, trays, cables, blisters) and of the machines themselves: packshots, good and defective pairs, lineups, code close-ups, the machine on its line, and the machine shots of a film. Films of the software belong to `platform-film`; live three.js pages to `live-animation`; checking a finished picture to `render-review`.

Real photos come first: the customer's captures, AIS footage, a lab shoot or a licensed photo, with a small physical edit for the defect. Render only what no real picture shows, and say so.

## Order of work

1. **The shot list.** For each picture the piece needs: the slot, the shot, the product with its real dimensions, the one defect (sized in mm), the framing, and whether an accepted picture already exists. Reuse accepted pictures before rendering.
2. **The product.** Real dimensions, real materials, real labels and codes. Read [realism](references/realism.md).
3. **Light and camera** like a packshot photographer, the same rig and the same ground for every picture of a set.
4. **Render** in Blender Cycles: one job at a time, low priority, under the shared lock and a memory budget. Preview one shot small before the full set.
5. **Overlays**, when the piece shows detections: boxes projected from the 3D model, never placed by eye.
6. **Register** each picture in the asset library as a render, with its script as the source.
7. **Review** with `render-review`: next to a real photo of the same product at the same scale, and next to the set's last accepted version.

## Rules that got renders rejected

- **Overhauling a set that was converging.** Change one thing at a time; keep it only if the side-by-side with the accepted version is clearly better, and revert any regression.
- **Scenery in product shots**: conveyors, rails and line parts make product posts read synthetic. Products stand on the studio ground; the line belongs to machine shots.
- **A defect that needs its box to be seen**, two defects on one product, or a defect a real line wouldn't produce.
- **Covers** must be the sharpest picture, filling the band edge to edge. Machines on a cover are shown working, with product on the line.
- **Low-resolution previews shown as results**, or a partial build overwriting reviewed pictures.
- **Machines from CAD: exteriors only**, guards closed; never cutaways, exploded views, internals, optics, camera layout or dimensioned views. The CAD and its meshes never leave the render machine.
- **Never call a picture a render, CAD, 3D or illustration** in visible text, captions, alt text or delivered file names.

## References

- [realism](references/realism.md): labels and printed codes, materials and liquids, light and camera, consistency across a set, the machine and its line, the review against real photos.
