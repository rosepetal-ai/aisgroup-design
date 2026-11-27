// Run against the rendered sample through its measure(t) adapter, or supply captured samples as JSON.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function audit(samples) {
  assert.ok(samples.length >= 2, 'At least two rendered samples required');
  let airborne = 0,
    pushing = 0,
    worstGrip = 0;
  for (let i = 0; i < samples.length; i++) {
    const f = samples[i],
      prev = samples[i - 1];
    const fail = (ok, message) => assert.ok(ok, `${f.t.toFixed(3)} s: ${message}`);
    if (prev) fail(f.t > prev.t && f.t - prev.t <= 1 / 30 + 0.00001, 'gap in the sampled motion');
    const height = f.min[1] - f.support;
    fail(height >= -0.0005, 'carton penetrates the work surface');
    if (
      prev &&
      height < 0.0001 &&
      prev.min[1] - prev.support < 0.0001 &&
      Math.abs(f.min[0] - prev.min[0]) > 0.0001
    ) {
      pushing++;
      fail(Math.abs(f.blade - f.min[0]) < 0.0005, 'carton moves before the pusher touches it');
    }
    if (height < 0.0005) continue;
    airborne++;
    f.patches.forEach((patch, i) => {
      const side = i === 0 ? -1 : 1,
        face = i === 0 ? f.min[0] : f.max[0];
      const fits = patch.filter(
        (p) => p[1] >= f.min[1] && p[1] <= f.max[1] && p[2] >= f.min[2] && p[2] <= f.max[2],
      );
      const gaps = fits.map((p) => side * (p[0] - face));
      fail(gaps.length > 0 && Math.min(...gaps) >= -0.001, 'hand penetrates or misses the carton face');
      const near = fits.filter((p) => Math.abs(p[0] - face) < 0.003);
      fail(near.length >= 3, 'fewer than three hand regions near the face');
      fail(
        Math.max(...near.map((p) => p[2])) - Math.min(...near.map((p) => p[2])) > 0.035,
        'grip concentrated at one point',
      );
      const gap = Math.min(...gaps.map(Math.abs));
      worstGrip = Math.max(worstGrip, gap);
      fail(gap < 0.001, 'no skin contact within 1 mm');
    });
  }
  assert.ok(airborne > 0 && pushing > 0, 'exercise both transfer and unsupported lift');
  return { frames: samples.length, airborne, pushing, worstGripMM: +(worstGrip * 1000).toFixed(3) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const samples = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  console.log(audit(samples));
  // Known-bad fixtures show what the checks actually catch.
  const gap = structuredClone(samples);
  gap.forEach((f) => (f.blade -= 0.012));
  assert.throws(() => audit(gap), /pusher touches/);
  const thumbs = structuredClone(samples);
  thumbs.forEach((f) => (f.patches = f.patches.map((points) => points.slice(-1))));
  assert.throws(() => audit(thumbs), /three hand regions/);
}
