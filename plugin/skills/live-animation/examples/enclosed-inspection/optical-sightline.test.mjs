import assert from "node:assert/strict";
import test from "node:test";
import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Ray, Scene, Vector3 } from "three";
import { opticalSightline } from "./optical-sightline.ts";

test("the centre ray reaches the label only through explicitly transmissive surfaces", () => {
  const scene = new Scene();
  const print = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial());
  const window = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ side: DoubleSide }));
  const bracket = new Mesh(new BoxGeometry(0.1, 0.4, 0.1), new MeshBasicMaterial());
  window.position.z = 0.8;
  window.material.userData.opticallyTransmissive = true;
  bracket.name = "mounting bracket";
  bracket.position.set(0.2, 0, 0.5);
  scene.add(print, window, bracket);
  const ray = new Ray(new Vector3(0, 0, 1), new Vector3(0, 0, -1));
  function observation() {
    scene.updateMatrixWorld(true);
    return opticalSightline(ray, print, scene);
  }
  assert.equal(observation().visible, true);
  bracket.position.x = 0;
  assert.deepEqual(observation(), { visible: false, obstruction: "mounting bracket" });
  bracket.position.z = -0.3;
  assert.equal(observation().visible, true);
  ray.direction.set(1, 0, 0);
  assert.equal(observation().visible, false);
});
