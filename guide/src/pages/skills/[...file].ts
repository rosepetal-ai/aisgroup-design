// The guide as agent skills, one per section of the AIS Group Design tree. The plugin (ais-group-design)
// imports the declared guide references with `npm run guide`; curated entrypoints remain plugin-owned.
//   /skills/index.json                      the skill names
//   /skills/<skill>/SKILL.md                when to use it, the essentials and every rule of its pages
//   /skills/<skill>/references/<page>.md    the full page as Markdown, read only when needed
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { INVENTORY } from '../../../../scripts/skills-tree.mjs';
import { SKILL_PATH_ALIASES } from '../../../../plugin/skill-routes.mjs';
import { getCollection, type CollectionEntry } from 'astro:content';
import { essentials, principles, tasks } from '../../essentials';
import {balanceCopy} from '../../data/balance';
import {postAnatomy} from '../../data/post-anatomy';
import kit from '../../data/kit.json';
import {imageTypes,imageCopy} from '../../imagery';
import { photos } from '../../photos';
import { blue, neutral, status, statusDark, roles, core, hexFor } from '../../palette';
import { postTypes } from '../../data/linkedin';
import { usage, resolve } from '../../design/themes';
import { componentItems, blockItems } from '../../design/package';
import { componentItems as webItems } from '../../design/web';

const SKILLS = INVENTORY;
const LIVE = 'https://design.aisgroup.ai';
const swatches: Record<string, { key: string; hex: string }[]> = { blue, neutral, status, statusDark };
const PLUGIN = path.resolve(process.cwd(), '../plugin');
const skillOf = (slug: string) => SKILLS.find((s) => s.pages.includes(slug));

const slugOf = (id: string) => id.split('/').slice(1).join('/') || 'index';
const entries = async () => (await getCollection('guide')).filter((e) => e.id.split('/')[0] === 'en');

// Strings inside a JSX array prop: dos={['…', '…']}
const strings = (src: string, prop: string) => [...(src.match(new RegExp(`${prop}=\\{\\[([\\s\\S]*?)\\]\\}`))?.[1] ?? '').matchAll(/'((?:[^']|'')*)'/g)].map((m) => m[1].replace(/''/g, "'"));

