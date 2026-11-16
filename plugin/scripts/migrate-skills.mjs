// Dry-run by default. Preserve the previous installed tree outside discovery.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { SKILL_PATH_ALIASES } from '../skill-routes.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function migrateSkills(target, { source = path.join(ROOT, 'skills'), apply = false } = {}) {
  target = path.resolve(target); source = path.resolve(source);
  const destination = path.join(target, 'skills');
  if (!fs.existsSync(path.join(target, '.claude-plugin/plugin.json')) && !fs.existsSync(path.join(target, 'plugin.json'))) throw Error('Target must be an existing AIS plugin root');
  if (destination === source || source.startsWith(destination + path.sep)) throw Error('Source must be separate from the installed target');
  const names = fs.readdirSync(source).filter(n => fs.existsSync(path.join(source, n, 'SKILL.md'))).sort();
  if (names.length !== 26 || names.includes('writing')) throw Error('Expected the canonical 26-skill source');
  for (const next of Object.values(SKILL_PATH_ALIASES)) if (!fs.existsSync(path.join(source, next))) throw Error(`Missing compatibility destination: ${next}`);
  const previous = fs.existsSync(destination) ? fs.readdirSync(destination).filter(n => fs.existsSync(path.join(destination, n, 'SKILL.md'))).sort() : [];
  const report = { target, source, previous, skills: names, aliases: SKILL_PATH_ALIASES, applied: apply, backup: null };
  if (!apply) return report;
  const stage = fs.mkdtempSync(path.join(target, '.skills-stage-'));
  const previousPath = path.join(stage, 'previous');
  try {
    fs.cpSync(source, path.join(stage, 'next'), { recursive: true });
    if (fs.existsSync(destination)) fs.renameSync(destination, previousPath);
    try { fs.renameSync(path.join(stage, 'next'), destination); }
    catch (error) { if (fs.existsSync(previousPath)) fs.renameSync(previousPath, destination); throw error; }
    const history = path.join(os.homedir(), '.cache/ais-skill-migrations', path.basename(stage));
    if (fs.existsSync(previousPath)) {
      fs.mkdirSync(path.dirname(history), { recursive: true });
      try { fs.renameSync(previousPath, history); }
      catch (error) { if (error.code !== 'EXDEV') throw error; fs.cpSync(previousPath, history, { recursive: true }); fs.rmSync(previousPath, { recursive: true }); }
      report.backup = history;
    }
    if (report.backup) fs.writeFileSync(path.join(report.backup, 'migration.json'), JSON.stringify(report, null, 2) + '\n');
  } finally { if (!fs.existsSync(previousPath)) fs.rmSync(stage, { recursive: true, force: true }); }
  return report;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const option = key => { const i = process.argv.indexOf(key); return i < 0 ? undefined : process.argv[i + 1]; };
  const target = option('--target'); if (!target) throw Error('Use --target <installed-plugin-root> [--source <skills-directory>] [--apply]');
  console.log(JSON.stringify(migrateSkills(target, { source: option('--source'), apply: process.argv.includes('--apply') }), null, 2));
}
