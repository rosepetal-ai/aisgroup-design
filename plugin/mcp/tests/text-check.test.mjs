// The text check (engine/text-check.mjs): AI tells, helper text, slogans and lines above headlines, in every kind and
// language; the delivered kit passes without errors.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkText, checkFile, textsFromHtml, withTextCheck } from '../../engine/text-check.mjs';
import { lintCopy } from '../../engine/copy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const one = (text, lang, role = 'body') => checkText([{ where: 'x', text, role }], { lang });
const fails = (text, lang, phrase) => { const r = one(text, lang); assert(r.errors.some((e) => e.includes(`"${phrase}"`)), `${lang}: expected an error for "${phrase}" in: ${text}\n${JSON.stringify(r)}`); };
const warns = (text, lang, phrase) => { const r = one(text, lang); assert(!r.errors.length && r.warnings.some((w) => w.includes(phrase)), `${lang}: expected only a warning with "${phrase}" in: ${text}\n${JSON.stringify(r)}`); };

test('errors: openers, hype words, helper text, closing summaries and slogans in five languages', () => {
  fails('In today’s fast-paced world, quality matters.', 'en', 'In today’s fast-paced world');
  fails('Unlock seamless inspection on your line.', 'en', 'Unlock');
  fails('Click here to see the machine.', 'en', 'Click here');
  fails('Learn more about the AIS Hopper.', 'en', 'Learn more about');
  fails('It checks the cap. In short, it works.', 'en', 'In short');
  fails('Inspect. Reject. Record.', 'en', 'Inspect. Reject. Record.');
  fails('En el mundo actual, la calidad lo es todo.', 'es', 'En el mundo actual');
  fails('Lleva tu línea al siguiente nivel.', 'es', 'al siguiente nivel');
  fails('Descubre cómo funciona AIS KARIKÓ.', 'es', 'Descubre cómo');
  fails('Haz clic en el enlace.', 'es', 'Haz clic');
  fails('Comprueba el tapón. En resumen, menos rechazos.', 'es', 'En resumen');
  fails('Inspecciona. Rechaza. Registra.', 'es', 'Inspecciona. Rechaza. Registra.');
  fails('Fes clic aquí per veure-ho.', 'ca', 'Fes clic');
  fails('Descobreix com funciona.', 'ca', 'Descobreix com');
  fails('Saiba mais sobre a máquina.', 'pt', 'Saiba mais');
  fails('No mundo atual, a qualidade importa.', 'pt', 'No mundo atual');
  fails('En savoir plus sur la machine.', 'fr', 'En savoir plus');
  fails('Découvrez comment elle inspecte.', 'fr', 'Découvrez comment');
});

test('warnings name the phrase and the fix: not only… but also, threes, em dash, rhetorical questions, proofless adjectives', () => {
  warns('It not only checks the cap but also reads the lot.', 'en', 'not only');
  warns('No solo comprueba el tapón, sino también el lote.', 'es', 'no solo');
  warns('Una inspección rápida, fiable y precisa.', 'es', 'three adjectives');
  warns('A fast, reliable and precise check.', 'en', 'three adjectives');
  warns('The model flags the defect — the operator confirms it.', 'en', 'em dash');
  warns('¿Por qué importa? Porque cada rechazo cuesta.', 'es', 'rhetorical question');
  warns('Una solución innovadora para la línea.', 'es', 'proves it');
  assert.deepEqual(one('¿Tu inspector rechaza botellas buenas?', 'es', 'head'), { errors: [], warnings: [] }, 'a headline may ask the reader’s question');
  assert.equal(one('¿Cuál de estas latas rechazarías?', 'es').warnings.length, 0, 'the defects carousel question is the piece');
  assert(one('Haz clic aquí.', 'es').errors[0].includes('delete it'), 'every finding says the fix');
  assert(one('Un sistema “ligero” para la línea.', 'es').errors[0].includes('«…»'), 'Spanish quotes are « »');
  assert(one('El sistema "veu" la zona.', 'ca').errors.length === 1, 'straight quotes in Catalan');
  assert.deepEqual(one('Un sistema «ligero», como dijo: «un sistema “ligero”».', 'es').errors, [], 'inner “ ” inside « » is right');
  assert(one('A “light” system.', 'en').errors[0].includes('«…»'), 'English quotes are « » too');
  assert.deepEqual(one('As she said: «a “light” system».', 'en').errors, [], 'inner “ ” inside « » is right in English');
});

test('plain approved copy passes in Spanish and English; legitimate words are not flagged', () => {
  for (const [text, lang] of [
    ['AIS KARIKÓ inspecciona las bandejas termoselladas por ambas caras. En esta bandeja de muestra, un fragmento de plástico azul ha quedado sobre el film, junto a la etiqueta. Envíanos muestras', 'es'],
    ['Comprueba que el tapón está presente, íntegro y bien colocado, controla el precinto y el nivel de llenado, y lee el marcaje del envase.', 'es'],
    ['AIS KARIKÓ inspects heat-sealed trays from both sides. The elevated conveyor feeds the wire harness station. Send us samples', 'en'],
    ['Control del tapón y del nivel de llenado. Integra el resultado al nivel de la línea.', 'es'],
    ['Rango de medida: 10–50 mm; sin datos: —', 'es'],
  ]) assert.deepEqual(one(text, lang), { errors: [], warnings: [] }, text);
});

