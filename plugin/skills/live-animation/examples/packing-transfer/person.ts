// Retarget a complete Rocketbox skeleton. Positions passed by a station are in world metres.
import * as T from 'three';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

const up = new T.Vector3(0, 1, 0);
const v = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const point = (o: T.Object3D) => o.getWorldPosition(v());
const orient = (o: T.Object3D) => o.getWorldQuaternion(new T.Quaternion());
function rotate(b: T.Object3D, q: T.Quaternion) {
  b.quaternion.copy(orient(b.parent!).invert().multiply(q));
  b.updateWorldMatrix(false, false);
}
function aim(a: T.Object3D, b: T.Object3D, end: T.Vector3) {
  const origin = point(a),
    dir = point(b).sub(origin).normalize();
  rotate(
    a,
    new T.Quaternion()
      .setFromUnitVectors(dir, end.clone().sub(origin).normalize())
      .multiply(orient(a)),
  );
}
function basis(along: T.Vector3, across: T.Vector3) {
  const x = along.normalize(),
    z = x.clone().cross(across).normalize();
  return new T.Quaternion().setFromRotationMatrix(
    new T.Matrix4().makeBasis(x, z.clone().cross(x), z),
  );
}
function chain(a: T.Object3D, b: T.Object3D, tip: T.Object3D) {
  return {
    a,
    b,
    tip,
    l1: point(a).distanceTo(point(b)),
    l2: point(b).distanceTo(point(tip)),
  };
}
function reach(c: ReturnType<typeof chain>, end: T.Vector3, pole: T.Vector3) {
  const origin = point(c.a),
    delta = end.clone().sub(origin),
    dist = delta.length(),
    dir = delta.normalize();
  const span = T.MathUtils.clamp(
    dist,
    Math.abs(c.l1 - c.l2) + 1e-6,
    c.l1 + c.l2 - 1e-6,
  );
  const d = (c.l1 * c.l1 - c.l2 * c.l2 + span * span) / (2 * span);
  const axis = pole.clone().addScaledVector(dir, -pole.dot(dir)).normalize();
  aim(
    c.a,
    c.b,
    origin
      .addScaledVector(dir, d)
      .addScaledVector(axis, Math.sqrt(Math.max(0, c.l1 * c.l1 - d * d))),
  );
  aim(c.b, c.tip, end);
}
export interface Grasp {
  /** Opposing contacts, or the same point for a single-finger push. */
  index: T.Vector3;
  thumb: T.Vector3;
  yaw: number;
  relaxed?: number;
  fingers?: T.Vector3[];
  fingerPole?: T.Vector3;
  item?: { kind: 'carton' | 'tube' | 'cap' | 'flap' | 'case'; id: number };
}
export interface Stance {
  home: T.Vector3;
  yaw: number;
  lean: number;
  lower: number;
  /** Shift of each planted or stepping foot relative to the standing origin. */
  feet?: [T.Vector3, T.Vector3];
  footYaw?: [number, number];
  shift?: T.Vector3;
  kneePole?: T.Vector3;
}
type Probe = { mesh: T.SkinnedMesh; index: number };
const skin = (p: Probe) =>
  p.mesh.localToWorld(p.mesh.getVertexPosition(p.index, v()));

