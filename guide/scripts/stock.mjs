// Stock pictures and footage on the websites (Pexels, Pixabay, Mixkit). Their licences let the sites show them but not
// pass the files on, so the guide shows them captioned as stock and never puts them in a download.
// A file is stock when its path matches one of the patterns below, or when the site's own records name it:
// Rosepetal's assets/stock/manifest.json (usedBy) and astro/src/data/landing-media-sources.json (stock sources).
import fs from 'node:fs';
import path from 'node:path';

const PATTERNS = [
  /(^|\/)videos\/industr[^/]*\//, // the industry films and their posters
  /(^|\/)images\/industry-flows\//, // stills cut from those films
  /(^|\/)images\/industries\//, // the industry thumbnails, cropped from the same footage
  /(^|\/)images\/landing\/(production-|editorial-|edge-electronics|deploy-)/, // the home and editorial photographs
];

/** The public files a site's records name as stock, by their path under public/. */
export const recordedStock = (siteRepo) => {
  const files = new Set();
  const read = (p) => { try { return JSON.parse(fs.readFileSync(path.join(siteRepo, p), 'utf8')); } catch { return undefined; } };
  for (const a of read('assets/stock/manifest.json')?.assets ?? []) for (const u of a.usedBy ?? []) if (u.startsWith('astro/public/')) files.add(u.replace('astro/public/', ''));
  for (const m of read('astro/src/data/landing-media-sources.json') ?? []) if (/pexels|pixabay|mixkit/.test(m.source ?? '')) files.add(`images/landing/${m.asset}`);
  return files;
};

/** Whether a public file is stock: by pattern, or named by the records (a record without an extension covers every format). */
export const isStock = (rel, recorded = new Set()) => PATTERNS.some((p) => p.test(rel))
  || recorded.has(rel) || recorded.has(rel.replace(/\.\w+$/, '')) || recorded.has(rel.replace(/\.webp$/, '.mp4'));
