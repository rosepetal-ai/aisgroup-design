import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import urls from "inspection-industry-library";

type P = [number, number, number];
const v = (p: P) => new T.Vector3(...p);
const unit = new T.Vector3(0, 0, 1);
export async function hardware(scene: T.Scene, aluminium: T.Material) {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const roles: Record<string, T.Material> = { anodised: aluminium };
  for (const [name, color, metal, rough] of [
    ["zinc", 0xb8bcc0, 1, 0.38],
    ["stainless_mach", 0xd8dadc, 1, 0.27],
    ["chrome", 0xe6e8ea, 1, 0.14],
    ["black_plastic", 0x101214, 0, 0.46],
    ["dark_plastic", 0x23262a, 0, 0.53],
    ["yellow", 0xd9a21b, 0.1, 0.47],
    ["lens", 0x101522, 0.18, 0.06],
    ["led", 0xefefe8, 0, 0.5],
  ] as const)
    roles[name] = new T.MeshStandardMaterial({
      color,
      metalness: metal,
      roughness: rough,
      side: T.DoubleSide,
    });
  const parts: Record<string, T.Group> = {};
  await Promise.all(
    Object.entries(urls)
      .filter(([name]) => name !== "kraft")
      .map(async ([name, url]) => {
        const gltf = await loader.loadAsync(url as string);
        gltf.scene.traverse((o) => {
          if (o instanceof T.Mesh) {
            o.material = roles[o.material.name] || aluminium;
            o.castShadow = o.receiveShadow = true;
          }
        });
        parts[name] = gltf.scene;
      }),
  );
  function place(
    name: string,
    at: P,
    rotation: P = [0, 0, 0],
    owner: T.Object3D = scene,
  ) {
    const part = parts[name].clone();
    part.name = name;
    part.position.set(...at);
    part.rotation.set(...rotation);
    owner.add(part);
    return part;
  }
  function beam(from: P, to: P, name = "profile", spin = 0) {
    const a = v(from),
      d = v(to).sub(a),
      len = d.length();
    const p = place(name, from);
    p.quaternion.setFromUnitVectors(unit, d.normalize());
    p.rotateZ(spin);
    p.scale.z = len / 0.0254;
    return p;
  }
  function cable(points: P[], radius = 0.004) {
    const curve = new T.CatmullRomCurve3(points.map(v), false, "centripetal");
    const tube = new T.Mesh(
      new T.TubeGeometry(curve, 32, radius, 8, false),
      roles.black_plastic,
    );
    scene.add(tube);
  }
  for (const x of [-1.32, 1.32])
    for (const z of [-0.19, 0.19]) {
      place("foot", [x, 0, z], [-Math.PI / 2, 0, 0]);
      beam([x, 0.08, z], [x, 0.685, z], "column");
    }
  for (const x of [-1.32, 1.32]) beam([x, 0.24, -0.145], [x, 0.24, 0.145]);
  for (const z of [-0.19, 0.19])
    beam([-1.8, 0.708, z], [1.8, 0.708, z], "rail", Math.PI / 2);
  const rolls = [];
  for (const [name, x] of [
    ["idler", -1.84],
    ["drive", 1.84],
  ] as const) {
    const turn = new T.Group();
    turn.position.set(x, 0.751, 0);
    scene.add(turn);
    place(
      name,
      [0, 0, 0],
      name === "drive" ? [0, -Math.PI / 2, 0] : [Math.PI / 2, 0, 0],
      turn,
    );
    rolls.push(turn);
    for (const z of [-0.188, 0.188])
      place("bearing", [x, 0.751, z], [Math.PI / 2, 0, x > 0 ? Math.PI : 0]);
  }
  for (const x of [-0.33, 0.33])
    for (const z of [-0.19, 0.19]) {
      beam([x, 0.751, z], [x, 1.435, z]);
      place(
        "corner",
        [x + (x < 0 ? 0.022 : -0.022), 1.385, z],
        [0, x < 0 ? 0 : Math.PI, 0],
      );
    }
  for (const z of [-0.19, 0.19])
    for (const y of [0.8, 1.413]) beam([-0.3075, y, z], [0.3075, y, z]);
  for (const x of [-0.33, 0.33]) beam([x, 1.413, -0.1675], [x, 1.413, 0.1675]);
  beam([0, 1.337, -0.1675], [0, 1.337, -0.057]);
  const mount = new T.Mesh(new T.BoxGeometry(0.034, 0.068, 0.043), roles.zinc);
  mount.position.set(0, 1.31, -0.036);
  scene.add(mount);
  for (const y of [0.94, 1.3]) {
    const hinge = place("hinge", [-0.327, y, 0.217], [-Math.PI / 2, 0, 0]);
    const bounds = new T.Box3().setFromObject(hinge);
    hinge.position.add(
      v([-0.327, y, 0.217]).sub(bounds.getCenter(new T.Vector3())),
    );
  }
  const rig = new T.Group();
  rig.name = "Optical head";
  rig.position.set(0, 1.28, 0);
  rig.rotation.x = Math.PI / 2;
  scene.add(rig);
  place("camera", [0, 0, 0], [0, 0, 0], rig);
  place("lens", [0, 0, 0], [0, 0, 0], rig);
  place("ring", [0, 0, 0.03], [-Math.PI / 2, 0, 0], rig);
  const diffuser = new T.Mesh(new T.RingGeometry(0.022, 0.0315, 48), roles.led);
  diffuser.position.z = 0.0466;
  rig.add(diffuser);
  cable(
    [
      [0, 1.339, 0],
      [0, 1.358, 0],
      [-0.03, 1.361, -0.02],
      [-0.047, 1.358, -0.148],
      [0, 1.37, -0.172],
      [-0.26, 1.37, -0.172],
      [-0.31, 1.35, -0.172],
      [-0.31, 0.79, -0.172],
    ],
    0.0033,
  );
  cable(
    [
      [0.13, 1.2395, 0],
      [0.146, 1.2395, 0],
      [0.168, 1.25, -0.015],
      [0.12, 1.295, -0.09],
      [0.029, 1.335, -0.141],
      [0, 1.367, -0.172],
    ],
    0.003,
  );
  const kraft = await new T.TextureLoader().loadAsync(urls.kraft);
  kraft.colorSpace = T.SRGBColorSpace;
  kraft.anisotropy = 4;
  return {
    kraft,
    rolls,
    inventory: () => Object.keys(parts),
    readerPosition: () => rig.getWorldPosition(new T.Vector3()),
    inspectionRay: () => new T.Ray(
      diffuser.getWorldPosition(new T.Vector3()),
      diffuser.getWorldDirection(new T.Vector3()),
    ),
  };
}
