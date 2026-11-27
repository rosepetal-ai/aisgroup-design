// The static product-UI rules, in one table. ui-contract.mjs reads it for the audit, the agent hooks and the baseline.
// A row: rule (the finding's name; a rule may have several rows, one per region or pattern), ledger (its id in
// plugin/evals/rules-ledger.json, null for rules written after the ledger), severity (error fails the audit, the hooks
// and the stop gate; check is a candidate to look at), the matcher and fix (what to do, and the guide page or
// design-MCP call that gives it).
// Matchers: `in` lists the regions a regex reads (template: rendered markup; style: CSS rules without custom property
// definitions; css: all CSS; script: script code). `by` names the matcher in ui-contract.mjs that uses the row: tree
// (the element tree), class and style-attr (attributes), strings (script and i18n strings), text (template text and
// i18n values), package (imports and package.json), theme (@theme blocks), variants, file (logo-named images).
// Fixes name the design MCP call, since the app being audited has none of our repo paths.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The package's own variants, read from its cva definition: a variant the package adds is stock at once.
export function cvaVariants(component, root = ROOT) {
  const src = fs.readFileSync(path.join(root, `packages/design/ui/${component}/index.ts`), 'utf8');
  let i = src.indexOf('{', src.search(/\bvariant\s*:\s*\{/)), depth = 0;
  const start = i;
  do depth += src[i] === '{' ? 1 : src[i] === '}' ? -1 : 0; while (depth && ++i < src.length);
  return [...src.slice(start + 1, i).matchAll(/^\s*(?:'([\w-]+)'|"([\w-]+)"|([\w-]+))\s*:/gm)].map((m) => m[1] ?? m[2] ?? m[3]);
}
export const VARIANTS = { Badge: cvaVariants('badge'), Button: cvaVariants('button') };

const PALETTE = 'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const USING = 'design_standards kind=guidelines section=product-ui page=using-components';
const PAGES = 'design_standards kind=guidelines section=product-ui page=pages', LAYOUT = 'design_code kind=components name=page-layout';
const TYPE = 'design_standards kind=guidelines section=design-language page=typography';
const TOKENS = 'design_code kind=tailwind', PRIMEVUE = 'design_code kind=migration name=primevue', VUETIFY = 'design_code kind=migration name=vuetify', ICONS = 'design_code kind=migration name=icons';
const component = (name) => `design_code kind=components name=${name}`;
// Ledger ids: where the guide and the skills write each rule down.
const L = {
  colour: 'AIS-08f601f803ff', stock: 'AIS-e09671d75dea', status: 'AIS-754481f2b70d', text: 'AIS-e0c846b31642', heading: 'AIS-62901396e59e',
  loading: 'AIS-fea18600db03', dialog: 'AIS-8506608482d9', facts: 'AIS-cf9753176b55', components: 'AIS-0dd2942d71e6', icons: 'AIS-f7c4414ce87e',
  theme: 'AIS-69965e7fbbdb', names: 'AIS-33f40c00878e', logos: 'AIS-931ebca731e3',
};
const OVERRIDE_FIX = 'No overrides of component internals: use its props and variants, design_code kind=components.';
const brandFix = (v) => `Write «${/automation/i.test(v) ? 'AIS Vision Automation' : /scanology/i.test(v) ? 'AIS Scanology' : /rose/i.test(v) ? 'Rosepetal' : /vision/i.test(v) ? 'AIS Vision Systems' : 'AIS Group'}»: design_standards kind=guidelines section=brand-guidelines page=brands.`;
const CAPS_FIX = `Sentence case, no letter-spacing (guide Typography, Keep it simple): ${TYPE}.`;

export const RULES = [
  // Templates: what renders.
  // <meta name="theme-color" content="#…"> needs a literal colour.
  { rule: 'raw-colour', ledger: L.colour, in: ['template'], match: /(?<!\bcontent=")#[0-9a-f]{3,8}\b/ig, fix: `Use a semantic token (bg-primary, text-muted-foreground, border-border…), never a literal colour: ${TOKENS}.` },
  { rule: 'stock-palette', ledger: L.colour, in: ['template'], match: new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline)-(?:${PALETTE})-\\d{2,3}\\b`, 'g'), fix: `Use the AIS semantic role instead of a stock palette class: ${TOKENS}.` },
  { rule: 'named-colour', ledger: L.colour, in: ['template'], match: new RegExp(`\\bcolor="(?:${PALETTE}|grey|black|white|brown)(?:[- ][a-z0-9-]+)?"`, 'g'), fix: 'PrimeVue/Vuetify: use the theme roles (primary, secondary, error…) from the AIS preset, not a named colour: design_code kind=primevue or kind=vuetify.' },
  // Styled components keep the package's corners. Skeletons take their content's shape, Field rows and hand-made
  // surfaces may set rounded-md/lg, top-bar buttons are round by design, and rounded-[inherit] follows the parent.
  { rule: 'radius-override', ledger: L.stock, in: ['template'], match: /<(?:Button|Badge|Card|Input|Textarea|SelectTrigger|Alert|DialogContent|PopoverContent|DropdownMenuContent|TabsList|TabsTrigger|Toggle|Avatar)\b(?![^>]*variant="topbar)[^>]*\bclass="[^"]*\brounded-(?:sm|lg|xl|2xl|3xl|full)\b/g, fix: `Never override a component's radius; the package sets it: drop the rounded class. ${USING}.` },
  { rule: 'arbitrary-radius', ledger: L.stock, in: ['template'], match: /\brounded-\[(?!inherit\])[^\]]+\]/g, fix: `Use the radius tokens (rounded-md, rounded-lg…), not an arbitrary value: ${TOKENS}.` },
  { rule: 'heading-weight', ledger: L.heading, in: ['template'], match: /<(?:h[1-6]|[A-Z][A-Za-z]*Title|TableHead|Label|FieldLabel|FieldLegend)\b[^>]*\bclass="[^"]*\bfont-(?:bold|semibold|extrabold)\b/g, fix: `Headings and labels are font-medium; never bold or semibold: ${TYPE}.` },
  { rule: 'tinted-status', ledger: L.status, in: ['template'], match: /\bbg-(?:success|destructive|warning|info)\/\d+\b/g, fix: `Status is a toned icon and the word, not a tinted background: ${USING}.` },
  { rule: 'veil', ledger: L.loading, in: ['template'], match: /\babsolute\b[^"]*\binset-0\b[^"]*\bbg-(?:card|background|white|black)\/\d+/g, fix: `No veil over content: Skeleton, Spinner in the working button, or Empty with Spinner: ${USING}.` },
  { rule: 'pill-tabs', ledger: null, in: ['template'], match: /<TabsList\b(?![^>]*variant="(?:line|nav)")[^>]*>/g, fix: `Tabs are TabsList variant="line", or variant="nav" for a side menu: ${component('tabs')}.` },
  { rule: 'modal-button-icon', ledger: L.dialog, in: ['template'], match: /<Button\b[^>]*\bsize="modal"[^>]*>(?:(?!<\/Button>)[\s\S])*?<[A-Z]\w*Icon\b/g, fix: `Dialog footer buttons carry text only; a Spinner inside while the action runs: ${component('dialog')}.` },
  { rule: 'outside-blocked', ledger: null, in: ['template'], match: /@(?:interact|pointer-down)-outside(?:\.prevent\b|="(?:\(?\w*(?::\s*\w+)?\)?\s*=>\s*)?\w+\.preventDefault\(\)")/g, fix: `A click outside closes a dialog; block it only while its action runs: if (busy) e.preventDefault(). ${component('dialog')}.` },
  { rule: 'sign-out', ledger: null, in: ['template'], match: /<DropdownMenuItem\b[^>]*>(?:(?!<\/DropdownMenuItem>)[\s\S])*?\bSign out\b/g, fix: `The account menu says Log out: ${USING}.` },
  { rule: 'row-items-start', ledger: null, severity: 'check', in: ['template'], match: /\bgrid\b[^"]*\bitems-start\b[^"]*\b(?:md|lg|xl|2xl):grid-cols-2\b|\bgrid\b[^"]*\b(?:md|lg|xl|2xl):grid-cols-2\b[^"]*\bitems-start\b/g, fix: `Check: Cards side by side share the height of their row; drop items-start. ${PAGES}.` },
  { rule: 'selector-hack', ledger: L.stock, in: ['template'], match: /\[&_[^\]]*\]/g, fix: `No [&_…] selector hacks on components: compose stock parts. ${USING}.` },
  { rule: 'separator', ledger: L.text, in: ['template'], match: /(?<![lL])·|·(?![lL])/g, fix: `No middle-dot separators; Catalan l·l is the only spelling exception. Use a comma or a list: ${USING}.` },
  { rule: 'unicode-arrow', ledger: L.text, in: ['template'], match: /[←-⇿]/g, fix: 'Use a Lucide icon (ArrowLeft, ArrowRight…) rather than a Unicode arrow: design_assets kind=icon.' },
  { rule: 'small-text', ledger: L.text, severity: 'check', in: ['template'], match: /\btext-xs\b/g, fix: `Check: text-xs only for chart axes and Kbd; content people read is 14 px or more. ${TYPE}.` },
  // CSS: a .css file or a .vue <style>.
  { rule: 'raw-colour', ledger: L.colour, in: ['style'], match: /#[0-9a-f]{3,8}\b/ig, fix: `Use var(--token) from our styles.css, never a literal colour: ${TOKENS}.` },
  { rule: 'raw-radius', ledger: L.stock, in: ['style'], match: /\bborder(?:-[a-z]+)*-radius\s*:(?!\s*(?:var\(|inherit\b|0\s*[;}]|50%|9999px))[^;}]+/g, fix: `Use var(--radius-sm|md|lg|xl): ${TOKENS}.` },
  { rule: 'separator', ledger: L.text, in: ['style'], match: /content:\s*["'][^"']*·/g, fix: `No middle-dot separators, also in CSS content: ${USING}.` },
  // Middle dots joining labels in UI strings: every script string literal (`.join(' · ')`, labels) and i18n JSON values.
  { rule: 'separator', ledger: L.text, by: 'strings', match: /(?<![lL])·|·(?![lL])/g, fix: `No middle-dot separators; Catalan l·l is the only spelling exception. Join items with commas or show them as a list: ${USING}.` },
  // Variants: the package's own, read from its cva definitions.
  { rule: 'non-stock-variant', ledger: L.stock, by: 'variants', match: VARIANTS, fix: (tag) => `${tag} variants are the package's own: ${VARIANTS[tag].join(', ')}. ${component(tag.toLowerCase())}.` },
  // Capitals and letter-spacing: product text is sentence case and never letter-spaced (eyebrows, uppercase labels).
  // Keyboard keys, menu shortcuts and code values (a hex colour shown in capitals) keep their own style.
  { rule: 'caps', ledger: L.text, by: 'class', match: /(?<![\w-])(?:[\w-]+:)*(?:uppercase|tracking-wide|tracking-wider|tracking-widest)(?![\w-])/g, fix: CAPS_FIX },
  // In style attributes and CSS: uppercase, and any letter-spacing above zero (negative tracking on large titles stays).
  { rule: 'caps', ledger: L.text, by: 'style-attr', match: /text-transform\s*:\s*uppercase|letter-spacing\s*:(?!\s*(?:-|0(?![.\d])|normal\b|inherit\b|initial\b|unset\b|var\())\s*[^;"}\s][^;"}]*/g, fix: CAPS_FIX },

  // Page composition: how a page is put together (guide «Pages»), read from the template's element tree.
  { rule: 'nested-box', ledger: null, by: 'tree', fix: `One surface level: never a card or bordered box inside another; inside a box, use rows (divide-y) or a label-over-value grid. ${PAGES}.` },
  { rule: 'table-box', ledger: null, by: 'tree', fix: `Tables sit straight on the page or in a section's Card, never in a bordered box of their own: ${LAYOUT}, example 03-list. ${PAGES}.` },
  { rule: 'dashed-box', ledger: null, by: 'tree', fix: `Keep ordinary empty states borderless; a no-permission or error message is an Alert or an Empty in the content area: ${LAYOUT}, examples 07-empty, 08-no-permission and 09-error. ${PAGES}.` },
  { rule: 'boxed-icon', ledger: null, by: 'tree', fix: `Render meaningful icons directly on the surface. Remove decorative icon tiles from rows, cards, empty states and headers. Use an accessible Button for an icon action. ${LAYOUT}. ${PAGES}.` },
  { rule: 'kpi-tile', ledger: L.facts, by: 'tree', fix: `A figure is never alone in a box: show figures as a label-over-value grid, or give the system's Card its real content (bar, rows, chart): ${LAYOUT}, example 06-dashboard. ${PAGES}.` },

  // Stock copies: an app's components/ui and components/blocks files are the package's, exactly as its registry installs
  // them. A copy that differs is an older version or a local change; both are fixed in the package and reinstalled.
  { rule: 'stale-component', ledger: L.stock, by: 'copy', fix: (name) => `This copy of ${name} differs from the package's current one: reinstall it (npx shadcn-vue@latest add https://design.aisgroup.ai/r/${name}.json) and make any change in the package, never in the copy: ${component(name)}.` },

  // Legacy families: an app is only redesigned when none of these remain. Package rows are tried in order.
  { rule: 'foreign-theme', ledger: L.theme, by: 'package', match: /^@(?:primevue|primeuix)\/themes(?:\/|$)/, fix: `The theme is ours, not PrimeVue's: ${PRIMEVUE}.` },
  { rule: 'foreign-icons', ledger: L.icons, by: 'package', match: /^(?:primeicons(?:\/|$)|lucide-vue-next(?:\/|$)|@(?:mdi|fortawesome|heroicons|iconify)\/)/, fix: `Icons are Lucide from @lucide/vue: ${ICONS}.` },
  { rule: 'foreign-ui', ledger: L.components, by: 'package', match: /^(?:primevue|tailwindcss-primeui|vuetify|element-plus|naive-ui|quasar|ant-design-vue|bootstrap-vue|bootstrap-vue-next|@headlessui\/vue|vant|@ionic\/vue)(?:\/|$)|^@(?:primevue|primeuix)\//, fix: (name) => `Replace it with our components: ${/prime/.test(name) ? PRIMEVUE : /vuetify/.test(name) ? VUETIFY : 'design_code kind=components'}.` },
  { rule: 'foreign-ui', ledger: L.components, in: ['script'], match: /\.use\(\s*PrimeVue\b/g, fix: `Remove the PrimeVue plugin: ${PRIMEVUE}.` },
  { rule: 'foreign-ui', ledger: L.components, in: ['script'], match: /\.use\(\s*[vV]uetify\b/g, fix: `Remove the Vuetify plugin: ${VUETIFY}.` },
  { rule: 'foreign-theme', ledger: L.theme, in: ['script'], match: /\bdefinePreset\s*\(/g, fix: `No PrimeVue preset: the theme is ours, ${PRIMEVUE}.` },
  { rule: 'foreign-theme', ledger: L.theme, in: ['script'], match: /\bcreateVuetify\s*\(/g, fix: `No Vuetify theme: the theme is ours, ${VUETIFY}.` },
  // Icon classes: in templates and in script strings (menu models pass 'pi pi-…' as data).
  { rule: 'foreign-icons', ledger: L.icons, in: ['template', 'script'], match: /\bpi pi-[\w-]+|\bmdi-[a-z][\w-]*|\b(?:fa[srbl]?|fa-(?:solid|regular|brands|light|thin|duotone)) fa-[a-z][\w-]*|(['"])fa[srb]\1(?!\s*:)|\bmaterial-(?:icons|symbols)(?:-[a-z]+)?\b|\bbi bi-[\w-]+/g, fix: `Use a Lucide icon from @lucide/vue: ${ICONS}.` },
  { rule: 'foreign-theme', ledger: L.theme, in: ['template', 'script', 'css'], match: /(?<![\w-])--p-[a-z][\w-]*/g, fix: `No PrimeVue variables: use our tokens, ${PRIMEVUE}.` },
  { rule: 'foreign-theme', ledger: L.theme, in: ['css'], match: /:deep\(|::v-deep|\/deep\/|>>>/g, fix: OVERRIDE_FIX },
  { rule: 'foreign-theme', ledger: L.theme, in: ['css', 'template'], match: /!important\b/g, fix: OVERRIDE_FIX },
  { rule: 'foreign-theme', ledger: L.theme, by: 'theme', match: /(--(?:color-[a-z][a-z0-9-]*-\d{2,3}|color-primary[\w-]*|font-sans))\s*:\s*([^;]+);/g, fix: `Colour scales, primary and font come from our theme, not the app's @theme: ${TOKENS}.` },
  // The guide's «Writing the names» table. Never inside an email, a domain, a path, a class or an identifier.
  { rule: 'brand-name', ledger: L.names, by: 'text', match: /(?<![\w@./<-])(?:(?:AISVision|AIS ?VISION|Ais ?Vision|AIS vision)(?: ?(?:Systems|SYSTEMS|systems|Automation|AUTOMATION|automation))?|AIS Automation|Ais Group|AiS Group|AIS GROUP|AIS group|A\.I\.S\.|Ais Scanology|AIS scanology|AIS SCANOLOGY|RosePetal|Rose Petal|ROSEPETAL)(?![\w-]|\.\w|@)/g, fix: brandFix },
  { rule: 'logo-file', ledger: L.logos, by: 'file', match: /favicon|apple-touch|android-chrome|mstile|safari-pinned-tab|maskable|icon-\d+|(?:^|[^a-zA-Z])(?:logo(?!ut)|brand|mark(?!et|down|er))|Logo(?!ut)|LOGO|Brand|BRAND|Mark(?!et|down|er)/, fix: (kind) => `Use the official file, unchanged, not a redrawn one: design_assets kind=${kind}.` },
].map((r) => ({ severity: 'error', ...r }));

export const FAMILIES = ['template', 'foreign-ui', 'foreign-icons', 'foreign-theme', 'brand-name', 'logo-file', 'page-composition'];
export const familyOf = (rule) => FAMILIES.includes(rule) ? rule : RULES.some((r) => r.rule === rule && r.by === 'tree') ? 'page-composition' : 'template';
export const isError = (rule) => RULES.some((r) => r.rule === rule && r.severity === 'error');
// The row a named matcher uses (the first one, in table order, for rule).
export const row = (by, rule) => RULES.find((r) => r.by === by && (!rule || r.rule === rule));
export const say = (r, ...args) => typeof r.fix === 'function' ? r.fix(...args) : r.fix;
