// Product tokens are the source; these adapters do not define a second palette.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export function themes(css) {
  // Top-level rules only, matched by counting braces, so a one-line rule or a nested one (a component scope that
  // re-sets --background) never leaks into the theme.
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  for (let i = 0, depth = 0, start = 0; i < css.length; i++) {
    if (css[i] === '{') { if (depth === 0) rules.push({ selector: css.slice(start, i).replace(/\/\*[\s\S]*?\*\//g, '').trim(), from: i + 1 }); depth++; }
    else if (css[i] === '}') { depth--; if (depth === 0) { rules.at(-1).body = css.slice(rules.at(-1).from, i); start = i + 1; } }
    else if (depth === 0 && css[i] === ';') start = i + 1;
  }
  const block = (selector) => Object.assign({}, ...rules.filter(r => r.selector === selector && r.body !== undefined)
    .map(({ body }) => Object.fromEntries([...body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^{}]*\}/g, '').matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]))));
  const root = block(':root'), aliases = block('html'), dark = block('.dark');
  const resolve = (scope, key, trail = []) => {
    if (!(key in scope) || trail.includes(key)) throw new Error(`Unresolved product token: ${[...trail, key].join(' / ')}`);
    return scope[key].replace(/var\(--([\w-]+)\)/g, (_, next) => resolve(scope, next, [...trail, key]));
  };
  return Object.fromEntries(['light', 'dark'].map(mode => {
    const scope = { ...root, ...aliases, ...(mode === 'dark' ? dark : {}) };
    return [mode, Object.fromEntries(Object.keys(scope).map(k => [k, resolve(scope, k)]))];
  }));
}

export function outputs(css) {
  const modes = themes(css), scheme = {};
  for (const [mode, t] of Object.entries(modes)) {
    scheme[mode] = {
      focusRing: { color: t.info },
      primary: { color: t.primary, contrastColor: t['primary-foreground'], hoverColor: t['primary-hover'], activeColor: t['primary-hover'] },
      highlight: { background: t.secondary, focusBackground: t['secondary-hover'], color: t['secondary-foreground'], focusColor: t['secondary-foreground'] },
      text: { color: t.foreground, hoverColor: t.foreground, mutedColor: t['muted-foreground'], hoverMutedColor: t['muted-foreground'] },
      content: { background: t.card, hoverBackground: t.secondary, borderColor: t.border, color: t.foreground, hoverColor: t.foreground },
      formField: { background: t.background, disabledBackground: t.muted, filledBackground: t.inset, filledHoverBackground: t.inset, filledFocusBackground: t.inset, borderColor: t.input, hoverBorderColor: t.info, focusBorderColor: t.info, invalidBorderColor: t.destructive, color: t.foreground, disabledColor: t['muted-foreground'], placeholderColor: t['muted-foreground'], invalidPlaceholderColor: t.destructive },
      overlay: { select: { background: t.card, borderColor: t.border, color: t.foreground }, popover: { background: t.card, borderColor: t.border, color: t.foreground }, modal: { background: t.card, borderColor: t.border, color: t.foreground } },
      list: { option: { focusBackground: t.secondary, selectedBackground: t.secondary, selectedFocusBackground: t['secondary-hover'], color: t.foreground, focusColor: t.foreground, selectedColor: t.foreground, selectedFocusColor: t.foreground } }
    };
  }
  const blue = Object.fromEntries(Object.entries(modes.light).filter(([k]) => /^blue-\d+$/.test(k)).map(([k, v]) => [k.slice(5), v]));
  const surface = Object.fromEntries(Object.entries(modes.light).filter(([k]) => /^neutral-\d+$/.test(k)).map(([k, v]) => [k.slice(8), v]));
  surface[900] = modes.dark.card; surface[950] = modes.dark.background;
  // Per scheme too: @primeuix/themes 2 (MIT) lets Aura's light and dark surfaces win over a scheme-less one.
  for (const m of Object.values(scheme)) m.surface = surface;
  const pair = token => modes.light[token] === modes.dark[token] ? modes.light[token] : `light-dark(${modes.light[token]}, ${modes.dark[token]})`;
  const buttonRole = (background, foreground, hover = background) => ({ background: pair(background), hoverBackground: pair(hover), activeBackground: pair(hover), borderColor: pair(background), hoverBorderColor: pair(hover), activeBorderColor: pair(hover), color: pair(foreground), hoverColor: pair(foreground), activeColor: pair(foreground), focusRing: { color: pair('info'), shadow: 'none' } });
  const preset = { primitive: { borderRadius: { sm: modes.light.radius, md: modes.light.radius, lg: modes.light['radius-modal'] }, blue }, semantic: { primary: blue, surface, focusRing: { color: '{primary.color}' }, formField: { borderRadius: modes.light.radius }, colorScheme: scheme }, components: { dialog: { root: { borderRadius: modes.light['radius-modal'] } }, button: { root: { primary: buttonRole('primary', 'primary-foreground', 'primary-hover'), secondary: buttonRole('secondary', 'secondary-foreground', 'secondary-hover'), danger: buttonRole('destructive', 'destructive-foreground') } } } };
  const vuetify = Object.fromEntries(Object.entries(modes).map(([mode, t]) => [`ais${mode === 'light' ? 'Light' : 'Dark'}`, { dark: mode === 'dark', colors: {
    background: t.background, surface: t.card, 'surface-variant': t.muted, 'on-background': t.foreground, 'on-surface': t.foreground, 'on-surface-variant': t['muted-foreground'], primary: t.primary, 'on-primary': t['primary-foreground'], secondary: t.secondary, 'on-secondary': t['secondary-foreground'], error: t.destructive, 'on-error': t['destructive-foreground'], success: t.success, warning: t.warning, info: t.info,
    ...Object.fromEntries(['brand', 'border', 'input', 'primary-hover', 'secondary-hover', 'chart-1', 'chart-2', 'chart-3', 'split-train', 'split-validation', 'split-test', 'split-predetermined'].map(k => [k, t[k]]))
  } }]));
  const header = '// Generated by node packages/vue-themes/generate.mjs from packages/design/styles.css.\n';
  return {
    'tokens.json': JSON.stringify(modes, null, 2) + '\n',
    'primevue.mjs': header + "import { definePreset } from '@primeuix/themes';\nimport Aura from '@primeuix/themes/aura';\n\nexport default definePreset(Aura, " + JSON.stringify(preset, null, 2) + ');\n',
    'vuetify.mjs': header + 'export const themes = ' + JSON.stringify(vuetify, null, 2) + ';\nexport default { defaultTheme: \'aisLight\', themes };\n',
    'base.css': header.replace('// ', '/* ').trimEnd() + ' */\n:root {\n  --ais-control-radius: ' + modes.light.radius + ';\n  --ais-modal-radius: ' + modes.light['radius-modal'] + ';\n}\n.dark { color-scheme: dark; }\nbody { font-family: ' + modes.light['font-family'] + '; font-size: 0.875rem; }\n'
  };
}

export function generate({ check = false } = {}) {
  const files = outputs(fs.readFileSync(path.join(HERE, '../design/styles.css'), 'utf8'));
  for (const [name, body] of Object.entries(files)) {
    const dest = path.join(HERE, name);
    if (check) { if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== body) throw new Error(`Stale Vue theme: ${name}`); }
    else fs.writeFileSync(dest, body);
  }
  return Object.keys(files).length;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(`${generate({ check: process.argv.includes('--check') })} Vue theme files ${process.argv.includes('--check') ? 'checked' : 'generated'}.`);
