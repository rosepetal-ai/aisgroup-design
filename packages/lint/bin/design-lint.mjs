#!/usr/bin/env node
// design-lint init [--write]: sets an app up for the AIS Group product UI rules (ESLint, the audit with a baseline,
//   the browser states check, CI and the agents' notes). Without --write it only says what it would do.
// design-lint audit [--baseline <file>] <files or folders...>: the audit (ui-contract.mjs).
// design-lint states [<base URL> <routes...>] [--config ui-states.json] …: the browser states check (ui-states.mjs).
// design-lint sync [<src>] [--write]: brings the app's copies of the package's components (components/ui, components/
//   blocks) to the package's current version, adding parts an update needs. Without --write it only lists them.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { REGISTRY, SCRIPTS } from '../core.mjs';

const TEMPLATES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates');
const MARK = '<!-- @aisgroup/design-lint -->', END = '<!-- /@aisgroup/design-lint -->';
const ESLINT_CONFIGS = ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts', 'eslint.config.mts', 'eslint.config.cts'];

const managers = {
  npm: { lock: 'package-lock.json', install: 'npm ci', run: 'npm run', exec: 'npx', setup: '' },
  pnpm: { lock: 'pnpm-lock.yaml', install: 'pnpm install --frozen-lockfile', run: 'pnpm', exec: 'pnpm exec', setup: '      - uses: pnpm/action-setup@v4\n' },
  yarn: { lock: 'yarn.lock', install: 'yarn install --immutable', run: 'yarn', exec: 'yarn', setup: '' },
};
const managerOf = (dir) => Object.entries(managers).find(([, m]) => fs.existsSync(path.join(dir, m.lock)))?.[0] ?? 'npm';

// What init writes, as a list of { file, action, text }: action is write (new file), update (existing file), or note
// (left to the developer, with the change to make).
export function plan(dir) {
  const pkgFile = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgFile)) throw new Error(`No package.json in ${dir}: run init in the app's folder.`);
  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const name = managerOf(dir), pm = managers[name];
  const src = fs.existsSync(path.join(dir, 'src')) ? 'src' : '.';
  const steps = [];

  const existing = ESLINT_CONFIGS.find((f) => fs.existsSync(path.join(dir, f)));
  if (existing) {
    const text = fs.readFileSync(path.join(dir, existing), 'utf8');
    if (!text.includes('@aisgroup/design-lint')) steps.push({ file: existing, action: 'note', text: "Add the rules last in the config:\n  import design from '@aisgroup/design-lint'\n  …\n  ...design.configs.recommended," });
  } else {
    const ts = 'typescript' in deps;
    steps.push({ file: 'eslint.config.js', action: 'write', text: [
      "import pluginVue from 'eslint-plugin-vue'",
      ts ? "import tseslint from 'typescript-eslint'" : null,
      "import design from '@aisgroup/design-lint'",
      '',
      'export default [',
      "  ...pluginVue.configs['flat/base'],",
      ts ? "  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },\n  { files: ['**/*.{ts,mts,cts,tsx}'], languageOptions: { parser: tseslint.parser } }," : null,
      '  ...design.configs.recommended,',
      ']',
      '',
    ].filter((line) => line !== null).join('\n') });
    const missing = ['eslint', 'eslint-plugin-vue', ...(ts ? ['typescript-eslint'] : [])].filter((d) => !(d in deps));
    if (missing.length) steps.push({ file: 'package.json', action: 'note', text: `Install ${missing.join(', ')} as dev dependencies.` });
  }

  const scripts = {
    // The gate honours the baseline; ESLint shows the same rules in the editor.
    'lint:ui': `design-lint audit --baseline .ui-baseline.json ${src}`,
    'check:ui': 'design-lint states --config ui-states.json',
  };
  const add = Object.fromEntries(Object.entries(scripts).filter(([key]) => !pkg.scripts?.[key]));
  if (Object.keys(add).length) steps.push({ file: 'package.json', action: 'update', text: JSON.stringify({ ...pkg, scripts: { ...pkg.scripts, ...add } }, null, 2) + '\n', summary: `scripts ${Object.keys(add).join(', ')}` });
  if (!('@aisgroup/design-lint' in deps)) steps.push({ file: 'package.json', action: 'note', text: 'Install it as a dev dependency: npm install -D @aisgroup/design-lint' });

  if (!fs.existsSync(path.join(dir, 'ui-states.json'))) {
    steps.push({ file: 'ui-states.json', action: 'write', text: JSON.stringify({ baseURL: 'http://localhost:4173', routes: ['/'] }, null, 2) + '\n', summary: 'list the routes to check; add "login" with a sign-in hook if the app needs one' });
  }

  const workflow = '.github/workflows/ui-checks.yml';
  if (!fs.existsSync(path.join(dir, workflow))) {
    const text = fs.readFileSync(path.join(TEMPLATES, 'ui-checks.yml'), 'utf8')
      .replaceAll('__SETUP__', pm.setup).replaceAll('__CACHE__', name).replaceAll('__INSTALL__', pm.install)
      .replaceAll('__RUN__', pm.run).replaceAll('__EXEC__', pm.exec);
    steps.push({ file: workflow, action: 'write', text });
  }

  const notes = fs.readFileSync(path.join(TEMPLATES, 'agents.md'), 'utf8').replaceAll('__RUN__', pm.run).trim();
  const block = `${MARK}\n${notes}\n${END}\n`;
  for (const file of ['AGENTS.md', 'CLAUDE.md']) {
    const at = path.join(dir, file);
    if (!fs.existsSync(at)) { if (file === 'AGENTS.md') steps.push({ file, action: 'write', text: block }); continue; }
    const text = fs.readFileSync(at, 'utf8');
    const next = text.includes(MARK) ? text.replace(new RegExp(`${MARK}[\\s\\S]*?${END}\\n?`), block) : `${text.replace(/\n*$/, '\n\n')}${block}`;
    if (next !== text) steps.push({ file, action: 'update', text: next, summary: 'the UI section' });
  }
  return { steps, manager: name, src };
}

