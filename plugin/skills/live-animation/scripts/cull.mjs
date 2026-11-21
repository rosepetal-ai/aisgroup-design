// cull.mjs: drops the machine model's triangles that no camera in the pharma line ever shows (public/models/rev360-compact.glb
// → rev360-compact-culled.glb next to it), pixel-identical in the piece. Set MODELS_DIR to the site's public/models (and GLTF_PKG), dev server on :4391;
// every Chromium run through safe.sh, one at a time (MAX=2000M NEED_MB=2500 ./safe.sh node cull.mjs …). Three steps:
// 1. `bake [1600x1000,390x844] [from] [to]`: at story times every 0.05 s over 17–31 and every 0.5 s elsewhere, the piece's own
//    camera (DEV __plSeek) films the machine's triangles as IDs at 1.5× the stage resolution, in the three passes a triangle can
//    reach a pixel through: the beauty pass (each material's side and section plane; opaque objects occlude, glass and other
//    see-through objects do not), the ambient-occlusion pass's depth (GTAOPass: front faces, every mesh occludes) and the sun's
//    shadow map (three's shadow sides, nothing else casting, swept over the paddle's swing). Partial sets go to
//    ~/.cache/ais-group-design/cull/ids-<viewport>-<from>-<to>.bin (split the time span if a run would pass ~15 minutes).
// 2. `write` (Node only): the union of every ids-*.bin, plus one ring (every triangle sharing a vertex position with a seen one,
//    within its mesh), shell, hood and paddles whole (ALL=1 culls them too), at least one triangle per primitive (the scene graph
//    stays the same), original quantization and meshopt compression with the normals' octahedral codes carried over, so every
//    kept vertex decodes bit-identical (checked on read-back). Prints triangles and bytes (raw, gzip -9, brotli q11) before/after.
// 3. `verify [viewports] [from] [to]`: the canvas at times that were never baked (17.025 to 31 every 0.05 s, 0 to the end every
//    0.37 s), the original against the culled model (served for the original's URL with page.route), ImageMagick
//    `compare -metric AE -fuzz 1%` per frame; DPR=1.5 for the high-density pixel ratio; CONTROL=1 loads the original twice (the
//    setup's own noise floor). Math.random is seeded in both loads (GTAOPass's denoise noise). Frames that differ are kept with
//    their diff in ~/.cache/ais-group-design/cull/verify/. `film <url> <dir> <spec>` runs film.mjs with the culled model served;
//    `peek <viewport> <t,…>` saves each frame beside what the beauty (A) and ambient-occlusion (B) passes see, IDs in false colour.
import { CHROME_ARGS as ARGS, chromium } from './lib.mjs';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';

const HOME = os.homedir();
const DIR = process.env.OUT ?? `${HOME}/.cache/ais-group-design/cull`;
const MODELS = process.env.MODELS_DIR ?? path.resolve("public/models"); // run from the site's astro/ folder, or set MODELS_DIR
const SRC = process.env.SRC_GLB ?? `${MODELS}/${process.env.MODEL_FILE ?? 'rev360-compact.glb'}`;
const DST = process.env.DST_GLB ?? `${MODELS}/${process.env.CULLED_FILE ?? 'rev360-compact-culled.glb'}`;
const PAGE = process.env.URL ?? 'http://127.0.0.1:4391/animations/pharma-line/';
const DURATION = Number(process.env.DURATION ?? 89.85); // story.ts
const WHOLE = new RegExp(process.env.WHOLE_RE ?? '^(shell|hood|paddle-\\d)$'); // kept whole unless ALL=1
const r3 = (x) => Math.round(x * 1000) / 1000;
const sizes = (s = '1600x1000,390x844') => s.split(',').map((v) => v.split('x').map(Number));
const T0 = Date.now(), log = (m) => console.log(`${((Date.now() - T0) / 1000).toFixed(1)}s ${m}`);

function bakeTimes(from, to) {
  if (process.env.STEP) {
    const st = Number(process.env.STEP), r = [];
    for (let t = from; t <= to + 1e-9; t += st) r.push(r3(t));
    return r;
  }
  const s = new Set();
  for (let t = 0; t < 17; t += 0.5) s.add(r3(t));
  for (let i = 0; r3(17 + i * 0.05) <= 31; i++) s.add(r3(17 + i * 0.05));
  for (let t = 31.5; t < DURATION; t += 0.5) s.add(r3(t));
  return [...s].filter((t) => t >= from && t < to).sort((a, b) => a - b);
}
function verifyTimes() {
  const bake = new Set(bakeTimes(0, 90)), s = new Set();
  for (let i = 0; r3(17.025 + i * 0.05) < 31; i++) s.add(r3(17.025 + i * 0.05));
  for (let i = 0; i * 0.37 < DURATION; i++) { const t = r3(i * 0.37); s.add(bake.has(t) ? r3(t + 0.011) : t); }
  return [...s].sort((a, b) => a - b);
}

