import * as T from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { addHallFloor } from "../station-kit/hall";
import { getMaterials } from "../inspection-station/materials";
import { hardware } from "./hardware";
import { cartons, duration, sideReject, state, travel } from "./flow";
import { makeRejectStation } from "./reject-station";
import { auditRejectCycle } from "./reject-audit";
import { rejectX } from "./reject-cycle.mjs";
import { opticalSightline } from "./optical-sightline";
import { captureGeometryDetail } from "./geometry-detail";

import job from "./job.mjs";
import { code39Widths } from "./code39.mjs";

function artwork(id: string, label: string, pass: boolean, face: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  const c = canvas.getContext("2d")!;
  if (!face) {
    c.fillStyle = "#fbf9f2";
    c.fillRect(0, 0, 400, 200);
  }
  c.fillStyle = "#252a29";
  c.textAlign = "center";
  if (face) {
    c.font = "bold 86px Arial";
    c.fillText(label.toUpperCase(), 200, 126, 344);
  } else {
    const widths = code39Widths(id);
    // Include ten narrow quiet modules at each end; keep every bar on whole pixels.
    const units = widths.reduce((sum, width) => sum + width, 0);
    const module = Math.floor(canvas.width / (units + 20));
    if (module < 1) throw new Error("Increase the label texture size for this article ID.");
    let x = Math.floor((canvas.width - units * module) / 2);
    widths.forEach((width, index) => {
      if (index % 2 === 0) c.fillRect(x, 25, width * module, 116);
      x += width * module;
    });
    if (!pass) {
      c.fillStyle = "#fbf9f2";
      c.fillRect(109, 20, 131, 124);
    }
    c.fillStyle = "#252a29";
    c.font = "bold 33px Arial";
    c.fillText(label.toUpperCase(), 200, 181, 365);
  }
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, image: canvas.toDataURL() };
}
export async function station(canvas: HTMLCanvasElement) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  scene.background = new T.Color("#e9edf0");
  const room = new RoomEnvironment();
  const gen = new T.PMREMGenerator(renderer);
  const env = gen.fromScene(room);
  scene.environment = env.texture;
  room.dispose();
  gen.dispose();
  const camera = new T.OrthographicCamera(-2, 2, 1, -1, 0.02, 100);
  const mat = (color: string) =>
    new T.MeshStandardMaterial({ color, roughness: 0.64, metalness: 0.1 });
  const { anodised, beltWhite } = getMaterials();
  const paper = mat("#bd925f");
  const guard = new T.MeshStandardMaterial({
    color: "#b4dbdf",
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
    side: T.DoubleSide,
    roughness: 0.35,
  });
  guard.userData.opticallyTransmissive = true;
  const box = (
    parent: T.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: T.Material,
  ) => {
    const part = new T.Mesh(new T.BoxGeometry(w, h, d), m);
    part.position.set(x, y, z);
    part.castShadow = !m.transparent;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  };
  addHallFloor(scene);
  renderer.toneMapping = T.NeutralToneMapping;
  const sky = new T.HemisphereLight(0xf6f7fa, 0x697180, 1);
  scene.add(sky);
  const light = new T.DirectionalLight("#fffaf3", 2.1);
  light.position.set(-2, 5, 3);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, {
    left: -3,
    right: 3,
    top: 2,
    bottom: -2,
  });
  light.shadow.normalBias = 0.008;
  scene.add(light);
  const beltY = 0.78;
  const library = await hardware(scene, anodised);
  const mechanism = sideReject ? makeRejectStation(scene,beltY,anodised) : null;
  const belt = beltWhite.clone();
  belt.color.set("#626e72");
  const beltProfile = new T.Shape();
  beltProfile.moveTo(-1.84, 0.78);
  beltProfile.lineTo(1.84, 0.78);
  beltProfile.absarc(1.84, 0.751, 0.029, Math.PI / 2, -Math.PI / 2, true);
  beltProfile.lineTo(-1.84, 0.722);
  beltProfile.absarc(-1.84, 0.751, 0.029, -Math.PI / 2, Math.PI / 2, true);
  const continuousBelt = new T.Mesh(
    new T.ExtrudeGeometry(beltProfile, {
      depth: 0.31,
      bevelEnabled: false,
      curveSegments: 12,
    }),
    belt,
  );
  continuousBelt.position.z = -0.155;
  continuousBelt.receiveShadow = true;
  scene.add(continuousBelt);
  // The framed polycarbonate sides and roof expose the reader. The transport openings clear the load at both ends.
  for (const z of [-0.19, 0.19])
    box(scene, 0, 1.106, z, 0.614, 0.567, 0.006, guard);
  for (const x of [-0.33, 0.33])
    box(scene, x, 1.289, 0, 0.006, 0.206, 0.335, guard);
  box(scene, 0, 1.429, 0, 0.614, 0.006, 0.337, guard);
  const pull = mat("#2f3337");
  for (const y of [1.05, 1.13])
    box(scene, 0.27, y, 0.204, 0.012, 0.012, 0.03, pull);
  box(scene, 0.27, 1.09, 0.22, 0.012, 0.09, 0.011, pull);
  paper.color.set(0xb79167);
  paper.map = library.kraft;
  paper.roughness = 0.89;
  const gumTape = mat("#a58458");
  gumTape.roughness = 0.46;
  const sleeve = new T.MeshStandardMaterial({ color: 0xe4e1d6, roughness: 0.83 });
  const faces = cartons.map((item) => {
    const g = new T.Group();
    scene.add(g);
    const thickness = job.product.construction === "paperboard-sleeve" ? 0.0006 : 0;
    box(g, 0, 0.108 + thickness, 0, 0.3, 0.216, 0.21, paper);
    let printZ = 0.1055, printY = 0.2165, printWidth = 0.284;
    if (job.product.construction === "paperboard-sleeve") {
      // A visible kraft end at each side distinguishes the sleeve from a solid printed box.
      const span = 0.24;
      for (const z of [-1, 1])
        box(g, 0, 0.108 + thickness, z * (0.105 + thickness / 2), span, 0.216, thickness, sleeve);
      box(g, 0, 0.216 + 1.5 * thickness, 0, span, thickness, 0.21 + 2 * thickness, sleeve);
      // The sleeve supports the core one sheet thickness above the belt.
      box(g, 0, thickness / 2, 0, span, thickness, 0.21 + 2 * thickness, sleeve);
      printZ += thickness;
      printY += 2 * thickness;
      printWidth = 0.23;
    } else if (job.product.construction === "taped-carton") {
      box(g, 0, 0.2161, 0, 0.3, 0.0002, 0.022, gumTape);
      for (const x of [-0.15005, 0.15005])
        box(g, x, 0.195, 0, 0.0002, 0.042, 0.022, gumTape);
    } else throw new Error("Choose or construct the documented package shape for this brief.");
    const side = artwork(item.id, item.label, item.pass, true),
      top = artwork(item.id, item.label, item.pass, false);
    const sidePrint = new T.Mesh(
      new T.PlaneGeometry(printWidth, printWidth / 2),
      new T.MeshBasicMaterial({
        map: side.texture,
        transparent: true,
        depthWrite: false,
      }),
    );
    sidePrint.position.set(0, 0.106, printZ);
    g.add(sidePrint);
    const print = new T.Mesh(
      new T.PlaneGeometry(0.13, 0.065),
      new T.MeshBasicMaterial({ map: top.texture }),
    );
    print.rotation.x = -Math.PI / 2;
    print.position.set(0, printY, 0);
    g.add(print);
    return { g, print, bounds: new T.Box3().setFromObject(g), image: top.image };
  });
  function draw(t: number, view: string) {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (
      canvas.width !== Math.floor(w * renderer.getPixelRatio()) ||
      canvas.height !== Math.floor(h * renderer.getPixelRatio())
    )
      renderer.setSize(w, h, false);
    const overview =
      view === "wide"
        ? 1
        : view === "reader"
          ? 0
          : 1 - T.MathUtils.smoothstep(t, 1.2, 2.9);
    const wide = overview > 0.97;
    const s = state(t);
    const focus =
      view === "reader"
        ? 0
        : t > 9.6 && !wide
          ? ((s[0].x + s[1].x) / 2) * T.MathUtils.smoothstep(t, 9.6, 11)
          : 0;
    const readHold =
      view === "reader"
        ? 1
        : 1 -
          T.MathUtils.smoothstep(Math.abs(t - 3.8), 0.4, 1.05) +
          (1 - T.MathUtils.smoothstep(Math.abs(t - 8.8), 0.4, 1.05));
    const detail = view === "wide" ? 0 : readHold;
    const width = T.MathUtils.lerp(
      T.MathUtils.lerp(w < 600 ? 1.65 : 2.75, w < 600 ? 0.86 : 1.42, detail),
      4.95,
      overview,
    );
    const height = Math.max(
      width / (w / h),
      wide ? 1.92 : T.MathUtils.lerp(1.4, 0.84, detail),
    );
    Object.assign(camera, {
      left: (-height * w) / h / 2,
      right: (height * w) / h / 2,
      top: height / 2,
      bottom: -height / 2,
    });
    const target = new T.Vector3(
      focus - (w > 600 ? 0.26 : 0) * overview,
      T.MathUtils.lerp(
        T.MathUtils.lerp(0.95, 1.045, detail),
        w > 600 ? 0.84 : 0.57,
        overview,
      ),
      0,
    );
    const heldPusher = view === "reject";
    const rejectShot = mechanism && view !== "wide" && view !== "reader"
      ? (heldPusher ? 1 : T.MathUtils.smoothstep(t, 9.6, 12.05)) : 0;
    const offset = new T.Vector3(1.65, T.MathUtils.lerp(1.85, 1.07, detail), 5.8);
    if (rejectShot > 0) {
      const narrow = w < 600;
      // Auto follows both destinations. The held view looks across the exposed pad and guide rods.
      const rejectTarget = heldPusher
        ? new T.Vector3(narrow ? 0.82 : 1.175, narrow ? 1.305 : 0.78, -0.035)
        : new T.Vector3(narrow ? 1 : 0.71, narrow ? 1.025 : 0.78, -0.035);
      const rejectWidth = narrow ? 1.9 : (heldPusher ? 2.425 : 3);
      const rejectHeight = Math.max(rejectWidth / (w / h), 1.3);
      const frameHeight = T.MathUtils.lerp(height, rejectHeight, rejectShot);
      target.lerp(rejectTarget, rejectShot);
      offset.lerp(heldPusher ? new T.Vector3(5, 4.5, -2.8) : new T.Vector3(2.15, 6.5, 5.8), rejectShot);
      camera.top = frameHeight / 2;
      camera.bottom = -camera.top;
      camera.right = camera.top * w / h;
      camera.left = -camera.right;
    }
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const proj = (x: number, y: number, z: number) => {
      const p = new T.Vector3(x, y, z).project(camera);
      return { x: ((p.x + 1) * w) / 2, y: ((1 - p.y) * h) / 2 };
    };
    library.rolls.forEach((roll) => (roll.rotation.z = -travel(t) / 0.025));
    mechanism?.sample(t);
    const records = s.map((c, i) => {
      const g = faces[i].g;
      g.position.set(c.x, beltY, c.z);
      const { min, max } = faces[i].bounds;
      const corners = [min.x, max.x].flatMap((dx) =>
        [min.y, max.y].flatMap((dy) =>
          [min.z, max.z].map((dz) => proj(c.x + dx, beltY + dy, c.z + dz)),
        ),
      );
      const xs = corners.map((p) => p.x),
        ys = corners.map((p) => p.y);
      return {
        ...c,
        left: Math.min(...xs),
        top: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys),
        image: faces[i].image,
      };
    });
    renderer.render(scene, camera);
    return records;
  }
  function auditClearance(lateral = 0) {
    const beltBounds = new T.Box3().setFromObject(continuousBelt);
    const fixed: { bounds: T.Box3; name: string }[] = [];
    const hits = new Set<string>();
    scene.children
      .filter(
        (child) =>
          child !== continuousBelt && child !== mechanism?.root && !faces.some((item) => item.g === child),
      )
      .forEach((child) =>
        child.traverse((part) => {
          if (part instanceof T.Mesh) {
            // A bent cable's global box includes the empty space inside the bend.
            // Bound the strip between adjacent tube rings independently.
            const boxes: T.Box3[] = [];
            if (part.geometry instanceof T.TubeGeometry) {
              const { tubularSegments, radialSegments } =
                part.geometry.parameters;
              const vertices = part.geometry.getAttribute("position"),
                stride = radialSegments + 1;
              for (let segment = 0; segment < tubularSegments; segment++) {
                const bounds = new T.Box3();
                for (let j = 0; j < 2 * stride; j++)
                  bounds.expandByPoint(
                    new T.Vector3()
                      .fromBufferAttribute(vertices, segment * stride + j)
                      .applyMatrix4(part.matrixWorld),
                  );
                boxes.push(bounds);
              }
            } else boxes.push(new T.Box3().setFromObject(part));
            for (const bounds of boxes)
              if (bounds.max.y > beltBounds.max.y + 0.0005)
                fixed.push({ bounds, name: child.name || child.type });
          }
        }),
      );
    let collisions = 0,
      maxSupportGap = 0;
    const opticalHits: string[] = [];
    const first = faces.map((f) => f.g.position.clone());
    for (let i = 0; i <= Math.round(duration*20); i++) {
      const t = i / 20;
      state(t).forEach((rec, index) => {
        const f = faces[index];
        f.g.position.set(rec.x, beltY, rec.z + lateral);
        f.g.updateMatrixWorld(true);
        const body = new T.Box3().setFromObject(f.g);
        maxSupportGap = Math.max(
          maxSupportGap,
          Math.abs(body.min.y - beltBounds.max.y),
        );
        const touched = fixed.filter((obj) => obj.bounds.intersectsBox(body));
        if (touched.length) {
          collisions++;
          touched.forEach((obj) =>
            hits.add(obj.name + " " + JSON.stringify(obj.bounds)),
          );
        }
        if (t === rec.read) {
          if (opticalSightline(library.inspectionRay(), f.print, scene).visible) opticalHits.push(rec.id);
        }
      });
    }
    faces.forEach((f, i) => {
      f.g.position.copy(first[i]);
      f.g.updateMatrixWorld(true);
    });
    return {
      samples: Math.round(duration*20)+1,
      collisions,
      maxSupportGap,
      opticalHits,
      hits: [...hits].slice(0, 8),
    };
  }
  function rejectedFrame(){
    if(!mechanism)return null;
    function project(p:T.Vector3){
      p.project(camera);
      return {x:(p.x+1)*canvas.clientWidth/2, y:(1-p.y)*canvas.clientHeight/2};
    }
    const pad=new T.Box3().setFromObject(mechanism.pad);
    const actual=faces[1].g.position;
    return { pad:project(new T.Vector3(rejectX,pad.max.y,pad.max.z)),
      contact:project(new T.Vector3(actual.x,pad.max.y,actual.z-0.105)),
      receiver:project(mechanism.tray.getWorldPosition(new T.Vector3())) };
  }
  return {
    draw, auditClearance, rejectFraming:rejectedFrame,
    inventory:()=>mechanism ? [...library.inventory(),"side-pusher","receiver"] : library.inventory(),
    auditReject:(fault?:Parameters<typeof auditRejectCycle>[4])=>mechanism
      ? auditRejectCycle(mechanism,continuousBelt,faces,beltY,fault) : null,
    geometryDetail:(x:number,y:number)=>captureGeometryDetail(renderer,scene,camera,x,y),
  };
}