function init(dir, write) {
  const { steps, manager, src } = plan(dir);
  for (const step of steps) {
    const label = step.action === 'note' ? 'to do' : write ? (step.action === 'write' ? 'wrote' : 'updated') : (step.action === 'write' ? 'would write' : 'would update');
    console.log(`${label.padEnd(12)} ${step.file}${step.summary ? `: ${step.summary}` : ''}${step.action === 'note' ? `\n             ${step.text.replaceAll('\n', '\n             ')}` : ''}`);
    if (write && step.action !== 'note') {
      fs.mkdirSync(path.dirname(path.join(dir, step.file)), { recursive: true });
      fs.writeFileSync(path.join(dir, step.file), step.text);
    }
  }
  if (!steps.length) console.log('Already set up.');
  const baseline = path.join(dir, '.ui-baseline.json');
  if (!fs.existsSync(baseline)) {
    if (write) run('ui-contract.mjs', ['audit', '--baseline', baseline, path.join(dir, src)], { quiet: true });
    else console.log(`${'would write'.padEnd(12)} .ui-baseline.json: today's audit findings, so only new ones fail`);
  }
  if (!write) console.log(`\nNothing was changed. Run again with --write to apply (${manager}).`);
}

// Stock copies an app holds (components/ui, components/blocks) that differ from the package's registry, and files of an
// installed item the app lacks (a part an update added). Paths are relative to the app's source folder.
export function stale(src) {
  const changes = [];
  for (const f of fs.readdirSync(REGISTRY).filter((name) => name.endsWith('.json'))) {
    const item = JSON.parse(fs.readFileSync(path.join(REGISTRY, f), 'utf8'));
    const files = (item.files ?? []).filter((x) => typeof x.content === 'string' && /^components\/(?:ui|blocks)\//.test(x.path));
    if (!files.some((x) => fs.existsSync(path.join(src, x.path)))) continue;
    for (const x of files) {
      const at = path.join(src, x.path), now = fs.existsSync(at) ? fs.readFileSync(at, 'utf8') : null;
      const norm = (s) => s.replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '').trim();
      if (now === null || norm(now) !== norm(x.content)) changes.push({ item: item.name, file: x.path, action: now === null ? 'add' : 'update', content: x.content.replace(/\n?$/, '\n') });
    }
  }
  return changes;
}

function sync(src, write) {
  const changes = stale(src);
  for (const c of changes) {
    console.log(`${(write ? (c.action === 'add' ? 'added' : 'updated') : (c.action === 'add' ? 'would add' : 'would update')).padEnd(12)} ${c.file}`);
    if (write) { fs.mkdirSync(path.dirname(path.join(src, c.file)), { recursive: true }); fs.writeFileSync(path.join(src, c.file), c.content); }
  }
  console.log(changes.length ? (write ? `${changes.length} files now match the package. Build and test the app.` : `\n${changes.length} files differ from the package. Nothing was changed; run again with --write.`) : 'Every stock copy matches the package.');
}

function run(script, args, { quiet = false } = {}) {
  const result = spawnSync(process.execPath, [path.join(SCRIPTS, script), ...args], { stdio: quiet ? ['inherit', 'ignore', 'inherit'] : 'inherit' });
  return result.status ?? 1;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'init') init(process.cwd(), args.includes('--write'));
  else if (command === 'audit') process.exitCode = run('ui-contract.mjs', ['audit', ...args]);
  else if (command === 'states') process.exitCode = run('ui-states.mjs', args);
  else if (command === 'sync') sync(path.resolve(args.find((a) => !a.startsWith('--')) ?? (fs.existsSync('src') ? 'src' : '.')), args.includes('--write'));
  else {
    console.error('Usage: design-lint init [--write] | audit [--baseline <file>] <files or folders...> | states [--config ui-states.json] | sync [<src>] [--write]');
    process.exitCode = 2;
  }
}
