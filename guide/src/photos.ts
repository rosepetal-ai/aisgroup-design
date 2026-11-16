import captions from './data/photo-captions.json';
import type { Lang } from './i18n';
const caption = (title: string, lang: Lang) => lang === 'en' ? title : (captions as Record<string, Record<Lang, string>>)[title]?.[lang] ?? title;
const variants = { en: { dark: 'dark', tile: 'labelled', es: 'ES' }, es: { dark: 'oscuro', tile: 'con etiquetas', es: 'ES' }, ca: { dark: 'fosc', tile: 'amb etiquetes', es: 'ES' } };
// The curated photos of the monorepo's library/ (library.json), one item per file, in the library's order, for the
// Downloads page and the /library endpoint. Server only (it reads the disk at build time).
// A photo whose origin was never recorded may be generated and is left out; hosted/build.mjs too.
import fs from 'node:fs';
import path from 'node:path';

export interface Photo { file: string; name: string; title: string; width: number; height: number; bytes: number; thumb: string; subject: string; frame: boolean }

export function photos(lang: Lang = 'en'): Photo[] {
  const lib = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../library/library.json'), 'utf8'));
  return lib.entries.filter((e: any) => e.kind === 'photo' && e.origin !== 'unknown' && !['ais-group_beugen-office.jpg', 'ais-group_dublin-office.jpg', 'ais-group_dundalk-workshop.jpg', 'ais-group_sabadell-aerial.jpg'].includes(path.basename(e.variants[0]?.file ?? ''))).flatMap((e: any) => e.variants.map((v: any) => {
    const name = path.basename(v.file);
    return { file: v.file, name, title: caption(e.title, lang) + (v.variant ? ` (${v.variant.split('+').map((k: string) => ((variants[lang] as Record<string, string>)[k] ?? k)).join(', ')})` : ''), width: v.width, height: v.height, bytes: v.bytes, thumb: `/library/thumbs/${name.replace(/\.\w+$/, '')}.webp`, subject: e.subjectLabel, frame: e.origin === 'video-frame' };
  }));
}

// Source-only stock is never exposed by the file endpoint or copied into an asset pack.
export function stockPhotos(lang: Lang = 'en') {
  const lib = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../library/library.json'), 'utf8'));
  return lib.entries.filter((e: any) => e.kind === 'stock' && e.rights?.redistribution === 'source-only').map((e: any) => ({ ...e, title: caption(e.title, lang) }));
}
