import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Nameplate } from './marked-panel';
const radial = {medium:32,large:64} as const;
function roundBox(w: number, h: number, d: number, radius: number, steps = 2): THREE.BufferGeometry {
  return new RoundedBoxGeometry(w, h, d, steps, radius);
}



export interface Console {
  group: THREE.Group;
  /** The screen's corners in world space: top left, top right, bottom right, bottom left. */
  screen: THREE.Vector3[];
  /** Where the cables leave the glands under the cabinet (world): the conduit's, and 60 mm behind it the valve cable's. */
  glands: [THREE.Vector3, THREE.Vector3];
  /** The signal tower's green light: the batch is running. */
  setRunning(on: boolean): void;
}

// ---------------------------------------------------------------------------
// Surfaces

/** Brushed grain: fine streaks along u, as a roughness map (green channel); one shared image, repeated per use. */
let grain: HTMLCanvasElement | null = null;
export function grainTexture(repeatU: number, repeatV: number): THREE.CanvasTexture {
  if (!grain) {
    const S = 512;
    grain = document.createElement('canvas');
    grain.width = grain.height = S;
    const g = grain.getContext('2d')!;
    g.fillStyle = 'rgb(112,112,112)';
    g.fillRect(0, 0, S, S);
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 3200; i++) {
      const x = rnd() * S, y = rnd() * S, len = 30 + rnd() * 300, v = Math.round(98 + rnd() * 30);
      g.fillStyle = `rgba(${v},${v},${v},${(0.12 + rnd() * 0.22).toFixed(2)})`; // subtle, as on the real sheet
      const h = 0.5 + rnd() * 0.9;
      g.fillRect(x, y, len, h);
      if (x + len > S) g.fillRect(x - S, y, len, h);
    }
  }
  const t = new THREE.CanvasTexture(grain);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatU, repeatV);
  t.anisotropy = 8;
  return t;
}

/** How deep the brushing's strokes read (bump): they catch the light along them up close (0.35 was invisible, 11-19), and
 *  average out at a distance. */
export const GRAIN_BUMP = 3;
/** Brushed stainless sheet (the workshop photo: light, satin, the grain catching the light along its strokes). The
 *  grain drives the roughness and a fine relief, so the strokes show in close-ups, not only a grey sheen. */
export function brushedSteel(size = 0.6): THREE.MeshPhysicalMaterial {
  const grain = grainTexture(size / 0.3, size / 0.3);
  return new THREE.MeshPhysicalMaterial({
    color: 0xcfd2d4, metalness: 1, roughness: 0.82, roughnessMap: grain, bumpMap: grain, bumpScale: GRAIN_BUMP,
    anisotropy: 0.55, anisotropyRotation: 0,
  });
}

/**
 * Box-projected UVs in metres (world space) for meshes that have none (the machine's CAD), so its stainless can take
 * the brushed grain and anisotropy: u runs horizontally on every face (along z on faces turned to x, along x on the
 * others), v up the vertical faces and across the top ones.
 */
export function boxUv(mesh: THREE.Mesh): void {
  const g = mesh.geometry as THREE.BufferGeometry, pos = g.getAttribute('position'), nor = g.getAttribute('normal');
  if (!nor || g.getAttribute('uv')) return;
  mesh.updateWorldMatrix(true, false);
  const m = mesh.matrixWorld, nm = new THREE.Matrix3().getNormalMatrix(m);
  const p = new THREE.Vector3(), n = new THREE.Vector3(), uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i).applyMatrix4(m);
    n.fromBufferAttribute(nor, i).applyMatrix3(nm);
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    const [u, v] = ay > ax && ay > az ? [p.x, p.z] : ax > az ? [p.z, p.y] : [p.x, p.y];
    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

