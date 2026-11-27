import * as T from "three";
import { cycle, rejectEnd } from "./reject-cycle.mjs";
import { state } from "./flow";
import type { makeRejectStation } from "./reject-station";

type Fault = "miss-contact" | "lower-tray" | "stuck-pad" | "wrong-item";
type RejectHardware = ReturnType<typeof makeRejectStation>;
const bounds = (part: T.Object3D) => new T.Box3().setFromObject(part);
const tolerance = 0.0001;

function overlapsSolid(a:T.Box3,b:T.Box3){
  return Math.min(a.max.x,b.max.x)-Math.max(a.min.x,b.min.x)>tolerance &&
    Math.min(a.max.y,b.max.y)-Math.max(a.min.y,b.min.y)>tolerance &&
    Math.min(a.max.z,b.max.z)-Math.max(a.min.z,b.min.z)>tolerance;
}

function supported(body:T.Box3, top:T.Box3) {
  return body.min.x>=top.min.x-tolerance && body.max.x<=top.max.x+tolerance &&
    body.min.z>=top.min.z-tolerance && body.max.z<=top.max.z+tolerance &&
    Math.abs(body.min.y-top.max.y)<=tolerance;
}

export function auditRejectCycle(
  mechanism:RejectHardware, belt:T.Mesh, faces:{g:T.Group}[], beltY:number, fault?:Fault,
) {
  const initial=faces.map(({g})=>g.position.clone());
  const trayY=mechanism.tray.position.y;
  const poseSave=mechanism.sliding.children.map(p=>({object:p,z:p.position.z,length:p.scale.z}));
  const beltBounds=bounds(belt), problems=new Set<string>();
  let maxContactGap=0,maxPadPenetration=0,maxSupportGap=0,maxUnsupportedSpan=0;
  let goodLateralDisplacement=0,returnError=0,passPadClearance=Infinity,failedOnTray=false,goodOnBelt=false;
  const samples=Math.round(rejectEnd*60)+1;
  try{
    if(fault==="lower-tray")mechanism.tray.position.y-=0.03;
    mechanism.sample(0);
    const tray=bounds(mechanism.tray),home=bounds(mechanism.pad).max.z;
    const fixed=mechanism.fixed.filter(m=>m!==mechanism.tray).map(m=>({name:m.name,box:bounds(m)}));
    for(let i=0;i<samples;i++){
      const t=i/60, rec=state(t);
      mechanism.sample(fault==="stuck-pad" && t>=cycle.return ? cycle.deposit : t, fault==="miss-contact" ? -0.02 : 0);
      const pad=bounds(mechanism.pad);
      for(const [j,{g}] of faces.entries()){
        const item=rec[j], good=item.pass;
        const z=fault==="wrong-item" ? rec[1-j].z : item.z;
        g.position.set(item.x,beltY,z);
        const body=bounds(g);
        // Verify both ends of the footprint, including the interval crossing the belt-to-tray seam.
        const spans=[beltBounds,tray].filter(s=>body.min.x>=s.min.x-tolerance && body.max.x<=s.max.x+tolerance)
          .map(s=>({a:Math.max(body.min.z,s.min.z),b:Math.min(body.max.z,s.max.z),gap:Math.abs(body.min.y-s.max.y)}))
          .filter(s=>s.b>s.a).sort((a,b)=>a.a-b.a);
        let end=body.min.z;
        for(const span of spans){
          maxUnsupportedSpan=Math.max(maxUnsupportedSpan,span.a-end);
          maxSupportGap=Math.max(maxSupportGap,span.gap);
          end=Math.max(end,span.b);
        }
        maxUnsupportedSpan=Math.max(maxUnsupportedSpan,body.max.z-end);
        for(const part of fixed)if(overlapsSolid(body,part.box))problems.add("Carton crosses "+part.name);
        if(good) {
          goodLateralDisplacement=Math.max(goodLateralDisplacement,Math.abs(g.position.z));
          const gap=(axis:"x"|"y"|"z")=>Math.max(0,pad.min[axis]-body.max[axis],body.min[axis]-pad.max[axis]);
          passPadClearance=Math.min(passPadClearance,Math.hypot(gap("x"),gap("y"),gap("z")));
        } else if(t>=cycle.contact && t<=cycle.deposit){
          if(pad.min.x>=body.max.x || pad.max.x<=body.min.x || pad.min.y>=body.max.y || pad.max.y<=body.min.y)
            problems.add("Push face misses carton footprint");
          const gap=body.min.z-pad.max.z;
          maxPadPenetration=Math.max(maxPadPenetration,-gap);
          maxContactGap=Math.max(maxContactGap,gap);
        }
        if(i===samples-1){
          if(good)goodOnBelt=supported(body,beltBounds);
          else failedOnTray=supported(body,tray);
        }
      }
      if(t>=cycle.home)returnError=Math.max(returnError,Math.abs(pad.max.z-home));
    }
  }finally{
    faces.forEach(({g},index)=>{g.position.copy(initial[index]);g.updateMatrixWorld(true);});
    mechanism.tray.position.y=trayY;
    for(const p of poseSave){p.object.position.z=p.z;p.object.scale.z=p.length;}
    mechanism.root.updateMatrixWorld(true);
  }
  if(maxContactGap>tolerance || maxPadPenetration>tolerance)problems.add("Contact pad misses or enters the carton");
  if(maxSupportGap>tolerance || maxUnsupportedSpan>0.002)problems.add("Support gap under carton");
  if(goodLateralDisplacement>tolerance || passPadClearance<tolerance)problems.add("Passing carton enters the reject stroke");
  if(returnError>tolerance)problems.add("Pad fails to return home");
  if(!failedOnTray || !goodOnBelt)problems.add("Wrong final destination");
  return {samples,maxContactGap,maxPadPenetration,maxSupportGap,maxUnsupportedSpan,goodLateralDisplacement,
    returnError,failedOnTray,goodOnBelt,passPadClearance,issues:[...problems]};
}
