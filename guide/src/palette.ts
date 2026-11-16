// The copy sync-assets.mjs keeps in public/, so the site also builds outside aisgroup-design.
import tokens from '../public/downloads/ais-tokens.json';

type Token = { $value: { components: number[] }; $description: string };
const hexOf = (t: Token) => '#' + t.$value.components.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const scale = (name: string, group: Record<string, Token>) => Object.entries(group).map(([step, t]) => ({ key: `${name}-${step}`, step, hex: hexOf(t) }));

export const blue = scale('blue', tokens.color.blue as Record<string, Token>);
export const neutral = scale('neutral', tokens.color.neutral as Record<string, Token>);
export const status = (['success', 'warning', 'danger'] as const).map((key) => ({ key, step: '', hex: hexOf(tokens.color[key] as Token) }));
export const statusDark = (['success', 'warning', 'danger'] as const).map((key) => ({ key: `${key}-dark`, step: '', hex: hexOf(tokens.color[`${key}-dark`] as Token) }));
export const primary = blue.find((s) => s.step === '700')!.hex;

const luminance = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
/** WCAG 2.2 contrast ratio between two opaque sRGB colours. */
export const contrast = (a: string, b: string) => {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
};
/** Readable ink for a swatch label. */
export const inkOn = (hex: string) => (contrast(hex, '#FFFFFF') >= contrast(hex, '#0F1729') ? '#FFFFFF' : '#0F1729');

type L = { en: string; es: string; ca: string };
/** Short label under each swatch, so the strip stays aligned. */
export const roles: Record<string, L> = {
  'blue-50': { en: 'Soft surface', es: 'Superficie suave', ca: 'Superfície suau' },
  'blue-100': { en: 'Info tint', es: 'Fondo informativo', ca: 'Fons informatiu' },
  'blue-200': { en: 'Light blue', es: 'Azul claro', ca: 'Blau clar' },
  'blue-300': { en: 'Dark action', es: 'Acción oscura', ca: 'Acció fosca' },
  'blue-400': { en: 'Dark chart', es: 'Gráfico oscuro', ca: 'Gràfic fosc' },
  'blue-500': { en: 'Action', es: 'Acción', ca: 'Acció' },
  'blue-600': { en: 'Action hover', es: 'Hover de acción', ca: 'Hover d’acció' },
  'blue-700': { en: 'Brand', es: 'Marca', ca: 'Marca' },
  'blue-800': { en: 'Deep section', es: 'Sección profunda', ca: 'Secció profunda' },
  'blue-900': { en: 'Dark card', es: 'Tarjeta oscura', ca: 'Targeta fosca' },
  'blue-950': { en: 'Dark page', es: 'Página oscura', ca: 'Pàgina fosca' },
  'neutral-0': { en: 'White', es: 'Blanco', ca: 'Blanc' },
  'neutral-50': { en: 'Navigation', es: 'Navegación', ca: 'Navegació' },
  'neutral-100': { en: 'Section', es: 'Sección', ca: 'Secció' },
  'neutral-200': { en: 'Divider', es: 'Separador', ca: 'Separador' },
  'neutral-300': { en: 'Strong divider', es: 'Separador marcado', ca: 'Separador marcat' },
  'neutral-400': { en: 'Dark muted text', es: 'Texto tenue oscuro', ca: 'Text atenuat fosc' },
  'neutral-500': { en: 'Field border', es: 'Borde de campo', ca: 'Vora de camp' },
  'neutral-600': { en: 'Secondary text', es: 'Texto secundario', ca: 'Text secundari' },
  'neutral-700': { en: 'Dark field border', es: 'Borde oscuro', ca: 'Vora fosca' },
  'neutral-800': { en: 'Dark surface', es: 'Superficie oscura', ca: 'Superfície fosca' },
  'neutral-900': { en: 'Text', es: 'Texto', ca: 'Text' },
  success: { en: 'Success', es: 'Éxito', ca: 'Èxit' },
  warning: { en: 'Warning', es: 'Aviso', ca: 'Avís' },
  danger: { en: 'Error', es: 'Error', ca: 'Error' },
  'success-dark': { en: 'Success, dark', es: 'Éxito, oscuro', ca: 'Èxit, fosc' },
  'warning-dark': { en: 'Warning, dark', es: 'Aviso, oscuro', ca: 'Avís, fosc' },
  'danger-dark': { en: 'Error, dark', es: 'Error, oscuro', ca: 'Error, fosc' },
};

/** Hex for a token key such as "blue-700". */
export const hexFor = (key: string) => [...blue, ...neutral, ...status].find((c) => c.key === key)!.hex;

/** The eight colours that carry the brand in websites, documents, posts and campaigns. */
export const core: { key: string; name: L; role: L }[] = [
  { key: 'blue-700', name: { en: 'Brand blue', es: 'Azul de marca', ca: 'Blau de marca' }, role: { en: 'Logo, primary buttons, brand surfaces', es: 'Logotipo, botones principales, superficies de marca', ca: 'Logotip, botons principals, superfícies de marca' } },
  { key: 'blue-800', name: { en: 'Deep blue', es: 'Azul profundo', ca: 'Blau profund' }, role: { en: 'Deep sections, footers, button hover', es: 'Secciones profundas, pies, hover de botón', ca: 'Seccions profundes, peus, hover de botó' } },
  { key: 'blue-500', name: { en: 'Action blue', es: 'Azul de acción', ca: 'Blau d’acció' }, role: { en: 'Links and text actions', es: 'Enlaces y acciones de texto', ca: 'Enllaços i accions de text' } },
  { key: 'blue-200', name: { en: 'Light blue', es: 'Azul claro', ca: 'Blau clar' }, role: { en: 'Highlights and links on blue', es: 'Resaltes y enlaces sobre azul', ca: 'Ressalts i enllaços sobre blau' } },
  { key: 'neutral-900', name: { en: 'Text', es: 'Texto', ca: 'Text' }, role: { en: 'Headlines and body text', es: 'Titulares y texto', ca: 'Titulars i text' } },
  { key: 'neutral-600', name: { en: 'Secondary text', es: 'Texto secundario', ca: 'Text secundari' }, role: { en: 'Intros, captions, metadata', es: 'Entradillas, pies y metadatos', ca: 'Entradetes, peus i metadades' } },
  { key: 'neutral-100', name: { en: 'Section grey', es: 'Gris de sección', ca: 'Gris de secció' }, role: { en: 'Alternate section backgrounds', es: 'Fondos de sección alternos', ca: 'Fons de secció alterns' } },
  { key: 'neutral-0', name: { en: 'White', es: 'Blanco', ca: 'Blanc' }, role: { en: 'Pages, text on blue, reversed logo', es: 'Páginas, texto sobre azul, logotipo en negativo', ca: 'Pàgines, text sobre blau, logotip en negatiu' } },
];
