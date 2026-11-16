// Sales documents: plan_piece routes proposals and case studies to their templates; price rows are added and removed by slot
// and the totals follow; a case study without the customer's written approval edits but never exports (the Daymsa example has
// its approval recorded: the case published on aisvision.com on 20 October 2020).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Factory } from '../core.mjs';
import { STUDIO } from '../../engine/recipe.mjs';
const fixture = (t, o = {}) => { const f = new Factory({ state: fs.mkdtempSync(path.join(os.homedir(), '.cache/ais-group-design/mcp-sales-test-')), schedule: () => {}, ...o }); t.after(() => f.close()); return f; };
const call = (f, n, a) => f.call(n, a);
const PROPOSAL = 'pieces/sales/proposal/proposal.es.html', CASE = 'pieces/sales/case-study/case-study.es.html';

test('proposals and case studies route to their own template and skill', (t) => {
  const f = fixture(t);
  for (const [intent, key, source] of [['Prepara una propuesta para una conservera', 'proposal', PROPOSAL], ['Oferta para la línea de latas', 'proposal', PROPOSAL],
    ['Presupuesto de un AIS Hopper', 'proposal', PROPOSAL], ['A quote for a canning customer', 'proposal', PROPOSAL],
    ['Caso de éxito de Daymsa', 'case-study', CASE], ['A case study sheet for a customer', 'case-study', CASE], ['Un caso de cliente en PDF', 'case-study', CASE]]) {
    const r = call(f, 'plan_piece', { intent });
    assert.equal(r.kind, 'document', intent); assert.equal(r.generator.key, key, intent);
    assert(r.refs.includes('skill:sales-documents/SKILL.md'), intent);
    assert.equal(r.templates[0]?.source, source, intent);
  }
  assert.equal(call(f, 'plan_piece', { intent: 'A LinkedIn quote post from José' }).kind, 'post', 'a quote post stays a post');
  assert.equal(call(f, 'plan_piece', { intent: 'Ficha técnica de KARIKÓ' }).generator.key, 'datasheet');
});

test('proposal: add and remove a price row, the totals follow; header and totals rows are fixed', (t) => {
  const f = fixture(t), before = fs.readFileSync(path.join(STUDIO, PROPOSAL));
  assert.equal(call(f, 'edit_piece', { action: 'copy', pieceId: 'oferta', source: PROPOSAL }).valid, true);
  const listed = call(f, 'edit_piece', { action: 'slots', pieceId: 'oferta' });
  const cell = (re) => listed.slots.find((s) => s.tag === 'td' && re.test(s.text));
  const total = (slots) => slots.filter((s) => s.tag === 'td' && s.page === 5).map((s) => s.text);
  const r = call(f, 'edit_piece', { action: 'update', pieceId: 'oferta', expectedDigest: listed.digest,
    slotChanges: [{ slot: cell(/^Formación en planta/).id, row: 'add', text: 'Rueda de recambio para el expulsor | 2 | 350' }, { slot: cell(/^Formato adicional/).id, row: 'remove' }] });
  assert.equal(r.updated, true, JSON.stringify(r));
  const after = call(f, 'edit_piece', { action: 'slots', pieceId: 'oferta' }), cells = total(after.slots);
  assert(cells.includes('Rueda de recambio para el expulsor') && !cells.includes('Formato adicional, lata de 99 mm'));
  // 77 400 − 2500 + 2 × 350 = 75 600; IVA 21 % = 15 876; total 91 476 (slot texts keep the non-breaking space from five digits).
  for (const v of ['700', '75\u00a0600', '15\u00a0876', '91\u00a0476']) assert(cells.includes(v), v + ' in ' + cells.join(', '));
  const headCell = after.slots.find((s) => s.tag === 'th' && s.text === 'Concepto'), foot = after.slots.find((s) => s.tag === 'th' && s.text === 'Total');
  for (const s of [headCell, foot]) assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'oferta', expectedDigest: after.digest, slotChanges: [{ slot: s.id, row: 'remove' }] }), /body rows|not a table cell/);
  assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'oferta', expectedDigest: after.digest, slotChanges: [{ slot: cell(/^Garbanzos/).id, row: 'add', text: 'solo una celda' }] }), /2 cells/);
  // A changed unit price recomputes the amount and totals; a hand-typed wrong total would fail validate.
  const unit = after.slots.find((s) => s.tag === 'td' && s.text === '900' && s.page === 5);
  const r2 = call(f, 'edit_piece', { action: 'update', pieceId: 'oferta', expectedDigest: after.digest, slotChanges: [{ slot: unit.id, text: '1000' }] });
  assert.equal(r2.updated, true, JSON.stringify(r2)); assert(total(call(f, 'edit_piece', { action: 'slots', pieceId: 'oferta' }).slots).includes('4000'));
  assert.deepEqual(fs.readFileSync(path.join(STUDIO, PROPOSAL)), before, 'the source is never written');
});

test('case study: editable without approval, export refused until approved_by and approved_on are set', async (t) => {
  let launched = 0;
  const f = fixture(t, { launch: () => { launched++; throw Error('no render in this test'); } });
  const copy = call(f, 'edit_piece', { action: 'copy', pieceId: 'caso', source: CASE });
  assert.equal(copy.valid, true, 'the Daymsa example carries its approval: ' + JSON.stringify(copy.errors));
  const listed = call(f, 'edit_piece', { action: 'slots', pieceId: 'caso' });
  assert(listed.slots.some((s) => s.id === 'meta.approved_by') && listed.slots.some((s) => s.id === 'meta.approved_on'));
  const h1 = listed.slots.find((s) => s.id === 'p1.h1.1');
  // A new customer's case starts without approval: clear it and edit.
  const edited = call(f, 'edit_piece', { action: 'update', pieceId: 'caso', expectedDigest: listed.digest, slotChanges: [{ slot: h1.id, text: 'Daymsa controla la etiqueta y el tapón de cada envase de bioestimulante' },
    { slot: 'meta.approved_by', text: '' }, { slot: 'meta.approved_on', text: '' }] });
  assert.equal(edited.updated, true, 'editing works before approval'); assert.equal(edited.valid, false);
  assert.equal(edited.errors.length, 1, 'approval is the only error: ' + JSON.stringify(edited.errors)); assert.match(edited.errors[0], /Customer approval missing/);
  const job = call(f, 'export_piece', { action: 'enqueue', pieceId: 'caso', operation: 'render-pdf' }); await f.pump();
  const s = call(f, 'export_piece', { action: 'status', jobId: job.id });
  assert.equal(s.state, 'failed'); assert.match(s.reason, /Customer approval missing/); assert.equal(launched, 0, 'nothing rendered');
  assert.throws(() => call(f, 'edit_piece', { action: 'update', pieceId: 'caso', expectedDigest: edited.digest, slotChanges: [{ slot: 'meta.approved_on', text: '9/11/2026' }] }), /YYYY-MM-DD/);
  const ok = call(f, 'edit_piece', { action: 'update', pieceId: 'caso', expectedDigest: edited.digest,
    slotChanges: [{ slot: 'meta.approved_by', text: 'Nombre del aprobador, cargo, Daymsa' }, { slot: 'meta.approved_on', text: '2026-11-02' }] });
  assert.equal(ok.updated, true); assert.equal(ok.valid, true, JSON.stringify(ok.errors));
});
