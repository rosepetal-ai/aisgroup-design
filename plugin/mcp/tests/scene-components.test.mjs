import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { Factory } from '../core.mjs';
import { STUDIO } from '../../engine/recipe.mjs';

function fixture(t) {
  const state = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-scene-components-'));
  const factory = new Factory({ state });
  t.after(async () => {
    await factory.close();
    fs.rmSync(state, { recursive: true, force: true });
  });
  return factory;
}

test('free-form English and Spanish live briefs get the four readable skills', (t) => {
  const f = fixture(t);
  for (const request of [
    'Build an interactive 3D machine explainer from this quotation. A packer lifts a case beside the cabinet.',
    'Haz una animación interactiva de la línea según este presupuesto.',
    'Create an interactive scene from the supplied brochure and video reference.',
    'Con el folleto, crea una escena 3D de la línea.',
    'Show which sleeve failed at the reader. Keep both on the belt and use our usual player.',
  ]) {
    const plan = f.call('plan_piece', { intent: request });
    assert.equal(plan.kind, 'live-animation', request);
    assert.equal(plan.generator, null);
    assert.equal(plan.assets[0].id, 'scene-player');
    assert.ok(
      f
        .call('search_library', {
          collection: 'skills',
          query: 'motion review',
        })
        .items.some((x) => x.id === 'scene-motion-review'),
    );
    for (const skill of [
      'live-animation',
      'scene-assembly',
      'explainer-story',
      'scene-motion-review',
    ]) {
      const ref = 'skill:' + skill + '/SKILL.md';
      assert.ok(plan.refs.includes(ref));
      assert.equal(
        f.call('search_library', { collection: 'skills', query: skill })
          .items[0].ref,
        ref,
      );
      assert.equal(f.call('search_library', { collection: 'skills', query: ref }).items[0].ref, ref);
      assert.match(f.call('read_instructions', { ref }).text, /^---/);
    }
  }
  for (const [request, kind] of [
    [
      'Make a LinkedIn post about our new interactive machine explainer',
      'post',
    ],
    [
      'Crea un carrusel de la animación interactiva de nuestra línea',
      'carousel',
    ],
    ['Use the interactive machine scene to create a video', 'video'],
    ['Create a brochure about the 3D animation', 'document'],
  ]) {
    const plan = f.call('plan_piece', { intent: request });
    assert.equal(plan.kind, kind, request);
    assert.ok(plan.assets.every((a) => a.kind !== 'scene-component'));
  }
  assert.equal(
    f.call('plan_piece', {
      intent: 'Our free-form brief',
      kind: 'live-animation',
    }).kind,
    'live-animation',
  );
});

test('five installed assets are searchable, retrievable and carry valid sources', (t) => {
  const f = fixture(t);
  const filters = { kind: 'scene-component' };
  const all = f.call('search_library', { collection: 'assets', filters });
  assert.equal(all.total, 5);
  for (const [id, query] of [
    ['scene-packaging-operator', 'people'],
    ['scene-packaging-operator', 'operaria'],
    ['scene-pharma-console', 'pharma cabinet'],
    ['scene-pharma-console', 'torre de señal'],
    ['scene-marked-panel', 'chapa logotipo'],
    ['scene-player', 'reproductor'],
    ['scene-transfer-cell', 'cylinder'],
  ]) {
    const found = f.call('search_library', {
      collection: 'assets',
      query,
      filters,
    });
    assert.equal(found.items[0]?.id, id, query);
    const a = f.call('get_asset', { assetId: id }),
      file = fileURLToPath(a.uri);
    assert.equal(a.status, 'review');
    assert.ok(
      file.startsWith(path.join(STUDIO, 'skills/live-animation') + path.sep),
    );
    assert.equal(fs.statSync(file).size, a.bytes);
    assert.ok(f.call('read_instructions', { ref: a.source }).text.length > 100);
    if (id === 'scene-packaging-operator' || id === 'scene-transfer-cell') {
      assert.match(
        f.call('read_instructions', { ref: a.licenseRef }).text,
        /MIT License.*Microsoft/s,
      );
    }
  }
  assert.throws(
    () => f.call('get_asset', { assetId: '../../../../etc/passwd' }),
    /Unknown asset/,
  );
  f.assets.push({
    id: 'unlisted-test-path',
    kind: 'scene-component',
    path: 'skills/live-animation/SKILL.md',
  });
  assert.equal(
    f.call('get_asset', { assetId: 'unlisted-test-path' }).uri,
    null,
  );
});

test('official stdio client can go from brief to an installed component', async (t) => {
  const state = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-live-stdio-'));
  const client = new Client({ name: 'station-kit-test', version: '1' });
  t.after(async () => {
    await client.close();
    fs.rmSync(state, { recursive: true, force: true });
  });
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [path.join(STUDIO, 'mcp/server.mjs')],
      cwd: STUDIO,
      env: { PATH: process.env.PATH, HOME: os.homedir(), AIS_MCP_STATE: state },
      stderr: 'ignore',
    }),
  );
  const call = async (name, args) => {
    const r = await client.callTool({ name, arguments: args });
    assert.ok(!r.isError, r.content[0]?.text);
    const obj = JSON.parse(r.content[0].text);
    assert.equal(obj.ok, true, JSON.stringify(obj));
    return obj;
  };
  const plan = await call('plan_piece', {
    intent: 'Haz una escena 3D de la estación de envasado.',
  });
  assert.equal(plan.kind, 'live-animation');
  assert.match(plan.next, /search_library/);
  assert.doesNotMatch(plan.next, /edit_piece|export_piece/);
  const list = await call('search_library', {
    collection: 'assets',
    query: 'person',
    filters: { kind: 'scene-component' },
  });
  const asset = await call('get_asset', { assetId: list.items[0].id });
  assert.equal(asset.id, 'scene-packaging-operator');
  assert.ok(fs.existsSync(fileURLToPath(asset.uri)));
  assert.match(asset.next, /source ref/);
  assert.match(
    (await call('read_instructions', { ref: asset.licenseRef })).text,
    /MIT License/,
  );
});
