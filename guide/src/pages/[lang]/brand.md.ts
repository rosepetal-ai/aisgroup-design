import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { languages, order, type Lang } from '../../i18n';
import { essentials } from '../../essentials';
import { blue, neutral, status, roles } from '../../palette';
import { usage, resolve } from '../../design/themes';
import { imageTypes, imageCopy } from '../../imagery';

export const getStaticPaths = () => Object.keys(languages).map((lang) => ({ params: { lang } }));

const heading: Record<Lang, Record<string, string>> = {
  en: { title: 'AIS Group brand rules', intro: 'Version 1.0. Follow these rules exactly. When a rule and an example disagree, the rule wins. Human-readable guide:', essentials: 'Essentials', roles: 'Colour roles', lightMode: 'light', darkMode: 'dark', colour: 'Colour values', logos: 'Logo files', light: 'on light backgrounds', dark: 'on blue or dark backgrounds', black: 'black-only printing and website headers on white', images: 'Image types and reference images' },
  es: { title: 'Reglas de marca de AIS Group', intro: 'Versión 1.0. Sigue estas reglas exactamente. Si una regla y un ejemplo no coinciden, manda la regla. Guía para personas:', essentials: 'Lo esencial', roles: 'Funciones del color', lightMode: 'claro', darkMode: 'oscuro', colour: 'Valores de color', logos: 'Archivos de logotipo', light: 'sobre fondos claros', dark: 'sobre azul o fondos oscuros', black: 'solo impresión en negro y cabeceras web sobre blanco', images: 'Tipos de imagen e imágenes de referencia' },
  ca: { title: 'Regles de marca d’AIS Group', intro: 'Versió 1.0. Segueix aquestes regles exactament. Si una regla i un exemple no coincideixen, mana la regla. Guia per a persones:', essentials: 'L’essencial', roles: 'Funcions del color', lightMode: 'clar', darkMode: 'fosc', colour: 'Valors de color', logos: 'Fitxers de logotip', light: 'sobre fons clars', dark: 'sobre blau o fons foscos', black: 'només impressió en negre i capçaleres web sobre blanc', images: 'Tipus d’imatge i imatges de referència' },
};

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Lang;
  const h = heading[lang];
  const base = site ? site.href.replace(/\/$/, '') : '';
  const entries = await getCollection('guide');
  const slugOf = (id: string) => id.split('/').slice(1).join('/') || 'index';
  const page = (slug: string) => entries.find((e) => e.id.split('/')[0] === lang && slugOf(e.id) === slug) ?? entries.find((e) => e.id.split('/')[0] === 'en' && slugOf(e.id) === slug);
  const brands = ['ais-group', 'ais-vision-systems', 'ais-vision-automation', 'ais-scanology', 'rosepetal'];
  const lines = [
    `# ${h.title}`, '', `${h.intro} ${base}/${lang}/`, '',
    `## ${h.essentials}`, '', ...essentials[lang].map((rule, i) => `${i + 1}. ${rule}`), '',
    `## ${h.roles}`, '', ...usage.map((u) => `- ${u.role[lang]} (\`--${u.token}\`): \`${resolve(u.token, 'light').value}\` (${h.lightMode}), \`${resolve(u.token, 'dark').value}\` (${h.darkMode})`), '',
    `## ${h.colour}`, '', ...[...blue, ...neutral, ...status].map((c) => `- \`${c.hex}\` ${c.key}: ${roles[c.key][lang]}`), '',
    `## ${h.logos}`, '', ...brands.flatMap((b) => [`- ${b}, ${h.light}: ${base}/logos/${b}-blue.svg`, `- ${b}, ${h.dark}: ${base}/logos/${b}-white.svg`, `- ${b}, ${h.black}: ${base}/logos/${b}-black.svg`]), '',
    `## ${h.images}`, '', ...imageTypes.map((t) => { const k = imageCopy[lang][t.id]; return `- ${k.name} (${imageCopy[lang].labels[k.source]}): ${k.says} ${k.direction} ${t.refs.map((r) => r.startsWith('/') ? `${base}${r}` : `${base}/imagery/${r}.webp`).join(' ')}`; }), '',
  ];
  for (const slug of order) {
    const entry = page(slug);
    if (!entry?.data.rules?.length) continue;
    lines.push(`## ${entry.data.title}`, '', ...entry.data.rules.map((rule) => `- ${rule}`), '');
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
