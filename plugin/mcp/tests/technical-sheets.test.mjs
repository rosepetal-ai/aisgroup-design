import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { Factory, digest } from '../core.mjs';
import { compilePrint, preparePrint, printFamily, printDescriptor } from '../print.mjs';
import { STUDIO } from '../../engine/recipe.mjs';
import { smoke } from '../smoke.mjs';
import { pinned } from '../pin-print.mjs';
import { needsMedia } from './needs.mjs';

test('the registry matches the technical sheets on disk',()=>{
 const {changes}=pinned();assert.deepEqual(changes,[],'A sheet changed without re-pinning. Check the rebuilt PDFs, then run: npm run mcp:pin');
});
const fixture=t=>{const f=new Factory({state:fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/wave4-test-')),schedule:()=>{}});t.after(()=>f.close());return f;};
const call=(f,n,a)=>f.call(n,a);
const load=a=>JSON.parse(fs.readFileSync(fileURLToPath(a.uri)));
const guard=(html,profile='print-family-a4')=>spawnSync('python3',[path.join(STUDIO,'skills/_shared/scripts/safe_render.py'),'--profile',profile,'--check','--timeout','150','--',process.execPath,path.join(STUDIO,'print/render.mjs'),html],{encoding:'utf8'});

test('all seven registered sheet paths preserve source parity, identities, conditions, layouts and pinned guard admission', { skip: needsMedia },t=>{
 const f=fixture(t),matrix=[];
 for(const [key,c] of Object.entries(printFamily.products)){
  let a=call(f,'edit_piece',{action:'copy',pieceId:key,source:c.source});assert(a.valid,key+JSON.stringify(a));
  const dir=path.dirname(fileURLToPath(a.uri)),raw=load(a),source=fs.readFileSync(path.join(STUDIO,c.template),'utf8');
  assert.equal(compilePrint(raw,dir),source);assert.equal(raw.data.name,c.name);assert.equal(a.descriptor,'print:'+key+'-technical-sheet');
  const m=JSON.parse(fs.readFileSync(path.join(dir,'dependencies.json')));assert.equal(m.sourceDigest,digest(source));assert.equal(m.product,key);
  const descriptor=printDescriptor(key);assert.equal(descriptor.source,c.source);assert(descriptor.textFields.some(x=>x.id==='cover_headline'&&x.page===1));assert(descriptor.textFields.some(x=>x.id==='inspection_lead'&&x.page===2));
  for(const field of ['technical_image','screen'])if(raw.data[field]!=null)assert(source.includes('assets/'+raw.data[field])); // Conservas has no software view
  // Layouts come from the pinned registry (npm run mcp:pin), not from snapshots of one sheet's markup.
  const L=c.layout;if(L.software_layout==='evidence-and-options')assert(source.includes(`<div class="split block"><figure class="${L.screen_fit==='contain'?'photo cutout':'photo'}" style="--h:${L.screen_height}mm`),key);
  if(L.technical_half)assert(source.includes(`<div class="split${L.technical_wide?' wide':''} block grow"><figure class="${L.technical_fit==='contain'?'photo cutout':'photo'} grow" style="--pad:0mm;--h:${L.technical_half}mm">`),key);else assert(source.includes(`${L.technical_fit==='contain'?'photo cutout':'photo'} grow block`),key);
  a=call(f,'edit_piece',{action:'update',pieceId:key,expectedDigest:a.digest,printChanges:[{op:'text',field:'cover_headline',value:raw.data.cover_headline+' / Equipo'},{op:'text',field:'inspection_lead',value:raw.data.inspection_lead+' Consulta la receta.'},{op:'text',field:'software_lead',value:raw.data.software_lead+' Consulta las imágenes y los resultados de la receta.'}]});assert(a.valid,key+JSON.stringify(a));
  const edited=load(a),html=compilePrint(edited,dir);assert(html.includes(edited.data.cover_headline));assert(html.includes(edited.data.inspection_lead));assert(html.includes(c.name));assert.deepEqual(edited.data.fields,raw.data.fields);assert.deepEqual(edited.data.installation,raw.data.installation);assert.equal(edited.data.technical_image,raw.data.technical_image);
  // Exercise all three list binders with actual retained source values, not synthetic rows.
  const changed=call(f,'edit_piece',{action:'update',pieceId:key,expectedDigest:a.digest,printChanges:['fields','installation','software'].map(field=>({op:'row',field,index:0,label:raw.data[field][0][0]+' / Configuración',value:raw.data[field][0][1]}))});assert(changed.valid,key+JSON.stringify(changed));
  const rowHtml=compilePrint(load(changed),dir);for(const field of ['fields','installation','software'])assert(rowHtml.includes(raw.data[field][0][0]+' / Configuración'));
  // Every member pins its own input path and refuses arbitrary renderer flags/HTML.
  const j=call(f,'export_piece',{action:'enqueue',pieceId:key,operation:'render-pdf'}),jobDir=path.join(f.state,'jobs',j.id),generated=preparePrint(load(changed),jobDir),g=guard(generated);
  assert([0,75].includes(g.status),key+g.stderr);const receipt=JSON.parse(g.stdout.trim());assert.equal(receipt.budget_mib,1024);assert.equal(receipt.reserve_gib,2);assert.equal(receipt.check_only,true);
  if(key!=='cables')assert.equal(guard(generated,'print-cables-a4').status,2);
  call(f,'export_piece',{action:'cancel',jobId:j.id});
  matrix.push({product:key,name:c.name,source:c.source,sourceDigest:m.sourceDigest,dataDigest:m.dataDigest,sourceParity:true,originalImages:[raw.data.technical_image,raw.data.screen],layout:c.layout,piece:a.uri,manifest:path.join(dir,'dependencies.json'),jobDir,guard:receipt,sourceEditOnly:true});
 }
 const evidence=path.join(os.homedir(),'.cache/ais-group-design/factory-mcp-wave4-evidence');fs.mkdirSync(evidence,{recursive:true});
 fs.writeFileSync(path.join(evidence,'family-source-matrix.json'),JSON.stringify(matrix,null,2));
 assert.equal(call(f,'search_library',{collection:'templates',query:'technical-sheet'}).total,7);
 for(const key of Object.keys(printFamily.products))assert(call(f,'plan_piece',{intent:'Edit '+key+' technical sheet',kind:'document'}).templates.some(x=>x.source===printFamily.products[key].source));
 assert.throws(()=>call(f,'edit_piece',{action:'copy',pieceId:'english',source:'datasheets/data.json#opticais.en'}),/Unsupported.*language/);
});

test('cover/inspection escaping, duplicate Pharma alt bindings, real registered image bytes and long-copy refusal', { skip: needsMedia },t=>{
 const f=fixture(t);let a=call(f,'edit_piece',{action:'copy',pieceId:'pharma',source:printFamily.products.pharma.source});
 a=call(f,'edit_piece',{action:'update',pieceId:'pharma',expectedDigest:a.digest,printChanges:[{op:'text',field:'cover_headline',value:'Lectura & control <por receta>'},{op:'text',field:'inspection_title',value:'Control del etiquetado'},{op:'text',field:'screen_alt',value:'Envases farmacéuticos con etiqueta'}]});assert(a.valid);
 const dir=path.dirname(fileURLToPath(a.uri));let h=compilePrint(load(a),dir);assert(h.includes('Lectura &amp; control &lt;por receta&gt;'));assert(h.includes('alt="Envases farmacéuticos con etiqueta"'));assert(!h.includes('alt="Viales etiquetados con cierre azul"')); // the 2026-11-02 sheet has one screen alt, now replaced
 const old=a.digest;
 const rejected=call(f,'edit_piece',{action:'update',pieceId:'pharma',expectedDigest:old,printChanges:[{op:'text',field:'inspection_lead',value:'Mucho texto '.repeat(140)}]});assert.equal(rejected.updated,false);assert.match(rejected.errors[0],/continuation/);assert.equal(call(f,'edit_piece',{action:'inspect',pieceId:'pharma'}).digest,old);
 let b=call(f,'edit_piece',{action:'copy',pieceId:'hopper',source:printFamily.products.hopper.source});
 const selected=call(f,'get_asset',{assetId:'real-hopper-line'});assert.equal(selected.product,'AIS Hopper');assert.notEqual(selected.status,'rejected');
 b=call(f,'edit_piece',{action:'update',pieceId:'hopper',expectedDigest:b.digest,printChanges:[{op:'image',field:'cover_image',value:'library/media/real/hopper_water-line.jpg'},{op:'text',field:'cover_alt',value:'AIS Hopper en una línea de agua'}]});assert(b.valid);
 const image=path.join(path.dirname(fileURLToPath(b.uri)),'deps/pieces/datasheets/hopper/assets',b.data.cover_image);assert.equal(digest(fs.readFileSync(image)),digest(fs.readFileSync(fileURLToPath(selected.uri))));assert.equal(b.product,'AIS Hopper');
 assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'hopper',expectedDigest:old,printChanges:[{op:'text',field:'lead',value:'stale'}]}),/Stale/);
});

