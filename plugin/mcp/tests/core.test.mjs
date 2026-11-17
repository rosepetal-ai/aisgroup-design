import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Factory, digest } from '../core.mjs';
import { STUDIO as STUDIO_DIR } from '../../engine/recipe.mjs';
import { bounded, LIMITS } from '../contracts.mjs';
import { needsMedia } from './needs.mjs';
const source='pieces/posts/05-rev360-cables/recipe-es.json';
function fixture(t,options={}){const state=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/mcp-test-'));const f=new Factory({state,...options});t.after(()=>f.close());return f;}
const call=(f,n,a)=>f.call(n,a);
test('intent + image/video references select narrow instructions, unknown intent stays unknown', { skip: needsMedia },t=>{
 const f=fixture(t);
 const a=call(f,'plan_piece',{intent:'Make a LinkedIn post about AIS REV 360 Cables',media:[{path:'library/media/real/rev360-cables_factory-floor.jpg',mime:'image/jpeg'},{path:'library/media/rev360/rev360-cables-demo.mp4',mime:'video/mp4'}]});
 assert.equal(a.kind,'post');assert(a.refs.includes('skill:social-post/SKILL.md'));assert(a.refs.length<=3);assert.equal(a.media.length,2);assert(Buffer.byteLength(bounded(a))<=LIMITS.responseBytes);
 assert.equal(call(f,'plan_piece',{intent:'Bring me a sandwich'}).status,'needs-clarification');
 assert.equal(call(f,'plan_piece',{intent:'Prepare a Cables video from the clip'}).kind,'video');
});
test('selective chunks, digest caching and page caps',t=>{
 const f=fixture(t);const a=call(f,'read_instructions',{ref:'skill:social-post/SKILL.md',chars:500});assert.equal(a.text.length,500);assert(a.nextOffset);assert(call(f,'read_instructions',{ref:a.ref,ifDigest:a.digest}).unchanged);
 assert.throws(()=>call(f,'read_instructions',{ref:a.ref,chars:3001}));
 const page=call(f,'search_library',{collection:'assets',limit:2});assert.equal(page.items.length,2);assert.equal(page.nextOffset,2);assert.throws(()=>call(f,'search_library',{collection:'assets',limit:9}));
 assert.throws(()=>bounded({x:'x'.repeat(17000)}));
});
test('paths, symlink escape, type mismatch and unsupported MIME rejected',t=>{
 const f=fixture(t);
 for(const p of ['../../SECRET.md','/etc/passwd','https://example.org/x.jpg']) assert.throws(()=>call(f,'plan_piece',{intent:'post',media:[{path:p,mime:'image/jpeg'}]}));
 assert.throws(()=>call(f,'read_instructions',{ref:'skill:social-post/../../brand-video/SKILL.md'}));
 assert.throws(()=>call(f,'plan_piece',{intent:'post',media:[{path:'library/catalog.json',mime:'image/png'}]}));
 assert.throws(()=>call(f,'plan_piece',{intent:'post',media:[{path:'library/catalog.json',mime:'application/json'}]}));
 const escape=path.join(f.state,'outside.jpg');fs.symlinkSync('/etc/passwd',escape);assert.throws(()=>f.media({path:escape,mime:'image/jpeg'}));
 const text=path.join(f.state,'large.txt');fs.writeFileSync(text,'a'.repeat(66000)); // state is outside the permitted media roots, also rejected
 assert.throws(()=>f.media({path:text,mime:'text/plain'}));
});
test('isolated real Cables content updates, backups, image replacement and stale digest', { skip: needsMedia },t=>{
 const f=fixture(t);const original=path.resolve('pieces/posts/05-rev360-cables/recipe-es.json');const originalHash=digest(fs.readFileSync(original));
 let a=call(f,'edit_piece',{action:'copy',pieceId:'cables',source});assert(a.valid);assert.equal(a.shotCount,1);
 a=call(f,'edit_piece',{action:'update',pieceId:'cables',expectedDigest:a.digest,changes:[{field:'headline',value:'Inspección de superficie|*en cables y tubos*'}]});assert(a.valid);
 const stale=a.digest;
 // A guide photo by the path get_asset returns (brand/library/photos/…) is the guide's own file, not one in the piece's folder;
 // one whose origin was never recorded is accepted with a warning that asks the person to confirm it.
 const gears=call(f,'get_asset',{assetId:'automotive_gears-and-housing'});assert.equal(gears.path,'brand/library/photos/automotive_gears-and-housing.webp');
 a=call(f,'edit_piece',{action:'update',pieceId:'cables',expectedDigest:a.digest,changes:[{field:'src',value:gears.path}]});assert(a.valid);assert.match(a.shot.src,/^@guide\/library\/photos\//);assert(a.warnings.some(w=>/origin is «unknown»/.test(w)));
 // A picture the person gave the studio (copied to the inbox) can go in a recipe too.
 const given=path.join(STUDIO_DIR,'work/inbox',`given-${process.pid}.webp`);fs.copyFileSync(path.join(STUDIO_DIR,'brand/library/photos/automotive_gears-and-housing.webp'),given);t.after(()=>fs.rmSync(given,{force:true}));
 a=call(f,'edit_piece',{action:'update',pieceId:'cables',expectedDigest:a.digest,changes:[{field:'src',value:given}]});assert(a.valid);assert(a.warnings.some(w=>/not in the library/.test(w)));
 a=call(f,'edit_piece',{action:'update',pieceId:'cables',expectedDigest:a.digest,changes:[{field:'src',value:'@lib/media/real/rev360-cables_factory-floor.jpg'}]});assert(a.valid);assert.match(a.shot.src,/@lib/);
 assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'cables',expectedDigest:stale,changes:[{field:'headline',value:'Stale'}]}));
 const before=a.digest;
 assert.throws(()=>call(f,'edit_piece',{action:'update',pieceId:'cables',expectedDigest:before,changes:[{field:'src',value:'/etc/passwd'}]}));
 assert.equal(call(f,'edit_piece',{action:'inspect',pieceId:'cables'}).digest,before);
 assert.equal(digest(fs.readFileSync(original)),originalHash);
 assert(fs.readdirSync(path.dirname(fileURLToPath(a.uri))).some(f=>f.endsWith('.bak')));
});
test('queued snapshot validation produces real artifact URI and finite persisted failure', { skip: needsMedia },async t=>{
 const f=fixture(t,{schedule:()=>{}});call(f,'edit_piece',{action:'copy',pieceId:'cables',source});
 const j=call(f,'export_piece',{action:'enqueue',pieceId:'cables'});await f.pump();const done=call(f,'export_piece',{action:'status',jobId:j.id});assert.equal(done.state,'succeeded');assert(fs.existsSync(fileURLToPath(done.artifacts[0].uri)));
 const p=f.piecePath('cables');const raw=JSON.parse(fs.readFileSync(p));raw.brand='not-a-brand';fs.writeFileSync(p,JSON.stringify(raw));const failed=call(f,'export_piece',{action:'enqueue',pieceId:'cables'});await f.pump();assert.equal(call(f,'export_piece',{action:'status',jobId:failed.id}).state,'failed');
 assert.equal(call(f,'export_piece',{action:'status',jobId:j.id}).state,'succeeded');
});
test('queue cap, queued cancellation and clean shutdown; exclusive state ownership', { skip: needsMedia },t=>{
 const f=fixture(t,{schedule:()=>{}});call(f,'edit_piece',{action:'copy',pieceId:'cables',source});assert.throws(()=>new Factory({state:f.state}));
 const jobs=Array.from({length:4},()=>call(f,'export_piece',{action:'enqueue',pieceId:'cables'}));assert.throws(()=>call(f,'export_piece',{action:'enqueue',pieceId:'cables'}));
 assert.equal(call(f,'export_piece',{action:'cancel',jobId:jobs[0].id}).state,'cancelled');
 f.close();const next=new Factory({state:f.state,schedule:()=>{}});t.after(()=>next.close());assert.equal(call(next,'export_piece',{action:'status',jobId:jobs[1].id}).state,'cancelled');
});
test('asset detail returns status/provenance and file reference, never a blob', { skip: needsMedia },t=>{
 const f=fixture(t),a=call(f,'get_asset',{assetId:'real-cables-factory'});assert.equal(a.status,'review');assert(a.uri.startsWith('file://'));assert(a.reason);assert(!JSON.stringify(a).includes('base64'));assert.throws(()=>call(f,'get_asset',{assetId:'nonexistent'}));
});

