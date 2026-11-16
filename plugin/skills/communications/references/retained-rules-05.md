# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-8f032c2a5248

<!-- AIS-8f032c2a5248 -->
warnings.push(`${where}: a figure; give it its metric, baseline, conditions and date (a stat slide with "note" and "basis"), or remove it`);

Source: plugin/engine/copy.mjs:114.

## AIS-46866e9fb221

<!-- AIS-46866e9fb221 -->
if (r.copy && r.kind !== 'video' && !CTAS[lang].some((c) => r.copy.includes(c))) warnings.push(`copy: end the post text with one approved call to action (${CTAS[lang].slice(0, 3).join(' / ')}…)`);

Source: plugin/engine/copy.mjs:116.

## AIS-f3042af374e0

<!-- AIS-f3042af374e0 -->
const plain = checkText(texts.map(({ where, t, head }) => ({ where, text: t, role: head ? 'head' : 'body' })), { lang: r.lang });

Source: plugin/engine/copy.mjs:119.

## AIS-902f65c2b446

<!-- AIS-902f65c2b446 -->
const said = (m) => { const [where, phrase] = [m.split(': "')[0], (m.match(/"([^"]+)"/) || [])[1]?.toLowerCase()]; return [...errors, ...warnings].some((x) => x.startsWith(where) && phrase && x.toLowerCase().includes(`"${phrase}"`)); };

Source: plugin/engine/copy.mjs:120.

## AIS-97c62aacc52e

<!-- AIS-97c62aacc52e -->
errors.push(...plain.errors.filter((m) => !said(m))); warnings.push(...plain.warnings.filter((m) => !said(m)));

Source: plugin/engine/copy.mjs:121.

## AIS-d334a9ff872f

<!-- AIS-d334a9ff872f -->
const W = '(?<![\\p{L}\\d])', E = '(?![\\p{L}\\d])';

Source: plugin/engine/text-check.mjs:12.

## AIS-3e2e25ec8ba2

<!-- AIS-3e2e25ec8ba2 -->
const re = (s) => new RegExp(W + '(?:' + s + ')' + E, 'giu');

Source: plugin/engine/text-check.mjs:13.

## AIS-7b9b64127c7b

<!-- AIS-7b9b64127c7b -->
const DELETE = 'delete it: the layout shows the way and the call to action names the destination';

Source: plugin/engine/text-check.mjs:14.

## AIS-f782c2e1b30c

<!-- AIS-f782c2e1b30c -->
const PLAIN = 'say the plain fact or the verb (cut, find, check) instead';

Source: plugin/engine/text-check.mjs:15.

## AIS-90f83cff02ee

<!-- AIS-90f83cff02ee -->
const POINT = 'start with the point; no opener about the world';

Source: plugin/engine/text-check.mjs:16.

## AIS-b39f8508058f

<!-- AIS-b39f8508058f -->
const STOP = 'stop when the point is made; no closing summary';

Source: plugin/engine/text-check.mjs:17.

## AIS-406dbe278ae2

<!-- AIS-406dbe278ae2 -->
const PHRASES = {

Source: plugin/engine/text-check.mjs:20.

## AIS-8111d60afd50

<!-- AIS-8111d60afd50 -->
const FILLERS = {

Source: plugin/engine/text-check.mjs:67.

## AIS-7cc109f2111a

<!-- AIS-7cc109f2111a -->
const AND = { en: 'and', es: '[ye]', ca: 'i', pt: 'e', fr: 'et' };

Source: plugin/engine/text-check.mjs:74.

## AIS-df33954b30ea

<!-- AIS-df33954b30ea -->
const SLOGAN = /(?:^|[\s"“«])((?:\p{Lu}[\p{Ll}’'-]+(?: [\p{Ll}’'-]+)?\.\s+){2}\p{Lu}[\p{Ll}’'-]+(?: [\p{Ll}’'-]+)?\.)(?=\s|$|["”»])/gu;

Source: plugin/engine/text-check.mjs:76.

## AIS-ef5123e5582b

<!-- AIS-ef5123e5582b -->
const READER_CHOICE = /would you reject|rechazar[ií]as|rebutjaries|rejeitaria|rejetteriez/i;

Source: plugin/engine/text-check.mjs:78.

## AIS-c7018fefb10d

<!-- AIS-c7018fefb10d -->
const EXTRA_FIELDS = ['eyebrow', 'kicker', 'overline', 'tagline', 'subtitle', 'subhead', 'strapline', 'slogan'];

Source: plugin/engine/text-check.mjs:79.

## AIS-cb1bd601617a

<!-- AIS-cb1bd601617a -->
const clip = (t, i, n) => t.slice(Math.max(0, i - 20), i + n + 20).replace(/\s+/g, ' ').trim();

Source: plugin/engine/text-check.mjs:81.

## AIS-1c409552aad9

<!-- AIS-1c409552aad9 -->
const langs = PHRASES[lang] ? [lang] : Object.keys(PHRASES);

Source: plugin/engine/text-check.mjs:85.

## AIS-61af26f055db

<!-- AIS-61af26f055db -->
const errors = [], warnings = [];

Source: plugin/engine/text-check.mjs:86.

## AIS-8bb1ce8398ad

<!-- AIS-8bb1ce8398ad -->
const push = (level, msg) => { const list = level === 'error' ? errors : warnings; if (!list.includes(msg)) list.push(msg); };

Source: plugin/engine/text-check.mjs:87.

## AIS-1d4330cf8379

<!-- AIS-1d4330cf8379 -->
const t = String(text ?? '').replace(/\s+/g, ' ').trim();

Source: plugin/engine/text-check.mjs:89.

## AIS-579db841a537

<!-- AIS-579db841a537 -->
if (/(?<![lL])\u00b7|\u00b7(?![lL])/u.test(t)) push('error', `${where}: middle-dot separator; use separate elements, a new line or a comma. Only Catalan l·l is allowed`);

Source: plugin/engine/text-check.mjs:91.

## AIS-da89a15774f9

<!-- AIS-da89a15774f9 -->
const three = new RegExp(`(?<![\\p{L}])(${FILLERS[l]}), (${FILLERS[l]}),? ${AND[l]} (${FILLERS[l]})(?![\\p{L}])`, 'giu');

Source: plugin/engine/text-check.mjs:94.

## AIS-a822f4fe4381

<!-- AIS-a822f4fe4381 -->
if (/[\p{L}\d]\s*—|—\s*[\p{L}\d]/u.test(t)) push('warn', `${where}: "${clip(t, t.indexOf('—'), 1)}" uses an em dash; a comma, a colon or a full stop reads plainer`);

Source: plugin/engine/text-check.mjs:98.

## AIS-87ffdc90c1ce

<!-- AIS-87ffdc90c1ce -->
if (/[“”"]/.test(t.replace(/«[^«»]*»/g, ''))) push('error', `${where}: "${clip(t, t.search(/[“”"]/), 1)}" uses “ ” or straight quotes; quote with «…» (and “…” inside them)`);

Source: plugin/engine/text-check.mjs:100.

## AIS-ece4a45fb0f5

<!-- AIS-ece4a45fb0f5 -->
if (role !== 'head') for (const m of t.matchAll(/(?:^|[.!?:]\s+)(¿?[^.!?:¿]{3,140}\?)(?=\s|$)/gu)) if (!READER_CHOICE.test(m[1])) push('warn', `${where}: "${m[1].trim()}" is a rhetorical question in body copy; state the answer`);

Source: plugin/engine/text-check.mjs:102.

## AIS-e8e702a85609

<!-- AIS-e8e702a85609 -->
const decode = (s) => s.replace(/&middot;|&#183;|&#x0*b7;/gi, '\u00b7').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, '’').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&shy;/g, '');

Source: plugin/engine/text-check.mjs:107.

## AIS-e93e2f9206e0

<!-- AIS-e93e2f9206e0 -->
const body = html.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');

Source: plugin/engine/text-check.mjs:111.

## AIS-1a42b53e2a2e

<!-- AIS-1a42b53e2a2e -->
const items = [];

Source: plugin/engine/text-check.mjs:112.

## AIS-539633e8daba

<!-- AIS-539633e8daba -->
const text = decode(m[3].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).trim();

Source: plugin/engine/text-check.mjs:114.

## AIS-30eae659b346

<!-- AIS-30eae659b346 -->
if (!text) continue;

Source: plugin/engine/text-check.mjs:115.

## AIS-72258b8a27b0

<!-- AIS-72258b8a27b0 -->
const cls = (m[2].match(/class="([^"]*)"/) || [])[1] || '';

Source: plugin/engine/text-check.mjs:116.

## AIS-bf66e7b868d8

<!-- AIS-bf66e7b868d8 -->
items.push({ where: `${m[1].toLowerCase()}${cls ? '.' + cls.split(/\s+/)[0] : ''}`, text, role: /^h[1-3]$/i.test(m[1]) ? 'head' : 'body', cls });

Source: plugin/engine/text-check.mjs:117.

## AIS-74bd63787375

<!-- AIS-74bd63787375 -->
for (const m of body.matchAll(/\balt="([^"]+)"/g)) items.push({ where: 'alt text', text: decode(m[1]), role: 'head' });

Source: plugin/engine/text-check.mjs:119.

## AIS-8ca7c0aa7dcc

<!-- AIS-8ca7c0aa7dcc -->
const items = [], extras = [];

Source: plugin/engine/text-check.mjs:125.

## AIS-f1e13702b093

<!-- AIS-f1e13702b093 -->
const where = `${file} slide ${i + 1}`;

Source: plugin/engine/text-check.mjs:127.

## AIS-7d9889999601

<!-- AIS-7d9889999601 -->
for (const k of EXTRA_FIELDS) if (typeof s[k] === 'string' && s[k]) extras.push({ where, field: k, text: s[k], nested: false });

Source: plugin/engine/text-check.mjs:128.

## AIS-55c718e57609

<!-- AIS-55c718e57609 -->
const walk = (x, key, nested) => {

Source: plugin/engine/text-check.mjs:129.

## AIS-ec15b4dcaf3d

<!-- AIS-ec15b4dcaf3d -->
if (typeof x === 'string') {

Source: plugin/engine/text-check.mjs:130.

## AIS-449577201741

<!-- AIS-449577201741 -->
if (['src', 'image', 'include', 'file', 'layout', 'icon', 'pos', 'fit', 'bg', 'tone', 'ground', 'variant', 'notes'].includes(key) || /^[\w./-]+\.(?:png|jpe?g|webp|svg)$/i.test(x)) return;

Source: plugin/engine/text-check.mjs:131.

## AIS-4b1b84b330a2

<!-- AIS-4b1b84b330a2 -->
if (nested && EXTRA_FIELDS.includes(key)) extras.push({ where, field: key, text: x, nested: true });

Source: plugin/engine/text-check.mjs:132.

## AIS-39fb699ad68e

<!-- AIS-39fb699ad68e -->
if (!EXTRA_FIELDS.includes(key) || nested) items.push({ where: `${where} ${key}`, text: x, role: ['title', 'name', 'k', 'v', 'label', 'value', 'date'].includes(key) ? 'head' : 'body' });

Source: plugin/engine/text-check.mjs:133.

## AIS-45ebd8dd3e31

<!-- AIS-45ebd8dd3e31 -->
} else if (Array.isArray(x)) x.forEach((v) => walk(v, key, nested));

Source: plugin/engine/text-check.mjs:134.

## AIS-00c270260852

<!-- AIS-00c270260852 -->
else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) walk(v, k, true);

Source: plugin/engine/text-check.mjs:135.

## AIS-a455a234150a

<!-- AIS-a455a234150a -->
const langOf = (file, fallback) => (path.basename(file).match(/[.-](es|en|ca|pt|fr)\.(?:html|json|txt|md)$/) || [])[1] || fallback;

Source: plugin/engine/text-check.mjs:142.

## AIS-9cef020e450e

<!-- AIS-9cef020e450e -->
const raw = fs.readFileSync(file, 'utf8');

Source: plugin/engine/text-check.mjs:146.

## AIS-78a2742aa8ef

<!-- AIS-78a2742aa8ef -->
const l = lang || langOf(file, 'es');

Source: plugin/engine/text-check.mjs:147.

## AIS-ae2441025173

<!-- AIS-ae2441025173 -->
const add = (r) => { errors.push(...r.errors); warnings.push(...r.warnings); };

Source: plugin/engine/text-check.mjs:149.

## AIS-0683be102102

<!-- AIS-0683be102102 -->
if (/\.html?$/i.test(file)) add(checkText(textsFromHtml(raw), { lang: l }));

Source: plugin/engine/text-check.mjs:150.

## AIS-1b21aa13d66b

<!-- AIS-1b21aa13d66b -->
else if (/\.json$/i.test(file)) {

Source: plugin/engine/text-check.mjs:151.

## AIS-f96360165a39

<!-- AIS-f96360165a39 -->
const data = JSON.parse(raw);

Source: plugin/engine/text-check.mjs:152.

## AIS-19db1834bbc8

<!-- AIS-19db1834bbc8 -->
if (Array.isArray(data.slides) && !data.shots) {

Source: plugin/engine/text-check.mjs:153.

## AIS-e5f4b41caa3a

<!-- AIS-e5f4b41caa3a -->
const slides = data.slides.flatMap((s) => s.include ? (JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), s.include), 'utf8')).slides || []) : [s]);

Source: plugin/engine/text-check.mjs:154.

## AIS-1257ad82384a

<!-- AIS-1257ad82384a -->
add(checkText(items, { lang: l }));

Source: plugin/engine/text-check.mjs:156.

## AIS-5231aae1395a

<!-- AIS-5231aae1395a -->
for (const x of extras) warnings.push(`${x.where} ${x.field}: "${x.text}" is a line above a ${x.nested ? 'column title' : 'slide headline'}; ${x.nested ? 'fold it into the title or the text' : 'the layouts do not draw it: delete it'}`);

Source: plugin/engine/text-check.mjs:159.

## AIS-da5e1d82a6e7

<!-- AIS-da5e1d82a6e7 -->
} else if (Array.isArray(data.shots)) {

Source: plugin/engine/text-check.mjs:160.

## AIS-afe1f507f24a

<!-- AIS-afe1f507f24a -->
data.shots.forEach((s, i) => { for (const [k, v] of Object.entries(s)) if (typeof v === 'string' && !['type', 'src', 'slot', 'url', 'fit', 'pos', 'ground'].includes(k)) items.push({ where: `shot ${i + 1} ${k}`, text: v.replace(/\|/g, ' '), role: ['headline', 'title', 'quote', 'event', 'alt'].includes(k) ? 'head' : 'body' }); });

Source: plugin/engine/text-check.mjs:162.

## AIS-6013252cdc04

<!-- AIS-6013252cdc04 -->
if (data.copy) items.push({ where: 'copy', text: data.copy, role: 'body' });

Source: plugin/engine/text-check.mjs:163.

## AIS-802ef2d83547

<!-- AIS-802ef2d83547 -->
add(checkText(items, { lang: data.lang || l }));

Source: plugin/engine/text-check.mjs:164.

## AIS-3c34c08e5287

<!-- AIS-3c34c08e5287 -->
} else add(checkText(dataItems(data), { lang: data.lang || l }));

Source: plugin/engine/text-check.mjs:165.

## AIS-74aec1cd0b6c

<!-- AIS-74aec1cd0b6c -->
} else add(checkText(raw.split(/\n\s*\n/).map((p, i) => ({ where: `paragraph ${i + 1}`, text: p, role: /^#/.test(p) ? 'head' : 'body' })), { lang: l }));

Source: plugin/engine/text-check.mjs:166.

## AIS-a6844b38cb56

<!-- AIS-a6844b38cb56 -->
const walk = (x, key) => {

Source: plugin/engine/text-check.mjs:173.

## AIS-edad5fbe52bf

<!-- AIS-edad5fbe52bf -->
if (typeof x === 'string') { if (!/^[\w./-]+\.(?:png|jpe?g|webp|svg|html|pdf)$/i.test(x) && /\p{L}{3}/u.test(x)) items.push({ where: `${where} ${key}`, text: x, role: /name|title|head/i.test(key) ? 'head' : 'body' }); }

Source: plugin/engine/text-check.mjs:174.

## AIS-ee0b424b212c

<!-- AIS-ee0b424b212c -->
else if (Array.isArray(x)) x.forEach((v) => walk(v, key));

Source: plugin/engine/text-check.mjs:175.

## AIS-808eb8f974b7

<!-- AIS-808eb8f974b7 -->
else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) walk(v, k);

Source: plugin/engine/text-check.mjs:176.

## AIS-ab0f251d3976

<!-- AIS-ab0f251d3976 -->
const t = raw.kind === 'technical-sheet' ? checkText(dataItems(raw.data, 'sheet'), { lang: raw.lang })

Source: plugin/engine/text-check.mjs:185.

## AIS-245f2ff6e64a

<!-- AIS-245f2ff6e64a -->
: raw.entry ? checkFile(path.join(dir, raw.entry), { lang: raw.lang }) : null;

Source: plugin/engine/text-check.mjs:186.

## AIS-35fc4efd414e

<!-- AIS-35fc4efd414e -->
if (!t || (!t.errors.length && !t.warnings.length)) return result;

Source: plugin/engine/text-check.mjs:187.

## AIS-2d65bad8df85

<!-- AIS-2d65bad8df85 -->
const errors = [...(result.errors || []), ...t.errors], warnings = [...(result.warnings || []), ...t.warnings];

Source: plugin/engine/text-check.mjs:188.

## AIS-1958803dde3a

<!-- AIS-1958803dde3a -->
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {

Source: plugin/engine/text-check.mjs:193.

## AIS-32dcd12db5a2

<!-- AIS-32dcd12db5a2 -->
const args = process.argv.slice(2), li = args.indexOf('--lang'), lang = li >= 0 ? args.splice(li, 2)[1] : undefined;

Source: plugin/engine/text-check.mjs:194.

## AIS-d9b97d03874c

<!-- AIS-d9b97d03874c -->
if (!args.length) { console.error('Usage: node engine/text-check.mjs <file> [more] [--lang es] (- reads stdin)'); process.exit(2); }

Source: plugin/engine/text-check.mjs:195.

## AIS-e81f6613872a

<!-- AIS-e81f6613872a -->
const r = f === '-' ? (() => { const t = checkText(fs.readFileSync(0, 'utf8').split(/\n\s*\n/).map((p, i) => ({ where: `paragraph ${i + 1}`, text: p, role: 'body' })), { lang: lang || 'en' }); return { valid: !t.errors.length, ...t }; })() : checkFile(f, { lang });

Source: plugin/engine/text-check.mjs:198.

## AIS-afd01682275a

<!-- AIS-afd01682275a -->
if (!r.valid) failed++; else console.log(r.warnings.length ? ' No errors; review the warnings.' : ' Passed.');

Source: plugin/engine/text-check.mjs:202.
