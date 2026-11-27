import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrateSkills } from '../../scripts/migrate-skills.mjs';
import { SKILL_PATH_ALIASES } from '../../skill-routes.mjs';
import { Factory } from '../core.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
test('installed migration preserves the old tree and unrelated settings; dry run does not write', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-installed-skills-'));
  let backup;
  try {
    fs.mkdirSync(path.join(dir, '.claude-plugin'));
    const manifest = '{"name":"ais-group-design"}\n';
    fs.writeFileSync(path.join(dir, '.claude-plugin/plugin.json'), manifest);
    fs.mkdirSync(path.join(dir, 'skills/writing'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'skills/writing/SKILL.md'), 'Original installed writing instructions');
    fs.writeFileSync(path.join(dir, 'personal-settings.json'), 'Keep this exactly');
    const plan = migrateSkills(dir);
    assert.equal(plan.applied, false); assert.equal(plan.skills.length, 32);
    assert(fs.existsSync(path.join(dir, 'skills/writing/SKILL.md')));
    const result = migrateSkills(dir, { apply: true }); backup = result.backup;
    assert.equal(fs.readFileSync(path.join(backup, 'writing/SKILL.md'), 'utf8'), 'Original installed writing instructions');
    assert.equal(fs.readFileSync(path.join(dir, '.claude-plugin/plugin.json'), 'utf8'), manifest);
    assert.equal(fs.readFileSync(path.join(dir, 'personal-settings.json'), 'utf8'), 'Keep this exactly');
    assert(!fs.existsSync(path.join(dir, 'skills/writing/SKILL.md')));
    assert.equal(fs.readdirSync(path.join(dir, 'skills')).filter(name => fs.existsSync(path.join(dir, 'skills', name, 'SKILL.md'))).length, 32);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); if (backup) fs.rmSync(backup, { recursive: true, force: true }); }
});
test('all legacy reader resources reach their canonical owners without adding discovery entries', t => {
  const state = fs.mkdtempSync(path.join(os.homedir(), '.cache/ais-group-design/skill-route-test-'));
  const factory = new Factory({ state });
  t.after(() => { factory.close(); fs.rmSync(state, { recursive: true, force: true }); });
  assert.equal(factory.skills.length, 32);
  assert(!factory.skills.some(skill => skill.id === 'writing'));
  for (const [old, current] of Object.entries(SKILL_PATH_ALIASES)) {
    const actual = factory.call('read_instructions', { ref: `skill:${old}`, chars: 500 });
    const expected = factory.call('read_instructions', { ref: `skill:${current}`, chars: 500 });
    assert.equal(actual.text, expected.text, old);
  }
  assert.throws(() => factory.call('read_instructions', { ref: 'skill:writing/../../SECRET.md' }));
});
