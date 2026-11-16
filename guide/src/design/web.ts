import docs from '../../../packages/web/docs.json';
import type { Lang } from '../i18n';
// What the guide reads from @aisgroup/web (packages/web, through the workspace): its catalogue, its examples and the
// source of its components. The guide shows the package and never keeps a copy of it.
import { componentItems, type CatalogItem } from '@aisgroup/web/catalog';
import pkg from '@aisgroup/web-src/package.json';

export { componentItems, type CatalogItem };
export const version: string = pkg.version;

/** Every example of the package as text, by its path inside the package (examples/split-button/01-variants.astro…). */
const raw = import.meta.glob('@aisgroup/web-src/examples/*/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const files: Record<string, string> = Object.fromEntries(Object.entries(raw).map(([p, text]) => [p.replace(/^(?:@aisgroup\/web-src|.*?\/(?:packages\/web|node_modules\/@aisgroup\/web))\//, ''), text]));

/** The examples of a component: each with its name, the line under its title (its first comment) and its code. */
export const examples = (id: string, lang: Lang = 'en') => Object.keys(files).filter((p) => p.startsWith(`examples/${id}/`)).sort()
  .map((p) => {
    const source = files[p];
    const file = p.split('/').at(-1)!.replace('.astro', '');
    const about = source.match(/^---\n\/\/\s*(.+)\n/)?.[1];
    const name = file.replace(/^\d+-/, '').replace(/-/g, ' ');
    const translated = (docs.examples as Record<string, { name: Record<Exclude<Lang, 'en'>, string>; about: Record<Exclude<Lang, 'en'>, string> }>)[`${id}/${file}`];
    return { path: `${id}/${file}`, slug: file, name: lang === 'en' ? name.charAt(0).toUpperCase() + name.slice(1) : translated.name[lang], about: lang === 'en' ? about : translated.about[lang], code: source.replace(/^---\n\/\/.*\n/, '---\n').trim() };
  });

/** Localised prose; identifiers, source paths and example code stay as authored. */
export function localizePart<T extends CatalogItem>(part: T, lang: Lang): T {
  if (lang === 'en') return part;
  const text = (docs.catalog as Record<string, { name: Record<Exclude<Lang, 'en'>, string>; description: Record<Exclude<Lang, 'en'>, string> }>)[part.id];
  return { ...part, name: text.name[lang], description: text.description[lang] };
}
