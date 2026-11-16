// The macOS/Windows render guard (psutil; no /proc, nice, taskset or subreaper), forced on Linux with AIS_PORTABLE_GUARD=1.
// It needs psutil, which lives in the plugin venv (npm run setup).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { STUDIO } from '../../engine/recipe.mjs';
import { bin } from '../../scripts/setup.mjs';
import { Factory } from '../core.mjs';
import { needsMedia } from './needs.mjs';

const PY = bin('python'), GUARD = path.join(STUDIO, 'skills/_shared/scripts/safe_render.py');
const skip = fs.existsSync(PY) ? false : 'needs the plugin venv: npm run setup';
const python = (args, portable = '1') => spawnSync(PY, args, { cwd: STUDIO, encoding: 'utf8', timeout: 120000, env: { ...process.env, AIS_PORTABLE_GUARD: portable } });
const readings = portable => JSON.parse(python([GUARD, '--check'], portable).stdout.split('\n')[0]).resources;

test('portable guard reads the same memory, CPUs and processes as /proc', { skip }, () => {
  const linux = readings('0'), portable = readings('1');
  assert(Math.abs(linux.available_gib - portable.available_gib) < 0.5, JSON.stringify([linux.available_gib, portable.available_gib]));
  assert.deepEqual(portable.allowed_cpus, linux.allowed_cpus);
  assert.deepEqual(portable.blender_pids, linux.blender_pids);
  assert(portable.largest_rss.length > 0 && portable.largest_rss.every(p => p.name && p.rss_mib >= 0));
});

// Not the 'early' case: a descendant born and orphaned within one sample is the documented no-subreaper limit (safe_render.py cleanup).
test('portable guard: the supervision suite (detached TERM-resistant trees, lock held until exit) passes on the psutil path', { skip: skip || needsMedia }, () => {
  const r = python([path.join(STUDIO, 'skills/_shared/tests/test_supervision.py'), ...['timeout_reaps_detached_term_resistant_descendant', 'pressure_stops_and_reaps_real_owned_tree',
    'cancel_retains_lock_until_descendant_exit', 'light_profile_cannot_wrap_another_command_or_motion', 'runtime_memory_and_psi_stop'].map(n => 'Supervision.test_' + n), 'PostProfile']);
  assert.equal(r.status, 0, r.stderr.slice(-2000));
});

test('without PSI (macOS/Windows) admission and supervision run on the RAM reserve and tree RSS alone', { skip }, () => {
  const r = python(['-c', `import importlib.util, subprocess, sys
spec = importlib.util.spec_from_file_location('guard', ${JSON.stringify(GUARD)}); g = importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
assert not g.pressure_high({'psi_avg10': None})
g.resources = lambda: {'available_gib': 12, 'psi_avg10': None, 'largest_rss': [], 'blender_pids': [], 'allowed_cpus': [0, 1]}
code, report, known = g.supervise(subprocess.Popen([sys.executable, '-c', 'pass']), 10, 1024, 2)
assert code == 0 and report['maximum_psi_avg10'] is None, report
g.resources = lambda: {'available_gib': 1, 'psi_avg10': None, 'largest_rss': [], 'blender_pids': [], 'allowed_cpus': [0, 1]}
child = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(30)'])
code, report, known = g.supervise(child, 10, 1024, 2); g.cleanup(child, known)
assert code == 76 and not g.remaining(child, known), report`]);
  assert.equal(r.status, 0, r.stderr.slice(-2000));
});

test('one real post export through the MCP on the portable guard', { skip: skip || needsMedia, timeout: 200000 }, async t => {
  process.env.AIS_PORTABLE_GUARD = '1';
  process.env.PATH = path.dirname(PY) + path.delimiter + process.env.PATH; // python3 = the venv's, as start.mjs does
  const state = fs.mkdtempSync(path.join(os.homedir(), '.cache/ais-group-design/mcp-test-'));
  const f = new Factory({ state, schedule: () => {} });
  t.after(async () => { await f.close(); fs.rmSync(state, { recursive: true, force: true }); });
  assert(f.call('edit_piece', { action: 'copy', pieceId: 'cables', source: 'pieces/posts/05-rev360-cables/recipe-es.json' }).valid);
  let done, refused;
  // Other test files take the same render lock for their --check runs: retry a lock-only refusal a few times.
  for (let i = 0; i < 5; i++, await new Promise(r => setTimeout(r, 1000))) {
    const job = f.call('export_piece', { action: 'enqueue', pieceId: 'cables', operation: 'render-png' });
    await f.pump();
    done = f.call('export_piece', { action: 'status', jobId: job.id });
    refused = done.state === 'blocked' && JSON.parse(done.log.split('\n')[0]).blocked_by;
    if (!refused || refused.some(r => !r.startsWith('lock busy'))) break;
  }
  // The guard refusing (Blender running, low RAM, another render) is the machine's state, not a failure of the path.
  if (refused) return t.skip('guard refused: ' + refused.join(', '));
  assert.equal(done.state, 'succeeded', done.log);
  assert.match(done.log, /"portable": true/);
  assert(done.artifacts.some(a => a.uri.endsWith('.png') && a.bytes > 10000));
});

test('the guard accepts a document working copy in the studio state folder it is told about', { skip }, () => {
  const state = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-guard-state-')), entry = path.join(state, 'pieces/copy/hopper.es.html');
  fs.mkdirSync(path.dirname(entry), { recursive: true }); fs.writeFileSync(entry, '<!doctype html><title>x</title><section class="page"></section>');
  const check = (env) => spawnSync(PY, [GUARD, '--check', '--profile', 'document', '--timeout', '60', '--', process.execPath, path.join(STUDIO, 'print/render.mjs'), entry], { cwd: STUDIO, encoding: 'utf8', timeout: 60000, env: { ...process.env, ...env } });
  try {
    assert.match(check({ AIS_MCP_STATE: '' }).stderr, /document input must be/);
    const told = check({ AIS_MCP_STATE: state });
    assert.doesNotMatch(told.stderr, /document input must be/, told.stderr);
  } finally { fs.rmSync(state, { recursive: true, force: true }); }
});