test('source-backed split retains every software condition; data/baseline/dependencies/generated HTML are guarded',t=>{
 const f=fixture(t);let a=call(f,'edit_piece',{action:'copy',pieceId:'ocr',source:printFamily.products.opticais.source}),original=load(a);
 a=call(f,'edit_piece',{action:'update',pieceId:'ocr',expectedDigest:a.digest,printChanges:[{op:'row',field:'software',index:0,label:'OCR y códigos',value:'Campos OCR, 1D y 2D ilimitados; el número de campos influye en la cadencia.'},{op:'append-row',field:'software',label:'Condición de lectura',value:'Los caracteres no deben tocarse',sourceNote:'data.json#opticais software[0], split existing exact sentence.'}]});assert(a.valid);const dir=path.dirname(fileURLToPath(a.uri)),raw=load(a);
 assert.equal(raw.data.software[0][1]+' '+raw.data.software.at(-1)[1],original.data.software[0][1]);assert.equal(raw.data.software.length,5);assert(!compilePrint(raw,dir).includes('data.json#opticais'));
 const j=call(f,'export_piece',{action:'enqueue',pieceId:'ocr',operation:'render-pdf'}),jobDir=path.join(f.state,'jobs',j.id),html=preparePrint(raw,jobDir);
 fs.appendFileSync(html,'<script>alert(1)</script>');assert.equal(guard(html).status,2);
 preparePrint(raw,jobDir);fs.appendFileSync(path.join(jobDir,'deps/print/system.css'),'body{}');assert.equal(guard(html).status,2);
 const stale=a.digest;fs.appendFileSync(path.join(dir,'deps/print/system.css'),'body{}');assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'ocr',expectedDigest:stale,printChanges:[{op:'text',field:'lead',value:'Stale'}]}),/Stale/);
 const tamper=structuredClone(raw);tamper.base.options='Changed baseline';assert.throws(()=>compilePrint(tamper,dir),/baseline/);
 const layout=structuredClone(raw);layout.data.screen_height=10;assert.throws(()=>compilePrint(layout,dir),/Fixed identity\/layout/);
});

