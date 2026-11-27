import * as T from 'three';

const point = (o) => o.getWorldPosition(new T.Vector3());
const orientation = (o) => o.getWorldQuaternion(new T.Quaternion());
function rotateWorld(o, q) {
  o.quaternion.copy(orientation(o.parent).invert().multiply(q));
  o.updateWorldMatrix(false, true);
}
function basis(direction, across) {
  const x = direction.clone().normalize(),
    z = x.clone().cross(across).normalize(),
    y = z.clone().cross(x);
  return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x, y, z));
}
function aim(parent, child, target) {
  const start = point(parent),
    dir = point(child).sub(start).normalize(),
    end = target.clone().sub(start).normalize();
  rotateWorld(parent, new T.Quaternion().setFromUnitVectors(dir, end).multiply(orientation(parent)));
}

// Use the original skin, fingers and bind lengths; no scaling of the limbs.
export function fitOperator(root) {
  root.position.set(0.165, 0, -0.285);
  root.updateMatrixWorld(true);
  const bones = new Map(),
    meshes = [];
  root.traverse((o) => {
    if (o.isBone) bones.set(o.name.replaceAll('_', ' '), o);
    if (o.isSkinnedMesh) meshes.push(o);
  });
  const bone = (name) => {
    const b = bones.get('Bip01 ' + name);
    if (!b) throw new Error('Missing ' + name);
    return b;
  };
  const spine = bone('Spine'),
    chest = bone('Spine2'),
    neck = bone('Neck');
  const bind = new Map([...bones.values()].map((b) => [b, b.quaternion.clone()]));
  const arms = [-1, 1].map((side) => {
    const prefix = side < 0 ? 'R ' : 'L ';
    const upper = bone(prefix + 'UpperArm'),
      elbow = bone(prefix + 'Forearm'),
      hand = bone(prefix + 'Hand');
    const a = point(upper),
      b = point(elbow),
      w = point(hand);
    const rest = basis(
      point(bone(prefix + 'Finger2')).sub(w),
      point(bone(prefix + 'Finger4')).sub(point(bone(prefix + 'Finger1'))),
    );
    const desired = basis(new T.Vector3(0, -0.12, 0.993), new T.Vector3(0, -0.993, -0.12));
    const delta = desired.multiply(rest.invert()),
      q = delta.clone().multiply(orientation(hand));
    // Identify a real contact on the palm/fingers using the loaded skin. Keep its vertex
    // index for an independent measurement after posing (the wrist origin is not a contact).
    rotateWorld(hand, q);
    // Turn the thumb out of the grasp plane and place the digital pads on the carton.
    // Preserve the source phalanx lengths by rotating the original joints.
    const fingers = Array.from({ length: 5 }, (_, i) => [
      bone(prefix + 'Finger' + i),
      bone(prefix + 'Finger' + i + '1'),
      bone(prefix + 'Finger' + i + '2'),
    ]);
    const digits = new Set();
    hand.traverse((o) => digits.add(o));
    const samples = [];
    for (const mesh of meshes) {
      const { skinIndex, skinWeight, position } = mesh.geometry.attributes;
      for (let i = 0; i < position.count; i++) {
        let weight = 0,
          dominant = 0,
          name = '';
        for (let j = 0; j < 4; j++) {
          const b = mesh.skeleton.bones[skinIndex.getComponent(i, j)],
            v = skinWeight.getComponent(i, j);
          if (digits.has(b)) weight += v;
          if (v > dominant) {
            dominant = v;
            name = b.name.replaceAll('_', ' ');
          }
        }
        if (weight > 0.995) samples.push({ mesh, index: i, name });
      }
    }
    const skinPosition = (v) => v.mesh.localToWorld(v.mesh.getVertexPosition(v.index, new T.Vector3()));
    const palm = samples.filter((v) => v.name.endsWith('Hand'));
    const surface = Math.min(...palm.map((v) => side * skinPosition(v).x));
    for (let i = 0; i < 5; i++) {
      const chain = fingers[i];
      for (let j = 0; j < 2; j++) {
        const start = point(chain[j]),
          end = point(chain[j + 1]),
          length = start.distanceTo(end);
        const targetX = side * (surface + (i === 0 ? 0.009 : 0.006));
        const dx = T.MathUtils.clamp(targetX - start.x, -length * 0.78, length * 0.78);
        const tangent = new T.Vector3(0, i === 0 ? 0.4 : -0.14, i === 0 ? 0.91 : 0.99).normalize();
        const goal = start.clone().addScaledVector(tangent, Math.sqrt(length * length - dx * dx));
        goal.x += dx;
        aim(chain[j], chain[j + 1], goal);
      }
    }
    let pad = null;
    for (const v of samples) {
      const offset = skinPosition(v).sub(w);
      if (!pad || offset.x * side < pad.offset.x * side) pad = { ...v, offset };
    }
    const landmarks = [];
    for (const group of ['Hand', 'Finger1', 'Finger2', 'Finger3', 'Finger4', 'Finger0']) {
      const vertices = samples.filter((v) =>
        group === 'Hand' ? v.name.endsWith('Hand') : v.name.includes(' ' + group),
      );
      const inner = vertices.reduce((a, b) =>
        side * skinPosition(a).x < side * skinPosition(b).x ? a : b,
      );
      landmarks.push(inner);
    }
    // Centre the load-bearing patch along the face; the vertex setting depth can be at its edge.
    const patch = landmarks
      .map((v) => skinPosition(v).sub(w))
      .filter((v) => (v.x - pad.offset.x) * side < 0.01);
    const offset = pad.offset.clone();
    for (const axis of ['y', 'z'])
      offset[axis] =
        (Math.min(...patch.map((v) => v[axis])) + Math.max(...patch.map((v) => v[axis]))) / 2;
    if (!pad) throw new Error('Missing weighted hand skin');
    const low = samples.reduce((a, b) => (skinPosition(a).y < skinPosition(b).y ? a : b));
    const grasp = fingers
      .flat()
      .map((b) => ({ bone: b, rest: bind.get(b), closed: b.quaternion.clone() }));
    return {
      side,
      upper,
      elbow,
      hand,
      q,
      pad,
      offset,
      landmarks,
      low,
      grasp,
      l1: a.distanceTo(b),
      l2: b.distanceTo(w),
    };
  });
  function tip(b, angle, yaw = 0) {
    const original = orientation(b);
    const rot = new T.Quaternion().setFromEuler(new T.Euler(angle, yaw, 0, 'YXZ'));
    rotateWorld(b, rot.multiply(original));
  }
  return {
    pose(s) {
      for (const b of [spine, chest, neck, ...arms.flatMap((a) => [a.upper, a.elbow, a.hand])])
        b.quaternion.copy(bind.get(b));
      root.updateMatrixWorld(true);
      const active = s.engage * (1 - s.release);
      const turn = (-0.22 + 0.58 * s.carry) * active;
      tip(spine, 0.1 + 0.12 * active, turn * 0.45);
      tip(chest, 0.06 * active, turn * 0.55);
      tip(neck, 0.23 + 0.12 * active, turn * 0.3);
      for (const arm of arms) {
        const { side, upper, elbow, hand, l1, l2 } = arm;
        for (const digit of arm.grasp)
          digit.bone.quaternion.slerpQuaternions(digit.rest, digit.closed, active);

        const wrist = new T.Vector3(...s.grip(side)).sub(arm.offset);
        const shoulder = point(upper),
          d = wrist.clone().sub(shoulder),
          length = d.length();
        d.normalize();
        const span = T.MathUtils.clamp(length, Math.abs(l1 - l2) + 0.00001, l1 + l2 - 0.00001);
        const along = (l1 * l1 - l2 * l2 + span * span) / (2 * span);
        const pole = new T.Vector3(side * (0.38 + 0.47 * active), -0.90 + 0.18 * active, -0.46 + 0.74 * active);
        pole.addScaledVector(d, -pole.dot(d)).normalize();
        const mid = shoulder
          .clone()
          .addScaledVector(d, along)
          .addScaledVector(pole, Math.sqrt(Math.max(0, l1 * l1 - along * along)));
        aim(upper, elbow, mid);
        aim(elbow, hand, wrist);
        const relaxed = new T.Quaternion().setFromEuler(
          new T.Euler(0.22 * (1 - active), 0, side * 0.14 * (1 - active)),
        );
        rotateWorld(hand, relaxed.multiply(arm.q));
      }
    },
    lowest() {
      return arms.map(
        ({ low: v }) => v.mesh.localToWorld(v.mesh.getVertexPosition(v.index, new T.Vector3())).y,
      );
    },
    patches() {
      return arms.map(({ landmarks }) =>
        landmarks.map((v) =>
          v.mesh.localToWorld(v.mesh.getVertexPosition(v.index, new T.Vector3())).toArray(),
        ),
      );
    },
    pads() {
      return arms.map(({ pad }) =>
        pad.mesh.localToWorld(pad.mesh.getVertexPosition(pad.index, new T.Vector3())).toArray(),
      );
    },
  };
}
