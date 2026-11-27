import type { OrthographicCamera, Scene, WebGLRenderer } from "three";

/** Render a quarter of the current camera frame at the full canvas resolution. */
export function captureGeometryDetail(
  renderer: WebGLRenderer, scene: Scene, camera: OrthographicCamera, x: number, y: number,
) {
  if (![x, y].every(value => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new Error("Choose a detail centre in normalized image coordinates from 0 to 1.");
  }
  const canvas = renderer.domElement;
  const source = camera.view?.enabled ? camera.view : {
    fullWidth: canvas.width, fullHeight: canvas.height, width: canvas.width, height: canvas.height,
    offsetX: 0, offsetY: 0,
  };
  const width = source.width / 4, height = source.height / 4;
  const left = Math.max(0, Math.min(source.width - width, x * source.width - width / 2));
  const top = Math.max(0, Math.min(source.height - height, y * source.height - height / 2));
  const detail = camera.clone();
  detail.setViewOffset(source.fullWidth, source.fullHeight, source.offsetX + left, source.offsetY + top, width, height);
  try {
    renderer.render(scene, detail);
    return canvas.toDataURL("image/png");
  } finally {
    renderer.render(scene, camera);
  }
}
