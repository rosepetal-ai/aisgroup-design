// /library/photos/<file>: the curated photos of the monorepo's library/ (its library.json), as they are; and
// /library/thumbs/<name>.webp: a 640 px preview of each for the Downloads page. A photo whose origin was never
// recorded may be generated, so it is not published; hosted/build.mjs leaves it out too.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type { APIRoute } from 'astro';
import { photos } from '../../photos';

const TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const ROOT = path.resolve(process.cwd(), '..');

export const getStaticPaths = () => photos().flatMap((p) => [
  { params: { file: p.file.replace(/^library\//, '') }, props: { src: p.file, thumb: false } },
  { params: { file: p.thumb.replace(/^\/library\//, '') }, props: { src: p.file, thumb: true } },
]);

export const GET: APIRoute = async ({ props }) => {
  const src = path.join(ROOT, props.src);
  if (!props.thumb) return new Response(fs.readFileSync(src), { headers: { 'Content-Type': TYPES[path.extname(src).toLowerCase()] } });
  const body = await sharp(src).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
  return new Response(body, { headers: { 'Content-Type': 'image/webp' } });
};
