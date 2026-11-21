// node sheet.mjs <framesDir> <outBase.jpg> [cols=6] [tile=320x200] [perSheet=60]
// Safely builds one or more labelled contact sheets from PNG frames in <framesDir>, without ever overflowing xargs
// or overwriting input frames (xargs montage split across batches can overwrite frames).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [dir, outArg, colsArg = '6', tile = '320x200', perArg = '60'] = process.argv.slice(2);
if (!dir || !outArg) {
  console.error('usage: node sheet.mjs <framesDir> <outBase.jpg> [cols=6] [tile=320x200] [perSheet=60]');
  process.exit(2);
}
const cols = Number(colsArg), per = Number(perArg);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort().map((f) => path.join(dir, f));
if (!files.length) {
  console.error(`sheet.mjs: no .png files in ${dir}`);
  process.exit(1);
}
const ext = path.extname(outArg) || '.jpg';
const stem = outArg.slice(0, outArg.length - ext.length);
fs.mkdirSync(path.dirname(path.resolve(outArg)), { recursive: true });

const chunks = [];
for (let i = 0; i < files.length; i += per) chunks.push(files.slice(i, i + per));
const outputs = [];
chunks.forEach((chunk, i) => {
  const out = chunks.length === 1 ? `${stem}${ext}` : `${stem}-${String.fromCharCode(65 + i)}${ext}`;
  const r = spawnSync(
    'montage',
    ['-label', '%t', '-pointsize', '14', ...chunk, '-tile', `${cols}x`, '-geometry', `${tile}+3+3`, out],
    { stdio: 'inherit' },
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
  outputs.push(out);
});
console.log(`sheet: ${files.length} frames -> ${outputs.join(', ')}`);
