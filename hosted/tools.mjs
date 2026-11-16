// The six read-only tools of the hosted AIS Group Design server, over the snapshot in hosted/data/ (see build.mjs).
import fs from 'node:fs';
import { readSkillSource } from './skill-source.mjs';
import path from 'node:path';
import { McpServer, fromJsonSchema } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

export const LIMITS = Object.freeze({ responseBytes: 20000, chunkChars: 6000, hits: 6, assets: 20, examples: 15 });
export const SITE = 'https://aisgroup-design.web.app';
const GROUPS = { colour: ['color'], type: ['font', 'typography', 'typography-ui'], space: ['space'], layout: ['layout'], radius: ['radius'], shadow: ['shadow'], motion: ['motion'], data: ['data'] };
const KINDS = ['logo', 'app-mark', 'app-icon', 'favicon', 'pattern', 'icon', 'chart', 'web', 'font', 'photo', 'stock', 'video', 'poster', 'code', 'tokens'];
const EXAMPLE_TYPES = ['brochure', 'catalogue', 'datasheet', 'presentation', 'stationery', 'post'];

export function load(dir) {
  const read = (p) => readSkillSource(dir, p);
  const aliasesFile = path.join(dir, 'skills/aliases.json');
  const skillAliases = fs.existsSync(aliasesFile) ? JSON.parse(fs.readFileSync(aliasesFile, 'utf8')) : {};
  const catalogue = JSON.parse(read('catalogue.json'));
  const pages = [];
  for (const section of JSON.parse(read('skills/index.json'))) {
    const skill = read(`skills/${section}/SKILL.md`);
    pages.push({ section, page: 'overview', description: skill.match(/^description: (.*)$/m)?.[1] ?? '', text: skill.replace(/^---\n[\s\S]*?\n---\n+/, '') });
    for (const f of fs.readdirSync(path.join(dir, `skills/${section}/references`)).sort().filter(file => !skillAliases[`${section}/references/${file}`])) pages.push({ section, page: path.basename(f, '.md'), text: read(`skills/${section}/references/${f}`) });
  }
  // Search units: one per heading, with its offset in the page so a hit can be read from there.
  const chunks = pages.filter(p => !p.page.startsWith('retained-')).flatMap((p) => [...p.text.matchAll(/^#{1,3} .*$/gm)].map((m, i, all) => ({ ...p, heading: m[0].replace(/^#+ /, ''), offset: m.index, body: p.text.slice(m.index, all[i + 1]?.index ?? p.text.length) })));
  const rules = Object.fromEntries(['en', 'es', 'ca'].map((l) => { const [intro, ...parts] = read(`${l}/brand.md`).split(/^## /m); return [l, { intro: intro.trim(), sections: parts.map((s) => ({ name: s.slice(0, s.indexOf('\n')).trim(), text: '## ' + s.trim() })) }]; }));
  const registry = JSON.parse(read('r/registry.json')).items;
  // The examples' pages and stylesheets, by path under examples/; their pictures and PDFs are on the guide's site.
  const sources = new Map(fs.readdirSync(path.join(dir, 'examples'), { recursive: true }).filter((f) => /\.(html|css)$/.test(f)).map((f) => [f.split(path.sep).join('/'), read(path.join('examples', f))]));
  return { skillAliases, examples: JSON.parse(read('examples/index.json')), sources, catalogue, pages, chunks, rules, tokens: JSON.parse(read('downloads/ais-tokens.json')), theme: read('downloads/ais-theme.css'), registry, item: (name) => JSON.parse(read(`r/${name}.json`)) };
}

// ponytail: keyword scoring (heading hits count 4x, prefix match for words of 4+ letters, a few US spellings folded).
// No stemming or synonyms beyond that; move to embeddings if agents miss pages they should find.
const US = { color: 'colour', colors: 'colours', gray: 'grey', center: 'centre', behavior: 'behaviour', favicons: 'favicon' };
const words = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[a-z0-9]+/g)?.map((w) => US[w] ?? w) ?? [];
const count = (terms, text) => { const ws = words(text); return terms.reduce((n, t) => n + ws.filter((w) => w === t || (t.length >= 4 && w.startsWith(t))).length, 0); };
function search(data, { query, section, page }) {
  const terms = [...new Set(words(query))];
  if (!terms.length) throw new Error('The query has no words.');
  const pool = data.chunks.filter((c) => (!section || c.section === section) && (!page || c.page === page));
  return pool.map((c) => ({ c, score: terms.filter((t) => count([t], c.body)).length * 10 + count(terms, c.heading) * 4 + Math.min(count(terms, c.body), 20) }))
    .filter((h) => h.score > 10).sort((a, b) => b.score - a.score).slice(0, LIMITS.hits)
    .map(({ c }) => {
      const lower = c.body.toLowerCase(), found = terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0);
      const at = found.length ? Math.max(0, Math.min(...found) - 60) : 0;
      return { section: c.section, page: c.page, heading: c.heading, offset: c.offset, snippet: c.body.slice(at, at + 240).replace(/\s+/g, ' ').trim() };
    });
}

function guidelines(data, { query, section, page, offset = 0 }) {
  const sections = [...new Set(data.pages.map(p => p.section))];
  if (section) {
    const legacy = `${section}/${!page || page === 'overview' ? 'SKILL.md' : `references/${page}.md`}`;
    const target = data.skillAliases?.[legacy];
    if (target) { section = target.split('/')[0]; page = target.endsWith('/SKILL.md') ? 'overview' : path.basename(target, '.md'); }
    if (!sections.includes(section)) throw Error('Unknown section.');
  }
  if (query) return { hits: search(data, { query, section, page }), read: 'Pass section, page and offset of a hit to read it.' };
  if (!section) return { sections: sections.map((s) => ({ section: s, about: data.pages.find((p) => p.section === s && p.page === 'overview').description, pages: data.pages.filter((p) => p.section === s).map((p) => p.page) })) };
  const p = data.pages.find((x) => x.section === section && x.page === (page ?? 'overview'));
  if (!p) throw new Error(`No page "${page}" in ${section}. Pages: ${data.pages.filter((x) => x.section === section).map((x) => x.page).join(', ')}.`);
  if (offset >= p.text.length) throw new Error(`Offset past the end (${p.text.length} characters).`);
  const end = Math.min(p.text.length, offset + LIMITS.chunkChars);
  return { section, page: p.page, offset, text: p.text.slice(offset, end), next: end < p.text.length ? end : null, total: p.text.length };
}

// Tokens: every format is generated from ais-tokens.json (W3C DTCG); names follow ais-tokens.css.
const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
const CSS_NAMES = [['color.primary', 'color-primary'], ['color.', ''], ['font.family.', 'font-'], ['typography-ui.', 'ui-'], ['typography.', 'text-'], ['motion.duration.', 'duration-'], ['motion.easing.', 'ease-'], ['motion.distance.', 'distance-'], ['motion.stagger.items', 'stagger'], ['motion.stagger.', 'stagger-'], ['layout.breakpoints.', 'breakpoint-'], ['layout.', ''], ['data.categorical.', 'data-'], ['data.sequential.', 'seq-'], ['data.diverging.', 'div-']];
const TW_NAMES = [['color.', 'color-'], ['data.categorical.', 'color-data-'], ['data.sequential.', 'color-seq-'], ['data.diverging.', 'color-div-'], ['font.family.primary', 'font-sans'], ['font.family.', 'font-'], ['typography-ui.', 'text-ui-'], ['typography.', 'text-'], ['space.', 'spacing-'], ...CSS_NAMES];
const rename = (table, p) => { const [from, to] = table.find(([f]) => p.startsWith(f)) ?? ['', ''];
  return (to + p.slice(from.length)).replace(/\./g, '-').replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/(seq|div)-light-(\d+)$/, '$1-$2').replace(/(seq|div)-dark-(\d+)$/, '$1-$2-dark'); };

function flatten(tree) {
  const out = [];
  const walk = (node, at, type) => {
    type = node.$type ?? type;
    if ('$value' in node) return out.push({ path: at.join('.'), type, value: node.$value, alias: /^\{(.+)\}$/.exec(node.$value)?.[1], description: node.$description, ext: node.$extensions ?? {} });
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...at, k], type);
  };
  walk(tree, [], undefined);
  const byPath = new Map(out.map((t) => [t.path, t]));
  const resolve = (v) => typeof v === 'string' && /^\{.+\}$/.test(v) ? resolve(byPath.get(v.slice(1, -1))?.value ?? (() => { throw new Error(`Unresolved alias ${v}`); })()) : v;
  const css = (type, v) => {
    v = resolve(v);
    if (type === 'color') return typeof v === 'string' ? v : '#' + v.components.map(hex2).join('') + (v.alpha < 1 ? hex2(v.alpha) : '');
    if (type === 'dimension' || type === 'duration') return `${v.value}${v.unit}`;
    if (type === 'fontFamily') return v.map((f) => /^(sans-serif|serif|monospace|ui-monospace|system-ui)$/.test(f) ? f : `"${f}"`).join(', ');
    if (type === 'cubicBezier') return `cubic-bezier(${v.join(', ')})`;
    if (type === 'shadow') return v.map((s) => [s.offsetX, s.offsetY, s.blur, s.spread].map((d) => css('dimension', d)).join(' ') + ' ' + css('color', s.color)).join(', ');
    return String(v);
  };
  return out.map((t) => {
    if (t.type !== 'typography') return { ...t, css: t.ext['ais.fluid']?.css ?? css(t.type, t.value), dark: t.ext['ais.dark'] };
    const v = t.value, size = v.fontSize.value;
    return { ...t, parts: { size: t.ext['ais.fluid']?.css ?? css('dimension', v.fontSize), leading: String(v.lineHeight), tracking: `${+(v.letterSpacing.value / size).toFixed(3)}em`, weight: String(v.fontWeight), family: css('fontFamily', v.fontFamily) } };
  });
}

function tokens(data, { format = 'css', group }) {
  const keys = group ? GROUPS[group] : Object.keys(data.tokens).filter((k) => !k.startsWith('$'));
  const tree = Object.fromEntries(keys.map((k) => [k, data.tokens[k]]));
  const header = `AIS Group Design tokens ${data.catalogue.version}${group ? `, ${group} only` : ''}. Generated from ais-tokens.json.`;
  if (format === 'dtcg') return { format, text: JSON.stringify({ $description: data.tokens.$description, ...tree }) };
  const flat = flatten(data.tokens).filter((t) => keys.includes(t.path.split('.')[0]));
  if (format === 'js') {
    const o = {};
    for (const t of flat) { if (t.parts) o[t.path] = { fontFamily: t.parts.family, fontSize: t.parts.size, lineHeight: t.parts.leading, letterSpacing: t.parts.tracking, fontWeight: t.parts.weight }; else { o[t.path] = t.css; if (t.dark) o[t.path + '.dark'] = t.dark; } }
    return { format, text: `// ${header}\nexport const tokens = ${JSON.stringify(o, null, 1)};\n` };
  }
  // Tailwind is theme.css, @aisgroup/design's styles.css, so a site or product gets the app's classes. Its comments stay in
  // the file (/files/downloads/ais-theme.css): without them the answer fits the budget.
  if (format === 'tailwind') return { format, text: uncommented(data.theme) };
  const tw = false, lines = [];
  for (const t of flat) {
    const n = '--' + (tw ? '' : 'ais-') + rename(tw ? TW_NAMES : CSS_NAMES, t.path);
    if (t.parts) {
      lines.push(`${n}: ${t.parts.size};`);
      if (tw) lines.push(`${n}--line-height: ${t.parts.leading};`, `${n}--letter-spacing: ${t.parts.tracking};`, `${n}--font-weight: ${t.parts.weight};`);
      else lines.push(`${n}-leading: ${t.parts.leading};`, `${n}-tracking: ${t.parts.tracking};`, `${n}-weight: ${t.parts.weight};`, `${n}-family: ${t.parts.family};`);
    } else {
      // An alias stays a reference, as in brand.css: --ais-color-primary: var(--ais-blue-700).
      lines.push(`${n}: ${t.alias ? `var(--${tw ? '' : 'ais-'}${rename(tw ? TW_NAMES : CSS_NAMES, t.alias)})` : t.css};`);
      if (t.dark) lines.push(`${n}-dark: ${t.dark};`);
    }
  }
  return { format, text: `/* ${header} */\n${tw ? '@theme' : ':root'} {\n${lines.map((l) => '  ' + l).join('\n')}\n}\n` };
}

// A stylesheet without its comments and the blank lines they leave.
export const uncommented = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trimStart();

export function assets(data, { query, kind, surface, offset = 0 }, base, files) {
  const terms = query ? words(query) : [];
  // Every word must match the id, kind or use; matches in the id rank first ("rosepetal white" is the white logo).
  const all = data.catalogue.assets.filter((a) => (!kind || a.kind === kind) && terms.every((t) => count([t], `${a.id} ${a.kind} ${a.use}`)))
    .sort((a, b) => count(terms, b.id) - count(terms, a.id));
  const eligible = all; // Decorative patterns are available across media.
  const page = eligible.slice(offset, offset + LIMITS.assets);
  return {
    rules: Object.fromEntries([...new Set(page.map((a) => a.kind))].map((k) => [k, data.catalogue.rules[k]])),
    assets: page.map((a) => ({
      id: a.id, kind: a.kind, use: a.use,
      url: a.sourceOnly ? a.source : `${files ?? `${base}/files`}/${a.file}`,
      ...Object.fromEntries(['title', 'author', 'authorUrl', 'source', 'sourceOnly', 'rights', 'origin', 'width', 'height', 'bytes', 'format', 'preview'].filter(k => a[k] !== undefined).map(k => [k, a[k]]))
    })),
    total: eligible.length, next: offset + page.length < eligible.length ? offset + page.length : null
  };
}

// The marketing kit as HTML pages: filter the list, or read one page's source (or, by its path, a stylesheet it links) in chunks.
function examples(data, { query, type, brand, product, id, offset = 0 }) {
  const show = (e) => ({ id: e.id, type: e.type, title: e.title, brand: e.brand, product: e.product, lang: e.lang, url: SITE + e.html, ...(e.pdf && { pdf: SITE + e.pdf }), why: e.why });
  if (id) {
    const entry = data.examples.find((e) => e.id === id);
    const at = entry ? entry.html.replace(/^\/examples\//, '') + 'index.html' : path.posix.normalize(id).replace(/^\/?(examples\/)?/, '');
    const text = data.sources.get(at);
    if (text === undefined) throw new Error(`No example or stylesheet "${id}". Call design_examples without id for the list.`);
    if (offset >= text.length) throw new Error(`Offset past the end (${text.length} characters).`);
    const end = Math.min(text.length, offset + LIMITS.chunkChars);
    const css = entry && offset === 0 ? [...text.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => path.posix.join(path.posix.dirname(at), m[1])) : [];
    return { ...(entry && show(entry)), file: at, ...(css.length && { stylesheets: css }), offset, text: text.slice(offset, end), next: end < text.length ? end : null, total: text.length };
  }
  const terms = query ? words(query) : [], has = (want, v) => words(want).every((t) => words(v ?? '').includes(t));
  const all = data.examples.filter((e) => (!type || e.type === type) && (!brand || has(brand, e.brand)) && (!product || has(product, e.product))
    && terms.every((t) => count([t], `${e.id} ${e.title} ${e.product ?? ''} ${e.why}`)));
  const page = all.slice(offset, offset + LIMITS.examples);
  return { examples: page.map(show), total: all.length, next: offset + page.length < all.length ? offset + page.length : null };
}

function components(data, { name }, base) {
  const install = (n) => `npx shadcn-vue@latest add ${base}/r/${n}.json`;
  if (!name) return { items: data.registry, install: install('<name>'), theme: `${base}/r/theme.json` };
  if (!data.registry.some((i) => i.name === name)) throw new Error(`No component "${name}". Components: ${data.registry.map((i) => i.name).join(', ')}.`);
  return { ...data.item(name), install: install(name) };
}

function rules(data, { lang = 'en', section }) {
  const { intro, sections: list } = data.rules[lang];
  if (!section) return { lang, text: `${intro}\n\n${list[0].text}`, sections: list.map((s) => s.name) };
  // A section is found by its name in the chosen language or in English (the three files share one order).
  const want = words(section).join(' '), i = [list, data.rules.en.sections].map((l) => l.findIndex((s) => words(s.name).join(' ') === want)).find((x) => x >= 0);
  if (i === undefined) throw new Error(`No section "${section}". Sections: ${list.map((s) => s.name).join(', ')}.`);
  return { lang, text: list[i].text };
}

const text = z.string().trim().min(1).max(200);
export const TOOLS = {
  design_guidelines: {
    description: 'Search the brand guide or read a page in chunks. No arguments: the contents.',
    schema: z.object({ query: text.optional(), section: z.string().regex(/^[a-z0-9-]{1,40}$/).optional(), page: z.string().regex(/^[a-z0-9-]{1,40}$/).optional(), offset: z.number().int().min(0).max(1e6).optional() }).strict(),
    run: guidelines
  },
  design_tokens: {
    description: 'AIS design tokens 1.0 as CSS variables, a Tailwind v4 @theme block, a JS object or DTCG JSON.',
    schema: z.object({ format: z.enum(['css', 'tailwind', 'js', 'dtcg']).optional(), group: z.enum(Object.keys(GROUPS)).optional() }).strict(),
    run: tokens
  },
  design_assets: {
    description: 'Logos, icons, patterns, photos, video, fonts and web files: rules, rights, URLs.',
    schema: z.object({ query: text.optional(), kind: z.enum(KINDS).optional(), surface: z.enum(['social', 'print', 'office', 'deck', 'web', 'video', 'stand']).optional(), offset: z.number().int().min(0).max(1e4).optional() }).strict(),
    run: assets
  },
  design_components: {
    description: 'Rosepetal components and brand blocks with source, as shadcn-vue registry items. No name: the list.',
    schema: z.object({ name: z.string().regex(/^[a-z0-9-]{1,40}$/).optional() }).strict(),
    run: components
  },
  design_examples: {
    description: 'Marketing-kit pieces to follow (brochures, catalogues, datasheets, decks, stationery): page, PDF, why. id: its HTML, or a stylesheet path it lists.',
    schema: z.object({ query: text.optional(), type: z.enum(EXAMPLE_TYPES).optional(), brand: text.optional(), product: text.optional(), id: z.string().regex(/^[a-z0-9/._-]{1,120}$/).refine((f) => !f.split('/').includes('..')).optional(), offset: z.number().int().min(0).max(1e6).optional() }).strict(),
    run: examples
  },
  brand_rules: {
    description: 'The brand essentials, or one section of the rules, in en, es or ca.',
    schema: z.object({ lang: z.enum(['en', 'es', 'ca']).optional(), section: text.optional() }).strict(),
    run: rules
  }
};

export const INSTRUCTIONS = 'AIS Group Design: the brand guide of AIS Group, AIS Vision Systems, AIS Vision Automation, AIS Scanology and Rosepetal. Take colours, type and sizes from design_tokens, files from design_assets, component code from design_components, model pieces from design_examples; never from memory or a live site. Essential 1 (Keep it simple) wins.';

// Clients see lean schemas (types, enums, required); the strict zod contract is checked on every call.
// ponytail: limits and patterns live only server-side, so a bad call costs one refusal instead of tokens in every session.
const LEAN = new Set(['maxLength', 'minLength', 'pattern', 'maximum', 'minimum', 'default', '$schema', 'additionalProperties', 'exclusiveMinimum', 'exclusiveMaximum']);
const lean = (v) => Array.isArray(v) ? v.map(lean) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !LEAN.has(k)).map(([k, x]) => [k, lean(x)])) : v;
const advertised = (schema) => { const j = lean(z.toJSONSchema(schema, { io: 'input' })); if (!j.required?.length) delete j.required; return fromJsonSchema(j); };

export function bounded(value) {
  const out = JSON.stringify(value);
  if (Buffer.byteLength(out) > LIMITS.responseBytes) throw new Error('The answer is too long. Narrow it: a group, a kind, a query or an offset.');
  return out;
}

export function serverFactory({ data, baseUrl, filesBase }) {
  return (ctx) => {
    const base = baseUrl || (ctx.requestInfo ? new URL(ctx.requestInfo.url).origin : '');
    const server = new McpServer({ name: 'ais-group-design', version: data.catalogue.version }, { instructions: INSTRUCTIONS });
    for (const [name, tool] of Object.entries(TOOLS)) {
      server.registerTool(name, { description: tool.description, inputSchema: advertised(tool.schema), annotations: { readOnlyHint: true, openWorldHint: false } }, async (args) => {
        try {
          const parsed = tool.schema.safeParse(args ?? {});
          if (!parsed.success) throw new Error(z.prettifyError(parsed.error).slice(0, 600));
          return { content: [{ type: 'text', text: bounded(tool.run(data, parsed.data, base, filesBase)) }] };
        } catch (e) { return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: String(e.message).slice(0, 1000) }) }] }; }
      });
    }
    return server;
  };
}