async function openPiece(browser, [w, h], { culled = false, dpr = 1 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await ctx.addInitScript(() => {
    localStorage.setItem('rosepetal_cookie_consent', JSON.stringify({ analytics: false, marketing: false }));
    let s = 0x2545f491; // mulberry32: the same "random" numbers in every load
    Math.random = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  });
  if (culled) await ctx.route('**/models/rev360-compact.glb', (r) => r.fulfill({ path: DST, contentType: 'model/gltf-binary' }));
  const p = await ctx.newPage();
  p.on('pageerror', (e) => !/WebSocket/.test(e.message) && log('pageerror ' + e.message));
  p.on('console', (m) => { if (/warn|error/.test(m.type()) && !/WebSocket|vite|KHR_parallel|PCFSoft/i.test(m.text())) log(m.type() + ' ' + m.text().slice(0, 300)); });
  await p.goto(`${PAGE}?t=3`, { waitUntil: 'load', timeout: 120000 });
  await p.waitForSelector('.pl-stage.is-live', { timeout: 180000 });
  await p.waitForTimeout(1500);
  return { ctx, p };
}

// In the page: ID copies of the machine's meshes and the three passes. IDs are global triangle numbers + 1 over the machine's
// meshes in traversal order (the logo's opal panels, added by machine.ts, are not the model's), written as RGB.
function setupInPage() {
  const { scene, renderer, camera, machine, THREE } = window.__pl;
  const items = [], info = [];
  let total = 0;
  machine.group.traverse((m) => {
    if (!m.isMesh || m.geometry.type === 'PlaneGeometry') return;
    const g = m.geometry, idx = g.index.array, pos = g.attributes.position, tris = g.index.count / 3;
    const il = pos.isInterleavedBufferAttribute, src = il ? pos.data.array : pos.array, stride = il ? pos.data.stride : 3, off = il ? pos.offset : 0;
    const P = new src.constructor(tris * 9), I = new Uint8Array(tris * 9);
    for (let t = 0; t < tris; t++) {
      const id = total + t + 1;
      for (let k = 0; k < 3; k++) {
        const v = idx[t * 3 + k] * stride + off, d = (t * 3 + k) * 3;
        P[d] = src[v]; P[d + 1] = src[v + 1]; P[d + 2] = src[v + 2];
        I[d] = id & 255; I[d + 1] = (id >> 8) & 255; I[d + 2] = (id >> 16) & 255;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(P, 3, pos.normalized)); // the same integers, normalised the same way
    geo.setAttribute('tid', new THREE.BufferAttribute(I, 3, true));
    if (!g.boundingSphere) g.computeBoundingSphere();
    geo.boundingSphere = g.boundingSphere.clone(); // the same frustum culling
    items.push({ m, g0: g, geo, mat: m.material });
    info.push([tris, pos.count, m.material.name]);
    total += tris;
  });
  const byMesh = new Map(items.map((it) => [it.m, it]));
  const vertexShader = `#include <common>
#include <clipping_planes_pars_vertex>
attribute vec3 tid;
flat varying vec3 vTid;
void main() {
  vTid = tid;
  #include <begin_vertex>
  #include <project_vertex>
  #include <clipping_planes_vertex>
}`;
  const fragmentShader = `#include <clipping_planes_pars_fragment>
flat varying vec3 vTid;
void main() {
  #include <clipping_planes_fragment>
  gl_FragColor = vec4(vTid, 1.0);
}`;
  const SHADOW_SIDE = { [THREE.FrontSide]: THREE.BackSide, [THREE.BackSide]: THREE.FrontSide, [THREE.DoubleSide]: THREE.DoubleSide };
  const idMats = new Map();
  const idMat = (kind, m) => {
    // A: as the beauty pass draws it; B: as GTAOPass's override draws it (front faces, no clipping); C: as the shadow map does
    const side = kind === 'A' ? m.side : kind === 'B' ? THREE.FrontSide : m.shadowSide ?? SHADOW_SIDE[m.side];
    const planes = kind === 'A' || (kind === 'C' && m.clipShadows) ? m.clippingPlanes : null;
    const key = `${kind}:${side}:${planes?.length ?? 0}:${m.clipIntersection}:${m.polygonOffset}:${m.polygonOffsetFactor}:${m.polygonOffsetUnits}`;
    if (!idMats.has(key)) {
      const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, side, clipping: !!planes?.length, clippingPlanes: planes?.length ? planes : null, clipIntersection: m.clipIntersection });
      Object.assign(mat, { polygonOffset: m.polygonOffset, polygonOffsetFactor: m.polygonOffsetFactor, polygonOffsetUnits: m.polygonOffsetUnits, allowOverride: false });
      idMats.set(key, mat);
    }
    return idMats.get(key);
  };
  for (const it of items) if (it.mat.transparent || it.mat.transmission > 0) console.warn('cull: a machine material is see-through: ' + it.mat.name);
  const depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false }); // GTAOPass's normal material: front side, depth written
  const opaque = (m) => m.visible && !m.transparent && !(m.transmission > 0) && m.depthWrite;
  const W = renderer.domElement.clientWidth, H = renderer.domElement.clientHeight;
  const target = (w, h) => new THREE.WebGLRenderTarget(w, h, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false, depthBuffer: true, samples: 0 });
  const rtCam = target(Math.round(W * 1.5), Math.round(H * 1.5)), rtSun = target(3072, 3072); // 1.5 × the stage; 1.5 × the 2048 shadow map
  const buf = new Uint8Array(rtSun.width * rtSun.height * 4);
  const seen = new Uint8Array(total + 1); // per triangle: 1 beauty, 2 ambient occlusion, 4 shadow
  const sun = (() => { let s = null; scene.traverse((o) => { if (o.isDirectionalLight && o.castShadow) s = o; }); return s; })();
  let bad = 0;
  function pass(kind, cam, rt) {
    const restore = [], vis = [], mats = new Set();
    const hide = (o) => { o.visible = false; restore.push(() => { o.visible = true; }); };
    scene.traverseVisible((o) => vis.push(o));
    for (const o of vis) {
      const it = byMesh.get(o);
      if (it) { o.geometry = it.geo; o.material = idMat(kind, it.mat); restore.push(() => { o.geometry = it.g0; o.material = it.mat; }); continue; }
      if (!(o.isMesh || o.isLine || o.isPoints || o.isSprite)) continue;
      if (kind === 'C') hide(o); // only the machine casts: anything else in front of it from the sun would only hide more
      else if (kind === 'B') { if (o.isPoints || o.isLine || o.isLine2) hide(o); } // what GTAOPass hides
      else { const ms = [o.material].flat(); if (o.isMesh && ms.every(opaque)) ms.forEach((m) => mats.add(m)); else hide(o); }
    }
    for (const m of mats) { const c = m.colorWrite; m.colorWrite = false; restore.push(() => { m.colorWrite = c; }); }
    const bg = scene.background, ov = scene.overrideMaterial, auto = renderer.shadowMap.autoUpdate, rt0 = renderer.getRenderTarget();
    const cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha();
    scene.background = null;
    if (kind === 'B') scene.overrideMaterial = depthOnly;
    renderer.shadowMap.autoUpdate = false;
    renderer.setRenderTarget(rt);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, cam);
    renderer.readRenderTargetPixels(rt, 0, 0, rt.width, rt.height, buf);
    renderer.setRenderTarget(rt0);
    renderer.setClearColor(cc, ca);
    Object.assign(scene, { background: bg, overrideMaterial: ov });
    renderer.shadowMap.autoUpdate = auto;
    restore.forEach((f) => f());
    const flag = { A: 1, B: 2, C: 4 }[kind];
    let added = 0;
    for (let i = 0, n = rt.width * rt.height * 4; i < n; i += 4) {
      const id = buf[i] | (buf[i + 1] << 8) | (buf[i + 2] << 16);
      if (!id) continue;
      if (id > total) { bad++; continue; }
      if (!(seen[id] & flag)) added++;
      seen[id] |= flag;
    }
    return added;
  }
  window.__cull = {
    info, total, rt: [rtCam.width, rtCam.height], stage: [W, H],
    sample: (t) => { window.__plSeek(t); return [pass('A', camera, rtCam), pass('B', camera, rtCam)]; },
    sweepShadow(steps) {
      let added = 0;
      for (let i = 0; i <= steps; i++) {
        machine.setPaddles(0, i / steps); // the downstream paddle never moves (world.ts)
        scene.updateMatrixWorld(true);
        sun.shadow.camera.updateProjectionMatrix();
        sun.shadow.updateMatrices(sun);
        added += pass('C', sun.shadow.camera, rtSun);
      }
      return added;
    },
    counts: () => { const c = [0, 0, 0, 0]; for (let i = 1; i <= total; i++) { if (seen[i]) c[0]++; if (seen[i] & 1) c[1]++; if (seen[i] & 2) c[2]++; if (seen[i] & 4) c[3]++; } return { any: c[0], beauty: c[1], ao: c[2], shadow: c[3], bad }; },
    peek(kind, t) { // the frame and what a pass sees, IDs in false colour (a review aid)
      window.__plSeek(t);
      const frame = renderer.domElement.toDataURL('image/png');
      pass(kind, camera, rtCam);
      const [w, h] = [rtCam.width, rtCam.height], c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d'), img = ctx.createImageData(w, h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = ((h - 1 - y) * w + x) * 4, o = (y * w + x) * 4, id = buf[i] | (buf[i + 1] << 8) | (buf[i + 2] << 16);
        const k = Math.imul(id, 2654435761) >>> 0;
        img.data.set(id ? [64 + (k & 127), 64 + ((k >> 8) & 127), 64 + ((k >> 16) & 127), 255] : [0, 0, 0, 255], o);
      }
      ctx.putImageData(img, 0, 0);
      return [frame, c.toDataURL('image/png')];
    },
    dump: () => { let s = ''; for (let i = 0; i < seen.length; i += 0x8000) s += String.fromCharCode.apply(null, seen.subarray(i, i + 0x8000)); return btoa(s); },
  };
  return { info, total, rt: [rtCam.width, rtCam.height], stage: [W, H], sun: !!sun };
}

