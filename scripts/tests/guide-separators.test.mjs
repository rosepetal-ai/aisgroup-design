import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkSeparators } from '../../guide/scripts/check-separators.mjs';
test('guide check rejects literal and encoded separators, accepts Catalan spelling', () => {
 const dir=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-separators-'));
 try {
  const f=path.join(dir,'page.html');
  for(const text of ['PDF\u00b7ES','PDF \u00b7 ES','PDF &middot; ES','PDF &#183; ES','PDF &#xB7; ES']) {fs.writeFileSync(f,text);assert.throws(()=>checkSeparators([dir]),/forbidden/);}
  fs.writeFileSync(f,'Col·laboració, intel·ligent, Il·lustració, sol·licita, l·l.');assert.doesNotThrow(()=>checkSeparators([dir]));
 } finally {fs.rmSync(dir,{recursive:true});}
});