// MDX to plain Markdown: components that carry words become lists, specimens are dropped, links point at skill files.
function markdown(entry: CollectionEntry<'guide'>, from: string) {
  const parts = (entry.body ?? '').split(/(^```[\s\S]*?^```)/m);
  const page = `${LIVE}/en/${slugOf(entry.id) === 'index' ? '' : `${slugOf(entry.id)}/`}`;
  const prose = (text: string) => text
    .replace(/^import .*$\n?/gm, '')
    .replace(/<DoDont[\s\S]*?\/>/g, (tag) => `**${tag.match(/doLabel="([^"]+)"/)?.[1] ?? 'Do'}**\n\n${strings(tag, 'dos').map((s) => `- ${s}`).join('\n')}\n\n**${tag.match(/dontLabel="([^"]+)"/)?.[1] ?? 'Don’t'}**\n\n${strings(tag, 'donts').map((s) => `- ${s}`).join('\n')}`)
    .replace(/<Balance\s*\/>/g, ['| Theme | Ground | Accent |', '| --- | --- | --- |', ...balanceCopy.en.map(row=>`| ${row.join(' | ')} |`)].join('\n'))
    .replace(/<PostAnatomy[^>]*\/>/g, `![AIS Hopper, real kit post](/kit/files/linkedin-hopper-en.png)\n\n${postAnatomy.en.map((note,i)=>`${i+1}. ${note}`).join('\n')}`)
    .replace(/<Essentials[^>]*\/>/g, essentials.en.map((r, i) => `${i + 1}. ${r}`).join('\n'))
    .replace(/<Principles[^>]*\/>/g, principles.en.map((p) => `- **${p.title}.** ${p.text}`).join('\n'))
    .replace(/<ImageTypes lang="en" \/>/g, imageTypes.map(t => {const c=imageCopy.en[t.id];return `<a id="type-${t.id}"></a>\n\n### ${c.name}\n\n${c.direction}\n\n${t.refs.map(ref=>`![${c.name}](${ref.startsWith('/')?ref:`/imagery/${ref}.webp`})`).join('\n')}`;}).join('\n\n'))
    // Downloads: the preview grids become the file lists they offer.
    .replace(/<LogoDownloads lang="en" \/>/, ['ais-group', 'ais-vision-systems', 'ais-vision-automation', 'ais-scanology', 'rosepetal', 'ais-mark', 'rosepetal-mark']
      .map((b) => `- ${b}: ${['blue', 'white', 'black'].map((c) => `[${c}](/logos/${b}-${c}.svg)`).join(', ')}`).join('\n'))
    .replace(/<LogoDownloads[^>]*set="favicons"[^>]*\/>/, ['ais', 'rosepetal'].flatMap((b) => ['app-icons', 'favicons'].map((k) => `- [${b}-${k}.zip](/downloads/favicons/${b}-${k}.zip)`)).join('\n'))
    .replace(/<PatternDownloads[^>]*linkedin[^>]*\/>/, ['hexagon-landscape-rolling','hexagon-landscape-dramatic','circuit-globe','circuit-traces','scan-profiles'].map(p => `- [${p}, all variants](/downloads/linkedin-patterns/ais-linkedin-background-${p}.zip)`).join('\n'))
    .replace(/<PatternDownloads[^>]*\/>/, ['tr', 'tl', 'br', 'bl'].map((c) => `- [hex-field-${c}.svg](/kit/hex-field-${c}.svg)`).join('\n'))
    .replace(/<TypefaceDownloads[^>]*\/>/, '- Inter: [rsms.me/inter](https://rsms.me/inter/), [Google Fonts](https://fonts.google.com/specimen/Inter)\n- JetBrains Mono: [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/), [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono)')
    .replace(/<IconDownloads[^>]*\/>/, '- [ais-icons.zip](/downloads/icons/ais-icons.zip)')
    .replace(/<PhotoDownloads[^>]*\/>/, () => photos().map((p) => `- [${p.name}](/${p.file})${p.frame ? ': video frame, never a print cover' : ''}`).join('\n'))
    .replace(/<VideoDownloads[^>]*\/>/, ['ais-vision-systems', 'rosepetal'].map((v) => `- ${v} intro: [1080p](/downloads/video/${v}-intro.mp4), [poster](/downloads/video/${v}-intro.jpg); the 4K original is on the guide's Downloads page`).join('\n'))
    // Format examples carry the same rules in the guide and the agent reference.
    .replace(/<KitFinal\b[^>]*rules=\{(\{[^\n]*?\})\}[^>]*\/>/g, (_, rules) => Object.entries(JSON.parse(rules) as Record<string, string>).map(([id, rule]) => {
      const piece = kit.find((k) => k.id === id);
      const file = piece && ('pdf' in piece ? `/kit/files/${piece.pdf}` : 'file' in piece ? piece.file : '');
      return `- **${piece?.name ?? id}**: ${rule}${file ? ` [${id}](${file})` : ''}`;
    }).join('\n'))
    // Component indexes: the catalogue as a list, each part with what it is for and its live page.
    .replace(/<ComponentIndex[^>]*group="(components|blocks)"[^>]*\/>/g, (_, g) => (g === 'blocks' ? blockItems : componentItems).map((c) => `- **${c.name}** (\`${c.id}\`): ${c.description ?? ''} [Live](https://aisgroup-design.web.app/en/components/${c.id}/)`).join('\n'))
    .replace(/<ComponentIndex[^>]*group="web"[^>]*\/>/g, () => webItems.map((c) => `- **${c.name}** (\`${c.id}\`): ${c.description ?? ''} [Live](https://aisgroup-design.web.app/en/web-components/${c.id}/)`).join('\n'))
    .replace(/<CorePalette[^>]*\/>/g, () => core.map((c) => `- **${c.name.en}** \`${hexFor(c.key)}\`: ${c.role.en}`).join('\n'))
    .replace(/<Swatches[^>]*colours=\{(\w+)\}[^>]*\/>/g, (_, name) => (swatches[name] ?? []).map((c) => `- \`${c.hex}\` ${c.key}${roles[c.key] ? `: ${roles[c.key].en}` : ''}`).join('\n'))
    .replace(/<Usage[^>]*\/>/g, () => usage.map((u) => `- ${u.role.en} (\`--${u.token}\`): \`${resolve(u.token, 'light').value}\` light, \`${resolve(u.token, 'dark').value}\` dark`).join('\n'))
    .replace(/<Tasks[^>]*\/>/g, () => tasks.en.map((t) => `- [${t.label}](/en/${t.slug}/)`).join('\n'))
    .replace(/<SocialGallery[^>]*mode="types"[^>]*\/>/g, () => Object.values(postTypes).map(([name, line]) => `- **${name.en}**: ${line.en}`).join('\n'))
    .replace(/<KitFinal lang="en" family="(print|datasheet|sales|deck|office)" \/>/g, (_, family) => (kit as any[]).filter((k) => k.family === family)
      .map((k) => `- **${k.name ?? k.id}**: ${[k.pdf && `[PDF](${LIVE}/kit/files/${k.pdf})`, k.pptx && `[PPTX](${LIVE}/kit/files/${k.pptx})`, k.file && `[file](${k.file})`].filter(Boolean).join(', ')}`).join('\n'))
    .replace(/<a href="(\/[^"]+)"[^>]*>([^<]+)<\/a>/g, '[$2]($1)')
    .replace(/<(Combinations|Contrast)\b[\s\S]*?\/>/g, (_, c) => `See them on [the live guide](${page}#${c.toLowerCase()}).`)
    .replace(/<[A-Z]\w*[\s\S]*?\/>/g, '')
    .replace(/\[([^\]]+)\]\(\/en\/([\w-]*)\/?(#[\w-]+)?\)/g, (_, text, slug, hash = '') => {
      const s = skillOf(slug || 'index');
      return s ? `[${text}](${s.name === from ? '' : `../../${s.name}/references/`}${slug || 'index'}.md${hash})` : text;
    })
    .replace(/\]\(\/(?!(?:logos|downloads|imagery|illustrations|kit|library)\/)/g, `](${LIVE}/`)
    .replace(/\n{3,}/g, '\n\n');
  const anchor = (h: string) => h.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
  const lines = `${parts.map((p, i) => (i % 2 ? p : prose(p))).join('').trim()}\n`.split('\n');
  const out: string[] = [];
  let heading = '';
  lines.forEach((line, i) => {
    out.push(line);
    const h = line.match(/^(#{2,6}) (.+)$/); if (h) heading = h[2];
    const next = lines.slice(i + 1).find((l) => l.trim()) ?? '#';
    const empty = h ? new RegExp(`^#{1,${h[1].length}} `).test(next) : /:$/.test(line.trim()) && next.startsWith('#');
    if (empty && heading) out.push('', `See it on [the live guide](${page}#${anchor(heading)}).`);
  });
  return `# ${entry.data.title}\n\n${out.join('\n').trim()}\n`;
}

const tokens = () => [
  '# Colour tokens', '', 'Exact values, version 1.0. Token files: [ais-tokens.css](/downloads/ais-tokens.css) (CSS custom properties), [ais-theme.css](/downloads/ais-theme.css) (the Tailwind v4 theme, the tokens of the Rosepetal products, from @aisgroup/design/styles.css: import it after tailwindcss and use the same classes as the app, bg-primary, text-muted-foreground) and [ais-tokens.json](/downloads/ais-tokens.json) (W3C design tokens).', '',
  '## Colour roles', '', ...usage.map((u) => `- ${u.role.en} (\`--${u.token}\`): \`${resolve(u.token, 'light').value}\` light, \`${resolve(u.token, 'dark').value}\` dark`), '',
  '## Colour values', '', ...[...blue, ...neutral, ...status].map((c) => `- \`${c.hex}\` ${c.key}: ${roles[c.key].en}`), '',
].join('\n');

// Brand rules come from the guide; entrypoints and task workflows come from the live plugin. Sync imports only the
// declared guide-owned references. A page keeps its own words: the rules ledger (plugin/evals/rules-ledger.json)
// tracks that no rule is lost, it never replaces a page's lines with pointers (an agent would have to chase dozens
// of links to read one page).
const canonicalReference = (text: string, _from: string) => text;

export const getStaticPaths = async () => {
  const all = await entries();
  const files = new Map<string, string>();
  const skillsRoot = path.join(PLUGIN, 'skills');
  for (const file of fs.readdirSync(skillsRoot, { recursive: true }) as string[]) {
    if (file.endsWith('.md')) files.set(file, fs.readFileSync(path.join(skillsRoot, file), 'utf8'));
  }
  for (const skill of SKILLS) {
    if (!files.has(`${skill.name}/SKILL.md`)) throw new Error(`Missing live skill ${skill.name}`);
    for (const slug of skill.pages) {
      const entry = all.find(page => slugOf(page.id) === slug);
      if (!entry) throw new Error(`Missing guide source ${slug}`);
      const file = `${skill.name}/references/${slug}.md`;
      files.set(file, canonicalReference(markdown(entry, skill.name), file));
    }
  }
  files.set('design-language/references/tokens.md', canonicalReference(tokens(), 'design-language/references/tokens.md'));
  // An old URL points to its owner; aliases are never discovery entries.
  for (const [old, current] of Object.entries(SKILL_PATH_ALIASES)) files.set(old, `# Resource moved\n\nRead the current [${current}](/skills/${current}).\n`);
  return [
    { params: { file: 'index.json' }, props: { body: JSON.stringify(SKILLS.map((s: { name: string }) => s.name)) } },
    { params: { file: 'aliases.json' }, props: { body: JSON.stringify(SKILL_PATH_ALIASES) } },
    { params: { file: 'guide-files.json' }, props: { body: JSON.stringify([...SKILLS.flatMap((s: { name: string; pages: string[] }) => s.pages.map(page => `${s.name}/references/${page}.md`)), 'design-language/references/tokens.md']) } },
    ...[...files].map(([file, body]) => ({ params: { file }, props: { body } })),
  ];
};

export const GET: APIRoute = ({ props }) => new Response(props.body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
