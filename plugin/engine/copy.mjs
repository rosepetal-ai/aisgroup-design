import { checkText } from './text-check.mjs';

// The words in a recipe against Voice, Brand architecture and Localisation. Errors stop a render;
// warnings are for a person to decide. Rules the guide's language-check.mjs enforces on the websites are
// repeated here so a post is held to the same standard.

// Where text lives in a recipe, and what kind of text it is.
const HEADS = ['headline', 'title', 'event', 'quote'];
const BODY = ['overline', 'text', 'lead', 'label', 'name', 'role', 'slot', 'note', 'url'];

// The approved calls to action (Voice › Calls to action).
export const CTAS = {
  en: ['Book a demo', 'See it on your products', 'Send us samples', 'Request a feasibility study', 'Request a quote', 'Download the datasheet', 'Download the case study', 'Tell us about your line', 'Contact support', 'Start a free trial', 'Request access', 'Read the documentation'],
  es: ['Solicita una demo', 'Pruébalo con tus productos', 'Envíanos muestras', 'Solicita un estudio de viabilidad', 'Solicita un presupuesto', 'Descarga la ficha técnica', 'Descarga el caso de éxito', 'Cuéntanos cómo es tu línea', 'Contacta con soporte', 'Empieza la prueba gratuita', 'Solicita acceso', 'Consulta la documentación'],
  ca: ['Demana una demostració', 'Prova-ho amb els teus productes', 'Envia’ns mostres', 'Demana un estudi de viabilitat', 'Demana un pressupost', 'Baixa la fitxa tècnica', 'Baixa el cas d’èxit', 'Explica’ns com és la teva línia', 'Contacta amb el suport tècnic', 'Comença la prova gratuïta', 'Sol·licita accés', 'Consulta la documentació'],
};