/** Natural anodised aluminium profile: satin, finer and greyer than the stainless. */
export const anodised = () => new THREE.MeshPhysicalMaterial({ color: 0xc4c8cc, metalness: 1, roughness: 0.5, anisotropy: 0.3, anisotropyRotation: Math.PI / 2 });
const plastic = (color: number, roughness = 0.55) => new THREE.MeshPhysicalMaterial({ color, roughness, metalness: 0 });

// ---------------------------------------------------------------------------
// Parts

/** A 40 x 40 mm slotted aluminium profile's section: an 8 mm slot in the middle of each face, 1.5 mm corner radius. */
export function profileShape(s = 0.04): THREE.Shape {
  const h = s / 2, w = 0.0041, d = 0.0065, r = 0.0015;
  const sh = new THREE.Shape();
  sh.moveTo(-h + r, -h);
  sh.lineTo(-w, -h); sh.lineTo(-w, -h + d); sh.lineTo(w, -h + d); sh.lineTo(w, -h);
  sh.lineTo(h - r, -h); sh.quadraticCurveTo(h, -h, h, -h + r);
  sh.lineTo(h, -w); sh.lineTo(h - d, -w); sh.lineTo(h - d, w); sh.lineTo(h, w);
  sh.lineTo(h, h - r); sh.quadraticCurveTo(h, h, h - r, h);
  sh.lineTo(w, h); sh.lineTo(w, h - d); sh.lineTo(-w, h - d); sh.lineTo(-w, h);
  sh.lineTo(-h + r, h); sh.quadraticCurveTo(-h, h, -h, h - r);
  sh.lineTo(-h, w); sh.lineTo(-h + d, w); sh.lineTo(-h + d, -w); sh.lineTo(-h, -w);
  sh.lineTo(-h, -h + r); sh.quadraticCurveTo(-h, -h, -h + r, -h);
  return sh;
}
/** A profile `len` long from `a` along an axis ('x', 'y' or 'z'). */
export function profile(len: number, axis: 'x' | 'y' | 'z'): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(profileShape(), { depth: len, bevelEnabled: false, curveSegments: 2 });
  if (axis === 'y') g.rotateX(-Math.PI / 2);
  if (axis === 'x') g.rotateY(Math.PI / 2);
  return g;
}
/** A hexagon nut or gland body, `d` across the corners, `h` high, along y. */
const hexNut = (d: number, h: number) => new THREE.CylinderGeometry(d / 2, d / 2, h, 6);

// ---------------------------------------------------------------------------