test('Unicode byte budget and typed operation/intent caps reject oversized inputs',t=>{
 const f=fixture(t);assert.throws(()=>call(f,'plan_piece',{intent:'x'.repeat(2001)}));assert.throws(()=>call(f,'plan_piece',{intent:'post',kind:'deploy'}));assert.throws(()=>bounded({text:'😀'.repeat(5000)}));
 const read=call(f,'read_instructions',{ref:'shared:WORKFLOW.md'});assert(Buffer.byteLength(bounded(read))<=LIMITS.responseBytes);
});
test('managed piece symlink rejected before inspection',t=>{
 const f=fixture(t);fs.symlinkSync('/etc',path.join(f.state,'pieces','escape'));assert.throws(()=>call(f,'edit_piece',{action:'inspect',pieceId:'escape'}));
});

test('real owned worker cancellation and shutdown hold state ownership until cleanup; restart recovers stale jobs', { skip: needsMedia },async t=>{
 const {spawn}=await import('node:child_process');
 const state=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/mcp-lifecycle-'));
 const marker=path.join(state,'worker-ready');
 const f=new Factory({state,schedule:()=>{},launch:()=>spawn(process.execPath,['-e',`const fs=require('fs'); fs.writeFileSync(${JSON.stringify(marker)},String(process.pid)); process.on('SIGTERM',()=>setTimeout(()=>process.exit(0),300)); setInterval(()=>{},100);`],{stdio:['ignore','pipe','pipe']})});
 t.after(()=>f.close());
 call(f,'edit_piece',{action:'copy',pieceId:'cables',source});
 const job=call(f,'export_piece',{action:'enqueue',pieceId:'cables',operation:'render-png'});
 const pumping=f.pump();
 const deadline=Date.now()+3000;
 while(!fs.existsSync(marker)&&Date.now()<deadline)await new Promise(r=>setTimeout(r,10));
 assert(fs.existsSync(marker));
 const pid=Number(fs.readFileSync(marker));
 const cancelling=call(f,'export_piece',{action:'cancel',jobId:job.id});
 assert.equal(cancelling.state,'running');assert(cancelling.cancelRequested);
 const closing=f.close();
 assert(fs.existsSync(f.owner));assert.throws(()=>new Factory({state}));
 await closing;await pumping;
 assert.equal(call(f,'export_piece',{action:'status',jobId:job.id}).state,'cancelled');
 assert.throws(()=>process.kill(pid,0));assert(!fs.existsSync(f.owner));
 // Simulate an unclean shutdown record, separately from clean cancellation.
 const record=path.join(state,'jobs',job.id+'.json');const stale=JSON.parse(fs.readFileSync(record));stale.state='running';fs.writeFileSync(record,JSON.stringify(stale));
 const next=new Factory({state,schedule:()=>{}});t.after(()=>next.close());
 assert.equal(call(next,'export_piece',{action:'status',jobId:job.id}).state,'interrupted');
 assert(!next.running);await f.close();assert(fs.existsSync(next.owner));
});

