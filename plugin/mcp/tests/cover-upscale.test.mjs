import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// Uses only the stdlib diagnostic: no OpenCV, image model, weights or image processing.
test('cover upscaler applies all laptop limits before loading image libraries', () => {
  const limits = JSON.parse(execFileSync('python3', [fileURLToPath(new URL('../../print/upscale.py', import.meta.url)), '--check-limits'], {encoding: 'utf8'}));
  assert(limits.memoryBytes > 0 && limits.memoryBytes <= 3000000 * 1024);
  assert(limits.nice >= 15);
  assert(limits.cpus.length > 0 && limits.cpus.every(cpu => cpu >= 0 && cpu <= 3));
});