test('maintained official client validates other-machine cover/inspection/source-backed software split without rendering', { skip: needsMedia },async()=>{
 const e=await smoke({printValidate:true,printProduct:'opticais'});assert.equal(e.printValidation.state,'succeeded');assert.equal(e.print,undefined);assert.equal(e.printPiece.product,'OPTICAIS');assert.equal(e.printPiece.data.software.length,5);const sheet=JSON.parse(fs.readFileSync(path.join(STUDIO,'datasheets/data.json'))).opticais;assert.equal(e.printPiece.data.technical_image,sheet.technical_image);assert.equal(e.printPiece.data.screen,sheet.screen);
 for(const a of e.printValidation.artifacts)assert.equal(digest(fs.readFileSync(fileURLToPath(a.uri))),a.digest);
 assert(!fs.existsSync(path.join(e.state,'owner.json')));
});


test('template tampering cannot be laundered through a rewritten manifest; queued data remains pinned',async t=>{
 const f=fixture(t);let a=call(f,'edit_piece',{action:'copy',pieceId:'standard',source:printFamily.products.standard.source});
 const dir=path.dirname(fileURLToPath(a.uri)),raw=load(a),template=path.join(dir,raw.template),manifestPath=path.join(dir,'dependencies.json');
 fs.appendFileSync(template,'<script>altered template</script>');const manifest=JSON.parse(fs.readFileSync(manifestPath));manifest.files.find(x=>x.path===raw.template).digest=digest(fs.readFileSync(template));fs.writeFileSync(manifestPath,JSON.stringify(manifest));
 assert.throws(()=>compilePrint(raw,dir),/template hash mismatch/);assert.equal(call(f,'edit_piece',{action:'validate',pieceId:'standard'}).valid,false);
 a=call(f,'edit_piece',{action:'copy',pieceId:'hopper',source:printFamily.products.hopper.source});
 const j=call(f,'export_piece',{action:'enqueue',pieceId:'hopper',operation:'render-pdf'}),jobRecipe=path.join(f.state,'jobs',j.id,'recipe.json'),changed=JSON.parse(fs.readFileSync(jobRecipe));changed.data.software_title='Changed after enqueue';fs.writeFileSync(jobRecipe,JSON.stringify(changed));
 await f.pump();const result=call(f,'export_piece',{action:'status',jobId:j.id});assert.equal(result.state,'failed');assert.match(result.reason,/Pinned print input changed/);assert.equal(result.executionEvidence,undefined);assert.deepEqual(result.artifacts,[]);
});


test('OPTICAIS reading-size table and its condition survive native row edits',t=>{
 const f=fixture(t);
 let a=call(f,'edit_piece',{action:'copy',pieceId:'opticais-table',source:printFamily.products.opticais.source});
 const raw=load(a),dir=path.dirname(fileURLToPath(a.uri));
 const source=fs.readFileSync(path.join(STUDIO,printFamily.products.opticais.template),'utf8');
 const table=source.match(/<h3 class="editorial-heading"[^>]*>Tamaño mínimo de lectura<\/h3>.*?<\/table>.*?<\/p>/s)?.[0];
 assert(table,'source reading table and caption exist');
 a=call(f,'edit_piece',{action:'update',pieceId:'opticais-table',expectedDigest:a.digest,printChanges:[{op:'row',field:'fields',index:0,label:raw.data.fields[0][0],value:raw.data.fields[0][1]+' según configuración'}]});
 assert(a.valid);assert(compilePrint(load(a),dir).includes(table),'fixed reading table must remain byte-for-byte');
});
