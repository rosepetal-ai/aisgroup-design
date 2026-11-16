#!/usr/bin/env node
// Acceptance against the design-system spec: the skills tree 01 Brand Guidelines …
// 04 Digital Design and Resources, each topic a separately loadable skill or reference with real content, and the
// MCP organised by what you download (Code, Assets, Examples, Standards), each download answered by the hosted MCP.
// Plus the plugin packaging the spec asks for (agent-plugins.org root plugin.json + mcp.json, Claude and OpenAI).
//   node scripts/check-spec.mjs            (part of npm test, after the guide and hosted builds)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = path.join(ROOT, 'plugin/skills');
const errors = [], rows = [];
// A file's own words: pointer lines («Rule [AIS-…](…)»), headings, links-only lines and front matter don't count.
const words = (file) => {
  const text = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
  return text.split('\n').filter((l) => !/^\s*(?:#|Rule \[AIS-|- \[[^\]]*\]\([^)]*\)\s*$|\|?\s*-{3})/.test(l)).join(' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').split(/\s+/).filter(Boolean).length;
};
// [branch, topic, skill, reference file (or SKILL.md), pattern the content must contain]
const TREE = [
  ['01 Brand Guidelines', 'Logo and variants', 'brand-guidelines', 'logos.md', /variant|version/i],
  ['01 Brand Guidelines', 'Corporate colour', 'design-language', 'colour.md', /#17356E/i],
  ['01 Brand Guidelines', 'Corporate typography', 'design-language', 'typography.md', /Inter/],
  ['01 Brand Guidelines', 'Correct and incorrect use', 'brand-guidelines', 'logos.md', /never|don.t|incorrect|do not/i],
  ['02 Design Language', 'Design principles', 'brand-guidelines', 'index.md', /simple/i],
  ['02 Design Language', 'Colours and design tokens', 'design-language', 'tokens.md', /ais-tokens/],
  ['02 Design Language', 'Typography', 'design-language', 'typography.md', /\d+\s?px|pt\b/],
  ['02 Design Language', 'Grid and spacing', 'design-language', 'layout.md', /grid|column/i],
  ['02 Design Language', 'Layout and composition', 'design-language', 'layout.md', /margin|composition|layout/i],
  ['02 Design Language', 'Iconography', 'design-language', 'icons.md', /Lucide/],
  ['02 Design Language', 'Illustration', 'design-language', 'illustration.md', /illustration/i],
  ['02 Design Language', 'Motion', 'design-language', 'motion.md', /ms\b|duration|ease/i],
  ['02 Design Language', 'Light and dark themes', 'design-language', 'themes.md', /dark/i],
  ['03 Communications', 'Print and stationery: business cards', 'print-stationery', 'print.md', /business card|tarjeta/i],
  ['03 Communications', 'Print and stationery: printed materials', 'brochure', 'print-system.md', /A4|mm\b/],
  ['03 Communications', 'Digital documents: reports and PDFs', 'digital-documents', 'report.md', /report|PDF/i],
  ['03 Communications', 'Digital documents: proposals', 'sales-documents', 'workflow.md', /proposal|propuesta/i],
  ['03 Communications', 'Digital documents: presentations', 'presentation', 'workflow.md', /slide|deck/i],
  ['03 Communications', 'Marketing: brochures', 'brochure', 'workflow.md', /brochure/i],
  ['03 Communications', 'Marketing: product sheets', 'brochure', 'SKILL.md', /datasheet|product sheet/i],
  ['03 Communications', 'Marketing: social media', 'marketing', 'social.md', /linkedin/i],
  ['03 Communications', 'Motion and video: brand animations', 'brand-video', 'video.md', /intro|animation|end card/i],
  ['03 Communications', 'Motion and video: video templates', 'brand-video', 'workflow.md', /template|title|caption/i],
  ['04 Digital Design', 'Web: Tailwind', 'web-design', 'web-components.md', /Tailwind/],
  ['04 Digital Design', 'Web: page layouts', 'web-design', 'web.md', /page|section/i],
  ['04 Digital Design', 'Web: web patterns', 'web-design', 'web-components.md', /closing band|split button|footer/i],
  ['04 Digital Design', 'Product UI: UI components', 'product-ui', 'components.md', /Button|Dialog/],
  ['04 Digital Design', 'Product UI: interaction patterns', 'product-ui', 'using-components.md', /loading|empty|Retry/i],
  ['04 Digital Design', 'Product UI: data visualisation', 'design-language', 'data.md', /chart/i],
  ['04 Digital Design', 'Vue: shadcn-vue + Tailwind', 'product-ui', 'SKILL.md', /shadcn-vue/],
  ['04 Digital Design', 'Vue: PrimeVue + Tailwind', 'vue-primevue', 'adapter.md', /PrimeVue/],
  ['04 Digital Design', 'Vue: Vuetify', 'vue-vuetify', 'adapter.md', /Vuetify/],
  ['Resources and Assets', 'Logo and graphic assets', 'resources-assets', 'downloads.md', /logo/i],
  ['Resources and Assets', 'Templates', 'resources-assets', 'kit.md', /template|plantilla/i],
  ['Resources and Assets', 'Design tokens', 'resources-assets', 'downloads.md', /tokens/i],
  ['Resources and Assets', 'Component packages', 'product-ui', 'component-registry.md', /@rosepetal\/design/],
];
for (const [branch, topic, skill, ref, pattern] of TREE) {
  const file = ref === 'SKILL.md' ? path.join(SKILLS, skill, 'SKILL.md') : path.join(SKILLS, skill, 'references', ref);
  if (!fs.existsSync(path.join(SKILLS, skill, 'SKILL.md'))) { errors.push(`${branch} / ${topic}: no skill ${skill}.`); continue; }
  if (!fs.existsSync(file)) { errors.push(`${branch} / ${topic}: no ${path.relative(ROOT, file)}.`); continue; }
  const text = fs.readFileSync(file, 'utf8'), n = words(file);
  if (!pattern.test(text)) errors.push(`${branch} / ${topic}: ${path.relative(ROOT, file)} does not cover it (${pattern}).`);
  if (n < 40) errors.push(`${branch} / ${topic}: ${path.relative(ROOT, file)} has ${n} words of its own; the rules sit behind pointers.`);
  rows.push([branch, topic, `${skill}/${ref}`, n]);
}

// Packaging: agent-plugins.org root manifests, Claude's .claude-plugin, OpenAI's extension, skills auto-discovered.
const json = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, 'plugin', p), 'utf8'));
const plugin = json('plugin.json'), claude = json('.claude-plugin/plugin.json'), mcp = json('mcp.json');
if (!/^[a-z0-9-]+$/.test(claude.name) || (claude.description ?? '').length > 500) errors.push('.claude-plugin/plugin.json: name must be hyphen-only and description ≤ 500 characters.');
if (!plugin.extensions?.['com.openai']) errors.push('plugin.json: no com.openai extension.');
if (!mcp.mcpServers?.design?.url) errors.push('mcp.json: no hosted design server.');
if (fs.existsSync(path.join(ROOT, 'plugin/bin'))) errors.push('plugin/bin: Anthropic plugins have no top-level bin/.');

