#!/usr/bin/env node
// The curated media library (the reviewed «MCP library» selection) into library/, its one home here:
//   library/photos/<clean name>   the photo masters (real photographs, video frames and approved catalogue renders)
//   library/library.json          every entry: name, title, kind, subject, origin and its files
// Logos and icons are not copied: their entries point at the official files the guide publishes (logos/…,
// downloads/icons/svg/…), matched byte for byte. File paths are relative to the brand files root, the same in the
// hosted server (/files/…) and the plugin (brand/…). Nothing outside the curated library comes in.
//   node scripts/import-library.mjs [path to media-review]      (default ../media-review)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REVIEW = path.resolve(process.argv[2] || path.join(ROOT, '../media-review'));
const OUT = path.join(ROOT, 'library'), PUBLIC = path.join(ROOT, 'guide/public');
const fail = (m) => { console.error(m); process.exit(1); };

const js = fs.readFileSync(path.join(REVIEW, 'library.js'), 'utf8');
const { entries } = JSON.parse(js.slice(js.indexOf('{'), js.lastIndexOf('}') + 1));
// RFC 4180 CSV: quoted fields may hold commas, quotes and line breaks.
const csv = (f) => {
  const rows = [[]], text = fs.readFileSync(path.join(REVIEW, f), 'utf8');
  let cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c !== '"') cell += c; else if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
    else if (c === '"') quoted = true;
    else if (c === ',') { rows.at(-1).push(cell); cell = ''; }
    else if (c === '\n') { rows.at(-1).push(cell); cell = ''; rows.push([]); }
    else if (c !== '\r') cell += c;
  }
  if (cell || rows.at(-1).length) rows.at(-1).push(cell);
  const [head, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(head.map((k, i) => [k, r[i]])));
};
const review = new Map(csv('index.csv').map((r) => [r.id, r]));
const sources = new Map(csv('library.csv').map((r) => [r.filename, r.source]));

const hash = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
const official = new Map();
for (const dir of ['downloads/icons/svg', 'logos'])
  for (const f of fs.readdirSync(path.join(PUBLIC, dir), { recursive: true }).sort())
    // logos/app/*.svg are older copies of logos/app/ais/: the brand folders win.
    if (/\.svg$/.test(f) && !/^app\/[^/]+$/.test(f)) official.set(hash(path.join(PUBLIC, dir, f)), `${dir}/${f}`);

// The studio catalogue line ("<id> [status] origin/type: …") says where a picture came from and what it shows.
const ORIGIN = { photo: 'photo', 'video-frame': 'video-frame', render: 'render' };
const PRODUCTS = new Set(['rev360-standard', 'rev360-compact', 'rev360-cables', 'kariko', 'opticais']);
fs.rmSync(path.join(OUT, 'photos'), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'photos'), { recursive: true });
let bytes = 0;
const out = entries.map((e) => {
  if (!['logo', 'icon', 'photo'].includes(e.kind)) fail(`Not in the library's kinds: ${e.name} (${e.kind}).`);
  const first = review.get(e.variants[0].id) ?? {};
  const [, origin, type] = (first.catalog ?? '').match(/\] ([\w-]+)\/([\w-]+):/) ?? [];
  return {
    name: e.name, title: e.title, kind: e.kind, subject: e.subject, subjectLabel: e.subjectLabel,
    ...(PRODUCTS.has(e.subject) ? { product: e.subjectLabel } : {}),
    ...(e.kind === 'photo' ? { origin: ORIGIN[origin] ?? (first.category === 'renders' ? 'render' : first.category === 'photos/real' && !origin ? 'photo' : 'unknown'), type: type ?? 'in-production' } : {}),
    variants: e.variants.map((v) => {
      const src = path.join(REVIEW, v.file);
      let file;
      if (e.kind === 'photo') { file = `library/photos/${v.filename}`; fs.copyFileSync(src, path.join(OUT, 'photos', v.filename)); bytes += v.bytes; }
      else file = official.get(hash(src)) ?? fail(`${v.filename} is not one of the official files in guide/public.`);
      const source = e.kind === 'photo' ? sources.get(v.filename)?.replace(/^.*?\/Projects\/ais\/marketing\//, '') : undefined;
      return { variant: v.variant, file, width: +v.w, height: +v.h, bytes: v.bytes, ...(source ? { source } : {}) };
    }),
  };
});
fs.writeFileSync(path.join(OUT, 'library.json'), JSON.stringify({
  about: 'The curated media library. Photos are in photos/; logos and icons are the official files. Paths are relative to the brand files root: /files/ on the hosted server, brand/ in the plugin.',
  origins: { photo: 'Real photograph', 'video-frame': 'Frame from our film, never a print cover', render: 'Approved catalogue render, never called a render in public text', unknown: 'Origin not recorded' },
  entries: out,
}, null, 1) + '\n');
const photos = out.filter((e) => e.kind === 'photo');
console.log(`library/: ${out.length} entries, ${photos.length} photos in ${photos.reduce((n, e) => n + e.variants.length, 0)} files (${(bytes / 1e6).toFixed(1)} MB), logos and icons by reference`);
