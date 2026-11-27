// Render scene time frame by frame, independent of the GPU's playback speed.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { 'no-captions': { type: 'boolean' }, size: { type: 'string', default: '1920x1080' } },
});
const [output = 'animation.mp4'] = positionals;
const size = /^(\d{2,4})x(\d{2,4})$/.exec(values.size);
if (positionals.length > 1 || !/\.mp4$/i.test(output) || !size) {
  throw new Error('Use npm run film -- [animation.mp4] [--size 1920x1080] [--no-captions]');
}
const [width, height] = size.slice(1).map(Number);
if ([width, height].some(n => n < 240 || n > 4096 || n % 2)) throw new Error('Choose even dimensions between 240 and 4096 pixels.');
const url = pathToFileURL(path.resolve('index.html'));
url.searchParams.set('film', '1');
const target = path.resolve(output);
const temp = await fs.mkdtemp(path.join(path.dirname(target), '.ais-film-'));
const encoded = path.join(temp, 'film.mp4');
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(url.href);
  await page.waitForFunction(() => Number.isFinite(window.__anim?.duration));
  if (values['no-captions']) await page.addStyleTag({ content: '[data-scene-caption]{display:none}' });
  const fps = 25;
  const duration = await page.evaluate(() => window.__anim.duration);
  async function* frames() {
    for (let i = 0; i < Math.ceil(duration * fps); i++) {
      await page.evaluate(t => window.__anim.seek(t), i / fps);
      yield await page.screenshot({ type: 'png' });
    }
  }
  const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'image2pipe',
    '-framerate', String(fps), '-i', 'pipe:0', '-vf', 'scale=out_color_matrix=bt709:out_range=tv',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709',
    '-color_trc', 'bt709', '-crf', '16', '-movflags', '+faststart', encoded], { stdio: ['pipe', 'ignore', 'inherit'] });
  const finished = new Promise((resolve, reject) => {
    encoder.once('error', reject);
    encoder.once('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg exited with code ' + code)));
  });
  try { await Promise.all([pipeline(frames(), encoder.stdin), finished]); }
  finally { if (encoder.exitCode === null) encoder.kill(); }
  await fs.copyFile(encoded, target, fs.constants.COPYFILE_EXCL);
  console.log(target);
} finally {
  try { await browser?.close(); } finally { await fs.rm(temp, { recursive: true, force: true }); }
}