async function bake([sizeArg, from = '0', to = '90']) {
  const times = bakeTimes(Number(from), Number(to));
  fs.mkdirSync(DIR, { recursive: true });
  const b = await chromium.launch({ args: ARGS });
  for (const size of sizes(sizeArg)) {
    const { ctx, p } = await openPiece(b, size);
    const meta = await p.evaluate(setupInPage);
    log(`${size.join('x')}: stage ${meta.stage.join('x')}, IDs at ${meta.rt.join('x')}, ${meta.info.length} meshes, ${meta.total} triangles, sun ${meta.sun}; ${times.length} times ${from}–${to}`);
    const shadowAdded = await p.evaluate(() => window.__cull.sweepShadow(50));
    log(`shadow map, paddle swept 0…1 in 50 steps: ${shadowAdded} triangles`);
    for (let i = 0; i < times.length; i += 40) {
      const chunk = times.slice(i, i + 40);
      const added = await p.evaluate((ts) => ts.map((t) => window.__cull.sample(t)), chunk);
      const c = await p.evaluate(() => window.__cull.counts());
      const most = added.reduce((m, x, k) => (x[0] + x[1] > added[m][0] + added[m][1] ? k : m), 0);
      log(`${chunk[0]}–${chunk.at(-1)}: +${added.reduce((s, [a, o]) => s + a + o, 0)} new (most at ${chunk[most]}: +${added[most].join('/')}), seen ${JSON.stringify(c)}`);
    }
    const counts = await p.evaluate(() => window.__cull.counts());
    if (counts.bad) throw new Error(`${counts.bad} pixels with an ID past the last triangle: the ID pass is broken`);
    const key = `${size.join('x')}-${from}-${to}`;
    fs.writeFileSync(`${DIR}/ids-${key}.bin`, Buffer.from(await p.evaluate(() => window.__cull.dump()), 'base64'));
    fs.writeFileSync(`${DIR}/ids-${key}.json`, JSON.stringify({ ...meta, times: [times[0], times.at(-1), times.length], counts }));
    log(`wrote ids-${key}.bin: ${JSON.stringify(counts)}`);
    await ctx.close();
  }
  await b.close();
}

