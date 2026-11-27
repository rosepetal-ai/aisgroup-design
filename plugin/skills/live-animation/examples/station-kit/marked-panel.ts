import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';


export interface PanelSpec {
  width:number; height:number; depth:number;
  markX:number; markY:number; markWidth:number;
  metal:THREE.Material; insert:THREE.Material;
}

// Local +z is the exposed face at z=0. The material behind the openings is visible
// through the letters only. Enclosed counters (e.g. the O) retain their metal.
export function createMarkedPanel(artwork:string) {
  const parsed=new SVGLoader().parse(artwork);
  const box=(parsed.xml.getAttribute('viewBox')??'').trim().split(/[\s,]+/).map(Number);
  if(box.length!==4 || !box.every(Number.isFinite) || box[2]<=0 || box[3]<=0)throw Error('Machine artwork needs an SVG viewBox');
  const [left,top,artWidth,artHeight]=box;
  const shapes=parsed.paths.flatMap(path=>path.toShapes());
  if(!shapes.length)throw Error('Machine artwork needs vector outlines');
  return {
    panel(spec:PanelSpec) {
      const {width,height,depth,markWidth,markX,markY}=spec;
      const scale=markWidth/artWidth,markHeight=artHeight*scale;
      if(depth<=0 || markWidth<=0 || Math.abs(markX)+markWidth/2>=width/2 || Math.abs(markY)+markHeight/2>=height/2)
        throw Error('The machine mark must fit inside its metal panel');
      const corners = [[-1,-1],[-1,1],[1,1],[1,-1]].map(([x,y])=>new THREE.Vector2(x*width/2,y*height/2));
      const panel = new THREE.Shape(corners);
      const islands:THREE.Shape[]=[];
      const contour=(points:THREE.Vector2[])=>points.map(p=>new THREE.Vector2(markX+(p.x-left-artWidth/2)*scale,markY+(top+artHeight/2-p.y)*scale));
      for(const shape of shapes) {
        panel.holes.push(new THREE.Path(contour(shape.getPoints(4))));
        for(const hole of shape.holes)islands.push(new THREE.Shape(contour(hole.getPoints(4))));
      }
      const group=new THREE.Group();
      group.name='AIS marked metal panel';
      const geometry=new THREE.ExtrudeGeometry([panel,...islands],{depth,bevelEnabled:false});
      geometry.translate(0,0,-depth);
      const metal=new THREE.Mesh(geometry,spec.metal);
      metal.castShadow=metal.receiveShadow=true;
      metal.name='cut metal face';
      group.add(metal);
      const insert=new THREE.Mesh(new THREE.PlaneGeometry(markWidth+.002,markHeight+.002),spec.insert);
      insert.position.set(markX,markY,-Math.min(depth/2,.002));
      insert.name='aisNameplate';
      group.add(insert);
      return group;
    }
  };
}
export type Nameplate = ReturnType<typeof createMarkedPanel>;
