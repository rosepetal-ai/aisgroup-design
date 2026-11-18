// Build a reviewable proposal first. --apply is deliberately gated on the shared workers' clean files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const TREE = [
  { name: 'brand-guidelines', branch: '01 Brand Guidelines', pages: ['index', 'brands', 'logos'], description: 'Use for AIS brand architecture, choosing an issuing brand, logo variants, corporate identity and correct or incorrect logo use.', steps: ['Identify the issuing brand and medium before choosing a logo.', 'Read only the matching reference. Corporate colour and type are owned by design-language; do not invent a second palette.', 'Use supplied logo files and check contrast, clear space and minimum width against logos.md.'] },
  { name: 'design-language', branch: '02 Design Language', pages: ['colour', 'typography', 'layout', 'imagery', 'patterns', 'icons', 'illustration', 'data', 'motion', 'themes', 'accessibility'], description: 'Use when choosing AIS principles, colour tokens, typography, grid, spacing, illustration, motion, themes, charts or accessibility rules.', steps: ['Identify the medium: product UI, web or communications. Their type, grid and corner rules differ.', 'Load only the relevant topic below. Read themes.md for light/dark behaviour and tokens.md for exact values.', 'Apply the guide’s existing rules. Do not create new brand standards to fill a missing example.'] },
  { name: 'communications', branch: '03 Communications / Voice and localisation', pages: ['voice', 'localisation'], description: 'Load before writing, rewriting, editing or reviewing AIS copy, captions, headlines, claims or quotes in Spanish, English or Catalan.', steps: ['Collect the exact source, product, figure and conditions. No source means no invented claim, certification, customer or quote.', 'Draft in the target language, then cut anything that does not serve the message. Use «» quotations and no middle-dot separators.', 'Read voice.md and localisation.md; consult the writing references for the requested format.', 'Run node engine/text-check.mjs on the draft from plugin/. Resolve errors before export.'] },
  { name: 'print-stationery', branch: '03 Communications / Print and Stationery', pages: [], description: 'Use for AIS business cards, letterheads, office stationery and printed materials; find the existing template and print rules.', steps: ['Find the existing office or business-card template through resources-assets and the studio catalogue.', 'For printed material, use the shared print system. Read print.md before selecting a template.', 'Business cards contain personal data. Keep their source private; do not publish it or invent contact details.'] },
  { name: 'digital-documents', branch: '03 Communications / Digital Documents', pages: ['communications'], description: 'Use for AIS technical reports and PDFs, document composition, tables and specification blocks; route offers to sales-documents and decks to presentation.', steps: ['Read communications.md for the exact document pattern and type scale.', 'Use an existing editable template. Read report.md for the supported technical-report rules and current gaps.', 'Preserve each source product’s figures and conditions. Validate text, render and inspect each page before delivery.'] },
  { name: 'marketing', branch: '03 Communications / Marketing', pages: ['social'], description: 'Use to choose the AIS marketing format and its existing production workflow: brochure, datasheet, social post, carousel or banner.', steps: ['Choose the deliverable: brochure also owns product sheets and datasheets; social-post owns single feed posts; linkedin-carousel owns multi-page posts; linkedin-banner owns banners.', 'Read social.md for platform rules, then load only that deliverable’s task skill.', 'Use approved source facts and assets; never build a new template when an accepted family exists.'] },
  { name: 'web-design', branch: '04 Digital Design / Web', pages: ['web', 'web-components', 'assets'], description: 'Use to build or review AIS company website layouts, shared Astro components, web patterns and the product Tailwind theme boundary.', steps: ['Use @aisgroup/web for company websites; product screens use @aisgroup/design.', 'Read web.md and web-components.md before editing layout or shared components; use assets.md for site media.', 'Use the package source, existing examples and website roles. Tailwind v4 product code comes from design_code kind=tailwind.'] },
  { name: 'product-ui', branch: '04 Digital Design / Product UI / shadcn-vue + Tailwind', pages: ['using-components', 'pages', 'components', 'node-red-widgets'], description: 'Load before planning, building, editing or reviewing Rosepetal app screens, Vue tables, forms, dialogs or Node-RED panels with @aisgroup/design.', steps: ['Read components.json and package.json to identify the actual stack. @aisgroup/design is the source for shadcn-vue components and styles.css is the Tailwind v4 theme.', 'Search design_code, read the registry item and existing package examples before composing a screen. Never scrape a deployed screen for source.', 'Read using-components.md for async states, tables, dialogs and dataset colours; design-language owns the general chart rules.', 'For PrimeVue or Vuetify use their adapter skill. For review, theme comparison or convergence use ui-audit, ui-theme-diff or ui-unify.'] },
  { name: 'vue-primevue', branch: '04 Digital Design / Product UI / Vue / PrimeVue + Tailwind', pages: [], description: 'Use when an AIS Vue app already uses PrimeVue with Tailwind and needs the token preset, light/dark setup or component mapping.', steps: ['Confirm PrimeVue in package.json. Read adapter.md and request design_code kind=primevue.', 'Use the generated preset from packages/vue-themes/primevue.mjs, .dark selector and the documented Tailwind layer order.', 'Map component jobs to the existing AIS rules; do not claim that a colour preset implements all brand blocks.', 'Run node packages/vue-themes/check-build.mjs and ui-audit for the changed screen.'] },
  { name: 'vue-vuetify', branch: '04 Digital Design / Product UI / Vue / Vuetify', pages: [], description: 'Use when an AIS Vue app uses Vuetify and needs generated light/dark themes or a mapping to AIS component and interaction rules.', steps: ['Confirm Vuetify in package.json. Read adapter.md and request design_code kind=vuetify.', 'Install the generated theme config from packages/vue-themes/vuetify.mjs. Switch between aisLight and aisDark.', 'Map existing jobs to Vuetify counterparts. Geometry, typography, density and icons need application adaptation; theme colours alone do not establish compliance.', 'Run the adapter build and ui-audit on changed screens in both modes.'] },
  { name: 'resources-assets', branch: 'Resources & Assets', pages: ['downloads', 'kit'], description: 'Use to find AIS logos, graphics, templates, token files, component packages and approved download links; no asset creation.', steps: ['Choose the download surface: Code, Assets, Examples or Standards. Read downloads.md or kit.md only as needed.', 'Use design_assets for logos, favicons, patterns and approved media; design_code for source/presets; design_examples for existing HTML, software views, images and PDFs; design_standards for tokens and rules.', 'Illustrations and mascots are held back. Their asset slots stay empty; do not publish proposals. Machine CAD/models are excluded; use approved exterior renders and refer 3D-model requests to the brand owners.'] },
  { name: 'agent-integration', branch: 'Resources & Assets / AI agents and setup', pages: ['agents'], description: 'Use to connect AIS skills, the local studio, the hosted read-only MCP and the Vue registry to an agent or developer workflow.', steps: ['Read agents.md for the existing integration contract; use setup for local renderer installation and repair.', 'Keep rendering in studio and knowledge/downloads in hosted MCP. Do not deploy or publish a package as part of connection setup.', 'Use root plugin.json and mcp.json for portable clients; Claude Code keeps its userConfig media folder in .claude-plugin/plugin.json.'] },
  { name: 'ui-audit', branch: '04 Digital Design / Product UI / Audit', pages: [], description: 'Use to audit an existing AIS product screen against component, token, interaction, accessibility and light/dark rules; report evidence before fixes.', steps: ['Identify files and stack, then read audit.md and the product-ui references for only those components.', 'Run node scripts/ui-contract.mjs audit <files...> from the design-system repo for bounded static findings. It does not prove visual compliance.', 'Check keyboard, focus, loading, empty and failure states in the actual app in both themes; render/screenshot under the shared render lock when browser access is available.', 'Report file/line, source rule, observed behaviour and a concrete fix. Mark unavailable runtime checks as unverified.'] },
  { name: 'ui-theme-diff', branch: '04 Digital Design / Product UI / Theme diff', pages: [], description: 'Use to compare AIS product theme tokens with another CSS token set or check generated PrimeVue/Vuetify presets for drift.', steps: ['Identify the candidate token file and the canonical packages/design/styles.css. Read theme-diff.md.', 'Run node scripts/ui-contract.mjs diff <candidate.css>; inspect missing, changed and unresolved tokens in both modes.', 'Run node packages/vue-themes/generate.mjs --check. Do not approve a difference or change brand values merely because the candidate uses them.'] },
  { name: 'ui-unify', branch: '04 Digital Design / Product UI / Unify', pages: [], description: 'Use to converge an existing Rosepetal UI on canonical components and tokens, preserving screen behaviour, data and supported states.', steps: ['Inventory the screen, dependencies, variants and states. Read unify.md and run ui-audit first. Use the package blocks before composing your own; other products are examples, not layouts to copy, and the package wins over the app\'s own design notes.', 'Use package/registry source and the adapter mapping for the detected stack; replace one component family at a time.', 'Preserve dataset/image cards, facts, forms, actions and error states. Do not remove working content to make the screenshot simpler.', 'Build the affected app and verify interactions and both themes. Look at each changed screen in a browser against the guide and say which screens were not seen. Keep unresolved differences explicit.'] }
];
const TASKS = {
  brochure: ['03 Communications / Marketing / Brochures and product sheets', 'Use to build or edit an AIS brochure, catalogue, one-pager or datasheet on the existing print system.'],
  presentation: ['03 Communications / Digital Documents / Presentations', 'Use to create or edit AIS slide decks and export HTML, PDF or PPTX with the existing presentation system.'],
  'sales-documents': ['03 Communications / Digital Documents / Proposals and case studies', 'Use for an AIS commercial proposal, offer, quotation or approved case-study sheet on the print system.'],
  'social-post': ['03 Communications / Marketing / Social media', 'Use for one AIS LinkedIn feed post with sourced copy and approved imagery; not carousels or banners.'],
  'linkedin-carousel': ['03 Communications / Marketing / Social media', 'Use for an AIS LinkedIn carousel with multiple pages; not a single feed post, banner or slide presentation.'],
  'linkedin-banner': ['03 Communications / Marketing / Social media', 'Use for an AIS company or personal LinkedIn banner using the existing banner kit; not feed posts or carousels.'],
  'brand-video': ['03 Communications / Motion and Video', 'Use for AIS brand animations or video edits using approved intro footage, existing templates and the video workflow.'],
  'asset-library': ['Resources & Assets / Local media', 'Use to search, inspect or register local AIS photos, renders and footage in the studio library, including provenance and approval.'],
  'brand-review': ['Quality / Brand review', 'Use to review an AIS marketing piece against the brand before delivery; identify source-backed failures and concrete fixes.'],
  'render-review': ['Quality / Render review', 'Use to judge an AIS product render or image for physical credibility, identity, crop and final-size quality.'],
  setup: ['Resources & Assets / AI agents and setup', 'Use to install or repair the local AIS studio renderer and inspect missing dependencies or media-folder setup.']
};
export const INVENTORY = [...TREE, ...Object.entries(TASKS).map(([name, [branch, description]]) => ({ name, branch, description, pages: name === 'brand-video' ? ['video'] : [] }))];
const read = file => fs.readFileSync(file, 'utf8');
const strip = value => value.replace(/^---\n[\s\S]*?\n---\n*/, '');
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
const SHORT = {
  'brand-guidelines': "01. Load before choosing AIS logos, issuing brands or clear space.",
  'design-language': "02. AIS report/app/web type, grid and themes; tipografía, tamaños y retícula.",
  communications: "03. Load for AIS captions/copy in EN/ES/CA; redacción, pies, voz y estilo.",
  'print-stationery': '03. Find AIS business-card, letterhead and print stationery templates.',
  'digital-documents': '03. Plan AIS reports/PDFs, tables and document composition from source.',
  marketing: "03. Choose AIS brochure, single-post or carousel workflows before drafting.",
  'web-design': "04. Load before AIS website sections; @aisgroup/web and web components.",
  'product-ui': "04. Load before planning Rosepetal Vue tables, forms or product screens.",
  'vue-primevue': '04. Set up AIS PrimeVue + Tailwind presets, themes and component mappings.',
  'vue-vuetify': "04. Load for AIS Vuetify setup, light/dark themes and adapter limits.",
  'resources-assets': "Load for AIS downloads and design-MCP client calls: Code, Assets, Examples, Standards.",
  'agent-integration': 'Load for AIS plugin migration/upgrades, old writing routes and agent/MCP connections.',
  'ui-audit': "04. Load before auditing Rosepetal Vue snippets or existing product screens.",
  'ui-theme-diff': '04. Compare product CSS tokens and detect PrimeVue/Vuetify theme drift.',
  'ui-unify': '04. Unify Rosepetal UI, preserving data, behaviour and supported states.',
  brochure: "03. Load before changing AIS brochure or datasheet sources and exports.",
  presentation: '03. Build/edit AIS decks and export HTML, PDF or PPTX.',
  'sales-documents': "03. Load before AIS proposals, quotations or case studies; source facts.",
  'social-post': '03. Make one AIS LinkedIn feed post; not carousels or banners.',
  'linkedin-carousel': '03. Make AIS LinkedIn carousels from shared layouts; not slide decks.',
  'linkedin-banner': '03. Make AIS LinkedIn company/personal banners; not feed posts.',
  'brand-video': '03. Make AIS brand videos/animations with official intros and templates.',
  'asset-library': "Find approved AIS photos or images; check provenance, rights and print size.",
  'brand-review': "Load before reviewing AIS sales drafts, claims or testimonials for delivery.",
  'render-review': "Load before reviewing AIS images for print readiness or physical credibility.",
  setup: "06. Load before fixing AIS studio renderer setup: missing Chromium, Python or media folders.",
};
const front = (name, description, branch) => `---\nname: ${name}\ndescription: ${JSON.stringify(SHORT[name] ?? description)}\n---\n\n# ${name}\n\n`;