/** The cabinet 1.0 to 1.6 m up, door to +z; its 15.6" screen (344 x 215 mm, 16:10) centred 1.36 m up. */
export function createConsole(at: THREE.Vector3, yaw: number, { tower = true, marking }: {tower?:boolean;marking?:Nameplate} = {}): Console {
  const group = new THREE.Group();
  group.position.copy(at);
  group.rotation.y = yaw;
  const steel = brushedSteel(0.6), alu = anodised();
  const black = plastic(0x15171a, 0.5), rubber = plastic(0x101112, 0.85), grey = plastic(0xc6c9cc, 0.6);
  const zinc = new THREE.MeshPhysicalMaterial({ color: 0xb8bcc0, metalness: 1, roughness: 0.35 });
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe6e8ea, metalness: 1, roughness: 0.12 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0a0b0d, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03 });
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    group.add(m);
    return m;
  };

  // The stand: two uprights behind the cabinet, two foot rails front to back and a rear rail, a cross bar under the
  // cabinet; black end caps; a levelling foot under each rail end (rubber pad, zinc swivel base, stud and nut)
  const PZ = -0.145, FOOT_Y = 0.034, RAIL = [-0.42, 0.16] as const;
  for (const x of [-0.2, 0.2]) {
    add(profile(1.62 - (FOOT_Y + 0.04), 'y'), alu, x, FOOT_Y + 0.04, PZ);
    add(new THREE.BoxGeometry(0.04, 0.004, 0.04), black, x, 1.622, PZ);
    add(profile(RAIL[1] - RAIL[0], 'z'), alu, x, FOOT_Y + 0.02, RAIL[0]);
    for (const z of RAIL) add(new THREE.BoxGeometry(0.04, 0.04, 0.004), black, x, FOOT_Y + 0.02, z + (z < 0 ? -0.002 : 0.002));
    for (const z of [RAIL[0] + 0.03, RAIL[1] - 0.03]) {
      add(new THREE.CylinderGeometry(0.02, 0.02, 0.006, 24), rubber, x, 0.003, z);
      add(new THREE.CylinderGeometry(0.018, 0.02, 0.01, 24), zinc, x, 0.011, z);
      add(new THREE.CylinderGeometry(0.006, 0.006, 0.02, 12), zinc, x, 0.024, z);
      add(hexNut(0.02, 0.008), zinc, x, 0.03, z);
    }
  }
  add(profile(0.36, 'x'), alu, -0.18, FOOT_Y + 0.02, -0.3); // the rear rail, between the foot rails
  add(profile(0.36, 'x'), alu, -0.18, 0.5, PZ);

  // The enclosure and its door: the door 3 mm smaller all round and 2 mm proud, so its seam shows
  add(roundBox(0.6, 0.6, 0.236, 0.004, 3), steel, 0, 1.3, -0.007);
  if(marking){
    const door=marking.panel({width:.594,height:.594,depth:.016,markX:.146,markY:-.205,
      markWidth:.074,metal:steel,insert:new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false})});
    door.position.set(0,1.3,.125);
    group.add(door);
  } else {
  add(roundBox(0.594, 0.594, 0.016, 0.003, 2), steel, 0, 1.3, 0.117);
  }
  add(new THREE.BoxGeometry(0.598, 0.598, 0.002), black, 0, 1.3, 0.1115); // the gasket, dark in the seam
  for (const y of [1.08, 1.52]) {
    add(new THREE.CylinderGeometry(0.011, 0.011, 0.006, 24).rotateX(Math.PI / 2), black, 0.268, y, 0.128);
    add(new THREE.BoxGeometry(0.003, 0.012, 0.002), plastic(0x2a2d31, 0.4), 0.268, y, 0.1315);
  }

  // The Panel PC's screen in the door
  add(roundBox(0.38, 0.25, 0.008, 0.003, 2), black, -0.02, 1.36, 0.128);
  add(new THREE.PlaneGeometry(0.344, 0.215), glass, -0.02, 1.36, 0.1325);

  // The main switch: a black rotary handle on its collar and escutcheon
  add(roundBox(0.066, 0.066, 0.004, 0.002, 2), black, -0.25, 1.3, 0.127);
  add(new THREE.CylinderGeometry(0.026, 0.027, 0.01, radial.large).rotateX(Math.PI / 2), black, -0.25, 1.3, 0.134);
  add(new THREE.CylinderGeometry(0.02, 0.022, 0.016, radial.large).rotateX(Math.PI / 2), plastic(0x0e0f11, 0.42), -0.25, 1.3, 0.147);
  add(roundBox(0.046, 0.011, 0.016, 0.004, 2), plastic(0x0e0f11, 0.42), -0.25, 1.3, 0.158);

  // The illuminated push-button: a chrome bezel and a white lens, lit
  add(new THREE.CylinderGeometry(0.0155, 0.0155, 0.004, radial.large).rotateX(Math.PI / 2), black, -0.02, 1.155, 0.127);
  add(new THREE.TorusGeometry(0.0125, 0.0025, 16, radial.large), chrome, -0.02, 1.155, 0.131);
  const lens = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, emissive: 0xfff8ee, emissiveIntensity: 1.6 });
  add(new THREE.SphereGeometry(0.0188, 40, 12, 0, Math.PI * 2, 0, 0.573).rotateX(Math.PI / 2), lens, -0.02, 1.155, 0.1152); // a 3 mm dome filling the bezel

  // The filter fan's grille on the left side: a light grey frame with seven louvres
  const fan = new THREE.Group();
  fan.position.set(-0.3, 1.47, -0.01);
  fan.rotation.y = -Math.PI / 2;
  const frame = new THREE.Shape();
  frame.moveTo(-0.0625, -0.0625); frame.lineTo(0.0625, -0.0625); frame.lineTo(0.0625, 0.0625); frame.lineTo(-0.0625, 0.0625); frame.lineTo(-0.0625, -0.0625);
  const hole = new THREE.Path();
  hole.moveTo(-0.05, -0.05); hole.lineTo(-0.05, 0.05); hole.lineTo(0.05, 0.05); hole.lineTo(0.05, -0.05); hole.lineTo(-0.05, -0.05);
  frame.holes.push(hole);
  const fanFrame = new THREE.Mesh(new THREE.ExtrudeGeometry(frame, { depth: 0.012, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2 }), grey);
  fanFrame.castShadow = fanFrame.receiveShadow = true;
  fan.add(fanFrame);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), plastic(0x2b2e33, 0.9));
  back.position.z = 0.001;
  fan.add(back);
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.0125, 0.0015), grey);
    s.position.set(0, -0.0429 + i * 0.0143, 0.007);
    s.rotation.x = -0.75;
    s.castShadow = s.receiveShadow = true;
    fan.add(s);
  }
  group.add(fan);

  // Glands under the cabinet: the conduit's fitting (grey) and the sensor cable's gland (black)
  add(hexNut(0.042, 0.012), plastic(0x8d9093, 0.5), 0.14, 0.994, 0.02);
  add(new THREE.CylinderGeometry(0.017, 0.018, 0.02, 32), plastic(0x8d9093, 0.5), 0.14, 0.978, 0.02);
  add(hexNut(0.024, 0.01), black, 0.14, 0.995, -0.04);
  add(new THREE.CylinderGeometry(0.0075, 0.01, 0.014, 24), black, 0.14, 0.983, -0.04);

  // The signal tower on the right profile: mounting foot, pole, base, green, amber and red lenses on grey rings, cap
  let runLamp: THREE.MeshPhysicalMaterial | undefined;
  if (tower) {
    const TX = 0.2, TZ = PZ;
    add(new THREE.CylinderGeometry(0.028, 0.03, 0.012, 32), black, TX, 1.63, TZ);
    add(new THREE.CylinderGeometry(0.01, 0.01, 0.3, radial.medium), alu, TX, 1.786, TZ);
    add(new THREE.CylinderGeometry(0.02, 0.021, 0.034, 32), black, TX, 1.953, TZ);
    const lamps = [0x2fae55, 0xe8a23a, 0xd8453b].map((c, i) => {
      const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.7), roughness: 0.3, emissive: c, emissiveIntensity: 0.06 }); // tinted translucent lens, dark when off
      const y = 1.972 + i * 0.044;
      add(new THREE.CylinderGeometry(0.0205, 0.0205, 0.003, 32), grey, TX, y + 0.0015, TZ);
      add(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 40), mat, TX, y + 0.023, TZ).name=['green run lens','amber lens','red lens'][i];
      return mat;
    });
    add(new THREE.CylinderGeometry(0.0205, 0.0205, 0.003, 32), grey, TX, 2.1055, TZ);
    add(new THREE.SphereGeometry(0.0205, 32, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.45, 1), black, TX, 2.107, TZ);
    runLamp = lamps[0];
  }

  group.updateMatrixWorld(true);
  const w = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).applyMatrix4(group.matrixWorld);
  return {
    group,
    screen: [w(-0.192, 1.4675, 0.1335), w(0.152, 1.4675, 0.1335), w(0.152, 1.2525, 0.1335), w(-0.192, 1.2525, 0.1335)],
    glands: [w(0.14, 0.968, 0.02), w(0.14, 0.976, -0.04)],
    setRunning: (on) => { if (runLamp) runLamp.emissiveIntensity = on ? 3.2 : 0.06; },
  };
}
