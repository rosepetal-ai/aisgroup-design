import tokenNotes from '../data/token-notes.json';
import type { Lang } from '../i18n';
// Light and dark values of every semantic token, read from @aisgroup/design's styles.css at build time,
// so the Light and dark themes page can never drift from the package.
import { styles } from './package';
import { contrast } from '../palette';

type Decl = { value: string; comment?: string; group?: string };
const PALETTE = /^(blue|neutral|green|amber|red|rose|azure|cyan|orange|violet|purple|slate|grey)-\d+$/;

/** The declarations of every top-level block with this selector, in source order (later ones win). */
export function block(css: string, selector: string) {
  const out = new Map<string, Decl>();
  const re = new RegExp(`^${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([\\s\\S]*?)^\\}`, 'gm');
  for (const [, body] of css.matchAll(re)) {
    let group: string | undefined;
    for (const line of body.split('\n')) {
      const alone = line.match(/^\s*\/\*\s*(.*?)\s*\*\/\s*$/);
      if (alone) { group = alone[1]; continue; }
      const m = line.match(/^\s*--([\w-]+):\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/);
      if (m) out.set(m[1], { value: m[2].trim(), comment: m[3], group });
    }
  }
  return out;
}

const root = block(styles, ':root');
const aliases = block(styles, 'html');
const darkBlock = block(styles, '.dark');
// Everything sits on <html>: .dark beats html and comes after :root, so it wins in dark mode.
const scopes = { light: new Map([...root, ...aliases]), dark: new Map([...root, ...aliases, ...darkBlock]) };
export type Mode = keyof typeof scopes;

