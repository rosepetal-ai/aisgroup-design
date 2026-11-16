#!/usr/bin/env node
// The vendored packages must be exactly the version package.json names: fails (exit 1) when a file under
// src/vendor/<name>/ was edited, added or removed, or its version differs. Change them in their own repo and copy
// them again (design-system: npm run sync:sites), never here.
//   node scripts/check-vendor.mjs     (runs before every build)
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const filesOf = (dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((d) => d.isFile()).map((d) => path.relative(dir, path.join(d.parentPath ?? d.path, d.name)).split(path.sep).join('/')).sort();
// A copy's fingerprint: sha256 over every file's path and bytes, in path order.
export const fingerprint = (dir) => {
  const hash = crypto.createHash('sha256');
  for (const f of filesOf(dir)) hash.update(`${f}\n`).update(fs.readFileSync(path.join(dir, f)));
  return `sha256-${hash.digest('base64')}`;
};
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const errors = [];
  for (const [name, want] of Object.entries(pkg.vendor ?? {})) {
    const dir = path.join('src/vendor', name);
    if (!fs.existsSync(dir)) { errors.push(`${name}: src/vendor/${name} is missing.`); continue; }
    const version = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version;
    if (version !== want.version) errors.push(`${name}: the copy is ${version}, package.json wants ${want.version}.`);
    else if (fingerprint(dir) !== want.integrity) errors.push(`${name}: src/vendor/${name} differs from ${want.version}.`);
  }
  if (errors.length) { console.error(`Vendored packages changed:\n${errors.map((e) => `  - ${e}`).join('\n')}`); process.exit(1); }
  console.log(`Vendored packages hold: ${Object.entries(pkg.vendor ?? {}).map(([n, v]) => `${n} ${v.version}`).join(', ') || 'none'}.`);
}
