import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const forbiddenSeparator = /(?<![lL])\u00b7|\u00b7(?![lL])/u;
export function checkSeparators(roots) {
  const failures = [];
  function visit(p) {
    if (!fs.existsSync(p)) return;
    if (fs.statSync(p).isDirectory()) { for (const f of fs.readdirSync(p)) visit(path.join(p, f)); return; }
    if (!/\.(astro|mdx?|[cm]?js|ts|json|vue|html|txt)$/.test(p)) return;
    fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => { if (forbiddenSeparator.test(line.replace(/&middot;|&#183;|&#x0*b7;/gi, '\u00b7'))) failures.push(`${p}:${i + 1}`); });
  }
  roots.forEach(visit);
  if (failures.length) throw Error(`Middle-dot separators are forbidden (Catalan l·l is allowed):\n${failures.join('\n')}`);
}
export default function separatorCheck() {
  return { name: 'no-middle-dot-separators', hooks: {
    'astro:build:start': () => checkSeparators([new URL('../src/', import.meta.url), new URL('../../packages/', import.meta.url)].map(fileURLToPath)),
    'astro:build:done': ({ dir }) => checkSeparators(['en', 'es', 'ca'].map(l => fileURLToPath(new URL(l + '/', dir)))),
  } };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) checkSeparators(process.argv.slice(2).length ? process.argv.slice(2) : ['src', '../packages']);
