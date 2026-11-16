// Real official SDK client: stdio initialize, tools/resources and Cables vertical slice.
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { STUDIO } from '../engine/recipe.mjs';
import { LIMITS } from './contracts.mjs';
import { printFamily } from './print.mjs';
export async function smoke({render=false,carousel=false,print=false,printValidate=false,printProduct='cables',familyValidate=false}={}) {
 if(familyValidate){if(print)throw Error('Family validation never renders the kit');printValidate=true;}
 const state=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/mcp-stdio-'));
 const transport=new StdioClientTransport({command:process.execPath,args:[path.join(STUDIO,'mcp/server.mjs')],cwd:STUDIO,env:{PATH:process.env.PATH,HOME:os.homedir(),AIS_MCP_STATE:state,...(process.env.AIS_PORTABLE_GUARD?{AIS_PORTABLE_GUARD:process.env.AIS_PORTABLE_GUARD}:{})},stderr:'pipe'});
 let stderr='';transport.stderr.on('data',b=>stderr=(stderr+b).slice(-2000));
 const client=new Client({name:'ais-factory-acceptance',version:'1.0.0'});
 const evidence={state,officialClient:'@modelcontextprotocol/client@2.4.0',calls:[]};
 try {
  await client.connect(transport);
  evidence.server=client.getServerVersion();evidence.capabilities=client.getServerCapabilities();
  const tools=await client.listTools(),resources=await client.listResources();evidence.tools=tools.tools.map(t=>t.name);evidence.resources=resources.resources;
  assert.equal(tools.tools.length,8);assert(tools.tools.some(t=>t.name==='inspect_media'));assert(resources.resources.some(r=>r.uri==='ais://studio/status'));
  await client.readResource({uri:'ais://studio/status'});
  async function call(name,args) {const r=await client.callTool({name,arguments:args});const text=r.content[0].text;assert(Buffer.byteLength(text)<=LIMITS.responseBytes);evidence.calls.push({name,bytes:Buffer.byteLength(text),isError:!!r.isError});assert.deepEqual(r.structuredContent,JSON.parse(text));assert.equal(r.structuredContent.ok,!r.isError);if(r.isError)throw Error(text);return JSON.parse(text);}
  const route=await call('plan_piece',{intent:'Create a LinkedIn product post for AIS REV 360 Cables using the existing photo and video as source context',kind:'post',media:[{path:'library/media/real/rev360-cables_factory-floor.jpg',mime:'image/jpeg',role:'existing product image'},{path:'library/media/rev360/rev360-cables-demo.mp4',mime:'video/mp4',role:'source footage'}]});
  assert.equal(route.kind,'post');assert.equal(route.assets[0].id,'real-cables-factory');evidence.bundle=route;
  evidence.skill=await call('read_instructions',{ref:route.refs[0],chars:1000});
  await client.readResource({uri:`ais://studio/chunk/${encodeURIComponent(route.refs[0])}/0`});
  assert((await call('read_instructions',{ref:route.refs[0],ifDigest:evidence.skill.digest})).unchanged);
  await call('search_library',{collection:'assets',query:'cables',limit:3});await call('get_asset',{assetId:'real-cables-factory'});
  await assert.rejects(call('get_asset',{assetId:'no-such-asset'}),e=>{const r=JSON.parse(e.message);return r.ok===false&&/Unknown asset/.test(r.error)&&/search_library/.test(r.fix);});
  let piece=await call('edit_piece',{action:'copy',pieceId:'cables-post',source:'pieces/posts/05-rev360-cables/recipe-es.json'});assert(piece.valid);assert.match(piece.next,/export_piece/);
  piece=await call('edit_piece',{action:'update',pieceId:'cables-post',expectedDigest:piece.digest,changes:[{field:'headline',value:'Inspección de superficie|*en cables y tubos*'}]});assert(piece.valid);
  evidence.piece=await call('edit_piece',{action:'validate',pieceId:'cables-post'});
  async function finish(job) {
   const deadline=Date.now()+195000;
   while(['queued','running'].includes(job.state)) {
    if(Date.now()>deadline) {await call('export_piece',{action:'cancel',jobId:job.id});throw Error('Finite acceptance deadline exceeded; cancellation requested');}
    await new Promise(r=>setTimeout(r,250));
    job=await call('export_piece',{action:'status',jobId:job.id});
   }
   return job;
  }
  evidence.validation=await finish(await call('export_piece',{action:'enqueue',pieceId:'cables-post',operation:'validate'}));assert.equal(evidence.validation.state,'succeeded');
  assert(fs.existsSync(fileURLToPath(evidence.validation.artifacts[0].uri)));
  if(render) evidence.render=await finish(await call('export_piece',{action:'enqueue',pieceId:'cables-post',operation:'render-png'}));
  if(evidence.render?.state==='succeeded') { evidence.retrieved=evidence.render.artifacts.map(a=>{const bytes=fs.readFileSync(fileURLToPath(a.uri));assert.equal(createHash('sha256').update(bytes).digest('hex'),a.digest);return {uri:a.uri,bytes:bytes.length,digest:a.digest};}); }
  if(carousel) {
   let piece=await call('edit_piece',{action:'copy',pieceId:'cables-carousel',source:'templates/carousel-product.json'});assert(piece.valid);
   piece=await call('edit_piece',{action:'update',pieceId:'cables-carousel',expectedDigest:piece.digest,changes:[{field:'headline',value:'Inspección de superficie|*a 360°*'}]});assert(piece.valid);
   evidence.carouselPiece=piece;
   evidence.carousel=await finish(await call('export_piece',{action:'enqueue',pieceId:'cables-carousel',operation:'render-pdf'}));
  }
  if(print||printValidate) {
   evidence.printFamily=[];
   for(const product of familyValidate?Object.keys(printFamily.products):[printProduct]) {
   printProduct=product;
   const config=printFamily.products[printProduct];if(!config)throw Error('Unknown registered print product');
   const pieceId=printProduct+'-sheet';
   evidence.printRoute=await call('plan_piece',{intent:'Edit the '+config.name+' technical sheet ('+printProduct+')',kind:'document'});
   evidence.printDescriptor=await call('read_instructions',{ref:'print:'+printProduct+'-technical-sheet'});
   let descriptor=evidence.printDescriptor.text,next=evidence.printDescriptor.nextOffset;
   while(next!==null){const chunk=await call('read_instructions',{ref:'print:'+printProduct+'-technical-sheet',offset:next});descriptor+=chunk.text;next=chunk.nextOffset;}
   assert.equal(JSON.parse(descriptor).source,config.source);
   let piece=await call('edit_piece',{action:'copy',pieceId,source:config.source});assert(piece.valid);
   evidence.printOriginal=piece;
   const printChanges=printProduct==='opticais'?[
    {op:'text',field:'cover_headline',value:'Lectura de la impresión variable'},
    {op:'text',field:'inspection_title',value:'Cada marcaje, contrastado con la receta'},
    {op:'text',field:'inspection_lead',value:'OPTICAIS lee la impresión variable, la contrasta con los datos esperados del producto y clasifica cada lectura como OK o NOK en tiempo real.'},
    {op:'row',field:'software',index:0,label:'OCR y códigos',value:'Campos OCR, 1D y 2D ilimitados; el número de campos influye en la cadencia.'},
    {op:'append-row',field:'software',label:'Condición de lectura',value:'Los caracteres no deben tocarse',sourceNote:'Source-backed split of datasheets/data.json#opticais software[0]; exact existing condition retained, no new claim.'}
   ]:printProduct==='cables'?[{op:'text',field:'software_title',value:'Inspección y control de producción'},{op:'image',field:'technical_image',value:'library/media/real/rev360-cables_tunnel.jpg'}]:[{op:'text',field:'software_title',value:'Inspección y control de producción'}];
   evidence.printChanges=printChanges;
   piece=await call('edit_piece',{action:'update',pieceId,expectedDigest:piece.digest,printChanges});assert(piece.valid,JSON.stringify(piece));
   evidence.printPiece=piece;
   evidence.printValidation=await finish(await call('export_piece',{action:'enqueue',pieceId,operation:'validate'}));assert.equal(evidence.printValidation.state,'succeeded');
   evidence.printValidationRetrieved=evidence.printValidation.artifacts.map(a=>{const bytes=fs.readFileSync(fileURLToPath(a.uri));assert.equal(createHash('sha256').update(bytes).digest('hex'),a.digest);return {uri:a.uri,bytes:bytes.length,digest:a.digest};});
   if(print)evidence.print=await finish(await call('export_piece',{action:'enqueue',pieceId,operation:'render-pdf'}));
   if(evidence.print?.state==='succeeded'){
    evidence.printRetrieved=evidence.print.artifacts.map(a=>{const bytes=fs.readFileSync(fileURLToPath(a.uri));assert.equal(createHash('sha256').update(bytes).digest('hex'),a.digest);return {uri:a.uri,bytes:bytes.length,digest:a.digest};});
    assert(evidence.printRetrieved.some(a=>a.uri.endsWith('.pdf')));
    assert.equal(evidence.printRetrieved.filter(a=>a.uri.endsWith('.png')).length,4);
   }
   evidence.printFamily.push({product:printProduct,source:config.source,descriptorDigest:evidence.printDescriptor.digest,original:evidence.printOriginal,piece:evidence.printPiece,validation:evidence.printValidation,validationRetrieved:evidence.printValidationRetrieved,changes:printChanges,render:evidence.print,retrieved:evidence.printRetrieved});
   }
  }
  const cancel=await call('export_piece',{action:'enqueue',pieceId:'cables-post'});evidence.cancel=await call('export_piece',{action:'cancel',jobId:cancel.id});
  assert(['succeeded','cancelled'].includes(evidence.cancel.state)); // a fast completed check may win the race
 } finally {await client.close();evidence.stderr=stderr;fs.writeFileSync(path.join(state,'acceptance.json'),JSON.stringify(evidence,null,2));}
 return evidence;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {const e=await smoke({render:process.argv.includes('--render'),carousel:process.argv.includes('--carousel'),print:process.argv.includes('--print'),printValidate:process.argv.includes('--print-validate'),familyValidate:process.argv.includes('--print-family-validate'),printProduct:process.argv.find(x=>x.startsWith('--print-product='))?.split('=')[1]||'cables'});console.log(JSON.stringify({evidence:path.join(e.state,'acceptance.json'),validation:e.validation.state,render:e.render?.state,carousel:e.carousel?.state,print:e.print?.state,piece:e.piece.uri,tools:e.tools},null,2));}
