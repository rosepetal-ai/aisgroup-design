// The first essential has one canonical skill owner; entrypoints and shared workflows point to it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ledger = JSON.parse(read('evals/rules-ledger.json'));
const essential = ledger.rules.find(rule => rule.id === 'AIS-cba1a88e1cbf');
const RULE = essential?.rule;
const PLAIN = RULE?.replace(/\*\*/g, '');

test('essential 1 of the guide is the main rule', () => {
  assert(RULE && /Linear’s website and Apple Notes are the bar/.test(RULE) && /When two rules disagree, this one wins\.$/.test(RULE), RULE);
});

test('simplicity has one canonical owner and every live skill points to it', () => {
  assert(essential?.owner.startsWith('skills/brand-guidelines/'));
  const files = fs.readdirSync(path.join(ROOT, 'skills'), { recursive: true }).filter(file => file.endsWith('.md'));
  const owners = files.filter(file => read(`skills/${file}`).split('\n').includes(RULE));
  assert.deepEqual(owners, [essential.owner.replace(/^skills\//, '')]);
  for (const directory of fs.readdirSync(path.join(ROOT, 'skills'))) {
    const file = `skills/${directory}/SKILL.md`;
    if (fs.existsSync(path.join(ROOT, file))) assert(read(file).includes(`#${essential.id.toLowerCase()}`), file);
  }
  for (const file of ['skills/_shared/WORKFLOW.md', 'skills/_shared/references/production-rules.md']) assert(read(file).includes(`#${essential.id.toLowerCase()}`), file);
});

test('the studio MCP states it in its instructions and plans; the hosted guide MCP points to it', () => {
  assert(read('mcp/server.mjs').includes(`const RULE = '${PLAIN}';`), 'mcp/server.mjs');
  assert(read('mcp/server.mjs').includes('const instructions = `${RULE}\n'), 'the local instructions open with it');
  assert(read('mcp/server.mjs').includes("{ rule: RULE, ...o }"), 'every plan_piece reply opens with it');
  // The hosted guide server keeps its 700-token budget: its brand.md opens with the rule, and its instructions point there.
  // In the monorepo the hosted server sits beside the plugin (../hosted).
  const hosted = fs.existsSync(path.join(ROOT, 'hosted/tools.mjs')) ? 'hosted/tools.mjs' : '../hosted/tools.mjs';
  assert(read(hosted).includes('Essential 1 (Keep it simple) wins.'), hosted);
});
