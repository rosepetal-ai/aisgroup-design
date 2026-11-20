// @aisgroup/design as a shadcn-vue registry, so any app can install a component's real source:
//   npx shadcn-vue@latest add https://design.aisgroup.ai/r/button.json
// and agents fetch the same JSON (files with their content) through the MCP. Built from packages/design, through the
// workspace; /r/registry.json lists every item. The package imports its own parts by relative path (../../lib/utils,
// ../button); here they become the shadcn aliases (@/lib/utils, @/components/ui/button), as the CLI expects.
// Apps that can install the package should install it instead (npm i @aisgroup/design): the registry is for copying.
import type { APIRoute } from 'astro';
import { posix } from 'node:path';
import { blockItems, componentItems, files, sourceOf, styles, version } from '../../design/package';

const NPM = ['reka-ui', '@vueuse/core', 'class-variance-authority', '@lucide/vue', 'vue-sonner', 'clsx', 'tailwind-merge', 'tw-animate-css', 'embla-carousel-vue', '@tanstack/vue-table', '@unovis/vue', '@unovis/ts', '@internationalized/date'];
const SITE = 'https://design.aisgroup.ai';

// Where a package file goes in an app, as shadcn-vue lays it out.
const target = (p: string) => p.replace(/^ui\//, 'components/ui/').replace(/^blocks\//, 'components/blocks/');
// An import of another package file, rewritten to the alias of its place in an app.
const rewrite = (code: string, file: string) => code.replace(/(from\s+|import\s+)(['"])(\.{1,2}\/[^'"]+)\2/g, (all, kw, q, spec) => {
  const dir = posix.dirname(file), to = posix.normalize(posix.join(dir, spec));
  // Files beside it travel with it and keep their relative import.
  if (to === dir || to.startsWith(`${dir}/`) || !/^(ui|blocks|lib)\//.test(to)) return all;
  return `${kw}${q}@/${target(to).replace(/\.ts$/, '')}${q}`;
});
// The package files another file imports beside it (the blocks' logo and inspection grid), followed one level at a time.
const local = (file: string, seen = new Set([file])): string[] => {
  const dir = posix.dirname(file);
  const own = [...(files[file] ?? '').matchAll(/from\s+['"](\.\/[^'"]+)['"]/g)].map((m) => posix.join(dir, m[1]))
    .map((p) => [p, `${p}.ts`, `${p}.vue`].find((c) => c in files) ?? '').filter((p) => p && !seen.has(p));
  own.forEach((p) => seen.add(p));
  return [...own, ...own.flatMap((p) => local(p, seen))];
};

type Item = { name: string; type: string; title: string; description: string; paths: string[] };
const items: Item[] = [
  ...componentItems.map((c) => ({ name: c.id, type: 'registry:ui', title: c.name, description: c.description ?? '', paths: Object.keys(files).filter((f) => f.startsWith(`ui/${c.id}/`)).sort() })),
  ...blockItems.map((b) => { const main = b.file!.replace(/^packages\/design\//, ''); return { name: b.id, type: 'registry:block', title: b.name, description: b.description ?? '', paths: [main, ...local(main)] }; }),
  { name: 'utils', type: 'registry:lib', title: 'cn', description: 'Joins class names and resolves Tailwind conflicts.', paths: ['lib/utils.ts'] },
];
const ids = new Map(componentItems.map((c) => [`ui/${c.id}`, c.id]));

const item = (it: Item) => {
  const content = it.paths.map((p) => rewrite(files[p], p));
  // Other items this one imports: ui components, blocks and the utils.
  const deps = [...new Set(content.flatMap((c) => [...c.matchAll(/['"]@\/(?:components\/(ui\/[a-z-]+)|lib\/(utils))['"]/g)].map((m) => (m[2] ? 'utils' : ids.get(m[1]) ?? ''))))]
    .filter((d) => d && d !== it.name);
  return {
    $schema: 'https://shadcn-vue.com/schema/registry-item.json',
    name: it.name, type: it.type, title: it.title, description: it.description,
    dependencies: NPM.filter((d) => content.some((c) => c.includes(`'${d}'`) || c.includes(`"${d}"`))),
    registryDependencies: deps.map((d) => `${SITE}/r/${d}.json`),
    files: it.paths.map((p, i) => ({ path: target(p), type: it.type, content: content[i] })),
    meta: { package: `@aisgroup/design@${version}`, source: sourceOf(`packages/design/${it.paths[0]}`) },
  };
};

// The tokens: the package's styles.css, as an app imports it after Tailwind.
const theme = {
  $schema: 'https://shadcn-vue.com/schema/registry-item.json',
  name: 'theme', type: 'registry:file', title: 'Theme', description: 'The tokens of every Rosepetal product: @aisgroup/design/styles.css (Tailwind v4).',
  dependencies: ['tw-animate-css'], registryDependencies: [],
  files: [{ path: 'assets/theme.css', type: 'registry:file', target: 'src/assets/theme.css', content: styles.replace(/^@source .*\n/gm, '') }],
  meta: { package: `@aisgroup/design@${version}`, source: sourceOf('packages/design/styles.css') },
};

export const getStaticPaths = () => [
  { params: { name: 'registry' }, props: { body: { $schema: 'https://shadcn-vue.com/schema/registry.json', name: 'rosepetal', homepage: SITE, items: [...items, theme].map(({ name, type, title, description }) => ({ name, type, title, description })) } } },
  ...items.map((it) => ({ params: { name: it.name }, props: { body: item(it) } })),
  { params: { name: 'theme' }, props: { body: theme } },
];
export const GET: APIRoute = ({ props }) => new Response(JSON.stringify(props.body, null, 2), { headers: { 'Content-Type': 'application/json' } });
