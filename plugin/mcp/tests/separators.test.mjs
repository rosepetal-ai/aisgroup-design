import test from 'node:test';
import assert from 'node:assert/strict';
import { checkText, textsFromHtml } from '../../engine/text-check.mjs';
import { lintCopy } from '../../engine/copy.mjs';
test('separators fail in every language and text role, with or without spaces', () => {
  for (const lang of ['en', 'es', 'ca', 'pt', 'fr']) for (const text of ['PDF\u00b7ES', 'PDF \u00b7 ES', 'A\u00b7B', 'l\u00b7x']) {
    assert(checkText([{ where: 'piece', text }], { lang }).errors.some(e => e.includes('middle-dot')));
    assert(checkText(textsFromHtml(`<p>${text}</p>`), { lang }).errors.some(e => e.includes('middle-dot')));
    assert(lintCopy({ lang, shots: [{ type: 'text', headline: text }] }).errors.length);
  }
});
test('Catalan spelling and spelling explanations pass', () => {
  assert.deepEqual(checkText([{ where: 'piece', text: 'Col·laboració, intel·ligent, Il·lustració, sol·licita, l·l.' }], {lang:'ca'}).errors, []);
});
