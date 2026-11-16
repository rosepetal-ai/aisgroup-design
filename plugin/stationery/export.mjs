import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import{chromium}from'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=process.argv.slice(2);if(!files.length)throw Error('Pass explicit HTML paths, relative to the kit root or absolute');
const b=await chromium.launch({timeout:20000});
try{const p=await b.newPage({deviceScaleFactor:2});p.setDefaultTimeout(15000);
for(const f of files){const abs=path.resolve(root,f);await p.goto('file://'+abs);await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
// Signatures: previews cropped to the content (desktop 760 px, phone 360 px), not a fixed tall canvas.
if(abs.includes('/email-signatures/')){await p.emulateMedia({media:'screen',colorScheme:'light'});for(const [w,suffix] of [[760,''],[360,'-360']]){await p.setViewportSize({width:w,height:120});await p.screenshot({path:abs.replace('.html',suffix+'.png'),fullPage:true});}continue;}
await p.emulateMedia({media:'print'});await p.pdf({path:abs.replace('.html','.pdf'),preferCSSPageSize:true,printBackground:true});
// Boards with data-bleed="mm" are printed with that bleed; the PNG preview shows the trimmed card, cropped half a pixel
// inside the trim so no row of the next board shows.
const boards=await p.locator('.card,.letter').all();for(let i=0;i<boards.length;i++){const out=abs.replace('.html',`-${i+1}.png`);const bleed=Number(await boards[i].getAttribute('data-bleed')||0);
if(bleed){const bb=await boards[i].boundingBox(),d=bleed*96/25.4+0.5;await p.screenshot({path:out,fullPage:true,clip:{x:bb.x+d,y:bb.y+d,width:bb.width-2*d,height:bb.height-2*d}});}
else await boards[i].screenshot({path:out});}
console.log(f,'exported');
}}finally{await b.close();}
