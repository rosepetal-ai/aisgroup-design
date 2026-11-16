import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readSkillSource } from '../skill-source.mjs';
test('hosted usage extraction follows a moved resource and canonical rule without changing either file', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-skill-source-'));
  try {
    fs.mkdirSync(path.join(root, 'skills/resources-assets/references'), { recursive: true });
    fs.mkdirSync(path.join(root, 'skills/brand-guidelines/references'), { recursive: true });
    fs.writeFileSync(path.join(root, 'skills/aliases.json'), JSON.stringify({'brand-guidelines/references/downloads.md':'resources-assets/references/downloads.md'}));
    const owner = path.join(root, 'skills/brand-guidelines/references/retained-rules-01.md');
    const exact = '<!-- AIS-abcdef123456 -->\n| Chart toolkit | Use the supplied config. |\n';
    fs.writeFileSync(owner, exact);
    fs.writeFileSync(path.join(root, 'skills/resources-assets/references/downloads.md'), 'Rule [AIS-abcdef123456](../../brand-guidelines/references/retained-rules-01.md#ais-abcdef123456).\n');
    assert.equal(readSkillSource(root, 'skills/brand-guidelines/references/downloads.md'), '| Chart toolkit | Use the supplied config. |\n');
    assert.equal(fs.readFileSync(owner, 'utf8'), exact);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
