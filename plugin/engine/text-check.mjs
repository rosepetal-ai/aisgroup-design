#!/usr/bin/env node
// The text check: the main rule (Keep it simple) and the writing skill on every word a piece carries, in every kind
// (posts and carousels, print HTML, decks, technical sheets, stationery). Deterministic lists and patterns per
// language (es, en, ca, pt, fr). Errors block validate and export; warnings name the exact phrase and the fix.
//   node engine/text-check.mjs <piece.html | content.<lang>.json | recipe.json | draft.txt> [--lang es]
//   echo "text" | node engine/text-check.mjs --lang es -
// Lists follow the guide's Voice page (Writing that reads as ours) and skills/writing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const W = '(?<![\\p{L}\\d])', E = '(?![\\p{L}\\d])';
const re = (s) => new RegExp(W + '(?:' + s + ')' + E, 'giu');
const DELETE = 'delete it: the layout shows the way and the call to action names the destination';
const PLAIN = 'say the plain fact or the verb (cut, find, check) instead';
const POINT = 'start with the point; no opener about the world';
const STOP = 'stop when the point is made; no closing summary';

// [pattern, level, what it is, fix]. Errors are phrases nobody at AIS would write; warnings need a person's judgement.
const PHRASES = {
  en: [
    [re("in today[’']s (?:fast[- ]paced |ever[- ](?:changing|evolving) |digital |competitive )?(?:world|landscape|market|environment|industry)|in (?:the|an) (?:age|era) of|in an (?:increasingly|ever)[- ]\\p{L}+ (?:world|market)"), 'error', 'opener about the world', POINT],
    [re("unlock(?:s|ed|ing)?|elevat(?:e|es|ing)|seamless(?:ly)?|cutting[- ]edge|revolutioni[sz](?:e|es|ed|ing)|game[- ]chang(?:er|ers|ing)|world[- ]class|best[- ]in[- ]class|next[- ]level|supercharg\\p{L}*|unleash\\p{L}*|delv(?:e|es|ing)|tapestry|empower\\p{L}*|leverag(?:e|es|ing)|groundbreaking|reimagin\\p{L}*|redefin(?:e|es|ing)"), 'error', 'hype word', PLAIN],
    [re("click(?: here| on| the)?|learn more(?: about)?|discover how|find out (?:more|how)|read more|scroll (?:down|up)|tap here"), 'error', 'helper text', DELETE],
    [re("let[’']s (?:dive|explore|take a look)|dive (?:into|deeper)|look no further|whether you[’']re|it[’']s not just"), 'error', 'filler phrase', PLAIN],
    [/(?:^|[.!?]\s+)(?:in (?:short|summary|conclusion)|to (?:sum up|summari[sz]e)|all in all|at the end of the day)\b/giu, 'error', 'closing summary', STOP],
    [re("swipe|see below|as shown (?:below|above)"), 'warn', 'helper text', DELETE],
    [re("innovative|powerful|transformative|streamlin\\p{L}*|holistic|synerg\\p{L}*|comprehensive|more than just"), 'warn', 'adjective without proof', 'keep it only with the fact that proves it'],
    [/\bnot only\b[^.!?]{0,80}\bbut(?: also)?\b/giu, 'warn', '"not only… but also"', 'say the two things as two plain facts'],
  ],
  es: [
    [re("en (?:el|un) mundo (?:actual|de hoy|cada vez más \\p{L}+|tan \\p{L}+|globalizado|competitivo)|en la era (?:de(?:l)?|digital)|en un (?:entorno|mercado) cada vez más \\p{L}+|hoy más que nunca"), 'error', 'opener about the world', POINT],
    [re("desbloque\\p{L}*|eleva(?:r)? (?:tu|tus|su|sus|la|el|al|a otro)|revolucion(?:a|an|ar|amos|ará|ando)|de primer nivel|de clase mundial|(?:al siguiente|a otro|al próximo) nivel|cambia(?:r)? las reglas del juego|sumérgete|adéntrate|potencia (?:tu|tus|su|sus)"), 'error', 'hype word', PLAIN],
    [re("haz clic|haga clic|pulsa aquí|clic aquí|más información sobre|descubr[ea] cómo|descubr[ea] (?:más|todo)|saber más|conoce más|sigue leyendo"), 'error', 'helper text', DELETE],
    [/(?:^|[.!?]\s+)(?:en resumen|en conclusión|en definitiva|en pocas palabras|para resumir|en síntesis)\b/giu, 'error', 'closing summary', STOP],
    [re("desliza|a continuación (?:te )?(?:mostramos|presentamos|encontrarás)|como (?:se )?(?:ve|muestra) (?:abajo|arriba)"), 'warn', 'helper text', DELETE],
    [re("innovador(?:a|es|as)?|potentes?|transformador(?:a|es|as)?|sinergias?|holístic[oa]s?|mucho más que"), 'warn', 'adjective without proof', 'keep it only with the fact that proves it'],
    [/(?<![\p{L}])no solo\b[^.!?]{0,80}\bsino(?: también| que)?\b/giu, 'warn', '«no solo… sino también»', 'say the two things as two plain facts'],
  ],
  ca: [
    [re("en (?:el|un) món (?:actual|d[’']avui|cada cop més \\p{L}+|globalitzat|competitiu)|a l[’']era (?:de|digital)|avui més que mai"), 'error', 'opener about the world', POINT],
    [re("desbloqueg?\\p{L}*|eleva(?:r)? (?:el teu|els teus|la teva|la|el|al)|revolucion(?:a|en|ar|em|arà)|de primer nivell|de classe mundial|(?:al següent|a un altre) nivell|canvia les regles del joc|submergeix-te"), 'error', 'hype word', PLAIN],
    [re("fes clic|feu clic|clica aquí|més informació sobre|descobreix com|descobreix-ne més|saber-ne més|continua llegint"), 'error', 'helper text', DELETE],
    [/(?:^|[.!?]\s+)(?:en resum|en conclusió|en definitiva|en poques paraules|per resumir)\b/giu, 'error', 'closing summary', STOP],
    [re("llisca|a continuació (?:et )?(?:mostrem|presentem|trobaràs)"), 'warn', 'helper text', DELETE],
    [re("innovador(?:a|s|es)?|potents?|transformador(?:a|s|es)?|sinergies?|molt més que"), 'warn', 'adjective without proof', 'keep it only with the fact that proves it'],
    [/(?<![\p{L}])no només\b[^.!?]{0,80}\bsinó(?: també| que)?\b/giu, 'warn', '«no només… sinó també»', 'say the two things as two plain facts'],
  ],
  pt: [
    [re("no mundo (?:atual|de hoje|cada vez mais \\p{L}+)|na era d[aeo]s?|hoje mais do que nunca"), 'error', 'opener about the world', POINT],
    [re("desbloque\\p{L}*|elev(?:e|ar) (?:o seu|a sua|o|a)|revolucion(?:a|am|ar|amos)|de ponta|de classe mundial|(?:ao|para o) próximo nível|mud(?:a|ar) as regras do jogo"), 'error', 'hype word', PLAIN],
    [re("clique (?:aqui|em)|saiba mais|descubra como|descubra mais|continue lendo"), 'error', 'helper text', DELETE],
    [/(?:^|[.!?]\s+)(?:em resumo|em conclusão|em suma|resumindo)\b/giu, 'error', 'closing summary', STOP],
    [re("deslize|inovador(?:a|es|as)?|poderos[oa]s?|muito mais do que"), 'warn', 'claim without proof', 'keep it only with the fact that proves it'],
    [/(?<![\p{L}])não (?:só|apenas)\b[^.!?]{0,80}\bmas(?: também)?\b/giu, 'warn', '«não só… mas também»', 'say the two things as two plain facts'],
  ],
  fr: [
    [re("dans le monde (?:d[’']aujourd[’']hui|actuel)|à l[’']ère d[ue]s?|aujourd[’']hui plus que jamais|dans un (?:monde|marché) en constante évolution"), 'error', 'opener about the world', POINT],
    [re("débloqu\\p{L}*|révolutionn\\p{L}*|de pointe|de classe mondiale|au niveau supérieur|chang(?:e|er) la donne|sans couture"), 'error', 'hype word', PLAIN],
    [re("cliquez(?: ici| sur)?|en savoir plus|découvrez comment|découvrez-en plus|lire la suite"), 'error', 'helper text', DELETE],
    [/(?:^|[.!?]\s+)(?:en résumé|en conclusion|en somme|pour résumer)\b/giu, 'error', 'closing summary', STOP],
    [re("faites défiler|innovant(?:e|s|es)?|puissant(?:e|s|es)?|bien plus qu[e’']"), 'warn', 'claim without proof', 'keep it only with the fact that proves it'],
    [/(?<![\p{L}])non seulement\b[^.!?]{0,80}\bmais(?: aussi| également)?\b/giu, 'warn', '«non seulement… mais aussi»', 'say the two things as two plain facts'],
  ],
};
// Padding in threes: "fast, reliable and precise". Two or more of the three from this list is filler.
const FILLERS = {
  en: 'fast|quick|reliable|efficient|accurate|flexible|scalable|robust|simple|easy|intuitive|precise|powerful|smart|innovative|seamless|secure|cost[- ]effective|sustainable|modern|agile|versatile',
  es: 'rápid[oa]s?|fiables?|eficientes?|precis[oa]s?|flexibles?|escalables?|robust[oa]s?|sencill[oa]s?|fácil(?:es)?|intuitiv[oa]s?|potentes?|inteligentes?|innovador(?:a|es|as)?|segur[oa]s?|sostenibles?|modern[oa]s?|ágil(?:es)?|versátil(?:es)?',
  ca: 'ràpid(?:a|s|es)?|fiables?|eficients?|precís|precis(?:a|os|es)|flexibles?|escalables?|robust(?:a|s|os|es)?|senzill(?:a|s|es)?|fàcils?|intuïtiu(?:s)?|intuïtiv(?:a|es)|potents?|intel·ligents?|innovador(?:a|s|es)?|segur(?:a|s|es)?|sostenibles?|modern(?:a|s|es)?|àgils?|versàtils?',
  pt: 'rápid[oa]s?|fiáve(?:l|is)|eficientes?|precis[oa]s?|flexíve(?:l|is)|escaláve(?:l|is)|robust[oa]s?|simples|fáce(?:l|is)|intuitiv[oa]s?|poderos[oa]s?|inteligentes?|inovador(?:a|es|as)?|segur[oa]s?|sustentáve(?:l|is)|modern[oa]s?|versáte(?:l|is)',
  fr: 'rapides?|fiables?|efficaces?|précis(?:e|es)?|flexibles?|évolutifs?|robustes?|simples?|faciles?|intuitifs?|intuitives?|puissant(?:e|s|es)?|intelligent(?:e|s|es)?|innovant(?:e|s|es)?|sûr(?:e|s|es)?|durables?|modernes?|agiles?|polyvalent(?:e|s|es)?',
};
const AND = { en: 'and', es: '[ye]', ca: 'i', pt: 'e', fr: 'et' };
// Three one- or two-word sentences in a row ("Inspect. Reject. Record."): a slogan, so a tagline.
const SLOGAN = /(?:^|[\s"“«])((?:\p{Lu}[\p{Ll}’'-]+(?: [\p{Ll}’'-]+)?\.\s+){2}\p{Lu}[\p{Ll}’'-]+(?: [\p{Ll}’'-]+)?\.)(?=\s|$|["”»])/gu;
// Text fields that must not exist on a post or a slide: a line above or beside the headline.
const READER_CHOICE = /would you reject|rechazar[ií]as|rebutjaries|rejeitaria|rejetteriez/i;
const EXTRA_FIELDS = ['eyebrow', 'kicker', 'overline', 'tagline', 'subtitle', 'subhead', 'strapline', 'slogan'];

