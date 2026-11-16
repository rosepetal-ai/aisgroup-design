// Copies the brand repo's approved-for-review files into the site, so the guide
// always shows the same logos and tokens that teams download.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
// The marketing folder's assets/brand, next to this repo (BRAND_ASSETS to point elsewhere).
const root = process.env.BRAND_ASSETS ? pathToFileURL(`${path.resolve(process.env.BRAND_ASSETS)}/`) : new URL('../../../assets/brand/', import.meta.url);
const pub = new URL('../public/', import.meta.url);
// Without assets/brand (a fresh clone, CI) public/ already holds the synced copies.
if (!fs.existsSync(root)) { console.log('No assets/brand next to the site: using the files already in public/.'); process.exit(0); }
// Overwrite in place: deleting the folder first makes a running dev server lose track of the files.
fs.cpSync(new URL('logos/draft/v0.1/', root), new URL('logos/', pub), { recursive: true, force: true });
fs.cpSync(new URL('imagery/references/', root), new URL('imagery/', pub), { recursive: true, force: true });
fs.cpSync(new URL('illustrations/', root), new URL('illustrations/', pub), { recursive: true, force: true });
fs.cpSync(new URL('overlays/', root), new URL('downloads/overlays/', pub), { recursive: true, force: true });
fs.cpSync(new URL('icons/', root), new URL('downloads/icons/', pub), { recursive: true, force: true });
fs.cpSync(new URL('qa/', root), new URL('downloads/qa/', pub), { recursive: true, force: true });
// Rendered video samples for the Video page (built by assets/brand/video/samples.mjs).
if (fs.existsSync(new URL('video/samples/', root))) fs.cpSync(new URL('video/samples/', root), new URL('video/', pub), { recursive: true, force: true });
fs.mkdirSync(new URL('downloads/', pub), { recursive: true });
for (const [from, to] of [['brand.css', 'ais-tokens.css'], ['brand.tokens.json', 'ais-tokens.json']]) fs.copyFileSync(new URL(`palette/${from}`, root), new URL(`downloads/${to}`, pub));
console.log('Synced logos, image references, illustrations, overlays, icons, the brand check, video samples and palette tokens.');
