// The app marks and every favicon made from them: the AIS Λ (cut from the AIS wordmark) and the Rosepetal "o"
// (cut from the Rosepetal wordmark), never traced or redrawn. One source, so a change to a logo changes every output.
//   node scripts/build-app-mark.mjs          write the files below (PNG and ICO need Chromium and Pillow)
//   node scripts/build-app-mark.mjs --check  exit 1 if any SVG or JSON differs from what this script makes
//
// public/logos/<brand>-mark-{blue,white,black}.svg  the bare mark, tight viewBox
// public/logos/app/<brand>/        app icon kind: white mark on the #17356E tile (installed apps, the product, Node-RED)
// public/logos/favicons/<brand>/   website kind: bare mark, #17356E in light mode and white in dark mode
// public/logos/app/*               the first AIS app set, kept at its old paths (same files as app/ais/)
// public/web/<site>/               each website's favicon set, with the site's name in its manifest
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOGOS = path.join(ROOT, 'public/logos');
const first = (file, n = 0) => [...fs.readFileSync(path.join(LOGOS, file), 'utf8').matchAll(/<path d="([^"]+)"/g)][n][1];
const C = { blue: '#17356E', white: '#FFFFFF', black: '#000000' };   // color.blue.700, white, logo black (100% K)

// Each mark: its path, cut from the wordmark, and its visible box measured with getBBox() on the official file.
const MARKS = {
  ais: { label: 'AIS', d: first('ais-group-blue.svg', 0), box: { x: 0.006, y: -0.015, w: 110.379, h: 145.945 } },        // the Λ
  rosepetal: { label: 'Rosepetal', d: first('rosepetal-blue.svg', 1), box: { x: 8.88, y: 1, w: 20.82, h: 20.82 } },     // the "o"
};

