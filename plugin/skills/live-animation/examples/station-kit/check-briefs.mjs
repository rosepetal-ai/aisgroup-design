import assert from 'node:assert/strict';
import { chromium, CHROME_ARGS } from '../../scripts/lib.mjs';
import { audit } from '../packing-transfer/audit.mjs';

const url=process.argv[2];
if(!url)throw Error('Pass the station kit development URL');
const browser=await chromium.launch({args:CHROME_ARGS,executablePath:process.env.CHROME_BIN || undefined});
try {
  for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:width===390?844:900}});
    for(const variant of ['transfer','cabinet']){
      const location=new URL(url);location.searchParams.set('station',variant);
      await page.goto(location.href);await page.waitForFunction(()=>window.stationReview?.inspect);
      const samples=await page.evaluate(()=>[0,3,8].map(t=>{window.stationReview.seek(t);return window.stationReview.inspect()}));
      assert.deepEqual(samples.map(x=>x.runIntensity>1),[false,true,false]);
      for(const state of samples){
        assert.equal(state.operatorPresent,variant==='transfer');
        assert.ok(state.lampInFrame&&state.integratedMark,JSON.stringify(state));
      }
      if(variant==='transfer'){
        const frames=await page.evaluate(()=>Array.from({length:541},(_,i)=>window.stationReview.measure(i/60)));
        audit(frames);
      }
      console.log(width,variant,'passed');
    }
    await page.close();
  }
} finally {await browser.close();}
