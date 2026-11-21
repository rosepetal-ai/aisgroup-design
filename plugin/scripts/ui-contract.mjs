// Bounded static checks, not a replacement for keyboard, accessibility or visual testing.
// The template rules read only what renders: a .vue file's <template> (comments removed) and <style>, or a whole .css
// file; script code and comments (canvas colours, chart data, arrows in notes) are out of their scope. Rules come from
// the redesigned rosepetal-ui (feat/shadcn-redesign) and the product-ui references; the table is ui-rules.mjs.
// The legacy families prove an app was fully moved onto our components, icons and theme: foreign UI kits and icon sets
// (imports, classes, package.json), foreign themes and overrides, misspelt brand names and redrawn logo files.
// Modes: audit (files or folders, optionally against a baseline), hook and stop (Claude Code plugin hooks), diff, hashes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { themes } from '../packages/vue-themes/generate.mjs';
import { RULES, VARIANTS, FAMILIES, familyOf, isError, row, say } from './ui-rules.mjs';

export { FAMILIES };
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

// Page composition: how a page is put together (guide «Pages»), read from the template's element tree. A box is a Card
// (ours, PrimeVue's or Vuetify's), an outline Item, or an element with a full border and a corner; avatars, dots, chips
// and inline code are not boxes.
const PAGE = (rule) => row('tree', rule).fix;
// Middle dots joining labels in UI strings: every script string literal (`.join(' · ')`, labels) and i18n JSON values.
const STRING = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/g;
function joinedLists(source, add) {
  const r = row('strings', 'separator');
  for (const s of source.matchAll(STRING)) for (const m of s[0].matchAll(r.match)) add(r.rule, m, r.fix, source, s.index + m.index);
}
const CARD_TAG = /^(?:Card|Panel|Fieldset|VCard|v-card)$/;
const NOT_BOX = /^(?:span|code|kbd|img|i|svg|input|textarea|select|option|td|th|tr|TableCell|TableHead|TableRow|Skeleton|Badge|Avatar|Input|Textarea|Kbd|Button|Toggle)$/;
const isBox = (tag, attrs) => {
  const cls = attrs.match(/(?:^|\s)class="([^"]*)"/)?.[1] ?? '';
  // A Card stripped of its border (a panel inside a popover) is no box.
  if (/(?<![\w:-])border-(?:0|none)\b/.test(cls)) return '';
  if (CARD_TAG.test(tag) || (tag === 'Item' && /\bvariant="outline"/.test(attrs))) return 'card';
  return !NOT_BOX.test(tag) && /(?<![\w:-])border(?![\w-])/.test(cls) && /(?<![\w:-])rounded(?:-(?!full\b|none\b)[\w-]+)?(?![\w-])/.test(cls) && !/(?<![\w:-])size-\d/.test(cls) ? 'class' : '';
};
const TAG = /<(\/?)([A-Za-z][\w.:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g, VOID = /^(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
const TABLE = /^(?:Table|table|DataTable|data-table)$/, flat = (s) => s.replace(/\s+/g, ' ');
// A tile: a big figure with its label (two or more text elements), and nothing that makes it a system's card.
const FIGURE = /\bclass="[^"]*\btext-(?:2xl|3xl|4xl|5xl|6xl)\b/, TEXT = /<(?:p|span|div|dt|dd|h[1-6]|label|small|CardTitle|CardDescription)\b/g, RICH = /<(?:Progress|Table|DataTable|table|Chart\w*|Vis\w+|ul|ol|dl|Item|Button|Collapsible)\b|\bdivide-y\b/;
// An icon alone in a tinted, centred tile, with a page or section title right after it.
const TILE = /<(div|span)\b[^>]*\bclass="(?=[^"]*\bbg-(?!transparent\b)[\w/-]+)(?=[^"]*\bjustify-center\b)[^"]*"[^>]*>\s*<(?:i|[A-Z]\w*Icon|component|svg)\b(?:"[^"]*"|'[^']*'|[^'">])*?(?:\/>|>\s*<\/(?:i|component|svg)>)\s*<\/\1>/g;
function pageComposition(template, add) {
  const stack = [];
  for (const m of template.matchAll(TAG)) {
    const [whole, closing, tag, attrs] = m;
    if (closing) {
      const at = stack.findLastIndex((e) => e.tag === tag);
      if (at < 0) continue;
      for (const e of stack.splice(at)) if (e.box && e.tag === tag) {
        const inner = template.slice(e.end, m.index);
        if (FIGURE.test(inner) && !RICH.test(inner) && (inner.match(TEXT) ?? []).length >= 2) add('kpi-tile', e.m, PAGE('kpi-tile'), template, e.m.index, flat(e.m[0]));
      }
      continue;
    }
    const box = isBox(tag, attrs), outer = stack.findLast((e) => e.box);
    if (box && outer) add('nested-box', m, PAGE('nested-box'), template, m.index, flat(whole));
    if (TABLE.test(tag) && outer?.box === 'class' && !outer.table) { outer.table = true; add('table-box', outer.m, PAGE('table-box'), template, outer.m.index, flat(outer.m[0])); }
    if (tag !== 'Empty' && !NOT_BOX.test(tag) && /(?:^|\s)class="[^"]*\bborder-dashed\b/.test(attrs)) add('dashed-box', m, PAGE('dashed-box'), template, m.index, flat(whole));
    if (!/\/\s*$/.test(attrs) && !VOID.test(tag)) stack.push({ tag, box, m, end: m.index + whole.length });
  }
  for (const m of template.matchAll(TILE)) if (/<h[12]\b/.test(template.slice(m.index + m[0].length, m.index + m[0].length + 300))) add('title-icon-tile', m, PAGE('title-icon-tile'), template, m.index, flat(m[0]));
}

