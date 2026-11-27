// The local build takes just these named assets from the studio's manufacturer library.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { installedSceneModels } from "../../../scene-assembly/models-directory.mjs";
const files = {
  camera: "basler-ace2-gige.part.glb",
  lens: "v1226-mpz.part.glb",
  ring: "svl-rm75-ring-light.part.glb",
  profile: "minitec-profile-45x45-f.part.glb",
  rail: "minitec-profile-45x90-f.part.glb",
  column: "minitec-profile-90x90-l.part.glb",
  foot: "minitec-foot-90-gd.part.glb",
  hinge: "minitec-hinge-45-al.part.glb",
  corner: "minitec-angle-45-gd-z.part.glb",
  drive: "minitec-belt-driving-cylinder-45.part.glb",
  idler: "minitec-belt-tensioning-cylinder-45.part.glb",
  bearing: "minitec-conveyor-bearing-45.part.glb",
  kraft: "kraft-detail.webp",
};
export function localIndustryLibrary() {
  const id = "\0inspection-industry-library";
  return {
    name: "inspection-industry-library",
    resolveId(request) {
      return request === "inspection-industry-library" ? id : null;
    },
    load(request) {
      if (request !== id) return;
      const modelRoot = process.env.AIS_SCENE_MODELS_DIR || installedSceneModels();
      const root =
        process.env.AIS_INDUSTRY_MODELS ||
        (modelRoot && join(modelRoot, "industry"));
      if (!root)
        throw new Error(
          "Install the private scene model pack or set AIS_SCENE_MODELS_DIR to the local models directory.",
        );
      const models = Object.fromEntries(
        Object.entries(files).map(([key, name]) => {
          const bytes = readFileSync(join(root, name));
          return [
            key,
            "data:" +
              (name.endsWith(".webp") ? "image/webp" : "model/gltf-binary") +
              ";base64," +
              bytes.toString("base64"),
          ];
        }),
      );
      return "export default " + JSON.stringify(models);
    },
  };
}
