import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { fitOperator } from './rig.mjs';
import { size, deck, stateAt } from './motion.mjs';
import operatorURL from './operator.glb?url';

export async function createTransferCell(scene,{scopeAccent}={}) {
const mat = (color, metalness = 0, roughness = 0.5) =>
  new T.MeshStandardMaterial({ color, metalness, roughness });
const steel = mat(0xc7cacc, 0.83, 0.32),
  chrome = mat(0xe6ecee, 0.91, 0.21),
  accent = scopeAccent ? mat(scopeAccent, 0.28, 0.38) : steel,
  dark = mat(0x27313d, 0.4, 0.48),
  rubber = mat(0x25282b, 0, 0.86),
  deckMat = mat(0xacb5ba, 0.64, 0.48),
  cartonMat = mat(0xc4a982, 0, 0.88);
function mesh(parent, geo, m, x, y, z) {
  const o = new T.Mesh(geo, m);
  o.position.set(x, y, z);
  o.castShadow = o.receiveShadow = true;
  parent.add(o);
  return o;
}
function box(parent, m, x, y, z, w, h, d, r = 0.002) {
  return mesh(
    parent,
    r
      ? new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3))
      : new T.BoxGeometry(w, h, d),
    m,
    x,
    y,
    z,
  );
}
function pin(parent, m, x, y, z, r, l, axis = 'y', sides = 20) {
  const geo = new T.CylinderGeometry(r, r, l, sides);
  if (axis === 'x') geo.rotateZ(Math.PI / 2);
  if (axis === 'z') geo.rotateX(Math.PI / 2);
  return mesh(parent, geo, m, x, y, z);
}
const bench = box(scene, deckMat, -0.12, deck - 0.012, 0, 1.09, 0.024, 0.32);
for (const x of [-0.615, 0.372])
  for (const z of [-0.122, 0.122]) {
    box(scene, steel, x, 0.512, z, 0.045, 0.932, 0.045);
    pin(scene, dark, x, 0.034, z, 0.013, 0.04);
    pin(scene, rubber, x, 0.01, z, 0.037, 0.02);
  }
for (const z of [-0.122, 0.122]) {
  box(scene, steel, -0.121, 0.947, z, 1.03, 0.063, 0.044);
  box(scene, accent, -0.121, 0.955, z + Math.sign(z) * 0.023, 1.02, 0.009, 0.003);
}
for (const x of [-0.615, 0.372]) box(scene, steel, x, 0.34, 0, 0.035, 0.036, 0.236);
box(scene, steel, -0.122, 0.34, -0.122, 1.0, 0.036, 0.035);
const holderY = deck + 0.055;
box(scene, steel, -0.512, deck + 0.008, 0, 0.258, 0.016, 0.151);
box(scene, accent, -0.511, holderY, 0, 0.213, 0.08, 0.101, 0.006);
for (const x of [-0.623, -0.399]) {
  box(scene, steel, x, holderY, 0, 0.015, 0.082, 0.106, 0.004);
  for (const z of [-0.039, 0.039])
    for (const dy of [-0.027, 0.027]) pin(scene, dark, x + 0.009, holderY + dy, z, 0.004, 0.003, 'x', 6);
}
for (const z of [-0.062, 0.062])
  for (const x of [-0.601, -0.409]) pin(scene, dark, x, deck + 0.018, z, 0.005, 0.004, 'y', 6);
for (const z of [-0.028, 0.028]) pin(scene, dark, -0.386, holderY, z, 0.013, 0.013, 'x');
const blade = box(scene, steel, 0, holderY, 0, 0.013, 0.077, 0.094);
const contact = box(scene, rubber, 0, holderY, 0, 0.004, 0.063, 0.087);
const rods = [-0.028, 0.028].map((z) => pin(scene, chrome, 0, holderY, z, 0.008, 1, 'x'));
for (const z of [-0.087, 0.087]) {
  box(scene, steel, -0.123, deck + 0.009, z, 0.405, 0.018, 0.008);
  for (const x of [-0.306, 0.055]) pin(scene, dark, x, deck + 0.02, z, 0.0025, 0.003, 'y', 6);
}
for (const z of [-0.104, 0.104]) box(scene, steel, 0.3, deck + 0.009, z, 0.164, 0.018, 0.009);
box(scene, steel, 0.391, deck + 0.009, 0, 0.008, 0.018, 0.215);
const article = new T.Group();
scene.add(article);
const carton = box(article, cartonMat, 0, 0, 0, ...size, 0.0014);
const paper = mat(0xb19773, 0, 0.88);
box(article, paper, 0, size[1] / 2 + 0.00022, 0, size[0] - 0.002, 0.00044, 0.001, 0);
const rig = await new GLTFLoader().loadAsync(operatorURL);
scene.add(rig.scene);
rig.scene.traverse((o) => {
  if (o.isMesh) {
    o.castShadow = o.receiveShadow = true;
    if (o.material.name.includes('opacity')) {
      o.material.alphaTest = 0.45;
      o.material.transparent = false;
      o.material.side = T.DoubleSide;
    }
  }
});
const operator = fitOperator(rig.scene);
function sample(t) {
  const s = stateAt(t);
  article.position.set(s.x, s.y, 0);
  blade.position.x = s.blade - 0.004 - 0.0065;
  contact.position.x = s.blade - 0.002;
  const tail = -0.38,
    tip = blade.position.x - 0.0065;
  rods.forEach((r) => {
    r.position.x = (tail + tip) / 2;
    r.scale.x = tip - tail;
  });
  operator.pose(s);
  scene.updateMatrixWorld(true);
  return s;
}
return { sample,
  measure(t) {
    const s = sample(t),
      bounds = new T.Box3().setFromObject(carton),
      face = new T.Box3().setFromObject(contact);
    return {
      t,
      support: new T.Box3().setFromObject(bench).max.y,
      handBottom: operator.lowest(),
      min: bounds.min.toArray(),
      max: bounds.max.toArray(),
      blade: face.max.x,
      pads: operator.pads(),
      patches: operator.patches(),
      carried: s.rise > 0.0001,
      phase: s.phase,
    };
  },
};
}