// The mark placed in a size × size box. h: visible height in px including the outline; top: px from the top;
// heavy: an outline in px that keeps thin parts solid at small sizes. Whole-pixel h and top put the flat edges
// (the Λ's apex and feet, the ring's extremes) on pixel boundaries.
function place(m, { size, h, top, heavy = 0 }) {
  const s = (h - heavy) / m.box.h, w = m.box.w * s;
  const tx = (size - w) / 2 - m.box.x * s, ty = top + heavy / 2 - m.box.y * s;
  const stroke = heavy ? ` stroke-width="${(heavy / s).toFixed(3)}" stroke-linejoin="round"` : '';
  return { transform: `translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${s.toFixed(5)})`, stroke };
}
const svg = (m, size, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="${m.label}">${body}</svg>\n`;

// App icon kind: the white mark on the blue tile. radius 0 where the platform rounds the corners itself.
function tile(m, o) {
  const p = place(m, o), r = o.radius ? ` rx="${(o.size * o.radius).toFixed(2)}"` : '';
  const ink = o.heavy ? ` fill="${C.white}" stroke="${C.white}"` : ` fill="${C.white}"`;
  return svg(m, o.size, `<rect width="${o.size}" height="${o.size}"${r} fill="${C.blue}"/><path transform="${p.transform}" d="${m.d}"${ink}${p.stroke}/>`);
}
// Website kind: the bare mark on transparent. color fixes one colour (PNG); without it the SVG follows the system theme.
function bare(m, o, color) {
  const p = place(m, o);
  if (color) return svg(m, o.size, `<path transform="${p.transform}" d="${m.d}" fill="${color}"${o.heavy ? ` stroke="${color}"` : ''}${p.stroke}/>`);
  const css = (c) => `path{fill:${c}${o.heavy ? `;stroke:${c}` : ''}}`;
  return svg(m, o.size, `<style>${css(C.blue)}@media (prefers-color-scheme:dark){${css(C.white)}}</style><path transform="${p.transform}" d="${m.d}"${p.stroke}/>`);
}

// Optical tuning, per mark and per size. The Λ is a narrow triangle: it gets an outline so its legs stay solid and is
// raised a pixel so its wide base doesn't look low. The ring is heavier than the Λ at the same height, so it is
// drawn smaller, and its outer edge lands on whole pixels.
const TUNE = {
  ais: {
    app: { 16: { h: 11, top: 2, heavy: 0.4 }, 32: { h: 22, top: 4, heavy: 0.6 }, 48: { h: 31, top: 7, heavy: 0.6 } },
    web: { 16: { h: 14, top: 1, heavy: 0.8 }, 32: { h: 28, top: 2, heavy: 1.1 }, 48: { h: 42, top: 3, heavy: 1.2 } },
    large: 0.56, raise: 0.02, maskable: 0.5,
  },
  rosepetal: {
    app: { 16: { h: 10, top: 3, heavy: 0.3 }, 32: { h: 20, top: 6, heavy: 0.3 }, 48: { h: 30, top: 9, heavy: 0.3 } },
    web: { 16: { h: 14, top: 1, heavy: 0.2 }, 32: { h: 28, top: 2, heavy: 0.2 }, 48: { h: 42, top: 3, heavy: 0.2 } },
    large: 0.5, raise: 0, maskable: 0.44,
  },
};
const big = (b, size, ratio, raise) => { const h = size * ratio; return { size, h, top: (size - h) / 2 - size * raise }; };

const SITES = { 'ais-group': ['ais', 'AIS Group'], 'ais-vision': ['ais', 'AIS Vision Systems'], rosepetal: ['rosepetal', 'Rosepetal'] };
const manifest = (name) => JSON.stringify({ name, short_name: name, icons: [
  { src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
  { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }], theme_color: C.blue, background_color: C.blue, display: 'standalone' }, null, 2) + '\n';
const iconsList = JSON.stringify(JSON.parse(manifest('x')).icons, null, 2) + '\n';

// Every output: SVG/JSON text, and PNG jobs as [file, svg text, size].
const text = {}, pngs = [], icos = [];
for (const [b, m] of Object.entries(MARKS)) {
  const t = TUNE[b];
  for (const [c, fill] of Object.entries(C))
    text[`logos/${b}-mark-${c}.svg`] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${m.box.x} ${m.box.y} ${m.box.w} ${m.box.h}" fill="${fill}" role="img" aria-label="${m.label}"><path d="${m.d}"/></svg>\n`;
  // Large icons, shared by both kinds (a home-screen or install icon is always the tile).
  const large = {
    'app-icon.svg': tile(m, big(b, 512, t.large, t.raise)),
    'app-icon-rounded.svg': tile(m, { ...big(b, 512, t.large, t.raise), radius: 0.225 }),
  };
  const raster = [['apple-touch-icon.png', tile(m, big(b, 180, t.large, t.raise)), 180], ['icon-192.png', tile(m, { ...big(b, 192, t.large, t.raise), radius: 0.225 }), 192],
    ['icon-512.png', tile(m, { ...big(b, 512, t.large, t.raise), radius: 0.225 }), 512], ['maskable-512.png', tile(m, big(b, 512, t.maskable, 0)), 512]];
  // App icon kind.
  const app = `logos/app/${b}`;
  Object.assign(text, Object.fromEntries(Object.entries(large).map(([f, s]) => [`${app}/${f}`, s])));
  text[`${app}/favicon.svg`] = tile(m, { size: 32, radius: 0.1875, ...t.app[32] });
  text[`${app}/manifest-icons.json`] = iconsList;
  text[`${app}/site.webmanifest`] = manifest(m.label);
  for (const n of [16, 32, 48]) pngs.push([`${app}/favicon-${n}.png`, tile(m, { size: n, radius: 0.1875, ...t.app[n] }), n]);
  for (const [f, s, n] of raster) pngs.push([`${app}/${f}`, s, n]);
  icos.push([`${app}/favicon.ico`, [16, 32, 48].map((n) => `${app}/favicon-${n}.png`)]);
  // Website kind.
  const web = `logos/favicons/${b}`;
  text[`${web}/favicon.svg`] = bare(m, { size: 32, ...t.web[32] });
  text[`${web}/site.webmanifest`] = manifest(m.label);
  for (const n of [16, 32, 48]) for (const [mode, color] of [['light', C.blue], ['dark', C.white]])
    pngs.push([`${web}/favicon-${n}-${mode}.png`, bare(m, { size: n, ...t.web[n] }, color), n]);
  for (const [f, s, n] of raster) pngs.push([`${web}/${f}`, s, n]);
  // favicon.ico can't follow the theme: it is the light version, for old browsers and the /favicon.ico request.
  icos.push([`${web}/favicon.ico`, [16, 32, 48].map((n) => `${web}/favicon-${n}-light.png`)]);
}
// The first AIS app set, at its old paths: copies of app/ais/.
const LEGACY = ['app-icon.svg', 'app-icon-rounded.svg', 'favicon.svg', 'manifest-icons.json'];
for (const f of LEGACY) text[`logos/app/${f}`] = text[`logos/app/ais/${f}`];
const LEGACY_BIN = ['favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'maskable-512.png'];
// Each website: its brand's website set, the manifest with the site's name. favicon.ico also sits at the root.
const WEB_FILES = ['favicon.svg', 'favicon.ico', ...[16, 32, 48].flatMap((n) => [`favicon-${n}-light.png`, `favicon-${n}-dark.png`]), 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'maskable-512.png'];
for (const [site, [b, name]] of Object.entries(SITES)) {
  text[`web/${site}/favicon.svg`] = text[`logos/favicons/${b}/favicon.svg`];
  text[`web/${site}/site.webmanifest`] = manifest(name);
}

const out = (f) => path.join(ROOT, 'public', f);
const check = process.argv.includes('--check'), stale = [];
for (const [f, s] of Object.entries(text)) {
  if (check) { if (!fs.existsSync(out(f)) || fs.readFileSync(out(f), 'utf8') !== s) stale.push(f); continue; }
  fs.mkdirSync(path.dirname(out(f)), { recursive: true }); fs.writeFileSync(out(f), s);
}
if (check) { console.log(stale.length ? 'stale: ' + stale.join(', ') : 'app mark files match'); process.exit(stale.length ? 1 : 0); }

// Playwright comes with the plugin's packages (npm workspaces); the guide site doesn't depend on it.
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const [f, s, n] of pngs) {
    await page.setViewportSize({ width: n, height: n });
    await page.setContent(`<html><body style="margin:0;background:transparent">${s.replace('<svg ', `<svg width="${n}" height="${n}" style="display:block" `)}</body></html>`);
    await page.screenshot({ path: out(f), omitBackground: true, clip: { x: 0, y: 0, width: n, height: n } });
  }
} finally { await browser.close(); }
// Multi-size .ico from the pixel-checked PNGs (Pillow writes it).
for (const [ico, parts] of icos) execFileSync('python3', ['-I', '-c', `import sys
from PIL import Image
ims=[Image.open(p).convert('RGBA') for p in sys.argv[2:]]
ims[-1].save(sys.argv[1],format='ICO',sizes=[i.size for i in ims],append_images=ims[:-1])`, out(ico), ...parts.map(out)]);
for (const f of LEGACY_BIN) fs.copyFileSync(out(`logos/app/ais/${f}`), out(`logos/app/${f}`));
for (const [site, [b]] of Object.entries(SITES)) for (const f of WEB_FILES.filter((f) => f !== 'favicon.svg')) fs.copyFileSync(out(`logos/favicons/${b}/${f}`), out(`web/${site}/${f}`));
// One zip per set for Downloads: public/downloads/favicons/<brand>-app-icons.zip and <brand>-favicons.zip.
for (const b of ['ais', 'rosepetal']) for (const [kind, dir] of [['app-icons', `logos/app/${b}`], ['favicons', `logos/favicons/${b}`]]) {
  const zip = out(`downloads/favicons/${b}-${kind}.zip`);
  fs.mkdirSync(path.dirname(zip), { recursive: true }); fs.rmSync(zip, { force: true });
  execFileSync('zip', ['-q', '-X', '-r', zip, '.'], { cwd: out(dir) });
}
console.log(`wrote ${Object.keys(text).length} SVG and JSON files, ${pngs.length} PNG, ${icos.length} ICO, and the copies`);
