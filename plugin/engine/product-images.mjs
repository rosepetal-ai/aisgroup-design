// Product evidence is a registered raster photograph/render, never an SVG wrapper.
import fs from 'node:fs';
import path from 'node:path';
export function productImageError(file, shot = {}, entry, studio) {
  const head = fs.readFileSync(file).subarray(0, 2048);
  const svg = path.extname(file).toLowerCase() === '.svg' || /<svg\b/i.test(head.toString());
  const product = shot.evidence === 'render' || entry?.origin === 'render' || entry?.type === 'product';
  if (svg) {
    if (shot.diagram !== true || product) return 'SVG product imagery is not allowed; use a library raster render or photo. Pure diagrams/icons require "diagram": true and no render evidence';
    const source = fs.readFileSync(file, 'utf8');
    if (/<(?:image|foreignObject)\b|\b(?:href|src)\s*=|url\s*\(/i.test(source)) return 'a diagram must be self-contained vector geometry; embedded or linked imagery is not allowed';
    return null;
  }
  const raster = (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) || head.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || (head.toString('ascii', 0, 4) === 'RIFF' && head.toString('ascii', 8, 12) === 'WEBP');
  const inLibrary = ['library/media', 'brand/library'].some(root => {
    const lexical = path.join(studio, root);
    let real; try { real = fs.realpathSync(lexical); } catch {}
    return [lexical, real].filter(Boolean).some(base => file.startsWith(base + path.sep));
  });
  const realContext = !product && ((['screen', 'screenshot'].includes(entry?.origin) && ['interface', 'software'].includes(entry?.type)) || (entry?.origin === 'stock' && entry?.type === 'context') || entry?.origin === 'video-frame');
  if (!raster || !inLibrary || !entry || (!['render', 'photo'].includes(entry.origin) && !realContext)) return 'product shots must be registered library raster renders or photos (JPEG, PNG or WebP); real screens, footage and context photos must also be registered';
  return null;
}
