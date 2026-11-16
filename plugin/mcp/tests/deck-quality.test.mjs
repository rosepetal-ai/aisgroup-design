import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSlide} from '../../decks/layouts.mjs';

const context = (w,h) => ({n:1,part:0,parts:[],img:src=>({url:src,w,h}),asset:src=>src,icon:()=>'<svg/>',whiteLogo:src=>src});
const split = image => ({layout:'split',title:'Pruebas de laboratorio',points:[{text:'Muestras reales de producto'}],image});
test('a source with sufficient real pixels fills the complete side panel',()=>{
 const html=renderSlide(split({src:'laboratorio.jpg'}),context(2048,1152));
 assert.match(html,/data-side-photo="full"/);
 assert.match(html,/left:980px;top:0px;width:940px;height:1080px/);
});
test('the 1.3x source boundary fills without a smaller navy placeholder',()=>{
 const html=renderSlide(split({src:'laboratorio.jpg'}),context(800,831));
 assert.match(html,/data-side-photo="full"/);
 assert.doesNotMatch(html,/class="abs panel"/);
 const limited=renderSlide(split({src:'laboratorio.jpg'}),context(800,830));
 assert.match(limited,/data-side-photo="limited"/);
});
test('complete screenshots retain all of their source content',()=>{
 const html=renderSlide(split({src:'pantalla.png',fit:'contain'}),context(1920,1080));
 assert.match(html,/data-side-photo="complete"/);
 assert.doesNotMatch(html,/data-side-photo="full"/);
});
test('legacy cover limits never shrink the accepted full panel',()=>{
 const html=renderSlide({layout:'cover',title:'Inspección de vino',lead:'Control de calidad',meta:'2026',image:{src:'vino.jpg',fit:'contain',maxScale:.2}},context(500,500));
 assert.match(html,/left:1000px;top:0px;width:920px;height:1080px/);
});
test('a proof photograph preserves every feature name and description',()=>{
 const html=renderSlide({layout:'features',title:'Verificadores de códigos',image:{src:'verificador.png',fit:'contain'},items:[{title:'Certificado por GS1',text:'Cumple 21 CFR Part 11, FMD y otras regulaciones farma.'},{title:'Todos los parámetros',text:'También en multicolumnas, con informes detallados.'}]},context(615,487));
 for(const text of ['Certificado por GS1','Cumple 21 CFR Part 11, FMD y otras regulaciones farma.','Todos los parámetros','También en multicolumnas, con informes detallados.']) assert.ok(html.includes(text));
});

test('a facility facade or map fails preflight before any browser starts', async()=>{
 const fs=await import('node:fs');
 const path=await import('node:path');
 const os=await import('node:os');
 const {spawnSync}=await import('node:child_process');
 const root=path.resolve(new URL('../..',import.meta.url).pathname);
 const parent=path.join(os.homedir(),'.cache/ais-group-design/tests');fs.mkdirSync(parent,{recursive:true});
 const dir=fs.mkdtempSync(path.join(parent,'facility-'));
 try {
  for (const src of ['sabadell-facade-photo.jpg','office-map.png','ais_sabadell-building.jpg']) {
   const file=path.join(dir,'content.es.json');
   fs.writeFileSync(file,JSON.stringify({meta:{lang:'es',file:'facility-test'},slides:[{layout:'figures',title:'Equipo propio',figures:[{value:'24',label:'empleados'}],image:{src}}]}));
   const result=spawnSync(process.execPath,[path.join(root,'decks/build.mjs'),file,'--html-only'],{encoding:'utf8',env:process.env});
   assert.notEqual(result.status,0);assert.match(result.stderr,/use the registered Sabadell aerial/);
   assert.equal(fs.existsSync(path.join(dir,'facility-test.html')),false);
  }
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