/** A token's value in a mode: its hex (or the colour-mix it is) and the palette step it comes from. */
export function resolve(name: string, mode: Mode): { value: string; step?: string } {
  const scope = scopes[mode];
  let step: string | undefined;
  const walk = (v: string, depth = 0): string => v.replace(/var\(--([\w-]+)\)/g, (_, n) => {
    if (depth > 12 || !scope.has(n)) return `var(--${n})`;
    if (PALETTE.test(n) && !step) step = n;
    return walk(scope.get(n)!.value, depth + 1);
  });
  const value = walk(scope.get(name)?.value ?? '');
  return { value: /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : value, step: /^#/.test(value) ? step : undefined };
}

const semantic = [...new Set([...root.keys(), ...aliases.keys()])].filter((n) => !PALETTE.test(n) && !/^(font|radius)/.test(n));
const useOf = (n: string) => root.get(n)?.comment ?? aliases.get(n)?.comment ?? darkBlock.get(n)?.comment ?? root.get(n)?.group ?? aliases.get(n)?.group ?? '';
/** The token an alias (html block, same in both modes' source) simply points at, e.g. card-foreground → foreground. */
const followsOf = (n: string) => (!root.has(n) && !darkBlock.has(n) ? aliases.get(n)?.value.match(/^var\(--([\w-]+)\)$/)?.[1] : undefined);

/** Every semantic token with its light and dark value and the package's own note on its use. */
export const tokens = semantic.map((name) => { const follows = followsOf(name); return { name, light: resolve(name, 'light'), dark: resolve(name, 'dark'), follows, use: follows ? '' : useOf(name) }; });
export const changing = tokens.filter((t) => t.light.value !== t.dark.value);
export const fixed = tokens.filter((t) => t.light.value === t.dark.value);

type L = { en: string; es: string; ca: string };
/** The text and background pairs that matter most, checked in both modes. `min` is the WCAG 2.2 AA threshold for that use. */
const PAIRS: [string, string, L, number][] = [
  ['foreground', 'background', { en: 'Text on the page', es: 'Texto sobre la página', ca: 'Text sobre la pàgina' }, 4.5],
  ['foreground', 'card', { en: 'Text on cards', es: 'Texto sobre tarjetas', ca: 'Text sobre targetes' }, 4.5],
  ['muted-foreground', 'background', { en: 'Secondary text', es: 'Texto secundario', ca: 'Text secundari' }, 4.5],
  ['muted-foreground', 'card', { en: 'Secondary text on cards', es: 'Texto secundario sobre tarjetas', ca: 'Text secundari sobre targetes' }, 4.5],
  ['info', 'background', { en: 'Links and text actions', es: 'Enlaces y acciones de texto', ca: 'Enllaços i accions de text' }, 4.5],
  ['info', 'card', { en: 'Links on cards', es: 'Enlaces sobre tarjetas', ca: 'Enllaços sobre targetes' }, 4.5],
  ['primary-foreground', 'primary', { en: 'Primary button', es: 'Botón principal', ca: 'Botó principal' }, 4.5],
  ['secondary-foreground', 'secondary', { en: 'Secondary button', es: 'Botón secundario', ca: 'Botó secundari' }, 4.5],
  ['destructive-foreground', 'destructive', { en: 'Destructive button', es: 'Botón destructivo', ca: 'Botó destructiu' }, 4.5],
  ['destructive', 'card', { en: 'Error text', es: 'Texto de error', ca: 'Text d’error' }, 4.5],
  ['success', 'card', { en: 'Success text', es: 'Texto de éxito', ca: 'Text d’èxit' }, 4.5],
  ['warning', 'card', { en: 'Warning icon', es: 'Icono de aviso', ca: 'Icona d’avís' }, 3],
  ['success-foreground', 'success-solid', { en: 'Success pill', es: 'Etiqueta de éxito', ca: 'Etiqueta d’èxit' }, 4.5],
  ['warning-solid-foreground', 'warning-solid', { en: 'Warning pill', es: 'Etiqueta de aviso', ca: 'Etiqueta d’avís' }, 4.5],
  ['topbar-foreground', 'topbar', { en: 'Top bar', es: 'Barra superior', ca: 'Barra superior' }, 4.5],
  ['action-soft-foreground', 'action-soft', { en: 'Soft action', es: 'Acción suave', ca: 'Acció suau' }, 4.5],
  ['matrix-full-foreground', 'matrix-full', { en: 'Confusion matrix, full cell', es: 'Matriz de confusión, celda llena', ca: 'Matriu de confusió, cel·la plena' }, 4.5],
  ['input', 'background', { en: 'Field border', es: 'Borde de campo', ca: 'Vora de camp' }, 3],
];

export const pairs = PAIRS.map(([fg, bg, use, min]) => ({
  fg, bg, use, min,
  modes: (['light', 'dark'] as const).map((mode) => {
    const [f, b] = [resolve(fg, mode).value, resolve(bg, mode).value];
    return { mode, fg: f, bg: b, ratio: contrast(f, b) };
  }),
}));

/** Which token does which job, with its value in each mode. Rendered on the Colour page and written into brand.md. */
export const usage: { role: L; token: string }[] = [
  { role: { en: 'Primary button', es: 'Botón principal', ca: 'Botó principal' }, token: 'primary' },
  { role: { en: 'Primary button, hover', es: 'Botón principal, hover', ca: 'Botó principal, hover' }, token: 'primary-hover' },
  { role: { en: 'Links, text actions and focus rings', es: 'Enlaces, acciones de texto y anillos de foco', ca: 'Enllaços, accions de text i anells de focus' }, token: 'info' },
  { role: { en: 'Text', es: 'Texto', ca: 'Text' }, token: 'foreground' },
  { role: { en: 'Secondary text', es: 'Texto secundario', ca: 'Text secundari' }, token: 'muted-foreground' },
  { role: { en: 'Page background', es: 'Fondo de página', ca: 'Fons de pàgina' }, token: 'background' },
  { role: { en: 'Page behind the cards', es: 'Página detrás de las tarjetas', ca: 'Pàgina darrere de les targetes' }, token: 'page' },
  { role: { en: 'Cards, popovers and menus', es: 'Tarjetas, popovers y menús', ca: 'Targetes, popovers i menús' }, token: 'card' },
  { role: { en: 'Dividers and borders', es: 'Separadores y bordes', ca: 'Separadors i vores' }, token: 'border' },
  { role: { en: 'Top bar', es: 'Barra superior', ca: 'Barra superior' }, token: 'topbar' },
  { role: { en: 'Highlights on blue', es: 'Resaltes sobre azul', ca: 'Ressalts sobre blau' }, token: 'brand-muted' },
  { role: { en: 'Success', es: 'Éxito', ca: 'Èxit' }, token: 'success' },
  { role: { en: 'Warning', es: 'Aviso', ca: 'Avís' }, token: 'warning' },
  { role: { en: 'Error', es: 'Error', ca: 'Error' }, token: 'destructive' },
  { role: { en: 'First chart series', es: 'Primera serie de gráfico', ca: 'Primera sèrie de gràfic' }, token: 'chart-1' },
];

/** Localised token roles use the guide’s existing language records. */
export function tokenNote(name: string, lang: Lang = 'en'): string {
  return (tokenNotes as Record<string, Record<Lang, string>>)[name]?.[lang] ?? '';
}
