// Illustrative workwear in metres. Shoulders remain on the station's existing IK anchors.
import * as THREE from 'three';
import type { createSuit } from './operatorSuit';
import headData from './operator-head.json';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const fabric = (color: string) => new THREE.MeshStandardMaterial({color,roughness:0.88});
export const coat = fabric('#b7b9b9');
const shoe = fabric('#313336');
const skin = fabric('#ad8473'), cap = fabric('#a5abac'), mask = fabric('#eeefed');
export const gloves = fabric('#727a80');
type Ring = [number,number,number,number?]; // height, half-width, half-depth, forward offset
function shell(rings: Ring[]) {
  const g = new THREE.LatheGeometry(rings.map(([y,r])=>new THREE.Vector2(r,y)),24);
  const pos=g.attributes.position;
  for(let i=0;i<pos.count;i++){
    const [,w,d,z=0]=rings[i%rings.length];
    pos.setZ(i,pos.getZ(i)*d/w+z);
  }
  g.computeVertexNormals();
  return g;
}
function part(root:THREE.Object3D,g:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0){
  const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=true;root.add(mesh);return mesh;
}
function oval(root:THREE.Object3D,m:THREE.Material,x:number,y:number,z:number,w:number,h:number,d:number){
  const mesh=part(root,new THREE.SphereGeometry(1,16,12),m,x,y,z);mesh.scale.set(w,h,d);return mesh;
}
// Merge by material once. Local axes are preserved for the packing operator's bend and turn.
function batch(root:THREE.Group){
  const bins=new Map<THREE.Material,THREE.BufferGeometry[]>();
  for(const child of [...root.children] as THREE.Mesh[]){
    child.updateMatrix();const material=child.material as THREE.Material;
    const bin=bins.get(material)??[];bin.push(child.geometry.applyMatrix4(child.matrix));bins.set(material,bin);root.remove(child);
  }
  for(const [material,parts] of bins){part(root,mergeGeometries(parts)!,material);parts.forEach(g=>g.dispose());}
}
function dressedHead(root: THREE.Group) {
  const decode = (encoded: string) => Uint8Array.from(atob(encoded), char => char.charCodeAt(0)).buffer;
  const geometry = new THREE.BufferGeometry();
  const points = Float32Array.from(new Int16Array(decode(headData.coordinates)), value => value / 10000);
  geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(decode(headData.triangles)), 1));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(points.length / 3 * 2), 2));
  geometry.computeVertexNormals();
  part(root, geometry, skin);
  for (const side of [-1, 1]) {
    const x = side * .0305;
    oval(root, mask, x, .778, .065, .011, .010, .012);
    oval(root, shoe, x, .777, .076, .0046, .005, .0015);
  }
  // Pleated mask follows the nose, cheeks and chin. Its width narrows below the jaw.
  const maskPoints: number[] = [], maskIndex: number[] = [];
  const widths = [.058,.070,.071,.069,.056,.042];
  const heights = [.765,.754,.742,.729,.711,.687];
  const centres = [.110,.119,.119,.115,.111,.101];
  for (let row = 0; row < widths.length; row++) for (let col = 0; col <= 8; col++) {
    const k = (col - 4) / 4;
    maskPoints.push(k * widths[row], heights[row] - .008 * k*k, centres[row] - .040 * k*k);
    const i = row * 9 + col;
    if (row && col) maskIndex.push(i-10,i-9,i, i-10,i,i-1);
  }
  const cover = new THREE.BufferGeometry();
  cover.setAttribute('position', new THREE.Float32BufferAttribute(maskPoints,3));
  cover.setIndex(maskIndex);
  cover.computeVertexNormals();
  const covering = mask.clone();
  covering.side = THREE.DoubleSide;
  part(root, cover, covering);
  const net = shell([[.805,.084,.104,-.004],[.810,.085,.106,-.004],[.825,.089,.111,-.005],[.85,.086,.11,-.004],[.873,.077,.098,-.004],[.893,.057,.075,-.009],[.904,.032,.047,-.011],[.91,.002,.003]]);
  const pleats=net.attributes.position;
  for (let i=0;i<pleats.count;i++) {
    const x=pleats.getX(i), z=pleats.getZ(i)+.006, y=pleats.getY(i);
    const height=THREE.MathUtils.clamp((y-.808)/.10,0,1);
    const pleat=.029*Math.sin(22*Math.atan2(z,x)+height*.8)*Math.sin(Math.PI*height);
    pleats.setXYZ(i,x*(1+pleat),y,(z*(1+pleat))-.006);
  }
  net.computeVertexNormals();
  part(root,net,cap);
  part(root,shell([[.804,.084,.104,-.004],[.807,.085,.105,-.004],[.811,.085,.106,-.004]]),cap);
}
export function upperBody(){
  const root=new THREE.Group();
  const head = new THREE.Group();
  dressedHead(head);
  // Eyes follow the work surface. Rotate about the base of the neck, not the hip.
  const neck = .635;
  head.rotation.x = .20;
  head.position.set(0, neck * (1 - Math.cos(.20)), -neck * Math.sin(.20));
  for (const mesh of [...head.children] as THREE.Mesh[]) {
    head.updateMatrix(); mesh.updateMatrix(); mesh.applyMatrix4(head.matrix);
    root.add(mesh);
  }
  batch(root);return root;
}
/** A shoe's origin is the ankle joint, +z towards the toes. */
export function workShoe() {
  const root = new THREE.Group();
  oval(root,shoe,0,-.022,.032,.059,.06,.119);
  oval(root,shoe,0,-.062,.035,.061,.021,.122);
  batch(root);
  return root;
}
export function lowerBody() {
  const root=new THREE.Group();
  for (const side of [-1,1]) {
    const boot=workShoe();
    boot.position.set(side*.09,.083,side*.025);
    root.add(boot);
  }
  return root;
}

