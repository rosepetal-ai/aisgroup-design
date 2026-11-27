// Inline a completed Vite build for portable offline review.
import fs from "node:fs";
import path from "node:path";

const [dir, output] = process.argv.slice(2);
if (!dir || !output)
  throw new Error("Usage: node pack.mjs <vite-output-directory> <output.html>");
let html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
html = html.replace(
  /<script type="module"[^>]* src="([^"]+)"[^>]*><\/script>/,
  (_, filename) => {
    const js = fs
      .readFileSync(path.resolve(dir, filename), "utf8")
      .replace(/<\/script/gi, "<\\/script");
    return '<script type="module">' + js + "</script>";
  },
);
html = html.replace(
  /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/,
  (_, filename) =>
    "<style>" +
    fs.readFileSync(path.resolve(dir, filename), "utf8") +
    "</style>",
);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html);
