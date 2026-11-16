// Slot editing: change one text or picture inside a brochure or deck by its slot id; originals are never written.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Factory } from '../core.mjs';
import { STUDIO } from '../../engine/recipe.mjs';
import { needsMedia } from './needs.mjs';
const fixture = (t) => { const f = new Factory({ state: fs.mkdtempSync(path.join(os.homedir(), '.cache/ais-group-design/mcp-slots-test-')), schedule: () => {} }); t.after(() => f.close()); return f; };
const call = (f, n, a) => f.call(n, a);
const catalog = JSON.parse(fs.readFileSync(path.join(STUDIO, 'library/catalog.json')));
const assets = Array.isArray(catalog) ? catalog : catalog.assets;
const pick = (status) => assets.find((a) => a.status === status && /\.(jpe?g|png)$/i.test(a.path) && fs.existsSync(path.join(STUDIO, a.path))).path;

test('brochure: list slots, change a headline and the cover picture, original untouched', { skip: needsMedia }, (t) => {
  const f = fixture(t), source = 'pieces/brochures/hopper/hopper.es.html', before = fs.readFileSync(path.join(STUDIO, source));
  const copy = call(f, 'edit_piece', { action: 'copy', pieceId: 'hopper-edit', source });
  const listed = call(f, 'edit_piece', { action: 'slots', pieceId: 'hopper-edit' });
  assert.equal(listed.digest, copy.digest);
  const h1 = listed.slots.find((s) => s.id === 'p1.h1.1'), cover = listed.slots.find((s) => s.type === 'image' && s.cover);
  assert.equal(h1.text, 'AIS Hopper'); assert(cover, 'the cover picture is a slot');
  assert(!listed.slots.some((s) => s.type === 'image' && /logo|hex-/.test(s.src)), 'logos and the pattern are not slots');
  const picture = pick('approved');
  const r = call(f, 'edit_piece', { action: 'update', pieceId: 'hopper-edit', expectedDigest: listed.digest,
    slotChanges: [{ slot: 'p1.h1.1', text: 'AIS Hopper para agua' }, { slot: cover.id, image: picture, alt: 'Botellas en la línea' }] });
  assert.equal(r.updated, true, JSON.stringify(r)); assert.notEqual(r.digest, listed.digest); assert.equal(r.picturesAdded.length, 1);
  assert(r.changeWarnings.some((w) => /cover picture/.test(w)));
  const after = call(f, 'edit_piece', { action: 'slots', pieceId: 'hopper-edit' });
  assert.equal(after.slots.find((s) => s.id === 'p1.h1.1').text, 'AIS Hopper para agua');
  assert.equal(after.slots.find((s) => s.id === cover.id).alt, 'Botellas en la línea');
  assert(after.slots.find((s) => s.id === cover.id).src.startsWith('assets/'));
  assert.equal(call(f, 'edit_piece', { action: 'validate', pieceId: 'hopper-edit' }).valid, true, 'the edited snapshot stays verifiable');
  assert.deepEqual(fs.readFileSync(path.join(STUDIO, source)), before, 'the original is never written');
  // Refusals: stale digest, unknown slot, text into a picture, rejected picture, Spanish "30.000".
  assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'hopper-edit', expectedDigest: listed.digest, slotChanges: [{ slot: 'p1.h1.1', text: 'x' }] }), /Stale/);
  assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'hopper-edit', expectedDigest: r.digest, slotChanges: [{ slot: 'p9.h1.1', text: 'x' }] }), /Unknown slot/);
  assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'hopper-edit', expectedDigest: r.digest, slotChanges: [{ slot: cover.id, text: 'x' }] }), /picture/);
  assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'hopper-edit', expectedDigest: r.digest, slotChanges: [{ slot: cover.id, image: pick('rejected') }] }), /rejected/);
  const bad = call(f, 'edit_piece', { action: 'update', pieceId: 'hopper-edit', expectedDigest: r.digest, slotChanges: [{ slot: 'p1.h1.1', text: 'Hasta 30.000 unidades' }] });
  assert.equal(bad.updated, false); assert(bad.errors.some((e) => /thousands/.test(e)));
  assert.equal(call(f, 'edit_piece', { action: 'slots', pieceId: 'hopper-edit' }).digest, r.digest, 'a refused update changes nothing');
});

test('deck: slide text and picture slots; shared sections are not slots', (t) => {
  const f = fixture(t), source = 'pieces/decks/wine/content.es.json', before = fs.readFileSync(path.join(STUDIO, source));
  call(f, 'edit_piece', { action: 'copy', pieceId: 'wine-edit', source });
  const listed = call(f, 'edit_piece', { action: 'slots', pieceId: 'wine-edit' });
  const title = listed.slots.find((s) => s.type === 'text' && s.field === 'title');
  assert(title && /^s\d+\.title$/.test(title.id));
  assert(!listed.slots.some((s) => /layout|include/.test(s.field)), 'layout and includes are not content');
  const r = call(f, 'edit_piece', { action: 'update', pieceId: 'wine-edit', expectedDigest: listed.digest, slotChanges: [{ slot: title.id, text: 'Control de calidad en bodega' }] });
  assert.equal(r.updated, true, JSON.stringify(r));
  assert.equal(call(f, 'edit_piece', { action: 'slots', pieceId: 'wine-edit' }).slots.find((s) => s.id === title.id).text, 'Control de calidad en bodega');
  assert.deepEqual(fs.readFileSync(path.join(STUDIO, source)), before);
});
