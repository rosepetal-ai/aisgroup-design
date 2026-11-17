// Four download surfaces. The existing knowledge engine stays internal and read-only.
import fs from 'node:fs';
import path from 'node:path';
import { McpServer, fromJsonSchema } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { load as loadKnowledge, TOOLS as KNOWLEDGE, bounded, LIMITS } from './tools.mjs';
import { pending, APPROVED_MASCOTS } from './download-policy.mjs';

export function load(dir) {
  const data = loadKnowledge(dir);
  data.software = JSON.parse(fs.readFileSync(path.join(dir, 'examples/software.json'), 'utf8'));
  data.web = JSON.parse(fs.readFileSync(path.join(dir, 'downloads/aisgroup-web/index.json'), 'utf8'));
  data.webSource = f => fs.readFileSync(path.join(dir, 'downloads/aisgroup-web', f), 'utf8');
  data.presets = Object.fromEntries(['primevue', 'vuetify'].map(n => [n, fs.readFileSync(path.join(dir, 'downloads/vue-themes', n + '.mjs'), 'utf8')]));
  return data;
}
const text = z.string().trim().min(1).max(200), offset = z.number().int().min(0).max(1e6).optional();
const invoke = (name, data, args, base, files) => KNOWLEDGE[name].run(data, KNOWLEDGE[name].schema.parse(args), base, files);
const chunk = (source, at = 0) => {
  if (at >= source.length) throw new Error('Offset past the end');
  const end = Math.min(source.length, at + LIMITS.chunkChars);
  return { text: source.slice(at, end), offset: at, next: end < source.length ? end : null, total: source.length };
};
export const TOOLS = {
  design_code: {
    description: 'Code: Tailwind theme, Vue registry search/source, the websites\' Astro components (@aisgroup/web), PrimeVue and Vuetify presets.',
    schema: z.object({ kind: z.enum(['components', 'web', 'tailwind', 'primevue', 'vuetify']).optional(), query: text.optional(), name: z.string().regex(/^[a-z0-9-]{1,40}$/).optional(), offset }).strict(),
    run(data, { kind = 'components', query, name, offset }, base, files) {
      if (kind === 'tailwind') return invoke('design_tokens', data, { format: 'tailwind' }, base, files);
      if (['primevue', 'vuetify'].includes(kind)) return { ...chunk(data.presets[kind], offset), file: `${kind}.mjs`, url: `${files ?? `${base}/files`}/downloads/vue-themes/${kind}.mjs`, mapping: `${files ?? `${base}/files`}/downloads/vue-themes/README.md` };
      if (kind === 'web') {
        const url = f => `${files ?? `${base}/files`}/downloads/aisgroup-web/${f}`, page = id => `${base}/en/web-components/${id}/`;
        if (!name) {
          const items = data.web.items.filter(i => !query || `${i.name} ${i.title} ${i.description}`.toLowerCase().includes(query.toLowerCase()));
          return { package: data.web.package, setup: data.web.setup.map(url), shared: data.web.shared.map(url), items: items.map(({ files: f, examples, ...i }) => ({ ...i, page: page(i.name) })), total: items.length };
        }
        const item = data.web.items.find(i => i.name === name);
        if (!item) throw new Error(`No web component ${name}`);
        const source = [...item.files, ...item.examples].map(f => `// ${f}\n${data.webSource(f)}`).join('\n\n');
        return { ...item, page: page(name), urls: [...item.files, ...item.examples].map(url), ...chunk(source, offset) };
      }
      const result = invoke('design_components', data, { name }, base, files);
      if (query && result.items) result.items = result.items.filter(i => `${i.name} ${i.description ?? ''}`.toLowerCase().includes(query.toLowerCase()));
      return result;
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
    description: 'Examples: existing document HTML/PDF, software views and images. No machine models.',
    schema: z.object({ query: text.optional(), type: z.string().max(40).optional(), brand: text.optional(), product: text.optional(), id: z.string().regex(/^[a-z0-9/._-]{1,120}$/).refine(f => !f.split('/').includes('..')).optional(), offset }).strict(),
    run(data, args, base, files) {
      if (args.type === '3d-model') return { examples: [], total: 0, next: null, pending: pending['3d-model'] };
      if (args.type === 'image') {
        const r = invoke('design_assets', data, { kind: 'photo', query: args.query, offset: args.offset }, base, files);
        return { examples: r.assets, total: r.total, next: r.next, rules: r.rules };
      }
      const view = data.software.find(e => e.id === args.id);
      if (view) return { ...view, ...chunk(data.sources.get(view.source), args.offset), url: base + view.html, registry: base + view.registry };
      if (args.type === 'software-view') {
        const all = data.software.filter(e => !args.query || `${e.id} ${e.title} ${e.why}`.toLowerCase().includes(args.query.toLowerCase())), at = args.offset ?? 0;
        return { examples: all.slice(at, at + LIMITS.examples).map(e => ({ ...e, url: base + e.html, registry: base + e.registry })), total: all.length, next: at + LIMITS.examples < all.length ? at + LIMITS.examples : null };
      }
      if (args.type === 'pdf') {
        const all = data.examples.filter(e => e.pdf && (!args.query || `${e.id} ${e.title}`.toLowerCase().includes(args.query.toLowerCase()))), at = args.offset ?? 0;
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
export function serverFactory({ data, baseUrl, filesBase }) {
  return ctx => {
    const base = baseUrl || (ctx.requestInfo ? new URL(ctx.requestInfo.url).origin : '');
    const server = new McpServer({ name: 'ais-group-design', version: data.catalogue.version }, {
      instructions: INSTRUCTIONS,
      // Tools never change, and Hosting buffers streams: listChanged made clients wait 25 s on a listen stream.
      capabilities: { tools: { listChanged: false } },
    });
    for (const [name, tool] of Object.entries(TOOLS)) server.registerTool(name, { description: tool.description, inputSchema: fromJsonSchema(lean(z.toJSONSchema(tool.schema))), annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false } }, async args => {
      try { return { content: [{ type: 'text', text: bounded(tool.run(data, tool.schema.parse(args ?? {}), base, filesBase)) }] }; }
      catch (e) { return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: String(e.message).slice(0, 1000) }) }] }; }
    });
    return server;
  };
}
