// node camtest.mjs <url> <outdir> <cams.json> : cams.json = [{name, t:[...], cam:[px,py,pz,tx,ty,tz,f,fov] | null}]
import fs from 'node:fs';
import { hideChrome, launchBrowser, prepPage, seekTo, STAGE_SEL, waitLive } from './lib.mjs';

const [url, out, file] = process.argv.slice(2);
if (!url || !out || !file) { console.error('usage: node camtest.mjs <url> <outdir> <cams.json>'); process.exit(2); }
const cams = JSON.parse(fs.readFileSync(file, 'utf8'));
fs.mkdirSync(out, { recursive: true });
const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: Number(process.env.W ?? 1600), height: Number(process.env.H ?? 1000) } });
await prepPage(p, { logWarnings: true });
await waitLive(p, `${url}${url.includes('?') ? '&' : '?'}t=${cams[0].t[0]}`, 1500);
await hideChrome(p, process.env.HIDE ?? '');
const stage = await p.$(STAGE_SEL);
for (const c of cams) for (const t of c.t) {
  await p.evaluate((cam) => (window.__anim ?? window.__pl).cam(cam), c.cam);
  await seekTo(p, t);
  await stage.screenshot({ path: `${out}/${c.name}-${t}.png` });
}
await p.evaluate(() => (window.__anim ?? window.__pl).cam(null));
await b.close();
console.log('ok');
