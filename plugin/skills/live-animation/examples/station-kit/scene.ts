import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createTransferCell } from '../packing-transfer/cell.mjs';
import { addHallFloor } from './hall';
import { createConsole } from './cabinet';
import { createMarkedPanel } from './marked-panel';
import artwork from './ais-vision-systems-blue.svg?raw';

export async function mountStation(canvas:HTMLCanvasElement,transfer:boolean) {
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.NeutralToneMapping;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.04,40);
  addHallFloor(scene);
  const room=new RoomEnvironment(), gen=new THREE.PMREMGenerator(renderer);
  const env=gen.fromScene(room,.035);scene.environment=env.texture;room.dispose();gen.dispose();
  const key=new THREE.DirectionalLight('#fffaf3',2.1);key.position.set(-2,4,3);key.castShadow=true;
  Object.assign(key.shadow.camera,{left:-2,right:2,top:2,bottom:-2,near:.2,far:8});
  key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.001;
  scene.add(key,new THREE.HemisphereLight(0xf6f7fa,0x697180,1));
  const cabinet=createConsole(new THREE.Vector3(transfer?-1.07:0,0,transfer?-.30:0),.12,{marking:createMarkedPanel(artwork)});
  scene.add(cabinet.group);
  const cell=transfer ? await createTransferCell(scene) : undefined;
  function draw(t:number,view:string){
    const w=canvas.clientWidth,h=canvas.clientHeight;
    renderer.setSize(w,h,false);camera.aspect=w/h;
    const close=view!=='line';
    const target=close ? (transfer?new THREE.Vector3(.06,1.08,0):new THREE.Vector3(.10,1.80,-.08)) : new THREE.Vector3(transfer?-.47:0,.86,-.06);
    const distance=close?Math.max(1.22,1.26/camera.aspect):Math.max(4.90,(transfer?4.2:1.85)/camera.aspect);
    camera.position.copy(target).addScaledVector(new THREE.Vector3(.41,.22,.89),distance);
    camera.lookAt(target);
    const opening=close?0:1-THREE.MathUtils.smoothstep(t,.85,1.65);
    camera.setViewOffset(w,h,w>h?-w*.16*opening:0,-h*(w>h?.035:.075)*opening,w,h);
    camera.updateProjectionMatrix();
    cell?.sample(t);cabinet.setRunning(transfer?(t>=.25 && t<7.28):(t>=2 && t<6));
    renderer.render(scene,camera);
  }
  function inspect(){
    const skeletons=new Set(), lamp=cabinet.group.getObjectByName('green run lens') as THREE.Mesh<THREE.BufferGeometry,THREE.MeshPhysicalMaterial>;
    scene.traverse(o=>{if(o instanceof THREE.SkinnedMesh)skeletons.add(o.skeleton.bones[0]);});
    const centre=lamp.getWorldPosition(new THREE.Vector3()).project(camera);
    return {operatorPresent:skeletons.size>0,runIntensity:lamp.material.emissiveIntensity,
      lampInFrame:centre.z>=-1 && centre.z<=1 && Math.abs(centre.x)<1 && Math.abs(centre.y)<1,
      integratedMark:!!cabinet.group.getObjectByName('cut metal face')};
  }
  return {draw,inspect,measure:cell?.measure,dispose(){
    const materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
    scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of [o.material].flat())materials.add(m);}
      if(o instanceof THREE.SkinnedMesh)o.skeleton.dispose();});
    for(const m of materials){for(const v of Object.values(m))if(v instanceof THREE.Texture)textures.add(v);m.dispose();}
    for(const tex of textures)tex.dispose();env.dispose();renderer.dispose();
  }};
}
