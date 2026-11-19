import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import { parse } from 'yaml';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..');
export const readJSON = (root, file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
export function validateManifests(root) {
  const errors = [], ajv = new Ajv({ strict: false });
  for (const name of ['plugin', 'mcp']) {
    const schema = readJSON(HERE, `schemas/${name}.schema.json`), value = readJSON(root, `${name}.json`);
    const check = ajv.compile(schema);
    if (!check(value)) errors.push(`${name}.json: ${ajv.errorsText(check.errors)}`);
  }
  const portable = readJSON(root, 'plugin.json'), claude = readJSON(root, '.claude-plugin/plugin.json'), mcp = readJSON(root, 'mcp.json');
  for (const manifest of [portable, claude]) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name) || manifest.name.length > 64) errors.push('Claude-compatible name required');
    if (typeof manifest.description !== 'string' || manifest.description.length > 500) errors.push('Manifest description must be at most 500 characters');
  }
  if (portable.name !== claude.name || portable.version !== claude.version) errors.push('Manifest identity/version mismatch');
  if (!/^\d+\.\d+\.\d+$/.test(portable.version)) errors.push('Release needs a semantic version');
  const openai = portable.extensions?.['com.openai'];
  if (!openai || !openai.onboardingSkill?.startsWith('./') || !fs.existsSync(path.join(root, openai.onboardingSkill))) errors.push('OpenAI onboarding skill missing');
  const studio = mcp.mcpServers.studio, remote = mcp.mcpServers.design;
  if (studio?.type !== 'stdio' || studio.command !== 'node' || !studio.args.includes('${PLUGIN_ROOT}/mcp/start.mjs')) errors.push('Portable studio entry invalid');
  for (const value of [...(studio?.args ?? []), ...Object.values(studio?.env ?? {})]) {
    if ([...value.matchAll(/\$\{([^}]+)\}/g)].some(([, v]) => !['PLUGIN_ROOT', 'PLUGIN_DATA'].includes(v))) errors.push('Nonportable variable in portable MCP');
  }
  if (remote?.type !== 'streamable-http' || remote.url !== 'https://design.aisgroup.ai/mcp') errors.push('Hosted MCP entry invalid');
  if (remote?.headers?.Authorization !== 'Bearer ${AIS_MCP_TOKEN}') errors.push('Portable hosted MCP must send its bearer token');
  if (claude.userConfig?.designToken?.sensitive !== true || claude.mcpServers?.design?.headers?.Authorization !== 'Bearer ${user_config.designToken}') errors.push('Claude hosted MCP must send the keychain token');
  if (claude.userConfig?.mediaLibrary?.type !== 'string' || claude.mcpServers?.studio?.env?.AIS_MEDIA_LIBRARY !== '${user_config.mediaLibrary}') errors.push('Claude media library behaviour lost');
  if (claude.mcpServers?.studio?.args?.[0] !== '${CLAUDE_PLUGIN_ROOT}/mcp/start.mjs') errors.push('Claude studio entry invalid');
  return [...errors, ...validateHooks(root)];
}

