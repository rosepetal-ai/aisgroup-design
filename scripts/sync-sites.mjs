#!/usr/bin/env node
// Brings @aisgroup/web up to date and copies it into the three websites.
//   1. packages/web/brand.css becomes the guide's ais-tokens.css (guide/public/downloads/ais-tokens.css), the one source of the core tokens.
//   2. Each site gets the package's files at src/vendor/@aisgroup/web/, its fingerprint in package.json
//      ("vendor": { "@aisgroup/web": { version, integrity } }) and scripts/check-vendor.mjs, which its build runs first.
// The sites sit next to this repo (../../websites); SITES_DIR points elsewhere.
//   npm run sync:sites
// ponytail: the sites vendor the package until it is published; then each adds "@aisgroup/web" at a pinned version
// (GitHub Packages), deletes src/vendor/@aisgroup/web, the alias in astro.config.mjs and scripts/check-vendor.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint } from './check-vendor.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'packages/web');
export const SITES_DIR = process.env.SITES_DIR ?? path.resolve(ROOT, '../../websites');
export const SITES = ['aisvision-web-aisgroup', 'aisvision-web-aisvision', 'rosepetal-web-static/astro'];

fs.copyFileSync(path.join(ROOT, 'guide/public/downloads/ais-tokens.css'), path.join(PKG, 'brand.css'));
const pkg = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8'));
const check = fs.readFileSync(path.join(ROOT, 'scripts/check-vendor.mjs'), 'utf8');

for (const site of SITES) {
  const dir = path.join(SITES_DIR, site);
  if (!fs.existsSync(path.join(dir, 'package.json'))) { console.log(`${site}: not found, skipped.`); continue; }
  const target = path.join(dir, 'src/vendor/@aisgroup/web');
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  for (const entry of ['package.json', ...pkg.files]) fs.cpSync(path.join(PKG, entry), path.join(target, entry), { recursive: true });
  const sitePkgFile = path.join(dir, 'package.json');
  const sitePkg = JSON.parse(fs.readFileSync(sitePkgFile, 'utf8'));
  sitePkg.vendor = { ...sitePkg.vendor, '@aisgroup/web': { version: pkg.version, integrity: fingerprint(target) } };
  sitePkg.scripts = { ...sitePkg.scripts, prebuild: 'node scripts/check-vendor.mjs' };
  fs.writeFileSync(sitePkgFile, `${JSON.stringify(sitePkg, null, 2)}\n`);
  fs.mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'scripts/check-vendor.mjs'), check);
  console.log(`${site}: @aisgroup/web ${pkg.version} (${sitePkg.vendor['@aisgroup/web'].integrity}).`);
}