export function proposal(out) {
  const source = path.join(ROOT, 'plugin/skills'), guide = path.join(ROOT, 'guide');
  if (path.resolve(out) === source) throw new Error('Build a separate proposal before applying');
  fs.mkdirSync(out, { recursive: true }); fs.cpSync(source, out, { recursive: true, filter: file => !/(?:^|\/)__pycache__(?:\/|$)|\.pyc$/.test(file) });
  // Once integrated, the live entrypoints and workflows are canonical. Packaging
  // and verification copy them; they must never reconstruct the old 17-skill tree.
  if (INVENTORY.every(skill => fs.existsSync(path.join(source, skill.name, 'SKILL.md'))) && !fs.existsSync(path.join(source, 'writing/SKILL.md'))) return { skills: INVENTORY.length, pages: INVENTORY.flatMap(s => s.pages).length, owner: Object.fromEntries(INVENTORY.flatMap(s => s.pages.map(p => [p, s.name]))) };
  const essential = read(path.join(source, 'brand-guidelines/SKILL.md')).match(/^1\. (\*\*Keep it simple:\*\*.*)$/m)?.[1];
  if (!essential) throw new Error('No canonical essential');
  const copy = (from, to) => { if (fs.existsSync(from)) { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); } };
  // Each guide page has one canonical owner. Existing guide references keep their text, not a second authored copy.
  const owner = Object.fromEntries(TREE.flatMap(s => s.pages.map(p => [p, s.name])));
  owner.video = 'brand-video';
  for (const dir of fs.readdirSync(source)) {
    const refs = path.join(source, dir, 'references');
    if (!fs.existsSync(refs)) continue;
    for (const f of fs.readdirSync(refs)) {
      const next = owner[path.basename(f, '.md')];
      if (!next || next === dir) continue;
      copy(path.join(refs, f), path.join(out, next, 'references', f)); fs.rmSync(path.join(out, dir, 'references', f));
    }
  }
  // The old writing skill overlapped voice/localisation. Preserve its method and both references under communications.
  copy(path.join(source, 'writing/references/formats.md'), path.join(out, 'communications/references/writing-formats.md'));
  copy(path.join(source, 'writing/references/tells.md'), path.join(out, 'communications/references/writing-tells.md'));
  write(path.join(out, 'communications/references/writing-workflow.md'), strip(read(path.join(source, 'writing/SKILL.md'))).replace(essential, '').replaceAll('references/formats.md', 'writing-formats.md').replaceAll('references/tells.md', 'writing-tells.md'));
  fs.rmSync(path.join(out, 'writing'), { recursive: true });
  const notes = {
    'print-stationery/print.md': '# Print and stationery\n\nRead resources-assets/references/kit.md for the office kit and digital-documents/references/communications.md for printed-material composition. The guide names letterhead and Word templates. PowerPoint starts from the closest deck PPTX export; new decks use presentation. The private business-card sources are plugin/pieces/stationery/business-cards/; do not include them in a public download or plugin upload. A public business-card specification is missing. Use existing templates without inventing a card grid, size or contact.\n',
    'digital-documents/report.md': '# Reports and PDFs\n\nSource: guide/src/content/guide/en/communications.mdx, Technical report.\n\nTitle page in brand blue; body text 10.5 pt on 15 pt Inter; numbered sections; tabular figures in tables. No print text below 8.5 pt.\n\nUse the exact composition and table rules in communications.md. The guide supplies no dedicated approved report/PDF template. Route a proposal to sales-documents and a deck to presentation rather than presenting either as an approved report template.\n',
    'vue-primevue/adapter.md': '# PrimeVue + Tailwind\n\nSource and complete component mapping: packages/vue-themes/README.md, generated preset: packages/vue-themes/primevue.mjs. Use design_code kind=primevue for download and mapping URLs. Configure PrimeVue with the preset, darkModeSelector .dark and the Tailwind cascade order documented there. Read product-ui/references/using-components.md for interaction and target rules. The adapter is a token preset, not a new component package.\n',
    'vue-vuetify/adapter.md': '# Vuetify\n\nSource and complete component mapping: packages/vue-themes/README.md, generated themes: packages/vue-themes/vuetify.mjs. Use design_code kind=vuetify for download and mapping URLs. Configure createVuetify with the exported theme options and switch between aisLight and aisDark. Read product-ui/references/using-components.md for behaviour. Colours are adapted; geometry, density, typography and icons still need an app adapter and actual visual checks.\n',
    'ui-audit/audit.md': '# Product UI audit\n\nSource rules: product-ui/references/using-components.md; design-language/references/accessibility.md and themes.md. Run scripts/ui-contract.mjs audit on changed Vue/CSS source. Its findings cover literal colours, stock palette classes, radius overrides and raw radii in CSS, separators and Unicode arrows, icons in dialog footer buttons, dialogs that never close on a click outside, Sign out in the account menu, and, as checks, small text and side-by-side grids with items-start; comments and data strings can produce candidates requiring inspection. It cannot prove contrast, keyboard operation or target size. Inspect the actual component source and runtime before declaring a violation. Report file and line, source rule, evidence and fix; separate unverified runtime checks.\n',
    'ui-theme-diff/theme-diff.md': '# Theme diff\n\nCanonical source: packages/design/styles.css. Run scripts/ui-contract.mjs diff candidate.css; the script resolves aliases in :root, html and .dark and compares both modes. It is scoped to this package’s token layout, not a general CSS cascade parser. Unresolved aliases are errors. Run packages/vue-themes/generate.mjs --check to check adapter drift. Differences need a source-backed decision, never automatic palette changes.\n',
    'ui-unify/unify.md': '# Unify an existing product UI\n\nUse product-ui/references/using-components.md and registry/package code as the target; choose the relevant Vue adapter only after reading package.json. Audit and inventory the current screen first. Preserve behaviour, image/dataset cards, content and state transitions while replacing one component family. Run the actual application build, inspect both modes and test keyboard/async states. No automatic codemod or browser audit exists here; do not claim these checks ran without evidence.\n\n## Take the product, not only the parts\n\nThe guide and the package are the target. A product already on them is an example of applying them, not a layout to copy: each app keeps the layout its own content needs. Use a block wherever one fits (TopBar with light and dark mode, PageLayout, LoginPage, ConfirmDialog) before composing your own. When the app’s own design notes disagree with the package, the package wins: rewrite the notes.\n\nBefore calling a screen done, check it against product-ui/references/using-components.md, in particular:\n\n- borders and the pointer on buttons come from the package’s base styles (a version that has them), not the app;\n- a selected row or item is `bg-muted font-medium`; status is a toned icon and the word;\n- dialog footer buttons are text only; a dialog closes on a click outside or Esc, except while its action runs;\n- the account menu ends with Log out;\n- Cards side by side share their row’s height;\n- corners and colours come only from the package tokens, and `ui-contract.mjs audit` reports nothing but checks.\n\nWhen one finding is fixed, search the app for every other instance of it. Look at each changed screen in a browser, in light and dark, against the guide; when the app needs a sign-in you cannot do, say which screens were not seen.\n'
  };
  for (const [file, body] of Object.entries(notes)) write(path.join(out, file.split('/')[0], 'references', file.split('/')[1]), body);
  for (const s of TREE) {
    const refs = path.join(out, s.name, 'references'); fs.mkdirSync(refs, { recursive: true });
    for (const page of s.pages) {
      const file = path.join(refs, page + '.md');
      if (fs.existsSync(file)) continue;
      const mdx = path.join(guide, 'src/content/guide/en', page + '.mdx');
      const text = read(mdx), match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/), meta = parse(match[1]);
      const body = match[2].replace(/^import .*\n/gm, '').replace(/<[A-Z][\s\S]*?\/>/g, '').replace(/\n{3,}/g, '\n\n');
      write(file, `# ${meta.title}\n\nSource: guide/src/content/guide/en/${page}.mdx.\n\n${(meta.rules ?? []).map(r => '- ' + r).join('\n')}\n\n${body}`);
    }
    const links = fs.readdirSync(refs).filter(f => f.endsWith('.md')).map(f => `- [${f.replace('.md', '')}](references/${f})`).join('\n');
    write(path.join(out, s.name, 'SKILL.md'), front(s.name, `${s.branch}. ${s.description}`, s.branch) + essential + '\n\n' + s.steps.map((step, i) => `${i + 1}. ${step}`).join('\n') + '\n\nRead only the reference needed for this task.\n\n' + links + '\n');
  }
  const shared = new Map();
  for (const [name, [branch, description]] of Object.entries(TASKS)) {
    const old = read(path.join(source, name, 'SKILL.md'));
    let workflow = strip(old).replace(essential, '').replace(/^# .*\n/, '').trim();
    workflow = workflow.split(/\n\s*\n/).map(p => {
      if (p.length < 300) return p;
      const key = p.replace(/\s+/g, ' ').trim();
      if (!shared.has(key)) { shared.set(key, { owner: name, id: shared.size + 1, text: p }); return p; }
      return `Shared production detail: read ../../${shared.get(key).owner}/references/workflow.md.`;
    }).join('\n\n');
    // Rebase local Markdown links now that the instructions live one directory deeper.
    workflow = workflow.replace(/\]\(([^)#]+)(#[^)]*)?\)/g, (all, link, hash = '') => {
      if (/^(?:https?:|\/|#)/.test(link)) return all;
      const oldTarget = path.resolve(source, name, link);
      const dest = path.join(out, path.relative(source, oldTarget).replace(/^writing\//, 'communications/'));
      return `](${path.relative(path.join(out, name, 'references'), dest)}${hash})`;
    });
    write(path.join(out, name, 'references/workflow.md'), `# ${name} production workflow\n\n${workflow}\n`);
    const main = name === 'brand-guidelines' ? '' : essential + '\n\n';
    let steps;
    if (name === 'setup') steps = '1. Read [setup workflow](references/workflow.md) and run its diagnostic before installing dependencies.\n2. Configure the existing media-folder setting and report missing system tools.\n';
    else if (name === 'asset-library') steps = '1. Read [media-library workflow](references/workflow.md) for search, inspection and registration.\n2. Identify the actual file, provenance, approval, rights and intended use.\n3. Return verified candidates and explicit gaps; register or change media only when requested.\n';
    else if (name === 'brand-review') steps = '1. Read [brand-review workflow](references/workflow.md) and the actual piece or supplied evidence. If the user supplies claims without a file, review those claims; do not substitute an unrelated catalogue example for the draft.\n2. Apply the source-backed checklist and distinguish observed failures from unavailable checks.\n3. Report each failure, its evidence and a concrete fix for the requested piece.\n';
    else if (name === 'render-review') steps = '1. Read [image-review workflow](references/workflow.md), then inspect the actual image at its intended size.\n2. Compare identity, arrangement, physical credibility and detail with the supplied source or accepted baseline.\n3. State what was inspected and what remains unverified; a preview alone does not certify print readiness.\n';
    else if (name === 'presentation') steps = '1. Read [plan_piece first](../_shared/references/studio-protocol.md), then [presentation workflow](references/workflow.md) for exact sources and commands.\n2. Preserve the existing renderer, original facts and usable images. Give each slide one main idea; split a crowded slide instead of shrinking its text.\n3. Plan or run the HTML, PDF and PPTX build, verification and visual checks under the shared lock; state what actually ran.\n';
    else steps = `1. Read [plan_piece first](../_shared/references/studio-protocol.md), then [${name} workflow](references/workflow.md) for exact source files and commands.\n\n2. Use the existing template, verified facts and approved assets. Keep unknown facts explicit.\n3. Run its text and structural checks, render under the shared lock, then inspect the actual output before delivery.\n`;
    const extra = name === 'brand-video' ? '\nRead [video](references/video.md) for the guide’s brand animation and video-template rules.\n' : '';
    write(path.join(out, name, 'SKILL.md'), front(name, `${branch}. ${description}`, branch) + main + steps + extra);
  }
  return { skills: INVENTORY.length, pages: Object.keys(owner).length, owner };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv.find(a => a.startsWith('--out='))?.slice(6);
  if (!out) throw new Error('Pass --out=<proposal skills directory>');
  console.log(JSON.stringify(proposal(path.resolve(out))));
  if (process.argv.includes('--apply')) {
    const { migrateSkills } = await import('../plugin/scripts/migrate-skills.mjs');
    console.log(JSON.stringify(migrateSkills(path.join(ROOT, 'plugin'), { source: path.resolve(out), apply: true })));
  }
}
