import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkRecipe, readTime, stepErrors, stepLines, STUDIO } from '../../engine/recipe.mjs';

test('tutorial steps: two lines of 42, read at 18 characters a second within 1.8 to 7 s, the action while the text shows', () => {
  assert.deepEqual(stepLines('Click «Create»'), ['Click «Create»']);
  assert.deepEqual(stepLines('Name it|then save'), ['Name it', 'then save']);
  assert.equal(stepLines('word '.repeat(20)).length, 3);
  assert.equal(readTime('Click «Create»'), 1.8);
  assert.equal(readTime('x'.repeat(90)), 5);
  assert.equal(readTime('word '.repeat(40)), 7);
  const ok = { text: 'Click «Create»', start: 1, action: 2, hold: 2.4 };
  assert.deepEqual(stepErrors(ok), []);
  assert.match(stepErrors({ ...ok, action: 1 })[0], /starts before its text/);
  assert.match(stepErrors({ ...ok, action: 3.5 })[0], /after its text has gone/);
  assert.match(stepErrors({ ...ok, hold: 1.2 })[0], /holds 1.2 s/);
  assert.match(stepErrors({ ...ok, hold: 7.5 })[0], /holds 7.5 s/);
  assert.match(stepErrors({ ...ok, text: 'word '.repeat(20), hold: 5.6 })[0], /3 lines/);
});

test('the tutorial template places the published intro, end card and Rosepetal music, and checks each step', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-tutorial-'));
  try {
    fs.mkdirSync(path.join(dir, 'take'));
    fs.writeFileSync(path.join(dir, 'take/recording.mp4'), '');
    fs.writeFileSync(path.join(dir, 'take/pointer.json'), JSON.stringify({ moves: [[0, 960, 540]], presses: [] }));
    const steps = (s) => fs.writeFileSync(path.join(dir, 'take/steps.json'), JSON.stringify({ duration: 6, steps: [s] }));
    const raw = JSON.parse(fs.readFileSync(path.join(STUDIO, 'templates/video-tutorial.json'), 'utf8'));
    raw.shots[1].title = 'Deploy a flow'; // the template's placeholder fails the copy check, as it should
    steps({ text: 'Click «Create»', start: 1, action: 2, hold: 2.4, box: [0, 0, 10, 10] });
    let { recipe, errors } = checkRecipe(raw, dir);
    assert.deepEqual(errors, []);
    assert.match(recipe.shots[0].src, /kit\/files\/rosepetal_brand-intro_v01_16x9\.mp4$/);
    assert.match(recipe.shots.at(-1).src, /kit\/files\/rosepetal_end-card_en_v01_16x9\.mp4$/);
    for (const s of [recipe.shots[0].src, recipe.shots.at(-1).src, recipe.music.src]) assert.ok(fs.existsSync(s.replace('file://', '')), s);
    assert.equal(recipe.music.fade, 2.5);
    ({ errors } = checkRecipe({ ...raw, lang: 'ca' }, dir));
    assert.ok(errors.some((e) => /ES and EN only/.test(e)));
    ({ errors } = checkRecipe({ ...raw, music: false }, dir));
    assert.ok(errors.some((e) => /always carries a track/.test(e)));
    steps({ text: 'Click «Create»', start: 1, action: 0.5, hold: 1, box: [0, 0, 10, 10] });
    ({ errors } = checkRecipe(raw, dir));
    assert.equal(errors.filter((e) => /step 1/.test(e)).length, 2);
    // A Rosepetal film takes the soundtrack by default; a single shot (a part for the edit) stays silent.
    assert.match(checkRecipe({ name: 'x', brand: 'rosepetal', shots: [{ type: 'title', title: 'A' }, { type: 'end' }] }, dir).recipe.music.src, /rosepetal_music_/);
    assert.equal(checkRecipe({ name: 'x', brand: 'rosepetal', shots: [{ type: 'end' }] }, dir).recipe.music, undefined);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
