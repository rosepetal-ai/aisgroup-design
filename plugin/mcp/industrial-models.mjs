// A closed list of optimized, local scene models. No recursive discovery or network reads.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { installedSceneModels } from '../skills/scene-assembly/models-directory.mjs';

const industrial = [
  [
    'basler-ace2-gige',
    'Basler ace 2 GigE',
    'inspection camera',
    'camera body c-mount industrial vision cámara cuerpo',
  ],
  [
    'v1226-mpz',
    'Computar V1226-MPZ',
    '12 mm C-mount lens',
    'optic optics objective lens objetivo lente',
  ],
  [
    'svl-rm75-ring-light',
    'Smart Vision Lights RM75',
    'ring light',
    'ringlight annular led iluminación anular',
  ],
  [
    'svl-lxe300-linear-light',
    'Smart Vision Lights LXE300',
    'linear bar light',
    'illumination barra lineal iluminación',
  ],
  [
    'minitec-profile-45x45-f',
    'MiniTec Profile 45 × 45 F',
    'aluminium extrusion profile',
    '45x45 framing aluminum rail perfil extrusión 20.1033',
  ],
  [
    'minitec-profile-45x90-f',
    'MiniTec Profile 45 × 90 F',
    'aluminium extrusion profile',
    '45x90 framing aluminum rail perfil extrusión 20.1032',
  ],
  [
    'minitec-profile-90x90-l',
    'MiniTec Profile 90 × 90 L',
    'aluminium extrusion profile',
    '90x90 framing aluminum upright rail perfil extrusión 20.1010',
  ],
  [
    'minitec-foot-90-gd',
    'MiniTec Foot 90 GD',
    'profile foot',
    'feet base stand support pie soporte 21.1737',
  ],
  [
    'minitec-angle-45-gd-z',
    'MiniTec Angle 45 GD-Z',
    'angle bracket',
    'framing corner joint mounting fixed escuadra unión 21.1349',
  ],
  [
    'minitec-angle-bracket-swivel',
    'MiniTec Angle Bracket Swivel',
    'adjustable bracket',
    'adjustable angle pivot mount escuadra articulada 21.2020',
  ],
  [
    'minitec-hinge-45-al',
    'MiniTec Hinge 45 AL',
    'door hinge',
    'puerta bisagra hinge 21.1096',
  ],
  [
    'minitec-insert-seal-6',
    'MiniTec Insert Seal 6 F',
    'panel insert seal',
    'guard glazing channel junta perfil panel 22.1086',
  ],
  [
    'minitec-end-cap-45x45',
    'MiniTec End Cap 45 × 45',
    'profile end cap',
    'extrusion plug tapa perfil 22.1004',
  ],
  [
    'minitec-transport-roller-al',
    'MiniTec Transport Roller AL',
    'conveyor roller',
    'gravity rollers drum conveyor rodillo gravedad 21.1716',
  ],
  [
    'minitec-stopper-40',
    'MiniTec Stopper 40',
    'bumper stop',
    'end stop tope terminal 21.2301',
  ],
  [
    'minitec-conveyor-bearing-45',
    'MiniTec Conveyor Bearing 45',
    'conveyor bearing',
    'bearing block housing rodamiento soporte 21.0993',
  ],
  [
    'minitec-belt-driving-cylinder-45',
    'MiniTec Belt Driving Cylinder 45',
    'drive drum',
    'belt motor roller tambor motriz 21.0995',
  ],
  [
    'minitec-belt-tensioning-cylinder-45',
    'MiniTec Belt Tensioning Cylinder 45',
    'tensioning drum',
    'idler roller belt tension tambor tensor 21.0994',
  ],
  [
    'auer-eco-xmr100-3xll-stack-light',
    'AUER ECO XMR100 3×LL',
    'signal tower',
    'stack light beacon indicator lamp tower baliza torre señal',
  ],
];
const entries = [
  ...industrial.map(([slug, product, type, keywords]) => ({
    id: 'model-' + slug,
    product,
    type,
    keywords,
    file: 'industry/' + slug + '.part.glb',
    provenance:
      'Converted hardware part listed in the local industry model source register.',
    evidenceFile: 'industry/sources.txt',
  })),
  {
    id: 'model-rev360-compact',
    product: 'AIS REV 360 Compact',
    type: 'machine exterior',
    keywords: 'inspection machine hood housing shell máquina carcasa exterior',
    file: 'rev360-compact.glb',
    provenance:
      'AIS engineering exterior prepared for the website pharma line.',
  },
];
export const modelPackPaths = Object.freeze([
  ...entries.map(({file}) => file),
  'industry/kraft-detail.webp',
  'industry/sources.txt',
]);
const roots = new WeakMap();

