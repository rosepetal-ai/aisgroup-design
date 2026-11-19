// The rules table, the plugin hooks (edit and stop) and the audit baseline, run as Claude Code runs them: a JSON payload
// on stdin, the exit code and stderr back.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { RULES, VARIANTS, cvaVariants } from '../ui-rules.mjs';
import { validateHooks } from '../../plugin/scripts/validate-plugin.mjs';

const SCRIPT = new URL('../ui-contract.mjs', import.meta.url).pathname, PLUGIN = new URL('../../plugin/', import.meta.url).pathname;
const run = (args, { input, cwd } = {}) => spawnSync(process.execPath, [SCRIPT, ...args], { input: input && JSON.stringify(input), cwd, encoding: 'utf8' });
const app = (files, pkg = { name: 'app', dependencies: { vue: '^3' } }) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-hooks-'));
  write(dir, { 'package.json': JSON.stringify(pkg), ...files });
  return dir;
};
const write = (dir, files) => { for (const [f, body] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), body); } };
const edit = (cwd, file) => ({ hook_event_name: 'PostToolUse', tool_name: 'Edit', tool_input: { file_path: file }, cwd });
const BAD = '<template>\n  <div class="bg-gray-100">x</div>\n</template>\n';

test('ui-rules: one row per pattern, real ledger ids, fixes that name the MCP call, variants from the package', () => {
  const ledger = new Set(JSON.parse(fs.readFileSync(new URL('../../plugin/evals/rules-ledger.json', import.meta.url))).rules.map((r) => r.id));
  for (const r of RULES) {
    assert(['error', 'check'].includes(r.severity), r.rule);
    assert(r.ledger === null || ledger.has(r.ledger), `${r.rule}: ${r.ledger} is not in the ledger`);
    assert(r.in || r.by, r.rule);
    const fix = typeof r.fix === 'function' ? r.fix('Button', 'logo') : r.fix;
    assert.match(fix, /design_(?:code|standards|assets) kind=/, r.rule);
  }
  assert.deepEqual(RULES.filter((r) => r.severity === 'check').map((r) => r.rule), ['row-items-start', 'small-text']);
  for (const v of ['default', 'outline-destructive', 'ghost-destructive', 'inverse-outline']) assert(VARIANTS.Button.includes(v), v);
  for (const v of ['positive', 'success', 'overlay']) assert(VARIANTS.Badge.includes(v), v);
  assert(!VARIANTS.Button.includes('sm') && !VARIANTS.Button.includes('icon'), 'sizes are not variants');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-rules-'));
  write(dir, { 'packages/design/ui/chip/index.ts': "export const chipVariants = cva('x', {\n  variants: {\n    variant: {\n      // Quiet.\n      default: 'bg-a hover:bg-b',\n      'soft-x': \"a: b\",\n    },\n    size: { sm: 'h-8' },\n  },\n})\n" });
  assert.deepEqual(cvaVariants('chip', dir), ['default', 'soft-x']);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('hook: an edited Vue file with error findings exits 2 and names each fix on stderr', () => {
  const dir = app({ 'src/View.vue': BAD });
  const r = run(['hook'], { input: edit(dir, 'src/View.vue') });
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /src\/View\.vue:2 stock-palette: bg-gray-100\n {2}Fix: .*design_code kind=tailwind/);
  // The absolute path a Write payload carries works the same.
  assert.equal(run(['hook'], { input: { ...edit('/', path.join(dir, 'src/View.vue')), tool_name: 'Write' } }).status, 2);
  fs.writeFileSync(path.join(dir, 'src/View.vue'), '<template>\n  <p class="text-xs text-muted-foreground">x</p>\n</template>\n');
  const checks = run(['hook'], { input: edit(dir, 'src/View.vue') });
  assert.deepEqual([checks.status, checks.stderr], [0, ''], 'checks never block');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('hook: anything that is not a Vue, CSS or i18n file of a Vue app passes at once', () => {
  const dir = app({ 'src/View.vue': BAD, 'README.md': 'bg-gray-100', 'src/components/ui/x/X.vue': BAD, 'src/i18n/es.json': '{ "t": "AISVision" }', 'src/util.ts': "const c = 'AISVision'" });
  for (const file of ['README.md', 'src/components/ui/x/X.vue', 'src/util.ts', 'missing.vue']) assert.deepEqual([file, run(['hook'], { input: edit(dir, file) }).status], [file, 0]);
  assert.equal(run(['hook'], { input: edit(dir, 'src/i18n/es.json') }).status, 2, 'i18n files are audited');
  assert.equal(run(['hook'], { input: { hook_event_name: 'PostToolUse', tool_name: 'Edit', cwd: dir } }).status, 0, 'no file in the payload');
  assert.equal(run(['hook'], { input: {} }).status, 0);
  for (const pkg of [{ name: 'site', dependencies: { astro: '^5', vue: '^3' } }, { name: 'lib' }]) {
    const other = app({ 'src/View.vue': BAD }, pkg);
    assert.equal(run(['hook'], { input: edit(other, 'src/View.vue') }).status, 0, pkg.name);
    fs.rmSync(other, { recursive: true, force: true });
  }
  fs.rmSync(dir, { recursive: true, force: true });
});

const git = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd, stdio: 'ignore' });
test('stop with a session: only the files that session (or that subagent) edited, never someone else\'s', () => {
  const dir = app({ 'src/Theirs.vue': BAD, 'src/Mine.vue': BAD });
  const session = `s-${process.pid}-${Date.now()}`, cwd = path.join(dir, 'src');
  const stop = (extra = {}) => run(['stop'], { input: { hook_event_name: 'Stop', stop_hook_active: false, session_id: session, cwd, ...extra } });
  assert.equal(stop().status, 0, 'this session edited nothing: another agent\'s bad file does not hold it');
  run(['hook'], { input: { tool_name: 'Edit', tool_input: { file_path: 'Mine.vue' }, session_id: session, agent_id: 'a1', cwd } });
  const r = stop();
  assert.equal(r.status, 2, 'the main agent answers for its session, subagents included');
  assert.match(r.stderr, /Mine\.vue/);
  assert.doesNotMatch(r.stderr, /Theirs\.vue/);
  assert.equal(stop({ hook_event_name: 'SubagentStop', agent_id: 'a2' }).status, 0, 'another subagent edited nothing');
  assert.equal(stop({ hook_event_name: 'SubagentStop', agent_id: 'a1' }).status, 2, 'the subagent that edited it');
  fs.rmSync(path.join(os.tmpdir(), 'ais-ui-hooks', `${session}.json`), { force: true });
  fs.rmSync(dir, { recursive: true, force: true });
});

test('stop: changed files of the working tree keep the agent working until they pass, and never loop', () => {
  const dir = app({ 'src/Clean.vue': '<template><p>x</p></template>\n', 'src/Old.vue': '<template><p>x</p></template>\n', 'notes.md': 'x' });
  git(dir, 'init', '-q'); git(dir, 'add', '.'); git(dir, 'commit', '-qm', 'init');
  const stop = (extra = {}) => run(['stop'], { input: { hook_event_name: 'Stop', stop_hook_active: false, cwd: path.join(dir, 'src'), ...extra } });
  assert.deepEqual([stop().status, stop().stderr], [0, ''], 'nothing changed');
  write(dir, { 'src/New.vue': BAD, 'src/Old.vue': '<template>\n  <h2 class="font-bold">x</h2>\n</template>\n', 'notes.md': 'bg-gray-100' });
  git(dir, 'mv', 'src/Clean.vue', 'src/Renamed.vue');
  const r = stop();
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /2 findings remain in 2 changed files/);
  assert.match(r.stderr, /New\.vue:2 stock-palette/);
  assert.match(r.stderr, /Old\.vue:2 heading-weight/);
  assert.equal(stop({ stop_hook_active: true }).status, 0, 'already continuing because of a stop hook');
  assert.equal(stop({ hook_event_name: 'SubagentStop', agent_id: 'a1' }).status, 2, 'subagents too');
  write(dir, { 'src/New.vue': '<template><p class="bg-muted">x</p></template>\n', 'src/Old.vue': '<template><h2 class="font-medium">x</h2></template>\n' });
  assert.equal(stop().status, 0);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-hooks-nogit-'));
  assert.equal(run(['stop'], { input: { stop_hook_active: false, cwd: outside } }).status, 0, 'not a git repository');
  for (const d of [dir, outside]) fs.rmSync(d, { recursive: true, force: true });
});

