// Compare two settled screenshots. Hiding only text leaves icons and button borders intact.
import assert from 'node:assert/strict';

export async function checkButtonInk(page, root) {
  await page.evaluate(()=>document.fonts.ready);
  // Portalled menus animate from their trigger. Measure their settled bounds and pixels.
  await root.evaluate(async el=>{
    await Promise.allSettled(el.getAnimations({subtree:true}).filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  const controls = root.locator('button:visible, [role^="menuitem"]:visible');
  const samples=await controls.evaluateAll(nodes=>nodes.flatMap(el=>{
    if(!el.textContent.trim())return [];
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode, match=/[A-Z0-9]/.exec(node.textContent);
      if(!match)continue;
      const range=new Range();range.setStart(node,match.index);range.setEnd(node,match.index+1);
      const r=range.getBoundingClientRect(),b=el.getBoundingClientRect();
      return [{name:el.textContent.trim(),left:r.left,right:r.right,top:b.top,bottom:b.bottom,
        trimmed:!CSS.supports('text-box','trim-both cap alphabetic') || getComputedStyle(node.parentElement).textBoxTrim==='trim-both'}];
    }
    return [];
  }));
  assert.ok(samples.length,'No visible text controls with capitals or numerals in this layout');
  const opts={animations:'disabled',timeout:15000};
  const first=await page.screenshot(opts);
  const style=await page.addStyleTag({content:'[data-slot="player-bar"] button, [role^="menuitem"], [data-player-label] {-webkit-text-fill-color:transparent!important;transition:none!important}'});
  let hidden;
  try{hidden=await page.screenshot(opts)}finally{await style.evaluate(el=>el.remove())}
  const rows=await page.evaluate(async ({images,samples})=>{
    const pix=await Promise.all(images.map(async data=>{
      const img=new Image();img.src='data:image/png;base64,'+data;await img.decode();
      const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
      const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height);
    }));
    const scale=pix[0].width/innerWidth;
    return samples.map(s=>{
      let top=Infinity,bottom=-Infinity;
      for(let y=Math.ceil(s.top*scale);y<Math.floor(s.bottom*scale);y++){
        for(let x=Math.ceil(s.left*scale);x<Math.floor(s.right*scale);x++){
          const i=4*(y*pix[0].width+x);
          if([0,1,2].some(k=>Math.abs(pix[0].data[i+k]-pix[1].data[i+k])>60)){
            top=Math.min(top,y);bottom=y;break;
          }
        }
      }
      return {name:s.name,trimmed:s.trimmed,offset:top===Infinity?null:((top+bottom+1)/scale-s.top-s.bottom)/2};
    });
  },{images:[first,hidden].map(buf=>buf.toString('base64')),samples});
  for(const row of rows){
    assert.ok(row.trimmed,'Missing cap-height trim on '+row.name);
    assert.ok(row.offset!==null && Math.abs(row.offset)<=1,JSON.stringify(row));
  }
  console.log('Centred text controls',rows.length,'maximum cap offset',Math.max(...rows.map(row=>Math.abs(row.offset))),'CSS px');
}
