// Bounded static checks, not a replacement for keyboard, accessibility or visual testing.
// The audit reads only what renders: a .vue file's <template> (comments removed) and <style>, or a whole .css file.
// Script code and comments (canvas colours, chart data, arrows in notes) are out of scope. Rules come from the
// redesigned rosepetal-ui (feat/shadcn-redesign) and the product-ui references.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes } from '../packages/vue-themes/generate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PALETTE = 'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const BADGE = ['default', 'secondary', 'destructive', 'outline', 'overlay'];
const BUTTON = ['default', 'outline', 'ghost', 'secondary', 'destructive', 'link', 'topbar', 'topbar-tab'];
const TEMPLATE = [
  ['raw-colour', /#[0-9a-f]{3,8}\b/ig, 'Use a semantic token from packages/design/styles.css.'],
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
const blank = (s) => s.replace(/[^\n]/g, ' ');
// Keep only the regions to check, blanking the rest so line numbers stay true.
function regions(text, file) {
  if (/\.(css|scss|less)$/.test(file)) return { template: blank(text), style: text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^\s*--[\w-]+\s*:[^;]*;/gm, blank) };
  // A snippet (no <template>, <script> or <style> block) is all template.
  if (!/\.vue$/.test(file) || !/<(?:template|script|style)\b/.test(text)) return { template: text.replace(/<!--[\s\S]*?-->/g, blank), style: blank(text) };
  let template = blank(text), style = blank(text);
  const tpl = text.match(/<template\b[^>]*>[\s\S]*<\/template>/);
  if (tpl) template = blank(text.slice(0, tpl.index)) + tpl[0].replace(/<!--[\s\S]*?-->/g, blank) + blank(text.slice(tpl.index + tpl[0].length));
  for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
    const start = m.index + m[0].indexOf(m[1]);
    style = style.slice(0, start) + m[1].replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^\s*--[\w-]+\s*:[^;]*;/gm, blank) + style.slice(start + m[1].length);
  }
  return { template, style };
}
export function audit(text, file = '') {
  const findings = [], { template, style } = regions(text, file);
  const add = (rule, m, fix, source) => findings.push({ file, line: source.slice(0, m.index).split('\n').length, rule, value: m[0].length > 80 ? m[0].slice(0, 77) + '…' : m[0], fix });
  for (const [rule, pattern, fix] of TEMPLATE) for (const m of template.matchAll(pattern)) add(rule, m, fix, template);
  for (const [rule, pattern, fix] of STYLE) for (const m of style.matchAll(pattern)) add(rule, m, fix, style);
  for (const [tag, allowed] of [['Badge', BADGE], ['Button', BUTTON]]) for (const m of template.matchAll(new RegExp(`<${tag}\\b[^>]*\\bvariant="([a-z-]+)"`, 'g'))) if (!allowed.includes(m[1])) add('non-stock-variant', m, `${tag} variants are stock only: ${allowed.join(', ')}.`, template);
  return findings.sort((a, b) => a.line - b.line || a.rule.localeCompare(b.rule));
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
const count = (findings) => findings.reduce((n, f) => ({ ...n, [f.rule]: (n[f.rule] ?? 0) + 1 }), {});
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, ...args] = process.argv.slice(2);
  if (!['audit', 'diff'].includes(mode) || !args.length || (mode === 'diff' && args.length !== 1)) throw new Error('Usage: ui-contract.mjs audit <files or folders...> | diff <candidate.css>');
  if (mode === 'audit') {
    const skip = /(?:^|\/)(?:node_modules|dist|\.git|components\/ui)(?:\/|$)/;
    const walk = (p) => fs.statSync(p).isDirectory() ? fs.readdirSync(p).flatMap((f) => skip.test(path.join(p, f)) ? [] : walk(path.join(p, f))) : /\.(vue|css|html)$/.test(p) ? [p] : [];
    const files = args.flatMap(walk);
    const findings = files.flatMap((file) => audit(fs.readFileSync(file, 'utf8'), file));
    console.log(JSON.stringify({ scope: 'static only, templates and styles; runtime, keyboard and visual checks remain required', files: files.length, counts: count(findings), findings }, null, 2));
    if (findings.some((f) => f.rule !== 'small-text')) process.exitCode = 1;
  } else {
    const differences = diff(fs.readFileSync(args[0], 'utf8'), fs.readFileSync(path.join(ROOT, 'packages/design/styles.css'), 'utf8'));
    console.log(JSON.stringify({ differences }, null, 2));
    if (Object.values(differences).some((list) => list.length)) process.exitCode = 1;
  }
}