// hooks/hooks.json (Claude Code loads it from the plugin root): the event map under a top-level "hooks" key, and every
// command runs a file the plugin ships, its ${CLAUDE_PLUGIN_ROOT} quoted.
export function validateHooks(root) {
  if (!fs.existsSync(path.join(root, 'hooks/hooks.json'))) return [];
  let hooks;
  try { ({ hooks } = readJSON(root, 'hooks/hooks.json')); } catch (e) { return [`hooks/hooks.json: ${e.message}`]; }
  if (!hooks || typeof hooks !== 'object' || Array.isArray(hooks)) return ['hooks/hooks.json needs its events under a top-level "hooks" object'];
  const errors = [];
  for (const [event, groups] of Object.entries(hooks)) for (const h of (Array.isArray(groups) ? groups : []).flatMap((g) => g.hooks ?? [])) {
    if (h.type !== 'command' || typeof h.command !== 'string') { errors.push(`hooks/hooks.json ${event}: only command hooks`); continue; }
    if (/\$\{CLAUDE_PLUGIN_ROOT\}/.test(h.command.replace(/"\$\{CLAUDE_PLUGIN_ROOT\}[^"]*"/g, ''))) errors.push(`hooks/hooks.json ${event}: quote \${CLAUDE_PLUGIN_ROOT}`);
    for (const [, file] of h.command.matchAll(/"\$\{CLAUDE_PLUGIN_ROOT\}\/([^"]+)"/g)) if (!fs.existsSync(path.join(root, file))) errors.push(`hooks/hooks.json ${event}: runs ${file}, which the plugin does not have`);
  }
  if (!Object.values(hooks).flat().length) errors.push('hooks/hooks.json has no hooks');
  return errors;
}

export function validateSkills(root) {
  const errors = [], bodies = new Map(), paragraphs = new Map();
  const names = new Set();
  let count = 0, maxLines = 0, maxTokens = 0;
  for (const dir of fs.readdirSync(path.join(root, 'skills'))) {
    const file = path.join(root, 'skills', dir, 'SKILL.md');
    if (!fs.existsSync(file)) continue;
    count++;
    const text = fs.readFileSync(file, 'utf8'), match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) { errors.push(`${dir}: missing frontmatter`); continue; }
    let meta;
    try { meta = parse(match[1]); } catch (e) { errors.push(`${dir}: ${e.message}`); continue; }
    if (meta.name !== dir || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.name) || meta.name.length > 64) errors.push(`${dir}: invalid skill name`);
    if (names.has(meta.name)) errors.push(`${dir}: duplicate skill name`);
    names.add(meta.name);
    if (typeof meta.description !== 'string' || !meta.description.length || meta.description.length > 1024 || /<[^>]+>/.test(meta.description + meta.name)) errors.push(`${dir}: invalid skill description`);
    const lines = text.split('\n').length, tokens = Math.ceil(match[2].length / 4);
    maxLines = Math.max(maxLines, lines); maxTokens = Math.max(maxTokens, tokens);
    if (lines >= 500 || tokens >= 5000) errors.push(`${dir}: skill too large (${lines} lines, ~${tokens} tokens)`);
    const body = match[2].trim();
    if (bodies.has(body)) errors.push(`${dir}: duplicates ${bodies.get(body)}`);
    bodies.set(body, dir);
    // Substantial duplicated paragraphs are reported separately. The common essential is intentional.
    for (const p of body.split(/\n\s*\n/).filter(p => p.length > 300 && !p.includes('**Keep it simple:**') && !p.startsWith('Apply the [writing essentials'))) {
      const key = p.replace(/\s+/g, ' ').trim();
      if (paragraphs.has(key)) errors.push(`${dir}: duplicated substantive paragraph from ${paragraphs.get(key)}`);
      paragraphs.set(key, dir);
    }
    for (const [, target] of body.matchAll(/\]\((references\/[^)#]+)(?:#[^)]*)?\)/g)) {
      if (target.split('/').length !== 2 || !fs.existsSync(path.join(root, 'skills', dir, target))) errors.push(`${dir}: missing or nested reference ${target}`);
    }
  }
  return { errors, count, maxLines, maxTokens };
}

export function validateArchive(root) {
  const errors = [], files = fs.readdirSync(root, { recursive: true }).filter(f => fs.lstatSync(path.join(root, f)).isFile());
  let bytes = 0;
  if (files.filter(f => f.endsWith('.claude-plugin/plugin.json')).length !== 1) errors.push('Exactly one Claude manifest required');
  for (const f of files) {
    const stat = fs.lstatSync(path.join(root, f)); bytes += stat.size;
    if (f.startsWith('bin/') || /\.zip$/i.test(f)) errors.push(`Forbidden upload file: ${f}`);
    if (!/^[a-zA-Z0-9 _./(),-]+$/.test(f) || f.split('/').includes('..') || f.length > 472 || f.split('/').length > 12 || f.split('/').some(n => n.length > 255)) errors.push(`Invalid upload path: ${f}`);
  }
  if (fs.readdirSync(root, { recursive: true }).some(f => fs.lstatSync(path.join(root, f)).isSymbolicLink())) errors.push('Upload cannot contain symlinks');
  if (files.length > 5000 || bytes > 200_000_000) errors.push(`Upload too large: ${files.length} files, ${bytes} bytes`);
  return { errors, files: files.length, bytes };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv.find(a => a.startsWith('--root='))?.slice(7) ?? ROOT);
  const skills = validateSkills(root), archive = process.argv.includes('--archive') ? validateArchive(root) : { errors: [] };
  const errors = [...validateManifests(root), ...skills.errors, ...archive.errors];
  console.log(`${skills.count} skills; maximum ${skills.maxLines} lines, ~${skills.maxTokens} body tokens. ${errors.length} errors.`);
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
}