// ---- Node: the model ----
const req = createRequire(process.env.GLTF_PKG ?? path.resolve("package.json")); // a package.json whose node_modules has @gltf-transform/core and meshoptimizer
async function gltf() {
  const { NodeIO, MathUtils, Accessor } = req('@gltf-transform/core');
  const { EXTMeshoptCompression, KHRMeshQuantization } = req('@gltf-transform/extensions');
  const { MeshoptDecoder, MeshoptEncoder } = req('meshoptimizer');
  await MeshoptDecoder.ready; await MeshoptEncoder.ready;
  const io = (encoder = MeshoptEncoder) => new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': encoder });
  return { io, MathUtils, Accessor, EXTMeshoptCompression, MeshoptDecoder, MeshoptEncoder };
}
/** The model's primitives in the order three's GLTFLoader builds them (depth first, a node's primitives before its children). */
function instances(doc) {
  const out = [];
  const walk = (n, group) => { n.getMesh()?.listPrimitives().forEach((prim) => out.push({ group, node: n, mesh: n.getMesh(), prim })); n.listChildren().forEach((c) => walk(c, group)); };
  for (const n of doc.getRoot().listScenes()[0].listChildren()) walk(n, n.getName());
  return out;
}
/** Each NORMAL accessor's stored octahedral codes (json accessor index → { codes: 4 bytes a vertex, before the filter decodes
 *  them; normals: what the filter decodes them to, xyz }). */
