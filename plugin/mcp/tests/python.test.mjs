import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pythonPath } from '../../scripts/setup.mjs';
import { STUDIO } from '../../engine/recipe.mjs';

// The Python halves of the studio: PowerPoint export, the pattern generator, the render guard and the studio tools.
for (const [dir, file] of [['decks', 'test_to_pptx.py'], ['print', 'test_linkedin_patterns.py'], ['skills/_shared/tests', 'test_safe_render.py'], ['skills/_shared/tests', 'test_studio_tools.py']])
  test(`python: ${file}`, () => {
    const r = spawnSync(pythonPath(), ['-m', 'unittest', 'discover', '-s', path.join(STUDIO, dir), '-p', file], { cwd: STUDIO, encoding: 'utf8', timeout: 300000 });
    assert.equal(r.status, 0, r.stderr.slice(-2000));
  });
