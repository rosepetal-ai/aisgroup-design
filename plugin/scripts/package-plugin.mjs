// Build an upload artifact, never publish it. Runtime dependencies are installed with the setup skill.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT, validateManifests, validateSkills, validateArchive } from './validate-plugin.mjs';
import { checkLedger } from './rules-ledger.mjs';

export function packagePlugin(dest, { zip = false, proposed = true } = {}) {
  if (fs.existsSync(dest)) throw new Error(`Destination already exists: ${dest}`);
  const result = spawnSync('git', ['ls-files', '-z', '--', '.'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status) throw new Error(result.stderr);
  // Large photo masters and ZIP bundles remain downloadable from the hosted catalogue. Business cards are private.
  const excluded = /^(?:brand\/library\/|brand\/imagery\/|brand\/kit\/fonts\/|brand\/illustrations\/|brand\/downloads\/video\/|brand\/downloads\/linkedin-patterns\/|brand\/kit\/files\/|brand\/kit\/office\/|pieces\/posts\/|pieces\/patterns\/|library\/factory-library\/assets\/|pieces\/stationery\/business-cards\/)|\.zip$|(?:^|\/)\.env(?:\.|$)/i;
  for (const file of result.stdout.split('\0').filter(Boolean)) {
    if (excluded.test(file) || (file.startsWith('pieces/posts/') && /\.(?:png|jpe?g|webp|mp4)$/i.test(file))) continue;
    const src = path.join(ROOT, file), stat = fs.lstatSync(src);
    if (stat.isSymbolicLink()) {
      const target = fs.realpathSync(src);
      if (!target.startsWith(ROOT + path.sep)) throw new Error(`External upload symlink: ${file}`);
      fs.cpSync(target, path.join(dest, file), { recursive: true, dereference: true });
      continue;
    }
    if (!stat.isFile()) throw new Error(`Not a regular file: ${file}`);
    fs.mkdirSync(path.dirname(path.join(dest, file)), { recursive: true }); fs.copyFileSync(src, path.join(dest, file));
  }
  if (proposed) {
    // The live skills are the tree: ship them as they are. The ledger check proves no rule was lost; re-running
    // `retain` here would turn readable references back into pointer lists.
    const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals/rules-ledger.json')));
    const retained = checkLedger(dest, ledger);
    if (retained.errors.length) throw new Error(retained.errors.join('\n'));
    // The installed audit and theme-diff commands need canonical token inputs as well as the hosted downloads.
    const repo = path.resolve(ROOT, '..');
    fs.cpSync(path.join(repo, 'packages/vue-themes'), path.join(dest, 'packages/vue-themes'), { recursive: true });
    fs.mkdirSync(path.join(dest, 'packages/design'), { recursive: true });
    fs.copyFileSync(path.join(repo, 'packages/design/styles.css'), path.join(dest, 'packages/design/styles.css'));
    for (const f of ['scripts/ui-contract.mjs', 'scripts/ui-rules.mjs', 'scripts/ui-states.mjs', 'packages/design/ui/button/index.ts', 'packages/design/ui/badge/index.ts']) {
      fs.mkdirSync(path.dirname(path.join(dest, f)), { recursive: true });
      fs.copyFileSync(path.join(repo, f), path.join(dest, f));
    }
  }
  // Cached downloads are links in the upload; the full Git/Claude Code distribution retains the local originals.
  for (const file of fs.readdirSync(path.join(dest, 'skills'), { recursive: true }).filter(f => f.endsWith('.md') && !/(?:retained-(?:rules|updates)-\d+|writing-essentials)\.md$/.test(f))) {
    const at = path.join(dest, 'skills', file), body = fs.readFileSync(at, 'utf8');
    fs.writeFileSync(at, body.replace(/\]\(([^)#]+)(#[^)]*)?\)/g, (all, link, fragment = '') => {
      if (/^(?:https?:|\/|#)/.test(link)) return all;
      const target = path.resolve(path.dirname(at), link), brand = path.join(dest, 'brand') + path.sep;
      return target.startsWith(brand) && !fs.existsSync(target) ? `](https://aisgroup-design.web.app/${path.relative(path.join(dest, 'brand'), target)}${fragment})` : all;
    }));
  }
  const retained = checkLedger(dest, JSON.parse(fs.readFileSync(path.join(ROOT, 'evals/rules-ledger.json'))));
  if (retained.errors.length) throw new Error(retained.errors.join('\n'));
  const archive = validateArchive(dest), skills = validateSkills(dest);
  const errors = [...validateManifests(dest), ...skills.errors, ...archive.errors];
  if (errors.length) throw new Error(errors.join('\n'));
  if (zip) {
    const run = spawnSync('python3', ['-c', 'import shutil,sys; shutil.make_archive(sys.argv[1], "zip", sys.argv[2])', dest, dest], { encoding: 'utf8' });
    if (run.status) throw new Error(run.stderr);
    if (fs.statSync(dest + '.zip').size > 200 * 1024 * 1024) throw new Error('Compressed archive exceeds upload limit');
  }
  return { ...archive, skills: skills.count, proposed };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dest = process.argv.find(a => a.startsWith('--out='))?.slice(6) ?? path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ais-plugin-')), 'ais-group-design');
  console.log(JSON.stringify({ path: dest + '.zip', ...packagePlugin(dest, { zip: true }) }));
}
