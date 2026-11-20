import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ESLint } from 'eslint';
import vueParser from 'vue-eslint-parser';
import design from '../index.mjs';
import { audit, RULES, REGISTRY } from '../core.mjs';
import { plan, stale } from '../bin/design-lint.mjs';
import { bundle, FILES } from '../scripts/bundle.mjs';

const PACKAGE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BIN = path.join(PACKAGE, 'bin/design-lint.mjs');

function app(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'design-lint-'));
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), text);
  }
  return dir;
}
const lint = async (dir, preset = design.configs.recommended) => {
  const eslint = new ESLint({ cwd: dir, overrideConfigFile: true, overrideConfig: [{ files: ['**/*.vue'], languageOptions: { parser: vueParser } }, ...preset] });
  return (await eslint.lintFiles(['.'])).flatMap((r) => r.messages.map((m) => ({ file: path.relative(dir, r.filePath), ...m })));
};

const PAGE = `<script setup>
const label = ['Line 2', 'Camera 1'].join(' \u00b7 ')
</script>

<template>
  <div class="bg-blue-500 p-4">
    <h2 class="font-bold">Models</h2>
    <Badge variant="purple">New</Badge>
    <p class="text-xs">Updated</p>
  </div>
</template>
`;
const FIXTURE = {
  'src/Page.vue': PAGE,
  'src/app.css': '.card { color: #ff0000; border-radius: 6px; }\n',
  'src/i18n/es.json': '{ "app": "AISVision Systems" }\n',
  'package.json': '{ "name": "app", "dependencies": { "primevue": "^4.0.0" } }\n',
  'src/components/ui/button/Button.vue': '<template><button class="bg-red-500 font-bold">x</button></template>\n',
};

test('every rule of the audit table is an ESLint rule, logo files aside', () => {
  const names = new Set(RULES.filter((r) => r.by !== 'file').map((r) => r.rule));
  assert.deepEqual(new Set(Object.keys(design.rules)), names);
  assert.ok(!('logo-file' in design.rules));
});

test('ESLint reports what the audit finds, on the same lines, in Vue, CSS, i18n JSON and package.json', async () => {
  const dir = app(FIXTURE);
  const messages = await lint(dir);
  const fromEslint = messages.map((m) => `${m.file}:${m.line} ${m.ruleId.replace('@aisgroup/design/', '')}`).sort();
  const fromAudit = ['src/Page.vue', 'src/app.css', 'src/i18n/es.json', 'package.json', 'src/components/ui/button/Button.vue']
    .flatMap((file) => audit(fs.readFileSync(path.join(dir, file), 'utf8'), path.join(dir, file)).filter((f) => !file.includes('components/ui') || f.rule === 'stale-component').map((f) => `${file}:${f.line} ${f.rule}`)).sort();
  assert.deepEqual(fromEslint, fromAudit);
  for (const rule of ['separator', 'stock-palette', 'heading-weight', 'non-stock-variant', 'raw-colour', 'raw-radius', 'brand-name', 'foreign-ui']) {
    assert.ok(fromEslint.some((m) => m.endsWith(` ${rule}`)), `${rule} reported`);
  }
  // The package's own components may do what an app may not; there ESLint only says whether the copy is current.
  assert.deepEqual(messages.filter((m) => m.file.includes('components/ui')).map((m) => m.ruleId), ['@aisgroup/design/stale-component']);
  // The message is the audit's: the matched text and its fix.
  const palette = messages.find((m) => m.ruleId.endsWith('/stock-palette'));
  assert.match(palette.message, /^bg-blue-500: .*design_code kind=tailwind/);
  assert.equal(palette.column, PAGE.split('\n')[5].indexOf('bg-blue-500') + 1);
});

test('errors fail and checks warn in recommended; migration only warns', async () => {
  const dir = app(FIXTURE);
  const recommended = await lint(dir);
  assert.equal(recommended.find((m) => m.ruleId.endsWith('/small-text')).severity, 1);
  assert.equal(recommended.find((m) => m.ruleId.endsWith('/stock-palette')).severity, 2);
  const migration = await lint(dir, design.configs.migration);
  assert.equal(migration.length, recommended.length);
  assert.ok(migration.every((m) => m.severity === 1));
});

test('init plans the config, scripts, states file, CI and agent notes, and writes nothing without --write', () => {
  const dir = app({ 'package.json': JSON.stringify({ name: 'app', scripts: { build: 'vite build' }, devDependencies: { typescript: '^5', eslint: '^9', 'eslint-plugin-vue': '^10' } }), 'pnpm-lock.yaml': '', 'src/main.ts': '' });
  const { steps, manager } = plan(dir);
  assert.equal(manager, 'pnpm');
  const files = steps.filter((s) => s.action !== 'note').map((s) => s.file).sort();
  assert.deepEqual(files, ['.github/workflows/ui-checks.yml', 'AGENTS.md', 'eslint.config.js', 'package.json', 'ui-states.json']);
  const config = steps.find((s) => s.file === 'eslint.config.js').text;
  assert.match(config, /\.\.\.design\.configs\.recommended/);
  assert.match(config, /tseslint\.parser/);
  assert.match(steps.find((s) => s.file === '.github/workflows/ui-checks.yml').text, /pnpm\/action-setup[\s\S]*pnpm lint:ui[\s\S]*pnpm check:ui/);
  assert.ok(steps.some((s) => s.action === 'note' && /typescript-eslint/.test(s.text)));
  const out = spawnSync(process.execPath, [BIN, 'init'], { cwd: dir, encoding: 'utf8' });
  assert.equal(out.status, 0, out.stderr);
  assert.match(out.stdout, /Nothing was changed/);
  assert.ok(!fs.existsSync(path.join(dir, 'eslint.config.js')));
});