// Names written wrong (Brand architecture › Writing the names). Case-sensitive on purpose.
const NAMES = [
  [/\b(?:Ais|AiS) (?:Group|Vision|Scanology)\b|\bAIS GROUP\b|\bAIS group\b|\bA\.I\.S\./g, 'AIS is three capitals and the names are written exactly: AIS Group, AIS Vision Systems'],
  [/\bAIS (?:VISION|vision)(?: (?:SYSTEMS|systems|Systems))?\b/g, 'Write AIS Vision Systems'],
  [/\bAIS Automation\b|\bAIS vision automation\b/g, 'Write AIS Vision Automation'],
  [/\bAIS (?:SCANOLOGY|scanology)\b/g, 'Write AIS Scanology'],
  [/\b(?:RosePetal|Rose Petal|ROSEPETAL|Rosepetal AI)\b|\brosepetal\b(?!\.ai)/g, 'Write Rosepetal: one word, capital R only'],
  [/\b(?:Rev 360|REV360|Rev360)\b/g, 'Write AIS REV 360'],
  [/(?<!AIS )\bKarik[oó]\b|\bAIS KARIKO\b|\bAIS Kariko\b/g, 'Write AIS KARIKÓ'],
  // Machine names: «AIS Hopper» in running text; «AIS HOPPER» passes inside a reproduced original title or logotype.
  [/\bAIS hopper\b/g, 'Write AIS HOPPER (or AIS Hopper, as in the guide)'],
];
// Words that make a claim the guide forbids, or the phrases it replaces (Voice › Claims and evidence).
const CLAIMS = {
  en: /\b(?:zero defects?|100 ?% detection|guarantee[sd]?|perfect(?:ly)?|the best|world[- ]lead(?:ing|er)|revolutionary|unmatched|unparalleled|cutting[- ]edge|state[- ]of[- ]the[- ]art|ai[- ]powered|fully autonomous|self[- ]learning|seamless(?:ly)?|effortless(?:ly)?|unlock|leverage|empower|integral solution|any defect|all products|maximum precision|learn more|more information)\b/gi,
  es: /(?<![\p{L}])(?:cero defectos|detección del 100 ?%|100 ?% de detección|garantiza\p{L}*|garantía total|perfect[oa]s?|el mejor|la mejor|líder mundial|revolucionari[oa]s?|sin igual|inigualable|de vanguardia|última generación|impulsad[oa] por (?:la )?IA|totalmente autónom[oa]|autoaprendizaje|sin fisuras|sin esfuerzo|solución integral|cualquier defecto|todos los productos|máxima precisión|más información|saber más)(?![\p{L}])/giu,
  ca: /(?<![\p{L}])(?:zero defectes|detecció del 100 ?%|garanteix\p{L}*|garantim|garantit|perfect[ea]s?|el millor|la millor|líder mundial|revolucionàri[a]?|sense igual|d’avantguarda|d'avantguarda|última generació|totalment autònom[a]?|sense esforç|solució integral|qualsevol defecte|tots els productes|màxima precisió|més informació)(?![\p{L}])/giu,
};
// Coverage absolutes: true of the inspection only with its conditions, so they warn (Voice: never "all products").
const ABSOLUTE = {
  en: /\b(?:every|each|no) (?:single )?(?:bottle|pack|board|part|product|unit|label|cap|cavity|container|piece)s?\b/gi,
  es: /(?<![\p{L}])(?:ningun[oa]?|tod[oa]s? l[oa]s|cada) (?:botella|envase|pieza|producto|etiqueta|tapón|placa|blíster|unidad)e?s?(?![\p{L}])/giu,
  ca: /(?<![\p{L}])(?:cap|totes les|tots els|cada) (?:ampolla|envàs|peça|producte|etiqueta|tap|placa|blíster|unitat)s?(?![\p{L}])/giu,
};
const FIRST_PERSON_CTA = { en: /^I want\b/i, es: /^Quiero\b/i, ca: /^Vull\b/i };
// Spanish and Catalan thousands (Localisation): 1285, 12 850 (non-breaking space), never 12.850. An error in every generator:
// posts here, print/render.mjs (brochures, catalogues, datasheets) and the deck build.
export const POINT_THOUSANDS = /(?<![\d.,])\d{1,3}(?:\.\d{3})+(?!\d)/g;
export const pointThousands = (t) => [...String(t).matchAll(POINT_THOUSANDS)].map((m) => m[0]);
// Localisation, as on the websites (language-check.mjs).
const LOCAL = {
  es: [[/\d%/g, 'Space before % (95 %)'], [POINT_THOUSANDS, 'No point in thousands (1285, 12 850)'], [/(?:^|[.!?]\s+)[A-ZÁÉÍÓÚÑ][^¿?.!]{2,80}\?/g, 'Opening ¿ missing'],
    [/'/g, 'Straight apostrophe or quote: use ’ or «»'], [/\bAI\b/g, 'Write IA in Spanish'], [/\b(?:costos|computadora|monitoreo)\b/gi, 'Spain Spanish: costes, ordenador, supervisión']],
  ca: [[/\d%/g, 'Space before % (95 %)'], [POINT_THOUSANDS, 'No point in thousands (1285, 12 850)'], [/\b\w*l[.\-]l\w*\b/gi, 'Punt volat: l·l'],
    [/\w'\w/g, 'Typographic apostrophe: ’'], [/\bAI\b/g, 'Write IA in Catalan'], [/\b(?:en base a|degut a|a nivell de|llevar a terme)\b/gi, 'Calque: a partir de, a causa de, pel que fa a, dur a terme']],
  en: [[/\b\w+iz(?:e|es|ed|ing|ation|ations)\b/g, 'British spelling: -ise'], [/\b(?:color|center|behavior|labeling|modeling)\b/gi, 'British spelling'],
    [/\b(?:can't|won't|don't|isn't|aren't|doesn't|didn't)\b/gi, 'Write it out: cannot, will not…'], [/\bartificial vision\b/gi, 'Machine vision'], [/\d %/g, 'No space before % in English']],
};
const ALLOW_IZE = /^(?:sizes?|sized|resize[sd]?|prizes?|seize[sd]?|capsize)$/i;
// Typed arrows, ticks, bullets, emoji and the middle-dot separator: icons come from Lucide, separators from layout.
const GLYPHS = /[←-⇿✓-✘•▶►★☆➡➔➜]|\p{Extended_Pictographic}|(?<![lL])\u00b7|\u00b7(?![lL])/u;
// Capitals that are names or units, not shouting.
const CAPS_OK = new Set(['AIS', 'REV', 'COMPACT', 'HOPPER', 'KARIKÓ', 'VACUUM', 'OPTICAIS', 'OCR', 'OCV', 'OEE', 'PCB', 'HMI', 'PLC', 'USB', 'PDF', 'GMP', 'FDA', 'ISO', 'LED', 'RGB', 'NIR', 'SWIR', 'API', 'SDK', 'GPU', 'CPU', 'ROI', 'IA', 'AI', 'QR', 'UV', 'IR', 'CE', 'EU', 'UE', 'PET', 'HDPE', 'SKU', 'LOT', 'EXP', 'DM', 'S.L.', '4YFN', 'MWC', 'ENOMAQ', 'LATAMCAN', 'NVIDIA', 'GS1']);

const MAKING = /(?<![\p{L}\d])(?:CAD|render(?:s|ed|ing|izad[oa]s?|izaci[oó]n)?|3D|Blender|KeyShot)(?![\p{L}\d])/giu;
const REVIEWNOTE = /(?<![\p{L}])(?:borrador(?: interno)?|vista de prueba|publicaci[oó]n de muestra|vista de revisi[oó]n|internal draft|draft|sample post|test view|review view|esborrany)(?![\p{L}])/giu;

export function lintCopy(r) {
  const errors = [], warnings = [], lang = CLAIMS[r.lang] ? r.lang : 'en';
  const texts = [];
  (r.shots || []).forEach((s, i) => {
    const where = `shot ${i + 1} (${s.type})`;
    for (const k of HEADS) if (typeof s[k] === 'string') texts.push({ where: `${where} ${k}`, t: s[k].replace(/\|/g, ' '), head: true });
    for (const k of BODY) if (typeof s[k] === 'string' && !(k === 'slot')) texts.push({ where: `${where} ${k}`, t: s[k] });
    (s.words || []).forEach((w) => texts.push({ where: `${where} words`, t: w.replace(/\|/g, ' '), head: true }));
    [...(s.items || []), ...(s.rows || [])].forEach((it) => { texts.push({ where: `${where} item`, t: it.text }); if (it.detail) texts.push({ where: `${where} item`, t: it.detail }); });
    if (s.lowerThird) texts.push({ where: `${where} lower third`, t: `${s.lowerThird.name} ${s.lowerThird.role || ''}` });
    for (const k of ['a', 'b']) if (s[k]?.label) texts.push({ where: `${where} ${k}`, t: s[k].label });
    if (s.inspect?.verdict) texts.push({ where: `${where} verdict`, t: `${s.inspect.verdict.text} ${s.inspect.verdict.detail || ''}` });
    if (s.action !== undefined) {
      const ok = CTAS[lang].some((c) => s.action === c || s.action.startsWith(c + ' ('));
      if (!ok) errors.push(`${where} action: "${s.action}" is not an approved call to action. Use one of: ${CTAS[lang].join(' / ')}`);
      if (FIRST_PERSON_CTA[lang].test(s.action)) errors.push(`${where} action: never first person`);
    }
  });
  (r.captions || []).forEach((q) => texts.push({ where: `captions ${q.from}s`, t: q.text.replace(/\|/g, ' ') }));
  if (r.copy) texts.push({ where: 'copy', t: r.copy, long: true });

  for (const { where, t, head, long } of texts) {
    if (!t) continue;
    // The machine and product pictures are used like photography: never call them CAD, renders or 3D in anything public.
    for (const m of t.matchAll(MAKING)) errors.push(`${where}: "${m[0]}" says how the picture was made; never CAD, render or 3D in public text, captions or alt text`);
    // Review notes live in the working files, never on the artwork or in the caption.
    for (const m of t.matchAll(REVIEWNOTE)) errors.push(`${where}: "${m[0]}" is a review note; keep it in the working notes, not on the piece`);
    if (/\[[^\]]+\]/.test(t)) { errors.push(`${where}: placeholder still in the text: ${t.match(/\[[^\]]+\]/)[0]}`); continue; }
    for (const [re, msg] of NAMES) for (const m of t.matchAll(re)) errors.push(`${where}: "${m[0]}" (${msg})`);
    for (const m of t.matchAll(CLAIMS[lang])) errors.push(`${where}: "${m[0]}" is a claim or phrase the guide replaces; state the result, metric and conditions instead`);
    for (const m of t.matchAll(ABSOLUTE[lang])) warnings.push(`${where}: "${m[0]}" is an absolute; say what is checked and under which conditions, or keep it out of headlines`);
    if (GLYPHS.test(t)) errors.push(`${where}: typed arrow, tick, bullet, emoji or middle-dot separator; icons are Lucide and separators are layout`);
    for (const [re, msg] of LOCAL[lang]) for (const m of t.matchAll(re)) {
      if (lang === 'en' && msg.startsWith('British spelling: -ise') && ALLOW_IZE.test(m[0])) continue;
      (msg.startsWith('No point in thousands') ? errors : warnings).push(`${where}: "${t.slice(Math.max(0, m.index - 12), m.index + m[0].length + 4).trim()}" (${msg})`);
    }
    // Shouting: two or more words in capitals that are not names or units.
    // Short words (DE, LA, OF) are skipped so "INSPECCIÓN DE ETIQUETAS" still counts as a run.
    const caps = t.split(/\s+/).map((w) => w.replace(/[^\p{L}.]/gu, '')).filter((w) => w.length >= 3).map((w) => w === w.toUpperCase() && /\p{Lu}/u.test(w) && !CAPS_OK.has(w));
    if (caps.some((c, i) => c && caps[i + 1])) errors.push(`${where}: words in capitals; sentence case everywhere, in every language`);
    if (head) {
      const words = t.split(/\s+/).filter((w) => /^\p{L}{4,}/u.test(w));
      const cap = words.slice(1).filter((w) => /^\p{Lu}\p{Ll}/u.test(w)).length;
      if (words.length >= 4 && cap / (words.length - 1) > 0.5) warnings.push(`${where}: looks like Title Case; headlines are sentence case`);
      if (t.length > 90) warnings.push(`${where}: ${t.length} characters; a headline that fits three lines is usually under 60`);
      if (/!/.test(t)) warnings.push(`${where}: exclamation mark; the voice is steady`);
    }
    // Figures carry their metric, baseline, conditions and date: on a stat slide with its note, not loose in copy.
    if (!long && /\d+(?:[.,]\d+)?\s?(?:%|x\b|×)/.test(t) && !where.includes('(stat)') && !where.includes('verdict') && !where.includes(' note'))
      warnings.push(`${where}: a figure; give it its metric, baseline, conditions and date (a stat slide with "note" and "basis"), or remove it`);
  }
  if (r.copy && r.kind !== 'video' && !CTAS[lang].some((c) => r.copy.includes(c))) warnings.push(`copy: end the post text with one approved call to action (${CTAS[lang].slice(0, 3).join(' / ')}…)`);
  // The text check every piece kind runs (text-check.mjs): helper text, hype words, slogans and the other AI tells.
  // A phrase already reported above for the same place is not reported twice.
  const plain = checkText(texts.map(({ where, t, head }) => ({ where, text: t, role: head ? 'head' : 'body' })), { lang: r.lang });
  const said = (m) => { const [where, phrase] = [m.split(': "')[0], (m.match(/"([^"]+)"/) || [])[1]?.toLowerCase()]; return [...errors, ...warnings].some((x) => x.startsWith(where) && phrase && x.toLowerCase().includes(`"${phrase}"`)); };
  errors.push(...plain.errors.filter((m) => !said(m))); warnings.push(...plain.warnings.filter((m) => !said(m)));
  return { errors, warnings };
}
