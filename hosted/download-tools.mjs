// Four download surfaces. The existing knowledge engine stays internal and read-only.
import fs from 'node:fs';
import path from 'node:path';
import { McpServer, fromJsonSchema } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { load as loadKnowledge, TOOLS as KNOWLEDGE, EXAMPLE_TYPES, bounded, LIMITS } from './tools.mjs';
import { pending, APPROVED_MASCOTS } from './download-policy.mjs';

export function load(dir) {
  const data = loadKnowledge(dir);
  data.software = JSON.parse(fs.readFileSync(path.join(dir, 'examples/software.json'), 'utf8'));
  data.web = JSON.parse(fs.readFileSync(path.join(dir, 'downloads/aisgroup-web/index.json'), 'utf8'));
  data.webSource = f => fs.readFileSync(path.join(dir, 'downloads/aisgroup-web', f), 'utf8');
  data.themes = Object.fromEntries(['primevue.mjs', 'vuetify.mjs', 'base.css', 'README.md', 'tokens.json'].map(f => [f, fs.readFileSync(path.join(dir, 'downloads/vue-themes', f), 'utf8')]));
  data.componentExamples = JSON.parse(fs.readFileSync(path.join(dir, 'component-examples.json'), 'utf8'));
  data.migration = Object.fromEntries(fs.readdirSync(path.join(dir, 'migration')).filter(f => f.endsWith('.json')).sort().map(f => [path.basename(f, '.json'), JSON.parse(fs.readFileSync(path.join(dir, 'migration', f), 'utf8'))]));
  return data;
}
const text = z.string().trim().min(1).max(200), offset = z.number().int().min(0).max(1e6).optional();
const invoke = (name, data, args, base, files) => KNOWLEDGE[name].run(data, KNOWLEDGE[name].schema.parse(args), base, files);
const chunk = (source, at = 0) => {
  if (at >= source.length) throw new Error('Offset past the end');
  const end = Math.min(source.length, at + LIMITS.chunkChars);
  return { text: source.slice(at, end), offset: at, next: end < source.length ? end : null, total: source.length };
};

// Search: each word on its own, case and hyphens ignored ("topbar" finds top-bar); the more words hit, the higher it
// ranks, hits in the name or title first. fields(item) gives [name and title, the rest].
// ponytail: prefix matching only, no stemming beyond a shorter word inside a longer query word ("buttons" finds button).
// A hyphenated word also counts joined from each part on: software-top-bar gives softwaretopbar, topbar, bar.
const searchWords = s => (s ?? '').toLowerCase().match(/[a-z0-9]+(?:-[a-z0-9]+)*/g)?.flatMap(w => w.split('-').flatMap((p, i, all) => [p, all.slice(i).join('')])) ?? [];
const hits = (t, ws) => ws.some(w => w.startsWith(t) || (w.length >= 4 && t.startsWith(w)));
export function search(items, query, fields) {
  const terms = [...new Set(query.toLowerCase().match(/[a-z0-9]+/g) ?? [])];
  return items.map(item => {
    const [main, rest] = fields(item).map(searchWords), top = terms.filter(t => hits(t, main)).length;
    return { item, top, n: terms.filter(t => hits(t, main) || hits(t, rest)).length };
  }).filter(r => r.n).sort((a, b) => b.n - a.n || b.top - a.top).map(r => r.item);
}

// The PrimeVue and Vuetify adapters: the preset and the files around it, by name or by file name ("base", "base.css").
const ADAPTER = { preset: kind => `${kind}.mjs`, base: () => 'base.css', readme: () => 'README.md', tokens: () => 'tokens.json' };
const adapterFile = (kind, name = 'preset') => Object.values(ADAPTER).map(f => f(kind)).find(f => f === name) ?? (Object.hasOwn(ADAPTER, name) && ADAPTER[name](kind));

// Migration maps (packages/vue-themes/migration): an entry is one item of a map's longest list (an array, or an
// object's keys), at the top or one level down. ponytail: shape-agnostic; read a named list if the maps settle on one.
const MIGRATION_HITS = 20;
const entries = map => [map, ...(Array.isArray(map) ? [] : Object.values(map ?? {}))]
  .flatMap(v => Array.isArray(v) ? [v] : v && typeof v === 'object' ? [Object.entries(v).map(([k, x]) => ({ [k]: x }))] : [])
  .sort((a, b) => b.length - a.length)[0] ?? [];
