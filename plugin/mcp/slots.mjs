// Editable slots of a pinned document piece (brochure, catalogue, one-pager, deck): every short text and every picture,
// addressed by a stable id, so a marketer can say "change the cover photo" or "shorten the page 2 headline" without
// anyone touching HTML or JSON by hand. Edits apply to the pinned copy only; originals are never written.
//   print-html  p<page>.<tag>.<n>  (p1.h1.1, p2.p.3, p3.figcaption.1)   and   p<page>.img.<n>
//   deck        s<slide>.<field path>  (s3.title, s5.items.1.text)   and the same path for image fields (s2.src)
//   sales documents (pieces/sales): table rows are added or removed through any cell's slot ({ slot, row: 'add', text: 'a | b | c' }
//   or { slot, row: 'remove' }); a price table (.table.prices) recomputes its amounts, tax base, tax and total after every change;
//   a case study's customer approval is meta.approved_by and meta.approved_on (export refuses the piece without them).
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { STUDIO } from '../engine/recipe.mjs';

const sha = (b) => createHash('sha256').update(b).digest('hex');
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const plain = (h) => h.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').trim();
const TEXT = 'h1|h2|h3|h4|p|li|figcaption|dt|dd|th|td|blockquote';
const BLOCK = /<(?:h[1-6]|p|li|ul|ol|div|figure|section|table|header|footer|main|dl)\b/i;
const TEXT_RE = new RegExp(`<(${TEXT})((?:\\s[^>]*)?)>([\\s\\S]*?)</\\1>`, 'gi');
const IMG_RE = /<img\b[^>]*>/gi;
const DECK_SKIP = new Set(['layout', 'include', 'file', 'id', 'pos', 'fit', 'position', 'variant', 'theme', 'class', 'align', 'lang', 'icon', 'bg', 'tone']);
const DECK_IMAGE = new Set(['src', 'image', 'logo', 'photo', 'background']);
const IMAGE_EXT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
export const SLOT_LIMITS = { changes: 12, text: 600 };

function pages(html) {
  const out = []; let m; const re = /<section class="page\b[\s\S]*?<\/section>/g;
  while ((m = re.exec(html))) out.push({ start: m.index, end: m.index + m[0].length, html: m[0] });
  return out;
}

// Every slot of a print page, in document order, with where it sits in the file.
function printSlots(html) {
  const slots = [];
  for (const m of html.matchAll(/<meta name="ais-(approved-by|approved-on)" content="([^"]*)">/g)) {
    const at = m.index + m[0].indexOf('content="') + 9;
    slots.push({ id: 'meta.' + m[1].replace('-', '_'), type: 'text', page: 0, tag: 'meta', text: plain(m[2]), meta: true, at, len: m[2].length });
  }
  pages(html).forEach((pg, i) => {
    const count = {}; let m;
    TEXT_RE.lastIndex = 0;
    while ((m = TEXT_RE.exec(pg.html))) {
      const [whole, tag, attrs, inner] = m;
      if (BLOCK.test(inner) || !plain(inner)) continue;           // containers are not slots; their children are
      count[tag] = (count[tag] || 0) + 1;
      slots.push({ id: `p${i + 1}.${tag.toLowerCase()}.${count[tag]}`, type: 'text', page: i + 1, tag: tag.toLowerCase(), class: (attrs.match(/class="([^"]*)"/) || [])[1],
        text: plain(inner), rich: /<(strong|em|b|i|span|a|sup|sub)\b/i.test(inner), at: pg.start + m.index + whole.indexOf('>') + 1, len: inner.length });
    }
    let n = 0; IMG_RE.lastIndex = 0;
    while ((m = IMG_RE.exec(pg.html))) {
      const src = (m[0].match(/\bsrc="([^"]*)"/) || [])[1], alt = (m[0].match(/\balt="([^"]*)"/) || [])[1] ?? '';
      if (!src || /\.svg$/i.test(src)) continue;   // logos, icons and the brand pattern (all SVG) are not editable content
      n += 1;
      slots.push({ id: `p${i + 1}.img.${n}`, type: 'image', page: i + 1, src, alt: plain(alt), cover: i === 0 && /class="hero"/.test(pg.html.slice(Math.max(0, m.index - 120), m.index)), at: pg.start + m.index, len: m[0].length });
    }
  });
  return slots;
}

