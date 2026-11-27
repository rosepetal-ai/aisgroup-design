// Renders recipes into finished files: PNG for posts and slides, a PDF for LinkedIn carousels, MP4 for video
// (ProRes 4444 with transparency for a lower third on its own). Every piece is checked on the way: the recipe
// and its words before rendering, the layout and the brand check on every settled frame.
//
//   node engine/render.mjs work/hopper-launch/recipe.json
//   node engine/render.mjs examples/*.json --formats 4x5 --only png
//
// Options: --formats 4x5,1x1  only these formats of the recipe
//          --only png,pdf,mp4  only these outputs (default: the kind's outputs, or the recipe's "outputs")
//          --out <folder>      default: out/ next to the recipe
//          --force             write files even when a check fails (drafts only; never publish them)
// Output names follow Communications › Templates: the recipe name, the format and the slide number.
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadRecipe, resolveFile, STUDIO, GUIDE } from './recipe.mjs';

const argv = process.argv.slice(2), opt = {}, files = [];
for (let i = 0; i < argv.length; i++) argv[i].startsWith('--') ? (opt[argv[i].slice(2)] = argv[i + 1]?.startsWith('--') || argv[i + 1] === undefined ? true : argv[++i]) : files.push(argv[i]);
if (!files.length) { console.error('Usage: node engine/render.mjs <recipe.json> [more recipes] [--formats 4x5] [--only png,pdf,mp4] [--out dir] [--force]'); process.exit(2); }
const srt = (t) => new Date(t * 1000).toISOString().slice(11, 23).replace('.', ',');
const list = (v) => (v && v !== true ? String(v).split(',') : null);
const has = (cmd) => spawnSync(cmd, ['-version'], { stdio: 'ignore' }).error === undefined;

