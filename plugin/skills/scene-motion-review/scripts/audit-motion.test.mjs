import test from 'node:test';
import assert from 'node:assert/strict';
import { auditMotion } from './audit-motion.mjs';
import {
  stateAt,
  size,
} from '../../live-animation/examples/packing-transfer/motion.mjs';
import { productAt } from '../../live-animation/examples/inspection-station/transport.mjs';

const whole = [0, 1];
function syntheticTransfer() {
  const rules = [
    {
      id: 'free fingers vs case wall',
      kind: 'clear',
      points: ['middlePad', 'palmHeel'],
      min: [-0.1, 0, -0.006],
      max: [0.1, 0.2, 0.006],
      margin: 0.001,
      span: whole,
    },
    {
      id: 'case vs guard',
      kind: 'clear',
      points: ['caseCorner'],
      min: [-0.003, 0, -0.2],
      max: [0.003, 1, 0.2],
      margin: 0.001,
      span: whole,
    },
    {
      id: 'shoes planted',
      kind: 'plant',
      points: ['heel', 'toe'],
      maxDrift: 0.002,
      span: whole,
    },
    {
      id: 'carton follows clasp',
      kind: 'contact',
      points: ['clasp', 'caseHandle'],
      maxGap: 0.002,
      span: whole,
    },
    {
      id: 'packer knee',
      kind: 'bend',
      points: ['hip', 'knee', 'ankle'],
      minAngle: 65,
      maxAngle: 180,
      maxDegreesPerSecond: 70,
      span: whole,
    },
    {
      id: 'step into aisle',
      kind: 'speed',
      points: ['swingHeel'],
      maxSpeed: 1.1,
      span: whole,
    },
    {
      id: 'observer stays outside service bay',
      kind: 'clear',
      points: ['observerWrist'],
      min: [-0.2, 0, -0.2],
      max: [0.2, 1.5, 0.2],
      margin: 0.001,
      span: whole,
    },
  ];
  const frames = Array.from({ length: 61 }, (_, i) => {
    const t = i / 60,
      phase = t * t * (3 - 2 * t),
      handle = [0.3 + 0.15 * phase, 0.75 + 0.08 * phase, 0];
    return {
      t,
      points: {
        middlePad: [0, 0.1, -0.007],
        palmHeel: [0.01, 0.1, -0.012],
        caseCorner: [-0.04, 0.5, 0],
        heel: [0, 0, 0],
        toe: [0.2, 0, 0],
        clasp: handle.slice(),
        caseHandle: handle,
        hip: [0, 0.96, 0.03],
        knee: [0.05, 0.5, 0.07 + 0.03 * phase],
        ankle: [0, 0.09, 0],
        swingHeel: [0.32 * phase, 0.05 * Math.sin(Math.PI * phase), -0.2],
        observerWrist: [-0.28, 1, 0.02],
      },
    };
  });
  return { maxStep: 1 / 60, rules, frames };
}
test('known-clear blocking, handoff, bend and weight transfer pass', () => {
  const r = auditMotion(syntheticTransfer());
  assert.deepEqual(r.faults, []);
  assert.equal(r.coverage.length, 7);
});
for (const [label, key, spoiled, expected] of [
  [
    'opposite finger enters a wall although the grasp point still fits',
    'middlePad',
    [0, 0.1, 0],
    'free fingers vs case wall',
  ],
  [
    'palm heel enters through a thin case wall between clean endpoints',
    'palmHeel',
    [0.01, 0.1, 0.015],
    'free fingers vs case wall',
  ],
  [
    'case tunnels through a closed guard between frames',
    'caseCorner',
    [0.04, 0.5, 0],
    'case vs guard',
  ],
  [
    'stationary heel and rotating shoe',
    'toe',
    [0.186, 0, 0.067],
    'shoes planted',
  ],
  [
    'load floats after the clasp moves',
    'clasp',
    [0.6, 1, 0],
    'carton follows clasp',
  ],
  [
    'knee snaps during an otherwise clear bend',
    'knee',
    [0.32, 0.5, 0.08],
    'packer knee',
  ],
  ['swinging leg jumps a metre', 'swingHeel', [1.4, 0.1, 0], 'step into aisle'],
  [
    'watching operator reaches into the other workcell',
    'observerWrist',
    [0, 1, 0.02],
    'observer stays outside service bay',
  ],
])
  test(label, () => {
    const trace = syntheticTransfer();
    trace.frames[30].points[key] = spoiled;
    const report = auditMotion(trace);
    assert.ok(
      report.faults.some((f) => f.id === expected && f.t === 0.5),
      JSON.stringify(report.faults),
    );
  });
test('sweeping tangent to the guard face remains clear', () => {
  const tr = syntheticTransfer();
  for (const f of tr.frames) f.points.caseCorner = [-0.002, 0.3 + f.t * 0.2, 0];
  assert.deepEqual(auditMotion(tr).faults, []);
});
test('declared spans require complete clocks and named geometry', () => {
  const tr = syntheticTransfer();
  delete tr.frames[30].points.toe;
  assert.throws(() => auditMotion(tr), /invalid point shoes planted/);
  tr.frames.splice(30, 1);
  assert.throws(() => auditMotion(tr), /gap in motion sampling/);
  tr.rules[0].span = [0, 2];
  tr.maxStep = 0.1;
  assert.throws(() => auditMotion(tr), /span boundaries/);
});
test('second briefs exercise the same primitive on their shipped clocks', () => {
  // A design-time check on independent movement functions. Rendered-skin checks remain separate.
  const frames = Array.from({ length: 61 }, (_, i) => {
    const t = 5 + i / 60,
      transfer = stateAt(t);
    return {
      t,
      points: {
        hand: transfer.grip(1),
        face: [transfer.x + size[0] / 2, transfer.y + 0.01, 0],
      },
    };
  });
  const grip = {
    id: 'packing face',
    kind: 'contact',
    points: ['hand', 'face'],
    maxGap: 0.001,
    span: [5, 6],
  };
  assert.deepEqual(
    auditMotion({ frames, maxStep: 1 / 60, rules: [grip] }).faults,
    [],
  );
  const travel = Array.from({ length: 31 }, (_, i) => {
    const t = 2 + i / 60,
      p = productAt(2, t);
    return { t, points: { carton: [p.x, p.y, 0] } };
  });
  const rail = {
    id: 'inspection guard',
    kind: 'clear',
    points: ['carton'],
    min: [0.4, -0.1, 0.1],
    max: [0.47, 0.15, 0.12],
    margin: 0.001,
    span: [2, 2.5],
  };
  assert.deepEqual(
    auditMotion({ frames: travel, maxStep: 1 / 60, rules: [rail] }).faults,
    [],
  );
  rail.min[2] = -0.01;
  assert.ok(
    auditMotion({ frames: travel, maxStep: 1 / 60, rules: [rail] }).faults.some(
      (f) => f.id === rail.id,
    ),
  );
});
