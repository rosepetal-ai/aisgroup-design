import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PATTERNS, COLOURWAYS, PATTERN_SIZES, patternFile, patternAssets } from '../../engine/linkedin-patterns.mjs';
import { checkRecipe, STUDIO } from '../../engine/recipe.mjs';
import { Factory } from '../core.mjs';
test('only approved combinations can select a decorative pattern', () => {
 for (const surface of ['print','office','deck','video','stationery','brochure']) assert.match(patternFile(PATTERNS[0],COLOURWAYS[0],PATTERN_SIZES[0],surface), /\.svg$/);
 for (const pattern of ['gentle','point','hexagon-landscape-gentle','../../scan-profiles']) assert.throws(() => patternFile(pattern,COLOURWAYS[0],PATTERN_SIZES[0],'post'));
 assert.throws(() => patternFile(PATTERNS[0],COLOURWAYS[0],'1584x396','post'), /surface/);
 assert.equal(patternAssets().length,365);
 assert(!COLOURWAYS.includes('texture-on-night'));
 assert.throws(() => patternFile(PATTERNS[0],'texture-on-night',PATTERN_SIZES[0],'print'), /Unapproved/);
 assert(patternAssets().every(a => !a.id.includes('night') && !a.path.includes('night')));
});
test('exact asset retrieval returns real pattern bytes and surface restrictions', t => {
 const state=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/pattern-test-'));
 const f=new Factory({state}); t.after(()=>{f.close();fs.rmSync(state,{recursive:true,force:true});});
 for (const a of patternAssets()) {
  const out=f.call('get_asset',{assetId:a.id});
  assert(out.pathExists,a.path); assert(out.uri?.startsWith('file://')); assert(out.bytes>0); assert.match(out.reason,/Decorative|Transparent/);
 }
});
test('recipe defaults remain unchanged; unsupported formats reject patterns; video and light and deep grounds select their matching variants', () => {
 const raw={name:'pattern-test',kind:'post',brand:'ais-group',lang:'en',formats:['4x5'],shots:[{type:'text',headline:'Quality inspection',bg:'blue'}]};
 assert.equal(checkRecipe(raw,STUDIO).recipe.shots[0].patternSources,undefined);
 const selected=checkRecipe({...raw,pattern:'scan-profiles'},STUDIO);
 assert(!selected.errors.some(e=>e.includes('pattern')),selected.errors.join('\n'));
 assert.match(selected.recipe.shots[0].patternSources['4x5'],/scan-profiles-white-on-blue-1080x1350.svg$/);
 for (const [bg,way] of [['grey','blue-on-grey'],['deep','white-on-deep-blue'],['white','blue-on-white']]) {
  const result=checkRecipe({...raw,pattern:'scan-profiles',shots:[{...raw.shots[0],bg}]},STUDIO);
  assert(!result.errors.some(e=>e.includes('pattern')),result.errors.join('\n'));assert(result.recipe.shots[0].patternSources['4x5'].includes(way));
 }
 const video=checkRecipe({...raw,kind:'video',formats:['16x9'],pattern:'scan-profiles'},STUDIO);assert(!video.errors.some(e=>e.includes('pattern')),video.errors.join('\n'));
 for (const change of [{formats:['191x1']},{pattern:'gentle'}]) assert(checkRecipe({...raw,pattern:'scan-profiles',...change},STUDIO).errors.some(e=>e.includes('pattern')));
});
test('MCP edits the existing social recipe and can restore its default', t => {
 const state=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/pattern-edit-'));
 const f=new Factory({state});t.after(()=>{f.close();fs.rmSync(state,{recursive:true,force:true});});
 const dir=path.join(state,'pieces','optional-pattern');fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'recipe.json'),JSON.stringify({kind:'post',name:'optional-pattern',brand:'ais-group',lang:'en',formats:['4x5'],shots:[{type:'text',headline:'Quality inspection',bg:'blue'}]}));
 const first=f.call('edit_piece',{action:'inspect',pieceId:'optional-pattern'});
 const edited=f.call('edit_piece',{action:'update',pieceId:'optional-pattern',expectedDigest:first.digest,changes:[{field:'pattern',value:'scan-profiles'}]});
 assert.equal(edited.shot.pattern,'scan-profiles');
 const cleared=f.call('edit_piece',{action:'update',pieceId:'optional-pattern',expectedDigest:edited.digest,changes:[{field:'pattern',value:'none'}]});
 assert.equal(cleared.shot.pattern,'none');
 assert.throws(()=>f.call('edit_piece',{action:'update',pieceId:'optional-pattern',expectedDigest:cleared.digest,changes:[{field:'pattern',value:'gentle'}]}),/Unapproved/);
});
