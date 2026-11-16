// Turns the single-file build into an Artifact page: the publisher adds its own
// doctype/html/head/body skeleton, so strip ours and keep title, style, script and #app.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const html = readFileSync('dist-artifact/index.html', 'utf8')
const out = html
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body[^>]*>/gi, '')
  .replace(/<meta[^>]*>/gi, '')
  .replace(/<link rel="icon"[^>]*>/gi, '')
  .trim()
  // vue-i18n's parser has a literal U+FFFD in a JS string; the Artifact publisher rejects raw U+FFFD.
  .replaceAll('\uFFFD', '\\uFFFD')

mkdirSync('artifact', { recursive: true })
writeFileSync('artifact/index.html', `${out}\n`)
console.log(`artifact/index.html (${(out.length / 1024).toFixed(0)} KB)`)