// Capitals and letter-spacing in class and style attributes, and in CSS. Keyboard keys, menu shortcuts and code keep
// their own style.
const KEYS = /^(?:kbd|Kbd\w*|\w*Shortcut|code)$/;
function capitals(template, style, add) {
  const cls = row('class', 'caps'), css = row('style-attr', 'caps');
  for (const m of template.matchAll(TAG)) {
    if (m[1] || KEYS.test(m[2])) continue;
    for (const a of m[3].matchAll(/(?:^|\s)(?::|v-bind:)?class="([^"]*)"|(?:^|\s)style="([^"]*)"/g)) {
      const at = m.index + m[0].indexOf(a[0]) + a[0].indexOf('"') + 1;
      for (const c of (a[1] ?? '').matchAll(cls.match)) add('caps', c, cls.fix, template, at + c.index);
      for (const c of (a[2] ?? '').matchAll(css.match)) add('caps', c, css.fix, template, at + c.index);
    }
  }
  for (const c of style.matchAll(css.match)) add('caps', c, css.fix, style);
}

// Legacy packages: the first package row whose pattern names the package.
function legacyPackage(name) {
  const r = RULES.find((r) => r.by === 'package' && r.match.test(name));
  if (r) return [r.rule, say(r, name)];
}
const BRAND = row('text', 'brand-name'), LOGO_NAME = row('file', 'logo-file').match, THEME_DECL = row('theme').match;

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
let ours;
// Our theme's own @theme declarations: an app that pastes ais-theme.css (packages/design/styles.css) keeps them.
const ourTheme = () => ours ??= new Map(themeBlocks(stripCss(fs.readFileSync(path.join(ROOT, 'packages/design/styles.css'), 'utf8'))).flatMap(([, body]) => [...body.matchAll(THEME_DECL)].map((d) => [d[1], norm(d[2])])));

// The package's components as an app installs them: the guide's shadcn-vue registry, mirrored in the plugin
// (plugin/brand/registry in the repo, brand/registry in an installed plugin). Keyed by the path an app gets.
let installed;
const installedFiles = () => installed ??= new Map([path.join(ROOT, 'plugin/brand/registry'), path.join(ROOT, 'brand/registry')].filter((d) => fs.existsSync(d)).slice(0, 1)
  .flatMap((dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).flatMap((f) => {
    const item = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    return (item.files ?? []).filter((x) => typeof x.content === 'string').map((x) => [x.path, { name: item.name, content: x.content }]);
  })));
