// Loads a recipe, fills its defaults, resolves its files and checks it against the brand rules that can be
// read from the recipe itself (the renderer checks layout; copy.mjs checks the words).
import fs from 'node:fs';
import { patternFile } from './linkedin-patterns.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintCopy } from './copy.mjs';
import { ensureMedia } from '../scripts/media.mjs';
import { productImageError, productImageWarning } from './product-images.mjs';
import { isVideoFrame, bannedImage } from '../print/image-rules.mjs';

export const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const GUIDE = path.resolve(STUDIO, 'brand'); // fonts, logos, icons, imagery from the brand guide
const ICONS = path.join(GUIDE, 'downloads/icons/svg');

export const BRANDS = {
  'ais-group': { name: 'AIS Group', url: 'aisgroup.ai' },
  'ais-vision-systems': { name: 'AIS Vision Systems', url: 'aisvision.com' },
  'ais-vision-automation': { name: 'AIS Vision Automation', url: 'aisautomation.ie' },
  'ais-scanology': { name: 'AIS Scanology', url: 'scanology.nl' },
  rosepetal: { name: 'Rosepetal', url: 'rosepetal.ai' },
};
export const KINDS = {
  post: { formats: ['4x5', '1x1', '191x1', '9x16'], default: ['4x5'], outputs: ['png'] },
  carousel: { formats: ['4x5', '1x1'], default: ['4x5'], outputs: ['pdf', 'png'] },
  video: { formats: ['16x9', '1x1', '4x5', '9x16'], default: ['16x9'], outputs: ['mp4'] },
};
// Fields per shot type: what must be there, and which of them are files.
const SHOTS = {
  cover: { need: ['headline'] }, text: { need: ['headline'] }, list: { need: ['headline', 'items'] }, pair: { need: ['a', 'b'] },
  quote: { need: ['quote', 'name', 'permission'] }, cta: { need: ['headline', 'action'] }, figure: { need: ['src', 'headline'] },
  still: { need: [] }, clip: { need: ['src', 'in', 'out'] }, title: { need: ['title'] }, claims: { need: ['words'] },
  stat: { need: ['value', 'text', 'note', 'basis'] },
  hero: { need: ['headline'] }, panel: { need: ['headline'] }, grid: { need: ['headline', 'items'] }, callout: { need: ['src', 'items', 'headline'] }, event: { need: ['event'] }, contact: { need: ['headline', 'action'] }, stand: { need: ['event'] }, showcase: { need: ['src', 'headline'] },end: { need: [] }, opening: { need: [] }, 'lower-third': { need: ['name'] },
  intro: { need: [] }, recording: { need: ['src', 'steps', 'pointer'] },
};
const POST_SHOTS = ['cover', 'text', 'list', 'pair', 'figure', 'quote', 'cta', 'still', 'stat', 'stand', 'title', 'hero', 'panel', 'grid', 'callout', 'event', 'contact', 'showcase'];
const CLOSERS = ['cta', 'contact'];
const FILE_KEYS = ['src', 'bgSrc', 'portrait'];
const BASIS = ['measured', 'estimated', 'target', 'illustrative'];
// Rosepetal films carry the Rosepetal soundtrack (Video, Sound); this track unless the recipe names another or "music": false.
const ROSEPETAL_TRACK = '@guide/kit/files/rosepetal_music_quiet-beauty_v01.m4a';

// Tutorial steps (Video, Tutorials): two lines of 42 characters at most ("|" forces a break), on screen as long as they take
// to read at 18 characters a second (1.8 to 7 s); the action starts about 1 s after its text appears, while it is on screen.
export const STEP = { cps: 18, min: 1.8, max: 7, lead: 1, width: 42 };
export const stepLines = (text) => String(text).split('|').flatMap((part) => part.trim().split(/\s+/).reduce((ls, w) => {
  if (ls.length && (ls.at(-1) + ' ' + w).length <= STEP.width) ls[ls.length - 1] += ' ' + w; else ls.push(w);
  return ls;
}, []));
export const readTime = (text) => Math.min(STEP.max, Math.max(STEP.min, stepLines(text).join(' ').length / STEP.cps));
export const stepErrors = (st) => {
  const out = [], lines = stepLines(st.text), need = readTime(st.text);
  if (lines.length > 2 || lines.some((l) => l.length > STEP.width)) out.push(`"${st.text}" sets on ${lines.length} lines: two of ${STEP.width} characters at most, one idea`);
  if (!(st.hold >= need - 0.05 && st.hold <= STEP.max + 0.05)) out.push(`"${st.text}" holds ${st.hold} s: it needs ${need.toFixed(1)} to ${STEP.max} s (${STEP.cps} characters a second, ${STEP.min} s at least)`);
  if (!(st.action > st.start)) out.push(`the action of "${st.text}" starts before its text: the text first, the action about ${STEP.lead} s later`);
  else if (st.action >= st.start + st.hold) out.push(`the action of "${st.text}" starts after its text has gone: it starts while the text is on screen`);
  return out;
};

