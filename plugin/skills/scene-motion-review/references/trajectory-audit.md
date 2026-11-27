# Sampling a task trajectory

Run the fixtures from this skill's directory.

```sh
node --test scripts/audit-motion.test.mjs
node scripts/audit-motion.mjs captured-motion.json
```

Capture `{maxStep,frames,rules}` from the scene that renders the shot. Each frame is `{t,points}` where `points` maps stable names to XYZ arrays. Use metres and seconds. Read a skinned vertex after posing the rig with `mesh.getVertexPosition(index, local).applyMatrix4(mesh.matrixWorld)`. A hand target reused as its own witness always reports a perfect grip. For contact, read the other point from the surface of the moving item with its instance transform.

Sample the regular clock and each exact rule boundary. Derive rules from the intended work cycle, including contact-free approach and withdrawal. Choose the sample interval small enough for the fastest part and the thinnest obstacle. The checker rejects missing named observations, missing boundary frames and gaps larger than the declared interval.

| Rule | Frame coordinates and bound |
| --- | --- |
| `clear` | Express each named probe in the rigid obstacle's local metric axes. Supply its `min`, `max` and an inset `margin` for allowed contact. It tests the segment between the previous and current sample. Split thin guards, open cases and moving flaps into their real solid regions. Include corners or surface samples from a moving load. |
| `contact` | Two independent corresponding mesh points in the same frame, plus `maxGap`. Add rules for each supporting hand across the carry. Sliding grips need a tracked point on the permitted contact patch. |
| `plant` | Actual heel and toe positions, plus `maxDrift` measured from the initial sample. A fixed ankle alone allows the shoe to pivot or sink. Use support-relative coordinates on a moving platform. |
| `speed` | Posed landmark positions, plus a task-specific `maxSpeed` in metres per second for that interval. A swing foot and a loaded hand need different limits. |
| `bend` | Three skeleton joint positions with the middle point as pivot. An extended joint gives 180 degrees. Supply `minAngle`, `maxAngle` and `maxDegreesPerSecond` in degrees. A knee check complements the planted shoe, hip travel and full-speed visual review. |

Example rule for an illustrative operator approaching an open case. Capture the fingertips and palm heel from the rendered skin, transform them to the wall's rigid frame, and use that wall's measured dimensions. The inset below is an example for this wall.

```js
const rule = {
  id: 'free hand crossing upstream case wall', kind: 'clear', span: [2, 2.55],
  points: ['free index in wall frame', 'free middle in wall frame', 'free palm heel in wall frame'],
  min: [-0.12, 0, -0.003], max: [0.12, 0.18, 0.003], margin: 0.0005,
};
```

Each recorded solid has a rigid local frame. Remove non-uniform scale consistently by expressing both bounds and probe positions in the same physical units. Split intervals at part appearance or topology changes. Rotation produces curved trajectories between samples, so subdivide rapidly turning cases, wrists and flaps until the result converges. For curved receivers, deforming clothing or complex CAD faces, add a mesh-level probe to the scene adapter. First-contact distance and load clearance need separate evidence.

A crossing rule can also express an operational role. In a closed-guard inspection shot, put the observer's hands outside the reserved cell for the complete inspection interval, and place the product path inside the conveyor corridor. An actual access or service sequence needs its own guard state, contact surfaces and task evidence. Treat role, PPE, attention and intention as visual review items. A distance trace alone cannot establish them.

The fixtures include deliberately broken ground contact, load contact, body speed, bend speed, prohibited access and thin-wall transit. The examples using the two neighbouring station clocks check the authored trajectories only. The delivery checks use the assembled player and its loaded meshes.
