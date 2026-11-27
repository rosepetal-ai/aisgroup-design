import test from 'node:test';
import assert from 'node:assert/strict';
import { productAt } from './transport.mjs';

test('the visible defect precedes inspection, and only that item falls', () => {
  const before = productAt(2, 1.9);
  assert.equal(before.defect, 'missing cap');
  assert.equal(before.verdict, null);
  const inspected = productAt(2, 2.1);
  assert.equal(inspected.verdict, 'NOK');
  assert.equal(inspected.y, 0);
  const rejected = productAt(2, 3.3);
  assert.ok(rejected.visible && rejected.y < 0);
  assert.equal(productAt(2, 3.5).visible, false);
  assert.equal(productAt(3, 3.7).verdict, 'OK');
  assert.equal(productAt(3, 3.7).y, 0);
  assert.deepEqual(productAt(2, 2.1), inspected);
});