function octCodes(file, MeshoptDecoder) {
  const buf = fs.readFileSync(file), jsonLen = buf.readUInt32LE(12), json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString());
  const bin = buf.subarray(20 + jsonLen + 8, 20 + jsonLen + 8 + buf.readUInt32LE(20 + jsonLen));
  const normals = new Set(json.meshes.flatMap((m) => m.primitives.map((p) => p.attributes.NORMAL)));
  const out = new Map(), views = new Map();
  for (const i of normals) {
    const a = json.accessors[i], bv = json.bufferViews[a.bufferView], e = bv.extensions?.EXT_meshopt_compression;
    if (!e || e.filter !== 'OCTAHEDRAL' || e.byteStride !== 4) throw new Error(`normal accessor ${i}: not octahedral 8-bit`);
    if (!views.has(a.bufferView)) {
      const src = bin.subarray(e.byteOffset ?? 0, (e.byteOffset ?? 0) + e.byteLength), raw = new Uint8Array(e.count * 4), dec = new Uint8Array(e.count * 4);
      MeshoptDecoder.decodeGltfBuffer(raw, e.count, 4, src, e.mode, 'NONE');
      MeshoptDecoder.decodeGltfBuffer(dec, e.count, 4, src, e.mode, 'OCTAHEDRAL');
      views.set(a.bufferView, [raw, new Int8Array(dec.buffer)]);
    }
    const [raw, dec] = views.get(a.bufferView), o = a.byteOffset ?? 0, normals = new Int8Array(a.count * 3);
    for (let v = 0; v < a.count; v++) for (let k = 0; k < 3; k++) normals[v * 3 + k] = dec[o + v * 4 + k];
    out.set(i, { codes: raw.slice(o, o + a.count * 4), normals });
  }
  return out;
}
/** The key gltf-transform's encoder sees for a NORMAL accessor: its values decoded to floats, padded to four. */
function normalKey(arr, MathUtils, BYTE) {
  const f = new Float32Array((arr.length / 3) * 4);
  for (let i = 0; i < arr.length / 3; i++) for (let k = 0; k < 3; k++) f[i * 4 + k] = MathUtils.decodeNormalizedInt(arr[i * 3 + k], BYTE);
  return hash(f);
}
function hash(f32) { const u = new Uint32Array(f32.buffer, f32.byteOffset, f32.length); let h = 0x811c9dc5; for (let i = 0; i < u.length; i++) h = Math.imul(h ^ u[i], 0x01000193); return `${u.length}:${h >>> 0}`; }
const sizesOf = (b) => ({ raw: b.length, gzip9: zlib.gzipSync(b, { level: 9 }).length, brotli11: zlib.brotliCompressSync(b, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: b.length } }).length });

