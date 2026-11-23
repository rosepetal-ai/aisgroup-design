// The studio's first piece starts the setup in the background; a second call while it runs must not start another.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const data = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-setup-'));
process.env.AIS_PLUGIN_DATA = data;
const { setupRunning, startSetup, SETUP_LOG } = await import('../../scripts/setup.mjs');
test.after(() => fs.rmSync(data, { recursive: true, force: true }));

test('a setup already running is not started again, and a finished one no longer counts', () => {
  assert.equal(SETUP_LOG, path.join(data, 'setup.log'));
  fs.writeFileSync(path.join(data, 'setup.lock'), String(process.pid));
  assert.equal(setupRunning(), true);
  startSetup();
  assert.equal(fs.existsSync(SETUP_LOG), false, 'a second setup was started');

  fs.writeFileSync(path.join(data, 'setup.lock'), '999999999');
  assert.equal(setupRunning(), false);
});