export function findSceneModelsDir(
  studio,
  configured = process.env.AIS_SCENE_MODELS_DIR,
  cache,
) {
  // The source repo can sit in marketing/ beside websites/, or alongside the website checkout.
  const candidates = configured
    ? [path.resolve(configured)]
    : [
        installedSceneModels(cache),
        path.resolve(
          studio,
          '../../../websites/rosepetal-web-static-food/astro/public/models',
        ),
        path.resolve(
          studio,
          '../../rosepetal-web-static-food/astro/public/models',
        ),
      ];
  for (const candidate of candidates.filter(Boolean)) {
    try {
      const root = fs.realpathSync(candidate);
      if (fs.statSync(root).isDirectory()) return root;
    } catch {
      /* an absent workspace is a supported install */
    }
  }
  return null;
}

export function createMachineModels(modelRoot, resolveRoot = () => modelRoot) {
  return entries.map(({ file, ...metadata }) => {
    const item = {
      ...metadata,
      kind: 'machine-model',
      origin: 'local-website',
      status: 'review',
      reason: metadata.provenance,
      source: 'skill:scene-assembly/references/industrial-models.md',
      path: modelRoot ? path.join(modelRoot, file) : 'models/' + file,
    };
    roots.set(item, { resolveRoot, file });
    return item;
  });
}

// Resolve on each request so substituting a symlink after a previous search does
// not grant access. Only the named binary entries can be returned as model files.
function localFile(root, relative) {
  if (!root) return null;
  try {
    const real = fs.realpathSync(path.join(root, relative));
    const delta = path.relative(root, real);
    if (
      real !== path.resolve(root, relative) ||
      delta.startsWith('..' + path.sep) ||
      delta === '..' ||
      path.isAbsolute(delta) ||
      !fs.statSync(real).isFile()
    )
      return null;
    return real;
  } catch {
    return null;
  }
}
export function modelFile(item) {
  const location = roots.get(item);
  if (!location) return null;
  const real = localFile(location.resolveRoot(), location.file);
  if (!real || path.extname(real).toLowerCase() !== '.glb') return null;
  let fd;
  try {
    fd = fs.openSync(real, 'r');
    const bytes = fs.fstatSync(fd).size,
      head = Buffer.alloc(21);
    if (
      fs.readSync(fd, head, 0, 21, 0) !== 21 ||
      head.toString('ascii', 0, 4) !== 'glTF' ||
      head.readUInt32LE(4) !== 2 ||
      head.readUInt32LE(8) !== bytes ||
      head.readUInt32LE(12) > bytes - 20 ||
      head.readUInt32LE(12) % 4 !== 0 ||
      head.readUInt32LE(12) === 0 ||
      head.toString('ascii', 16, 20) !== 'JSON' ||
      head[20] !== 123
    )
      return null;
    return { path: real, bytes };
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}
export function modelDetail(item, summary) {
  const location = roots.get(item);
  if (!location) return { ...summary, uri: null, bytes: null };
  const resolved = modelFile(item);
  const evidence =
    item.evidenceFile && localFile(location.resolveRoot(), item.evidenceFile);
  return {
    ...summary,
    source: item.source,
    provenance: item.provenance,
    format: 'glTF 2.0 binary',
    units: 'metres',
    path: location.file,
    pathExists: Boolean(resolved),
    uri: resolved ? pathToFileURL(resolved.path).href : null,
    bytes: resolved?.bytes ?? null,
    ...(evidence ? { sourceRegisterUri: pathToFileURL(evidence).href } : {}),
    ...(!resolved
      ? {
          retrievalReason:
            'This prepared GLB is unavailable. Install the private scene model pack or set AIS_SCENE_MODELS_DIR to the models library.',
        }
      : {}),
  };
}
