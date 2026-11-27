# Packing transfer

This standalone teaching station moves one carton from a guided pneumatic pusher to a two-handed lift and a receiving bay. The asset is Microsoft's Medical_Female_01, selected for an illustrative secondary-packaging task. The FBX import retains the full articulated person, tied hair, plain tunic, trousers and closed shoes. Face, body and hair textures are embedded in the GLB. The person’s workwear is an example. Establish actual site dress, PPE and reach separately for each brief.

[Original character and textures](https://github.com/microsoft/Microsoft-Rocketbox/tree/0943055db6ec570bcef9f2c8b41c9e5467c808f9/Assets/Avatars/Professions/Medical_Female_01) · [Included MIT licence](LICENSE.md)

Open the example through a Vite project with Three.js installed. The entry is `index.html`. The example controls scrub the mechanism during development. Use the shared AIS PlayerBar when integrating a customer explainer.

- `motion.mjs` sets the face of the moving blade and the carton dimensions in metres. The blade takes up its clearance before the carton moves. The deck carries the load until both hands close. The hands open after touchdown.
- `rig.mjs` uses the avatar’s original upper-arm, forearm, wrist and finger joints. It preserves the segment lengths, turns the trunk towards the working side, sets the hand orientation and solves the shoulder and elbow to the required wrist. Hand contact is calibrated from skinned palm and finger vertices. Adjust the grip for a new package, including handle shape, depth and clearance under the fingers.
- `station.mjs` builds the load path from feet through crossmembers, deck, cylinder mount, rods, blade and contact pad. Framing needs to show the handoff. A different mount, stroke or product needs fresh dimensions and a fresh check.

## Run the contact check

Run `scripts/safe.sh node examples/packing-transfer/check-render.mjs <url>` from the skill root to measure the rendered cycle, seek backwards and exercise playback. Set `CHROME_BIN` when using a system Chromium executable. To keep the individual samples, the browser expression below returns the actual work surface, moving blade, carton bounds and posed skin landmarks. Save its result as JSON, then run `node audit.mjs samples.json`.

```js
JSON.stringify(Array.from({length:541}, (_,i) => window.packingTransfer.measure(i/60)))
```

The audit detects table penetration, premature travel, a lifted carton with missing opposing contact, and a grasp supported by a single point. It also runs two deliberately broken cases. These checks evaluate geometric contact. Friction, grip force, suitability for a production site and the character of the motion require their own evidence.

## Using the operator on a production line

Load `operator.glb` once with `GLTFLoader` and pass its scene to `createPerson(scene, template, name)` in [person.ts](person.ts) for each station. The actors share geometry and textures. Each has its own skeleton. Include the MIT licence in the offline export.

Call `person.pose(stance, [rightGrasp, leftGrasp])` from the simulation clock. Supply the standing origin and foot offsets in metres, yaw and forward lean in radians, and the world contact of the index finger and thumb. Supply a value from 0 to 1 for `grasp.relaxed` as an empty hand leaves its task. Calculate the two contact points from the actual item, including its rotation and size. Use the cap during a push, the tab during a fold, and opposing faces for the carry. Retarget the station and review the joint angles for each new item.

In the development player expose `__anim.seek(t)` and `__anim.gripReview()`. For every engaged hand return `{actor, hand, kind, id, gaps}`, where each gap in metres is the distance from a weighted fingertip vertex to the corresponding rendered product surface. Use the product instance matrix and its triangle geometry. For a multi-piece case, include the tray and closed lids. Expose an independent `__anim.requiredGrips()` inventory of `{actor,kind,id}` from the moving loads that have left their supports. The checker requires a matching hand for each one. A wrist target or a hidden collision proxy cannot establish these measurements.

Run the example below against a running customer player, substituting its duration, expected actor names and contact types. The check samples at 60 Hz, checks those inventories and revisits three times in reverse order. Set `TOL` in metres to match the product and `CHROME_BIN` for a system browser.

```sh
scripts/safe.sh node examples/packing-transfer/check-line.mjs "$URL" 60 manual-operator-0,manual-operator-1,manual-operator-2,manual-operator-3,packing-operator carton,tube,cap,flap,case
```

Inspect the unoccupied hand, elbows, feet and torso in the full scene. Show the active station while the caption describes its action, and hold a pallet shot until the product is resting on its support. Record and review the desktop and phone framing.
