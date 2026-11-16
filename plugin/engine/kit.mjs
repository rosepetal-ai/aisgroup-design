// Exports the kit pages in brand/kit/*.html (copies of the guide's kit) and runs the guide's brand check on them.
//   npm run kit                       all pages
//   npm run kit -- linkedin-banners   only the pages whose name contains "linkedin-banners"
// Each .artboard becomes out/kit/preview/<page>-<id>.png at 2x. A page whose <body> has data-medium="print" also
// becomes out/kit/pdf/<page>.pdf, which must embed no Type 3 font.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.join(ROOT, 'brand/kit'), PREVIEW = path.join(ROOT, 'out/kit/preview'), PDF = path.join(ROOT, 'out/kit/pdf');
const AXE = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const only = process.argv[2];
fs.mkdirSync(PREVIEW, { recursive: true }); fs.mkdirSync(PDF, { recursive: true });

const files = fs.readdirSync(KIT).filter((f) => f.endsWith('.html') && (!only || f.includes(only)));
if (!files.length) { console.error(`No kit page in brand/kit matches "${only}".`); process.exit(1); }
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] }); // hinted glyph advances open gaps in small tracked text
let failed = 0;
for (const f of files) {
  const name = f.replace(/\.html$/, '');
  const page = await browser.newPage({ viewport: { width: 2400, height: 1400 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await page.goto('file://' + path.join(KIT, f), { waitUntil: 'load', timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  const medium = await page.evaluate(() => document.body.dataset.medium || 'screen');

  // The guide's brand check, with the guide's two exceptions: print goes down to 8 pt, email is set in Arial.
  await page.addScriptTag({ path: path.join(ROOT, 'brand/downloads/qa/brand-check.js') });
  await page.addScriptTag({ path: AXE });
  const report = await page.evaluate(() => aisBrandCheck());
  const findings = report.findings.filter((x) => {
    if (/kit-head|board-label/.test(x.where)) return false; // the viewer's labels are not part of a piece
    if (x.rule === 'text-size' && medium === 'print') return parseFloat(x.detail) < 10.66;
    if (x.rule === 'font' && medium === 'email') return !/"arial"/.test(x.detail);
    return true;
  });
  console.log(`${f}  (${medium})`);
  for (const x of findings) console.log(`  ${x.rule.padEnd(14)} ${x.detail}  [${x.where}]`);
  if (findings.length) failed++;

  for (const old of fs.readdirSync(PREVIEW).filter((p) => p.startsWith(name + '-'))) fs.rmSync(path.join(PREVIEW, old));
  const boards = await page.$$('.artboard');
  for (const [i, b] of boards.entries()) {
    const id = (await b.getAttribute('data-id')) || String(i + 1).padStart(2, '0');
    await b.screenshot({ path: path.join(PREVIEW, `${name}-${id}.png`) });
  }
  if (medium === 'print') {
    const pdf = path.join(PDF, name + '.pdf');
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true, tagged: true });
    const t3 = execFileSync('pdffonts', [pdf]).toString().split('\n').filter((l) => /Type 3/.test(l));
    for (const l of t3) console.log(`  pdf-font       Type 3: ${l.split(/\s+/)[0]}`);
    if (t3.length) failed++;
  }
  console.log(`  wrote ${boards.length} preview${boards.length === 1 ? '' : 's'}${medium === 'print' ? ' and the PDF' : ''}`);
  await page.close();
}
await browser.close();
if (failed) { console.log(`\n${failed} page(s) with brand-check findings`); process.exitCode = 1; }
