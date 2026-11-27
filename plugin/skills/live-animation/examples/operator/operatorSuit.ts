// CC0 MakeHuman hm08 and male_worksuit01, fitted to the handling rig in metres.
import * as THREE from 'three';
import suit from './operator-suit.json';
import fabricUrl from './operator-fabric.webp';

const unpack = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0)).buffer;
const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(
    Float32Array.from(new Int16Array(unpack(suit.position)), (n) => n / 10000),
    3,
  ),
);
geometry.setAttribute('uv', new THREE.BufferAttribute(new Uint16Array(unpack(suit.uv)), 2, true));
geometry.setAttribute('skinIndex', new THREE.BufferAttribute(new Uint8Array(unpack(suit.bones)), 4));
geometry.setAttribute(
  'skinWeight',
  new THREE.BufferAttribute(new Uint8Array(unpack(suit.weights)), 4, true),
);
geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(unpack(suit.triangles)), 1));
geometry.computeVertexNormals();
const rest = suit.joints.map((side) => side.map((x) => new THREE.Vector3().fromArray(x)));
const materials = new WeakMap<THREE.Scene, THREE.MeshStandardMaterial>();
export const suitReady = new WeakMap<THREE.Scene, Promise<void>>();
const up = new THREE.Vector3(0, 1, 0);
const zero = new THREE.Vector3();
const collar = new THREE.Vector3(0, rest[0][0].y, 0);

/** Each matrix maps a garment segment from its fitted bind pose to two working joints.
 * The longitudinal scale follows the reach, preserving sleeve and trouser diameters. */
export function createSuit(scene: THREE.Scene) {
  let material = materials.get(scene);
  if (!material) {
    const map = new THREE.Texture();
    if (typeof Image !== 'undefined') {
      const image = new Image();
      suitReady.set(
        scene,
        new Promise<void>((resolve) => {
          image.onload = () => {
            map.image = image;
            map.needsUpdate = true;
            resolve();
          };
          image.onerror = () => resolve();
        }),
      );
      image.src = fabricUrl;
    }
    map.colorSpace = THREE.SRGBColorSpace;
    material = new THREE.MeshStandardMaterial({ map, roughness: 0.95, side: THREE.DoubleSide });
    materials.set(scene, material);
  }
  const mesh = new THREE.SkinnedMesh(geometry, material);
  mesh.name = 'Operator workwear';
  mesh.castShadow = true;
  mesh.frustumCulled = false; // garment vertices are moved from bind space into station space
  const bones = Array.from({ length: 9 }, () => new THREE.Bone());
  mesh.add(...bones);
  mesh.bind(new THREE.Skeleton(bones));
  mesh.userData.dispose = () => mesh.skeleton.dispose();
  for (const bone of bones) bone.matrixAutoUpdate = false;
  scene.add(mesh);
  const d = new THREE.Vector3(),
    target = new THREE.Vector3(),
    offset = new THREE.Vector3();
  const rotation = new THREE.Quaternion(),
    facing = new THREE.Quaternion();
  const stretch = new THREE.Matrix4(),
    across = new THREE.Vector3();
  function fit(
    index: number,
    a: THREE.Vector3,
    b: THREE.Vector3,
    start: THREE.Vector3,
    end: THREE.Vector3,
  ) {
    d.subVectors(b, a);
    const restLength = d.length();
    d.normalize();
    target.subVectors(end, start);
    const scale = target.length() / restLength - 1;
    target.normalize();
    across.copy(d).applyQuaternion(facing);
    rotation.setFromUnitVectors(across, target).multiply(facing);
    const { x, y, z } = d;
    stretch.set(
      1 + scale * x * x,
      scale * x * y,
      scale * x * z,
      0,
      scale * y * x,
      1 + scale * y * y,
      scale * y * z,
      0,
      scale * z * x,
      scale * z * y,
      1 + scale * z * z,
      0,
      0,
      0,
      0,
      1,
    );
    const m = bones[index].matrix.makeRotationFromQuaternion(rotation).multiply(stretch);
    offset.copy(a).applyMatrix4(m).negate().add(start);
    m.setPosition(offset);
    bones[index].matrixWorldNeedsUpdate = true;
  }
  return {
    trunk(hip: THREE.Vector3, shoulderCentre: THREE.Vector3, yaw: number) {
      facing.setFromAxisAngle(up, yaw);
      fit(0, zero, collar, hip, shoulderCentre);
    },
    limb(side: number, leg: boolean, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
      const i = side < 0 ? 0 : 1,
        j = leg ? 3 : 0,
        start = 1 + 4 * i + (leg ? 2 : 0);
      fit(start, rest[i][j], rest[i][j + 1], a, b);
      fit(start + 1, rest[i][j + 1], rest[i][j + 2], b, c);
    },
  };
}
