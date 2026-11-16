// Targeted local QA/export for the six LinkedIn banners. Run through skills/_shared/scripts/safe_render.py.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const kit=path.join(root,'guide/public/kit');
const out=path.resolve(process.env.AIS_LINKEDIN_REVIEW || path.join(os.homedir(),'.cache/ais-linkedin-review'));
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:2000,height:1500},deviceScaleFactor:2});
 await page.goto('file://'+path.join(kit,'linkedin-banners.html'));
 await page.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode())]));
 for(const kind of ['company','personal']) for(const brand of ['ais-group','ais-vision-systems','rosepetal']) {
  const id=`${kind}-${brand}`,native=path.join(kit,'files',`banner-${id}.png`);
  await page.locator(`[data-id="${id}"]`).screenshot({path:native});
  const png=fs.readFileSync(native).toString('base64');
  for(const phone of [false,true]) {
   const w=phone?390:kind==='company'?1128:804;
   const ratio=phone?(kind==='company'?4:3):(kind==='company'?1512/256:4);
   const p=await browser.newPage({viewport:{width:w,height:Math.ceil(w/ratio)+110},deviceScaleFactor:1});
   const avatar=phone?72:kind==='company'?120:152;
   await p.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#fff}.cover{display:block;width:100%;height:${w/ratio}px;object-fit:cover}.avatar{position:absolute;left:16px;top:${w/ratio-avatar*.5}px;width:${avatar}px;height:${avatar}px;background:#F1F5F9;border:4px solid white;border-radius:${kind==='personal'?'50%':'4px'}}p{margin:70px 16px 0;font:16px Arial}</style><img class="cover" src="data:image/png;base64,${png}"><div class="avatar"></div><p>${brand}, ${phone?'phone':'desktop'} crop</p>`);
   await p.evaluate(()=>document.images[0].decode());
   await p.screenshot({path:path.join(out,`${id}-${phone?'phone':'desktop'}.png`)});
   await p.close();
  }
 }
 // Exercise the optional background in the existing stage, at its supported portrait size.
 const stage=await browser.newPage();
 await stage.goto('file://'+path.join(root,'plugin/engine/stage.html'));
 await stage.evaluate(()=>document.fonts.ready);
 const pattern='file://'+path.join(root,'plugin/brand/downloads/linkedin-patterns/ais-linkedin-background-circuit-traces-white-on-blue-1080x1350.svg');
 const spec={kind:'post',brand:'ais-group',lang:'en',format:'4x5',shots:[{type:'text',headline:'Quality inspection',bg:'blue',patternSources:{'4x5':pattern}}]};
 await stage.evaluate(x=>window.preload(x),spec);
 const info=await stage.evaluate(x=>window.setup({...x,still:true}),spec);
 await stage.setViewportSize({width:info.width,height:info.height});
 await stage.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode())]));
 await stage.evaluate(n=>window.frame(n),info.posters[0]);
 if(await stage.locator('.linkedin-pattern').count()!==1) throw Error('Optional pattern missing');
 await stage.screenshot({path:path.join(out,'optional-post.png')});
 await stage.close();
 console.log(out);
} finally {await browser.close();}
