import docs from '../../../packages/design/docs.json';
import type { Lang } from '../i18n';
// What the guide reads from @rosepetal/design (packages/design, through the workspace): its catalogue, its examples and
// the source of its components and blocks. The guide shows the package and never keeps a copy of it.
import { blockItems, componentItems, type CatalogItem } from '@rosepetal/design/catalog';
import pkg from '@rosepetal/design-src/package.json';

export { blockItems, componentItems, type CatalogItem };
export const version: string = pkg.version;
/** Where the source lives, for the pages and the agents' index (owner/repo@branch:path). */
export const REPO = 'rosepetal-ai/aisgroup-design';
export const BRANCH = 'dev';
export const sourceOf = (path: string) => `${REPO}@${BRANCH}:${path}`;

/** Every file of the package as text, by its path inside the package (ui/button/Button.vue, blocks/TopBar.vue…). */
const raw = import.meta.glob('@rosepetal/design-src/{ui/*/*,blocks/*,lib/*,examples/*/*}.{vue,ts,svg}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const files: Record<string, string> = Object.fromEntries(Object.entries(raw).map(([p, text]) => [p.replace(/^(?:@rosepetal\/design-src|.*?\/(?:packages\/design|node_modules\/@rosepetal\/design))\//, ''), text]));
export { default as styles } from '@rosepetal/design-src/styles.css?raw';

/** The examples of a component or block: each with its name, the line under its title (its first comment) and its code. */
export const examples = (id: string, lang: Lang = 'en') => Object.keys(files).filter((p) => p.startsWith(`examples/${id}/`) && p.endsWith('.vue')).sort()
  .map((p) => {
    const code = files[p];
    const file = p.split('/').at(-1)!.replace('.vue', '');
    const about = code.match(/^<!--\s*([\s\S]*?)\s*-->\n*/);
    const name = file.replace(/^\d+-/, '').replace(/-/g, ' ');
    const translated = (docs.examples as Record<string, { name: Record<Exclude<Lang, 'en'>, string>; about: Record<Exclude<Lang, 'en'>, string> }>)[`${id}/${file}`];
    return { path: `${id}/${file}`, slug: file, name: lang === 'en' ? name.charAt(0).toUpperCase() + name.slice(1) : translated.name[lang], about: lang === 'en' ? about?.[1] : translated.about[lang], code: code.replace(/^<!--[\s\S]*?-->\n*/, '').trim() };
  });

/** Components and blocks, each with its page: what the menu, the index and the registry list. */
export const parts: (CatalogItem & { kind: 'component' | 'block' })[] = [
  ...componentItems.map((c) => ({ ...c, kind: 'component' as const })),
  ...blockItems.map((b) => ({ ...b, kind: 'block' as const })),
];

/** Localised prose; identifiers, source paths and example code stay as authored. */
export function localizePart<T extends CatalogItem>(part: T, lang: Lang): T {
  if (lang === 'en') return part;
  const text = (docs.catalog as Record<string, { name: Record<Exclude<Lang, 'en'>, string>; description: Record<Exclude<Lang, 'en'>, string> }>)[part.id];
  return { ...part, name: text.name[lang], description: text.description[lang] };
}
