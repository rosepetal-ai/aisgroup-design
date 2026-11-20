// Runs at npm pack: copies the audit, its rule table, the states check and the files they read into core/, laid out as
// in the repo, so the published package needs nothing else. --clean removes them again (core/ is not committed).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(PACKAGE, '../..');
const CORE = path.join(PACKAGE, 'core');
export const FILES = [
  'scripts/ui-contract.mjs',
  'scripts/ui-rules.mjs',
  'scripts/ui-states.mjs',
  'scripts/official-logos.json',
  'packages/vue-themes/generate.mjs',
  'packages/design/styles.css',
  'packages/design/ui/button/index.ts',
  'packages/design/ui/badge/index.ts',
  // The registry as an app installs it: the audit compares stock copies with it, and sync restores them from it.
  'plugin/brand/registry',
];

export function bundle(out = CORE) {
  fs.rmSync(out, { recursive: true, force: true });
  for (const file of FILES) {
    fs.mkdirSync(path.dirname(path.join(out, file)), { recursive: true });
    fs.cpSync(path.join(REPO, file), path.join(out, file), { recursive: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--clean')) fs.rmSync(CORE, { recursive: true, force: true });
  else bundle();
}