test('init --write sets the app up, a second run changes nothing, and an existing ESLint config is left to the developer', () => {
  const dir = app({ 'package.json': JSON.stringify({ name: 'app', scripts: { build: 'vite build' } }), 'CLAUDE.md': '# App\n', 'src/Page.vue': PAGE });
  const first = spawnSync(process.execPath, [BIN, 'init', '--write'], { cwd: dir, encoding: 'utf8' });
  assert.equal(first.status, 0, first.stderr);
  for (const file of ['eslint.config.js', 'ui-states.json', '.github/workflows/ui-checks.yml', 'AGENTS.md', '.ui-baseline.json']) assert.ok(fs.existsSync(path.join(dir, file)), file);
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['lint:ui'], 'design-lint audit --baseline .ui-baseline.json src');
  assert.equal(pkg.scripts.build, 'vite build');
  assert.match(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), /^# App\n\n<!-- @aisgroup\/design-lint -->[\s\S]*npm run lint:ui/);
  const before = Object.fromEntries(['eslint.config.js', 'package.json', 'AGENTS.md', 'CLAUDE.md', '.ui-baseline.json'].map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));
  const second = spawnSync(process.execPath, [BIN, 'init', '--write'], { cwd: dir, encoding: 'utf8' });
  assert.equal(second.status, 0, second.stderr);
  for (const [file, text] of Object.entries(before)) assert.equal(fs.readFileSync(path.join(dir, file), 'utf8'), text, file);
  // Only the notes remain: install the packages.
  assert.ok(plan(dir).steps.every((s) => s.action === 'note'));

  const own = app({ 'package.json': '{ "name": "app" }', 'eslint.config.js': 'export default []\n' });
  const step = plan(own).steps.find((s) => s.file === 'eslint.config.js');
  assert.equal(step.action, 'note');
  assert.match(step.text, /design\.configs\.recommended/);
});

test('audit runs the audit with its baseline; the exit code fails only on new findings', () => {
  const dir = app({ 'src/Page.vue': PAGE });
  const audit = (...args) => spawnSync(process.execPath, [BIN, 'audit', ...args], { cwd: dir, encoding: 'utf8' });
  assert.equal(audit('src').status, 1);
  assert.equal(audit('--baseline', '.ui-baseline.json', 'src').status, 0);
  fs.appendFileSync(path.join(dir, 'src/Page.vue'), '<template><span class="text-red-600">x</span></template>\n');
  const after = audit('--baseline', '.ui-baseline.json', 'src');
  assert.equal(after.status, 1);
  assert.match(after.stderr, /1 new findings?/);
});

test('the published package carries the audit and what it reads, and it runs from there', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'design-lint-core-'));
  bundle(dir);
  for (const file of FILES) assert.ok(fs.existsSync(path.join(dir, file)), file);
  const core = await import(pathToFileURL(path.join(dir, 'scripts/ui-contract.mjs')).href);
  assert.deepEqual(core.audit(PAGE, 'Page.vue').map((f) => f.rule), audit(PAGE, 'Page.vue').map((f) => f.rule));
  const listed = JSON.parse(fs.readFileSync(path.join(PACKAGE, 'package.json'), 'utf8')).files;
  for (const entry of ['index.mjs', 'core.mjs', 'bin', 'templates', 'core']) assert.ok(listed.includes(entry), entry);
});

test('a stock copy that differs from the package is reported, and sync brings it back with the parts it needs', () => {
  const item = JSON.parse(fs.readFileSync(path.join(REGISTRY, 'separator.json'), 'utf8'));
  const [vue, index] = item.files;
  const old = vue.content.replace("'shrink-0 bg-border',", "'shrink-0 bg-border data-[orientation=vertical]:self-stretch',");
  const dir = app({ [`src/${vue.path}`]: old, 'src/Page.vue': '<template><p>Ok</p></template>\n' });
  assert.deepEqual(audit(old, path.join(dir, 'src', vue.path)).map((f) => f.rule), ['stale-component']);
  assert.deepEqual(audit(vue.content, path.join(dir, 'src', vue.path)), []);
  // The audit of a folder checks stock copies only for that.
  const out = spawnSync(process.execPath, [BIN, 'audit', 'src'], { cwd: dir, encoding: 'utf8' });
  assert.deepEqual(JSON.parse(out.stdout).findings.map((f) => f.rule), ['stale-component']);
  assert.deepEqual(stale(path.join(dir, 'src')).map((c) => `${c.action} ${c.file}`).sort(), [`add ${index.path}`, `update ${vue.path}`]);
  const dry = spawnSync(process.execPath, [BIN, 'sync'], { cwd: dir, encoding: 'utf8' });
  assert.match(dry.stdout, /2 files differ from the package\. Nothing was changed/);
  assert.equal(fs.readFileSync(path.join(dir, 'src', vue.path), 'utf8'), old);
  spawnSync(process.execPath, [BIN, 'sync', '--write'], { cwd: dir, encoding: 'utf8' });
  assert.deepEqual(stale(path.join(dir, 'src')), []);
  assert.equal(JSON.parse(spawnSync(process.execPath, [BIN, 'audit', 'src'], { cwd: dir, encoding: 'utf8' }).stdout).findings.length, 0);
});
