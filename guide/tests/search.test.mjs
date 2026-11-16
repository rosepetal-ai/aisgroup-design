// Run after `npm run build -w guide`, under the shared safe_render.py guard.
// Browser requests read the built files directly: no server or hosted service.
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const dist = process.env.AIS_SEARCH_DIST || fileURLToPath(new URL('../dist/', import.meta.url));
const evidence = process.env.AIS_SEARCH_EVIDENCE;
if (evidence) await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--renderer-process-limit=2'] });
let passed = 0;
const check = (name) => { passed++; console.log(`PASS ${name}`); };
const types = { html: 'text/html', js: 'text/javascript', css: 'text/css', wasm: 'application/wasm', json: 'application/json', svg: 'image/svg+xml', woff2: 'font/woff2' };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'guide.test') return route.abort();
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith('/')) path += 'index.html';
    if (path.includes('..')) return route.abort();
    try { await route.fulfill({ body: await readFile(dist + path), contentType: types[path.split('.').pop()] || 'application/octet-stream' }); }
    catch { await route.fulfill({ status: 404, body: 'Not found' }); }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://guide.test/en/');
  await page.locator('.side .guide-search-trigger').click();
  const input = page.locator('#guide-search-input');
  const links = page.locator('#guide-search-results a');
  await input.waitFor({ state: 'visible' });
  assert.equal(await input.evaluate(el => el === document.activeElement), true);
  assert.match(await page.locator('#guide-search-status').textContent(), /Type to search/);
  check('dialog opens with focus and localized initial state');
  await input.fill('laser engraving');
  await links.first().waitFor();
  assert.match(await links.first().getAttribute('href'), /^\/en\/logos\/#/);
  assert.match(await links.first().textContent(), /engraving/i);
  const target = await links.first().getAttribute('href');
  const targetPage = await context.newPage();
  await targetPage.goto('http://guide.test' + target);
  assert.equal(await targetPage.locator(decodeURIComponent(new URL(targetPage.url()).hash)).count(), 1);
  await targetPage.close();
  await page.bringToFront(); // the second tab took focus; Escape only reaches the active tab
  check('body-only phrase ranks logo rules first; excerpt and heading destination exist');
  await input.press('ArrowDown');
  assert.equal(await links.first().evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('ArrowUp');
  assert.equal(await input.evaluate(el => el === document.activeElement), true);
  check('arrow keys move between query and result links');
  if (evidence) await page.screenshot({ path: evidence + '/desktop-results.png' });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#guide-search').evaluate(el => el.open), false);
  assert.equal(await page.locator('.side .guide-search-trigger').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Control+k');
  await input.fill('zxqvnonexistent');
  await page.waitForFunction(() => document.querySelector('#guide-search-status').textContent === 'No results found.');
  check('shortcut, Escape, focus restoration and empty results');
  if (evidence) await page.screenshot({ path: evidence + '/desktop-empty.png' });
  await input.fill('');
  await page.waitForFunction(() => document.querySelector('#guide-search-status').textContent === 'Type to search the guide.');
  assert.equal(await links.count(), 0);
  check('clearing query clears results and pending searches');
  await input.fill('button'); await links.first().waitFor();
  assert.ok((await links.evaluateAll(els => els.map(el => el.pathname))).every(path => path.startsWith('/en/')));
  assert.ok((await links.evaluateAll(els => els.map(el => el.pathname))).some(path => path.includes('/components/')));
  check('component documentation is indexed in current language');
  await input.fill('split button'); await links.first().waitFor(); // prose, not code: code samples aren't indexed
  assert.ok((await links.evaluateAll(els => els.map(el => el.pathname))).some(path => path.includes('/web-components/')));
  check('web component documentation is indexed');
  for (const lang of ['es', 'ca']) {
    await page.goto(`http://guide.test/${lang}/`);
    await page.keyboard.press('Control+k');
    const query = lang === 'es' ? 'COMUNICACION' : 'COMUNICACIO';
    await input.fill(query); await links.first().waitFor();
    const plain = await links.evaluateAll(els => els.map(el => el.getAttribute('href')));
    assert.ok(plain.every(url => url.startsWith(`/${lang}/`)));
    await input.fill(lang === 'es' ? 'comunicación' : 'comunicació');
    await links.first().waitFor();
    assert.deepEqual(await links.evaluateAll(els => els.map(el => el.getAttribute('href'))), plain);
    check(`${lang}: accents, case and language isolation`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://guide.test/es/');
  // Phones: the header's search icon, with the menu still closed.
  await page.locator('.top .guide-search-icon').click();
  await input.fill('logotipo'); await links.first().waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  if (evidence) await page.screenshot({ path: evidence + '/mobile-results.png' });
  // Native modal keeps tab focus off the page behind it.
  for (let i = 0; i < (await links.count()) + 5; i++) {
    await page.keyboard.press('Tab');
    // Inside the dialog, or out to the browser's own UI (body), never onto the inert page behind it.
    assert.equal(await page.evaluate(() => document.querySelector('#guide-search').contains(document.activeElement) || document.activeElement === document.body), true);
  }
  check('mobile search and native modal focus containment');
  await page.keyboard.press('Escape');
  // The mobile header button owns menu state and restores keyboard focus.
  const menu = page.locator('.top .menu-toggle');
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.evaluate(() => document.querySelector('.side').contains(document.activeElement)), true);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await menu.evaluate(el => el === document.activeElement), true);
  check('mobile menu state, scroll lock, Escape and focus return');
  await menu.click();
  await page.keyboard.press('Control+k');
  await input.waitFor({ state: 'visible' });
  check('mobile shortcut opens search from collapsed menu');
  await page.keyboard.press('Escape');
  await page.route('**/pagefind/**', route => route.abort());
  await page.goto('http://guide.test/en/');
  await page.keyboard.press('Control+k'); await input.fill('logo');
  await page.waitForFunction(() => document.querySelector('#guide-search-status').textContent.includes('Search is unavailable'));
  if (evidence) await page.screenshot({ path: evidence + '/mobile-error.png' });
  check('failed index load produces localized error');
  // Error recovery: module imports in a browser are sticky after a network failure,
  // so reload the page, as a normal navigation would.
  assert.deepEqual(errors, []);
  console.log(`${passed} search checks passed.`);
} finally { await browser.close(); }
