// Checks recipes without rendering: structure, files, the library and the words. Fast enough to run on
// every edit. The layout and brand checks run when the recipe is rendered.
//
//   node engine/check.mjs work/hopper-launch/recipe.json
import path from 'node:path';
import { loadRecipe } from './recipe.mjs';

const files = process.argv.slice(2);
if (!files.length) { console.error('Usage: node engine/check.mjs <recipe.json> [more]'); process.exit(2); }
let failed = 0;
for (const f of files) {
  const { recipe: r, errors, warnings } = loadRecipe(f);
  console.log(`\n${path.relative(process.cwd(), r.file)}  (${r.kind}, ${r.brand}, ${r.lang})`);
  warnings.forEach((w) => console.log(`  warn   ${w}`));
  errors.forEach((e) => console.log(`  error  ${e}`));
  if (errors.length) failed++; else console.log(warnings.length ? '  No errors; review the warnings.' : '  Passed.');
}
process.exit(failed ? 1 : 0);
