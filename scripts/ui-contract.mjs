// Bounded static checks, not a replacement for keyboard, accessibility or visual testing.
// The template rules read only what renders: a .vue file's <template> (comments removed) and <style>, or a whole .css
// file; script code and comments (canvas colours, chart data, arrows in notes) are out of their scope. Rules come from
// the redesigned rosepetal-ui (feat/shadcn-redesign) and the product-ui references.
// The legacy families prove an app was fully moved onto our components, icons and theme: foreign UI kits and icon sets
// (imports, classes, package.json), foreign themes and overrides, misspelt brand names and redrawn logo files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { themes } from '../packages/vue-themes/generate.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PALETTE = 'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const BADGE = ['default', 'secondary', 'destructive', 'outline', 'overlay'];
const BUTTON = ['default', 'outline', 'ghost', 'secondary', 'destructive', 'link', 'topbar', 'topbar-tab'];
const TEMPLATE = [
  // <meta name="theme-color" content="#…"> needs a literal colour.
  ['raw-colour', /(?<!\bcontent=")#[0-9a-f]{3,8}\b/ig, 'Use a semantic token from packages/design/styles.css.'],
  ['stock-palette', new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline)-(?:${PALETTE})-\\d{2,3}\\b`, 'g'), 'Use the AIS semantic role instead of a stock palette class.'],
  ['named-colour', new RegExp(`\\bcolor="(?:${PALETTE}|grey|black|white|brown)(?:[- ][a-z0-9-]+)?"`, 'g'), 'PrimeVue/Vuetify: use the theme roles (primary, secondary, error…) from the AIS preset, not a named colour.'],
  // Styled components keep the package's corners. Skeletons take their content's shape, Field rows and hand-made
  // surfaces may set rounded-md/lg, top-bar buttons are round by design, and rounded-[inherit] follows the parent.
  ['radius-override', /<(?:Button|Badge|Card|Input|Textarea|SelectTrigger|Alert|DialogContent|PopoverContent|DropdownMenuContent|TabsList|TabsTrigger|Toggle|Avatar)\b(?![^>]*variant="topbar)[^>]*\bclass="[^"]*\brounded-(?:sm|lg|xl|2xl|3xl|full)\b/g, 'Never override a component\'s radius; the package sets it.'],
  ['arbitrary-radius', /\brounded-\[(?!inherit\])[^\]]+\]/g, 'Use the radius tokens, not an arbitrary value.'],
  ['heading-weight', /<(?:h[1-6]|[A-Z][A-Za-z]*Title|TableHead|Label|FieldLabel|FieldLegend)\b[^>]*\bclass="[^"]*\bfont-(?:bold|semibold|extrabold)\b/g, 'Headings and labels are font-medium; never bold or semibold.'],
  ['tinted-status', /\bbg-(?:success|destructive|warning|info)\/\d+\b/g, 'Status is a toned icon and the word, not a tinted background.'],
  ['veil', /\babsolute\b[^"]*\binset-0\b[^"]*\bbg-(?:card|background|white|black)\/\d+/g, 'No veil over content: Skeleton, Spinner in the working button, or Empty with Spinner.'],
  ['pill-tabs', /<TabsList\b(?![^>]*variant="line")[^>]*>/g, 'Tabs are always TabsList variant="line".'],
  ['selector-hack', /\[&_[^\]]*\]/g, 'No [&_…] selector hacks on components: compose stock parts.'],
  ['separator', /(?<![lL])·|·(?![lL])/g, 'No middle-dot separators; Catalan l·l is the only spelling exception.'],
  ['unicode-arrow', /[←-⇿]/g, 'Use a Lucide icon (ArrowLeft, ArrowRight…) rather than a Unicode arrow.'],
  ['small-text', /\btext-xs\b/g, 'Check: text-xs only for chart axes and Kbd; content people read is 14 px or more.'],
];
const STYLE = [
  ['raw-colour', /#[0-9a-f]{3,8}\b/ig, 'Use var(--token) from packages/design/styles.css.'],
  ['separator', /content:\s*["'][^"']*·/g, 'No middle-dot separators, also in CSS content.'],
];

// Legacy families. Fixes name the design MCP call that solves them, since the target app has none of our repo paths.
export const FAMILIES = ['template', 'foreign-ui', 'foreign-icons', 'foreign-theme', 'brand-name', 'logo-file'];
const ADVISORY = new Set(['small-text']);
const PRIMEVUE = 'design_code kind=migration name=primevue', VUETIFY = 'design_code kind=migration name=vuetify', ICONS = 'design_code kind=migration name=icons';
const THEME_PKG = /^@(?:primevue|primeuix)\/themes(?:\/|$)/;
const ICON_PKG = /^(?:primeicons(?:\/|$)|lucide-vue-next(?:\/|$)|@(?:mdi|fortawesome|heroicons|iconify)\/)/;
const UI_PKG = /^(?:primevue|tailwindcss-primeui|vuetify|element-plus|naive-ui|quasar|ant-design-vue|bootstrap-vue|bootstrap-vue-next|@headlessui\/vue|vant|@ionic\/vue)(?:\/|$)|^@(?:primevue|primeuix)\//;
function legacyPackage(name) {
  if (THEME_PKG.test(name)) return ['foreign-theme', `The theme is ours, not PrimeVue's: ${PRIMEVUE}.`];
  if (ICON_PKG.test(name)) return ['foreign-icons', `Icons are Lucide from @lucide/vue: ${ICONS}.`];
  if (UI_PKG.test(name)) return ['foreign-ui', `Replace it with our components: ${/prime/.test(name) ? PRIMEVUE : /vuetify/.test(name) ? VUETIFY : 'design_code kind=components'}.`];
}
const SCRIPT = [
  ['foreign-ui', /\.use\(\s*PrimeVue\b/g, `Remove the PrimeVue plugin: ${PRIMEVUE}.`],
  ['foreign-ui', /\.use\(\s*[vV]uetify\b/g, `Remove the Vuetify plugin: ${VUETIFY}.`],
  ['foreign-theme', /\bdefinePreset\s*\(/g, `No PrimeVue preset: the theme is ours, ${PRIMEVUE}.`],
  ['foreign-theme', /\bcreateVuetify\s*\(/g, `No Vuetify theme: the theme is ours, ${VUETIFY}.`],
];
// Icon classes: in templates and in script strings (menu models pass 'pi pi-…' as data).
const ICON_CLASS = /\bpi pi-[\w-]+|\bmdi-[a-z][\w-]*|\b(?:fa[srbl]?|fa-(?:solid|regular|brands|light|thin|duotone)) fa-[a-z][\w-]*|(['"])fa[srb]\1(?!\s*:)|\bmaterial-(?:icons|symbols)(?:-[a-z]+)?\b|\bbi bi-[\w-]+/g;
const PRIME_VAR = /(?<![\w-])--p-[a-z][\w-]*/g;
const DEEP = /:deep\(|::v-deep|\/deep\/|>>>/g, IMPORTANT = /!important\b/g;
const OVERRIDE_FIX = 'No overrides of component internals: use its props and variants, design_code kind=components.';
// The guide's «Writing the names» table. Never inside an email, a domain, a path, a class or an identifier.
const BRAND = /(?<![\w@./<-])(?:(?:AISVision|AIS ?VISION|Ais ?Vision|AIS vision)(?: ?(?:Systems|SYSTEMS|systems|Automation|AUTOMATION|automation))?|AIS Automation|Ais Group|AiS Group|AIS GROUP|AIS group|A\.I\.S\.|Ais Scanology|AIS scanology|AIS SCANOLOGY|RosePetal|Rose Petal|ROSEPETAL)(?![\w-]|\.\w|@)/g;
const brandFix = (v) => `Write «${/automation/i.test(v) ? 'AIS Vision Automation' : /scanology/i.test(v) ? 'AIS Scanology' : /rose/i.test(v) ? 'Rosepetal' : /vision/i.test(v) ? 'AIS Vision Systems' : 'AIS Group'}»: design_standards kind=guidelines section=brand-guidelines page=brands.`;
const LOGO_NAME = /favicon|apple-touch|android-chrome|mstile|safari-pinned-tab|maskable|icon-\d+|(?:^|[^a-zA-Z])(?:logo(?!ut)|brand|mark(?!et|down|er))|Logo(?!ut)|LOGO|Brand|BRAND|Mark(?!et|down|er)/;

const blank = (s) => s.replace(/[^\n]+/g, (m) => ' '.repeat(m.length));
const stripCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, blank);
// ponytail: regex comment stripping; a '/*' inside a string can blank code up to the next '*/'. A tokenizer if it bites.
const stripScript = (s) => s.replace(/\/\*[\s\S]*?\*\/|(?<![:\\'"`\w])\/\/[^\n]*/g, blank);
// Keep only the regions to check, blanking the rest so line numbers stay true.
function regions(text, file) {
  const none = blank(text);
  if (/\.(css|scss|less)$/.test(file)) return { template: none, script: none, css: stripCss(text) };
  if (/\.[cm]?[jt]sx?$/.test(file)) return { template: none, script: stripScript(text), css: none };
  if (/\.(json|webmanifest)$/.test(file)) return { template: none, script: none, css: none };
  // A snippet (no <template>, <script> or <style> block) is all template.
  if (!/\.vue$/.test(file) || !/<(?:template|script|style)\b/.test(text)) return { template: text.replace(/<!--[\s\S]*?-->/g, blank), script: none, css: none };
  let template = none, script = none, css = none;
  const tpl = text.match(/<template\b[^>]*>[\s\S]*<\/template>/);
  if (tpl) template = blank(text.slice(0, tpl.index)) + tpl[0].replace(/<!--[\s\S]*?-->/g, blank) + blank(text.slice(tpl.index + tpl[0].length));
  const put = (into, re, clean) => { for (const m of text.matchAll(re)) { const start = m.index + m[0].indexOf(m[1]); into = into.slice(0, start) + clean(m[1]) + into.slice(start + m[1].length); } return into; };
  script = put(script, /<script\b[^>]*>([\s\S]*?)<\/script>/g, stripScript);
  css = put(css, /<style\b[^>]*>([\s\S]*?)<\/style>/g, stripCss);
  return { template, script, css };
}
// @theme blocks, braces matched (Tailwind allows @keyframes inside them).
function themeBlocks(css) {
  const out = [];
  for (const m of css.matchAll(/@theme\b[^{;]*\{/g)) {
    let depth = 1, i = m.index + m[0].length;
    for (; i < css.length && depth; i++) depth += css[i] === '{' ? 1 : css[i] === '}' ? -1 : 0;
    out.push([m.index + m[0].length, css.slice(m.index + m[0].length, i - 1)]);
  }
  return out;
}
const THEME_DECL = /(--(?:color-[a-z][a-z0-9-]*-\d{2,3}|color-primary[\w-]*|font-sans))\s*:\s*([^;]+);/g;
let ours;
// Our theme's own @theme declarations: an app that pastes ais-theme.css (packages/design/styles.css) keeps them.
const ourTheme = () => ours ??= new Map(themeBlocks(stripCss(fs.readFileSync(path.join(ROOT, 'packages/design/styles.css'), 'utf8'))).flatMap(([, body]) => [...body.matchAll(THEME_DECL)].map((d) => [d[1], norm(d[2])])));

export function audit(text, file = '') {
  const findings = [], { template, script, css } = regions(text, file);
  const style = css.replace(/^[ \t]*--[\w-]+\s*:[^;]*;/gm, blank);
  const add = (rule, m, fix, source, at = m.index, value = m[0]) => findings.push({ file, line: source.slice(0, at).split('\n').length, rule, value: value.length > 80 ? value.slice(0, 77) + '…' : value, fix });
  for (const [rule, pattern, fix] of TEMPLATE) for (const m of template.matchAll(pattern)) add(rule, m, fix, template);
  for (const [rule, pattern, fix] of STYLE) for (const m of style.matchAll(pattern)) add(rule, m, fix, style);
  for (const [tag, allowed] of [['Badge', BADGE], ['Button', BUTTON]]) for (const m of template.matchAll(new RegExp(`<${tag}\\b[^>]*\\bvariant="([a-z-]+)"`, 'g'))) if (!allowed.includes(m[1])) add('non-stock-variant', m, `${tag} variants are stock only: ${allowed.join(', ')}.`, template);

  // Imports and plugins: script imports, require() and dynamic import(), CSS @import/@plugin.
  for (const [source, re] of [[script, /\b(?:from|import|require)\s*\(?\s*(['"])([^'"\n]+)\1/g], [css, /@(?:import|plugin|reference)\s+(?:url\(\s*)?(['"])([^'"\n]+)\1/g]])
    for (const m of source.matchAll(re)) { const hit = legacyPackage(m[2]); if (hit) add(hit[0], m, hit[1], source, m.index, m[2]); }
  for (const [rule, pattern, fix] of SCRIPT) for (const m of script.matchAll(pattern)) add(rule, m, fix, script);
  for (const source of [template, script]) for (const m of source.matchAll(ICON_CLASS)) add('foreign-icons', m, `Use a Lucide icon from @lucide/vue: ${ICONS}.`, source);
  for (const source of [template, script, css]) for (const m of source.matchAll(PRIME_VAR)) add('foreign-theme', m, `No PrimeVue variables: use our tokens, ${PRIMEVUE}.`, source);
  for (const [source, pattern] of [[css, DEEP], [css, IMPORTANT], [template, IMPORTANT]]) for (const m of source.matchAll(pattern)) add('foreign-theme', m, OVERRIDE_FIX, source);
  for (const [start, body] of themeBlocks(css)) for (const d of body.matchAll(THEME_DECL)) if (ourTheme().get(d[1]) !== norm(d[2])) add('foreign-theme', d, `Colour scales, primary and font come from our theme, not the app's @theme: design_code kind=tailwind.`, css, start + d.index, d[0]);

  // Brand names: template text, index.html and other pages, and string literals (not keys) of i18n files and manifests.
  const i18n = /\.webmanifest$/.test(file) || (/i18n|locales?/i.test(file) && /\.(?:[cm]?[jt]s|json)$/.test(file));
  for (const m of template.matchAll(BRAND)) add('brand-name', m, brandFix(m[0]), template);
  if (i18n) {
    const source = /\.(json|webmanifest)$/.test(file) ? text : script;
    for (const s of source.matchAll(/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/g)) {
      if (/^\s*:/.test(source.slice(s.index + s[0].length, s.index + s[0].length + 20))) continue;
      for (const m of s[0].matchAll(BRAND)) add('brand-name', m, brandFix(m[0]), source, s.index + m.index);
    }
  }

  if (path.basename(file) === 'package.json') {
    let pkg;
    try { pkg = JSON.parse(text); } catch { pkg = {}; }
    for (const section of ['dependencies', 'devDependencies']) for (const name of Object.keys(pkg[section] ?? {})) {
      const hit = legacyPackage(name);
      if (hit) add(hit[0], null, hit[1], text, text.indexOf(`"${name}"`, text.indexOf(`"${section}"`)), name);
    }
  }
  return findings.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
}

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const IMAGE = /\.(svg|png|ico|webp)$/i;
// { sha256: path under guide/public } for every logo, app-icon and favicon file the guide publishes, and every SVG it
// publishes: an app's brand folder may hold the guide's hex art or patterns, unchanged.
export function officialLogos(dir = path.join(ROOT, 'guide/public')) {
  const map = {};
  for (const f of fs.readdirSync(dir, { recursive: true }).map((f) => f.split(path.sep).join('/')).filter((f) => /^logos\/.+/.test(f) ? IMAGE.test(f) : /\.svg$/i.test(f)).sort()) map[sha256(fs.readFileSync(path.join(dir, f)))] ??= f;
  return map;
}
// A logo-named image (by its path inside the audited folder) whose bytes are not an official file.
export function auditLogo(bytes, file, rel = path.basename(file), official = JSON.parse(fs.readFileSync(path.join(HERE, 'official-logos.json'), 'utf8'))) {
  if (!IMAGE.test(rel) || !LOGO_NAME.test(rel) || official[sha256(bytes)]) return [];
  const kind = /favicon|apple-touch|android-chrome|mstile|safari-pinned-tab|maskable|icon-\d+/.test(rel) ? 'favicon' : 'logo';
  return [{ file, line: 1, rule: 'logo-file', value: rel, fix: `Use the official file, unchanged, not a redrawn one: design_assets kind=${kind}.` }];
}

// Same value written differently: hex case and shorthand, rem against px (16 px root), spacing and quotes.
const norm = (v) => v == null ? null : String(v).toLowerCase().replace(/["']/g, '').replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').trim()
  .replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/g, '#$1$1$2$2$3$3').replace(/(\d*\.?\d+)rem\b/g, (_, n) => `${+n * 16}px`);
const same = (a, b) => norm(a) === norm(b);
export function diff(candidate, canonical) {
  const want = themes(canonical), got = themes(candidate), result = {};
  for (const mode of ['light', 'dark']) result[mode] = Object.entries(want[mode]).flatMap(([token, value]) => same(got[mode][token], value) ? [] : [{ token, expected: value, actual: got[mode][token] ?? null, state: token in got[mode] ? 'changed' : 'missing' }]);
  return result;
}

const SOURCE = /\.(?:vue|css|scss|less|html|[cm]?[jt]sx?|webmanifest)$/;
// Files and folders to audit. Skipped: dependencies, builds, hidden folders, our installed registry code, type stubs.
export function report(paths) {
  const files = new Map();
  const visit = (p, rel) => {
    if (fs.statSync(p).isDirectory()) {
      for (const f of fs.readdirSync(p).sort()) if (!/^(?:node_modules|dist|\..+)$/.test(f) && !/(?:^|[\\/])components[\\/](?:ui|blocks)$/.test(path.join(p, f))) visit(path.join(p, f), rel ? `${rel}/${f}` : f);
    } else if ((SOURCE.test(p) && !/\.d\.ts$/.test(p)) || path.basename(p) === 'package.json' || (/\.json$/.test(p) && /i18n|locales?/i.test(rel)) || (IMAGE.test(p) && LOGO_NAME.test(rel))) files.set(path.resolve(p), [p, rel]);
  };
  for (const p of paths) visit(p, fs.statSync(p).isDirectory() ? '' : path.basename(p));
  const findings = [...files.values()].flatMap(([p, rel]) => IMAGE.test(p) ? auditLogo(fs.readFileSync(p), p, rel) : audit(fs.readFileSync(p, 'utf8'), p));
  const family = (f) => FAMILIES.includes(f.rule) ? f.rule : 'template';
  const blocking = findings.filter((f) => !ADVISORY.has(f.rule));
  return {
    scope: 'static only: templates, styles, imports, theme overrides, brand names and logo files; runtime, keyboard and visual checks remain required',
    files: files.size,
    legacyFree: blocking.length === 0,
    families: Object.fromEntries(FAMILIES.map((name) => [name, blocking.filter((f) => family(f) === name).length])),
    counts: findings.reduce((n, f) => ({ ...n, [f.rule]: (n[f.rule] ?? 0) + 1 }), {}),
    findings,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, ...args] = process.argv.slice(2);
  if (!['audit', 'diff', 'hashes'].includes(mode) || (mode !== 'hashes' && !args.length) || (mode === 'diff' && args.length !== 1)) throw new Error('Usage: ui-contract.mjs audit <files or folders...> | diff <candidate.css> | hashes');
  if (mode === 'audit') {
    const result = report(args);
    console.log(JSON.stringify(result, null, 2));
    if (!result.legacyFree) process.exitCode = 1;
  } else if (mode === 'hashes') {
    // Rewrites official-logos.json from the guide's logo files; copy it next to the plugin's ui-contract.mjs too.
    fs.writeFileSync(path.join(HERE, 'official-logos.json'), JSON.stringify(officialLogos(), null, 2) + '\n');
  } else {
    const differences = diff(fs.readFileSync(args[0], 'utf8'), fs.readFileSync(path.join(ROOT, 'packages/design/styles.css'), 'utf8'));
    console.log(JSON.stringify({ differences }, null, 2));
    if (Object.values(differences).some((list) => list.length)) process.exitCode = 1;
  }
}
