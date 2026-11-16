import test from 'node:test';
import assert from 'node:assert/strict';
import { assets } from '../tools.mjs';
import { patternAssets } from '../../plugin/engine/linkedin-patterns.mjs';
const catalogue={assets:patternAssets().map(a=>({id:a.id,kind:'pattern',file:a.path.replace(/^brand\//,''),use:a.reason})), rules:{pattern:'Decorative grounds and accents for every medium; one per piece, clear of body text and tables.'}};
test('hosted retrieval preserves exact filenames and decorative usage rules',()=>{
 const result=assets({catalogue},{query:'linkedin circuit traces zip',kind:'pattern',surface:'social'},'http://localhost:9999');
 assert.equal(result.total,1); assert.equal(result.assets[0].url,'http://localhost:9999/files/downloads/linkedin-patterns/ais-linkedin-background-circuit-traces.zip');
 assert.match(result.assets[0].use,/Decorative grounds and accents for every medium/);
});
test('hosted request serves decorative patterns across every medium',()=>{
 for(const surface of ['print','office','deck','web','video','stand']) {const result=assets({catalogue},{query:'linkedin',kind:'pattern',surface},'http://localhost');assert.equal(result.total,365);}
});

test('retired Night colourway is absent from the hosted catalogue',()=>{
 assert.equal(assets({catalogue},{query:'night',kind:'pattern'},'http://localhost').total,0);
 assert(catalogue.assets.every(a=>!a.file.includes('texture-on-night')));
});