test('baseline: written once, then only new findings fail, keys survive line shifts, the count per family is printed', () => {
  const dir = app({ 'src/A.vue': '<template>\n  <div class="bg-gray-100">x</div>\n  <div class="bg-gray-100">y</div>\n  <p class="text-xs">z</p>\n</template>\n', 'src/main.ts': "import PrimeVue from 'primevue/config'\n" });
  const audit = () => { const r = run(['audit', '--baseline', '.ui-baseline.json', 'src'], { cwd: dir }); return { ...r, json: JSON.parse(r.stdout) }; };
  const first = audit();
  assert.equal(first.status, 0, first.stderr);
  assert.deepEqual(first.json.baseline, { file: '.ui-baseline.json', written: true, known: 3, fixed: 0, new: 0, remaining: { template: 2, 'foreign-ui': 1, 'foreign-icons': 0, 'foreign-theme': 0, 'brand-name': 0, 'logo-file': 0, 'page-composition': 0 } });
  assert.match(first.stderr, /Baseline written to \.ui-baseline\.json: 3 findings \(template 2, foreign-ui 1\)/);
  const keys = Object.keys(JSON.parse(fs.readFileSync(path.join(dir, '.ui-baseline.json'), 'utf8')).findings);
  assert.deepEqual(keys.map((k) => k.replace(/ \w{12}$/, '')), ['foreign-ui src/main.ts', 'stock-palette src/A.vue']);
  // Lines move: still known.
  fs.writeFileSync(path.join(dir, 'src/A.vue'), '\n\n' + fs.readFileSync(path.join(dir, 'src/A.vue'), 'utf8'));
  const shifted = audit();
  assert.deepEqual([shifted.status, shifted.json.baseline.new, shifted.json.baseline.known, shifted.json.findings], [0, 0, 3, []]);
  // A third copy of a known finding, and a new rule: both new; the file is not rewritten.
  fs.appendFileSync(path.join(dir, 'src/A.vue'), '<template><div class="bg-gray-100 font-bold">q</div><h3 class="font-bold">t</h3></template>\n');
  const worse = audit();
  assert.equal(worse.status, 1);
  assert.deepEqual(worse.json.findings.map((f) => f.rule), ['heading-weight', 'stock-palette']);
  assert.match(worse.stderr, /Baseline \.ui-baseline\.json: 2 new findings; 3 known remain \(template 2, foreign-ui 1\); 0 fixed/);
  // Fixing a known one counts as fixed; the hooks read the same baseline beside package.json.
  fs.writeFileSync(path.join(dir, 'src/A.vue'), '<template>\n  <div class="bg-gray-100">x</div>\n</template>\n');
  const better = audit();
  assert.deepEqual([better.status, better.json.baseline.known, better.json.baseline.fixed], [0, 2, 1]);
  assert.equal(run(['hook'], { input: edit(dir, 'src/A.vue') }).status, 0, 'known to the baseline');
  fs.appendFileSync(path.join(dir, 'src/A.vue'), '<template><p class="text-red-500">new</p></template>\n');
  const hook = run(['hook'], { input: edit(dir, 'src/A.vue') });
  assert.deepEqual([hook.status, (hook.stderr.match(/stock-palette/g) ?? []).length], [2, 1], hook.stderr);
  assert.equal(run(['audit', '--baseline'], { cwd: dir }).status, 1, 'usage');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('plugin hooks.json: Claude Code\'s shape, quoted plugin root, the modes the audit has', () => {
  assert.deepEqual(validateHooks(PLUGIN), []);
  const { hooks } = JSON.parse(fs.readFileSync(path.join(PLUGIN, 'hooks/hooks.json'), 'utf8'));
  const command = (event) => hooks[event].flatMap((g) => g.hooks.map((h) => h.command));
  assert.equal(hooks.PostToolUse[0].matcher, 'Edit|Write|MultiEdit');
  assert.deepEqual(['PostToolUse', 'Stop', 'SubagentStop'].map(command).flat(), ['hook', 'stop', 'stop'].map((m) => `node "\${CLAUDE_PLUGIN_ROOT}/scripts/ui-contract.mjs" ${m}`));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-hooks-plugin-'));
  write(dir, { 'hooks/hooks.json': JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'node ${CLAUDE_PLUGIN_ROOT}/scripts/x.mjs' }, { type: 'command', command: 'node "${CLAUDE_PLUGIN_ROOT}/scripts/gone.mjs"' }] }] } }) });
  assert.deepEqual(validateHooks(dir), ['hooks/hooks.json Stop: quote ${CLAUDE_PLUGIN_ROOT}', 'hooks/hooks.json Stop: runs scripts/gone.mjs, which the plugin does not have']);
  write(dir, { 'hooks/hooks.json': JSON.stringify({ Stop: [] }) });
  assert.deepEqual(validateHooks(dir), ['hooks/hooks.json needs its events under a top-level "hooks" object']);
  fs.rmSync(dir, { recursive: true, force: true });
});
