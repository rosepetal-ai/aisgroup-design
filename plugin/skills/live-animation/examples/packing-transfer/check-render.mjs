import assert from 'node:assert/strict';
import { chromium, CHROME_ARGS } from '../../scripts/lib.mjs';
import { audit } from './audit.mjs';

const url = process.argv[2];
if (!url) throw new Error('Pass the URL of the running example or its standalone file URL');
const browser = await chromium.launch({
  args: CHROME_ARGS,
  executablePath: process.env.CHROME_BIN || undefined,
});
try {
  const page = await browser.newPage(),
    errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  await page.waitForFunction(() => Boolean(window.packingTransfer));
  const samples = await page.evaluate(() =>
    Array.from({ length: 541 }, (_, i) => window.packingTransfer.measure(i / 60)),
  );
  console.log(audit(samples));
  const backwards = await page.evaluate(() => [7, 5, 2].map((t) => window.packingTransfer.measure(t)));
  for (const sample of backwards) assert.deepEqual(sample, samples[sample.t * 60]);
  await page.getByRole('button', { name: 'Play' }).click();
  await page.waitForFunction(() => Number(document.querySelector('input').value) > 0.08);
  await page.getByRole('button', { name: 'Pause' }).click();
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
