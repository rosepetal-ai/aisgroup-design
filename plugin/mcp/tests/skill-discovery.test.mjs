import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { Factory } from '../core.mjs';

test('studio discovers every packaged skill and can read its own references', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-skill-discovery-'));
  const factory = new Factory({ state: dir });
  try {
    const expected = fs.readdirSync(path.join(root, 'skills')).filter(name => fs.existsSync(path.join(root, 'skills', name, 'SKILL.md'))).sort();
    assert.deepEqual(factory.skills.map(s => s.id), expected);
    const result = factory.read({ ref: 'skill:product-ui/references/using-components.md', offset: 0, chars: 2000 });
    assert(result.text.length > 100);
    assert.match(factory.read({ ref: 'shared:studio-protocol.md', offset: 0, chars: 2000 }).text, /Start with plan_piece/);
  } finally { factory.close(); fs.rmSync(dir, { recursive: true, force: true }); }
});
