// AIS HTML decks: walk every beat and prove each frame is the same however it is reached (after beatdeck's verify).
//   flock /tmp/ais-marketing-render.lock nice -n 15 node decks/verify.mjs pieces/decks/<deck>/content.<lang>.json   (after build.mjs)
// Every position #slide.beat is captured walking forwards (→), walking backwards (←) and loaded straight from the URL;
// the three frames must match (≤ 0.1 % of pixels differ), and each slide's last beat must match its exported PNG, so the
// presented deck, the PDF and the PPTX show the same thing. Also fails on console errors and on any non-local request,
// and runs the spacing audit (bands.mjs measureRhythm) on the export view: every gap outside the set, every text off the grid.
// Writes build/verify/{walk,back,direct}-SS-BB.png, contact.jpg and report.txt next to the content file. Exit 1 on any failure.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {measureAlignment} from './alignment.mjs';
import {measureBands, measureRhythm, RHYTHM, measureFoot, footReport} from './bands.mjs';
import { pythonPath } from '../scripts/setup.mjs';

const contentPath = path.resolve(process.argv[2] || '');
const out = path.dirname(contentPath);
const url = pathToFileURL(path.join(out, JSON.parse(fs.readFileSync(contentPath, 'utf8')).meta.file + '.html')).href;
const vdir = path.join(out, 'build', 'verify');
fs.rmSync(vdir, {recursive: true, force: true});
fs.mkdirSync(vdir, {recursive: true});
// Finish the browser's real CSS transitions after two painted frames. This tests the
// same settled endpoint without sleeping 1.8 seconds for each of ~2000 captures.
const settle = async page => page.evaluate(async () => {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  document.getAnimations().forEach(animation => { try { animation.finish(); } catch {} });
  await new Promise(resolve => requestAnimationFrame(resolve));
});
const {chromium} = await import('playwright');
const browser = await chromium.launch({headless: true, args: ['--disable-dev-shm-usage', '--disable-gpu']});
const errors = [];
const watch = (page) => {
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`console ${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push('page error: ' + e.message));
  page.on('request', (r) => { if (!/^(file|data|blob|about):/.test(r.url())) errors.push('non-local request: ' + r.url()); });
};
let footText = '';
const tag = (s, b) => `${String(s + 1).padStart(2, '0')}-${String(b).padStart(2, '0')}`;
try {
  const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
  watch(page);
  await page.goto(url + '#1', {waitUntil: 'load'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.documentElement.dataset.snapped === '1');
  const beats = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s) => Math.max(0, ...[...s.querySelectorAll('[data-beat]')].map((e) => +e.dataset.beat))));
  const positions = beats.flatMap((n, s) => Array.from({length: n + 1}, (_, b) => [s, b]));
  const hash = async () => page.evaluate(() => location.hash);
  await settle(page);
  for (let k = 0; k < positions.length; k++) {
    const [s, b] = positions[k];
    const h = await hash(), want = '#' + (s + 1) + (beats[s] ? '.' + b : '');
    if (h !== want) errors.push(`walk: expected ${want}, the URL says ${h}`);
    await page.screenshot({path: path.join(vdir, `walk-${tag(s, b)}.png`)});
    if (k < positions.length - 1) { await page.keyboard.press('PageDown'); await settle(page); }
  }
  for (let k = positions.length - 1; k >= 0; k--) {
    const [s, b] = positions[k];
    await page.screenshot({path: path.join(vdir, `back-${tag(s, b)}.png`)});
    if (k > 0) { await page.keyboard.press('PageUp'); await settle(page); }
  }
  const direct = await browser.newPage({viewport: {width: 1920, height: 1080}});
  watch(direct);
  for (const [s, b] of positions) {
    await direct.goto('about:blank');
    await direct.goto(url + '#' + (s + 1) + '.' + b, {waitUntil: 'load'});
    await direct.evaluate(() => document.fonts.ready);
    await direct.waitForFunction(() => document.documentElement.dataset.snapped === '1');
    await settle(direct);
    await direct.screenshot({path: path.join(vdir, `direct-${tag(s, b)}.png`)});
  }
  const audit = await browser.newPage({viewport: {width: 1920, height: 1080}});
  await audit.goto(url + '?export', {waitUntil: 'load'});
  await audit.evaluate(() => document.fonts.ready);
  await audit.waitForFunction(() => document.documentElement.dataset.snapped === '1');
  (await audit.evaluate(measureRhythm, RHYTHM)).forEach((r, k) => r.forEach((x) => errors.push(`spacing, slide ${k + 1}: ${x}`)));
  const bands = await audit.evaluate(measureBands);
  bands.forEach((band,k)=> { if (!band.exempt && band.gap>.15) errors.push(`empty area, slide ${k+1}: ${(band.gap*100).toFixed(1)}% exceeds 15%`); });
  fs.writeFileSync(path.join(vdir, 'empty-bands.json'), JSON.stringify(bands,null,2));
  const alignment = await audit.evaluate(measureAlignment);
  alignment.forEach((row) => row.failures.forEach((x) => errors.push(`alignment, slide ${row.slide}: ${x}`)));
  fs.writeFileSync(path.join(vdir, 'alignment.json'), JSON.stringify(alignment, null, 2));
  // The foot (slide number, cover line, logos): same distances from the edges on every slide of a kind, on the grid.
  const foot = footReport(await audit.evaluate(measureFoot));
  foot.fails.forEach((x) => errors.push(x));
  fs.writeFileSync(path.join(vdir, 'foot.json'), JSON.stringify(foot.values, null, 1));
  footText = Object.entries(foot.values).map(([k, v]) => `${k} (${v.slides} slides): ` + Object.entries(v).filter(([e]) => e !== 'slides').map(([e, [a, b]]) => `${e} ${a === b ? a : a + '-' + b} px`).join(', ')).join('\n');
  fs.writeFileSync(path.join(vdir, 'positions.json'), JSON.stringify({beats, positions}));
} finally { await browser.close(); }

// Compare frames in Python (PIL): share of pixels whose channels differ by more than 24.
const report = execFileSync(pythonPath(), ['-I', '-c', `import json,sys,os,glob
from PIL import Image, ImageChops
v=sys.argv[1]; out=sys.argv[2]
P=json.load(open(os.path.join(v,'positions.json')))
def diff(a,b):
    A=Image.open(a).convert('RGB'); B=Image.open(b).convert('RGB')
    if A.size!=B.size: return 1.0
    d=ImageChops.difference(A,B).convert('L').point(lambda x:255 if x>24 else 0)
    return sum(d.histogram()[255:])/(A.size[0]*A.size[1])
bad=[]; rows=[]
slides=sorted(glob.glob(os.path.join(out,'slides','*.png')))
for s,b in P['positions']:
    t='%02d-%02d'%(s+1,b); w=os.path.join(v,'walk-'+t+'.png')
    for kind in ('back','direct'):
        r=diff(w,os.path.join(v,kind+'-'+t+'.png'))
        if r>0.001: bad.append('#%d.%d %s differs from walk by %.2f %%'%(s+1,b,kind,r*100))
    if b==P['beats'][s] and s<len(slides):
        r=diff(w,slides[s])
        if r>0.001: bad.append('#%d.%d last beat differs from the exported PNG by %.2f %%'%(s+1,b,r*100))
    rows.append(w)
W=384;H=216;cols=8
sheet=Image.new('RGB',(cols*(W+8)+8,((len(rows)+cols-1)//cols)*(H+8)+8),(148,163,184))
for k,f in enumerate(rows): sheet.paste(Image.open(f).convert('RGB').resize((W,H)),(8+(k%cols)*(W+8),8+(k//cols)*(H+8)))
sheet.save(os.path.join(v,'contact.jpg'),quality=85)
print('\\n'.join(bad) if bad else 'frames match (%d positions, forwards, backwards, direct, export)'%len(P['positions']))`, vdir, out]).toString().trim();
// The release workflow can supply the native PPTX render for the same measured baseline contract.
const nativeAt = process.argv.indexOf('--pptx-pdf');
if (nativeAt >= 0) {
  try { execFileSync(pythonPath(), [path.join(path.dirname(new URL(import.meta.url).pathname), 'verify_pptx.py'), path.join(out, JSON.parse(fs.readFileSync(contentPath, 'utf8')).meta.file + '.pdf'), path.resolve(process.argv[nativeAt + 1]), path.join(vdir, 'pptx-baselines.json')], {stdio: 'pipe'}); }
  catch (e) { errors.push('native PPTX baseline check failed: ' + String(e.stdout || e.message)); }
}
const all = [...new Set(errors)];
const text = (all.length ? all.join('\n') + '\n' : '') + report + '\nfoot, measured:\n' + footText + '\n';
fs.writeFileSync(path.join(vdir, 'report.txt'), text);
console.log(text.trim());
if (all.length || !/^frames match/.test(report)) process.exitCode = 1;
