// Evaluate the same trajectories the camera saw. Distances use metres, angles use degrees.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const distance = (a, b) => Math.hypot(...a.map((v, k) => v - b[k]));
const subtract = (a, b) => a.map((v, i) => v - b[i]);

// The open interior excludes a point that only skims a face. Include transitions where
// the first or last point already lies inside. Each probe is in this solid's local frame.
function enters(a, b, min, max, margin) {
  let first = 0,
    last = 1;
  for (let k = 0; k < 3; k++) {
    const lo = min[k] + margin,
      hi = max[k] - margin;
    assert.ok(lo < hi, 'clearance margin erases a solid');
    const delta = b[k] - a[k];
    if (Math.abs(delta) < 1e-12) {
      if (a[k] <= lo || a[k] >= hi) return false;
    } else {
      const u = (lo - a[k]) / delta,
        v = (hi - a[k]) / delta;
      first = Math.max(first, Math.min(u, v));
      last = Math.min(last, Math.max(u, v));
      if (first >= last) return false;
    }
  }
  return first < last;
}

function jointAngle(a, pivot, b) {
  const u = subtract(a, pivot),
    v = subtract(b, pivot);
  const magnitude = Math.hypot(...u) * Math.hypot(...v);
  assert.ok(magnitude > 1e-9, 'collapsed joint marker');
  const cos = u.reduce((sum, x, k) => sum + x * v[k], 0) / magnitude;
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
}

function vec(p, name) {
  assert.ok(
    Array.isArray(p) && p.length === 3 && p.every(Number.isFinite),
    'invalid point ' + name,
  );
  return p;
}
function limit(n, name) {
  assert.ok(Number.isFinite(n) && n >= 0, 'invalid bound ' + name);
  return n;
}

export function auditMotion({ maxStep, frames, rules }) {
  assert.ok(
    frames?.length >= 2 && rules?.length,
    'expected sampled frames and independent shot-plan rules',
  );
  assert.ok(
    Number.isFinite(maxStep) && maxStep > 0,
    'supply a positive maximum sample interval',
  );
  frames.forEach(({ t }, i) => {
    assert.ok(Number.isFinite(t), 'invalid time');
    if (i)
      assert.ok(
        t > frames[i - 1].t && t - frames[i - 1].t <= maxStep + 1e-8,
        'gap in motion sampling at ' + t,
      );
  });
  const faults = [],
    coverage = [];
  const seen = new Set();
  for (const rule of rules) {
    const { id, kind, points, span } = rule;
    assert.ok(
      typeof id === 'string' && id && !seen.has(id),
      'missing or repeated rule ID',
    );
    seen.add(id);
    assert.ok(
      Array.isArray(span) &&
        span.length === 2 &&
        span.every(Number.isFinite) &&
        span[1] > span[0],
      'invalid span ' + id,
    );
    assert.ok(
      Array.isArray(points) &&
        points.length &&
        points.every((p) => typeof p === 'string' && p),
      'missing probe inventory ' + id,
    );
    const active = frames.filter(
      (f) => f.t >= span[0] - 1e-8 && f.t <= span[1] + 1e-8,
    );
    assert.ok(
      active.length >= 2 &&
        Math.abs(active[0].t - span[0]) < 1e-7 &&
        Math.abs(active.at(-1).t - span[1]) < 1e-7,
      'sample both span boundaries for ' + id,
    );
    const sample = (f) =>
      points.map((p) => vec(f.points?.[p], id + ' / ' + p + ' at ' + f.t));
    const first = sample(active[0]);
    let previous = first,
      priorAngle;
    const failed = new Set();
    function fault(f, label, value) {
      if (!failed.has(label)) faults.push({ id, t: f.t, probe: label, value });
      failed.add(label);
    }
    for (const [index, frame] of active.entries()) {
      const now = sample(frame);
      const dt = index ? frame.t - active[index - 1].t : 0;
      switch (kind) {
        case 'clear':
          vec(rule.min, id);
          vec(rule.max, id);
          limit(rule.margin, id);
          for (const [k, p] of now.entries())
            if (enters(previous[k], p, rule.min, rule.max, rule.margin))
              fault(frame, points[k], 'entered solid');
          break;
        case 'plant':
          limit(rule.maxDrift, id);
          for (const [k, p] of now.entries()) {
            const drift = distance(p, first[k]);
            if (drift > rule.maxDrift) fault(frame, points[k], drift);
          }
          break;
        case 'contact': {
          assert.equal(
            now.length,
            2,
            'contact requires two independently measured surface points',
          );
          const gap = distance(now[0], now[1]);
          if (gap > limit(rule.maxGap, id))
            fault(frame, points.join(' / '), gap);
          break;
        }
        case 'speed':
          limit(rule.maxSpeed, id);
          if (dt)
            for (const [k, p] of now.entries()) {
              const speed = distance(p, previous[k]) / dt;
              if (speed > rule.maxSpeed) fault(frame, points[k], speed);
            }
          break;
        case 'bend': {
          assert.equal(
            now.length,
            3,
            'bend requires hip, knee and ankle or another joint triple',
          );
          const angle = jointAngle(...now);
          assert.ok(
            limit(rule.minAngle, id) <= limit(rule.maxAngle, id) &&
              rule.maxAngle <= 180,
            'invalid bend range',
          );
          limit(rule.maxDegreesPerSecond, id);
          if (angle < rule.minAngle || angle > rule.maxAngle)
            fault(frame, 'joint angle', angle);
          if (
            dt &&
            Math.abs(angle - priorAngle) / dt > rule.maxDegreesPerSecond
          )
            fault(frame, 'angular speed', Math.abs(angle - priorAngle) / dt);
          priorAngle = angle;
          break;
        }
        default:
          throw Error('Unknown motion rule ' + kind);
      }
      previous = now;
    }
    coverage.push({ id, kind, samples: active.length, probes: points.length });
  }
  return { frames: frames.length, coverage, faults };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (!process.argv[2])
    throw Error('Usage: node audit-motion.mjs captured-motion.json');
  const report = auditMotion(JSON.parse(readFileSync(process.argv[2], 'utf8')));
  console.log(JSON.stringify(report, null, 2));
  if (report.faults.length) process.exitCode = 1;
}