function migration(maps, { name, query, offset }) {
  const names = Object.keys(maps);
  if (name && !Object.hasOwn(maps, name)) throw new Error(`No migration map "${name}". Maps: ${names.join(', ')}.`);
  if (!query && !name) return { maps: names.map(n => ({ name: n, entries: entries(maps[n]).length, ...(maps[n].description && { about: maps[n].description }) })), read: 'Pass name to read a map, query to find its entries (a component, prop or icon).' };
  if (!query) return { name, ...chunk(JSON.stringify(maps[name], null, 1), offset) };
  // Each word of the query on its own, case, spaces and hyphens ignored inside it ("pi-bell", "datatable").
  const flat = s => s.toLowerCase().replace(/[^a-z0-9]/g, ''), terms = query.split(/\s+/).map(flat).filter(Boolean);
  const found = (name ? [name] : names).flatMap(map => entries(maps[map]).map(entry => ({ map, entry, n: terms.filter(t => flat(JSON.stringify(entry)).includes(t)).length })))
    .filter(h => h.n).sort((a, b) => b.n - a.n);
  const at = offset ?? 0, page = found.slice(at, at + MIGRATION_HITS);
  return { hits: page.map(({ map, entry }) => ({ map, entry })), total: found.length, next: at + page.length < found.length ? at + page.length : null };
}
const EXAMPLE_KINDS = [...EXAMPLE_TYPES, 'software-view', 'pdf', 'image', '3d-model'];
export const TOOLS = {
  design_code: {
    description: 'Code: Tailwind theme, Vue registry (search, source, examples), websites\' Astro components (@aisgroup/web), PrimeVue/Vuetify adapters (name: preset, base, readme, tokens), migration maps.',
    schema: z.object({ kind: z.enum(['components', 'web', 'tailwind', 'primevue', 'vuetify', 'migration']).optional(), query: text.optional(), name: z.string().regex(/^[A-Za-z0-9.-]{1,40}$/).optional(), offset }).strict(),
    run(data, { kind = 'components', query, name, offset }, base, files) {
      if (kind === 'tailwind') return invoke('design_tokens', data, { format: 'tailwind' }, base, files);
      if (kind === 'migration') return migration(data.migration, { name, query, offset });
      if (['primevue', 'vuetify'].includes(kind)) {
        const file = adapterFile(kind, name), at = `${files ?? `${base}/files`}/downloads/vue-themes/`;
        if (!file) throw new Error(`No ${kind} file "${name}". Names: ${Object.keys(ADAPTER).join(', ')}.`);
        return { ...chunk(data.themes[file], offset), file, names: Object.keys(ADAPTER), url: at + file, mapping: at + 'README.md' };
      }
      if (kind === 'web') {
        const url = f => `${files ?? `${base}/files`}/downloads/aisgroup-web/${f}`, page = id => `${base}/en/web-components/${id}/`;
        if (!name) {
          const items = query ? search(data.web.items, query, i => [`${i.name} ${i.title}`, i.description]) : data.web.items;
          return { package: data.web.package, setup: data.web.setup.map(url), shared: data.web.shared.map(url), items: items.map(({ files: f, examples, ...i }) => ({ ...i, page: page(i.name) })), total: items.length };
        }
        const item = data.web.items.find(i => i.name === name);
        if (!item) throw new Error(`No web component ${name}`);
        const source = [...item.files, ...item.examples].map(f => `// ${f}\n${data.webSource(f)}`).join('\n\n');
        return { ...item, page: page(name), urls: [...item.files, ...item.examples].map(url), ...chunk(source, offset) };
      }
      const result = invoke('design_components', data, { name }, base, files);
      if (!name) return query ? { ...result, items: search(result.items, query, i => [`${i.name} ${i.title ?? ''}`, i.description]) } : result;
      // One item: its files, then its package examples, as one source read in chunks (sidebar alone is over the budget).
      const { files: sources, ...item } = result, examples = data.componentExamples[name] ?? [];
      const source = [...sources, ...examples].map(f => `// ${f.path}\n${f.content}`).join('\n\n');
      return { ...item, files: sources.map(f => f.path), examples: examples.map(e => e.path), ...chunk(source, offset) };
    }
  },
  design_assets: {
    description: 'Assets: logos, favicons, patterns/backgrounds, approved media and fonts. Mascots held back.',
    schema: z.object({ query: text.optional(), kind: z.string().max(40).optional(), surface: z.enum(['social', 'print', 'office', 'deck', 'web']).optional(), offset }).strict(),
    run(data, args, base, files) {
      if (['mascot', 'illustration'].includes(args.kind)) return { assets: APPROVED_MASCOTS, total: 0, next: null, pending: pending.mascots };
      if (args.kind === 'background') args = { ...args, kind: 'pattern' };
      return invoke('design_assets', data, args, base, files);
    }
  },
  design_examples: {
    description: 'Examples by type: marketing documents (HTML, PDF), software views and images. No machine models.',
    schema: z.object({ query: text.optional(), type: z.enum(EXAMPLE_KINDS).optional(), brand: text.optional(), product: text.optional(), id: z.string().regex(/^[a-z0-9/._-]{1,120}$/).refine(f => !f.split('/').includes('..')).optional(), offset }).strict(),
    run(data, args, base, files) {
      if (args.type === '3d-model') return { examples: [], total: 0, next: null, pending: pending['3d-model'] };
      if (args.type === 'image') {
        const r = invoke('design_assets', data, { kind: 'photo', query: args.query, offset: args.offset }, base, files);
        return { examples: r.assets, total: r.total, next: r.next, rules: r.rules };
      }
      const view = data.software.find(e => e.id === args.id);
      if (view) return { ...view, ...chunk(data.sources.get(view.source), args.offset), url: base + view.html, registry: base + view.registry };
      if (args.type === 'software-view') {
        const all = args.query ? search(data.software, args.query, e => [`${e.id} ${e.title}`, e.why]) : data.software, at = args.offset ?? 0;
        return { examples: all.slice(at, at + LIMITS.examples).map(e => ({ ...e, url: base + e.html, registry: base + e.registry })), total: all.length, next: at + LIMITS.examples < all.length ? at + LIMITS.examples : null };
      }
      if (args.type === 'pdf') {
        const pdfs = data.examples.filter(e => e.pdf), all = args.query ? search(pdfs, args.query, e => [`${e.id} ${e.title}`, e.why]) : pdfs, at = args.offset ?? 0;
        return { examples: all.slice(at, at + LIMITS.examples).map(e => ({ ...e, url: base + e.pdf })), total: all.length, next: at + LIMITS.examples < all.length ? at + LIMITS.examples : null };
      }
      return invoke('design_examples', data, args, base, files);
    }
  },
  design_standards: {
    description: 'Standards: tokens (DTCG/CSS/JS), guide search/chunks and brand rules.',
    schema: z.object({ kind: z.enum(['tokens', 'guidelines', 'rules']).optional(), format: z.enum(['dtcg', 'css', 'js', 'tailwind']).optional(), group: text.optional(), query: text.optional(), section: text.optional(), page: text.optional(), lang: z.enum(['en', 'es', 'ca']).optional(), offset }).strict(),
    run(data, { kind = 'tokens', ...args }, base, files) {
      return invoke({ tokens: 'design_tokens', guidelines: 'design_guidelines', rules: 'brand_rules' }[kind], data, args, base, files);
    }
  }
};
export const INSTRUCTIONS = 'AIS Group Design downloads: Code, Assets, Examples, Standards. Read-only. Use registry/package source and tokens; never invent brand rules or product facts. Mascots held back; no machine CAD/models. Exterior renders only. Essential 1: Keep it simple.';
const omit = new Set(['maxLength', 'minLength', 'pattern', 'maximum', 'minimum', 'default', '$schema', 'additionalProperties']);
const lean = value => Array.isArray(value) ? value.map(lean) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([k]) => !omit.has(k)).map(([k, v]) => [k, lean(v)])) : value;
// The SDK's own schema check would refuse a bad enum without naming the valid values; the zod check in each call does.
const zodChecks = { getValidator: () => input => ({ valid: true, data: input, errorMessage: undefined }) };
export function serverFactory({ data, baseUrl, filesBase }) {
  return ctx => {
    const base = baseUrl || (ctx.requestInfo ? new URL(ctx.requestInfo.url).origin : '');
    const server = new McpServer({ name: 'ais-group-design', version: data.catalogue.version }, {
      instructions: INSTRUCTIONS,
      // Tools never change, and Hosting buffers streams: listChanged made clients wait 25 s on a listen stream.
      capabilities: { tools: { listChanged: false } },
    });
    for (const [name, tool] of Object.entries(TOOLS)) server.registerTool(name, { description: tool.description, inputSchema: fromJsonSchema(lean(z.toJSONSchema(tool.schema)), zodChecks), annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false } }, async args => {
      try {
        const parsed = tool.schema.safeParse(args ?? {});
        if (!parsed.success) throw new Error(z.prettifyError(parsed.error));
        return { content: [{ type: 'text', text: bounded(tool.run(data, parsed.data, base, filesBase)) }] };
      }
      catch (e) { return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: String(e.message).slice(0, 1000) }) }] }; }
    });
    return server;
  };
}