async function write() {
  const { io, MathUtils, Accessor, EXTMeshoptCompression, MeshoptDecoder, MeshoptEncoder } = await gltf();
  const BYTE = Accessor.ComponentType.BYTE;
  const doc = await io().read(SRC);
  const inst = instances(doc);
  // The baked sets, each checked against the model's primitives
  const files = fs.readdirSync(DIR).filter((f) => /^ids-.*\.bin$/.test(f));
  if (!files.length) throw new Error(`no ids-*.bin in ${DIR}: bake first`);
  const total = inst.reduce((s, i) => s + i.prim.getIndices().getCount() / 3, 0);
  const seen = new Uint8Array(total + 1);
  for (const f of files) {
    const meta = JSON.parse(fs.readFileSync(`${DIR}/${f.replace(/\.bin$/, '.json')}`));
    const ok = meta.info.length === inst.length && meta.info.every(([t, v, name], k) => t === inst[k].prim.getIndices().getCount() / 3 && v === inst[k].prim.getAttribute('POSITION').getCount() && name === (inst[k].prim.getMaterial()?.getName() ?? ''));
    if (!ok) throw new Error(`${f}: its meshes are not this model's primitives`);
    const s = fs.readFileSync(`${DIR}/${f}`);
    for (let i = 0; i < s.length; i++) seen[i] |= s[i];
    console.log(`${f}: ${meta.times[2]} times ${meta.times[0]}–${meta.times[1]}, ${JSON.stringify(meta.counts)}`);
  }
  // Seen triangles per primitive (shared meshes: the union of their instances)
  const prims = new Map();
  let base = 1;
  for (const it of inst) {
    const n = it.prim.getIndices().getCount() / 3;
    const e = prims.get(it.prim) ?? { prim: it.prim, mesh: it.mesh, groups: new Set(), keep: new Uint8Array(n) };
    e.groups.add(it.group);
    for (let t = 0; t < n; t++) if (seen[base + t]) e.keep[t] = 1;
    prims.set(it.prim, e);
    base += n;
  }
  const report = {};
  const tally = (e, key, n) => { const g = [...e.groups].join('+'), m = e.prim.getMaterial()?.getName(); ((report[g] ??= {})[m] ??= { before: 0, seen: 0, ring: 0, kept: 0 })[key] += n; };
  for (const e of prims.values()) { tally(e, 'before', e.keep.length); tally(e, 'seen', e.keep.reduce((s, x) => s + x, 0)); }
  // One ring: every triangle with a vertex at a seen triangle's vertex position, across the primitives of its mesh
  for (const mesh of new Set([...prims.values()].map((e) => e.mesh))) {
    const es = [...prims.values()].filter((e) => e.mesh === mesh);
    const ids = new Map(), posId = es.map((e) => { const p = e.prim.getAttribute('POSITION').getArray(), out = new Int32Array(p.length / 3); for (let v = 0; v < out.length; v++) { const k = `${p[v * 3]},${p[v * 3 + 1]},${p[v * 3 + 2]}`; if (!ids.has(k)) ids.set(k, ids.size); out[v] = ids.get(k); } return out; });
    const touched = new Uint8Array(ids.size);
    es.forEach((e, k) => { const idx = e.prim.getIndices().getArray(); for (let t = 0; t < e.keep.length; t++) if (e.keep[t]) for (let j = 0; j < 3; j++) touched[posId[k][idx[t * 3 + j]]] = 1; });
    es.forEach((e, k) => { const idx = e.prim.getIndices().getArray(); for (let t = 0; t < e.keep.length; t++) if (!e.keep[t] && (touched[posId[k][idx[t * 3]]] || touched[posId[k][idx[t * 3 + 1]]] || touched[posId[k][idx[t * 3 + 2]]])) e.keep[t] = 2; });
  }
  for (const e of prims.values()) {
    tally(e, 'ring', e.keep.reduce((s, x) => s + (x === 2), 0));
    if (!process.env.ALL && [...e.groups].some((g) => WHOLE.test(g))) e.keep.fill(1);
    if (!e.keep.some((x) => x)) e.keep[0] = 1; // never an empty primitive: the scene graph stays the same
    tally(e, 'kept', e.keep.reduce((s, x) => s + (x ? 1 : 0), 0));
  }
  // The original's octahedral codes, for every normal the writer will encode (kept vertices only)
  const codes = octCodes(SRC, MeshoptDecoder), accessors = doc.getRoot().listAccessors();
  const codeOf = new Map(); // Accessor → its codes
  for (const [i, { codes: c, normals }] of codes) {
    const a = accessors[i], arr = a.getArray();
    if (a.getElementSize() !== 3 || arr.length !== normals.length || arr.some((x, k) => x !== normals[k])) throw new Error(`accessor ${i} is not the normal its codes decode to`);
    codeOf.set(a, c);
  }
  const byKey = new Map();
  const old = new Map(); // primitive → { idx, keepTri } of the original, for the read-back check
  for (const e of prims.values()) {
    const p = e.prim, idx = p.getIndices().getArray(), nOld = p.getAttribute('POSITION').getCount();
    old.set(p, { idx: idx.slice(), keep: e.keep.slice(), attrs: Object.fromEntries(p.listSemantics().map((s) => [s, p.getAttribute(s).getArray().slice()])) });
    const used = new Uint8Array(nOld), tris = [];
    for (let t = 0; t < e.keep.length; t++) if (e.keep[t]) { tris.push(t); for (let j = 0; j < 3; j++) used[idx[t * 3 + j]] = 1; }
    const remap = new Int32Array(nOld).fill(-1); let nNew = 0;
    for (let v = 0; v < nOld; v++) if (used[v]) remap[v] = nNew++;
    const out = nNew > 65535 ? new Uint32Array(tris.length * 3) : new Uint16Array(tris.length * 3);
    tris.forEach((t, k) => { for (let j = 0; j < 3; j++) out[k * 3 + j] = remap[idx[t * 3 + j]]; });
    const oldIdx = p.getIndices();
    p.setIndices(doc.createAccessor().setType('SCALAR').setArray(out).setBuffer(oldIdx.getBuffer()));
    if (!oldIdx.listParents().some((x) => x !== doc.getRoot())) oldIdx.dispose();
    for (const s of p.listSemantics()) {
      const a = p.getAttribute(s), src = a.getArray(), size = a.getElementSize(), dst = new src.constructor(nNew * size);
      for (let v = 0; v < nOld; v++) if (remap[v] >= 0) for (let k = 0; k < size; k++) dst[remap[v] * size + k] = src[v * size + k];
      const b = doc.createAccessor().setType(a.getType()).setArray(dst).setNormalized(a.getNormalized()).setBuffer(a.getBuffer());
      if (s === 'NORMAL') {
        const c = codeOf.get(a), cc = new Uint8Array(nNew * 4);
        for (let v = 0; v < nOld; v++) if (remap[v] >= 0) cc.set(c.subarray(v * 4, v * 4 + 4), remap[v] * 4);
        byKey.set(normalKey(dst, MathUtils, BYTE), cc);
      }
      p.setAttribute(s, b);
      if (!a.listParents().some((x) => x !== doc.getRoot())) a.dispose();
    }
  }
  // Same compression as build3.mjs (meshopt level high: the octahedral filter on normals), each normal's codes carried over
  let carried = 0, fresh = 0;
  const encoder = { ...MeshoptEncoder, encodeFilterOct(array, count, stride, bits) {
    const c = stride === 4 && bits === 8 ? byKey.get(hash(array)) : null;
    if (c && c.length === count * 4) { carried++; return c; }
    fresh++;
    return MeshoptEncoder.encodeFilterOct(array, count, stride, bits);
  } };
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
  const out = await io(encoder).writeBinary(doc);
  if (fresh) throw new Error(`${fresh} normal accessors were re-encoded, not carried over`);
  fs.writeFileSync(DST, out);
  // Read back: every kept triangle, in order, with bit-identical vertex values (a triangle's vertices may come back rotated)
  const back = await io().read(DST), bi = instances(back);
  let rotated = 0, tris = 0;
  const seenPrim = new Set();
  inst.forEach((it, k) => {
    if (seenPrim.has(it.prim)) return; seenPrim.add(it.prim);
    const o = old.get(it.prim), q = bi[k].prim, qi = q.getIndices().getArray(), sems = Object.keys(o.attrs);
    const keptT = []; for (let t = 0; t < o.keep.length; t++) if (o.keep[t]) keptT.push(t);
    if (qi.length !== keptT.length * 3) throw new Error(`primitive ${k}: ${qi.length / 3} triangles back, ${keptT.length} kept`);
    const qa = Object.fromEntries(sems.map((s) => [s, [q.getAttribute(s).getArray(), q.getAttribute(s).getElementSize()]]));
    const same = (ov, nv) => sems.every((s) => { const [arr, n] = qa[s], oa = o.attrs[s]; for (let j = 0; j < n; j++) if (arr[nv * n + j] !== oa[ov * n + j]) return false; return true; });
    keptT.forEach((t, j) => {
      const ov = [0, 1, 2].map((x) => o.idx[t * 3 + x]), nv = [0, 1, 2].map((x) => qi[j * 3 + x]);
      const r = [0, 1, 2].find((s) => [0, 1, 2].every((x) => same(ov[x], nv[(x + s) % 3])));
      if (r === undefined) throw new Error(`primitive ${k}, triangle ${t}: its vertices changed`);
      if (r) rotated++;
      tris++;
    });
  });
  const groups = Object.fromEntries(Object.entries(report).map(([g, ms]) => [g, Object.values(ms).reduce((a, m) => ({ before: a.before + m.before, seen: a.seen + m.seen, ring: a.ring + m.ring, kept: a.kept + m.kept }), { before: 0, seen: 0, ring: 0, kept: 0 })]));
  console.log(JSON.stringify({ groups, materials: report }, null, 1));
  console.log(`read-back: ${tris} triangles, every vertex bit-identical (${rotated} triangles' vertices rotated by the index codec, winding kept); normals' codes carried over for ${carried} accessors`);
  console.log(`triangles ${total} → ${tris}`);
  console.log('bytes before', sizesOf(fs.readFileSync(SRC)), 'after', sizesOf(out));
}

