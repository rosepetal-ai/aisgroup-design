// These are installed components with local dependencies. Their source URIs stay inside
// the installed plugin. The hosted design service has a separate download catalogue.
export const sceneRoot = 'skills/live-animation';
const packing = 'examples/packing-transfer';
const kit = 'examples/station-kit';
const vendor = 'templates/explainer/vendor/aisgroup/design';
const kitGuide = 'skill:live-animation/examples/station-kit/README.md';
const packingGuide = 'skill:live-animation/examples/packing-transfer/README.md';
const operatorLicense =
  'skill:live-animation/examples/packing-transfer/LICENSE.md';

export const sceneComponents = [
  {
    id: 'scene-packaging-operator',
    type: 'rigged person',
    file: packing + '/operator.glb',
    keywords:
      '3d model mesh people worker human character avatar operario operaria operador persona personas operarios personal',
    product: 'Illustrative packing station',
    source: packingGuide,
    licenseRef: operatorLicense,
    reason:
      'Microsoft Rocketbox Medical_Female_01. Select clothing and motion for the job. Include its MIT notice when redistributing.',
  },
  {
    id: 'scene-pharma-console',
    type: 'cabinet indicator lights',
    file: kit + '/cabinet.ts',
    keywords:
      'signal tower lamp control enclosure cabinet armario gabinete torre piloto señal indicador luces',
    product: 'Pharma line control cabinet',
    source: kitGuide,
    reason:
      'Metre-scale control cabinet derived from the pharma-line assembly with mounted signal tower, locks, glands and levelling feet.',
  },
  {
    id: 'scene-marked-panel',
    type: 'machine panel logo',
    file: kit + '/marked-panel.ts',
    keywords:
      'aperture nameplate steel metal cutout brand chapa placa marca logotipo recorte',
    product: 'Illustrative station',
    source: kitGuide,
    reason:
      'Cut the supplied vector mark through the panel and recess the insert. Select a finish supported by the machine reference.',
  },
  {
    id: 'scene-player',
    type: 'player controls',
    file: vendor + '/blocks/PlayerBar.vue',
    keywords:
      'captions Vue PlayerBar timeline controls controles reproductor subtítulos capítulos',
    product: 'AIS machine explainer',
    source: 'skill:live-animation/references/explainer.md',
    reason:
      'Shared AIS PlayerBar. Keep its packaged Vue components and stylesheet together or use the host’s matching @aisgroup/design dependency.',
  },
  {
    id: 'scene-transfer-cell',
    type: 'packing transfer machine',
    file: packing + '/cell.mjs',
    keywords:
      'conveyor case handoff cylinder carton transferencia empaque estuche cilindro caja transportador',
    product: 'Illustrative packing station',
    source: packingGuide,
    licenseRef: operatorLicense,
    reason:
      'Guided actuator, deck, case and operator. Use the neighbouring motion, rig and model files. The included actor carries its own licence.',
  },
].map(({ file, ...item }) => ({
  ...item,
  path: sceneRoot + '/' + file,
  kind: 'scene-component',
  status: 'review',
  origin: 'plugin',
}));

export const sceneRefs = [
  'skill:live-animation/SKILL.md',
  'skill:explainer-story/SKILL.md',
  'skill:scene-assembly/SKILL.md',
  'skill:scene-motion-review/SKILL.md',
];

// An animation can be either a source or the requested deliverable. An explicit
// post, deck or clip request keeps that output even when its subject is a station.
export function isSceneBrief(intent) {
  const text = intent
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
  const explicitScene =
    /\bthree\.?js\b|\blive[ -]animation\b|\binteractive\s+(?:(?:3d|machine|line|station|web|product)\s+)*(?:scene|animation|explainer)\b|\b3d (?:animation|scene)\b|\b(?:animacion|escena|recorrido|explicacion)\b.{0,45}\b(?:3d|interactiv[oa]|en vivo|en directo)\b/.exec(
      text,
    );
  // Sales briefs often identify the format by its player rather than by "3D".
  const player = /\b(?:our (?:usual |standard |shared |ais )?player|(?:ais|interactive) player|reproductor (?:habitual|interactivo|ais))\b/.exec(text);
  const equipment = /\b(?:line|station|reader|conveyor|sleeves?|cartons?|maquina|linea|lector|cinta|estacion)\b/.test(text);
  const scene = explicitScene || (equipment && player);
  if (!scene) return false;
  const other =
    /\b(?:post|carousel|carrusel|reel|deck|brochure|folleto|infografia|infographic|flyer|poster|pptx|video|clip|mp4)\b/.exec(
      text,
    );
  if (!other) return true;
  const beforeOther = text.slice(0, other.index);
  if (
    /(?:from|using|based on|reference|con|segun|partir de|usando|del)\s+(?:(?:the|this|our|that|el|la|este|esta|un|una|adjunto|supplied|provided)\s+){0,4}$/.test(
      beforeOther,
    )
  )
    return true;
  return (
    scene.index < other.index &&
    !/\b(?:make|create|produce|export|render|crear?|genera(?:r)?|exporta(?:r)?|as|como)\b.{0,18}$/.test(
      beforeOther.slice(scene.index + scene[0].length),
    )
  );
}
