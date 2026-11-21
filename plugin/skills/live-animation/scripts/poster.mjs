// node poster.mjs <url> <outdir> : compares the poster against the live first frame (t = 0) at desktop and phone widths,
// reports ImageMagick RMSE per width, and fails if the handover drifts past MAX_RMSE (default 0.06).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { hideChrome, launchBrowser, prepPage, STAGE_SEL, waitLive } from './lib.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.error('usage: node poster.mjs <url> <outdir>'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const maxRmse = Number(process.env.MAX_RMSE ?? 0.06);
const widths = [[1600, 1000], [1440, 900], [1920, 1080], [390, 844]];
const failures = [];
const b = await launchBrowser();

for (const [W, H] of widths) {
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await prepPage(p);
  await waitLive(p, `${url}${url.includes('?') ? '&' : '?'}t=0`, 1200);
  await hideChrome(p, '.pl-open, .pl-full, [data-open], [data-full]');
  const stage = await p.$(STAGE_SEL);
  const liveFile = `${out}/live-${W}x${H}.png`, posterFile = `${out}/poster-${W}x${H}.png`, diffFile = `${out}/diff-${W}x${H}.png`;
  await stage.screenshot({ path: liveFile });
  await p.addStyleTag({ content: '.pl-stage.is-live .pl-poster, [data-anim-stage].is-live [data-poster] { visibility: visible !important } .pl-stage .pl-canvas, [data-anim-stage] canvas { opacity: 0 !important }' });
  await p.waitForTimeout(300);
  await stage.screenshot({ path: posterFile });
  await p.close();

  const cmp = spawnSync('compare', ['-metric', 'RMSE', liveFile, posterFile, diffFile], { encoding: 'utf8' });
  const m = (cmp.stderr || cmp.stdout).match(/\(([\d.]+)\)/);
  const rmse = m ? Number(m[1]) : NaN;
  console.log(`${W}x${H}: RMSE=${Number.isFinite(rmse) ? rmse.toFixed(4) : 'err'}`);
  if (!Number.isFinite(rmse) || rmse > maxRmse) failures.push(`${W}x${H}: RMSE=${rmse} > ${maxRmse}`);
}
await b.close();

if (failures.length) {
  for (const f of failures) console.error('FAIL:', f);
  process.exit(1);
}
console.log(`PASS: poster matches live first frame across ${widths.length} viewports (RMSE <= ${maxRmse})`);
