import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { rejectX, rejectPose } from "./reject-cycle.mjs";

type XYZ = [number,number,number];

// Illustrative guided cylinder, folded collection tray and bolted mounting brackets.
// The stationary guides, sliding rods, shoe and wear pad have separate geometry.
export function makeRejectStation(scene: T.Scene, beltY: number, aluminium: T.Material) {
  const root = new T.Group();
  root.name = "Side reject";
  root.position.set(rejectX,beltY,0);
  scene.add(root);
  const steel = new T.MeshStandardMaterial({color:0xc9cdd0, metalness:0.88, roughness:0.32});
  const chromed = new T.MeshStandardMaterial({color:0xe0e2e1, metalness:0.93, roughness:0.18});
  const black = new T.MeshStandardMaterial({color:0x24282b, metalness:0.18, roughness:0.73});
  const tube = new T.MeshStandardMaterial({color:0x3c4144, roughness:0.68});
  const sliding = new T.Group();
  root.add(sliding);
  const fixed: T.Mesh[]=[];
  function mesh(name: string, geo: T.BufferGeometry, mat: T.Material, at: XYZ, owner: T.Group=root) {
    const m = new T.Mesh(geo,mat);
    m.name=name;
    m.position.set(...at);
    m.castShadow=m.receiveShadow=true;
    owner.add(m);
    if(owner===root) fixed.push(m);
    return m;
  }
  function box(name: string, size: XYZ, at: XYZ, material=steel, radius=0.001, parent=root) {
    return mesh(name,new RoundedBoxGeometry(...size,1,radius),material,at,parent);
  }
  function pin(name:string,r:number,length:number,axis:"x"|"y"|"z",p:XYZ,mat=steel,sides=20,parent=root){
    const g = new T.CylinderGeometry(r,r,length,sides);
    if(axis==="z")g.rotateX(Math.PI/2);
    if(axis==="x")g.rotateZ(Math.PI/2);
    return mesh(name,g,mat,p,parent);
  }
  // Underslung brackets fasten to the frame's two side extrusions.
  for(const x of [-0.155,0.155]) {
    for(const side of [-1,1]) {
      const reach=side===1 ? 0.321 : 0.50;
      box("Bracket backplate",[0.052,0.091,0.007],[x,-0.073,side*0.216]);
      box("Cantilever flange",[0.052,0.007,reach],[x,-0.041,side*(0.216+reach/2)]);
      const triangle = new T.Shape();
      triangle.moveTo(0,0);triangle.lineTo(side*(reach-0.022),0);triangle.lineTo(0,-0.068);triangle.closePath();
      const gusset=new T.ExtrudeGeometry(triangle,{depth:0.006,bevelEnabled:false});
      // Shape X is the cantilever's local Z, its extrusion becomes the width of the web.
      gusset.rotateY(-Math.PI/2);
      mesh("Gusset",gusset,steel,[x+0.003,-0.0445,side*0.219]);
      for(const y of [-0.093,-0.058])
        pin("Frame fixing",0.006,0.006,"z",[x,y,side*0.222],chromed,6);
    }
  }
  const tray = box("Flush receiver deck",[0.462,0.005,0.385],[0,-0.0025,0.3485]);
  for(const x of [-0.2275,0.2275])
    box("Folded side edge",[0.007,0.036,0.385],[x,0.017,0.3485]);
  box("Folded end stop",[0.462,0.048,0.005],[0,0.023,0.539]);
  for(const x of [-0.155,0.155]) {
    box("Receiver spacer",[0.050,0.0325,0.27],[x,-0.02125,0.362]);
    for(const z of [0.255,0.475])
      pin("Tray underside fixing",0.006,0.005,"y",[x,-0.047,z],chromed,6);
  }
  // The cross-slide's mounting bed rests on the negative-Z cantilevers.
  box("Cylinder support plate",[0.375,0.015,0.474],[0,-0.030,-0.475]);
  for(const z of [-0.662,-0.302]) {
    box("Machined mounting foot",[0.146,0.075,0.056],[0,0.015,z]);
    for(const x of [-0.057,0.057])
      pin("Cylinder mount screw",0.006,0.008,"y",[x,0.055,z],chromed,6);
  }
  const axisY=0.092;
  box("Guided cylinder extrusion",[0.162,0.080,0.445],[0,axisY,-0.4745],aluminium as T.MeshStandardMaterial,0.004);
  for(const z of [-0.705,-0.244]){
    box("Cylinder head",[0.168,0.084,0.016],[0,axisY,z],steel,0.002);
    for(const x of [-0.069,0.069])for(const dy of [-0.030,0.030])
      pin("Cylinder tie screw",0.004,0.004,"z",[x,axisY+dy,z+(z<-.5?-0.01:0.01)],black,6);
  }
  const glandZ=-0.232;
  const rods = [-0.051,0,0.051].map(x=>{
    const r=x===0 ? 0.012 : 0.009;
    pin("Gland",r+0.005,0.009,"z",[x,axisY,glandZ],chromed);
    pin("Wiper seal",r+0.002,0.002,"z",[x,axisY,glandZ+0.005],black);
    return pin(x===0?"Piston rod":"Guide rod",r,1,"z",[x,axisY,0],chromed,24,sliding);
  });
  const shoe = box("Crosshead",[0.199,0.092,0.014],[0,axisY,0],steel,0.003,sliding);
  const pad = box("Replaceable contact pad",[0.191,0.088,0.006],[0,axisY,0],black,0.001,sliding);
  // Port elbows and fitted hoses run back to the bulkhead on the conveyor frame.
  for(const [i,z] of [-0.672,-0.282].entries()){
    const x=0.074+i*0.025;
    pin("Port adapter",0.009,0.01,"y",[0.054,0.137,z],steel,6);
    box("Pneumatic elbow",[0.021,0.017,0.018],[0.058,0.145,z],black,0.004);
    pin("Push-fit collar",0.007,0.008,"x",[0.071,0.145,z],chromed);
    const pts:XYZ[]=[[0.074,0.145,z],[0.092,0.145,z],[0.105,0.138,z+0.005],
      [x+0.055,0.05,z+0.024],[x+0.055,0.0,z+0.04],[x+0.055,-0.012,-0.253],[x+0.05,-0.065,-0.238]];
    const curve=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)),false,"centripetal");
    mesh("Pilot air line",new T.TubeGeometry(curve,26,0.004,8,false),tube,[0,0,0]);
    pin("Bulkhead coupling",0.0075,0.024,"z",[x+0.05,-0.065,-0.227],steel,6);
  }
  function sample(t:number,padOffset=0){
    const face=rejectPose(t).face+padOffset;
    pad.position.z=face-0.003;
    shoe.position.z=face-0.013;
    const tail=glandZ+0.005,tip=face-0.020;
    for(const rod of rods){
      rod.scale.z=tip-tail;
      rod.position.z=(tail+tip)/2;
    }
    root.updateMatrixWorld(true);
  }
  sample(0);
  return {root,sliding,fixed,tray,pad,sample};
}
