#!/usr/bin/env node
// The tokens contract: the core values the products and the brand share must not drift apart.
// The products take them from packages/design/styles.css; the guide's marketing tokens are guide/public/downloads/ais-tokens.css
// and ais-tokens.json. This fails (exit 1) when any of these differs:
//   - the blue scale (50 to 950) and the neutral scale (0 to 900);
//   - the font family (the first family of each, "Inter Variable" counting as Inter);
//   - the status colours: success, warning and danger, in light and dark mode, and the solid fills.
// A change to one of them is made in both places in the same pull request.
//   node scripts/check-tokens.mjs        (part of npm test)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const PACKAGE = 'packages/design/styles.css', BRAND = 'guide/public/downloads/ais-tokens.css', TOKENS = 'guide/public/downloads/ais-tokens.json';

// The custom properties of each top-level block whose selector is exactly `sel` (':root', '.dark', 'html').
const block = (css, sel) => {
  const out = {};
  const plain = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of plain.matchAll(/(^|\n)\s*([^{}\n]+?)\s*\{([^{}]*)\}/g)) {
    if (m[2].trim() !== sel) continue;
    for (const d of m[3].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  }
  return out;
};
const pkgCss = read(PACKAGE);
const light = { ...block(pkgCss, ':root'), ...block(pkgCss, 'html') };
const dark = { ...light, ...block(pkgCss, '.dark') };
// A token's value with its var() references followed, in light or dark mode.
const resolve = (vars, name, seen = new Set()) => {
  const v = vars[name];
  if (v === undefined || seen.has(name)) return undefined;
  seen.add(name);
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(vars, ref[1], seen) : v;
};

const brand = block(read(BRAND), ':root');
const tokens = JSON.parse(read(TOKENS));
const hex = (t) => (t?.$value?.components ? '#' + t.$value.components.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('') : t?.$value);
const norm = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v);
const family = (v) => norm(String(Array.isArray(v) ? v[0] : v).split(',')[0].replace(/["']/g, '').replace(/\s+variable$/i, ''));

const checks = [];
const same = (what, ...values) => checks.push({ what, values, ok: values.every((v) => v !== undefined && norm(v) === norm(values[0])) });

for (const step of ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'])
  same(`blue-${step}`, light[`--blue-${step}`], brand[`--ais-blue-${step}`], hex(tokens.color.blue[step]));
for (const step of ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900'])
  same(`neutral-${step}`, light[`--neutral-${step}`], brand[`--ais-neutral-${step}`], hex(tokens.color.neutral[step]));
same('font family', family(light['--font-family']), family(brand['--ais-font-primary']), family(tokens.font.family.primary.$value));
const STATUS = [
  ['success', '--success', 'success'], ['warning', '--warning', 'warning'], ['danger', '--destructive', 'danger'],
];
for (const [name, product, ais] of STATUS) {
  same(`${name} (light)`, resolve(light, product), brand[`--ais-${ais}`], hex(tokens.color[ais]));
  same(`${name} (dark)`, resolve(dark, product), brand[`--ais-${ais}-dark`], hex(tokens.color[`${ais}-dark`]));
}
for (const [name, product] of [['success', '--success-solid'], ['warning', '--warning-solid'], ['danger', '--danger-solid']])
  same(`${name} solid`, resolve(light, product), brand[`--ais-${name}-solid`], hex(tokens.color[`${name}-solid`]));

const bad = checks.filter((c) => !c.ok);
if (bad.length) {
  console.error(`Tokens drifted between ${PACKAGE} and the guide's ${BRAND} / ${TOKENS}:`);
  for (const c of bad) console.error(`  ${c.what}: package ${c.values[0]}, ais-tokens.css ${c.values[1]}, ais-tokens.json ${c.values[2]}`);
  console.error('Change them in both places in the same pull request (see CONTRIBUTING.md).');
  process.exit(1);
}
console.log(`Tokens contract holds: ${checks.length} shared values agree between the package and the guide.`);
