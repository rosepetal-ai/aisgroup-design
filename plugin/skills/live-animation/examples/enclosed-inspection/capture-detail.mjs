import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, CHROME_ARGS } from "../../scripts/lib.mjs";

const [file, output, time, x, y, view = "auto"] = process.argv.slice(2);
if (!file || !output || !["auto", "wide", "reader", "reject"].includes(view) || ![time, x, y].every(value => value != null && Number.isFinite(Number(value)))) {
  throw new Error("Usage: node capture-detail.mjs <standalone.html> <detail.png> <seconds> <centre-x 0..1> <centre-y 0..1> [auto|wide|reader|reject]");
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined, args: CHROME_ARGS });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(pathToFileURL(path.resolve(file)).href);
  await page.waitForFunction(() => typeof window.inspectionReview?.geometryDetail === "function", null, { timeout: 25000 });
  const data = await page.evaluate(async ([t, u, v, selected]) => {
    window.inspectionReview.view(selected);
    await new Promise(requestAnimationFrame);
    window.inspectionReview.seek(t);
    return window.inspectionReview.geometryDetail(u, v);
  }, [Number(time), Number(x), Number(y), view]);
  await fs.writeFile(output, Buffer.from(data.split(",")[1], "base64"));
} finally {
  await browser.close();
}
