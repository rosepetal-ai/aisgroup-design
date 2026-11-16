// No approval has been recorded for the mascot proposals in marketing/assets/brand-proposals.
export const APPROVED_MASCOTS = Object.freeze([]);
export const MODEL_FILE = /\.(?:glb|gltf|blend|fbx|obj|stl|step|stp|iges|igs|3dm|3ds|dae|ply|usd[acz]?|sldprt|sldasm|x_t|x_b|dwg|dxf)(?:$|[?#])/i;
export const pending = Object.freeze({ mascots: 'Held back. No mascot assets or proposals are published.', '3d-model': 'Pending a brand decision. Machine CAD and model files are not distributed. Use approved exterior renders with all guards closed.' });
export function allowedDownload(file) {
  return !MODEL_FILE.test(file) && !/(?:^|\/)(?:brand-proposals|mascots?|illustrations?)(?:\/|[._-])/i.test(file);
}
