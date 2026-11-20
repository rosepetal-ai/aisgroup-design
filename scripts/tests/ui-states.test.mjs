// The runtime states check, on pages served from here (no network), and our DropdownMenuContent as the guide builds it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { run, inspect, CONTENTS } from '../ui-states.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body { font: 14px/20px sans-serif; margin: 16px; background: #fff; color: #111 } .dark body { background: #111; color: #eee }
button { height: 32px; padding: 0 8px; font: inherit }
[role=menu] { position: fixed; top: 56px; left: 16px; padding: 4px; overflow-x: hidden; background: inherit; border: 1px solid #888 }
[role=menuitem] { display: flex; gap: 8px; align-items: center; min-height: 32px; padding: 6px 8px; box-sizing: border-box }
</style></head><body>${body}</body></html>`;
// A menu with a short trigger: a content as wide as its «Dev» trigger, then one that fits its longest label.
const menu = (width) => page(`<button data-slot="dropdown-menu-trigger" aria-haspopup="menu">Dev</button>
<script>
document.querySelector('button').addEventListener('click', () => {
  if (document.querySelector('[role=menu]')) return;
  const m = Object.assign(document.createElement('div'), { innerHTML: '<div role="menuitem" tabindex="-1">Claude Code</div><div role="menuitem" tabindex="-1">Documentation</div>' });
  m.setAttribute('role', 'menu'); m.dataset.slot = 'dropdown-menu-content'; m.style.cssText = '${width}';
  document.body.append(m);
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelector('[role=menu]')?.remove(); });
</script>`);
const PAGES = {
  '/menu-clipped': menu('width: 60px'),
  '/menu-fixed': menu('min-width: max(8rem, 60px); width: max-content'),
  '/small-label': page('<label style="font-size: 12px">Batch</label>'),
  '/wide': page('<div style="width: 600px; height: 20px; background: #ccc"></div>'),
  // A table wider than its scrolling container: the page itself does not scroll, the container does. Code may.
  '/wide-table': page('<div style="overflow-x: auto; width: 300px"><table><tr><td style="white-space: nowrap">A very long value that does not fit in three hundred pixels at all</td></tr></table></div><pre style="overflow-x: auto; width: 200px">a long line of code that is allowed to scroll sideways</pre>'),
  // A 36 px button beside a 28 px one, and a 36 px one in a dialog footer, whose buttons are 40 px.
  '/buttons': page('<div style="display: flex; gap: 8px"><button style="height: 36px">Save</button><button style="height: 28px">Cancel</button></div><div data-slot="dialog-footer"><button style="height: 36px">Delete</button></div>'),
  '/errors': page('<p>Ready</p><script>console.error("boom"); setTimeout(() => { throw new Error("late"); });</script>'),
  // Two dividers: a filter's 16 px divider pinned to the top of its button, and a collapsed sidebar's rule
  // given side margins on top of full width. Then both as they should be.
  ...Object.fromEntries([['/dividers', 'align-self: stretch', 'width: 100%'], ['/dividers-fixed', 'align-self: center', 'width: auto']].map(([route, align, width]) => [route, page(`<button style="display: flex; align-items: center; gap: 4px; border: 0">Status<span data-slot="separator" data-orientation="vertical" style="width: 1px; height: 16px; ${align}; background: #888"></span>Active</button>
<div style="display: flex; flex-direction: column; width: 48px; overflow: hidden; border-right: 1px solid #888"><div data-slot="separator" data-orientation="horizontal" style="height: 1px; margin: 0 8px; ${width}; background: #888"></div></div>
<div style="position: relative; width: 48px; height: 40px"><div role="separator" tabindex="0" aria-orientation="vertical" aria-label="Resize" style="position: absolute; right: -12px; width: 24px; height: 40px"></div></div>`)])),
};
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png' };
// Serves the fixtures, or a folder (the built guide) when given one.
async function serve(dir) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!dir) return PAGES[url] ? res.writeHead(200, { 'content-type': 'text/html' }).end(PAGES[url]) : res.writeHead(204).end();
    let file = path.join(dir, url);
    if (!file.startsWith(dir)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ui-states-'));

test('fails on a clipped menu, a 12 px label, a page wider than the phone, buttons off the scale and console or page errors; passes the fixed menu', async () => {
  const server = await serve(), out = tmp();
  try {
    const r = await run({ baseURL: server.url, routes: Object.keys(PAGES), themes: ['light'], viewports: [{ width: 390, height: 844 }], out, settle: 0 });
    assert.equal(r.statesFree, false);
    assert(r.routes['/menu-clipped']['clipped-text'] >= 1, JSON.stringify(r.routes));
    assert(r.routes['/menu-clipped']['wrapped-label'] >= 1, JSON.stringify(r.routes));
    assert.equal(r.routes['/menu-fixed'], undefined, JSON.stringify(r.findings.filter((f) => f.route === '/menu-fixed')));
    assert.deepEqual(Object.keys(r.routes['/small-label']), ['small-text']);
    assert.deepEqual(Object.keys(r.routes['/wide']), ['page-scroll']);
    assert.deepEqual(r.routes['/wide-table'], { 'inner-scroll': 1 });
    assert.deepEqual(r.routes['/buttons'], { 'button-height': 2, 'button-row-height': 1 });
    assert.deepEqual(r.findings.find((f) => f.rule === 'button-row-height').measured, { heights: [36, 28], buttons: ['Save', 'Cancel'] });
    assert.deepEqual(r.routes['/errors'], { 'console-error': 1, 'page-error': 1 }, 'errors raised while loading count once, at rest');
    assert.deepEqual(r.routes['/dividers'], { 'divider-overflow': 1, 'divider-off-centre': 1 });
    assert.deepEqual(r.findings.find((f) => f.rule === 'divider-off-centre').measured, { offset: -8, height: 16, rowHeight: 32 });
    assert.equal(r.routes['/dividers-fixed'], undefined, JSON.stringify(r.findings.filter((f) => f.route === '/dividers-fixed')));
    const clipped = r.findings.find((f) => f.rule === 'clipped-text');
    assert.equal(clipped.state, 'open dropdown-menu Dev');
    assert.equal(clipped.element.text, 'Documentation');
    assert(fs.existsSync(clipped.screenshot), 'every failure has its screenshot');
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')).counts, r.counts);
  } finally {
    server.close();
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('the fixed menu passes in both themes, at wide, desktop and phone width', async () => {
  const server = await serve(), out = tmp();
  try {
    const r = await run({ baseURL: server.url, routes: ['/menu-fixed'], out, settle: 0 });
    assert.equal(r.statesFree, true, JSON.stringify(r.findings, null, 2));
    assert.deepEqual(r.states.map((s) => [s.theme, s.viewport, s.opened.length]), [['light', '1920x1080', 1], ['dark', '1920x1080', 1], ['light', '1440x900', 1], ['dark', '1440x900', 1], ['light', '390x844', 1], ['dark', '390x844', 1]]);
  } finally {
    server.close();
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('DropdownMenuContent (built guide preview) grows to its longest item; the trigger-width class it replaced would not', async () => {
  const dist = path.join(ROOT, 'guide/dist');
  assert(fs.existsSync(path.join(dist, 'preview/dropdown-menu/01-row-actions/index.html')), 'build the guide first (npm run build)');
  const server = await serve(dist), browser = await chromium.launch();
  try {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(`${server.url}/preview/dropdown-menu/01-row-actions/`);
    await p.click('[data-slot="dropdown-menu-trigger"]');
    const content = p.locator('[data-slot="dropdown-menu-content"]');
    await content.waitFor();
    // A label longer than 8rem, as «Claude Code» and «Documentation» were beside their icons and shortcuts.
    await p.evaluate(() => { [...document.querySelector('[data-slot="dropdown-menu-item"]').childNodes].find((n) => n.nodeType === 3 && n.data.trim()).data = 'Open the documentation in a new window'; });
    await p.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
    const rules = async () => (await p.evaluate(inspect, { open: true, contents: CONTENTS, perRule: 25 })).found.map((f) => f.rule);
    assert.deepEqual(await rules(), []);
    await content.evaluate((e) => { e.style.width = 'var(--reka-dropdown-menu-trigger-width)'; e.style.minWidth = '8rem'; });
    assert((await rules()).includes('wrapped-label'), 'the check must catch the old trigger-width menu');
  } finally {
    await browser.close();
    server.close();
  }
});

test('the plugin carries the same states check', () => {
  assert.equal(fs.readFileSync(path.join(ROOT, 'plugin/scripts/ui-states.mjs'), 'utf8'), fs.readFileSync(path.join(ROOT, 'scripts/ui-states.mjs'), 'utf8'), 'run npm run sync:plugin');
});
