#!/usr/bin/env node
// The five decorative patterns, end to end: linkedin_patterns.py writes the SVGs, then this rasterises them (Chromium) and
// writes, into the guide's public/downloads/linkedin-patterns/:
//   <name>.svg                       every pattern, colourway and size (the studio and the MCP use these)
//   previews/<name>.png              the 4:5 posts and profile banners at 40 %, for the guide's Patterns page
//   ais-linkedin-background-<pattern>.zip   one per pattern: every SVG and its PNG at full size
//   node print/linkedin_patterns.mjs [--raster-only] [pattern ...]   (from plugin/; --raster-only keeps the SVGs there; Chromium under flock /tmp/ais-marketing-render.lock)
import fs from 'node:fs';
import { PATTERNS as APPROVED } from '../engine/linkedin-patterns.mjs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = ['../../guide/public', '../../design-system/guide/public', '../../rosepetal-design/public'].find(p => fs.existsSync(path.join(HERE, p)));
const OUT = path.resolve(process.env.AIS_PATTERNS_OUT || path.join(HERE, PUBLIC, 'downloads/linkedin-patterns'));
// Night is retired: remove stale exports before the ZIP source scan.
for (const dir of [OUT, path.join(OUT, 'previews')]) {
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) {
    if (f.includes('-texture-on-night-')) fs.rmSync(path.join(dir, f), { force: true });
  }
}
const only = process.argv.slice(2).filter((a) => a !== '--raster-only');
if (only.some(p => !APPROVED.includes(p))) throw Error('Unapproved LinkedIn pattern');
if (!process.argv.includes('--raster-only')) execFileSync('python3', [path.join(HERE, 'linkedin_patterns.py'), '--out', OUT, ...only], { stdio: ['ignore', 'ignore', 'inherit'] });

const PATTERNS = only.length ? only : APPROVED;
// ponytail: full-size PNGs only travel in the zips, so the repo holds each picture once as SVG and once compressed.
const stage = fs.mkdtempSync(path.join(os.homedir(), '.cache', 'ais-linkedin-patterns-'));
fs.mkdirSync(path.join(OUT, 'previews'), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const p of PATTERNS) {
    const dir = path.join(stage, p); fs.mkdirSync(dir);
    for (const f of fs.readdirSync(OUT).filter((f) => f.startsWith(`ais-linkedin-background-${p}-`) && f.endsWith('.svg'))) {
      const svg = fs.readFileSync(path.join(OUT, f), 'utf8'), [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number);
      const shot = async (scale, to) => {
        await page.setViewportSize({ width: Math.round(w * scale), height: Math.round(h * scale) });
        await page.setContent(`<style>html,body{margin:0}img{display:block;width:100vw;height:100vh}</style><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">`);
        await page.evaluate(() => document.images[0].decode());
        await page.screenshot({ path: to, omitBackground: true });
      };
      fs.copyFileSync(path.join(OUT, f), path.join(dir, f));
      const png = f.replace(/\.svg$/, '.png');
      await shot(1, path.join(dir, png));
      fs.copyFileSync(path.join(dir, png), path.join(OUT, png));
      if (/-(1080x1350|1584x396)\.svg$/.test(f)) await shot(0.4, path.join(OUT, 'previews', f.replace(/\.svg$/, '.png')));
    }
    const zip = path.join(OUT, `ais-linkedin-background-${p}.zip`);
    fs.rmSync(zip, { force: true });
    const epoch = new Date('2026-11-10T00:00:00Z');
    for (const f of fs.readdirSync(dir)) fs.utimesSync(path.join(dir, f), epoch, epoch);
    execFileSync('zip', ['-q', '-X', zip, ...fs.readdirSync(dir).sort()], { cwd: dir });
    console.log(path.relative(process.cwd(), zip));
  }
} finally {
  await browser.close();
  fs.rmSync(stage, { recursive: true, force: true });
}