// The MCP by what you download, answered by the hosted server built from this checkout. In production the MCP and
// the guide share one origin, so a PDF link is a guide file: it must exist in the guide build.
const { start } = await import('../hosted/server.mjs');
const { Client, StreamableHTTPClientTransport } = await import('../hosted/node_modules/@modelcontextprotocol/client/dist/index.js').catch(() => import('@modelcontextprotocol/client'));
const server = await start({ port: 0, host: '127.0.0.1' });
const client = new Client({ name: 'spec-check', version: '1.0.0' });
await client.connect(new StreamableHTTPClientTransport(new URL(server.url + '/mcp')));
const call = async (name, args) => { const r = await client.callTool({ name, arguments: args }); if (r.isError) throw new Error(r.content[0].text); return JSON.parse(r.content[0].text); };
const fetchOk = async (url) => (await fetch(url)).status === 200;
const DOWNLOADS = [
  ['Code', 'Tailwind design', async () => (await call('design_code', { kind: 'tailwind' })).text?.includes('@theme')],
  ['Code', 'Vue components and component search', async () => (await call('design_code', { query: 'dialog' })).items?.some((i) => i.name === 'dialog')],
  ['Code', 'Website components (@aisgroup/web)', async () => (await call('design_code', { kind: 'web' })).items?.length >= 13],
  ['Code', 'PrimeVue preset', async () => fetchOk((await call('design_code', { kind: 'primevue' })).url)],
  ['Code', 'Vuetify preset', async () => fetchOk((await call('design_code', { kind: 'vuetify' })).url)],
  ['Assets', 'Logos', async () => (await call('design_assets', { kind: 'logo' })).total > 0],
  ['Assets', 'Favicons', async () => (await call('design_assets', { kind: 'favicon' })).total > 0],
  ['Assets', 'Patterns and backgrounds', async () => (await call('design_assets', { kind: 'background' })).total > 0],
  ['Assets', 'Mascots (held back by decision)', async () => typeof (await call('design_assets', { kind: 'mascot' })).pending === 'string'],
  ['Examples', 'HTML documents', async () => (await call('design_examples', {})).total > 0],
  ['Examples', 'Software views', async () => (await call('design_examples', { type: 'software-view' })).total > 0],
  ['Examples', '3D models (pending decision)', async () => typeof (await call('design_examples', { type: '3d-model' })).pending === 'string'],
  ['Examples', 'Images', async () => (await call('design_examples', { type: 'image' })).total > 0],
  ['Examples', 'PDFs', async () => { const r = await call('design_examples', { type: 'pdf' }); return r.total > 0 && r.examples.every((e) => fs.existsSync(path.join(ROOT, 'guide/dist', e.pdf))); }],
  ['Standards', 'tokens.json / DTCG', async () => JSON.stringify(await call('design_standards', { kind: 'tokens', format: 'dtcg' })).includes('$value')],
  ['Standards', 'Guidelines', async () => JSON.stringify(await call('design_standards', { kind: 'guidelines', query: 'logo' })).length > 200],
  ['Standards', 'Brand rules', async () => JSON.stringify(await call('design_standards', { kind: 'rules' })).length > 200],
];
try {
  for (const [group, item, check] of DOWNLOADS) {
    let ok = false, why = '';
    try { ok = await check(); } catch (e) { why = String(e.message).slice(0, 160); }
    if (!ok) errors.push(`MCP ${group} / ${item}: not served${why ? ` (${why})` : ''}.`);
    rows.push([`MCP ${group}`, item, ok ? 'served' : 'MISSING', '']);
  }
} finally { await client.close(); await server.close(); }

if (process.argv.includes('--table')) for (const r of rows) console.log(r.join(' | '));
if (errors.length) { console.error(`Spec check: ${errors.length} gaps.\n  - ${errors.join('\n  - ')}`); process.exit(1); }
console.log(`Spec holds: ${TREE.length} topics of the skills tree with their own content, ${DOWNLOADS.length} downloads served by the MCP, plugin packaged for agent-plugins, Claude and OpenAI.`);
