// node film.mjs <url> <outdir> <t1,t2,...|from:to:step|w:from:to:step> : one page load (held at the first t), then
// seeks via DEV window.__anim.seek / __plSeek and shoots the stage at each story t.
// Env: W, H, DPR, HIDE, SHEET=<out.jpg> (builds contact sheets via sheet.mjs safely).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hideChrome, launchBrowser, prepPage, seekTo, STAGE_SEL, waitLive } from './lib.mjs';

const [url, out, spec] = process.argv.slice(2);
if (!url || !out || !spec) {
  console.error('usage: node film.mjs <url> <outdir> <t1,t2,...|from:to:step|w:from:to:step>');
  process.exit(2);
}
const wallMode = spec.startsWith('w:');
const ts = wallMode
  ? [Number(spec.split(':')[1])]
  : spec.includes(':')
    ? (() => { const [a, b, s] = spec.split(':').map(Number); const r = []; for (let t = a; t <= b + 1e-9; t += s) r.push(+t.toFixed(3)); return r; })()
    : spec.split(',').map(Number);

fs.mkdirSync(out, { recursive: true });
const b = await launchBrowser();
const p = await b.newPage({
  viewport: { width: Number(process.env.W ?? 1600), height: Number(process.env.H ?? 1000) },
  deviceScaleFactor: Number(process.env.DPR ?? 1),
});
await prepPage(p, { logWarnings: true });
await waitLive(p, `${url}${url.includes('?') ? '&' : '?'}t=${ts[0]}`, 1500);
await hideChrome(p, process.env.HIDE ?? '');
const stage = await p.$(STAGE_SEL);

if (wallMode) {
  const [, a, bEnd, st] = spec.split(':').map(Number);
  ts.length = 0;
  ts.push(...(await p.evaluate(([a, bEnd, st]) => {
    const wApi = window.__anim?.wall ?? window.__plWall;
    if (!wApi) throw new Error('Piece exposes neither window.__anim.wall nor window.__plWall');
    const r = [];
    for (let w = wApi.wallOf(a); w <= wApi.wallOf(bEnd) + 1e-9; w += st) r.push(+wApi.storyOf(w).toFixed(3));
    return r;
  }, [a, bEnd, st])));
}
for (const t of ts) {
  await seekTo(p, t);
  await stage.screenshot({ path: `${out}/${String(t.toFixed(3)).padStart(7, '0')}.png` });
}
console.log('shot', ts.length);
await b.close();

if (process.env.SHEET) {
  const sheetPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sheet.mjs');
  const r = spawnSync(process.execPath, [sheetPath, out, process.env.SHEET, process.env.COLS ?? '6', process.env.TILE ?? '320x200'], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
