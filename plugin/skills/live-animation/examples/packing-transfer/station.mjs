import * as T from 'three';
import { createTransferCell } from './cell.mjs';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { duration } from './motion.mjs';

const canvas = document.querySelector('canvas'),
  play = document.querySelector('button'),
  scrub = document.querySelector('input'),
  out = document.querySelector('output');
const scene = new T.Scene(),
  camera = new T.PerspectiveCamera(31, 1, 0.02, 15);
const renderer = new T.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
scene.background = new T.Color(0xe7ebed);
const studio = new RoomEnvironment(),
  gen = new T.PMREMGenerator(renderer);
scene.environment = gen.fromScene(studio, 0.035).texture;
scene.environmentIntensity = 0.72;
studio.dispose();
gen.dispose();
const key = new T.DirectionalLight('#fff9f1', 2.6);
key.position.set(-1.4, 3.4, 2.5);
key.target.position.set(0, 0.85, 0);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -1.2, right: 1.2, top: 1.2, bottom: -1.2, near: 0.2, far: 6 });
key.shadow.normalBias = 0.0005;
scene.add(key, key.target, new T.HemisphereLight(0xf6f7fa, 0x697180, 1.05));
const floor = new T.Mesh(new T.PlaneGeometry(100, 100),new T.MeshStandardMaterial({color:0xd3d9dc,roughness:.9}));
floor.position.y=-.003; scene.add(floor);
floor.rotation.x = -Math.PI / 2;
const {sample,measure}=await createTransferCell(scene,{scopeAccent:0x3664b3});
let time = 0,
  playing = false,
  previous = 0;
function draw() {
  const box = canvas.getBoundingClientRect();
  camera.aspect = box.width / box.height;
  const distance = Math.max(1.24, 1.3 / camera.aspect);
  camera.position.set(0.68 * distance, 1.5 + 0.12 * (distance - 1), 1.48 * distance);
  camera.lookAt(-0.1, 1.24, -0.04);
  camera.updateProjectionMatrix();
  renderer.setSize(box.width, box.height, false);
  const s = sample(time);
  renderer.render(scene, camera);
  out.value = s.phase;
  scrub.value = time;
}
play.disabled = scrub.disabled = false;
function schedule(now) {
  if (!playing) return;
  time = Math.min(duration, time + (now - previous) / 1000);
  previous = now;
  draw();
  if (time < duration) requestAnimationFrame(schedule);
  else {
    playing = false;
    play.textContent = 'Replay';
  }
}
play.onclick = () => {
  playing = !playing;
  if (playing && time >= duration) time = 0;
  play.textContent = playing ? 'Pause' : 'Play';
  previous = performance.now();
  if (playing) requestAnimationFrame(schedule);
};
scrub.oninput = () => {
  time = Number(scrub.value);
  draw();
};
new ResizeObserver(draw).observe(canvas);
draw();
// Samples the same loaded skin and machine meshes the camera renders.
window.packingTransfer = {
  seek(t) {
    time = t;
    draw();
  },
  measure,
};
