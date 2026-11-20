// node hold.mjs <url> <outprefix> <t1,t2,...> [full|bare]: open the page held at each t (?t=), wait until live, shoot the stage.
import fs from 'node:fs';
import path from 'node:path';
import { hideChrome, launchBrowser, prepPage, STAGE_SEL, waitLive } from './lib.mjs';

const [url, out, ts, full] = process.argv.slice(2);
if (!url || !out || !ts) { console.error('usage: node hold.mjs <url> <outprefix> <t1,t2,...> [full|bare]'); process.exit(2); }
const T0 = Date.now(), log = (m) => console.log(((Date.now() - T0) / 1000).toFixed(1), m);
fs.mkdirSync(path.dirname(out), { recursive: true });
const b = await launchBrowser();
const p = await b.newPage({
  viewport: { width: Number(process.env.W ?? 1600), height: Number(process.env.H ?? 1000) },
  deviceScaleFactor: Number(process.env.DPR ?? 1),
});
await prepPage(p, { logWarnings: true });
const bare = full === 'bare';
let first = true;
for (const t of ts.split(',').map(Number)) {
  await waitLive(p, `${url}${url.includes('?') ? '&' : '?'}t=${t}`, bare ? 900 : 2600);
  await hideChrome(p, process.env.HIDE ?? '');
  if (bare) await p.addStyleTag({ content: `${STAGE_SEL} > :not(canvas, img) { display: none !important }` });
  if (first && full === 'full') await p.screenshot({ path: `${out}-page.png`, fullPage: true });
  first = false;
  await (await p.$(STAGE_SEL)).screenshot({ path: `${out}-${t}.png` });
  log('shot ' + t);
}
await b.close();
