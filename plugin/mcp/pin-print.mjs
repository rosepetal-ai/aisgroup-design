// Re-extract and re-pin the technical-sheet family after a reviewed change to a sheet. The sheet HTML in
// pieces/datasheets/<key>/<key>.es.html is the source; datasheets/data.json is its extraction (datasheets/extract.mjs).
// Usage: npm run mcp:pin            show what changed, write datasheets/data.json and mcp/print-family.json
//        npm run mcp:pin -- --check  only report (exit 1 if data.json or the registry is stale)
// The registry pins each sheet's HTML hash, its fixed layout fields and its raster budget; the MCP refuses any sheet
// whose files no longer match, so run this (after looking at the sheet's PDF) whenever a sheet is changed on purpose.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { imageSize } from 'image-size';
import { extract, LAYOUT } from '../datasheets/extract.mjs';

const STUDIO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const registryPath = path.join(STUDIO, 'mcp/print-family.json');
const hash = (b) => createHash('sha256').update(b).digest('hex');
const dataPath = path.join(STUDIO, 'datasheets/data.json');

export function pinned() {
  const family = JSON.parse(fs.readFileSync(registryPath));
  const data = JSON.parse(fs.readFileSync(dataPath)), nextData = {};
  const changes = [];
  for (const [key, c] of Object.entries(family.products)) {
    const html = fs.readFileSync(path.join(STUDIO, c.template)), dir = path.dirname(path.join(STUDIO, c.template));
    const { name, ...rest } = extract(html.toString(), key), d = { name, source: data[key]?.source, ...rest }; // source: the product notes it was written from
    if (JSON.stringify(d) !== JSON.stringify(data[key])) changes.push(`${key}: data.json`);
    nextData[key] = d;
    let rasterCount = 0, baselinePixels = 0, baselineBytes = 0;
    for (const [, ref] of html.toString().matchAll(/<img[^>]+src="([^"]+)"/g)) {
      if (ref.endsWith('.svg')) continue;
      const p = path.join(dir, ref), { width, height } = imageSize(fs.readFileSync(p));
      rasterCount++; baselinePixels += width * height; baselineBytes += fs.statSync(p).size;
    }
    const next = { ...c, name: d.name, sourceDigest: hash(html),
      layout: Object.fromEntries(LAYOUT.filter((k) => d[k] !== undefined).map((k) => [k, d[k]])),
      inputs: { rasterCount, baselinePixels, baselineBytes, maxTotalPixels: baselinePixels + 8_000_000 } };
    for (const k of ['name', 'sourceDigest', 'layout', 'inputs'])
      if (JSON.stringify(c[k]) !== JSON.stringify(next[k])) changes.push(`${key}: ${k}`);
    family.products[key] = next;
  }
  return { family, data: nextData, changes };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { family, data, changes } = pinned();
  console.log(changes.length ? 'changed:\n  ' + changes.join('\n  ') : 'registry already matches the sheets');
  if (process.argv.includes('--check')) process.exitCode = changes.length ? 1 : 0;
  else if (changes.length) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
    fs.writeFileSync(registryPath, JSON.stringify(family, null, 2) + '\n');
  }
}
