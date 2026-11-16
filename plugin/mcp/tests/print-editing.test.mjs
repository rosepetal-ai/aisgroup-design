import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { Factory, digest } from '../core.mjs';
import { compilePrint, preparePrint, printSource } from '../print.mjs';
import { smoke } from '../smoke.mjs';
import { STUDIO } from '../../engine/recipe.mjs';
import { needsMedia } from './needs.mjs';
const fixture=t=>{const f=new Factory({state:fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/wave3-test-')),schedule:()=>{}});t.after(()=>f.close());return f;};
const call=(f,n,a)=>f.call(n,a);
test('rejected compositions are not recommended but remain explicitly inspectable', { skip: needsMedia },t=>{
 const f=fixture(t);
 const rejected=f.assets.filter(a=>a.status==='rejected'&&a.family==='rosepetal-ui');
 assert.equal(rejected.length,8);
 const lookup=call(f,'search_library',{collection:'assets',query:'Rosepetal class review video'});
 assert(lookup.items.every(a=>a.status!=='rejected'));
 const route=call(f,'plan_piece',{intent:'Rosepetal image review video',kind:'video'});
 assert(route.assets.every(a=>a.status!=='rejected'));
 const audit=call(f,'search_library',{collection:'assets',query:'Rosepetal class review',filters:{status:'rejected',kind:'video'}});
 assert(audit.items.some(a=>rejected.some(r=>r.id===a.id)));
 assert(audit.items.every(a=>a.status==='rejected'));
 const inspected=call(f,'get_asset',{assetId:rejected[0].id});
 assert.equal(inspected.status,'rejected');assert(inspected.uri);assert.match(inspected.reason,/application layout/);
});
test('ranked canonical lookup names Cables/Hopper and keeps Compact/Pharma identity and states', { skip: needsMedia },t=>{
 const f=fixture(t);
 const route=call(f,'plan_piece',{intent:'Create a LinkedIn product post for AIS REV 360 Cables using existing image and source footage'});
 assert.equal(route.assets[0].id,'real-cables-factory');assert(route.assets.every(x=>x.product==='AIS REV 360 Cables'));assert.equal(route.assets[0].status,'review');
 for(const query of ['Hopper','Compact','Pharma']){
  const r=call(f,'search_library',{collection:'assets',query});assert(r.items.length);assert(r.items.every(x=>x.product.toLowerCase().includes(query.toLowerCase())));
 }
 const compact=call(f,'search_library',{collection:'assets',query:'Compact'});assert.equal(compact.items[0].product,'AIS REV 360 COMPACT');
 assert.equal(call(f,'search_library',{collection:'assets',query:'Compact Standard'}).total,0);
 const software=call(f,'search_library',{collection:'assets',query:'software'});assert(software.total);assert(software.items.every(x=>!x.id.startsWith('guide-machine')));
 assert.equal(call(f,'search_library',{collection:'assets',query:'unknownjellyfish'}).total,0);
 assert.equal(call(f,'search_library',{collection:'assets',filters:{product:'Unlisted product'}}).total,0);
 const rejected=call(f,'search_library',{collection:'assets',query:'Compact',filters:{status:'rejected',exists:true}});assert(rejected.items.length);assert(rejected.items.every(x=>x.status==='rejected'&&x.pathExists));
 const missing=call(f,'search_library',{collection:'assets',filters:{exists:false}});assert.equal(missing.total,f.assets.filter(x=>!fs.existsSync(path.resolve(STUDIO,x.path))).length);
 if(missing.total){const a=call(f,'get_asset',{assetId:missing.items[0].id});assert.equal(a.pathExists,false);assert.equal(a.uri,null);assert(a.reason);} // a clean library has none
 const registeredWork=f.assets.find(x=>x.path.startsWith('library/factory-library/assets/')&&fs.existsSync(path.join(STUDIO,x.path)));if(registeredWork)assert(call(f,'get_asset',{assetId:registeredWork.id}).uri.startsWith('file://'));
 const audit=JSON.parse(fs.readFileSync(path.join(STUDIO,'library/factory-library/asset-register.json')));assert.equal(audit.assets.find(x=>x.id==='real-cables-factory').product,route.assets[0].product);assert.equal(audit.assets.find(x=>x.id==='real-cables-factory').status,route.assets[0].status);
});
test('real sheet isolated text/longer copy/row/image changes, stale edits and dependency digests', { skip: needsMedia },t=>{
 const f=fixture(t), canonical=path.join(STUDIO,'pieces/datasheets/cables/cables.es.html'), original=digest(fs.readFileSync(canonical));
 let a=call(f,'edit_piece',{action:'copy',pieceId:'sheet',source:printSource});assert(a.valid);
 const dir=path.dirname(fileURLToPath(a.uri)), raw=JSON.parse(fs.readFileSync(fileURLToPath(a.uri)));
 assert.equal(compilePrint(raw,dir),fs.readFileSync(canonical,'utf8'));assert(fs.existsSync(path.join(dir,'deps/print/assets/Inter.ttf')));
 const baseline=a.digest;
 a=call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'text',field:'software_title',value:'Inspección y control de producción'},{op:'text',field:'software_lead',value:'Ajuste de recetas, análisis de imágenes y registro de resultados en un mismo entorno de producción. Consulta las imágenes para ajustar la receta de cada formato.'},{op:'row',field:'software',index:0,label:'Aprendizaje profundo',value:'Modelos precargados y entrenamiento con ejemplos mediante Rosepetal.'}]});assert(a.valid);
 assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:baseline,printChanges:[{op:'text',field:'lead',value:'stale'}]}),/Stale/);
 let b=JSON.parse(fs.readFileSync(fileURLToPath(a.uri)));let html=compilePrint(b,dir);assert(html.includes('Inspección y control de producción'));assert(!html.includes('>De la imagen a la acción<'));
 assert.equal(html.slice(0,html.indexOf('<section class="page inner" aria-label="Especificaciones técnicas">')),fs.readFileSync(canonical,'utf8').slice(0,fs.readFileSync(canonical,'utf8').indexOf('<section class="page inner" aria-label="Especificaciones técnicas">')));
 a=call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'image',field:'technical_image',value:'library/media/real/rev360-cables_factory-floor.jpg'}]});assert(a.valid);assert.notEqual(a.data.technical_image,raw.data.technical_image);
 const before=a.digest;
 const rejected=f.assets.find(x=>x.status==='rejected'&&x.path.startsWith('library/media/')&&/\.(png|jpg|webp)$/.test(x.path)&&fs.existsSync(path.join(STUDIO,x.path)));assert(rejected);
 assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'image',field:'screen',value:rejected.path}]}),/Rejected/);
 assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'text',field:'lang',value:'en'}]}),/Unsupported/);
 assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'image',field:'screen',value:'/etc/passwd'}]}));assert.equal(call(f,'edit_piece',{action:'inspect',pieceId:'sheet'}).digest,before);
 a=call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'append-row',field:'software',label:'Registro de inspección',value:'Consulta de imágenes y resultados por receta.',sourceNote:'Semantic adapter test only; not an approved additional product capability'}]});assert(a.valid);assert.equal(a.data.software.length,raw.data.software.length+1);
 html=compilePrint(JSON.parse(fs.readFileSync(fileURLToPath(a.uri))),dir);assert(html.includes('Registro de inspección'));assert(!html.includes('Semantic adapter test'));
 fs.appendFileSync(path.join(dir,'deps/print/system.css'),'\n/* changed dependency */');assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'text',field:'lead',value:'dependency stale'}]}),/Stale/);
 assert.equal(digest(fs.readFileSync(canonical)),original);
});
test('pinned print export uses exact existing renderer; profile rejects tampered HTML/dependencies',async t=>{
 const f=fixture(t);const descriptor=call(f,'read_instructions',{ref:'print:cables-technical-sheet'});assert(call(f,'read_instructions',{ref:'print:cables-technical-sheet',ifDigest:descriptor.digest}).unchanged);let a=call(f,'edit_piece',{action:'copy',pieceId:'sheet',source:printSource});
 const j=call(f,'export_piece',{action:'enqueue',pieceId:'sheet',operation:'render-pdf'}), dir=path.join(f.state,'jobs',j.id), raw=JSON.parse(fs.readFileSync(path.join(dir,'recipe.json')));
 a=call(f,'edit_piece',{action:'update',pieceId:'sheet',expectedDigest:a.digest,printChanges:[{op:'text',field:'software_title',value:'Changed after enqueue'}]});
 assert.notEqual(raw.data.software_title,a.data.software_title);
 const html=preparePrint(raw,dir);
 const validator=()=>spawnSync(process.execPath,[path.join(STUDIO,'mcp/validate-print.mjs'),dir],{encoding:'utf8'});
 assert.equal(validator().status,0);
 const command=['python3',path.join(STUDIO,'skills/_shared/scripts/safe_render.py'),'--profile','print-cables-a4','--check','--timeout','150','--',process.execPath,path.join(STUDIO,'print/render.mjs'),html];
 const check=spawnSync(command[0],command.slice(1),{encoding:'utf8'});assert([0,75].includes(check.status),check.stderr);const receipt=JSON.parse(check.stdout.trim());assert.equal(receipt.profile,'print-cables-a4');assert.equal(receipt.budget_mib,1024);assert.equal(receipt.check_only,true);
 fs.appendFileSync(html,'<script>bad()</script>');assert.notEqual(validator().status,0);const bad=spawnSync(command[0],command.slice(1),{encoding:'utf8'});assert.equal(bad.status,2);
 preparePrint(raw,dir);fs.appendFileSync(path.join(dir,'deps/print/system.css'),'body{}');assert.notEqual(validator().status,0);
 const missing=path.join(dir,'deps/print/assets/Inter.ttf');fs.unlinkSync(missing);assert.equal(call(f,'edit_piece',{action:'validate',pieceId:'sheet'}).valid,true);assert.notEqual(validator().status,0);assert.equal(f.check(raw,path.join(dir,'recipe.json')).valid,false);
 // Only the job snapshot is broken; the editable piece keeps its own intact dependencies.
 assert.equal(call(f,'export_piece',{action:'status',jobId:j.id}).state,'queued');
});

test('maintained official client scopes Cables print edit and retrieves validation artifact without renderer', { skip: needsMedia },async()=>{
 const e=await smoke({printValidate:true});assert.equal(e.printValidation.state,'succeeded');assert.equal(e.print,undefined);
 assert(e.printRoute.assets.every(a=>a.product==='AIS REV 360 Cables'));
 for(const a of e.printValidation.artifacts){assert.equal(digest(fs.readFileSync(fileURLToPath(a.uri))),a.digest);assert.equal(JSON.parse(fs.readFileSync(fileURLToPath(a.uri))).valid,true);}
 assert(!fs.existsSync(path.join(e.state,'owner.json')));
});
