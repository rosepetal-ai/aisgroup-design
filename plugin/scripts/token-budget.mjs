#!/usr/bin/env node
// What the plugin costs every session (skill names and descriptions, MCP instructions and tool schemas) and what
// each skill costs when it fires. Fails above budget, so the plugin can't quietly grow into everyone's usage.
//   npm run budget
// ponytail: ~4 characters per token, close enough for a budget; swap in a tokenizer if a limit gets tight.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Always loaded: the skill list and the MCP instructions. Tool schemas: loaded up front, or only when needed if the
// client defers MCP tools (Claude Code's tool search), so they get their own budget.
const BUDGET = { alwaysOn: 800, schemas: 1100, skill: 2500 };
const tok = (s) => Math.ceil(s.length / 4);

const skills = fs.readdirSync(path.join(ROOT, 'skills')).filter((d) => fs.existsSync(path.join(ROOT, 'skills', d, 'SKILL.md'))).map((d) => {
  const text = fs.readFileSync(path.join(ROOT, 'skills', d, 'SKILL.md'), 'utf8');
  const description = text.match(/^description: (.*)$/m)?.[1] ?? '';
  return { name: d, listed: tok(d + description), body: tok(text) };
});

const state = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-budget-'));
const client = new Client({ name: 'token-budget', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(ROOT, 'mcp/server.mjs')], cwd: ROOT, env: { PATH: process.env.PATH, HOME: os.homedir(), AIS_MCP_STATE: state }, stderr: 'ignore' }));
const instructions = tok(client.getInstructions() ?? '');
const tools = (await client.listTools()).tools.map((t) => ({ name: t.name, cost: tok(JSON.stringify(t)) }));
await client.close();
fs.rmSync(state, { recursive: true, force: true });

const commandsDir = path.join(ROOT, 'commands');
const commands = fs.existsSync(commandsDir) ? fs.readdirSync(commandsDir).filter(file => file.endsWith('.md')).map(file => {
  const text = fs.readFileSync(path.join(commandsDir, file), 'utf8');
  return tok(path.basename(file, '.md') + (text.match(/^description: (.*)$/m)?.[1] ?? ''));
}) : [];
const commandTokens = commands.reduce((a, b) => a + b, 0);
const listed = skills.reduce((n, s) => n + s.listed, 0) + commandTokens, schemas = tools.reduce((n, t) => n + t.cost, 0);
const alwaysOn = listed + instructions;
console.log(`Every session: ~${alwaysOn} tokens (skill/compatibility command list ${listed}, MCP instructions ${instructions}); budget ${BUDGET.alwaysOn}`);
console.log(`MCP tool schemas: ~${schemas} tokens; budget ${BUDGET.schemas}`);
for (const t of tools.sort((a, b) => b.cost - a.cost)) console.log(`  ${t.name.padEnd(22)} ${t.cost}`);
console.log('When a skill fires:');
for (const s of skills.sort((a, b) => b.body - a.body)) console.log(`  ${s.name.padEnd(22)} ${s.body}${s.body > BUDGET.skill ? '  OVER' : ''}`);
const over = alwaysOn > BUDGET.alwaysOn || schemas > BUDGET.schemas || skills.some((s) => s.body > BUDGET.skill);
if (over) { console.error('Over budget.'); process.exit(1); }
