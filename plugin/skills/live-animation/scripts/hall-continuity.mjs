// Sample two clear strips picked from the shot plan. Inspect transitions with the same camera clock.
import {chromium, CHROME_ARGS} from './lib.mjs';
import assert from 'node:assert/strict';
const [url,timesArg='0,0.75,1.25,1.65,3,6,8']=process.argv.slice(2);
if(!url)throw Error('Pass a paused player URL with a seek adapter');
const browser=await chromium.launch({args:CHROME_ARGS,executablePath:process.env.CHROME_BIN||undefined});
try {
  for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:width===390?844:900}});
    await page.goto(url);
    await page.waitForFunction(()=>window.stationReview?.seek || window.__anim?.seek);
    let baseline,largestStep=0,largestShift=0;
    for(const t of timesArg.split(',').map(Number)){
      await page.evaluate(async t=>{(window.stationReview??window.__anim).seek(t);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))},t);
      const png=await page.screenshot();
      const {sky,step}=await page.evaluate(async data=>{
        const img=new Image();img.src='data:image/png;base64,'+data;await img.decode();
        const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
        const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const px=ctx.getImageData(0,0,c.width,c.height).data;
        const strip=(y,right)=>[0,1,2].map(k=>{
          const a=[];for(let x=2;x<Math.max(7,Math.floor(c.width*.02));x++){
            a.push(px[4*(y*c.width+(right?c.width-1-x:x))+k]);
          }
          a.sort((a,b)=>a-b);return a[a.length>>1];
        });
        const distance=(a,b)=>Math.max(...a.map((n,i)=>Math.abs(n-b[i])));
        const sky=strip(3,false);
        let step=0,prev=[sky,strip(3,true)];
        for(let y=4;y<c.height*.70;y++){
          const row=[strip(y,false),strip(y,true)];
          step=Math.max(step,Math.min(distance(row[0],prev[0]),distance(row[1],prev[1])));
          prev=row;
        }
        return {sky,step};
      },png.toString('base64'));
      baseline??=sky;
      const shift=Math.max(...sky.map((n,i)=>Math.abs(n-baseline[i])));
      largestStep=Math.max(largestStep,step);largestShift=Math.max(largestShift,shift);
      assert.ok(step<=4 && shift<=3,JSON.stringify({width,t,step,shift,sky,baseline}));
    }
    console.log(width,'largest bilateral row step',largestStep,'largest clear-sky channel shift',largestShift);
    await page.close();
  }
}finally{await browser.close()}
