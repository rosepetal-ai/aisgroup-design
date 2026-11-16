import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TOOLS } from '../download-tools.mjs';
test('the client examples in the resource skill use the actual public download schemas', () => {
  const doc = fs.readFileSync(new URL('../../plugin/skills/resources-assets/references/download-contract.md', import.meta.url), 'utf8');
  const examples = JSON.parse(doc.match(/```json\n([\s\S]*?)\n```/)[1]);
  assert.deepEqual([...new Set(examples.map(e => e.name))].sort(), Object.keys(TOOLS).sort());
  for (const example of examples) assert.deepEqual(TOOLS[example.name].schema.parse(example.arguments), example.arguments);
  assert(examples.some(e => e.name === 'design_examples' && e.arguments.type === 'software-view'));
});

test('optional asset surface does not change the current favicon or background response', () => {
  const catalogue = { rules: {favicon: 'Use supplied files', pattern: 'Across media'}, assets: [
    {id: 'web-icon', kind: 'favicon', use: 'web', file: 'icon.svg'},
    {id: 'header-pattern', kind: 'pattern', use: 'all media', file: 'pattern.svg'}
  ]};
  for (const kind of ['favicon', 'background']) {
    const args = TOOLS.design_assets.schema.parse({kind});
    const explicit = TOOLS.design_assets.schema.parse({kind, surface: 'web'});
    assert.deepEqual(TOOLS.design_assets.run({catalogue}, args, 'https://example.test'), TOOLS.design_assets.run({catalogue}, explicit, 'https://example.test'));
  }
});