export function createPerson(scene: T.Scene, template: T.Group, name: string) {
  const root = clone(template) as T.Group;
  root.name = name;
  scene.add(root);
  root.updateMatrixWorld(true);
  const bones = new Map<string, T.Bone>(),
    meshes: T.SkinnedMesh[] = [];
  root.traverse((o) => {
    if (o instanceof T.Bone)
      bones.set(o.name.replaceAll('_', ' ').replace(/^Bip01 /, ''), o);
    if (o instanceof T.SkinnedMesh) {
      o.castShadow = o.receiveShadow = true;
      o.frustumCulled = false;
      meshes.push(o);
    }
  });
  const bone = (name: string) => {
    const b = bones.get(name);
    if (!b) throw new Error('Missing Rocketbox joint ' + name);
    return b;
  };
  const bind = new Map(
    [...bones.values()].map((b) => [b, b.quaternion.clone()]),
  );
  const pelvis = bone('Pelvis'),
    spine = bone('Spine'),
    neck = bone('Neck');
  const legs = ([-1, 1] as const).map((side) => {
    const p = side === -1 ? 'R ' : 'L ';
    const c = chain(bone(p + 'Thigh'), bone(p + 'Calf'), bone(p + 'Foot'));
    return { c, rest: point(c.tip), q: orient(c.tip) };
  });
  const arms = ([-1, 1] as const).map((side) => {
    const p = side === -1 ? 'R ' : 'L ';
    const upper = bone(p + 'UpperArm'),
      elbow = bone(p + 'Forearm'),
      hand = bone(p + 'Hand');
    const wrist = point(hand);
    const rest = basis(
      point(bone(p + 'Finger2')).sub(wrist),
      point(bone(p + 'Finger4')).sub(point(bone(p + 'Finger1'))),
    );
    const q = basis(v(0, -0.33, 0.944), v(side, 0, 0))
      .multiply(rest.invert())
      .multiply(orient(hand));
    const digits = [0, 1, 2, 3, 4].map((n) => {
      const first = bone(p + 'Finger' + n),
        mid = bone(p + 'Finger' + n + '1'),
        last = bone(p + 'Finger' + n + '2');
      const start = point(last),
        dir = start.clone().sub(point(mid)).normalize();
      let best = -Infinity,
        probe: Probe | undefined;
      for (const mesh of meshes) {
        const joint = mesh.skeleton.bones.indexOf(last);
        if (joint < 0) continue;
        const { skinIndex, skinWeight } = mesh.geometry.attributes;
        for (let i = 0; i < skinIndex.count; i++) {
          let w = 0;
          for (let k = 0; k < 4; k++)
            if (skinIndex.getComponent(i, k) === joint)
              w += skinWeight.getComponent(i, k);
          if (w < 0.75) continue;
          const candidate = { mesh, index: i },
            score = skin(candidate).sub(start).dot(dir);
          if (score > best) {
            best = score;
            probe = candidate;
          }
        }
      }
      if (!probe) throw new Error('Missing weighted fingertip ' + last.name);
      const tip = new T.Object3D();
      tip.position.copy(last.worldToLocal(skin(probe)));
      last.add(tip);
      return {
        c: chain(first, mid, tip),
        last,
        probe,
        base: point(first).sub(wrist).applyQuaternion(orient(hand).invert()),
      };
    });
    return { side, q, c: chain(upper, elbow, hand), digits };
  });
  root.userData.dispose = () => {
    for (const skeleton of new Set(meshes.map((m) => m.skeleton)))
      skeleton.dispose();
  };
  let targets: [Grasp, Grasp];
  root.userData.gripAudit = () => ({
    root:root.position.toArray(),
    joints: Object.fromEntries(["Pelvis","Spine2","R Thigh","R Calf","R Foot","L Calf","L Foot","R UpperArm","L Hand"].map(n=>[n,point(bone(n)).toArray()])),
    pads: arms.map((a, i) => ({
      item: targets[i].item,
      index: skin(a.digits[1].probe).toArray(),
      thumb: skin(a.digits[0].probe).toArray(),
    })),
    gaps: arms.map((a, i) => [
      skin(a.digits[1].probe).distanceTo(targets[i].index),
      skin(a.digits[0].probe).distanceTo(targets[i].thumb),
    ]),
    feet: legs.map((l) => point(l.c.tip).y),
  });
  function pose(s: Stance, grips: [Grasp, Grasp]) {
    targets = grips;
    for (const [b, q] of bind) b.quaternion.copy(q);
    root.position.copy(s.home);
    root.rotation.y = s.yaw;
    root.position.y -= s.lower;
    if (s.shift) root.position.add(s.shift);
    root.updateMatrixWorld(true);
    const bodyTurn = new T.Quaternion().setFromAxisAngle(up, s.yaw);
    function bend(b: T.Bone, angle: number) {
      const axis = v(1, 0, 0).applyQuaternion(bodyTurn);
      rotate(
        b,
        new T.Quaternion().setFromAxisAngle(axis, angle).multiply(orient(b)),
      );
    }
    bend(pelvis, s.lean * 0.48);
    bend(spine, s.lean * 0.52);
    bend(neck, 0.2);
    const goals = arms.map((arm, i) => {
      const g = grips[i],
        turn = new T.Quaternion().setFromAxisAngle(up, g.yaw);
      const center = g.index.clone().lerp(g.thumb, 0.5);
      const wrist = center
        .clone()
        .add(v(arm.side * 0.012, 0.09, -0.105).applyQuaternion(turn));
      const handQ = turn.clone().multiply(arm.q);
      // Fit the wrist to the intersection of the two finger reach volumes before solving the elbow.
      // This preserves the original length of the thumb even on the smallest tube.
      for (let j = 0; j < 4; j++)
        for (const n of [1, 0]) {
          const finger = arm.digits[n],
            target = n === 0 ? g.thumb : g.index;
          const relative = target
            .clone()
            .sub(wrist)
            .sub(finger.base.clone().applyQuaternion(handQ));
          const extra = relative.length() - finger.c.l1 - finger.c.l2 + 0.002;
          if (extra > 0) wrist.add(relative.normalize().multiplyScalar(extra));
        }
      return { g, turn, wrist };
    });
    // Share long reaches between the hips and shoulder before solving the elbows. The feet keep their floor anchors.
    for (let j = 0; j < 4; j++) {
      let longest = 0.0001,
        shift = v();
      for (const [i, arm] of arms.entries()) {
        const d = goals[i].wrist.clone().sub(point(arm.c.a)),
          extra = d.length() - arm.c.l1 - arm.c.l2 + 0.004;
        if (extra > longest) {
          longest = extra;
          shift = d.normalize().multiplyScalar(extra);
        }
      }
      if (longest < 0.0002) break;
      root.position.add(shift);
      root.updateMatrixWorld(true);
    }
    for (const [i, leg] of legs.entries()) {
      const foot = leg.rest
        .clone()
        .applyAxisAngle(up, s.feet ? 0 : s.yaw)
        .add(s.home);
      foot.y += .0015; // Offset of the lowest shoe vertex from the source bind plane.
      if (s.feet) foot.add(s.feet[i]);
      reach(leg.c, foot, s.kneePole ?? v(0, .15, 1).applyQuaternion(bodyTurn));
      const soleTurn = s.footYaw ? new T.Quaternion().setFromAxisAngle(up,s.footYaw[i]) : bodyTurn.clone();
      rotate(leg.c.tip, soleTurn.multiply(leg.q));
    }
    for (const [i, arm] of arms.entries()) {
      const { g, turn, wrist } = goals[i];
      reach(
        arm.c,
        wrist,
        v(arm.side * 0.22, -0.95, -0.74).applyQuaternion(bodyTurn),
      );
      rotate(arm.c.tip, turn.clone().multiply(arm.q));
      for (const [j, finger] of arm.digits.entries()) {
        const dest = (j === 0 ? g.thumb : g.index).clone();
        if (j > 1)
          dest.add(
            v(
              arm.side * (j - 1) * 0.013,
              (j - 1) * 0.004,
              -(j - 1) * 0.009,
            ).applyQuaternion(turn),
          );
        if (j>1 && g.fingers) dest.copy(g.fingers[j-2]);
        if (g.relaxed) dest.lerp(point(finger.c.tip), g.relaxed * 0.82);
        reach(
          finger.c,
          dest,
          g.fingerPole ?? v(
            j === 0 ? -arm.side * 0.6 : arm.side * 0.1,
            1,
            0.25,
          ).applyQuaternion(turn),
        );
      }
    }
    root.updateMatrixWorld(true);
  }
  return {
    pose,
    contacts: () =>
      arms.map((a) => [skin(a.digits[1].probe), skin(a.digits[0].probe)]),
  };
}
export type Person = ReturnType<typeof createPerson>;
