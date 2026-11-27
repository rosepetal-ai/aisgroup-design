import * as THREE from 'three';

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true }); // a CPU canvas: accelerated ones can lose their first draw (11-26)
  if (!ctx) throw new Error('2D canvas unavailable');
  return [c, ctx];
}

// Small deterministic PRNG so the textures are identical on every load.
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toTexture(c: HTMLCanvasElement, srgb: boolean, repeat = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

const cache = new Map<string, THREE.CanvasTexture>();
function cached(key: string, make: () => THREE.CanvasTexture): THREE.CanvasTexture {
  let t = cache.get(key);
  if (!t) {
    t = make();
    cache.set(key, t);
  }
  return t;
}

/** Brushed grain (the pharma line's, props.ts grainTexture): long horizontal strokes, subtle as on the real sheet; grey
 *  values used as roughness and bump. Spans 0.3 m (repeat 5/3 over the rig's 0.5 m metre UVs). */
export function brushedTexture(): THREE.CanvasTexture {
  return cached('steel-brushed', () => {
    const [c, ctx] = canvas(512, 512);
    const r = rng(11);
    ctx.fillStyle = 'rgb(112,112,112)';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3200; i++) {
      const x = r() * 512, y = r() * 512, len = 30 + r() * 300, v = Math.round(98 + r() * 30);
      ctx.fillStyle = `rgba(${v},${v},${v},${(0.12 + r() * 0.22).toFixed(2)})`;
      for (const ox of [0, -512]) ctx.fillRect(x + ox, y, len, 1);
    }
    const t = toTexture(c, false);
    t.repeat.set(5 / 3, 5 / 3);
    return t;
  });
}

function beltTexture(): THREE.CanvasTexture {
  return cached('belt-white', () => {
    const [c, ctx] = canvas(256, 256);
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, 0, 256, 256);
    const r = rng(11);
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(148,163,184,${0.03 + r() * 0.05})`;
      ctx.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 2);
    }
    // Fine weave lines across the belt
    ctx.strokeStyle = 'rgba(148,163,184,0.12)';
    for (let y = 0; y < 256; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(256, y + 0.5);
      ctx.stroke();
    }
    return toTexture(c, true);
  });
}


function createMaterials() {
  const grain = brushedTexture();
  // AISI 304 brushed, as the pharma line's brushedSteel (props.ts): satin, the grain driving the roughness and a fine
  // relief (bump 3: 0.35 was invisible in close-ups, 11-19), anisotropic along the strokes. The hall HDRI is its envMap
  // (environment.ts).
  const steel = new THREE.MeshPhysicalMaterial({
    color: 0xcfd2d4, metalness: 1, roughness: 0.82, roughnessMap: grain, bumpMap: grain, bumpScale: 3,
    anisotropy: 0.55, anisotropyRotation: 0, envMapIntensity: 1,
  });
  steel.name = 'steel';
  /** Silver anodised aluminium (profiles, guard frames, brackets, the actuators' rods), the pharma line's anodised()
   *  without its anisotropy: on the rods and brackets the rig's box-projected UVs don't run along the part, and they drew
   *  black and white streaks (11-26, as CAD parts without UVs do). */
  const anodised = new THREE.MeshStandardMaterial({ color: 0xc4c8cc, metalness: 1, roughness: 0.5 });
  anodised.name = 'aluminium';
  /** Materials shared by every scene piece. Do not mutate colours at runtime; clone instead. */
  return {
    steel,
    anodised,
    beltWhite: new THREE.MeshStandardMaterial({ color: '#F1F5F9', map: beltTexture(), roughness: 0.6, metalness: 0 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#FACC15', roughness: 0.6, metalness: 0 }),
  };
}

type Materials = ReturnType<typeof createMaterials>;
let instance: Materials | null = null;

/** Lazy, memoised shared materials (no canvas is touched until first use, so importing is safe without a DOM). */
export function getMaterials(): Materials {
  return (instance ??= createMaterials());
}

/** `materials.steel` etc.: same objects as getMaterials(), resolved on first property access. */
export const materials: Materials = new Proxy({} as Materials, {
  get: (_t, key) => getMaterials()[key as keyof Materials],
  ownKeys: () => Reflect.ownKeys(getMaterials()),
  getOwnPropertyDescriptor: (_t, key) => ({ enumerable: true, configurable: true, value: getMaterials()[key as keyof Materials] }),
});

/** Frees GPU copies of the shared materials and textures; the next getMaterials() call rebuilds them. */
export function disposeMaterials(): void {
  if (instance) for (const m of Object.values(instance)) m.dispose();
  instance = null;
  for (const t of cache.values()) t.dispose();
  cache.clear();
}
