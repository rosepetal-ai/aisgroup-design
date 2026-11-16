import type { APIRoute } from 'astro';
import { PROFILER_PARTS, ROSEPETAL_WIDGETS, WIDGETS } from '../data/catalog.js';
import { blockItems, componentItems, sourceOf, version } from '../design/package';

// The index agents read to find a part: what it is for and where its code is. The components and blocks are
// @aisgroup/design's own catalogue (packages/design/catalog.ts), read through the workspace; the widgets and the
// Profiler's parts live in their own repos. Source files as repo@branch:path, readable from any repo
// (gh api repos/<repo>/contents/<path>?ref=<branch>).
const PROFILER = 'rosepetal-ai/rosepetal-node-red-profiler';
const WIDGETS_REPO = 'rosepetal-ai/rosepetal-node-red-dashboard-contrib';

export const GET: APIRoute = ({ site }) => {
  const base = site ? site.href.replace(/\/$/, '') : '';
  const page = (p: string) => `${base}/en/${p}/`;
  const lines = [
    '# Rosepetal design system: component index', '',
    `Every component and brand block of \`@aisgroup/design\` ${version} (\`${sourceOf('packages/design')}\`), the Node-RED widgets and the Profiler's parts. Each entry gives what it is for and its source as \`owner/repo@branch:path\`. Apps install the package (\`npm i @aisgroup/design\`, from the company's Artifact Registry) and import \`@aisgroup/design/styles.css\` after Tailwind. The code of every component and block is also a shadcn-vue registry item: install it with \`npx shadcn-vue@latest add https://design.aisgroup.ai/r/<id>.json\` (the tokens are \`r/theme.json\`), read it with the MCP tool design_code, or open \`brand/registry/<id>.json\` in the AIS Group Design plugin. Live examples: ${page('components')}<id>/. When this index and the code disagree, the code is right about how a part works and the guide is right about how to use it. Brand rules: ${base}/en/brand.md.`, '',
    '## Components', '', `Stock shadcn-vue in the Rosepetal look. Import: \`import { Button } from '@aisgroup/design/ui/button'\`.`, '',
    ...componentItems.map((c) => `- **${c.name}** (\`${c.id}\`): ${c.description ?? ''} \`${sourceOf(c.file ?? `packages/design/ui/${c.id}`)}/\``), '',
    '## Blocks', '', 'Brand pieces built from the components, with no app logic: texts and data come from each app. Import: `import TopBar from \'@aisgroup/design/blocks/TopBar.vue\'`.', '',
    ...blockItems.map((b) => `- **${b.name}** (\`${b.id}\`): ${b.description ?? ''} \`${sourceOf(b.file!)}\``), '',
    '## Node-RED dashboard widgets', '', 'Stock FlowFuse widgets in the Rosepetal theme.', '',
    ...WIDGETS.map(([, t, d]: string[]) => `- **${t}**: ${d}`), '',
    '## Rosepetal widgets', '', `Source: \`${WIDGETS_REPO}\`.`, '',
    ...ROSEPETAL_WIDGETS.map(([id, t, d]: string[]) => `- **${t}** (\`rp-${id}\`): ${d}`), '',
    '## Profiler', '', `Source: \`${PROFILER}:src/domains/configurator/components/<file>\`.`, '',
    ...PROFILER_PARTS.map(([id, t, d, file]: string[]) => `- **${t}** (\`${id}\`): ${d} \`${file}\``), '',
    '## Websites', '', `The website components and the site assets: ${page('web-components')}, ${page('assets')}. Brand rules for the sites: ${base}/en/brand.md.`, '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
