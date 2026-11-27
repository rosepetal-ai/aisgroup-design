// Records a tutorial take (Video, Tutorials) in a real page at 1920 × 1080: shows each step's text, starts its action
// about 1 s later, glides the real mouse to the control and presses it. Writes, into <out>:
//   recording.mp4  the page at 25 fps, with no cursor drawn (the stage draws one from the log)
//   pointer.json   { moves: [[s, x, y], …], presses: [[s, x, y], …] }, the real mouse, seconds from the first frame
//   steps.json     { duration, steps: [{ text, start, action, hold, box: [x, y, w, h] }, …] }
// The timing is computed, never hand-set: the text holds as long as it takes to read (18 characters a second, 1.8 to 7 s)
// and at least until its action is done; the pointer glides on an ease-in-out curve for 2.2 ms per pixel of a 1280 px
// wide frame, 0.65 to 1.8 s.
//
//   node engine/tools/record-tutorial.mjs take.json work/<slug>/take
//
// take.json: { "url": "http://localhost:…", "ready": "<selector the page shows when loaded>",
//              "steps": [{ "text": "Click «Create»", "click": "<selector>" }, { "text": "Name it", "type": ["<selector>", "Line 2"] }] }
// A step may add "after": seconds to wait once its text has gone (a page that loads).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { STEP, readTime } from '../recipe.mjs';

const { positionals, values } = parseArgs({ allowPositionals: true, options: { 'sign-in': { type: 'boolean' } } });
const [takeFile, outDir] = positionals;
if (!takeFile || !outDir) { console.error('Usage: node engine/tools/record-tutorial.mjs take.json <out folder> [--sign-in]'); process.exit(2); }
const take = JSON.parse(fs.readFileSync(takeFile, 'utf8'));
if (values['sign-in'] && (!process.stdin.isTTY || !take.ready)) {
  throw new Error('Interactive sign-in needs a terminal and a ready selector for the intended post-login screen.');
}
const W = 1920, H = 1080, FPS = 25;
const glideTime = (px) => Math.min(1.8, Math.max(0.65, px * (1280 / W) * 0.0022));
const easeInOut = (p) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
const sleep = (s) => new Promise((ok) => setTimeout(ok, Math.max(0, s * 1000)));
const r3 = (v) => Math.round(v * 1000) / 1000;

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-take-'));
let browser;
try {
  browser = await chromium.launch({ headless: !values['sign-in'], executablePath: process.env.CHROME_BIN || undefined });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(take.url, { waitUntil: 'load' });
  if (values['sign-in']) {
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    try {
      await prompt.question('Sign in inside the browser, open the approved demo screen, then press Enter here to start capture. ');
    } finally { prompt.close(); }
  }
  if (take.ready) await page.waitForSelector(take.ready, { state: 'visible' });

  // Every frame Chromium paints, as PNG with its time; later laid on a 25 fps grid.
  const frames = [], cdp = await page.context().newCDPSession(page);
  const t0 = Date.now() / 1000, now = () => Date.now() / 1000 - t0;
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const file = path.join(tmp, `${frames.length}.png`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    frames.push([(metadata.timestamp ?? Date.now() / 1000) - t0, file]);
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'png', maxWidth: W, maxHeight: H, everyNthFrame: 1 });

  let pos = take.start || [W / 2, H / 2];
  const moves = [], presses = [], steps = [];
  await page.mouse.move(...pos); moves.push([now(), ...pos]);
  const glide = async (to) => {
    const from = pos, d = Math.hypot(to[0] - from[0], to[1] - from[1]), len = glideTime(d), a = now();
    if (d < 1) return;
    for (let p = 0; p < 1;) {
      p = Math.min(1, (now() - a) / len);
      const e = easeInOut(p);
      pos = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e];
      await page.mouse.move(...pos); moves.push([now(), ...pos]);
    }
  };

  await sleep(1); // the app on screen before the first text
  for (const st of take.steps) {
    const start = now(), el = page.locator(st.click || st.type[0]).first();
    await el.waitFor();
    await sleep(start + STEP.lead - now());
    const b = await el.boundingBox(), action = now();
    await glide([b.x + b.width / 2, b.y + b.height / 2]);
    presses.push([now(), ...pos]); await page.mouse.down(); await page.mouse.up();
    if (st.type) await page.keyboard.type(st.type[1], { delay: 70 });
    // On screen as long as it takes to read, and until its action is done (7 s at most).
    const hold = Math.min(STEP.max, Math.max(readTime(st.text), now() - start + 0.5));
    steps.push({ text: st.text, start: r3(start), action: r3(action), hold: r3(hold), box: [b.x, b.y, b.width, b.height].map(Math.round) });
    await sleep(start + hold + 0.2 + (st.after || 0) - now()); // the text leaves over 5 frames, then the next one
  }
  await sleep(1); // the result, before the end card
  const duration = r3(now());
  await cdp.send('Page.stopScreencast');
  await browser.close();

  // The video: for each 25 fps frame, the last painted frame at or before it.
  if (!frames.length) throw new Error('Chromium produced no frames for this take.');
  const out = path.join(outDir, 'recording.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-vf', 'scale=out_color_matrix=bt709:out_range=tv',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => {
    ff.once('error', fail);
    ff.once('close', c => c === 0 ? ok() : fail(new Error('FFmpeg exited with code ' + c)));
  });
  function* outputFrames() {
  for (let n = 0, k = 0; n < Math.round(duration * FPS); n++) {
    while (k < frames.length - 1 && frames[k + 1][0] <= n / FPS) k++;
    yield fs.readFileSync(frames[k][1]);
  }
  }
  try { await Promise.all([pipeline(outputFrames(), ff.stdin), done]); }
  finally { if (ff.exitCode === null) ff.kill(); }
  fs.writeFileSync(path.join(outDir, 'pointer.json'), JSON.stringify({ moves: moves.map((m) => m.map(r3)), presses: presses.map((m) => m.map(r3)) }));
  fs.writeFileSync(path.join(outDir, 'steps.json'), JSON.stringify({ duration, steps }, null, 2) + '\n');
  console.log(`wrote ${out} (${duration} s, ${steps.length} steps, ${frames.length} painted frames)`);
} finally {
  try { await browser?.close(); } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
