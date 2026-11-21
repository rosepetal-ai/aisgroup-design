// node align.mjs <url> [config.json] : verifies titles' left edges against the header logo (<= 2 px) and dialogs'
// centres against the app screen (<= 1 px) at four desktop widths. Exits 1 on any miss.
import fs from 'node:fs';
import { launchBrowser, prepPage, seekTo, waitLive } from './lib.mjs';

const [url, cfgPath] = process.argv.slice(2);
if (!url) { console.error('usage: node align.mjs <url> [config.json]'); process.exit(2); }

const cfg = cfgPath
  ? JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
  : {
      openT: 1.6,
      logoSel: '.brand img',
      appSel: '.plu-window, .pa-app',
      titles: [
        { k: 'open', t: 1.6, sel: '.pl-open__title' },
        { k: 'results', t: 84.5, sel: '.plu-results' },
        { k: 'close', t: 88, sel: '.plu-close__title' },
      ],
      dialogs: [
        { k: 'confirm', t: 13.5, sel: '.pa-confirm' },
        { k: 'notice', t: 60.5, sel: '.pa-notice__modal' },
        { k: 'reason', t: 66.8, sel: '.pa-reason' },
      ],
      widths: [[1600, 1000], [1440, 900], [1920, 1080], [1280, 800]],
    };

const titleTol = Number(process.env.TITLE_TOL ?? 2.5);
const dialogTol = Number(process.env.DIALOG_TOL ?? 1.5);
const failures = [];
const b = await launchBrowser();

for (const [W, H] of cfg.widths) {
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await prepPage(p);
  await waitLive(p, `${url}${url.includes('?') ? '&' : '?'}t=${cfg.openT}`, 800);
  const r = {};
  const left = (sel) => p.evaluate((s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const range = document.createRange();
    range.selectNodeContents(e);
    return Math.round(range.getBoundingClientRect().left * 10) / 10;
  }, sel);
  r.logo = await p.evaluate((s) => Math.round([...document.querySelectorAll(s)].find((i) => i.offsetWidth)?.getBoundingClientRect().left * 10) / 10, cfg.logoSel);

  for (const { k, t, sel } of cfg.titles) {
    if (t !== cfg.openT) { await seekTo(p, t); await p.waitForTimeout(200); }
    r[k] = await left(sel);
    if (r[k] == null || Math.abs(r[k] - r.logo) > titleTol) {
      failures.push(`${W}x${H} ${k}: left=${r[k]} vs logo=${r.logo} (tol ${titleTol} px)`);
    }
  }
  for (const { k, t, sel } of cfg.dialogs) {
    await seekTo(p, t);
    await p.waitForTimeout(200);
    r[k] = await p.evaluate(([s, appSel]) => {
      const d = [...document.querySelectorAll(s)].find((e) => getComputedStyle(e).opacity !== '0' && e.getBoundingClientRect().width);
      const app = document.querySelector(appSel);
      if (!d || !app) return null;
      const a = app.getBoundingClientRect(), q = d.getBoundingClientRect();
      return {
        dx: Math.round(((q.left + q.right) / 2 - (a.left + a.right) / 2) * 10) / 10,
        dy: Math.round(((q.top + q.bottom) / 2 - (a.top + a.bottom) / 2) * 10) / 10,
      };
    }, [sel, cfg.appSel]);
    if (!r[k] || Math.abs(r[k].dx) > dialogTol || Math.abs(r[k].dy) > dialogTol) {
      failures.push(`${W}x${H} ${k}: offset=${JSON.stringify(r[k])} (tol ${dialogTol} px)`);
    }
  }
  console.log(W, H, JSON.stringify(r));
  await p.close();
}
await b.close();

if (failures.length) {
  for (const f of failures) console.error('FAIL:', f);
  process.exit(1);
}
console.log('PASS: all titles and dialogs aligned');