async function verify([sizeArg, from = '0', to = '90']) {
  const times = verifyTimes().filter((t) => t >= Number(from) && t < Number(to));
  const dpr = Number(process.env.DPR ?? 1), control = !!process.env.CONTROL;
  const b = await chromium.launch({ args: ARGS });
  const results = [];
  for (const size of sizes(sizeArg)) {
    const dir = `${DIR}/verify/${size.join('x')}@${dpr}${control ? '-control' : ''}`;
    fs.mkdirSync(dir, { recursive: true });
    for (const which of ['a', 'b']) {
      const { ctx, p } = await openPiece(b, size, { culled: which === 'b' && !control, dpr });
      const tris = await p.evaluate(() => { let n = 0; window.__pl.machine.group.traverse((o) => { if (o.isMesh && o.geometry.type !== 'PlaneGeometry') n += o.geometry.index.count / 3; }); return n; });
      log(`${size.join('x')}@${dpr} ${which === 'a' ? 'original' : control ? 'original again' : 'culled'}: ${tris} machine triangles in the page; ${times.length} frames`);
      for (const t of times) {
        const url = await p.evaluate((t) => { window.__plSeek(t); return window.__pl.renderer.domElement.toDataURL('image/png'); }, t);
        fs.writeFileSync(`${dir}/${t.toFixed(3)}-${which}.png`, Buffer.from(url.split(',')[1], 'base64'));
      }
      await ctx.close();
    }
    let differ = 0;
    for (const t of times) {
      const f = (w) => `${dir}/${t.toFixed(3)}-${w}.png`;
      const r = spawnSync('compare', ['-metric', 'AE', '-fuzz', '1%', f('a'), f('b'), f('diff')], { encoding: 'utf8' });
      const ae = Number((r.stderr || r.stdout).trim().split(/\s/)[0]);
      if (!Number.isFinite(ae)) throw new Error(`compare failed at ${t}: ${r.stderr}`);
      results.push([size.join('x'), t, ae]);
      if (ae) differ++;
      else for (const w of ['a', 'b', 'diff']) fs.rmSync(f(w), { force: true });
    }
    log(`${size.join('x')}@${dpr}: ${times.length} frames compared, ${differ} differ${differ ? ': ' + results.filter((x) => x[0] === size.join('x') && x[2]).map((x) => `${x[1]} (${x[2]} px)`).join(', ') : ''}`);
  }
  await b.close();
  fs.writeFileSync(`${DIR}/verify-${sizeArg ?? 'both'}-${from}-${to}@${dpr}${control ? '-control' : ''}.json`, JSON.stringify(results));
}

