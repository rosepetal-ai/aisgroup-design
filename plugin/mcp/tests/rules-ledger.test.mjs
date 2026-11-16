import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { proposal } from '../../../scripts/skills-tree.mjs';
import { ROOT, checkLedger, retainRules } from '../../scripts/rules-ledger.mjs';

const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugin/evals/rules-ledger.json')));
test('0 ledger rules lost in canonical owner references; every recorded code check still exists', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-ledger-test-'));
  try {
    proposal(path.join(dir, 'skills'));
    retainRules(dir, ledger);
    const result = checkLedger(dir, ledger);
    assert.equal(result.lost, 0); assert.deepEqual(result.errors, []);
    assert(ledger.rules.length > 1000 && ledger.enforcements.length > 100);
    const files = fs.readdirSync(path.join(dir, 'skills'), { recursive: true }).filter(file => file.endsWith('.md'));
    const snapshot = files.map(file => fs.readFileSync(path.join(dir, 'skills', file), 'utf8'));
    retainRules(dir, ledger);
    assert.deepEqual(files.map(file => fs.readFileSync(path.join(dir, 'skills', file), 'utf8')), snapshot, 'retaining the ledger again must not duplicate routes or writing instructions');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('ledger preserves consolidated decisions and applies all nine dated conflict resolutions', () => {
  for (const phrase of ['No contractions in English copy', 'Simple is not empty', 'Stock shadcn-vue only', 'Held back until further notice', 'Never say CAD or render anywhere public']) assert(ledger.rules.some(r => r.rule.includes(phrase)), phrase);
  assert.equal(ledger.conflicts.length, 9);
  assert.equal(ledger.conflictResolution.baselineUnitsLost, 0);
  for (const conflict of ledger.conflicts) {
    assert.equal(conflict.status, 'resolved-by-explicit-user-decision', conflict.id);
    const current = ledger.rules.find(rule => rule.id === conflict.resolvedBy);
    assert(current?.source.startsWith('brand-decisions:'), conflict.id);
    assert.equal(conflict.resolution, current.rule);
    for (const id of conflict.supersededRules) {
      const old = ledger.rules.find(rule => rule.id === id);
      assert.equal(old?.status, 'superseded', id);
      assert.equal(old.supersededBy, current.id);
      assert(old.rule && old.sources.length, id);
    }
  }
});
test('ledger validation actually rejects lost rule text and missing enforcement code', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-ledger-negative-'));
  try {
    const tiny = { ...ledger, rules: ledger.rules.slice(0, 1), enforcements: [] };
    retainRules(dir, tiny);
    fs.writeFileSync(path.join(dir, tiny.rules[0].owner), '');
    assert.equal(checkLedger(dir, tiny).lost, 1);
    const invalid = { ...tiny, rules: [], enforcements: [{ id: 'removed', file: 'plugin/engine/copy.mjs', anchor: 'THIS_CHECK_DOES_NOT_EXIST', line: 1 }] };
    assert(checkLedger(dir, invalid).errors.some(s => s.includes('removed')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('simplicity stays first in every source essential list and explicitly wins conflicts', () => {
  const source = fs.readFileSync(path.join(ROOT, 'guide/src/essentials.ts'), 'utf8');
  for (const lang of ['en', 'es', 'ca']) {
    const first = source.match(new RegExp(`  ${lang}: \\[\\n    '([^\\n]+)'`))?.[1];
    assert(first, lang);
    assert(/Keep it simple|Hazlo simple|Fes-ho simple|Hazlo sencillo|Fes-ho senzill|Mantén-ho simple|Mantenlo simple|Simplicitat|Sencillesa/i.test(first), first);
    assert(/wins|manda|mana|preval|guanya|aquesta/i.test(first), first);
  }
});

test('dated PowerPoint retirement keeps original units while live sources route to editable decks', () => {
  const retired = ledger.retirements.powerpoint;
  assert.equal(retired.date, '2026-11-13');
  assert(retired.supersededRules.length >= 4);
  const current = ledger.rules.find(rule => rule.id === retired.currentRule);
  assert(current.rule.includes('closest deck') && current.rule.includes('presentation skill'));
  for (const id of retired.supersededRules) {
    const original = ledger.rules.find(rule => rule.id === id);
    assert.equal(original.status, 'superseded');
    assert.equal(original.supersededDate, '2026-11-13');
    assert.equal(original.archiveOnly, true);
    assert(original.rule && original.sources.length);
  }
  const rule = ledger.rules.find(rule => rule.id === ledger.coverPhotoDecision.currentRule);
  assert(rule.rule.includes('data-cover-ok is a last resort'));
  assert(rule.rule.includes('ulimit -v 3000000; nice -n 15 taskset -c 0-3'));
  assert.equal(rule.enforcedBy.length, 3);
});
