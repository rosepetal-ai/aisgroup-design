// Brand language check: the conventions on the guide's Localisation page that spell checkers and
// LanguageTool do not enforce. Reads built HTML pages and reports each hit with its context.
// node language-check.mjs <folder of built pages, e.g. site/dist>
// The language of each page comes from <html lang>. Code, pre, kbd and URLs are skipped.
import fs from 'node:fs';
import path from 'node:path';

const NAMES = [/\b(?:AIS VISION|Ais Vision|AIS vision|RosePetal|Rev 360|REV360|AIS Automation)\b|\bKariko\b/g, 'Brand or product name: see Voice › Names'];
const PUNCT = [/\p{L} [,.:;](?!\d)/gu, 'No space before , . : ;'];
const DEGREE = [/\dº/g, 'Degree sign is °, not º'];
const RULES = {
  es: [
    [/\d%/g, 'Space before % (95 %)'],
    [/\b\d{1,3}\.\d{3}\b(?!\.\d)/g, 'No point in thousands (1285, 12 850)'],
    [/(?:^|[.!?]\s+)[A-ZÁÉÍÓÚÑ][^¿?.!]{2,80}\?/g, 'Opening ¿ missing'],
    [/'/g, 'Straight apostrophe or quote: use ’ or «»'],
    [/\b(?:datasets?)\b/g, 'Anglicism: conjunto de datos (unless it is a label on screen)'],
    [/\b(?:costos|computadora|monitoreo)\b/gi, 'Spain Spanish: costes, ordenador, supervisión'],
    [/\bAI\b/g, 'Write IA in Spanish'],
    NAMES, PUNCT, DEGREE,
  ],
  ca: [
    [/\d%/g, 'Space before % (95 %)'],
    [/\b\d{1,3}\.\d{3}\b(?!\.\d)/g, 'No point in thousands (1285, 12 850)'],
    [/\b\w*l[.\-]l\w*\b/gi, 'Punt volat: l·l'],
    [/\w'\w/g, 'Typographic apostrophe: ’'],
    [/(?<!\p{L})vostè(?!\p{L})/giu, 'Formal address is vós'],
    [/\b(?:datasets?)\b/g, 'Anglicism: conjunt de dades (unless it is a label on screen)'],
    [/\b(?:en base a|degut a|a nivell de|llevar a terme)\b/gi, 'Calque: a partir de, a causa de, pel que fa a, dur a terme'],
    [/\bAI\b/g, 'Write IA in Catalan'],
    NAMES, PUNCT, DEGREE,
  ],
  en: [
    [/\b\w+iz(?:e|es|ed|ing|ation|ations)\b/g, 'British spelling: -ise'],
    [/\b(?:color|center|behavior|labeling|modeling)\b/gi, 'British spelling'],
    [/\b(?:can't|won't|don't|isn't|aren't|doesn't|didn't)\b/gi, 'Write it out: cannot, will not…'],
    [/\bartificial vision\b/gi, 'Machine vision'],
    [/\d %/g, 'No space before % in English'],
    NAMES, PUNCT, DEGREE,
  ],
};
// Words that look like hits but are correct: names, code and quoted labels.
const ALLOW = /^(?:sizes?|sized|resize[sd]?|prizes?|seize[sd]?|capsize)$/i;

// Recorded false positives: page path fragment → phrases quoted there on purpose (language-check.allow.json).
const allow = JSON.parse(fs.readFileSync(new URL('./language-check.allow.json', import.meta.url), 'utf8'));
const allowed = (file, snippet) => Object.entries(allow).some(([page, phrases]) => page !== '_why' && file.replace(/\\/g, '/').includes(page) && phrases.some((ph) => snippet.includes(ph)));

const dir = process.argv[2];
if (!dir) { console.error('Usage: node language-check.mjs <folder of built pages>'); process.exit(2); }
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) files.push(p);
});
walk(dir);

const text = (html) => html
  .replace(/<(script|style|pre|svg)[\s\S]*?<\/\1>/gi, ' ')
  // Code stands in as a word, so "blue `#10254C`;" does not read as "blue ;".
  .replace(/<(code|kbd)[^>]*>[\s\S]*?<\/\1>/gi, '§')
  // Inline tags join their text; block tags separate it.
  .replace(/<\/?(?:a|strong|em|b|i|span|abbr|sup|sub|mark|small|q)\b[^>]*>/gi, '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"')
  .replace(/https?:\/\/\S+/g, ' ').replace(/[ \t]+/g, ' ');

let total = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const lang = (html.match(/<html[^>]*lang="([a-z]{2})/) || [])[1];
  if (!RULES[lang]) continue;
  // The Localisation pages quote the wrong forms on purpose, as examples.
  if (/\/localisation\//.test(f.replace(/\\/g, '/'))) continue;
  // Passages marked in another language are checked by that language's rules, not this page's.
  const body = html.slice(html.search(/<body[\s>]/));
  const own = text(body.replace(new RegExp(`<(\\w+)[^>]*\\slang="(?!${lang})[a-z]{2}[^"]*"[^>]*>[\\s\\S]*?<\\/\\1>`, 'g'), ' '));
  const hits = [];
  for (const [re, msg] of RULES[lang]) {
    for (const m of own.matchAll(re)) {
      if (ALLOW.test(m[0])) continue;
      if (allowed(f, own.slice(Math.max(0, m.index - 12), m.index + m[0].length + 12))) continue;
      hits.push(`  ${msg}: «${own.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).trim()}»`);
    }
  }
  if (hits.length) { console.log(path.relative(dir, f) + ` (${lang})`); hits.forEach((h) => console.log(h)); total += hits.length; }
}
console.log(total ? `${total} to fix or record as false positives.` : 'No brand language issues.');
process.exit(total ? 1 : 0);