// "@guide/…" is the brand guide's public folder, "@lib/…" the studio library; anything else is relative to the recipe.
// A library picture not yet on this computer is fetched from the media bucket the first time it is used.
export const resolveFile = (p, dir) => {
  if (p.startsWith('@lib/media/')) ensureMedia([p.slice(11)]);
  return p.startsWith('@guide/') ? path.join(GUIDE, p.slice(7)) : p.startsWith('@lib/') ? path.join(STUDIO, 'library', p.slice(5)) : path.resolve(dir, p);
};

// The curated media library's photos (brand/library, copied from the repo's library/ by npm run guide), one asset per
// file under its clean name. A picture the catalogue already lists keeps that entry's review status and points at it.
export function libraryPhotos(catalog) {
  const index = path.join(GUIDE, 'library/library.json');
  if (!fs.existsSync(index)) return [];
  const byPath = new Map(catalog.map(x => [x.path, x]));
  const legacy = s => String(s || '').replace(/^rosepetal-design\/studio\//, '').replace(/^.*\/imagery\/(references\/)?/, 'brand/imagery/');
  const { entries, origins } = JSON.parse(fs.readFileSync(index, 'utf8'));
  return entries.filter(e => e.kind === 'photo').flatMap(e => e.variants.map(v => {
    const old = byPath.get(legacy(v.source));
    return { id: path.basename(v.file, path.extname(v.file)), path: 'brand/' + v.file, kind: 'image', type: e.type, product: e.product ?? null, origin: e.origin,
      status: old?.status ?? 'review', lang: /\bes\b/.test(v.variant) ? 'es' : null, size: [v.width, v.height], source: v.source,
      reason: `${e.title} (${e.subjectLabel}). ${origins[e.origin]}. From the curated media library${old ? `; the same picture as ${old.id}` : ''}.` };
  }));
}
// MCP snapshots use the shared media library's real paths. Index those aliases as well as recipe paths.
const indexAssets = (assets) => new Map(assets.flatMap((a) => {
  const abs = path.resolve(STUDIO, a.path);
  let real; try { real = fs.realpathSync(abs); } catch {}
  return real && real !== abs ? [[abs, a], [real, a]] : [[abs, a]];
}));
const catalog = () => {
  const file = path.join(STUDIO, 'library/catalog.json');
  if (!fs.existsSync(file)) return new Map();
  const assets = JSON.parse(fs.readFileSync(file, 'utf8')).assets;
  return indexAssets([...assets, ...libraryPhotos(assets)]);
};

export const loadRecipe = (file) => checkRecipe(JSON.parse(fs.readFileSync(file, 'utf8')), path.dirname(path.resolve(file)), path.resolve(file));

// The same checks for a recipe held in memory (the editor): `dir` resolves relative files.
export function checkRecipe(raw, dir, file = path.join(dir, 'recipe.json')) {
  const r = { ...raw, kind: raw.kind || 'video', lang: raw.lang || 'en', file, dir };
  const errors = [], warnings = [], assets = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`), warn = (where, msg) => warnings.push(`${where}: ${msg}`);
  const K = KINDS[r.kind];
  if (!K) { err('kind', `"${r.kind}" is not a kind; use post, carousel or video`); return { recipe: r, errors, warnings }; }
  if (!r.name || !/^[a-z0-9][a-z0-9_-]*$/.test(r.name)) err('name', 'needed, lower case, for file names: brand_type_lang_date, e.g. ais-vision-systems_carousel_es_2026-10-18');
  if (!BRANDS[r.brand]) err('brand', `"${r.brand}" is not a brand; use ${Object.keys(BRANDS).join(', ')}`);
  if (!['en', 'es', 'ca'].includes(r.lang)) err('lang', 'en, es or ca');
  r.formats ||= K.default;
  for (const f of r.formats) if (!K.formats.includes(f)) err('formats', `${f} is not a ${r.kind} format; use ${K.formats.join(', ')}`);
  r.outputs ||= r.shots?.length === 1 && r.shots[0].type === 'lower-third' ? ['mov'] : K.outputs;
  if (!Array.isArray(r.shots) || !r.shots.length) { err('shots', 'needed, at least one'); return { recipe: r, errors, warnings }; }

  // Structure by kind.
  const types = r.shots.map((s) => s.type);
  if (r.kind === 'post' && r.shots.length !== 1) err('shots', 'a post is one image; make a carousel for more');
  if (r.kind === 'carousel') {
    if (r.shots.length < 3 || r.shots.length > 10) err('shots', `a carousel has 3 to 10 slides, one idea each (this one has ${r.shots.length})`);
    if (!CLOSERS.includes(types.at(-1))) err('shots', 'a carousel ends on a cta or contact slide with one action');
    if (types.slice(0, -1).some((t) => CLOSERS.includes(t))) err('shots', 'one call to action per piece: only the last slide is a cta or contact');
  }
  if (r.kind === 'video' && r.shots.length > 1 && types.at(-1) !== 'end') err('shots', 'every video ends on the end card ({"type": "end"})');
  if (r.kind !== 'video') r.shots.forEach((s, i) => { if (!POST_SHOTS.includes(s.type)) err(`shot ${i + 1}`, `"${s.type}" is a video shot; posts use ${POST_SHOTS.join(', ')}`); });
  if (r.kind !== 'video' && !r.copy) warn('copy', 'add the post text that goes with it (the LinkedIn caption): it is checked with the same rules');

  // The accent colour marks the one phrase that matters; on every slide it stops meaning anything.
  const accented = r.shots.filter((s) => /\*[^*]+\*/.test(s.headline || '') || /\*[^*]+\*/.test(s.title || '')).length;
  if (accented > 2) warn('shots', `${accented} headlines use the accent colour (*words*): keep it for one or two slides per piece, usually the cover and the closing`);
  // Brand blue on white is the guide's accent, but next to ink it vanishes at feed size: on white, plain headlines.
  r.shots.forEach((s, i) => { if (r.kind !== 'video' && ['white', 'grey'].includes(s.bg) && /\*[^*]+\*/.test(s.headline || '')) warn(`shot ${i + 1}`, 'the accent barely shows on white at feed size: keep it for the blue cover and closing'); });
  // An accent that starts or stops mid-sentence reads as a rendering error: it marks the whole closing phrase.
  r.shots.forEach((s, i) => ['headline', 'title'].forEach((k) => {
    const h = (s[k] || '').replace(/\|/g, ' ');
    if (/\*[^*]+\*/.test(h) && !/\*[^*]+\*[\s.,:;!?…]*$/.test(h)) err(`shot ${i + 1}`, `the accent in "${h}" must be the closing phrase of the ${k}: move the *…* to its end`);
  }));
  // One post system: posts and carousels carry no caption inside the picture, and a carousel's content
  // slides no eyebrow; the renderer leaves them out, so say so rather than let the recipe promise them.
  if (r.kind === 'post' || r.kind === 'carousel') r.shots.forEach((s, i) => {
    // Nothing above or beside the headline: one purpose, the plainest layout. No product name, eyebrow,
    // tagline, subtitle or caption; the only second line is a quote's author (name, role) or a figure's source (note).
    const extra = ['overline', 'eyebrow', 'kicker', 'tagline', 'subtitle', 'subhead', 'caption'].filter((k) => s[k]);
    if (s.type === 'stat' && s.label) extra.push('label');
    if (['hero', 'panel', 'showcase', 'callout'].includes(s.type) && s.text) extra.push('text');
    if (s.type === 'contact' && s.text) extra.push('text');
    if (extra.length) err(`shot ${i + 1}`, `no line above or beside the headline (Social media): remove ${extra.map((k) => `"${k}"`).join(', ')}; the post text names the product, and the only second line is a quote's author or a figure's source`);
    if (s.type === 'contact' && s.rows?.some((x) => x.label)) warn(`shot ${i + 1}`, 'the closing slide sets web and phone on one line without labels (remove "label")');
    // The post system: a post or a carousel cover takes the blue, light or navy look; the closing slide is solid brand blue.
    if (s.look !== undefined && !['blue', 'light', 'navy'].includes(s.look)) err(`shot ${i + 1}`, `"look" is blue (machine, screen, event photo), light (product, detection, carousel cover) or navy (result, quote)`);
    if (s.look !== undefined && i > 0) warn(`shot ${i + 1}`, '"look" applies to a post or a carousel cover only (remove it)');
    // Products and detections take the light look; a render with "look": "blue" or "navy" goes against it (post 15).
    if (i === 0 && ['blue', 'navy'].includes(s.look) && s.evidence === 'render') warn(`shot ${i + 1}`, `"look": "${s.look}" on a render: products and detections take the light look (machines, screens and event photos take blue)`);
    if (r.kind === 'carousel' && i === r.shots.length - 1 && s.type === 'contact' && (s.src || s.slot)) warn(`shot ${i + 1}`, 'the closing slide is solid brand blue with the hexagon corner: its picture is not drawn (remove "src")');
  });
  const cat = catalog();
  const asset = (where, p, s) => {
    const abs = resolveFile(p, dir);
    if (!fs.existsSync(abs)) { err(where, `file not found: ${p}`); return null; }
    const a = cat.get(abs), base = path.basename(abs);
    const banned = bannedImage(abs); if (banned) err(where, banned);
    if (['post', 'carousel'].includes(r.kind)) {
      const invalid = productImageError(abs, s, a, STUDIO); if (invalid) err(where, `${base}: ${invalid}`);
      const unsure = productImageWarning(abs, s, a, STUDIO); if (unsure) warn(where, `${base}: ${unsure}`);
    }
    assets.push({ where, path: abs, entry: a?.id });
    if (!a) {
      if (!abs.startsWith(GUIDE) && !['post', 'carousel'].includes(r.kind)) warn(where, `${base} is not in library/catalog.json: confirm it is real (or a permitted generated image) and has its rights, then add it`);
    } else if (a.status === 'rejected') err(where, `${base} is rejected in the library: ${a.reason}`);
    else if (a.status === 'review') warn(where, `${base} is waiting for review in the library: ${a.reason}`);
    const generated = a?.origin === 'generated' || /generated|chatgpt|gemini|midjourney|dall-?e|firefly|nano.?banana|runway|kling|veo\b|sora\b/i.test(base);
    if (generated && ['machine', 'in-production', 'interface', 'people'].includes(a?.type)) err(where, `${base} is generated and shows a ${a.type}: machines, installations, interfaces and people are always real`);
    if (generated && s && s.evidence !== 'illustration' && (s.inspect || s.detect || s.type === 'pair')) err(where, `${base} is generated: mark the shot "evidence": "illustration"`);
    // Renders built from real dimensions go unlabelled: "evidence": "render" says what they are without a caption.
    if (a?.origin === 'render' && s && !['render', 'illustration'].includes(s.evidence)) err(where, `${base} is a render: mark the shot "evidence": "render"`);
    if (s?.evidence === 'render' && a && a.origin !== 'render') err(where, `${base} is not a render in the library: "evidence": "render" is only for origin "render"`);
    return 'file://' + abs;
  };
  const icon = (where, name) => {
    const f = path.join(ICONS, name + '.svg');
    if (!fs.existsSync(f)) { err(where, `no Lucide icon "${name}" in the brand set (${ICONS})`); return ''; }
    return fs.readFileSync(f, 'utf8').replace(/<!--.*?-->/s, '').replace(/class="[^"]*"/, '');
  };

  r.shots = r.shots.map((s0, i) => {
    const where = `shot ${i + 1} (${s0.type})`, spec = SHOTS[s0.type];
    if (!spec) { err(where, `unknown type; use ${Object.keys(SHOTS).join(', ')}`); return s0; }
    for (const k of spec.need) if (s0[k] === undefined || s0[k] === '') err(where, `needs "${k}"`);
    const s = { ...s0 };
    if (s.videoPattern !== undefined) {
      const v = s.videoPattern;
      if (r.kind !== 'video' || !v || !['rolling', 'particles'].includes(v.type)) err(where, 'videoPattern is video-only: type rolling or particles');
      if (v?.period !== undefined && (!Number.isFinite(v.period) || v.period <= 0)) err(where, 'videoPattern period must be positive seconds');
      if (v?.seed !== undefined && !Number.isInteger(v.seed)) err(where, 'videoPattern seed must be an integer');
    }
    delete s.patternSources;
    if (s.formats) s.formats = Object.fromEntries(Object.entries(s.formats).map(([key, value]) => {
      const clean = { ...value }; delete clean.patternSources; return [key, clean];
    }));
    const pattern = s.pattern ?? r.pattern;
    if (pattern !== undefined && pattern !== 'none') {
      s.pattern = pattern;
      s.patternSources = {};
      for (const format of r.formats) {
        try {
          const size = { '4x5': '1080x1350', '1x1': '1080x1080', '16x9': '1920x1080' }[format];
          const bg = s.formats?.[format]?.bg ?? s.bg;
          const way = bg === 'white' ? 'blue-on-white' : bg === 'grey' ? 'blue-on-grey' : bg === 'deep' ? 'white-on-deep-blue' : 'white-on-blue';
          const rel = patternFile(pattern, way, size, r.kind);
          const abs = path.join(GUIDE, rel);
          if (!fs.existsSync(abs)) throw Error('Pattern asset missing: ' + rel);
          s.patternSources[format] = 'file://' + abs;
        } catch (e) { err(`shot ${i + 1} pattern`, e.message); }
      }
    }
    for (const k of FILE_KEYS) if (typeof s[k] === 'string') s[k] = asset(where, s[k], s0);
    // The brand intro and the end card as the guide publishes them (Video, Tutorials), placed unchanged.
    if (s.type === 'intro') { if (i) err(where, 'the brand intro opens the film: first shot only'); s.src = asset(where, `@guide/kit/files/${r.brand}_brand-intro_v01_16x9.mp4`); }
    if (s.type === 'end' && s.published) {
      if (!['en', 'es'].includes(r.lang)) err(where, 'the guide publishes the end card in ES and EN only: set "lang" to es or en');
      else s.src = asset(where, `@guide/kit/files/${r.brand}_end-card_${r.lang}_v01_16x9.mp4`);
    }
    if ((s.type === 'intro' || s.published) && r.formats.some((f) => f !== '16x9')) err(where, 'the published intro and end card are 16:9 only: "formats": ["16x9"]');
    // A tutorial's recording, with the step list and pointer log that tools/record-tutorial.mjs wrote beside it.
    if (s.type === 'recording') for (const k of ['steps', 'pointer']) {
      const f = typeof s0[k] === 'string' && resolveFile(s0[k], dir);
      if (!f || !fs.existsSync(f)) { err(where, `file not found: ${s0[k]}`); continue; }
      s[k] = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (k === 'steps') s.steps.steps = s.steps.steps.map((st, j) => { stepErrors(st).forEach((e) => err(`${where} step ${j + 1}`, e)); return { ...st, lines: stepLines(st.text) }; });
    }
    // Covers are impeccable (print/image-rules.mjs): print and deck covers fail a video frame. Social
    // covers warn, because real footage is often the only proof a post has: replace it when a photograph or still exists.
    if (i === 0 && r.kind !== 'video') for (const k of ['src', 'bgSrc']) if (typeof s0[k] === 'string' && isVideoFrame(resolveFile(s0[k], dir)))
      warn(where, `cover: ${path.basename(s0[k])} is a video frame; covers should be a photograph, a screen capture or a still made for them`);
    // Marks baked into footage (catalog "burnedIn": its captions, a logo mark) go to the stage, which fails a frame that shows them.
    if (s.type === 'clip' && typeof s0.src === 'string') { const a = cat.get(resolveFile(s0.src, dir)); if (a?.burnedIn && a.size) Object.assign(s, { burnedIn: a.burnedIn, srcSize: a.size }); }
    if (s.layers) s.layers = s.layers.map((l) => ({ ...l, src: asset(where, l.src, { ...s0, ...l }) }));
    // Sound: "voice": true plays a clip's own sound; { "src", "in" } plays another file's sound from "in" for the shot's length.
    if (s.voice && typeof s.voice === 'object') { if (typeof s.voice.src === 'string') s.voice = { ...s.voice, src: asset(where, s.voice.src, s0) }; if (typeof s.voice.in !== 'number') err(where, '"voice" needs "in", the second the sound starts in its file'); }
    if (s.dissolve && (i === 0 || s.wipe)) err(where, '"dissolve" joins a shot to the one before it in the same scene: never on the first shot, never with "wipe"');
    if (s.voice === true && s.type !== 'clip') err(where, '"voice": true takes a clip\'s own sound; on other shots give { "src", "in" }');
    for (const k of ['a', 'b']) if (s[k]?.src) s[k] = { ...s[k], src: asset(where, s[k].src, { ...s0, ...s[k] }) };
    if (s.formats) s.formats = Object.fromEntries(Object.entries(s.formats).map(([f, o]) => [f, o.src ? { ...o, src: asset(`${where} ${f}`, o.src, s0) } : o]));
    if (s.rows) s.rows = s.rows.map((row) => ({ ...row, icon: row.icon && icon(where, row.icon) }));
    if (s.items) s.items = s.items.map((row, j) => ({ ...row, icon: row.icon && icon(where, row.icon), ...(typeof row.src === 'string' ? { src: asset(`${where} item ${j + 1}`, row.src, { ...s0, ...row }) } : {}) }));
    if (s.type === 'end') s.url ??= BRANDS[r.brand]?.url;
    // A drawing that names its parts (figures/export.mjs writes <name>.json beside it) gets its frame from the part,
    // so the frame always sits on what the drawing really shows, never loosely around it.
    if (s.inspect && typeof s.src === 'string' && s.src.endsWith('.svg')) {
      const side = s.src.replace('file://', '').replace(/-(light|dark)\.svg$/, '.json');
      const named = side.endsWith('.json') && fs.existsSync(side) ? JSON.parse(fs.readFileSync(side, 'utf8')) : null;
      const names = Object.keys(named?.targets || {});
      if (names.length && !s.inspect.target) err(where, `this drawing names its parts (${names.join(', ')}): set "inspect": { "target": "…" } so the frame sits on the part`);
      else if (names.length && !named.targets[s.inspect.target]) err(where, `the drawing has no part "${s.inspect.target}"; it has ${names.join(', ')}`);
      else if (names.length) {
        const t = named.targets[s.inspect.target], px = Math.max(t.w * 0.3, 0.8), py = Math.max(t.h * 0.3, 0.8);
        s.imageSize = named.imageSize;
        s.inspect = { ...s.inspect, space: 'image', x: t.x - px, y: t.y - py, w: t.w + px * 2, h: t.h + py * 2, subject: t, parts: names.filter((n) => n !== s.inspect.target).map((n) => named.targets[n]) };
      }
    }
    // Proof, not promise: anything that shows a reading, a verdict or a figure says where it comes from.
    if ((s.inspect || s.detect || s.type === 'pair' || s.type === 'stat') && !['system', 'illustration', 'render', ...(s.type === 'stat' ? ['case'] : [])].includes(s.evidence))
      err(where, `"evidence" is needed: "system" (exported by the system on a real run)${s.type === 'stat' ? ', "case" (published in an approved case study, with "source")' : ''}, "illustration" (labelled as such) or "render" (a 3D render from real dimensions)`);
    // A figure from a case study says where it was published, so anyone can check it.
    if (s.type === 'stat' && s.evidence === 'case' && !s.source) err(where, '"evidence": "case" needs "source": the published case study (where and when)');
    // The overlay kit (Imagery, Detection overlays): labels are words that say what was expected, the verdict is OK or NOK
    // with a short count or reason, a count matches the boxes drawn, and readings come only from the system.
    const marks = [s.inspect, s.a?.inspect, s.b?.inspect].filter(Boolean), boxes = (s.detect?.length || 0) + (s.inspect ? 1 : 0);
    for (const q of marks) {
      if (q.label && /[_]/.test(q.label)) err(where, `the label "${q.label}" is a code, not a word: write what was expected ("cap", "tapón", "10 tablets")`);
      if (q.verdict && !['OK', 'NOK'].includes(q.verdict.text)) err(where, `the verdict reads "OK" or "NOK" with a short reason in "detail" (it reads "${q.verdict.text}")`);
      if (q.value && s.evidence !== 'system') err(where, `"${q.value}" is a reading: readings come only from the system ("evidence": "system"); remove it from an illustration`);
      const n = String(q.verdict?.detail || '').match(/^(\d+)\s*\/\s*(\d+)$/);
      if (n && s.inspect === q && +n[2] !== boxes) err(where, `the verdict counts ${n[2]} items but ${boxes} ${boxes === 1 ? 'box is' : 'boxes are'} drawn`);
    }
    (s.detect || []).forEach((d) => {
      if (d.label && /_/.test(d.label)) err(where, `the label "${d.label}" is a code, not a word`);
      if (d.conf !== undefined && s.evidence !== 'system') err(where, `confidence ${d.conf} on "${d.label}": confidences come only from the system; remove it from an illustration`);
    });
    if (s.type === 'stat' && s.basis && !BASIS.includes(s.basis)) err(where, `"basis" is one of ${BASIS.join(', ')}`);
    if (s.type === 'stat' && s.evidence === 'illustration' && s.basis !== 'illustrative') err(where, 'an illustration carries an illustrative figure only ("basis": "illustrative")');
    if (s.type === 'stat' && (s.value === null || (typeof s.value === 'string' && !s.value.trim()) || !Number.isFinite(Number(s.value))))
      err(where, 'replace the figure placeholder with a verified number, its source and conditions');
    if (s0.mediaRequired && (!s0.src || s0.slot)) err(where, 'image or footage source is required: add the source and remove the draft slot before export');
    else if (s.slot) warn(where, 'footage or image slot is still a draft: replace it with the approved material before publishing');
    if (s.type === 'list' && s.items && (s.items.length < 2 || s.items.length > 5)) err(where, 'a list has 2 to 5 items');
    if (s.type === 'quote' && /\[|pending|pendiente|pendent|tbd/i.test(s.permission || '')) err(where, '"permission" must say who approved the quote in writing, and when');
    if (s.type === 'quote' && s.portrait && !s.consent) err(where, 'a portrait needs "consent": who gave it and when');
    if (r.kind === 'video' && s.seconds && s.seconds < 1.5 && !['end', 'claims'].includes(s.type)) warn(where, 'hold every shot at least 2 s (1.5 s in event recaps)');
    if (s.type === 'still' && !s.src && !s.slot && !s.layers && !(r.kind === 'video' && s.videoPattern)) err(where, 'needs "src" or a "slot" describing what to shoot');
    // Illustration: drawings explain how something works; photographs and footage prove it. A drawing never stands in
    // for footage, and it is shown whole (its column filled, never cropped into a fragment).
    const drawing = (v) => typeof v === 'string' && /\/illustrations\/|\/figures\//.test(v);
    // The isometric illustrations are paused; posts use real photographs and screens.
    if ([s0.src, s0.a?.src, s0.b?.src].some(drawing)) err(where, 'the isometric illustrations are paused: use a real photograph or screen from the library');
    if (r.kind === 'video' && [s0.src, ...(s0.layers || []).map((l) => l.src)].some(drawing))
      err(where, 'an illustration never stands in for footage: use real footage, or leave a "slot" that says what to film');
    if (drawing(s0.src) && r.kind !== 'video' && (s0.scale || 1) > 1.25)
      err(where, `the drawing is enlarged ${s0.scale}×, which crops it into a fragment: show it whole (scale up to 1.25) and let a photograph show the detail`);
    return s;
  });

  // Music: from the first frame, under any voice, levelled with it (render.mjs). A single shot (an opening, an end card,
  // a lower third) is a part for an edit and stays silent.
  const music = raw.music ?? (r.kind === 'video' && r.brand === 'rosepetal' && r.shots.length > 1 ? { src: ROSEPETAL_TRACK } : null);
  if (music && (r.kind !== 'video' || typeof music.src !== 'string')) err('music', 'video only: { "src": a track from Downloads, "in": its first second, "fade": seconds over the end card }');
  else if (music) r.music = { in: 0, fade: 2.5, ...music, src: asset('music', music.src) };
  if (r.shots.some((s) => s.type === 'recording') && !r.music) err('music', 'a tutorial always carries a track of the Rosepetal soundtrack from Downloads');
  if (r.captionsFrom && !fs.existsSync(resolveFile(r.captionsFrom, dir))) err('captionsFrom', `file not found: ${r.captionsFrom}`);
  if (r.kind === 'video' && r.shots.some((s) => s.voice) && !r.captions?.length && !r.captionsFrom) err('captions', 'a film with speech needs captions: "captions", or "captionsFrom" with the word timings (Video, Captions)');
  const copy = lintCopy(raw);
  errors.push(...copy.errors); warnings.push(...copy.warnings);
  r.icons = { 'arrow-right': icon('icons', 'arrow-right') };
  r.brandName = BRANDS[r.brand]?.name;
  return { recipe: r, errors, warnings, assets };
}
