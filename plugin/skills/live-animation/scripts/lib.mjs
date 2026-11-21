// Shared Playwright + piece-contract helpers for live-animation scripts.
// Resolves Playwright from the nearest package.json that lists it (or AIS_PLAYWRIGHT_ROOT) and supports both the general contract
// ([data-anim-stage], window.__anim) and the pharma-line pilot (.pl-stage, window.__pl / __plSeek / __plWall).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
function findPackageRoot(start) {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    const pkg = path.join(dir, 'package.json');
    if (fs.existsSync(pkg)) {
      try {
        const j = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        if (j.dependencies?.playwright || j.devDependencies?.playwright) return dir;
      } catch {}
    }
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return path.resolve(start, '../../../..');
}
export const STUDIO_DIR = process.env.AIS_PLAYWRIGHT_ROOT ? path.resolve(process.env.AIS_PLAYWRIGHT_ROOT) : findPackageRoot(SCRIPTS_DIR);
const req = createRequire(path.join(STUDIO_DIR, 'package.json'));
export const { chromium } = req('playwright');

export const CHROME_ARGS = [
  '--use-angle=vulkan',
  '--enable-features=Vulkan',
  '--ignore-gpu-blocklist',
  '--js-flags=--max-old-space-size=1024',
];

export const STAGE_SEL = '[data-anim-stage], .pl-stage';
export const LIVE_SEL = '[data-anim-stage].is-live, .pl-stage.is-live';
export const IGNORE_LOG = /WebSocket|vite|KHR_parallel|PCFSoft/i;

export async function launchBrowser() {
  return chromium.launch({ args: CHROME_ARGS });
}

export async function prepPage(page, { logWarnings = false, onLog } = {}) {
  await page.addInitScript(() => {
    localStorage.setItem('rosepetal_cookie_consent', JSON.stringify({ analytics: false, marketing: false }));
  });
  const issues = [];
  page.on('pageerror', (e) => {
    if (/WebSocket/.test(e.message)) return;
    issues.push(`pageerror: ${e.message}`);
    if (logWarnings) console.log('pageerror ' + e.message);
    onLog?.('pageerror', e.message);
  });
  page.on('console', (m) => {
    const text = m.text();
    if (IGNORE_LOG.test(text)) return;
    if (/warn|error/.test(m.type())) {
      issues.push(`${m.type()}: ${text.slice(0, 300)}`);
      if (logWarnings) console.log(`${m.type()} ${text.slice(0, 300)}`);
    }
    onLog?.(m.type(), text);
  });
  return issues;
}

export async function waitLive(page, url, settleMs = 1200) {
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForSelector(LIVE_SEL, { timeout: 180000 });
  if (settleMs > 0) await page.waitForTimeout(settleMs);
}

export async function hideChrome(page, extra = '') {
  const css = '.event-notice, [class*=event-notice] { display: none !important }'
    + (extra ? ` ${extra} { display: none !important }` : '');
  await page.addStyleTag({ content: css });
}

export async function seekTo(page, t) {
  await page.evaluate((t) => {
    const seek = window.__anim?.seek ?? window.__plSeek;
    if (!seek) throw new Error('Piece exposes neither window.__anim.seek nor window.__plSeek (need DEV server)');
    seek(t);
  }, t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}
