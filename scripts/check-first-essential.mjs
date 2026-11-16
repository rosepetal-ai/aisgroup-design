// Run only in the same render-lock command as the guide build and hosted snapshot.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const dist = process.env.AIS_GUIDE_DIST || 'guide/dist';
for (const lang of ['en', 'es', 'ca']) {
  const text = fs.readFileSync(path.join(dist, lang, 'brand.md'), 'utf8');
  const first = text.match(/^1\. (.+)$/m)?.[1];
  assert(first && /Keep it simple|Hazlo simple|Fes-ho simple/.test(first), `${lang}: simplicity must be first`);
  assert(/wins|manda|mana/.test(first), `${lang}: simplicity must win conflicts`);
}
console.log('3 generated brand.md files: simplicity first and priority intact.');
