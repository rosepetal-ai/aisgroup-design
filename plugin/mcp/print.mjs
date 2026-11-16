// Typed data bindings on registered accepted sheets. Existing HTML/CSS remain the template.
// The sheet HTML (pieces/datasheets/<key>/<key>.es.html) is the source; datasheets/data.json is its pinned extraction
// (datasheets/extract.mjs, run by npm run mcp:pin). Every binding below must find the base value in the sheet exactly once.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { withTextCheck } from '../engine/text-check.mjs';
import { STUDIO } from '../engine/recipe.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
const unesc=s=>s.replaceAll('&#x27;',"'").replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');
const registryPath=path.join(STUDIO,'mcp/print-family.json');
export const printFamily=JSON.parse(fs.readFileSync(registryPath));
export const printSources=Object.values(printFamily.products).map(x=>x.source);
export const printSource=printFamily.products.cables.source; // backwards compatible selector
export const textFields=['cover_headline','cover_alt','inspection_title','inspection_lead','lead','software_title','software_lead','screen_alt','caption','options','technical_alt','technical_caption'];
const rowFields=['fields','installation','software'],imageFields=['cover_image','screen','technical_image'];
const within=(p,r)=>p===r||p.startsWith(r+path.sep);
const sourceFor=raw=>{const c=printFamily.products[raw.name];if(raw.kind!=='technical-sheet'||!c||raw.lang!=='es'||raw.template!=='deps/'+c.template)throw Error('Unsupported print source/variant/language');return c;};
export const printOutput=(raw,dir)=>{sourceFor(raw);return path.join(dir,'deps/pieces/datasheets',raw.name,raw.name+'.export.es.html');};
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
export function dependencies(dir){return files(path.join(dir,'deps')).sort().map(p=>({path:path.relative(dir,p),digest:hash(fs.readFileSync(p)),bytes:fs.statSync(p).size}));}
export function printDigest(raw,dir){return hash(JSON.stringify({raw,dependencies:dependencies(dir),manifest:hash(fs.readFileSync(path.join(dir,'dependencies.json')))}));}
function pagesOf(html){const pages=[...html.matchAll(/<section class="page\b.*?<\/section>/gs)].map(m=>m[0]);if(pages.length!==4)throw Error('Expected four-page sheet');return pages;}
function capture(text,re){const matches=[...text.matchAll(re)];if(matches.length!==1)throw Error('Ambiguous or missing explicit print binding');if(/<[^>]+>/.test(matches[0][1]))throw Error('Structured copy needs a dedicated binding');return unesc(matches[0][1]);}
const RESYNC=' The sheet HTML is the source: look at its PDF, then re-extract and re-pin (npm run mcp:pin).';
const parity=f=>Error('Source data/template parity mismatch: '+f+'. data.json and the sheet HTML disagree.'+RESYNC);
function extraData(html){const p=pagesOf(html);return {cover_image:capture(p[0],/<figure class="hero"[^>]*><img src="assets\/([^"]+)"[^>]*>/g),cover_alt:capture(p[0],/<figure class="hero"[^>]*><img [^>]*?alt="([^"]*)"[^>]*>/g),cover_headline:capture(p[0],/<\/h1>\s*<p>([^<]*)<\/p>/g),inspection_title:capture(p[1],/<h2>([^<]*)<\/h2>/g),inspection_lead:capture(p[1],/<p class="lead">([^<]*)<\/p>/g)};}
export function printDescriptor(key){
 const c=printFamily.products[key];if(!c)throw Error('Unknown print family member');
 const d=JSON.parse(fs.readFileSync(path.join(STUDIO,'datasheets/data.json')))[key];
 return {source:c.source,product:c.name,format:'technical-sheet',language:'es',pages:4,layout:c.layout,
  textFields:textFields.filter(id=>!noSlot(d,id)).map(id=>({id,page:id.startsWith('cover_')?1:id.startsWith('inspection_')?2:['lead','technical_alt','technical_caption'].includes(id)?3:4,maxChars:textLimit(id,d)})),
  rows:rowFields.map(id=>({id,page:id==='software'?4:3,count:d[id].length,append:id==='software'?'<=8 rows, private sourceNote required':false})),imageFields:imageFields.filter(f=>f==='cover_image'||d[f]), // a sheet without a software view has no screen slot
  unsupported:['identity/h1 and language conversion','cover facts','inspection tiles/captions/images','layout/fit changes','automatic continuation','arbitrary HTML'],
  instructions:'copy source, update printChanges with expectedDigest, validate, render-pdf. Source notes do not certify claims. Longer copy needs deliberate layout continuation; no type shrinking.'};
}
export function copyPrint(dir,source=printSource){
 const entry=Object.entries(printFamily.products).find(([,c])=>c.source===source);if(!entry)throw Error('Unsupported print source/variant/language');
 const [key,c]=entry,root=path.join(STUDIO,'pieces/datasheets'),sourcePath=path.join(STUDIO,c.template),sourceBytes=fs.readFileSync(sourcePath);
 if(hash(sourceBytes)!==c.sourceDigest)throw Error('Registered print source changed: this sheet was edited after it was registered. The sheet HTML is the source: if the edit was intended, look at its PDF, then re-extract and re-pin (npm run mcp:pin); if not, restore the sheet from git.');
 const data=JSON.parse(fs.readFileSync(path.join(STUDIO,'datasheets/data.json')))[key];
 for(const [f,v] of Object.entries(extraData(sourceBytes.toString())))if(data[f]!==v)throw parity(f); // cover and inspection copy, checked before the first edit
 const manifest=[];
 function copy(p){
  const real=fs.realpathSync(p);
  if(![path.join(root,key),path.join(STUDIO,'print')].some(r=>within(real,fs.realpathSync(r))))throw Error('Print dependency outside source/template roots');
  if(manifest.some(x=>x.source===real))return;
  const rel=path.relative(STUDIO,p),target=path.join(dir,'deps',rel),bytes=fs.readFileSync(real);
  if(bytes.length>32*1024*1024)throw Error('Print dependency too large');
  manifest.push({source:real,path:path.relative(dir,target),digest:hash(bytes),bytes:bytes.length});
  fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);
  if(/\.(html|css)$/.test(p)){
   const text=bytes.toString(),refs=p.endsWith('.html')?[...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]):[...text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]);
   for(const ref of refs){if(/^(https?:|data:|file:|\/)/i.test(ref)||ref.includes('?'))throw Error('External print dependency');copy(path.resolve(path.dirname(p),ref));}
  }
 }
 copy(sourcePath);
 const helper=path.join(STUDIO,'datasheets/extract.mjs'); // provenance of data.json, never an executable client endpoint
 fs.copyFileSync(helper,path.join(dir,'extraction-source.mjs'));
 fs.writeFileSync(path.join(dir,'dependencies.json'),JSON.stringify({family:printFamily.family,product:key,source:sourcePath,sourceDigest:hash(sourceBytes),dataSource:path.join(STUDIO,'datasheets/data.json'),dataDigest:hash(fs.readFileSync(path.join(STUDIO,'datasheets/data.json'))),baseDigest:hash(JSON.stringify(data)),familyDigest:hash(fs.readFileSync(registryPath)),helperDigest:hash(fs.readFileSync(helper)),files:manifest},null,2));
 const raw={kind:'technical-sheet',name:key,lang:'es',data,base:structuredClone(data),template:'deps/'+c.template,notes:[]};
 // Fail copy if data/template have drifted, even before the first edit.
 compilePrint(raw,dir);return raw;
}
function textLimit(field,base){return ({cover_headline:260,cover_alt:240,inspection_title:110,software_title:100,screen_alt:240,technical_alt:240,caption:220,technical_caption:220})[field]??Math.min(1000,base[field].length+160);}
function validateData(raw,dir){
 const config=sourceFor(raw);
 if(hash(fs.readFileSync(path.join(dir,raw.template)))!==config.sourceDigest)throw Error('Registered template hash mismatch: the sheet HTML in this copy differs from the registered one. Copy the sheet again.');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'dependencies.json')));
 if(manifest.product!==raw.name||manifest.sourceDigest!==config.sourceDigest||raw.base.name!==config.name||JSON.stringify(Object.fromEntries(Object.keys(config.layout).map(k=>[k,raw.base[k]])))!==JSON.stringify(config.layout)||manifest.familyDigest!==hash(fs.readFileSync(registryPath))||manifest.baseDigest!==hash(JSON.stringify(raw.base)))throw Error('Stale family/baseline dependency: this copy no longer matches the registered sheet. Copy the sheet again; if the copy fails too, run npm run mcp:pin -- --check to see what changed.');
 if(Object.keys(raw.data).sort().join()!==Object.keys(raw.base).sort().join())throw Error('Unknown/missing print data');
 for(const f of Object.keys(raw.base)){
  if(![...textFields,...rowFields,...imageFields].includes(f)&&JSON.stringify(raw.data[f])!==JSON.stringify(raw.base[f]))throw Error('Fixed identity/layout field: '+f);
 }
 for(const f of textFields)if(!noSlot(raw.base,f)&&(typeof raw.data[f]!=='string'||!raw.data[f].trim()||raw.data[f].length>textLimit(f,raw.base)))throw Error('Copy exceeds supported binding for '+f+'; deliberate layout continuation required (no shrinking or truncation)');
 for(const f of rowFields){
  const rows=raw.data[f];if(!Array.isArray(rows)||rows.length<(raw.base[f].length)||rows.length>(f==='software'?8:raw.base[f].length))throw Error('Unsupported print row count');
  for(const row of rows)if(!Array.isArray(row)||row.length!==2||row.some(v=>typeof v!=='string'||!v.trim())||row[0].length>100||row[1].length>600)throw Error('Invalid/long print row; deliberate layout continuation required');
  if(JSON.stringify(rows).length>JSON.stringify(raw.base[f]).length+400)throw Error('Long row collection requires deliberate layout continuation');
 }
 const canonical=pagesOf(fs.readFileSync(path.join(dir,raw.template),'utf8'));
 // The cover picture may carry extra attributes (Cables: data-cover-ok), so its src and alt are checked inside the hero <img>.
 const hero=[...canonical[0].matchAll(/<figure class="hero"[^>]*><img ([^>]*)>/g)].map(m=>m[1]);
 if(hero.length!==1||!hero[0].includes(`src="assets/${raw.base.cover_image}"`)||!hero[0].includes(`alt="${esc(raw.base.cover_alt)}"`))throw Error('Source data/template image parity mismatch: cover_image. data.json and the sheet HTML name different pictures.'+RESYNC);
 for(const [i,img,alt] of [[2,'technical_image','technical_alt'],[3,'screen','screen_alt']])if(raw.base[img]!=null&&!canonical[i].includes(`<img src="assets/${raw.base[img]}" alt="${esc(raw.base[alt])}">`))throw Error('Source data/template image parity mismatch: '+img+'. data.json and the sheet HTML name different pictures.'+RESYNC);
 for(const f of ['fields','installation','software'])if(!canonical[f==='software'?3:2].includes(specs(raw.base[f])))throw parity(f);
 for(const f of ['lead','software_title','software_lead','caption','options','screen_alt','technical_alt','technical_caption'])if(!noSlot(raw.base,f)&&!canonical[['lead','technical_alt','technical_caption'].includes(f)?2:3].includes(esc(raw.base[f])))throw parity(f);
}
export function updatePrint(raw,changes,dir,media){
 for(const c of changes){
  if(c.op==='text'){
   if(!textFields.includes(c.field)||noSlot(raw.base,c.field))throw Error('Unsupported print text field');raw.data[c.field]=c.value;
  }else if(c.op==='row'){
   if(!rowFields.includes(c.field)||!raw.data[c.field][c.index])throw Error('Unknown print row');raw.data[c.field][c.index]=[c.label,c.value];
  }else if(c.op==='append-row'){
   if(c.field!=='software'||raw.data.software.length>=8||!c.sourceNote?.trim())throw Error('Additional software inspection requires sourceNote and <=8 rows');raw.data.software.push([c.label,c.value]);raw.notes.push(c.sourceNote);
  }else if(c.op==='image'){
   if(!imageFields.includes(c.field))throw Error('Unknown print image slot');
   if(raw.base[c.field]==null)throw Error('This sheet has no '+c.field+' slot');
   const m=media(c.value),name=hash(fs.readFileSync(m)).slice(0,20)+path.extname(m).toLowerCase();
   fs.copyFileSync(m,path.join(dir,'deps/pieces/datasheets',raw.name,'assets',name));raw.data[c.field]=name;
  }else throw Error('Unsupported print operation');
 }
 return raw;
}
// A spec list as the sheets print it, under its <p class="sub"> heading (page 3: Equipo, Instalación y manejo; page 4: Software).
function specs(rows){return '<table class="table"><tbody>'+rows.map(([a,b])=>'<tr><th scope="row">'+esc(a)+'</th><td>'+esc(b)+'</td></tr>').join('')+'</tbody></table>';}
// Without a software view the sheet prints no screen caption or alt text.
const noSlot=(base,f)=>base.screen==null&&['caption','screen_alt','screen'].includes(f);
// Apply once against original text, so new text equal to another field cannot cascade.
function bind(text,pairs){
 const active=pairs.filter(([a,b])=>a!==b);
 for(const [a] of active)if(text.split(a).length!==2)throw Error('Ambiguous or missing print binding');
 if(!active.length)return text;
 const map=new Map(active),re=new RegExp(active.map(([a])=>a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');return text.replace(re,m=>map.get(m));
}
export function compilePrint(raw,dir){
 validateData(raw,dir);
 let html=fs.readFileSync(path.join(dir,raw.template),'utf8'),pages=pagesOf(html),out=[...pages];
 out[0]=bind(pages[0],[[`<p>${esc(raw.base.cover_headline)}</p>`,`<p>${esc(raw.data.cover_headline)}</p>`],[`src="assets/${raw.base.cover_image}"`,`src="assets/${raw.data.cover_image}"`],[`alt="${esc(raw.base.cover_alt)}"`,`alt="${esc(raw.data.cover_alt)}"`]]); // cover_headline: the summary under the h1
 out[1]=bind(pages[1],['inspection_title','inspection_lead'].map(f=>{const tag=f==='inspection_title'?'h2':'p class="lead"',close=f==='inspection_title'?'h2':'p';return [`<${tag}>${esc(raw.base[f])}</${close}>`,`<${tag}>${esc(raw.data[f])}</${close}>`];}));
 for(const i of [2,3]){
  const text=(i===2?['lead','technical_caption']:['software_title','software_lead','caption','options']).filter(f=>!noSlot(raw.base,f));
  const rows=i===2?['fields','installation']:['software'];
  const img=i===2?'technical_image':'screen',alt=i===2?'technical_alt':'screen_alt';
  out[i]=bind(pages[i],[...rows.map(f=>[specs(raw.base[f]),specs(raw.data[f])]),...text.map(f=>[esc(raw.base[f]),esc(raw.data[f])]),...(raw.base[img]==null?[]:[[`<img src="assets/${raw.base[img]}" alt="${esc(raw.base[alt])}">`,`<img src="assets/${raw.data[img]}" alt="${esc(raw.data[alt])}">`]])]);
 }
 for(let i=0;i<4;i++)html=html.replace(pages[i],out[i]);
 if(Buffer.byteLength(JSON.stringify(raw))>65536)throw Error('Print data cap');return html;
}
export function verifyPrintDependencies(dir){
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'dependencies.json')));
 for(const d of manifest.files){
  const p=path.resolve(dir,d.path),real=fs.realpathSync(p);
  if(!within(p,path.join(dir,'deps'))||!within(real,fs.realpathSync(path.join(dir,'deps'))))throw Error('Dependency escapes isolated snapshot');
  if(hash(fs.readFileSync(p))!==d.digest)throw Error('Missing/stale template dependency: '+d.path);
 }
}
// Every sheet also runs the text check (engine/text-check.mjs): helper text, hype words, slogans and the other AI tells.
export function checkPrint(raw,dir){return withTextCheck(checkPrintSource(raw,dir),raw,dir);}
function checkPrintSource(raw,dir){
 try{verifyPrintDependencies(dir);compilePrint(raw,dir);for(const f of imageFields.filter(f=>raw.base[f]!=null)){const root=path.resolve(dir,'deps/pieces/datasheets',raw.name,'assets'),p=path.resolve(root,raw.data[f]);if(!within(p,root)||!within(fs.realpathSync(p),fs.realpathSync(root))||!fs.statSync(p).isFile())throw Error('Invalid/missing print image');}return {valid:true,errors:[],warnings:['Content binding checks only; renderer must check fit/images; all four pages need visual review','Spanish registered family only; cover facts and inspection tiles are fixed; no automatic continuation'],errorCount:0,warningCount:2};}
 catch(e){return {valid:false,errors:[e.message],warnings:[],errorCount:1,warningCount:0};}
}
export function preparePrint(raw,dir){const html=compilePrint(raw,dir),p=printOutput(raw,dir);fs.writeFileSync(p,html);fs.writeFileSync(path.join(dir,'binding-evidence.json'),JSON.stringify({htmlDigest:hash(html),recipeDigest:hash(fs.readFileSync(path.join(dir,'recipe.json'))),manifestDigest:hash(fs.readFileSync(path.join(dir,'dependencies.json'))),binderDigest:hash(fs.readFileSync(path.join(STUDIO,'mcp/print.mjs'))),familyDigest:hash(fs.readFileSync(registryPath))}));return p;}