const clip = (t, i, n) => t.slice(Math.max(0, i - 20), i + n + 20).replace(/\s+/g, ' ').trim();

/** items: [{ where, text, role: 'head' | 'body' }]; returns { errors, warnings } as strings with the phrase and the fix. */
export function checkText(items, { lang = 'en' } = {}) {
  const langs = PHRASES[lang] ? [lang] : Object.keys(PHRASES);
  const errors = [], warnings = [];
  const push = (level, msg) => { const list = level === 'error' ? errors : warnings; if (!list.includes(msg)) list.push(msg); };
  for (const { where, text, role } of items) {
    const t = String(text ?? '').replace(/\s+/g, ' ').trim();
    if (!t) continue;
    if (/(?<![lL])\u00b7|\u00b7(?![lL])/u.test(t)) push('error', `${where}: middle-dot separator; use separate elements, a new line or a comma. Only Catalan l·l is allowed`);
    for (const l of langs) {
      for (const [pattern, level, what, fix] of PHRASES[l]) for (const m of t.matchAll(pattern)) push(level, `${where}: "${m[0].replace(/^[.!?]\s+/, '')}" is ${/^[«"]/.test(what) ? '' : /^[aeiou]/.test(what) ? 'an ' : 'a '}${what}; ${fix}`);
      const three = new RegExp(`(?<![\\p{L}])(${FILLERS[l]}), (${FILLERS[l]}),? ${AND[l]} (${FILLERS[l]})(?![\\p{L}])`, 'giu');
      for (const m of t.matchAll(three)) push('warn', `${where}: "${m[0]}" is three adjectives filling a line; keep the one the reader can check, with its figure`);
    }
    for (const m of t.matchAll(SLOGAN)) push('error', `${where}: "${m[1]}" is a three-word slogan, so a tagline; cut it or say the one thing in a sentence`);
    if (/[\p{L}\d]\s*—|—\s*[\p{L}\d]/u.test(t)) push('warn', `${where}: "${clip(t, t.indexOf('—'), 1)}" uses an em dash; a comma, a colon or a full stop reads plainer`);
    // Every language quotes with «…», and “…” only inside them (guide, Localisation); “…” or straight "…" outside « » is wrong.
    if (/[“”"]/.test(t.replace(/«[^«»]*»/g, ''))) push('error', `${where}: "${clip(t, t.search(/[“”"]/), 1)}" uses “ ” or straight quotes; quote with «…» (and “…” inside them)`);
    // The defects carousel asks the reader to choose (which would you reject); that question is the piece, not rhetoric.
    if (role !== 'head') for (const m of t.matchAll(/(?:^|[.!?:]\s+)(¿?[^.!?:¿]{3,140}\?)(?=\s|$)/gu)) if (!READER_CHOICE.test(m[1])) push('warn', `${where}: "${m[1].trim()}" is a rhetorical question in body copy; state the answer`);
  }
  return { errors, warnings };
}

const decode = (s) => s.replace(/&middot;|&#183;|&#x0*b7;/gi, '\u00b7').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, '’').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&shy;/g, '');

/** Print and stationery HTML: one item per block of text; h1–h3 are headlines. Print keeps its small section labels. */
export function textsFromHtml(html) {
  const body = html.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  const items = [];
  for (const m of body.matchAll(/<(h[1-6]|p|li|td|th|figcaption|blockquote|dt|dd|div)\b([^>]*)>((?:(?!<\/?(?:h[1-6]|p|li|td|th|figcaption|blockquote|dt|dd|div|ul|ol|table|section|main|figure)\b)[\s\S])*?)<\/\1>/gi)) {
    const text = decode(m[3].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')).trim();
    if (!text) continue;
    const cls = (m[2].match(/class="([^"]*)"/) || [])[1] || '';
    items.push({ where: `${m[1].toLowerCase()}${cls ? '.' + cls.split(/\s+/)[0] : ''}`, text, role: /^h[1-3]$/i.test(m[1]) ? 'head' : 'body', cls });
  }
  for (const m of body.matchAll(/\balt="([^"]+)"/g)) items.push({ where: 'alt text', text: decode(m[1]), role: 'head' });
  return items;
}

/** Deck content: every slide's words; slide-level eyebrows and the like are lines above the headline. */
export function deckItems(slides, file = 'deck') {
  const items = [], extras = [];
  (slides || []).forEach((s, i) => {
    const where = `${file} slide ${i + 1}`;
    for (const k of EXTRA_FIELDS) if (typeof s[k] === 'string' && s[k]) extras.push({ where, field: k, text: s[k], nested: false });
    const walk = (x, key, nested) => {
      if (typeof x === 'string') {
        if (['src', 'image', 'include', 'file', 'layout', 'icon', 'pos', 'fit', 'bg', 'tone', 'ground', 'variant', 'notes'].includes(key) || /^[\w./-]+\.(?:png|jpe?g|webp|svg)$/i.test(x)) return;
        if (nested && EXTRA_FIELDS.includes(key)) extras.push({ where, field: key, text: x, nested: true });
        if (!EXTRA_FIELDS.includes(key) || nested) items.push({ where: `${where} ${key}`, text: x, role: ['title', 'name', 'k', 'v', 'label', 'value', 'date'].includes(key) ? 'head' : 'body' });
      } else if (Array.isArray(x)) x.forEach((v) => walk(v, key, nested));
      else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) walk(v, k, true);
    };
    for (const [k, v] of Object.entries(s)) walk(v, k, false);
  });
  return { items, extras };
}

const langOf = (file, fallback) => (path.basename(file).match(/[.-](es|en|ca|pt|fr)\.(?:html|json|txt|md)$/) || [])[1] || fallback;

/** One file of any kind: a print or stationery HTML, a deck content file (with its includes), a recipe, a data file or plain text. */
export function checkFile(file, { lang } = {}) {
  const raw = fs.readFileSync(file, 'utf8');
  const l = lang || langOf(file, 'es');
  const errors = [], warnings = [];
  const add = (r) => { errors.push(...r.errors); warnings.push(...r.warnings); };
  if (/\.html?$/i.test(file)) add(checkText(textsFromHtml(raw), { lang: l }));
  else if (/\.json$/i.test(file)) {
    const data = JSON.parse(raw);
    if (Array.isArray(data.slides) && !data.shots) {
      const slides = data.slides.flatMap((s) => s.include ? (JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), s.include), 'utf8')).slides || []) : [s]);
      const { items, extras } = deckItems(slides, path.basename(file));
      add(checkText(items, { lang: l }));
      // Decks: nothing above or beside the slide headline. The layouts no longer draw a slide-level eyebrow, so it is a
      // leftover to delete; a label over a column title is drawn and needs a person's eye (fold it into the title or the text).
      for (const x of extras) warnings.push(`${x.where} ${x.field}: "${x.text}" is a line above a ${x.nested ? 'column title' : 'slide headline'}; ${x.nested ? 'fold it into the title or the text' : 'the layouts do not draw it: delete it'}`);
    } else if (Array.isArray(data.shots)) {
      const items = [];
      data.shots.forEach((s, i) => { for (const [k, v] of Object.entries(s)) if (typeof v === 'string' && !['type', 'src', 'slot', 'url', 'fit', 'pos', 'ground'].includes(k)) items.push({ where: `shot ${i + 1} ${k}`, text: v.replace(/\|/g, ' '), role: ['headline', 'title', 'quote', 'event', 'alt'].includes(k) ? 'head' : 'body' }); });
      if (data.copy) items.push({ where: 'copy', text: data.copy, role: 'body' });
      add(checkText(items, { lang: data.lang || l }));
    } else add(checkText(dataItems(data), { lang: data.lang || l }));
  } else add(checkText(raw.split(/\n\s*\n/).map((p, i) => ({ where: `paragraph ${i + 1}`, text: p, role: /^#/.test(p) ? 'head' : 'body' })), { lang: l }));
  return { valid: !errors.length, errors, warnings };
}

/** Structured data (technical sheets): every string that is not a path. */
export function dataItems(data, where = 'data') {
  const items = [];
  const walk = (x, key) => {
    if (typeof x === 'string') { if (!/^[\w./-]+\.(?:png|jpe?g|webp|svg|html|pdf)$/i.test(x) && /\p{L}{3}/u.test(x)) items.push({ where: `${where} ${key}`, text: x, role: /name|title|head/i.test(key) ? 'head' : 'body' }); }
    else if (Array.isArray(x)) x.forEach((v) => walk(v, key));
    else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) walk(v, k);
  };
  walk(data, '');
  return items;
}

/** The MCP's pinned pieces (core.mjs): adds the text check to a source check result. */
export function withTextCheck(result, raw, dir) {
  try {
    const t = raw.kind === 'technical-sheet' ? checkText(dataItems(raw.data, 'sheet'), { lang: raw.lang })
      : raw.entry ? checkFile(path.join(dir, raw.entry), { lang: raw.lang }) : null;
    if (!t || (!t.errors.length && !t.warnings.length)) return result;
    const errors = [...(result.errors || []), ...t.errors], warnings = [...(result.warnings || []), ...t.warnings];
    return { ...result, valid: result.valid !== false && !t.errors.length, errors: errors.slice(0, 12), warnings: warnings.slice(0, 12), errorCount: (result.errorCount ?? 0) + t.errors.length, warningCount: (result.warningCount ?? 0) + t.warnings.length };
  } catch (e) { return { ...result, valid: false, errors: [...(result.errors || []), 'Text check: ' + e.message] }; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), li = args.indexOf('--lang'), lang = li >= 0 ? args.splice(li, 2)[1] : undefined;
  if (!args.length) { console.error('Usage: node engine/text-check.mjs <file> [more] [--lang es]   (- reads stdin)'); process.exit(2); }
  let failed = 0;
  for (const f of args) {
    const r = f === '-' ? (() => { const t = checkText(fs.readFileSync(0, 'utf8').split(/\n\s*\n/).map((p, i) => ({ where: `paragraph ${i + 1}`, text: p, role: 'body' })), { lang: lang || 'en' }); return { valid: !t.errors.length, ...t }; })() : checkFile(f, { lang });
    console.log(`\n${f}`);
    r.warnings.forEach((w) => console.log(`  warn   ${w}`));
    r.errors.forEach((e) => console.log(`  error  ${e}`));
    if (!r.valid) failed++; else console.log(r.warnings.length ? '  No errors; review the warnings.' : '  Passed.');
  }
  process.exit(failed ? 1 : 0);
}
