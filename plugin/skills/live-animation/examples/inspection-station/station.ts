import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getMaterials } from './materials';
import { productAt } from './transport.mjs';

// A seekable development fixture. A customer film supplies the PlayerBar, camera cuts and evidence layer.
const canvas = document.querySelector('canvas')!;
const slider = document.querySelector('input')!;
const output = document.querySelector('output')!;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const room = new RoomEnvironment();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(room).texture;
room.dispose();
pmrem.dispose();
const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 8);
camera.position.set(1.05, 0.55, 1.1);
camera.lookAt(0.47, 0, 0);
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(1, 2, 1);
scene.add(light);
const { steel, anodised, beltWhite } = getMaterials();
function block(x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material) {
  const part = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  part.position.set(x, y, z);
  scene.add(part);
  return part;
}
block(0.2875, -0.016, 0, 0.575, 0.032, 0.12, beltWhite);
block(0.7975, -0.016, 0, 0.305, 0.032, 0.12, beltWhite);
const tongue = block(0.61, -0.004, 0, 0.07, 0.008, 0.12, steel);
block(0.64, -0.17, 0, 0.15, 0.02, 0.14, steel);
block(0.3, 0.06, -0.08, 0.015, 0.20, 0.015, anodised);
block(0.3, 0.16, -0.04, 0.015, 0.015, 0.095, anodised);
block(0.3, 0.14, 0, 0.03, 0.03, 0.03, anodised);
const body = new THREE.CylinderGeometry(0.014, 0.014, 0.044, 20);
const lid = new THREE.CylinderGeometry(0.014, 0.014, 0.006, 20);
const capMaterial = new THREE.MeshStandardMaterial({ color: 0x17356e, roughness: 0.65 });
const items = Array.from({ length: 13 }, (_, id) => {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(body, anodised));
  const cap = new THREE.Mesh(lid, capMaterial);
  cap.position.y = 0.025;
  group.add(cap);
  scene.add(group);
  return { id, group, cap };
});
function draw() {
  const t = Number(slider.value);
  let retract = 0;
  for (const { id, group, cap } of items) {
    const item = productAt(id, t);
    group.visible = item.visible;
    group.position.set(item.x, item.y + 0.022, 0);
    cap.visible = !item.defect;
    if (item.verdict === 'NOK') {
      const approach = (item.x - 0.577) / 0.018;
      const cleared = (0.674 - item.x) / 0.018;
      retract = Math.max(retract, Math.min(1, approach, cleared));
    }
  }
  tongue.position.z = -0.10 * retract;
  const inspected = items.map(({ id }) => productAt(id, t)).filter(p => p.verdict).at(-1);
  output.value = inspected ? `Product ${inspected.id + 1}: ${inspected.verdict}${inspected.defect ? ' (missing cap)' : ''}` : 'Waiting for the first inspection';
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
slider.addEventListener('input', draw);
new ResizeObserver(draw).observe(canvas);
draw();
