import * as THREE from 'three';

// Epoxy and bay joints from the RSM/pharma hall. Keep the floor beyond the fog range.
function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D) => void, srgb: boolean): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d', { willReadFrequently: true })!); // a CPU canvas: accelerated ones can lose their first draw (11-26)
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  return t;
}

/** Floor plane side (m): past the fog's far end from anywhere the camera may stand (LIMITS, cameraKeys.ts). */
const FLOOR = 100;

/** Epoxy: a faintly clouded light grey, two 2 m bays per 1024 px tile, joints a darker hairline (the pharma floor).
 *  ponytail: a tile, not one canvas for the whole hall: the old 2560 × 1920 floor canvas reached the GPU empty and the
 *  floor drew black (11-26). */
function floorMaterial(): THREE.MeshStandardMaterial {
  const S = 1024, bay = S / 2;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const blobs = Array.from({ length: 260 }, () => [rnd() * S, rnd() * S, 20 + rnd() * 90, (rnd() - 0.5) * 0.05] as const);
  const map = canvasTexture(S, (ctx) => {
    ctx.fillStyle = '#d9dee3';
    ctx.fillRect(0, 0, S, S);
    for (const [x, y, r, k] of blobs) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const v = Math.round(217 + k * 255);
      g.addColorStop(0, `rgba(${v},${v + 4},${v + 9},0.5)`);
      g.addColorStop(1, `rgba(${v},${v + 4},${v + 9},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    ctx.fillStyle = '#b9c0c8';
    for (const p of [0, bay]) {
      ctx.fillRect(p, 0, 2, S);
      ctx.fillRect(0, p, S, 2);
    }
  }, true);
  const roughnessMap = canvasTexture(S, (ctx) => {
    ctx.fillStyle = 'rgb(105,105,105)';
    ctx.fillRect(0, 0, S, S);
    for (const [x, y, r, k] of blobs) {
      const v = k > 0 ? 140 : 80;
      ctx.fillStyle = `rgba(${v},${v},${v},0.25)`;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgb(235,235,235)';
    for (const p of [0, bay]) {
      ctx.fillRect(p, 0, 2, S);
      ctx.fillRect(0, p, S, 2);
    }
  }, false);
  for (const t of [map, roughnessMap]) t.repeat.set(FLOOR / 4, FLOOR / 4); // 4 m per tile
  return new THREE.MeshStandardMaterial({ map, roughnessMap, roughness: 1, metalness: 0, envMapIntensity: 0.6 });
}

export const HALL_AIR = '#f1f5f9';
export function addHallFloor(scene:THREE.Scene) {
  const air=new THREE.Color(HALL_AIR);
  scene.background=air;
  scene.fog=new THREE.Fog(air,8,24);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(FLOOR,FLOOR).rotateX(-Math.PI/2),floorMaterial());
  floor.receiveShadow=true;scene.add(floor);
  return floor;
}
