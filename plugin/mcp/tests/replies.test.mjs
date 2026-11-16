// What a model sees: routing to the right playbook, pictures named the way the user names them, a busy computer
// reported in plain words, and replies without the studio's internal records.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { Factory } from '../core.mjs';
import { STUDIO } from '../../engine/recipe.mjs';
import { needsMedia } from './needs.mjs';

const photo = 'library/media/real/ais_sabadell-building.jpg';
const hasPhoto = fs.existsSync(path.join(STUDIO, photo));
function fixture(t, options = {}) { const state = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-replies-')); const f = new Factory({ state, ...options }); t.after(async () => { await f.close(); fs.rmSync(state, { recursive: true, force: true }); }); return f; }

test('a post about the building routes to the news playbook and template', (t) => {
  const r = fixture(t).call('plan_piece', { intent: 'Un post de LinkedIn que presente nuestra sede de Sabadell', kind: 'post' });
  assert(r.refs.includes('skill:social-post/types/news.md'), r.refs.join());
  assert.equal(r.templates[0].id, 'post-news.json');
});

test('a picture given as library/media/… or a file URI becomes the recipe reference', { skip: !hasPhoto && 'media library not linked' }, (t) => {
  const f = fixture(t);
  let p = f.call('edit_piece', { action: 'copy', pieceId: 'sede', source: 'templates/post-news.json' });
  p = f.call('edit_piece', { action: 'update', pieceId: 'sede', expectedDigest: p.digest, changes: [{ field: 'src', value: photo }] });
  assert(p.valid, p.errors.join()); assert.equal(p.shot.src, '@lib/media/real/ais_sabadell-building.jpg');
  const asset = f.call('get_asset', { assetId: 'real-sabadell' }); assert.equal(asset.path, photo);
  p = f.call('edit_piece', { action: 'update', pieceId: 'sede', expectedDigest: p.digest, changes: [{ field: 'src', value: asset.uri }] });
  assert(p.valid, p.errors.join());
});

test('a render refused for a busy computer waits its turn, then says why in plain words', { skip: !hasPhoto && 'media library not linked' }, async (t) => {
  let starts = 0;
  const launch = () => { starts++; const c = new EventEmitter(); c.stdout = new EventEmitter(); c.stderr = new EventEmitter();
    setImmediate(() => { c.stdout.emit('data', JSON.stringify({ blocked_by: ['Blender already active'] }) + '\n'); c.emit('close', 75); }); return c; };
  const f = fixture(t, { launch, renderWait: 120, retryMs: 30 });
  const p = f.call('edit_piece', { action: 'copy', pieceId: 'sede', source: 'templates/post-news.json' });
  f.call('edit_piece', { action: 'update', pieceId: 'sede', expectedDigest: p.digest, changes: [{ field: 'src', value: photo }] });
  const job = f.call('export_piece', { action: 'enqueue', pieceId: 'sede', operation: 'render-png' });
  let s; for (let i = 0; i < 100 && (s = f.call('export_piece', { action: 'status', jobId: job.id })).state !== 'blocked'; i++) await new Promise((ok) => setTimeout(ok, 20));
  assert.equal(s.state, 'blocked'); assert.match(s.reason, /^Not rendered: Blender already active/); assert(starts > 1, 'it tried again before giving up');
});

test('replies leave out internal records and say what to call next', { skip: needsMedia }, async (t) => {
  const state = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-replies-'));
  const client = new Client({ name: 'replies-test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(STUDIO, 'mcp/server.mjs')], cwd: STUDIO, env: { PATH: process.env.PATH, HOME: os.homedir(), AIS_MCP_STATE: state }, stderr: 'ignore' }));
  t.after(async () => { await client.close(); fs.rmSync(state, { recursive: true, force: true }); });
  const call = async (name, args) => JSON.parse((await client.callTool({ name, arguments: args })).content[0].text);
  const plan = await call('plan_piece', { intent: 'Folleto del AIS Hopper', kind: 'document' });
  assert.equal(plan.generator.rejected, undefined); assert.equal(plan.contentAuthor, undefined); assert(plan.next);
  const bad = await call('edit_piece', { action: 'copy', pieceId: 'pieces/brochures/hopper/hopper.es.html' });
  assert.equal(bad.ok, false); assert.match(bad.fix, /short name/);
  const copy = await call('edit_piece', { action: 'copy', pieceId: 'news', source: 'templates/post-news.json' });
  assert(copy.ok, copy.error); assert(!JSON.stringify(copy.shot).includes(os.homedir()), copy.shot.src);
  const status = await call('studio_status', {});
  assert(status.makes.length && status.cannot.length); assert(!/safe_render|adapter|canonical|LLM/.test(JSON.stringify(status)));
});
