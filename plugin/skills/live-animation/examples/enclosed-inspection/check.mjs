import { chromium, CHROME_ARGS } from "../../scripts/lib.mjs";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import job from "./job.mjs";

const close = (a, b) => Math.abs(a - b) < 1e-5;
const sidePusher = job.reject === "side-pusher";
const ids = job.items.map(item => item.id);
const expectedResults = job.items.map(item => item.readable ? "OK" : "NOK");
const names = job.items.map(item => job.product.name + " " + item.id);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || undefined,
  args: CHROME_ARGS,
});
const url = process.argv[2] || pathToFileURL(resolve("index.html")).href;
try {
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } }),
      errors = [],
      requests = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => requests.push(r.url()));
    await page.goto(url);
    await page.waitForFunction(() => window.inspectionReview, null, {
      timeout: 25000,
    });
    assert.equal(await page.title(), job.title.join(" ") + " | AIS Vision Systems");
    assert.equal(await page.locator("canvas").getAttribute("aria-label"), job.sceneDescription);
    assert.equal((await page.locator("h1").innerText()).split(/\s+/).join(" ").trim(), job.title.join(" "));
    const inventory = await page.evaluate(() =>
      window.inspectionReview.inventory(),
    );
    for (const name of [
      "camera",
      "lens",
      "ring",
      "profile",
      "rail",
      "column",
      "foot",
      "hinge",
      "corner",
      "bearing",
      "drive",
      "idler",
    ])
      assert.ok(inventory.includes(name));
    const physical = await page.evaluate(() =>
      window.inspectionReview.auditClearance(),
    );
    assert.deepEqual(physical.opticalHits, ids);
    assert.equal(physical.collisions, 0);
    assert.ok(physical.maxSupportGap < 0.00001);
    assert.ok(
      await page.evaluate(
        () => window.inspectionReview.auditClearance(0.15).collisions > 0,
      ),
    );
    console.log("Rendered geometry", JSON.stringify(physical));
    const sample = async (t) => {
      await page.evaluate((t) => window.inspectionReview.seek(t), t);
      await page.waitForTimeout(90);
      return page.evaluate(() => window.inspectionReview.records());
    };
    const checks = [
      [0, [null, null]],
      [3.31, [null, null]],
      [3.4, [expectedResults[0], null]],
      [6.9, [expectedResults[0], null]],
      [8.31, [expectedResults[0], null]],
      [8.4, expectedResults],
      [12.5, expectedResults],
      [3.4, [expectedResults[0], null]],
      [0, [null, null]],
    ];
    for (const [t, expected] of checks) {
      const rows = await sample(t);
      assert.deepEqual(
        rows.map((r) => r.id),
        ids,
      );
      assert.deepEqual(
        rows.map((r) => r.result),
        expected,
      );
      assert.ok(Math.abs(rows[0].x - rows[1].x - 0.84) < 1e-8);

      if ([3.4, 8.4].includes(t)) {
        const index = t === 3.4 ? 0 : 1;
        const plate = await page.locator(".evidence").boundingBox();
        const logo = await page.locator(".identity").boundingBox();
        if (h > w) {
          assert.ok(Math.abs(plate.y - logo.y - logo.height - 16) < 1);
          assert.ok(Math.abs(plate.x - logo.x) < 1);
        } else {
          assert.ok(Math.abs(plate.y - logo.y) < 1);
          assert.ok(Math.abs(w - plate.x - plate.width - logo.x) < 1);
        }
        const chip = page.locator(".verdict tspan").last();
        assert.equal(await chip.textContent(), ids[index]);
        const insidePlate = await chip.evaluate(node => {
          const text = node.getBoundingClientRect();
          const svg = node.ownerSVGElement.getBoundingClientRect();
          const plate = node.closest(".evidence").getBoundingClientRect();
          return text.left >= Math.max(svg.left, plate.left) &&
            text.right <= Math.min(svg.right, plate.right);
        });
        assert.ok(insidePlate, "Entire article ID must be visible in its evidence plate");
        assert.equal(
          await page.locator(".evidence img").getAttribute("alt"),
          "Code printed on " + names[index],
        );
      }
      const beat = [2.2, 3.32, 6.0, 8.32, 11].filter(at => t >= at).length;
      assert.equal((await page.locator("[data-scene-caption]").textContent()).trim(), job.captions[beat]);
      if (t === 12.5)
        assert.ok(
          (await page.locator(".marks").textContent()).includes(names[1]),
        );
    }
    if (sidePusher) {
      assert.ok(inventory.includes("side-pusher") && inventory.includes("receiver"));
      const audit = fault => page.evaluate(fault => window.inspectionReview.auditReject(fault), fault);
      const clean = await audit();
      assert.deepEqual(clean.issues, []);
      assert.equal(clean.failedOnTray, true);
      assert.equal(clean.goodOnBelt, true);
      assert.ok(clean.passPadClearance > 0);
      const faults = [
        ["miss-contact", "Contact pad misses or enters the carton"],
        ["lower-tray", "Support gap under carton"],
        ["stuck-pad", "Pad fails to return home"],
        ["wrong-item", "Wrong final destination"],
      ];
      for (const [fault, issue] of faults) {
        const broken = await audit(fault);
        assert.ok(broken.issues.includes(issue), `Expected ${fault} to produce ${issue}`);
      }

      // Seek out of order so a previous discharge cannot leave the carton on the tray.
      const stop = await sample(12.25);
      const mid = await sample(13.55);
      const load = await sample(14.30);
      const returned = await sample(15.75);
      const final = await sample(16.65);
      const closingMarks = await page.locator(".marks").textContent();
      for (const [i, name] of names.entries())
        assert.ok(closingMarks.includes(name + expectedResults[i]), "Closing shot must retain " + name + " and its result");
      for (const frame of [stop, mid, load, returned, final]) {
        assert.deepEqual(frame.map(item => item.result), ["OK", "NOK"]);
        assert.ok(close(frame[0].z, 0), "Passing carton stays on the belt");
        assert.ok(close(frame[1].x, stop[1].x), "Failed carton stays aligned with the pad");
      }
      assert.ok(close(stop[1].z, 0));
      assert.ok(Math.abs(mid[1].z) > 0 && Math.abs(mid[1].z) < Math.abs(load[1].z));
      assert.ok(close(load[1].z, returned[1].z) && close(load[1].z, final[1].z));
      assert.ok(final[0].x > returned[0].x, "Passing carton advances after the pad retracts");
      assert.deepEqual(await sample(12.25), stop);

      for (const view of ["reject", "auto"]) {
        await page.evaluate(view => window.inspectionReview.view(view), view);
        await sample(13.55);
        const anchors = await page.evaluate(() => window.inspectionReview.rejectFraming());
        const footer = await page.locator("footer").boundingBox();
        for (const [name, point] of Object.entries(anchors)) {
          assert.ok(point.x > 0 && point.x < w && point.y > 0 && point.y < footer.y,
            `${view} ${name} is behind the controls or outside the ${w}px viewport: ${JSON.stringify(point)}`);
        }
        assert.ok((await page.locator(".marks").textContent()).includes(names[1]));
      }
      for (const [t, index] of [[12.25, 5], [13.55, 6], [15.0, 7]]) {
        await sample(t);
        assert.equal((await page.locator("[data-scene-caption]").textContent()).trim(), job.captions[index]);
      }
      console.log(w, "side transfer, sampled pad contact, both destinations, camera and fault cases", clean);
    }
    if (w > 400) {
      await page.getByRole("button", { name: "Captions", exact: true }).click();
      assert.equal(
        await page.locator("[data-scene-caption]").isVisible(),
        false,
      );
      await page.getByText(job.chapters[2], { exact: true }).last().click();
      assert.equal(
        (await page.locator(".evidence").textContent()).includes(expectedResults[1]),
        true,
      );
    } else {
      await page.getByRole("button", { name: "Speed and chapters" }).click();
      await page.getByRole("menuitemcheckbox", { name: "Captions" }).click();
      assert.equal(
        await page.locator("[data-scene-caption]").isVisible(),
        false,
      );
    }
    if (sidePusher) {
      if (w > 400) {
        await page.getByText(job.chapters[3], { exact: true }).last().click();
      } else {
        await page.getByRole("button", { name: "Speed and chapters" }).click();
        await page.getByRole("menuitemradio", { name: job.chapters[3], exact: true }).click();
      }
      assert.ok(Math.abs(await page.evaluate(() => window.__anim.time()) - 12.25) < 1e-6);
      assert.equal(await page.locator("[data-scene-caption]").isVisible(), false);
      const loaded = await sample(14.30);
      const depositedZ = loaded[1].z;
      await sample(12.25);
      const liveRun = page.evaluate(() => new Promise((resolve, reject) => {
        const readings = [];
        const deadline = performance.now() + 20000;
        function observe() {
          const t = window.__anim.time();
          readings.push([t, ...window.inspectionReview.records().map(r => r.z)]);
          if (t >= 16.65 - 0.001) return resolve(readings);
          if (performance.now() > deadline) return reject(new Error("Playback stopped before pad recovery"));
          requestAnimationFrame(observe);
        }
        observe();
      }));
      await page.getByRole("button", { name: "Play", exact: true }).click();
      const history = await liveRun;
      assert.ok(history.every(([, goodZ]) => close(goodZ, 0)));
      assert.ok(history.some(([t,, failedZ]) => t > 12.85 && t < 14.30 &&
        Math.abs(failedZ) > 0.001 && Math.abs(failedZ) < Math.abs(depositedZ) - 0.001));
      assert.ok(history.filter(([t]) => t >= 14.30).every(([,, z]) => close(z, depositedZ)));
    }
    await sample(0);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.waitForTimeout(520);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    assert.ok(await page.evaluate(() => window.__anim.time() > 0));
    assert.deepEqual(errors, []);
    if (url.startsWith("file:"))
      assert.deepEqual(
        requests.filter(
          (u) => !u.startsWith("file:") && !u.startsWith("data:"),
        ),
        [],
      );
    console.log(
      w,
      h,
      "identity, reverse seek, evidence, controls, no external requests",
      errors,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
