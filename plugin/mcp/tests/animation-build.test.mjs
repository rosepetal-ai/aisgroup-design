import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const plugin = fileURLToPath(new URL('../../', import.meta.url));
const tool = path.join(plugin, 'scripts', 'animation-build.mjs');
const run = (...args) => spawnSync(process.execPath, [tool, ...args], { encoding: 'utf8' });

test('prepare copies the editable source, private resolver and matching install lock without npm', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-animation-project-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const project = path.join(temp, 'Customer demonstration');
  let result = run('create', project, '--prepare-only');
  assert.equal(result.status, 0, result.stderr);
  assert.ok(!fs.existsSync(path.join(project, 'node_modules')));
  const manifest = JSON.parse(fs.readFileSync(path.join(project, 'package.json')));
  const lock = JSON.parse(fs.readFileSync(path.join(project, 'package-lock.json')));
  for (const group of ['dependencies', 'devDependencies']) {
    assert.deepEqual(manifest[group], lock.packages[''][group]);
  }
  assert.ok(manifest.devDependencies.typescript);
  for (const relative of ['scripts/animation-assets.mjs', 'scripts/animation-assets.json',
    'scripts/scene-model-pack.mjs', 'mcp/industrial-models.mjs', 'skills/scene-assembly/models-directory.mjs']) {
    assert.deepEqual(fs.readFileSync(path.join(project, relative)), fs.readFileSync(path.join(plugin, relative)));
  }
  const scene = path.join(project, 'skills/live-animation/examples/enclosed-inspection/scene.ts');
  fs.writeFileSync(scene, 'edited scene');
  result = run('create', project, '--prepare-only');
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(scene, 'utf8'), 'edited scene');
});

test('project creation refuses the installed plugin as a destination', () => {
  const result = run('create', plugin, '--prepare-only');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /outside the installed plugin/);
});

test('side-rejection creates its own working job while the standard inspection stays available', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-animation-pusher-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const project = path.join(temp, 'Side reject');
  const result = run('create', project, '--example', 'side-rejection', '--prepare-only');
  assert.equal(result.status, 0, result.stderr);
  const scene = path.join(project, 'skills/live-animation/examples/enclosed-inspection');
  assert.deepEqual(fs.readFileSync(path.join(scene, 'job.mjs')), fs.readFileSync(path.join(scene, 'jobs/side-rejection.mjs')));
  const unsupported = path.join(temp, 'Unknown mechanism');
  assert.notEqual(run('create', unsupported, '--example', 'unknown', '--prepare-only').status, 0);
  assert.ok(!fs.existsSync(unsupported));
});
