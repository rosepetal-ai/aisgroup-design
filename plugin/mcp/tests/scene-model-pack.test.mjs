import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { makeSceneModelPack, installSceneModelPack } from '../../scripts/scene-model-pack.mjs';
import { createMachineModels, findSceneModelsDir, modelDetail, modelPackPaths } from '../industrial-models.mjs';
import { installedSceneModels } from '../../skills/scene-assembly/models-directory.mjs';
import { localIndustryLibrary } from '../../skills/live-animation/examples/enclosed-inspection/library.mjs';

function minimalGLB() {
  const json = '{"asset":{"version":"2.0"}} ';
  const bin = Buffer.alloc(20 + json.length);
  bin.write('glTF');
  bin.writeUInt32LE(2, 4);
  bin.writeUInt32LE(bin.length, 8);
  bin.writeUInt32LE(json.length, 12);
  bin.write('JSON', 16);
  bin.write(json, 20);
  return bin;
}

test('a fresh install supports cached hardware, detects corruption and keeps the last complete version', (t) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-pack-test-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const plugin = path.join(tmp, 'empty-install/plugin');
  const data = path.join(tmp, 'data');
  t.mock.method(os, 'homedir', () => path.join(tmp, 'home'));
  const models = path.join(tmp, 'models');
  const source = path.join(models, 'industry');
  const prior = process.env.AIS_PLUGIN_DATA;
  const modelEnv = process.env.AIS_SCENE_MODELS_DIR;
  const industryEnv = process.env.AIS_INDUSTRY_MODELS;
  process.env.AIS_PLUGIN_DATA = data;
  delete process.env.AIS_SCENE_MODELS_DIR;
  delete process.env.AIS_INDUSTRY_MODELS;
  t.after(() => {
    for (const [key, value] of Object.entries({AIS_PLUGIN_DATA:prior, AIS_SCENE_MODELS_DIR:modelEnv, AIS_INDUSTRY_MODELS:industryEnv})) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  fs.mkdirSync(source, { recursive: true });
  for (const name of modelPackPaths) {
    let content = 'Source record';
    if (name.endsWith('.glb')) content = minimalGLB();
    if (name.endsWith('.webp')) content = Buffer.from('RIFF0000WEBP');
    fs.writeFileSync(path.join(models, name), content);
  }
  fs.writeFileSync(path.join(source, 'other.step'), 'outside the whitelist');
  const pack = path.join(tmp, 'parts.aispack');
  const result = makeSceneModelPack(models, pack);
  fs.rmSync(models, { recursive: true });

  const lookup = () => findSceneModelsDir(plugin);
  assert.equal(lookup(), null);
  const modelsBeforeImport = createMachineModels(lookup(), lookup);
  assert.equal(modelDetail(modelsBeforeImport[0], {}).uri, null);
  const installed = installSceneModelPack(pack);
  assert.equal(installed, lookup());
  assert.equal(fs.existsSync(path.join(installed, 'industry/other.step')), false);
  assert.equal(path.basename(installed), result.sha256);
  assert.ok(modelsBeforeImport.every(x => modelDetail(x, {}).uri));
  const cameraFile = path.join(installed, 'industry/basler-ace2-gige.part.glb');
  fs.writeFileSync(cameraFile, 'damaged');
  assert.equal(installSceneModelPack(pack), installed);
  assert.deepEqual(fs.readFileSync(cameraFile), minimalGLB());
  assert.equal(installedSceneModels(path.join(tmp, 'unused-cache')), null);
  const userCache = path.join(os.homedir(), '.cache', 'ais-group-design', 'scene-models');
  const accountVersion = installSceneModelPack(pack, userCache);
  assert.equal(installedSceneModels(), installed);
  process.env.AIS_PLUGIN_DATA = path.join(tmp, 'another-host');
  assert.equal(installedSceneModels(), accountVersion);
  process.env.AIS_PLUGIN_DATA = data;

  const library = localIndustryLibrary();
  const code = library.load(library.resolveId('inspection-industry-library'));
  const parts = JSON.parse(code.slice('export default '.length));
  assert.equal(Object.keys(parts).length, 13);
  assert.ok(parts.camera.startsWith('data:model/gltf-binary;base64,'));

  const broken = path.join(tmp, 'broken.aispack');
  const manifest = JSON.parse(gunzipSync(fs.readFileSync(pack)).toString());
  manifest.files[0].sha256 = '0'.repeat(64);
  fs.writeFileSync(broken, gzipSync(JSON.stringify(manifest)));
  assert.throws(() => installSceneModelPack(broken), /Damaged/);
  assert.equal(installedSceneModels(), installed);
  manifest.files[0].name = '../outside.glb';
  fs.writeFileSync(broken, gzipSync(JSON.stringify(manifest)));
  assert.throws(() => installSceneModelPack(broken), /unregistered/);
  assert.equal(installedSceneModels(), installed);
  assert.equal(fs.existsSync(path.join(data, 'outside.glb')), false);
});