function deckSlots(deck) {
  const slots = [];
  const walk = (v, keyPath, slide) => {
    if (typeof v === 'string') {
      const key = keyPath[keyPath.length - 1];
      if (DECK_SKIP.has(key) || !v.trim()) return;
      const image = DECK_IMAGE.has(key) || /\.(jpe?g|png|webp|svg)$/i.test(v);
      slots.push({ id: `s${slide + 1}.${keyPath.slice(1).join('.')}`, type: image ? 'image' : 'text', slide: slide + 1, field: keyPath.slice(1).join('.'), [image ? 'src' : 'text']: v, path: keyPath });
    } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...keyPath, i], slide));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, [...keyPath, k], slide);
  };
  (deck.slides || []).forEach((s, i) => { if (!s.include) walk(s, [i], i); });   // shared sections (include) are edited in decks/sections, not per deck
  return slots;
}

// What a client sees: ids, current text or picture, nothing about file offsets.
export function listSlots(raw, dir) {
  const text = fs.readFileSync(path.join(dir, raw.entry), 'utf8');
  const slots = raw.kind === 'deck' ? deckSlots(JSON.parse(text)) : raw.kind === 'print-html' ? printSlots(text) : null;
  if (!slots) throw Error('Slots are available for brochures, catalogues, one-pagers and decks; stationery is built from stationery/build.py');
  return slots.map(({ at, len, path: p, ...s }) => s);
}

