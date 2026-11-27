# Local industrial models

Call `search_library` with `collection: "assets"`, a part name such as `Basler ace` or `45x45 extrusion`, and `filters: {"kind":"machine-model","exists":true}`. Fetch a result using `get_asset` with its exact `assetId`. Each available entry returns a local GLB URI, byte count and provenance. The source register for converted industrial hardware is available at `sourceRegisterUri` when installed. Review its source terms for the intended use. Catalogue entries carry review status.

| Scene element | Example asset IDs |
| --- | --- |
| Imager and optics | `model-basler-ace2-gige`, `model-v1226-mpz` |
| Inspection lighting | `model-svl-rm75-ring-light`, `model-svl-lxe300-linear-light` |
| Frame profiles | `model-minitec-profile-45x45-f`, `model-minitec-profile-45x90-f`, `model-minitec-profile-90x90-l` |
| Frame support and joint | `model-minitec-foot-90-gd`, `model-minitec-angle-45-gd-z`, `model-minitec-angle-bracket-swivel` |
| Guard door and ends | `model-minitec-hinge-45-al`, `model-minitec-insert-seal-6`, `model-minitec-end-cap-45x45`, `model-minitec-stopper-40` |
| Material transport | `model-minitec-transport-roller-al`, `model-minitec-conveyor-bearing-45`, `model-minitec-belt-driving-cylinder-45`, `model-minitec-belt-tensioning-cylinder-45` |
| Machine state | `model-auer-eco-xmr100-3xll-stack-light` |
| Complete machine exterior | `model-rev360-compact` |

The first animation build fetches the private hardware pack using the AIS cloud sign-in. To retrieve it for an MCP lookup before building, run `node scripts/animation-assets.mjs` in the plugin directory. For an offline installation, import the separate pack with `node scripts/scene-model-pack.mjs install /path/to/ais-scene-models.aispack`. The studio MCP and inspection build then use its checked local cache, including after an MCP session has started. The installer verifies each listed file and activates the complete version together. The source register accompanies the models. A configured `AIS_SCENE_MODELS_DIR` takes precedence. A source checkout can also use its sibling Rosepetal website library. On a machine without that library, omit the `exists` filter to inspect the inventory. An unavailable entry returns a null URI. The library is read locally. Asset availability alone does not establish what was installed or quoted.

Use the selected prepared GLB with a Three.js GLTFLoader configured with MeshoptDecoder. Open the actual mesh at metre scale, examine its world bounds, attachment faces, shafts and optical axis before placement. Extend the generated MiniTec profile slices along their local length (Z) and retain each cross section. Measure the source slice for the correct length multiplier. Verify roll axes coincide with bearing axes and that feet rest on the ground. For a camera view, fit the objective to the camera mount and check the view crosses the product at its inspection position. Keep a full exterior intact unless a source describes the internals.

The packaged `scene-component` collection supplies the player, rig, cabinet, metal marking and transfer assembly. For an unavailable mechanism, study its pivots, supports and moving contacts at real scale using the supplied references. Label the resulting geometry as illustrative. Review poses, occlusion and contact in the live player.