/** A work glove centred on the existing grip target, with fingertips towards the product (+z). */
export function gloveGeometry(side: number) {
  const root = new THREE.Group();
  oval(root,gloves,0,0,-.005,.027,.018,.031);
  for(let i=0;i<4;i++) {
    oval(root,gloves,(i-1.5)*.011,-.004,.021-Math.abs(i-1)*.002,.0068,.009,.018);
  }
  const thumb=oval(root,gloves,-side*.022,.003,.012,.010,.012,.023);
  thumb.rotation.y=-side*.52;
  batch(root);return (root.children[0] as THREE.Mesh).geometry;
}

/** Grounded feet during the step, with a two-link knee solution as the packing operator lowers a case. */
export function packingLegs(){
  const root=new THREE.Group();
  const axes=new THREE.Vector3(0,1,0);
  const legs=([-1,1] as const).map(side=>{
    const boot=workShoe();root.add(boot);
    return {side,boot};
  });
  const hip=new THREE.Vector3(), foot=new THREE.Vector3(), knee=new THREE.Vector3();
  const dir=new THREE.Vector3(), forward=new THREE.Vector3();
  return {root, update(origin:THREE.Vector3, yaw:number, step:number, dx:number,dz:number,suit: ReturnType<typeof createSuit>){
    for(const {side,boot} of legs) {
      const phase=THREE.MathUtils.clamp(step*2-(side===1?1:0),0,1);
      const eased=phase*phase*(3-2*phase);
      hip.set(side*.09,.04,0).applyAxisAngle(axes,yaw).add(origin);
      foot.set(side*.11,.083,.018*side).applyAxisAngle(axes,yaw*eased);
      foot.x+=origin.x+(eased-step)*dx;foot.z+=origin.z+(eased-step)*dz;
      foot.y+=.05*Math.sin(phase*Math.PI);
      boot.position.copy(foot);
      boot.rotation.y=yaw*eased;
      dir.subVectors(foot,hip);const d=dir.length();dir.normalize();
      forward.set(Math.sin(yaw),0,Math.cos(yaw));forward.addScaledVector(dir,-forward.dot(dir)).normalize();
      knee.copy(hip).lerp(foot,.52).addScaledVector(forward,Math.sqrt(Math.max(0,.31**2-(d/2)**2)));
      suit.limb(side,true,hip,knee,foot);

    }
  }};
}
