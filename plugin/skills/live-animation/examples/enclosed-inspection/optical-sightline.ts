// Audit the first surface visible through the centre of the working aperture.
// Transmission is an explicit property of the station's guard or optical window.
import { Mesh, Object3D, Ray, Raycaster } from "three";

export function opticalSightline(ray: Ray, print: Mesh, scene: Object3D) {
  const caster = new Raycaster(ray.origin, ray.direction);
  const target = caster.intersectObject(print, false)[0];
  if (!target) return { visible: false, obstruction: "outside the printed face" };

  caster.far = target.distance;
  const solids: Mesh[] = [];
  scene.traverseVisible(object => {
    if (object instanceof Mesh && object !== print) solids.push(object);
  });
  for (const hit of caster.intersectObjects(solids, false)) {
    const mesh = hit.object as Mesh;
    const material = Array.isArray(mesh.material)
      ? mesh.material[hit.face?.materialIndex ?? 0]
      : mesh.material;
    if (material?.visible && !material.userData.opticallyTransmissive) {
      return { visible: false, obstruction: mesh.name || mesh.parent?.name || "unnamed surface" };
    }
  }
  return { visible: true, obstruction: null };
}