const sameText = (a, b) => { const n = (s) => s.replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '').trim(); return n(a) === n(b); };
// The path of a stock copy inside an app (components/ui/… or components/blocks/…), or null.
const stockPath = (file) => file.split(path.sep).join('/').match(/(?:^|\/)(components\/(?:ui|blocks)\/.+)$/)?.[1] ?? null;

export function audit(text, file = '') {
  const findings = [], { template, script, css } = regions(text, file);
  const style = css.replace(/^[ \t]*--[\w-]+\s*:[^;]*;/gm, blank);
  const add = (rule, m, fix, source, at = m.index, value = m[0]) => findings.push({ file, line: source.slice(0, at).split('\n').length, rule, value: value.length > 80 ? value.slice(0, 77) + '…' : value, fix });
  // Every regex row of the table, on the regions it reads.
  const source = { template, style, css, script };
  for (const r of RULES) if (r.in) for (const where of r.in) for (const m of source[where].matchAll(r.match)) add(r.rule, m, r.fix, source[where]);
  const variant = row('variants');
  for (const [tag, allowed] of Object.entries(VARIANTS)) for (const m of template.matchAll(new RegExp(`<${tag}\\b[^>]*\\bvariant="([a-z-]+)"`, 'g'))) if (!allowed.includes(m[1])) add(variant.rule, m, say(variant, tag), template);
  pageComposition(template, add);
  capitals(template, style, add);

  // Imports and plugins: script imports, require() and dynamic import(), CSS @import/@plugin.
  for (const [source, re] of [[script, /\b(?:from|import|require)\s*\(?\s*(['"])([^'"\n]+)\1/g], [css, /@(?:import|plugin|reference)\s+(?:url\(\s*)?(['"])([^'"\n]+)\1/g]])
    for (const m of source.matchAll(re)) { const hit = legacyPackage(m[2]); if (hit) add(hit[0], m, hit[1], source, m.index, m[2]); }
  const theme = row('theme');
  for (const [start, body] of themeBlocks(css)) for (const d of body.matchAll(THEME_DECL)) if (ourTheme().get(d[1]) !== norm(d[2])) add(theme.rule, d, theme.fix, css, start + d.index, d[0]);

  // Brand names: template text, index.html and other pages, and string literals (not keys) of i18n files and manifests.
  const i18n = /\.webmanifest$/.test(file) || (/i18n|locales?/i.test(file) && /\.(?:[cm]?[jt]s|json)$/.test(file));
  for (const m of template.matchAll(BRAND.match)) add(BRAND.rule, m, say(BRAND, m[0]), template);
  joinedLists(/\.(json|webmanifest)$/.test(file) ? (i18n ? text : '') : script, add);
  if (i18n) {
    const source = /\.(json|webmanifest)$/.test(file) ? text : script;
    for (const s of source.matchAll(STRING)) {
      if (/^\s*:/.test(source.slice(s.index + s[0].length, s.index + s[0].length + 20))) continue;
      for (const m of s[0].matchAll(BRAND.match)) add(BRAND.rule, m, say(BRAND, m[0]), source, s.index + m.index);
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
  const stock = stockPath(file) && installedFiles().get(stockPath(file));
  if (stock && !sameText(stock.content, text)) { const r = row('copy'); add(r.rule, null, say(r, stock.name), text, 0, stockPath(file)); }
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
  const kind = /favicon|apple-touch|android-chrome|mstile|safari-pinned-tab|maskable|icon-\d+/.test(rel) ? 'favicon' : 'logo', r = row('file', 'logo-file');
  return [{ file, line: 1, rule: r.rule, value: rel, fix: say(r, kind) }];
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
const perFamily = (findings) => Object.fromEntries(FAMILIES.map((name) => [name, findings.filter((f) => familyOf(f.rule) === name).length]));
// Files and folders to audit. Skipped: dependencies, builds, hidden folders, our installed registry code, type stubs.
export function report(paths) {
  const files = new Map();
  const visit = (p, rel) => {
    if (fs.statSync(p).isDirectory()) {
      for (const f of fs.readdirSync(p).sort()) if (!/^(?:node_modules|dist|\..+)$/.test(f)) visit(path.join(p, f), rel ? `${rel}/${f}` : f);
    } else if ((SOURCE.test(p) && !/\.d\.ts$/.test(p)) || path.basename(p) === 'package.json' || (/\.json$/.test(p) && /i18n|locales?/i.test(rel)) || (IMAGE.test(p) && LOGO_NAME.test(rel))) files.set(path.resolve(p), [p, rel]);
  };
  for (const p of paths) visit(p, fs.statSync(p).isDirectory() ? '' : path.basename(p));
  // The package's own components (components/ui, components/blocks) may do what the rules forbid an app: there only
  // the stale-copy check applies.
  const findings = [...files.values()].flatMap(([p, rel]) => IMAGE.test(p) ? auditLogo(fs.readFileSync(p), p, rel)
    : audit(fs.readFileSync(p, 'utf8'), p).filter((f) => !stockPath(p) || f.rule === row('copy').rule));
  const blocking = findings.filter((f) => isError(f.rule));
  return {
    scope: 'static only: templates, styles, imports, theme overrides, brand names and logo files; runtime, keyboard and visual checks remain required',
    files: files.size,
    legacyFree: blocking.length === 0,
    families: perFamily(blocking),
    counts: findings.reduce((n, f) => ({ ...n, [f.rule]: (n[f.rule] ?? 0) + 1 }), {}),
    findings,
  };
}

// Baseline: the error findings of an app at one moment, so the audit can gate a legacy app at once and fail only on new
// findings. A key survives line shifts: rule, file (relative to the baseline's folder) and a hash of the matched text;
// its count lets the same text appear as often as it did, not more.
const keyOf = (f, dir, from) => `${f.rule} ${path.relative(dir, path.resolve(from, f.file)).split(path.sep).join('/')} ${sha256(f.rule === 'logo-file' ? '' : f.value).slice(0, 12)}`;
export function baseline(findings, file, from = process.cwd()) {
  const dir = path.dirname(path.resolve(from, file)), errors = findings.filter((f) => isError(f.rule));
  if (!fs.existsSync(path.resolve(from, file))) {
    const counts = {};
    for (const f of errors) { const k = keyOf(f, dir, from); counts[k] = (counts[k] ?? 0) + 1; }
    fs.writeFileSync(path.resolve(from, file), JSON.stringify({ version: 1, note: 'ui-contract.mjs audit --baseline: findings known when it was written. Later audits fail only on new ones; delete the file to write it again.', findings: Object.fromEntries(Object.entries(counts).sort()) }, null, 1) + '\n');
    return { written: true, known: errors.length, fixed: 0, new: [], remaining: perFamily(errors) };
  }
  const left = { ...JSON.parse(fs.readFileSync(path.resolve(from, file), 'utf8')).findings }, fresh = [], still = [];
  for (const f of errors) { const k = keyOf(f, dir, from); if (left[k] > 0) { left[k]--; still.push(f); } else fresh.push(f); }
  return { written: false, known: still.length, fixed: Object.values(left).reduce((a, b) => a + b, 0), new: fresh, remaining: perFamily(still) };
}
const familyLine = (counts) => Object.entries(counts).filter(([, n]) => n).map(([name, n]) => `${name} ${n}`).join(', ') || 'none';

// Plugin hooks (hooks/hooks.json): only the files of a Vue app are audited. Its folder holds the nearest package.json,
// which lists vue and not astro (the guide and the sites are Astro). Our components' own source is skipped, as in
// report(): an app's components/ui and components/blocks, and the package's ui and blocks.
const HOOKED = (f) => /\.(?:vue|css|scss|less)$/.test(f) || (/i18n|locales?/i.test(f) && /\.(?:json|[cm]?[jt]s)$/.test(f) && !/\.d\.ts$/.test(f));
const apps = new Map();
export function vueApp(file) {
  for (let dir = path.dirname(file); ; dir = path.dirname(dir)) {
    if (!apps.has(dir) && fs.existsSync(path.join(dir, 'package.json'))) {
      let pkg = {};
      try { pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')); } catch {}
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      apps.set(dir, 'vue' in deps && !('astro' in deps) ? pkg.name ?? '' : null);
    }
    if (apps.has(dir)) {
      const name = apps.get(dir), rel = path.relative(dir, file).split(path.sep).join('/');
      if (name == null || /(?:^|\/)(?:node_modules|dist|\.[^/]+)\/|(?:^|\/)components\/(?:ui|blocks)\//.test(rel) || (name === '@aisgroup/design' && /^(?:ui|blocks)\//.test(rel))) return null;
      return dir;
    }
    if (path.dirname(dir) === dir) return null;
  }
}
// Error findings of the given files of one app, less those its .ui-baseline.json (beside package.json) already knows.
function gate(app, files) {
  const findings = files.flatMap((f) => audit(fs.readFileSync(f, 'utf8'), path.relative(app, f).split(path.sep).join('/'))).filter((f) => isError(f.rule));
  return fs.existsSync(path.join(app, '.ui-baseline.json')) ? baseline(findings, '.ui-baseline.json', app).new : findings;
}
const listing = (findings, max = 40) => findings.slice(0, max).map((f) => `${f.file}:${f.line} ${f.rule}: ${f.value}\n  Fix: ${f.fix}`).join('\n') + (findings.length > max ? `\n…and ${findings.length - max} more: node ${path.join(HERE, 'ui-contract.mjs')} audit <these files>.` : '');
const readInput = () => { try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; } };

// The files a session edited, by agent ('main' or the subagent's id), so the stop gate holds an agent only on its own
// work, never on someone else's edits in a shared checkout. One small JSON file per session in the temp folder.
const LEDGERS = path.join(os.tmpdir(), 'ais-ui-hooks');
const ledgerFile = (session) => path.join(LEDGERS, `${String(session).replace(/[^\w-]/g, '_')}.json`);
function remember(input, file) {
  if (!input.session_id) return;
  try {
    fs.mkdirSync(LEDGERS, { recursive: true });
    const at = ledgerFile(input.session_id), ledger = fs.existsSync(at) ? JSON.parse(fs.readFileSync(at, 'utf8')) : {}, key = input.agent_id ?? 'main';
    ledger[key] = [...new Set([...(ledger[key] ?? []), file])];
    fs.writeFileSync(at, JSON.stringify(ledger));
  } catch {}
}
// A subagent's own files; for the main agent, everything edited in the session. null without a session id.
function edited(input) {
  if (!input.session_id) return null;
  try {
    const ledger = JSON.parse(fs.readFileSync(ledgerFile(input.session_id), 'utf8'));
    return input.agent_id ? ledger[input.agent_id] ?? [] : Object.values(ledger).flat();
  } catch { return []; }
}

// PostToolUse on Edit, Write and MultiEdit: the edited file only. Exit 2 shows the findings to the agent.
export function hook(input) {
  const target = input.tool_input?.file_path;
  if (!target || !HOOKED(target)) return 0;
  const file = path.resolve(input.cwd ?? process.cwd(), target), app = fs.existsSync(file) && vueApp(file);
  if (!app) return 0;
  remember(input, file);
  const found = gate(app, [file]);
  if (!found.length) return 0;
  process.stderr.write(`AIS Group design rules: ${found.length} finding${found.length > 1 ? 's' : ''} in the file you just edited (${path.relative(input.cwd ?? process.cwd(), file)}). Fix ${found.length > 1 ? 'them' : 'it'} now; each line names the fix.\n${listing(found)}\n`);
  return 2;
}

// Changed files of the git working tree, for a stop with no session id (a manual run).
function workingTree(cwd) {
  let top, status;
  try {
    top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    status = execFileSync('git', ['status', '--porcelain', '-z', '--untracked-files=all'], { cwd: top, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 });
  } catch { return []; }
  const changed = [], parts = status.split('\0');
  // Each entry is «XY path»; a rename or copy is followed by its old path.
  for (let i = 0; i < parts.length; i++) if (parts[i]) { changed.push(path.join(top, parts[i].slice(3))); if (/[RC]/.test(parts[i].slice(0, 2))) i++; }
  return changed;
}

// Stop and SubagentStop: the files this session (or this subagent) edited, or without a session id every changed file
// of the git working tree. Exit 2 keeps the agent working while error findings remain; once it is already continuing
// because of a stop hook (stop_hook_active), it may stop, so it never loops.
export function stop(input) {
  if (input.stop_hook_active) return 0;
  const cwd = input.cwd ?? process.cwd();
  const changed = edited(input) ?? workingTree(cwd);
  const byApp = new Map();
  for (const f of changed) if (HOOKED(f) && fs.existsSync(f) && fs.statSync(f).isFile()) { const app = vueApp(f); if (app) byApp.set(app, [...byApp.get(app) ?? [], f]); }
  const found = [...byApp].flatMap(([app, files]) => gate(app, files).map((f) => ({ ...f, file: path.relative(cwd, path.join(app, f.file)) })));
  if (!found.length) return 0;
  const files = new Set(found.map((f) => f.file)).size;
  process.stderr.write(`AIS Group design rules: ${found.length} finding${found.length > 1 ? 's' : ''} remain in ${files} changed file${files > 1 ? 's' : ''} of this Vue app. Fix them before you finish; each line names the fix. If one is a false positive, say so in your reply instead of working around the rule.\n${listing(found)}\n`);
  return 2;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, ...args] = process.argv.slice(2);
  const at = args.indexOf('--baseline'), base = at >= 0 ? args.splice(at, 2)[1] : null;
  if (!['audit', 'diff', 'hashes', 'hook', 'stop'].includes(mode) || (mode === 'audit' && (!args.length || (at >= 0 && !base))) || (mode === 'diff' && args.length !== 1)) throw new Error('Usage: ui-contract.mjs audit [--baseline <file>] <files or folders...> | hook | stop | diff <candidate.css> | hashes');
  if (mode === 'hook' || mode === 'stop') process.exitCode = (mode === 'hook' ? hook : stop)(readInput());
  else if (mode === 'audit') {
    const result = report(args);
    if (base) {
      const b = baseline(result.findings, base);
      console.log(JSON.stringify({ ...result, baseline: { file: base, written: b.written, known: b.known, fixed: b.fixed, new: b.new.length, remaining: b.remaining }, findings: b.new }, null, 2));
      console.error(b.written ? `Baseline written to ${base}: ${b.known} findings (${familyLine(b.remaining)}). Later audits fail only on new ones.` : `Baseline ${base}: ${b.new.length} new findings; ${b.known} known remain (${familyLine(b.remaining)}); ${b.fixed} fixed since it was written.`);
      if (b.new.length) process.exitCode = 1;
    } else {
      console.log(JSON.stringify(result, null, 2));
      if (!result.legacyFree) process.exitCode = 1;
    }
  } else if (mode === 'hashes') {
    // Rewrites official-logos.json from the guide's logo files; copy it next to the plugin's ui-contract.mjs too.
    fs.writeFileSync(path.join(HERE, 'official-logos.json'), JSON.stringify(officialLogos(), null, 2) + '\n');
  } else {
    const differences = diff(fs.readFileSync(args[0], 'utf8'), fs.readFileSync(path.join(ROOT, 'packages/design/styles.css'), 'utf8'));
    console.log(JSON.stringify({ differences }, null, 2));
    if (Object.values(differences).some((list) => list.length)) process.exitCode = 1;
  }
}
