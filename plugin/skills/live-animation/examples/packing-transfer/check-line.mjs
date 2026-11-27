import assert from 'node:assert/strict';
import { chromium, CHROME_ARGS } from '../../scripts/lib.mjs';

const [url, endArg, actorsArg, kindsArg] = process.argv.slice(2);
if (!url || !(Number(endArg) > 0) || !actorsArg || !kindsArg) {
  throw new Error('Usage: node check-line.mjs URL endSeconds actorNamesCSV contactKindsCSV');
}
const expectedActors = actorsArg.split(','), expectedKinds = kindsArg.split(',');
const browser = await chromium.launch({ args: CHROME_ARGS, executablePath: process.env.CHROME_BIN || undefined });
try {
  const page = await browser.newPage({viewport:{width:640,height:400}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.waitForFunction(() => !!window.__anim?.gripReview);
  const report = await page.evaluate(({end}) => {
    const anim = window.__anim;
    const measure = t => { anim.seek(t); return anim.gripReview(); };
    const actors = new Set(), kinds = new Set(), times = [end*.19,end*.57,end*.91];
    const witnesses = times.map(measure);
    let checks=0, worst=0, worstRow;
    for (let i=0;i<=Math.ceil(end*60);i++) {
      const t=Math.min(i/60,end);
      const rows=measure(t);
      for (const item of anim.requiredGrips()) {
        if (!rows.some(row=>row.actor===item.actor && row.kind===item.kind && row.id===item.id)) {
          throw new Error('Unsupported item at '+t+' s: '+JSON.stringify(item));
        }
      }
      for (const row of rows) {
        actors.add(row.actor); kinds.add(row.kind); checks++;
        if (!row.gaps.length || !row.gaps.every(Number.isFinite)) throw new Error('Missing surface at '+t);
        const gap=Math.max(...row.gaps);
        if (gap>worst) {worst=gap; worstRow={t,...row};}
      }
    }
    const repeatable=times.every((_,i)=>{
      const j=times.length-1-i;
      return JSON.stringify(measure(times[j]))===JSON.stringify(witnesses[j]);
    });
    return {checks,worst,worstRow,actors:[...actors].sort(),kinds:[...kinds].sort(),repeatable};
  },{end:Number(endArg)});
  assert.deepEqual(report.actors,expectedActors.sort());
  assert.deepEqual(report.kinds,expectedKinds.sort());
  assert.ok(report.repeatable,'Results changed after seeking backwards');
  assert.ok(report.worst<=Number(process.env.TOL || .002),JSON.stringify(report.worstRow));
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
