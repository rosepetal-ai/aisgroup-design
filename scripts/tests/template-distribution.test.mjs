import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { templateCatalog } from '../../plugin/scripts/template-catalog.mjs';

test('the production catalogue covers the shipped recipes and carries the media review status', () => {
  const root = fileURLToPath(new URL('../../plugin/', import.meta.url));
  const catalog = templateCatalog(root);
  const recipes = fs.readdirSync(root + 'templates').filter(f => f.endsWith('.json'));
  for (const file of recipes) {
    const entry = catalog.entries[file.slice(0, -5)];
    assert.equal(entry.source, 'templates/' + file);
    for (const rel of entry.media || []) assert.ok(catalog.media[rel].status);
  }
  assert.equal(catalog.entries['pieces/brochures/standard/standard.es'].family, 'print');
  assert.ok(Object.values(catalog.entries).some(e => e.family === 'decks'));
  assert.ok(Object.values(catalog.entries).some(e => e.family === 'stationery'));
  assert.ok(!Object.values(catalog.entries).some(e => e.source.includes('/business-cards/')));
  for (const id of ['rosepetal-intro', 'rosepetal_end-card_en_v01_16x9', 'rosepetal_music_quiet-beauty_v01']) {
    assert.match(catalog.assets[id].sha256, /^[0-9a-f]{64}$/);
  }
});
