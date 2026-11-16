// Copies each website's final brand images into public/web/<site>/ under clean names, and zips each site folder into
// public/downloads/web/<site>.zip for the Web assets page. One file per picture, the largest the site has.
// Only what is listed here is published: no blog or news photos, logos (they are on Downloads), other companies'
// logos, video frames, event banners, old screens or responsive copies. Reads the site repos (RP_SITES overrides the
// folder); without them, the copies already in public/web stay as they are. Stock pictures (stock.mjs) are shown on the
// page, captioned as stock, but stay out of the zips: their licences let the sites show them, not pass the files on.
// src/data/web-stock.json lists them for the page.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isStock, recordedStock } from './stock.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sites = process.env.RP_SITES || path.resolve(repo, '../../../websites');
const industries = (dir, names, size) => Object.fromEntries(names.map(([to, from = to]) => [`industries/${to}.webp`, `${dir}/${from}${size}.webp`]));
const SITES = {
    'ais-vision': ['aisvision-web-aisvision/public', {
        'products/ais-hopper.webp': 'media/products/hopper-product-1672.webp',
        'products/ais-kariko.webp': 'media/products/kariko-product-1600.webp',
        'products/ais-rev-360.webp': 'media/products/rev-product-1600.webp',
        'products/ais-rev-360-cables.webp': 'media/products/cables-product-clean-1672.webp',
        ...industries('media/industries', [['automotive'], ['electronics'], ['food-beverage', 'food'], ['logistics'], ['pharma']], '-1672'),
    }],
    'rosepetal': ['rosepetal-web-static/astro/public', {
        ...Object.fromEntries(['capture-flow', 'classification-dataset', 'datasets-overview', 'detection-editor', 'segmentation-dataset'].map((n) => [`app/${n}.webp`, `images/landing/${n}.webp`])),
        'app/model-evaluation.webp': 'images/landing/model-evaluation-classification.webp',
        ...Object.fromEntries(['annotation-types', 'auto-labeling', 'label-assist', 'quality-metrics', 'smart-polygon'].map((n) => [`app/${n}.webp`, `images/platform/${n}.webp`])),
        'app/dataset-validation.webp': 'images/platform/validate-dataset.webp',
        'app/training-analysis-1.webp': 'images/platform/train-analysis1.webp',
        'app/training-analysis-2.webp': 'images/platform/train-analysis2.webp',
        'app/training-settings-1.webp': 'images/platform/train.settings1.webp',
        'app/training-settings-2.webp': 'images/platform/train.settings2.webp',
        ...industries('images/industries', [['automotive'], ['cable-inspection'], ['consumer-electronics', 'consumer'], ['food-beverage'], ['logistics'], ['manufacturing']], ''),
    }],
    'ais-group': ['aisvision-web-aisgroup/public', {
        'company/ais-vision-systems-inspection-station.webp': 'assets/companies/photos/avs-hero.webp',
        'company/ais-vision-systems-labelling.webp': 'assets/companies/photos/avs-labelling.webp',
        ...Object.fromEntries(['cell', 'cleanroom', 'design', 'engineer'].map((n) => [`company/ais-vision-automation-${n}.webp`, `assets/companies/photos/aisva-${n}.webp`])),
        'company/ais-vision-automation-facility.webp': 'assets/companies/heroes/ais-automation-facility.webp',
        'company/ais-vision-automation-machine.webp': 'assets/companies/heroes/aisva-developed-products.webp',
        'company/ais-scanology-7100.webp': 'assets/companies/heroes/ais-scanology-7100.webp',
        'company/ais-scanology-axicon.webp': 'assets/companies/heroes/ais-scanology-axicon.webp',
        'company/ais-scanology-lvs-9510.webp': 'assets/companies/heroes/ais-scanology-lvs9510.webp',
        'company/ais-scanology-lvs-9580.webp': 'assets/companies/heroes/ais-scanology-lvs9580.webp',
        'company/ais-scanology-range.webp': 'assets/companies/heroes/ais-scanology-range.webp',
        ...industries('assets/industries/studio', [['automotive'], ['electronics'], ['food-beverage'], ['life-sciences'], ['logistics'], ['packaging']], '-1200'),
        'solutions/artificial-intelligence.webp': 'assets/solutions/catalog/artificial-intelligence-1280.webp',
        'solutions/industrial-automation.webp': 'assets/solutions/catalog/industrial-automation-1600.webp',
        'solutions/machine-vision.webp': 'assets/solutions/catalog/machine-vision-1600.webp',
        'solutions/robotics.webp': 'assets/solutions/catalog/robotics-1600.webp',
        'solutions/traceability-serialization.webp': 'assets/solutions/catalog/traceability-serialization-1500.webp',
    }],
};
// Files the guide makes or adds that the sites don't carry; the sync keeps them. The favicon sets come from
// scripts/build-app-mark.mjs (light and dark).
const FAVICONS = ['favicon.svg', 'favicon.ico', ...[16, 32, 48].flatMap((n) => [`favicon-${n}-light.png`, `favicon-${n}-dark.png`]), 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'maskable-512.png', 'site.webmanifest'];
const AERIAL = 'company/ais-building-sabadell-from-above.jpg'; // the corporate deck's aerial, its black frame cut off
const GUIDE_ONLY = { 'ais-vision': [...FAVICONS, AERIAL], 'ais-group': [...FAVICONS, AERIAL], rosepetal: FAVICONS };