// Apply slot changes to the pinned entry, copy new pictures into the snapshot and re-record their digests.
// resolveImage(ref) returns an absolute path the caller has already checked (controlled roots, type, not rejected).
export function applySlots(raw, dir, changes, resolveImage) {
  if (!Array.isArray(changes) || !changes.length || changes.length > SLOT_LIMITS.changes) throw Error(`Send 1 to ${SLOT_LIMITS.changes} slot changes`);
  const entry = path.join(dir, raw.entry); let text = fs.readFileSync(entry, 'utf8');
  const depsPath = path.join(dir, 'dependencies.json'), deps = JSON.parse(fs.readFileSync(depsPath));
  const warnings = [], added = [];
  const addImage = (ref) => {
    const abs = resolveImage(ref), ext = path.extname(abs).toLowerCase();
    if (!IMAGE_EXT[ext]) throw Error('Pictures must be JPG, PNG or WebP: ' + ref);
    const bytes = fs.readFileSync(abs), name = sha(bytes).slice(0, 16) + ext;
    return { abs, bytes, name };
  };
  if (raw.kind === 'deck') {
    const deck = JSON.parse(text), slots = deckSlots(deck);
    for (const c of changes) {
      const s = slots.find((x) => x.id === c.slot); if (!s) throw Error('Unknown slot ' + c.slot + ' (list them with action "slots")');
      let target = deck.slides; for (const k of s.path.slice(0, -1)) target = target[k];
      const key = s.path[s.path.length - 1];
      if (c.image !== undefined) {
        if (s.type !== 'image') throw Error(c.slot + ' is text, not a picture');
        target[key] = path.relative(STUDIO, addImage(c.image).abs);   // the deck build resolves pictures from the repo root and copies them itself
      } else if (c.text !== undefined) {
        if (s.type !== 'text') throw Error(c.slot + ' is a picture; send "image"');
        if (c.text.length > SLOT_LIMITS.text) throw Error(c.slot + ': text longer than ' + SLOT_LIMITS.text + ' characters needs a layout change');
        if (c.text.length > s.text.length * 1.3 + 10) warnings.push(`${c.slot} grows from ${s.text.length} to ${c.text.length} characters; check the slide for overflow`);
        target[key] = c.text;
      } else throw Error(c.slot + ': send "text" or "image"');
    }
    text = JSON.stringify(deck, null, 2) + '\n';
  } else if (raw.kind === 'print-html') {
    const slots = printSlots(text), edits = [];
    for (const c of changes) {
      const s = slots.find((x) => x.id === c.slot); if (!s) throw Error('Unknown slot ' + c.slot + ' (list them with action "slots")');
      if (c.row !== undefined) { edits.push(rowEdit(text, s, c)); continue; }
      if (s.meta) {
        if (c.text === undefined) throw Error(c.slot + ' is text; send "text"');
        if (c.slot === 'meta.approved_on' && c.text && !/^\d{4}-\d{2}-\d{2}$/.test(c.text)) throw Error('meta.approved_on is the date of the written approval, YYYY-MM-DD');
        edits.push({ at: s.at, len: s.len, html: esc(c.text) }); continue;
      }
      if (s.type === 'text') {
        if (c.text === undefined) throw Error(c.slot + ' is text; send "text"');
        if (c.text.length > SLOT_LIMITS.text) throw Error(c.slot + ': text longer than ' + SLOT_LIMITS.text + ' characters needs a layout change');
        if (s.rich) warnings.push(`${c.slot} had bold or styled words; the new text is plain`);
        if (c.text.length > s.text.length * 1.3 + 10) warnings.push(`${c.slot} grows from ${s.text.length} to ${c.text.length} characters; check the page for overflow`);
        edits.push({ at: s.at, len: s.len, html: esc(c.text).replace(/\n/g, '<br>') });
      } else {
        if (c.text !== undefined) throw Error(c.slot + ' is a picture; send "image" and/or "alt"');
        let tag = text.slice(s.at, s.at + s.len);
        if (c.image !== undefined) { const img = addImage(c.image); added.push(img); tag = tag.replace(/\bsrc="[^"]*"/, `src="assets/${img.name}"`); }
        if (c.alt !== undefined) tag = /\balt="/.test(tag) ? tag.replace(/\balt="[^"]*"/, `alt="${esc(c.alt)}"`) : tag.replace(/<img\b/, `<img alt="${esc(c.alt)}"`);
        if (c.image === undefined && c.alt === undefined) throw Error(c.slot + ': send "image" and/or "alt"');
        if (s.cover && c.image !== undefined) warnings.push('New cover picture: the export fails it under 240 ppi or if it is a video frame');
        edits.push({ at: s.at, len: s.len, html: tag });
      }
    }
    edits.sort((a, b) => b.at - a.at);
    edits.forEach((e, i) => { if (i && e.at + e.len > edits[i - 1].at) throw Error('Two changes touch the same table row: send them in two updates'); });
    for (const e of edits) text = text.slice(0, e.at) + e.html + text.slice(e.at + e.len);
    text = priceTables(text, raw.lang).html;
  } else throw Error('Slots are available for brochures, catalogues, one-pagers and decks');
  // Write the edited entry and new pictures, then re-record their digests so the snapshot stays verifiable.
  const assets = path.join(path.dirname(entry), 'assets'); fs.mkdirSync(assets, { recursive: true });
  for (const img of added) {
    const target = path.join(assets, img.name), rel = path.relative(dir, target);
    fs.writeFileSync(target, img.bytes);
    if (!deps.files.some((f) => f.path === rel)) deps.files.push({ path: rel, source: img.abs, digest: sha(img.bytes), bytes: img.bytes.length });
  }
  fs.writeFileSync(entry, text);
  const rec = deps.files.find((f) => f.path === raw.entry); rec.digest = sha(Buffer.from(text)); rec.bytes = Buffer.byteLength(text); rec.edited = true;
  fs.writeFileSync(depsPath, JSON.stringify(deps, null, 2));
  return { warnings, picturesAdded: added.map((a) => a.name) };
}

// A table row add or remove, addressed by any cell's slot. The new row copies the row's markup with new cell texts
// ("a | b | c"); in a price table the amount may be left out, it is computed.
function rowEdit(html, s, c) {
  if (s.type !== 'text' || !/^t[dh]$/.test(s.tag)) throw Error(c.slot + ' is not a table cell; rows are added or removed through a cell of the row');
  const start = html.lastIndexOf('<tr', s.at), end = html.indexOf('</tr>', s.at) + 5, row = html.slice(start, end);
  const open = html.lastIndexOf('<tbody', start);
  if (open < 0 || html.lastIndexOf('</tbody>', start) > open) throw Error(c.slot + ': only body rows are added or removed (not the header or the totals)');
  const body = html.slice(open, html.indexOf('</tbody>', start));
  if (c.row === 'remove') {
    if ((body.match(/<tr\b/g) || []).length < 2) throw Error(c.slot + ': the last row of a table stays; change its text instead');
    return { at: start, len: end - start, html: '' };
  }
  if (c.row !== 'add') throw Error(c.slot + ': row is "add" or "remove"');
  const cells = [...row.matchAll(/<(t[dh])([^>]*)>([\s\S]*?)<\/\1>/g)], prices = /class="[^"]*\bprices\b/.test(html.slice(html.lastIndexOf('<table', start), start));
  const values = String(c.text ?? '').split('|').map((v) => v.trim());
  if (!(values.length === cells.length || (prices && values.length === cells.length - 1)) || values.some((v, i) => !v && !(prices && i === cells.length - 1)))
    throw Error(`${c.slot}: send the new row as "text" with ${cells.length} cells separated by " | "${prices ? ' (or leave out the amount: it is computed)' : ''}`);
  if (values.some((v) => v.length > SLOT_LIMITS.text)) throw Error(c.slot + ': cell text longer than ' + SLOT_LIMITS.text + ' characters');
  const lead = html.slice(html.lastIndexOf('\n', start) + 1, start);
  const fresh = '<tr' + row.slice(3, row.indexOf('>') + 1) + cells.map(([, tag, attrs], i) => `<${tag}${attrs}>${esc(values[i] ?? '')}</${tag}>`).join('') + '</tr>';
  return { at: end, len: 0, html: '\n' + (/^\s*$/.test(lead) ? lead : '') + fresh };
}

