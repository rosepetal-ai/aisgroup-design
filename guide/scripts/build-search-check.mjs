// Bounded verification build: real documentation routes, without live preview bundles.
// Production still uses the normal Astro build and indexes the complete guide.
import { build } from 'astro';
import { mkdir, readdir, symlink, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const scratch = new URL('.astro/search-check/', root);
const source = new URL('src/', scratch);
await mkdir(new URL('pages/[lang]/components/', source), { recursive: true });
await mkdir(new URL('pages/[lang]/web-components/', source), { recursive: true });
for (const entry of await readdir(new URL('src/', root))) {
  if (entry === 'pages') continue;
  try { await symlink(fileURLToPath(new URL(`src/${entry}`, root)), new URL(entry, source)); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
}
for (const page of ['[lang]/[...slug].astro', '[lang]/components/[id].astro', '[lang]/web-components/[id].astro']) {
  await copyFile(new URL(`src/pages/${page}`, root), new URL(`pages/${page}`, source));
}
const output = process.env.AIS_SEARCH_DIST;
if (!output) throw new Error('Set AIS_SEARCH_DIST to an absolute local cache directory.');
try {
  await build({ root: fileURLToPath(root), srcDir: fileURLToPath(source), outDir: output, cacheDir: fileURLToPath(new URL('cache/', scratch)), publicDir: fileURLToPath(new URL('public/', scratch)) });
  // Only the local font is needed for faithful search UI screenshots.
  await mkdir(`${output}/fonts`, { recursive: true });
  for (const font of ['inter-latin.woff2', 'inter-latin-ext.woff2']) await copyFile(new URL(`public/fonts/${font}`, root), `${output}/fonts/${font}`);
} finally { await rm(scratch, { recursive: true, force: true }); }
