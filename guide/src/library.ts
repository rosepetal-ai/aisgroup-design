import type { Lang } from './i18n';

/** Curated Lucide icons (lucide-static 1.48.0, 130 icons), synced from assets/brand/icons/svg. */
export const iconGroups: { name: Record<Lang, string>; icons: string[] }[] = [
  { name: { en: 'Navigation', es: 'Navegación', ca: 'Navegació' }, icons: ['arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'arrow-up-right', 'chevron-right', 'chevron-left', 'chevron-down', 'chevron-up', 'external-link', 'menu', 'ellipsis', 'house', 'plus', 'minus', 'x'] },
  { name: { en: 'Actions', es: 'Acciones', ca: 'Accions' }, icons: ['download', 'upload', 'search', 'filter', 'settings', 'copy', 'share-2', 'link', 'pencil', 'trash-2', 'save', 'refresh-cw', 'zoom-in', 'zoom-out', 'log-in', 'log-out'] },
  { name: { en: 'Media', es: 'Multimedia', ca: 'Multimèdia' }, icons: ['play', 'pause', 'skip-back', 'skip-forward', 'volume-2', 'volume-x', 'captions', 'maximize'] },
  { name: { en: 'Status', es: 'Estado', ca: 'Estat' }, icons: ['check', 'circle-check', 'circle-x', 'circle-alert', 'triangle-alert', 'info', 'ban', 'clock'] },
  { name: { en: 'Vision and inspection', es: 'Visión e inspección', ca: 'Visió i inspecció' }, icons: ['camera', 'video', 'aperture', 'focus', 'eye', 'crosshair', 'scan-line', 'scan-eye', 'scan-barcode', 'barcode', 'qr-code', 'ruler', 'grid-3x3', 'layers', 'image', 'sun', 'search-check', 'search-x', 'rotate-3d', 'package-search', 'scan-text', 'file-diff'] },
  { name: { en: 'AI and data', es: 'IA y datos', ca: 'IA i dades' }, icons: ['cpu', 'microchip', 'brain-circuit', 'bot', 'sparkles', 'server', 'cloud', 'network', 'database', 'activity', 'chart-column', 'chart-line', 'chart-pie', 'trending-up', 'trending-down', 'percent', 'code-xml'] },
  { name: { en: 'Industry', es: 'Industria', ca: 'Indústria' }, icons: ['factory', 'warehouse', 'package', 'boxes', 'truck', 'pill', 'flask-conical', 'car', 'wine', 'milk', 'wheat', 'cog', 'wrench', 'zap', 'thermometer', 'gauge', 'robot-arm', 'tag', 'stamp'] },
  { name: { en: 'Outcomes and business', es: 'Resultados y negocio', ca: 'Resultats i negoci' }, icons: ['target', 'award', 'badge-check', 'shield-check', 'lock', 'lock-open', 'scale', 'users', 'user', 'handshake', 'lightbulb', 'leaf', 'recycle', 'euro', 'timer', 'hourglass'] },
  { name: { en: 'Contact and documents', es: 'Contacto y documentos', ca: 'Contacte i documents' }, icons: ['mail', 'phone', 'map-pin', 'calendar', 'file-text', 'globe', 'building-2', 'book-open'] },
];

/** Technical illustrations exported from the Rosepetal site's figures; synced from assets/brand/illustrations. Each figure ships as <id>-light and <id>-dark; <id> alone is the dark one. */
export const illustrations: { id: string; file: string; name: Record<Lang, string>; shows: Record<Lang, string> }[] = [
  { id: 'bottles', file: 'bottles.svg', name: { en: 'Closure inspection', es: 'Inspección de cierres', ca: 'Inspecció de tancaments' }, shows: { en: 'A side camera checks two bottles; the one without a cap fails.', es: 'Una cámara lateral revisa dos botellas; la que no tiene tapón no pasa.', ca: 'Una càmera lateral revisa dues ampolles; la que no té tap no passa.' } },
  { id: 'machined', file: 'machined.svg', name: { en: 'Assembly completeness', es: 'Montaje completo', ca: 'Muntatge complet' }, shows: { en: 'An overhead camera checks the fasteners on two machined parts.', es: 'Una cámara cenital revisa los tornillos de dos piezas mecanizadas.', ca: 'Una càmera zenital revisa els cargols de dues peces mecanitzades.' } },
  { id: 'blister', file: 'blister.svg', name: { en: 'Blister inspection', es: 'Inspección de blísteres', ca: 'Inspecció de blísters' }, shows: { en: 'Two blister packs on lit fixtures; one has an empty cavity.', es: 'Dos blísteres sobre utillajes iluminados; uno tiene un alvéolo vacío.', ca: 'Dos blísters sobre utillatges il·luminats; un té un alvèol buit.' } },
  { id: 'electronics', file: 'electronics.svg', name: { en: 'Component presence', es: 'Presencia de componentes', ca: 'Presència de components' }, shows: { en: 'An overhead camera checks two circuit boards for a missing part.', es: 'Una cámara cenital busca un componente que falta en dos placas.', ca: 'Una càmera zenital busca un component que falta en dues plaques.' } },
  { id: 'parcel', file: 'parcel.svg', name: { en: 'Label check', es: 'Control de etiquetas', ca: 'Control d’etiquetes' }, shows: { en: 'A camera checks the top of two parcels for a shipping label.', es: 'Una cámara revisa si dos paquetes llevan etiqueta de envío.', ca: 'Una càmera revisa si dos paquets porten etiqueta d’enviament.' } },
  { id: 'cabinet', file: 'cabinet.svg', name: { en: 'Control cabinet', es: 'Armario de control', ca: 'Armari de control' }, shows: { en: 'Where the system runs: the industrial PC, I/O and power in a two-bay cabinet.', es: 'Dónde se ejecuta el sistema: PC industrial, E/S y alimentación en un armario de dos cuerpos.', ca: 'On s’executa el sistema: PC industrial, E/S i alimentació en un armari de dos cossos.' } },
  { id: 'bottling-line', file: 'bottling-line.webp', name: { en: 'Bottling line', es: 'Línea de embotellado', ca: 'Línia d’embotellament' }, shows: { en: 'A full filling and capping line, rendered in 3D; a bottle without a cap is pushed off the line.', es: 'Una línea completa de llenado y taponado, renderizada en 3D; una botella sin tapón sale empujada de la línea.', ca: 'Una línia completa d’omplert i tapat, renderitzada en 3D; una ampolla sense tap surt empesa de la línia.' } },
];

export const libraryCopy: Record<Lang, Record<string, string>> = {
  en: { download: 'Download', copyName: 'Copy name' },
  es: { download: 'Descargar', copyName: 'Copiar nombre' },
  ca: { download: 'Descarrega', copyName: 'Copia el nom' },
};

/** Download links for the light and dark files of an illustration, by format. */
export const versionCopy: Record<Lang, Record<'light' | 'dark', (format: 'SVG' | 'WebP') => string>> = {
  en: { light: (f) => `Download light ${f}`, dark: (f) => `Download dark ${f}` },
  es: { light: (f) => `Descargar ${f} claro`, dark: (f) => `Descargar ${f} oscuro` },
  ca: { light: (f) => (f === 'SVG' ? 'Descarrega l’SVG clar' : 'Descarrega el WebP clar'), dark: (f) => (f === 'SVG' ? 'Descarrega l’SVG fosc' : 'Descarrega el WebP fosc') },
};