// Price tables: quantity × unit price per row, then the tax base, the tax (its rate read from the label, "IVA (21 %)") and the
// total in the foot rows marked data-sum="base|tax|total". Spanish and Catalan numbers: no separator up to four digits, a
// non-breaking space from five, decimal comma; English: thousands comma, decimal point.
const num = (s, lang) => { const t = plain(s).replace(/[\s  €$£]/g, ''); const v = Number(lang === 'en' ? t.replace(/,/g, '') : t.replace(/\./g, '').replace(',', '.')); return t && Number.isFinite(v) ? v : NaN; };
export function money(v, lang) {
  const whole = Math.abs(v - Math.round(v)) < 0.005, [i, d] = Math.abs(v).toFixed(whole ? 0 : 2).split('.');
  const group = lang === 'en' ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') : i;
  return (v < 0 ? '−' : '') + group + (d ? (lang === 'en' ? '.' : ',') + d : '');
}
export function priceTables(html, lang = 'es') {
  const problems = [];
  const out = html.replace(/<table class="[^"]*\bprices\b[^"]*">[\s\S]*?<\/table>/g, (table) => {
    let base = 0, tax = 0;
    const cellsOf = (row) => [...row.matchAll(/<(t[dh])([^>]*)>([\s\S]*?)<\/\1>/g)];
    const setLast = (row, value, label) => {
      const c = cellsOf(row), last = c[c.length - 1], at = row.lastIndexOf(last[0]), want = money(value, lang);
      if (num(last[3], lang) !== Math.round(value * 100) / 100) problems.push(`${label}: ${plain(last[3]) || 'empty'} should be ${want.replace(/&nbsp;/g, ' ')}`);
      return row.slice(0, at) + `<${last[1]}${last[2]}>${want}</${last[1]}>` + row.slice(at + last[0].length);
    };
    return table.replace(/<tbody>[\s\S]*?<\/tbody>/, (body) => body.replace(/<tr\b[\s\S]*?<\/tr>/g, (row) => {
      const c = cellsOf(row), q = num(c[1]?.[3] ?? '', lang), u = num(c[2]?.[3] ?? '', lang);
      if (c.length < 4 || !Number.isFinite(q) || !Number.isFinite(u)) { problems.push(`Price row "${plain(c[0]?.[3] ?? '')}": quantity and unit price must be numbers`); return row; }
      base += q * u; return setLast(row, q * u, `Amount of "${plain(c[0][3])}"`);
    })).replace(/<tr data-sum="(base|tax|total)"[\s\S]*?<\/tr>/g, (row, kind) => {
      if (kind === 'base') return setLast(row, base, 'Tax base');
      if (kind === 'tax') { const rate = plain(cellsOf(row)[0][3]).match(/(\d+(?:[.,]\d+)?)\s*%/); tax = base * (rate ? Number(rate[1].replace(',', '.')) : 0) / 100; return setLast(row, Math.round(tax * 100) / 100, 'Tax'); }
      return setLast(row, base + Math.round(tax * 100) / 100, 'Total');
    });
  });
  return { html: out, problems };
}
