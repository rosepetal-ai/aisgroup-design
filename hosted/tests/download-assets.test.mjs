import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeDownloads } from '../download-assets.mjs';
import { assets } from '../tools.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const descriptor = JSON.parse(fs.readFileSync(path.join(root, 'library/downloads.json'), 'utf8'));
const local = file => fs.existsSync(path.join(root, file.startsWith('library/') ? file : 'guide/public/' + file));

test('public selection joins existing files without duplicating identities or losing rights', () => {
  const existing = descriptor.entries.filter(e => ['photo', 'logo'].includes(e.kind)).map(e => ({ id: e.name, kind: e.kind, file: e.file, use: e.title }));
  const before = structuredClone(existing);
  const merged = mergeDownloads(existing, descriptor, local);
  assert.deepEqual(existing, before);
  assert.equal(merged.length, existing.length + 13); // seven stock, four films, two posters
  assert.equal(new Set(merged.map(e => e.id)).size, merged.length);
  for (const e of merged) assert(e.rights?.licence, e.id);
  for (const e of existing) assert.equal(merged.filter(a => a.file === e.file).length, 1);
});

test('stock search returns the photographer source and licence, never a fabricated hosted file', () => {
  const catalogue = { assets: mergeDownloads([], descriptor, local), rules: { stock: 'Context only, download from the photographer.' } };
  const result = assets({ catalogue }, { kind: 'stock' }, 'https://example.test');
  assert.equal(result.total, 7);
  for (const e of result.assets) {
    assert(e.sourceOnly);
    assert.equal(e.url, e.source);
    assert.match(e.url, /^https:\/\/(www\.pexels\.com|unsplash\.com)\//);
    assert(!e.url.includes('/files/'));
    assert(e.author && e.rights.licenceUrl);
    assert.equal(e.rights.redistribution, 'source-only');
  }
  const byAuthor = assets({ catalogue }, { kind: 'stock', query: 'cottonbro' }, 'https://example.test');
  assert.equal(byAuthor.total, 2);
});

test('intro variants and posters return real local file URLs with their format', () => {
  const catalogue = { assets: mergeDownloads([], descriptor, local), rules: { video: 'Official intros.', poster: 'Official posters.' } };
  const films = assets({ catalogue }, { kind: 'video', query: 'rosepetal' }, 'https://example.test');
  assert.equal(films.total, 2);
  assert.deepEqual(films.assets.map(e => e.format).sort(), ['MP4 1080p', 'MP4 4K']);
  for (const e of films.assets) assert.match(e.url, /^https:\/\/example\.test\/files\/downloads\/video\/rosepetal-intro.*\.mp4$/);
  const posters = assets({ catalogue }, { kind: 'poster' }, 'https://example.test');
  assert.equal(posters.total, 2);
  assert(posters.assets.every(e => e.url.endsWith('.jpg')));
});

test('malformed stock, unsafe file paths and missing snapshot files stop catalogue creation', () => {
  const stock = descriptor.entries.find(e => e.kind === 'stock');
  for (const change of [{ source: 'javascript:alert(1)' }, { file: 'downloads/stock.jpg' }, { rights: { redistribution: 'direct' } }]) {
    assert.throws(() => mergeDownloads([], { version: 1, entries: [{ ...stock, ...change }] }, () => true));
  }
  const film = descriptor.entries.find(e => e.kind === 'video');
  for (const file of ['/etc/passwd', '../outside.mp4', 'downloads/../outside.mp4', 'downloads\\outside.mp4']) {
    assert.throws(() => mergeDownloads([], { version: 1, entries: [{ ...film, file }] }, () => true), /invalid/);
  }
  assert.throws(() => mergeDownloads([], { version: 1, entries: [film] }, () => false), /Missing/);
  assert.throws(() => mergeDownloads([{ id: stock.name }], { version: 1, entries: [stock] }, () => true), /Duplicate/);
});