async function peek([sizeArg, ts]) {
  const b = await chromium.launch({ args: ARGS }), dir = `${DIR}/peek`;
  fs.mkdirSync(dir, { recursive: true });
  for (const size of sizes(sizeArg)) {
    const { ctx, p } = await openPiece(b, size);
    await p.evaluate(setupInPage);
    for (const t of ts.split(',').map(Number)) for (const kind of ['A', 'B']) {
      const [frame, ids] = await p.evaluate(([k, t]) => window.__cull.peek(k, t), [kind, t]);
      fs.writeFileSync(`${dir}/${size.join('x')}-${t}-frame.png`, Buffer.from(frame.split(',')[1], 'base64'));
      fs.writeFileSync(`${dir}/${size.join('x')}-${t}-${kind}.png`, Buffer.from(ids.split(',')[1], 'base64'));
    }
    await ctx.close();
  }
  await b.close();
}

async function film(args) {
  // film.mjs as it is, the culled model served for the original's URL on every page it opens
  const launch = chromium.launch.bind(chromium);
  chromium.launch = async (...a) => {
    const br = await launch(...a), newPage = br.newPage.bind(br);
    br.newPage = async (...o) => { const p = await newPage(...o); await p.route('**/models/rev360-compact.glb', (r) => r.fulfill({ path: DST, contentType: 'model/gltf-binary' })); return p; };
    return br;
  };
  const filmPath = path.join(path.dirname(new globalThis.URL(import.meta.url).pathname), 'film.mjs');
  process.argv = [process.argv[0], filmPath, ...args];
  await import(filmPath);
}

const [mode, ...rest] = process.argv.slice(2);
const run = { bake, write, verify, film, peek }[mode];
if (!run) { console.error('node cull.mjs bake|write|verify|film …  (see the note at the top)'); process.exit(2); }
await run(rest);