test('carousel PDF adapter uses existing renderer, preserves source, pins edits, and cannot claim the post profile', { skip: needsMedia },async t=>{
 const {spawn}=await import('node:child_process');let invocation;
 const f=fixture(t,{schedule:()=>{},launch:(command,args,options)=>{invocation={command,args,options};return spawn(process.execPath,['-e','process.exit(0)'],{stdio:['ignore','pipe','pipe']});}});
 const src='templates/carousel-product.json';const original=path.join(path.dirname(new URL('../../package.json',import.meta.url).pathname),src);const before=digest(fs.readFileSync(original));
 let piece=call(f,'edit_piece',{action:'copy',pieceId:'cables-carousel',source:src});assert(piece.valid);assert.equal(piece.shotCount,5);
 piece=call(f,'edit_piece',{action:'update',pieceId:'cables-carousel',expectedDigest:piece.digest,shot:0,changes:[{field:'headline',value:'Inspección de superficie|*a 360°*'}]});assert(piece.updated!==false);assert(piece.valid);
 assert.throws(()=>call(f,'export_piece',{action:'enqueue',pieceId:'cables-carousel',operation:'render-png'}));
 const job=call(f,'export_piece',{action:'enqueue',pieceId:'cables-carousel',operation:'render-pdf'});
 await f.pump();
 assert(invocation.args.includes('heavy'));assert(!invocation.args.includes('post-1080'));
 assert.equal(invocation.args[invocation.args.indexOf('--only')+1],'png,pdf');
 assert.equal(digest(fs.readFileSync(original)),before);
 assert.equal(call(f,'export_piece',{action:'status',jobId:job.id}).state,'failed'); // zero exit without real PDF must fail
 const snapshot=JSON.parse(fs.readFileSync(path.join(f.state,'jobs',job.id,'recipe.json')));assert.equal(snapshot.shots[0].headline,'Inspección de superficie|*a 360°*');
});
test('the curated library photos are found by their clean names and delivered from brand/library',t=>{
 const f=fixture(t),index=JSON.parse(fs.readFileSync(path.join(STUDIO_DIR,'brand/library/library.json'),'utf8'));
 const files=index.entries.filter(e=>e.kind==='photo').flatMap(e=>e.variants.map(v=>v.file));
 for(const file of files){const a=call(f,'get_asset',{assetId:path.basename(file,path.extname(file))});assert.equal(a.path,'brand/'+file);assert(a.uri.startsWith('file://'),file);assert.equal(a.bytes,fs.statSync(path.join(STUDIO_DIR,a.path)).size);}
 const cables=call(f,'search_library',{collection:'assets',query:'Cables camera mounts'});assert.equal(cables.items[0].id,'rev360-cables_camera-mounts');assert(cables.items.every(x=>x.product==='AIS REV 360 Cables'));
 assert.equal(call(f,'get_asset',{assetId:'rev360-compact_plain-cans-still-life_dark'}).origin,'render');
});
