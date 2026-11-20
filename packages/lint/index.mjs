// ESLint presets for the AIS Group product UI rules. Each ESLint rule is a rule of the audit's table (ui-rules.mjs),
// run by the audit itself, so the editor, `eslint`, the audit, the agents' hooks and CI report the same findings with
// the same fixes. Rules marked `check` in the table are warnings: candidates to look at, not failures.
import fs from 'node:fs';
import { audit, RULES } from './core.mjs';

const { version } = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const NAMESPACE = '@aisgroup/design';
const GUIDE = 'https://aisgroup-design.web.app/en/using-components/';
// Logo files are images: the audit checks those by file, outside ESLint.
const NAMES = [...new Set(RULES.filter((r) => r.by !== 'file').map((r) => r.rule))];
const level = (name) => (RULES.some((r) => r.rule === name && r.severity === 'error') ? 'error' : 'warn');

// One audit per file, shared by all its rules.
const runs = new WeakMap();
const findingsOf = (context) => {
  const { sourceCode } = context;
  if (!runs.has(sourceCode)) runs.set(sourceCode, audit(sourceCode.text, context.filename));
  return runs.get(sourceCode);
};
// The audit gives a line and the matched text; the column is where that text starts on its line.
const locate = (sourceCode, { line, value }) => {
  const text = sourceCode.lines[line - 1] ?? '';
  const first = value.replace(/…$/, '').split('\n')[0];
  const column = Math.max(0, text.indexOf(first));
  return { start: { line, column }, end: { line, column: column + (text.includes(first) ? first.length : text.length) } };
};

const rules = Object.fromEntries(NAMES.map((name) => [name, {
  meta: { type: 'problem', docs: { description: `AIS Group product UI rule «${name}».`, url: GUIDE }, schema: [] },
  create: (context) => ({
    'Program:exit'() {
      for (const finding of findingsOf(context)) {
        if (finding.rule === name) context.report({ loc: locate(context.sourceCode, finding), message: `${finding.value}: ${finding.fix}` });
      }
    },
  }),
}]));

// Stylesheets, i18n JSON and package.json have no script to parse: their rules read the text.
const text = {
  meta: { name: `${NAMESPACE}/text`, version },
  parseForESLint(code) {
    const lines = code.split(/\r\n|\r|\n/);
    const loc = { start: { line: 1, column: 0 }, end: { line: lines.length, column: lines.at(-1).length } };
    return { ast: { type: 'Program', sourceType: 'module', body: [], comments: [], tokens: [], range: [0, code.length], loc }, visitorKeys: { Program: [] } };
  },
};

const plugin = { meta: { name: '@aisgroup/design-lint', version }, rules, configs: {} };
// Vue and script files keep the app's own parsers (vue-eslint-parser, typescript-eslint); put these presets last.
const SOURCES = ['**/*.vue', '**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];
const TEXTS = ['**/*.{css,scss,less}', '**/{i18n,locale,locales,lang}/**/*.json', '**/package.json', '**/*.webmanifest'];
// The package's own components (components/ui, components/blocks) are stock: they may do what the rules forbid an app.
const IGNORES = ['**/components/ui/**', '**/components/blocks/**', '**/dist/**', '**/node_modules/**'];
const STOCK = ['**/components/{ui,blocks}/**/*.{vue,ts}'];
const preset = (fixed) => {
  const ruleLevels = Object.fromEntries(NAMES.map((name) => [`${NAMESPACE}/${name}`, fixed ?? level(name)]));
  return [
    { name: `${NAMESPACE}/sources`, files: SOURCES, ignores: IGNORES, plugins: { [NAMESPACE]: plugin }, rules: ruleLevels },
    { name: `${NAMESPACE}/texts`, files: TEXTS, ignores: IGNORES, plugins: { [NAMESPACE]: plugin }, languageOptions: { parser: text }, rules: ruleLevels },
    // The stock copies themselves: only whether they still match the package (design-lint sync restores them).
    { name: `${NAMESPACE}/stock`, files: STOCK, ignores: ['**/dist/**', '**/node_modules/**'], plugins: { [NAMESPACE]: plugin }, rules: { [`${NAMESPACE}/stale-component`]: fixed ?? level('stale-component') } },
  ];
};
// recommended: errors fail. migration: the same rules as warnings, for an app on its way onto the package.
plugin.configs.recommended = preset();
plugin.configs.migration = preset('warn');

export default plugin;
export const { configs } = plugin;
