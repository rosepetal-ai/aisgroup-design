import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, validateManifests, validateSkills, validateArchive } from '../../scripts/validate-plugin.mjs';
import { packagePlugin } from '../../scripts/package-plugin.mjs';
import { proposal } from '../../../scripts/skills-tree.mjs';
import { retainRules } from '../../scripts/rules-ledger.mjs';

test('Agent Plugins schemas, OpenAI overlay and Claude userConfig agree', () => assert.deepEqual(validateManifests(ROOT), []));
test('manifest validation rejects portable extras, dotted Claude names and oversized descriptions', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-manifest-negative-'));
  try {
    for (const file of ['plugin.json', 'mcp.json', '.claude-plugin/plugin.json', 'skills/setup/SKILL.md']) {
      fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true }); fs.copyFileSync(path.join(ROOT, file), path.join(dir, file));
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'plugin.json')));
    manifest.name = 'ais.design'; manifest.description = 'x'.repeat(501); manifest.mcpServers = {};
    fs.writeFileSync(path.join(dir, 'plugin.json'), JSON.stringify(manifest));
    const errors = validateManifests(dir);
    assert(errors.some(e => e.startsWith('plugin.json:')));
    assert(errors.some(e => e.includes('Claude-compatible')));
    assert(errors.some(e => e.includes('500')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('proposed skills have valid frontmatter, bounded size and unique substantive content', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-skills-validation-'));
  try {
    proposal(path.join(dir, 'skills'));
    retainRules(dir, JSON.parse(fs.readFileSync(path.join(ROOT, 'evals/rules-ledger.json'))));
    assert.deepEqual(validateSkills(dir).errors, []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('archive validation rejects nested ZIPs, top-level bin and symlinks', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-archive-test-'));
  try {
    fs.mkdirSync(path.join(dir, 'bin')); fs.writeFileSync(path.join(dir, 'bin/run'), '');
    fs.writeFileSync(path.join(dir, 'nested.zip'), ''); fs.symlinkSync('nested.zip', path.join(dir, 'link'));
    const { errors } = validateArchive(dir);
    assert(errors.some(s => s.includes('bin/run'))); assert(errors.some(s => s.includes('nested.zip'))); assert(errors.some(s => s.includes('symlinks')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the published lite edition creates an editable side-rejection project without the studio or model credentials', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-lite-animation-'));
  try {
    const edition = path.join(tmp, 'plugin'), project = path.join(tmp, 'animation');
    packagePlugin(edition, { lite: true });
    const servers = JSON.parse(fs.readFileSync(path.join(edition, 'mcp.json'))).mcpServers;
    assert(servers.design);
    for (const file of ['InterMedium.ttf', 'OFL-Inter.txt']) assert(fs.statSync(path.join(edition, 'print/assets', file)).isFile());
    assert.equal(servers.studio, undefined);
    const { sceneComponents } = await import(pathToFileURL(path.join(edition, 'mcp/scene-components.mjs')).href);
    for (const component of sceneComponents) assert(fs.statSync(path.join(edition, component.path)).isFile(), component.id);
    execFileSync(process.execPath, [path.join(edition, 'scripts/animation-build.mjs'), 'create', project, '--example', 'side-rejection', '--prepare-only'], { cwd: tmp });
    const example = path.join(project, 'skills/live-animation/examples/enclosed-inspection');
    assert.deepEqual(fs.readFileSync(path.join(example, 'job.mjs')), fs.readFileSync(path.join(example, 'jobs/side-rejection.mjs')));
    assert(fs.statSync(path.join(project, 'brand/downloads/overlays/overlay.mjs')).isFile());
    execFileSync(process.execPath, ['--input-type=module', '-e', "await import('./scripts/animation-assets.mjs')"], { cwd: project });
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});