const stockList = {};
if (!fs.existsSync(sites)) { console.log(`No ${sites}: using the website images already in public/web.`); process.exit(0); }
for (const [site, [base, files]] of Object.entries(SITES)) {
    const from = path.join(sites, base);
    if (!fs.existsSync(from)) { console.log(`skipped ${site}: no ${from}`); continue; }
    const out = path.join(repo, 'public/web', site);
    const missing = Object.values(files).filter((src) => !fs.existsSync(path.join(from, src)));
    if (missing.length) { console.error(`${site}: the site no longer has ${missing.join(', ')}. Update scripts/sync-web-assets.mjs.`); process.exit(1); }
    // Overwrite in place and prune the rest: deleting the folder makes a running dev server lose it.
    for (const [to, src] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(path.join(out, to)), { recursive: true });
        fs.copyFileSync(path.join(from, src), path.join(out, to));
    }
    const keep = new Set([...Object.keys(files), ...GUIDE_ONLY[site]]);
    for (const d of fs.readdirSync(out, { recursive: true, withFileTypes: true }).filter((d) => d.isFile())) {
        const rel = path.relative(out, path.join(d.parentPath, d.name)).split(path.sep).join('/');
        if (!keep.has(rel)) fs.rmSync(path.join(out, rel));
    }
    const dirs = fs.readdirSync(out, { recursive: true, withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(d.parentPath, d.name));
    for (const dir of dirs.sort((a, b) => b.length - a.length)) if (!fs.readdirSync(dir).length) fs.rmdirSync(dir);
    const zip = path.join(repo, 'public/downloads/web', `${site === 'ais-vision' ? 'ais-vision-systems' : site}-web-assets.zip`); // named for the brand (Downloads naming)
    fs.mkdirSync(path.dirname(zip), { recursive: true });
    fs.rmSync(zip, { force: true });
    const recorded = recordedStock(path.join(sites, base.split('/')[0]));
    const stock = Object.entries(files).filter(([, src]) => isStock(src, recorded)).map(([to]) => to).sort();
    if (stock.length) stockList[site] = stock;
    const zipped = [...keep].filter((rel) => !stock.includes(rel) && fs.existsSync(path.join(out, rel))).sort();
    execFileSync('zip', ['-q', '-X', zip, '-@'], { cwd: out, input: zipped.join('\n') });
    console.log(`${site}: ${keep.size} files, ${zipped.length} in the zip (${stock.length} stock left out)`);
}
fs.writeFileSync(path.join(repo, 'src/data/web-stock.json'), `${JSON.stringify(stockList, null, 2)}\n`);

// The live product-film specimen uses the website's finished tour, poster and chapter edit.
const filmRoot = path.join(sites, 'rosepetal-web-static/astro');
const film = path.join(filmRoot, 'public/videos/rosepetal-product.mp4');
if (fs.existsSync(film)) {
    const out = path.join(repo, 'public/examples/web/product-film');
    fs.mkdirSync(out, { recursive: true });
    fs.copyFileSync(film, path.join(out, 'rosepetal-product.mp4'));
    fs.copyFileSync(path.join(filmRoot, 'public/images/landing/product-film-poster-workflow.webp'), path.join(out, 'poster.webp'));
    const edit = JSON.parse(fs.readFileSync(path.join(filmRoot, 'scripts/product-film-edit.json'), 'utf8'));
    let time = 0;
    const chapters = edit.clips.map(clip => {
        time -= (clip.dissolveFrames ?? 0) / 30;
        const chapter = { title: clip.title, start: Math.round((time + (clip.dissolveFrames ?? 0) / 60) * 30) / 30 };
        time += clip.pieces.reduce((sum, piece) => sum + Math.ceil(('hold' in piece ? piece.hold : (piece.out - piece.in) / (piece.speed ?? 1)) * 30) / 30, 0);
        return chapter;
    }).filter((chapter, index, all) => index === 0 || chapter.title !== all[index - 1].title);
    fs.writeFileSync(path.join(repo, 'src/data/web-film-chapters.json'), JSON.stringify(chapters, null, 2) + '\n');
}
