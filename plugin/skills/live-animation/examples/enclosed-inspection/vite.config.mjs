// Build against the matching shared assets in either the plugin or studio source tree.
import { defineConfig } from "vite";
import { localIndustryLibrary } from "./library.mjs";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const overlayFile = [
  "../../../../brand/downloads/overlays/overlay.mjs",
  "../../../../../../public/downloads/overlays/overlay.mjs",
]
  .map((path) => fileURLToPath(new URL(path, import.meta.url)))
  .find(existsSync);

function browserOverlay() {
  const moduleId = "\0official-inspection-overlay";
  return {
    name: "official-inspection-overlay",
    resolveId(id) {
      return id === "official-inspection-overlay" ? moduleId : null;
    },
    load(id) {
      if (id !== moduleId) return;
      if (!overlayFile)
        throw new Error(
          "The branded overlay renderer is missing from the source tree.",
        );
      // The same renderer also exposes a Node CLI; only its exported browser portion belongs in the film.
      const source = readFileSync(overlayFile, "utf8");
      const cli = source.indexOf("// CLI:");
      if (cli < 0)
        throw new Error(
          "Check the browser entry of the shared overlay renderer.",
        );
      return source.slice(0, cli);
    },
  };
}

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [vue(), tailwind(), browserOverlay(), localIndustryLibrary()],
  resolve: {
    dedupe: [
      "three",
      "vue",
      "reka-ui",
      "@vueuse/core",
      "@lucide/vue",
      "clsx",
      "class-variance-authority",
      "tailwind-merge",
    ],
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 1000000,
    modulePreload: false,
    cssCodeSplit: false,
  },
});