test('HTML: print pieces keep their section labels; alt text and blocks are checked', () => {
  const html = '<section class="page"><p class="sub">Tapón y precinto</p><h2>Control del tapón</h2><p class="lead">Haz clic para ver <b>más</b>.</p><img alt="Descubre cómo inspecciona"></section>';
  const items = textsFromHtml(html);
  assert(items.some((i) => i.text === 'Tapón y precinto'));
  const r = checkText(items, { lang: 'es' });
  assert.equal(r.errors.length, 2, JSON.stringify(r));
  assert(r.errors.some((e) => e.startsWith('p.lead: "Haz clic"')) && r.errors.some((e) => e.startsWith('alt text')));
});

test('decks: a line above a slide headline or a column title warns with the fix; slide words are checked', () => {
  const dir = fs.mkdtempSync(path.join(ROOT, 'work/.text-check-'));
  try {
    const f = path.join(dir, 'content.es.json');
    fs.writeFileSync(f, JSON.stringify({ meta: {}, slides: [{ layout: 'statement', eyebrow: 'Nuestras soluciones', title: 'Descubre cómo inspeccionamos' }, { layout: 'columns', title: 'Dónde estamos', columns: [{ eyebrow: 'Irlanda', title: 'AIS Group' }] }] }));
    const r = checkFile(f);
    assert(r.errors.some((e) => e.includes('"Descubre cómo"')));
    assert(r.warnings.some((w) => w.includes('slide 1 eyebrow') && w.includes('delete it')));
    assert(r.warnings.some((w) => w.includes('slide 2 eyebrow') && w.includes('column title')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('posts run it through the recipe check, without reporting a phrase twice', () => {
  const r = lintCopy({ lang: 'es', kind: 'post', shots: [{ type: 'hero', headline: 'Un cuerpo extraño sobre el film' }], copy: 'Descubre cómo AIS KARIKÓ inspecciona bandejas sin fisuras. Envíanos muestras' });
  assert(r.errors.some((e) => e.includes('"Descubre cómo"')));
  assert.equal(r.errors.filter((e) => e.toLowerCase().includes('"sin fisuras"')).length, 1, JSON.stringify(r.errors));
});

test('technical sheets and pinned pieces: errors block, warnings pass through', () => {
  const sheet = withTextCheck({ valid: true, errors: [], warnings: [], errorCount: 0, warningCount: 0 }, { kind: 'technical-sheet', lang: 'es', data: { name: 'AIS Hopper', lead: 'Más información sobre el tapón.' } });
  assert.equal(sheet.valid, false); assert.equal(sheet.errorCount, 1);
  const clean = { valid: true, errors: [], warnings: [], errorCount: 0, warningCount: 0 };
  assert.deepEqual(withTextCheck(clean, { kind: 'technical-sheet', lang: 'es', data: { lead: 'Comprueba el tapón y el nivel.' } }), clean);
});

test('the delivered kit has no text errors', () => {
  const files = [
    ...['pieces/brochures', 'pieces/datasheets', 'pieces/stationery/business-cards', 'pieces/stationery/letterhead'].flatMap((d) => fs.existsSync(path.join(ROOT, d)) ? fs.readdirSync(path.join(ROOT, d), { recursive: true }).filter((f) => /\.html$/.test(f) && !/(^|\/)(out|previews)\//.test(f)).map((f) => path.join(d, f)) : []),
    ...fs.readdirSync(path.join(ROOT, 'pieces/decks')).flatMap((d) => fs.existsSync(path.join(ROOT, 'pieces/decks', d)) && fs.statSync(path.join(ROOT, 'pieces/decks', d)).isDirectory() ? fs.readdirSync(path.join(ROOT, 'pieces/decks', d)).filter((f) => /^content\.[a-z]{2}\.json$/.test(f)).map((f) => `pieces/decks/${d}/${f}`) : []),
    ...fs.readdirSync(path.join(ROOT, 'pieces/posts')).flatMap((d) => fs.statSync(path.join(ROOT, 'pieces/posts', d)).isDirectory() ? fs.readdirSync(path.join(ROOT, 'pieces/posts', d)).filter((f) => /^recipe-[a-z]{2}\.json$/.test(f)).map((f) => `pieces/posts/${d}/${f}`) : []),
  ];
  assert(files.length > 60, `found only ${files.length} pieces`);
  const failed = files.map((f) => [f, checkFile(path.join(ROOT, f)).errors]).filter(([, e]) => e.length);
  assert.deepEqual(failed, []);
});
