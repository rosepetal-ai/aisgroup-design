import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSlide} from '../../decks/layouts.mjs';
const ctx = {n: 1, asset: (p) => p, img: () => ({url: 'original.jpg', w: 300, h: 279})};
for (const image of [{src: 'photo', maxScale: .4}, {src: 'photo', fit: 'contain', maxScale: .1}]) {
  test('cover keeps its full-bleed panel despite a small source or legacy density cap '+JSON.stringify(image), () => {
    const html = renderSlide({layout: 'cover', title: 'Título', lead: 'Texto', meta: '2026', image}, ctx);
    assert.match(html, /class="pic" style="left:1000px;top:0px;width:920px;height:1080px/);
    assert.doesNotMatch(html, /class="pic contain"/);
  });
}
test('cover crop preserves original pixels and clips the photographic canvas in the panel', () => {
  const html = renderSlide({layout: 'cover', title: 'Título', image: {src: 'photo', crop: [318,95,914,795]}}, {...ctx, img: () => ({url: 'original.webp', w: 1616, h: 848})});
  assert.match(html, /src="original.webp"/);
  assert.match(html, /object-fit:fill/);
  assert.match(html, /left:-/);
});

test('deck preflight rejects video-frame covers before starting Chromium', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const os = await import('node:os');
  const {spawnSync} = await import('node:child_process');
  const root = path.resolve(new URL('../..', import.meta.url).pathname);
  const cache = path.join(os.homedir(), '.cache/ais-group-design/tests'); fs.mkdirSync(cache, {recursive: true});
  const dir = fs.mkdtempSync(path.join(cache, 'deck-cover-'));
  try {
    const image = path.join(dir, 'video-frame.jpg');
    fs.copyFileSync(path.join(root, 'decks/assets/ext/wine-filling-station.jpg'), image);
    const file = path.join(dir, 'content.es.json');
    fs.writeFileSync(file, JSON.stringify({meta: {lang: 'es', file: 'cover-test'}, slides: [{layout: 'cover', title: 'Título', image: {src: image}}]}));
    const result = spawnSync(process.execPath, [path.join(root, 'decks/build.mjs'), file, '--html-only'], {encoding: 'utf8', env: process.env});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /video frames are forbidden on covers/);
    assert.equal(fs.existsSync(path.join(dir, 'cover-test.html')), false);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});