const BT709 = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709'];
// The published intros and end cards were encoded with these settings, so a film splices them without re-encoding.
const X264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', ...BT709];
const encoder = (kind, fps, file) => {
  const input = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (kind === 'mov') return [...input, '-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', ...BT709, file + '.mov'];
  return [...input, '-vf', 'scale=out_color_matrix=bt709:out_range=tv', ...X264, file + '.mp4'];
};
const local = (u) => decodeURIComponent(u.replace('file://', ''));
const seconds = (f) => +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout;
const ffmpeg = (args) => spawnSync('ffmpeg', ['-y', '-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 });

// File access lets the stage read its own pictures' pixels (the subject of a render, for the space rule).
const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--allow-file-access-from-files'] });
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.goto('file://' + path.join(STUDIO, 'engine/stage.html'));
// Fonts first: headlines are broken into lines by measuring them, so the measurement must use Inter.
await page.evaluate(() => Promise.all(['500 40px Inter', '400 40px Inter', '600 40px Inter', '500 30px "JetBrains Mono"'].map((f) => document.fonts.load(f))));
await page.addScriptTag({ path: path.join(GUIDE, 'downloads/qa/brand-check.js') });

let failed = 0;
for (const file of files) {
  const { recipe: r, errors, warnings } = loadRecipe(file);
  console.log(`\n${path.relative(process.cwd(), r.file)}  (${r.kind}, ${r.brand}, ${r.lang})`);
  warnings.forEach((w) => console.log(`  warn   ${w}`));
  errors.forEach((e) => console.log(`  error  ${e}`));
  if (errors.length && !opt.force) { failed++; console.log('  Not rendered: fix the errors above (or --force for a draft).'); continue; }

  const out = path.resolve(opt.out || path.join(r.dir, 'out'));
  fs.mkdirSync(out, { recursive: true });
  const outputs = (list(opt.only) || r.outputs).filter((o) => r.outputs.includes(o) || list(opt.only));
  const formats = r.formats.filter((f) => !list(opt.formats) || list(opt.formats).includes(f));
  const report = { recipe: r.file, rendered: new Date().toISOString(), errors, warnings, formats: {} };
  let bad = errors.length > 0;

  // The published brand intro and end card ("intro", "end" with "published") are spliced in as files after the stage
  // renders the rest: the end card byte for byte, the intro brought to the film's frame rate with the same settings.
  const head = r.shots[0]?.type === 'intro' ? local(r.shots[0].src) : null, tail = r.shots.at(-1)?.published ? local(r.shots.at(-1).src) : null;
  for (const format of formats) {
    const shots = r.shots.filter((s, i) => !(head && i === 0) && !(tail && i === r.shots.length - 1)).map((s) => ({ ...s, ...(s.formats?.[format] || {}) }));
    const spec = { kind: r.kind, brand: r.brand, brandName: r.brandName, lang: r.lang, format, fps: r.fps || 25, captions: r.captions, icons: r.icons, shots };
    const base = path.join(out, `${r.name}_${format}`);
    const fr = (report.formats[format] = { issues: [], brandCheck: [], files: [] });

    // Captions from word timings ("captionsFrom": a YouTube json3 file or [[seconds, word], …]): each voiced shot's
    // words placed at the shot's start, "corrections" applied to them (automatic transcripts get names wrong), then cut
    // into cues of two lines of 42 characters at most that close at a sentence end, a pause or when full, and stay at
    // least 1 s on screen (Video, Captions). A cue may run across a cut; a short tail is balanced with the cue before it.
    if (r.captionsFrom && !r.captions?.length) {
      const raw = JSON.parse(fs.readFileSync(resolveFile(r.captionsFrom, r.dir), 'utf8'));
      const words = Array.isArray(raw) ? raw : raw.events.flatMap((e) => (e.segs || []).map((g) => [((e.tStartMs || 0) + (g.tOffsetMs || 0)) / 1000, (g.utf8 || '').trim()])).filter(([, w]) => w);
      await page.evaluate((x) => window.preload(x), spec);
      const pre = await page.evaluate((x) => window.setup(x), { ...spec, still: false });
      const fix = (t) => (r.corrections || []).reduce((t2, [a, b]) => t2.split(a).join(b), t);
      const ws = []; // [time, word, end of its shot]
      spec.shots.forEach((sh, i) => {
        if (!sh.voice) return;
        const vin = sh.voice === true ? sh.in : sh.voice.in, t0 = pre.starts[i] / spec.fps, end = t0 + pre.lens[i] / spec.fps;
        const said = words.filter(([t]) => t >= vin - 0.05 && t < vin + (end - t0) - 0.15);
        const seq = said.map(([t]) => Math.max(t0, t0 + t - vin)), fixed = fix(said.map(([, w]) => w).join(' ')).split(/\s+/).filter(Boolean);
        // ponytail: a correction that changes the word count spreads the timings evenly, fine for names and typos
        fixed.forEach((w, j) => ws.push([seq[Math.round((j * (seq.length - 1)) / Math.max(1, fixed.length - 1))], w, end]));
      });
      const wrap = (g) => g.reduce((ls, [, w]) => { if ((ls.at(-1) + ' ' + w).trim().length > 42) ls.push(''); ls[ls.length - 1] = (ls.at(-1) + ' ' + w).trim(); return ls; }, ['']);
      const len = (g) => g.map(([, w]) => w).join(' ').length;
      const groups = [];
      let g = [];
      ws.forEach((x, k) => {
        if (g.length && wrap([...g, x]).length > 2) { groups.push({ g, full: true }); g = []; }
        g.push(x);
        const next = ws[k + 1];
        if (!next || next[0] - x[0] > 1.2 || /[.?!]["”»]?$/.test(x[1])) { groups.push({ g, full: false }); g = []; }
      });
      groups.forEach((q, k) => {
        const p = groups[k - 1];
        if (!p?.full || len(q.g) >= 28) return;
        const all = [...p.g, ...q.g];
        const cost = (j) => Math.abs(len(all.slice(0, j)) - len(all.slice(j))) - (/[,;:]$/.test(all[j - 1][1]) ? 15 : 0); // even halves, at a comma if one is near
        let best = -1;
        for (let j = 1; j < all.length; j++) if (wrap(all.slice(0, j)).length <= 2 && wrap(all.slice(j)).length <= 2 && (best < 0 || cost(j) < cost(best))) best = j;
        if (best > 0) { p.g = all.slice(0, best); q.g = all.slice(best); }
      });
      // a cue of a word or two joins its neighbour when they fit together
      for (let k = 0; k < groups.length; k++) {
        const q = groups[k], n = groups[k + 1], p = groups[k - 1];
        if (len(q.g) >= 16) continue;
        if (n && n.g[0][0] - q.g.at(-1)[0] < 2 && wrap([...q.g, ...n.g]).length <= 2) { n.g = [...q.g, ...n.g]; groups.splice(k--, 1); }
        else if (p && wrap([...p.g, ...q.g]).length <= 2) { p.g = [...p.g, ...q.g]; groups.splice(k--, 1); }
      }
      const cues = groups.map(({ g: q }, k) => {
        const last = q.at(-1), next = groups[k + 1]?.g[0];
        const to = Math.min(next ? next[0] : Infinity, last[2] - 0.05, last[0] + 1.5);
        const text = wrap(q).join('|'), opens = !k || /[.?!]["”»]?$/.test(groups[k - 1].g.at(-1)[1]);
        return { from: +q[0][0].toFixed(2), to: +Math.max(to, q[0][0] + 1).toFixed(2), text: opens ? text[0].toUpperCase() + text.slice(1) : text };
      });
      cues.forEach((q, k) => { if (cues[k + 1] && q.to > cues[k + 1].from) q.to = cues[k + 1].from; });
      spec.captions = cues;
      fs.writeFileSync(path.join(out, `${r.name}_${format}.srt`), cues.map((q, k) => `${k + 1}\n${srt(q.from)} --> ${srt(q.to)}\n${q.text.replace(/\|/g, '\n')}\n`).join('\n'));
    }
    const load = async (still) => {
      await page.evaluate((x) => window.preload(x), spec);
      const info = await page.evaluate((s) => window.setup(s), { ...spec, still });
      await page.setViewportSize({ width: info.width, height: info.height });
      await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {})),
        ...[...document.querySelectorAll('video')].map((v) => v.readyState >= 2 || new Promise((r) => v.addEventListener('loadeddata', r, { once: true })))]));
      return info;
    };

    // Settled frames, for every kind: layout checks and the brand check on each, then PNG and PDF.
    {
      const info = await load(true);
      const pngs = [], pdfs = [];
      for (const [i, n] of info.posters.entries()) {
        await page.evaluate((k) => window.frame(k), n);
        fr.issues.push(...(await page.evaluate(([s, k]) => window.audit(s, k), [spec, i])));
        const check = await page.evaluate(() => window.aisBrandCheck());
        // The engine's own translucent scrims and light fields are part of the brand devices.
        check.findings.filter((f) => f.rule !== 'alt').forEach((f) => fr.brandCheck.push({ shot: i, ...f }));
        const nn = info.posters.length > 1 ? `_${String(i + 1).padStart(2, '0')}` : '';
        const frameShot = await page.screenshot({ clip: { x: 0, y: 0, width: info.width, height: info.height } });
        if (outputs.includes('png')) { const p = `${base}${nn}.png`; fs.writeFileSync(p, frameShot); pngs.push(p); }
        // Posts and carousels: no gradient, and no huge empty space. Each picture's subject covers 55 % of its band or
        // more; no strip of empty rows taller than 12 % of the slide between two elements (one at an edge over 25 % is reported).
        if (r.kind !== 'video') {
          (await page.evaluate(() => window.gradientList())).forEach((g) => fr.issues.push({ shot: i, rule: 'gradient', detail: `${g} paints a gradient: posts and carousels use flat colour and hard picture edges` }));
          const sp = await page.evaluate(([u, b]) => window.spaceOf(u, b), ['data:image/png;base64,' + frameShot.toString('base64'), await page.evaluate(() => window.bandList())]);
          const pc = (v) => Math.round(v * 100);
          fr.space = fr.space || [];
          fr.space.push({ shot: i, cover: sp.cover.map((c) => +c.cover.toFixed(3)), strip: +((sp.strip[1] - sp.strip[0]) / sp.h).toFixed(3), stripAt: sp.strip, edge: +((sp.edge[1] - sp.edge[0]) / sp.h).toFixed(3), edgeAt: sp.edge });
          sp.cover.forEach((c) => { if (c.cover < 0.55) fr.issues.push({ shot: i, rule: 'picture-empty', detail: `the subject covers ${pc(c.cover)} % of its picture band (55 % at least): crop tighter or let the picture fill its band` }); });
          if (sp.strip[1] - sp.strip[0] > sp.h * 0.12) fr.issues.push({ shot: i, rule: 'empty-strip', detail: `an empty strip of ${pc((sp.strip[1] - sp.strip[0]) / sp.h)} % of the height (rows ${sp.strip[0]}-${sp.strip[1]}) between two elements: 12 % at most` });
          if (sp.edge[1] - sp.edge[0] > sp.h * 0.25) fr.issues.push({ shot: i, rule: 'empty-strip-soft', detail: `an empty strip of ${pc((sp.edge[1] - sp.edge[0]) / sp.h)} % of the height at the ${sp.edge[0] === 0 ? 'top' : 'foot'} (rows ${sp.edge[0]}-${sp.edge[1]}): 25 % at most` });
        }
        if (outputs.includes('pdf')) {
          const p = path.join(os.tmpdir(), `ais-studio-${process.pid}-${i}.pdf`);
          await page.pdf({ path: p, width: info.width + 'px', height: info.height + 'px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: '1' });
          pdfs.push(p);
        }
        // Posts and carousels: every word against what is really behind it, 4.5:1 at least (the frame shot again with the words hidden).
        if (r.kind !== 'video') {
          const ink = await page.evaluate(() => window.inkList());
          await page.evaluate(() => window.inkOff(true));
          const bgShot = await page.screenshot({ clip: { x: 0, y: 0, width: info.width, height: info.height } });
          await page.evaluate(() => window.inkOff(false));
          const low = (await page.evaluate(([u, l]) => window.contrastOf(u, l), ['data:image/png;base64,' + bgShot.toString('base64'), ink])).filter((t) => t.ratio < 4.5);
          low.forEach((t) => fr.issues.push({ shot: i, rule: 'contrast', detail: `"${t.what}" is ${t.ratio.toFixed(2)}:1 against what is behind it (4.5:1 at least)` }));
        }
      }
      if (pdfs.length) {
        if (has('pdfunite')) spawnSync('pdfunite', [...pdfs, base + '.pdf']);
        else { // No poppler: one PDF of the slide images instead (text not selectable).
          const imgs = []; for (const n of info.posters) { await page.evaluate((k) => window.frame(k), n); imgs.push((await page.screenshot({ clip: { x: 0, y: 0, width: info.width, height: info.height } })).toString('base64')); }
          const doc = await browser.newPage(); await doc.setContent(`<style>@page{margin:0}body{margin:0}img{display:block;width:${info.width}px;height:${info.height}px;break-after:page}</style>${imgs.map((b) => `<img src="data:image/png;base64,${b}">`).join('')}`);
          await doc.pdf({ path: base + '.pdf', width: info.width + 'px', height: info.height + 'px', printBackground: true }); await doc.close();
        }
        pdfs.forEach((p) => fs.rmSync(p, { force: true }));
        fr.files.push(base + '.pdf');
      }
      fr.files.push(...pngs);
      // A contact sheet of every slide, for a quick review in one image.
      if (pngs.length > 1) {
        const sheet = await browser.newPage({ viewport: { width: 1600, height: 400 } });
        await sheet.setContent(`<body style="margin:0;padding:24px;background:#F1F5F9;display:grid;grid-template-columns:repeat(${Math.min(5, pngs.length)},1fr);gap:16px">${pngs.map((p) => `<img src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}" style="width:100%;display:block">`).join('')}</body>`);
        await sheet.screenshot({ path: base + '_sheet.png', fullPage: true }); await sheet.close();
        fr.files.push(base + '_sheet.png');
      }
    }

    // Motion: every frame, encoded with FFmpeg.
    for (const o of outputs.filter((x) => x === 'mp4' || x === 'mov')) {
      if (!has('ffmpeg')) { console.log('  error  FFmpeg is not installed: no video'); bad = true; continue; }
      const info = await load(false);
      const proc = spawn('ffmpeg', encoder(o, spec.fps, base), { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise((ok, fail) => proc.on('close', (c) => (c ? fail(new Error(`ffmpeg exited ${c}`)) : ok())));
      for (let n = 0; n < info.frames; n++) {
        await page.evaluate((k) => window.frame(k), n);
        // JPEG at high quality is several times faster to capture than PNG; transparency needs PNG.
        const png = await page.screenshot(o === 'mov' ? { type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: info.width, height: info.height } } : { type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: info.width, height: info.height } });
        if (!proc.stdin.write(png)) await new Promise((res) => proc.stdin.once('drain', res));
      }
      proc.stdin.end(); await done;
      let lead = 0; // seconds of published intro before the stage's first frame
      if (o === 'mp4' && (head || tail)) {
        const body = `${base}.body.mp4`, intro = `${base}.intro.mp4`, list = `${base}.parts.txt`;
        fs.renameSync(`${base}.mp4`, body);
        if (head) { ffmpeg(['-loglevel', 'error', '-i', head, '-an', '-vf', `fps=${spec.fps}`, ...X264, intro]); lead = seconds(intro); }
        fs.writeFileSync(list, [head && intro, body, tail].filter(Boolean).map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n') + '\n');
        const j = ffmpeg(['-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', `${base}.mp4`]);
        [body, intro, list].forEach((p) => fs.rmSync(p, { force: true }));
        if (j.status) { console.log(`  error  the published intro or end card could not be spliced: ${j.stderr.trim()}`); bad = true; }
      }
      // Sound (Video, Sound): every shot with a voice adds its stretch of sound at the shot's start; the music ("music")
      // runs from the first frame under it and fades out over the end card. Mixed and levelled to −14 LUFS and −1 dBTP:
      // measured first, so one linear gain does it when the peaks allow (fades keep their shape), else loudnorm limits;
      // the peak target is −1.5 dBTP because the AAC encode adds a few tenths.
      const voiced = spec.shots.map((s, i) => ({ s, i })).filter(({ s }) => s.voice);
      if (o === 'mp4' && (voiced.length || r.music)) {
        const total = seconds(`${base}.mp4`), args = ['-i', `${base}.mp4`], parts = [];
        voiced.forEach(({ s, i }, k) => {
          const v = s.voice === true ? { src: s.src, in: s.in } : s.voice;
          args.push('-ss', String(v.in), '-t', String(info.lens[i] / spec.fps), '-i', local(v.src));
          const ms = Math.round((lead + info.starts[i] / spec.fps) * 1000), fade = Math.min(0.08, info.lens[i] / spec.fps / 4);
          parts.push(`[${k + 1}:a]aresample=48000,afade=t=in:d=${fade},afade=t=out:st=${(info.lens[i] / spec.fps - fade).toFixed(3)}:d=${fade},adelay=${ms}|${ms}[a${k}]`);
        });
        if (r.music) {
          args.push('-ss', String(r.music.in), '-i', local(r.music.src));
          // ponytail: music sits a fixed 18 dB under a voice; add ducking if a film needs the music up between phrases
          parts.push(`[${voiced.length + 1}:a]aresample=48000,volume=${voiced.length ? -18 : 0}dB,apad,atrim=0:${total.toFixed(3)},afade=t=out:st=${(total - r.music.fade).toFixed(3)}:d=${r.music.fade}[a${voiced.length}]`);
        }
        const mix = `${parts.join(';')};${parts.map((_, k) => `[a${k}]`).join('')}amix=inputs=${parts.length}:normalize=0,apad,atrim=0:${total.toFixed(3)}`;
        const m = ffmpeg([...args, '-filter_complex', `${mix},loudnorm=I=-14:TP=-1.5:LRA=20:print_format=json[aout]`, '-map', '[aout]', '-f', 'null', '-']);
        const tmp = `${base}.sound.mp4`;
        let ok = false;
        try {
          const l = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{')));
          const level = `loudnorm=I=-14:TP=-1.5:LRA=20:measured_I=${l.input_i}:measured_TP=${l.input_tp}:measured_LRA=${l.input_lra}:measured_thresh=${l.input_thresh}:offset=${l.target_offset}:linear=true`;
          ok = ffmpeg(['-loglevel', 'error', ...args, '-filter_complex', `${mix},${level},aresample=48000[aout]`, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', tmp]).status === 0;
        } catch { /* no measurement: reported below */ }
        if (ok) fs.renameSync(tmp, `${base}.mp4`); else { console.log('  error  the sound could not be mixed'); bad = true; }
      }
      fr.files.push(`${base}.${o}`);
    }

    fr.issues.forEach((x) => console.log(`  ${x.rule.endsWith('-soft') ? 'warn ' : 'error'}  ${format} shot ${x.shot + 1}: ${x.detail}`));
    fr.brandCheck.forEach((x) => console.log(`  error  ${format} shot ${x.shot + 1}: brand check ${x.rule}: ${x.detail || ''} ${x.where || ''}`.trimEnd()));
    if (fr.issues.some((x) => !x.rule.endsWith('-soft')) || fr.brandCheck.length) bad = true;
    fr.files.forEach((f) => console.log(`  wrote  ${path.relative(process.cwd(), f)}`));
  }
  fs.writeFileSync(path.join(out, `${r.name}_report.json`), JSON.stringify(report, null, 2));
  if (r.copy) fs.writeFileSync(path.join(out, `${r.name}_copy.txt`), r.copy + '\n');
  if (bad) { failed++; console.log(opt.force ? '  Draft only: checks failed (see above).' : '  Checks failed: fix them before publishing.'); }
  else console.log('  Passed every check.');
}
await browser.close();
process.exit(failed ? 1 : 0);
