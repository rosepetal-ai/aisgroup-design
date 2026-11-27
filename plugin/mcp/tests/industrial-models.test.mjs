import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { Factory } from '../core.mjs';
import { findSceneModelsDir } from '../industrial-models.mjs';
import { STUDIO } from '../../engine/recipe.mjs';

const camera = 'basler-ace2-gige';
const profile = 'minitec-profile-45x45-f';
const options = {
  collection: 'assets',
  filters: { kind: 'machine-model', exists: true },
};
function tmp(t) {
  const at = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-models-'));
  t.after(() => fs.rmSync(at, { recursive: true, force: true }));
  return at;
}
function fixture(t, at, models) {
  const f = new Factory({
    state: path.join(at, 'state'),
    sceneModelsDir: models,
  });
  t.after(() => f.close());
  return f;
}
function minimalGLB() {
  const json = JSON.stringify({ asset: { version: '2.0' } });
  const size = Math.ceil(json.length / 4) * 4;
  const buffer = Buffer.alloc(20 + size, 32);
  buffer.write('glTF');
  buffer.writeUInt32LE(2, 4);
  buffer.writeUInt32LE(buffer.length, 8);
  buffer.writeUInt32LE(size, 12);
  buffer.write('JSON', 16);
  buffer.write(json, 20);
  return buffer;
}

test('missing and explicit model directories are respected, portable sibling layout resolves', (t) => {
  const at = tmp(t),
    studio = path.join(at, 'marketing/design/plugin');
  const sibling = path.join(
    at,
    'websites/rosepetal-web-static-food/astro/public/models',
  );
  fs.mkdirSync(sibling, { recursive: true });
  assert.equal(findSceneModelsDir(studio, '', path.join(at, 'unused-cache')), sibling);
  const missing = path.join(at, 'missing');
  assert.equal(findSceneModelsDir(studio, missing), null);
  const f = fixture(t, at, missing);
  assert.equal(f.call('search_library', options).total, 0);
  const inventory = f.call('search_library', {
    ...options,
    filters: { kind: 'machine-model' },
  });
  assert.equal(inventory.total, 20);
  assert.ok(inventory.items.every((x) => !x.pathExists));
  const a = f.call('get_asset', { assetId: 'model-' + camera });
  assert.equal(a.uri, null);
  assert.equal(a.bytes, null);
  assert.match(a.retrievalReason, /unavailable/);
  assert.ok(!a.sourceRegisterUri);
  assert.match(
    f.call('read_instructions', { ref: a.source }).text,
    /Local industrial models/,
  );
});

test('only registered prepared models resolve, a replaced symlink or broken GLB does not', (t) => {
  const at = tmp(t),
    models = path.join(at, 'models'),
    parts = path.join(models, 'industry');
  fs.mkdirSync(parts, { recursive: true });
  const outside = path.join(at, 'other.glb'),
    inside = path.join(parts, camera + '.part.glb');
  fs.writeFileSync(outside, minimalGLB());
  fs.copyFileSync(outside, inside);
  fs.copyFileSync(outside, path.join(parts, 'invented.part.glb'));
  fs.writeFileSync(path.join(parts, 'machine.step'), 'raw');
  const f = fixture(t, at, models),
    get = () => f.call('get_asset', { assetId: 'model-' + camera });
  assert.equal(f.call('search_library', options).total, 1);
  assert.equal(fileURLToPath(get().uri), inside);
  fs.unlinkSync(inside);
  fs.symlinkSync(outside, inside);
  fs.symlinkSync(outside, path.join(parts, 'sources.txt'));
  assert.equal(get().uri, null);
  assert.ok(!get().sourceRegisterUri);
  assert.equal(f.call('search_library', options).total, 0);
  fs.unlinkSync(inside);
  fs.symlinkSync(path.join(parts, 'invented.part.glb'), inside);
  assert.equal(get().uri, null);
  fs.unlinkSync(inside);
  fs.writeFileSync(inside, 'not a GLB');
  assert.equal(get().uri, null);
  assert.throws(
    () => f.call('get_asset', { assetId: 'model-invented' }),
    /Unknown asset/,
  );
});

test('official stdio returns the real optimized camera and profile from the installed model library', async (t) => {
  const models = findSceneModelsDir(STUDIO);
  if (
    !models ||
    ![camera, profile].every((slug) =>
      fs.existsSync(path.join(models, 'industry', slug + '.part.glb')),
    )
  ) {
    t.skip('Prepared website hardware library is optional and absent');
    return;
  }
  const at = tmp(t),
    client = new Client({ name: 'industrial-assets-test', version: '1' });
  t.after(() => client.close());
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [path.join(STUDIO, 'mcp/server.mjs')],
      cwd: STUDIO,
      env: {
        PATH: process.env.PATH,
        HOME: os.homedir(),
        AIS_SCENE_MODELS_DIR: models,
        AIS_MCP_STATE: path.join(at, 'state'),
      },
      stderr: 'ignore',
    }),
  );
  async function call(name, args) {
    const result = await client.callTool({ name, arguments: args });
    assert.ok(!result.isError, result.content[0]?.text);
    const obj = JSON.parse(result.content[0].text);
    assert.equal(obj.ok, true, JSON.stringify(obj));
    return obj;
  }
  for (const [slug, query] of [
    [camera, 'Basler ace GigE'],
    [profile, '45x45 F extrusion'],
  ]) {
    const found = await call('search_library', { ...options, query });
    assert.equal(found.items[0]?.id, 'model-' + slug);
    const asset = await call('get_asset', { assetId: found.items[0].id });
    assert.equal(asset.kind, 'machine-model');
    assert.equal(asset.status, 'review');
    const file = fileURLToPath(asset.uri);
    assert.equal(file, path.join(models, 'industry', slug + '.part.glb'));
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, asset.bytes);
    const gltf = JSON.parse(
      bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)),
    );
    assert.ok(gltf.meshes.length);
    assert.ok(gltf.extensionsUsed.includes('EXT_meshopt_compression'));
    assert.ok(gltf.extensionsUsed.includes('KHR_mesh_quantization'));
    assert.ok(fs.statSync(fileURLToPath(asset.sourceRegisterUri)).isFile());
  }
});
