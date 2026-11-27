// Build the small edition's index from tracked release sources. Large assets stay at their source.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export function templateCatalog(root) {
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trimEnd();
  const revision = git('rev-parse', 'HEAD');
  const sources = git('ls-files', '-z').split('\0').filter(Boolean);
  const entries = {};
  for (const source of sources) {
    let family;
    if (/^templates\/[^/]+\.json$/.test(source)) family = 'social-video';
    else if (/^pieces\/(brochures|sales|datasheets)\/[^/]+\/[^/]+\.html$/.test(source) || source === 'print/templates/machine.es.html') family = 'print';
    else if (/^pieces\/decks\/[^/]+\/content\.[a-z]+\.json$/.test(source)) family = 'decks';
    else if (/^pieces\/stationery\/letterhead\/[^/]+\.html$/.test(source)) family = 'stationery';
    else continue;
    const id = source.replace(/^templates\//, '').replace(/\.(json|html)$/, '');
    const recipe = family === 'social-video' ? fs.readFileSync(path.join(root, source), 'utf8') : '';
    const media = [...new Set([...recipe.matchAll(/@lib\/media\/([^"\s]+)/g)].map(match => match[1]))];
    entries[id] = { family, source, ...(media.length ? { media } : {}) };
  }
  const assets = {};
  const publicRoot = path.join(root, '../guide/public');
  const files = git('ls-files', '--full-name', '-z', '../guide/public/kit/files', '../guide/public/downloads/video').split('\0');
  for (const file of files) {
    const id = path.basename(file, path.extname(file));
    if (!/^(guide\/public\/kit\/files\/(rosepetal_music_[a-z0-9-]+_v01\.m4a|[a-z-]+_(brand-intro|opening_(en|es)|end-card_(en|es))_v01_16x9\.mp4)|guide\/public\/downloads\/video\/[a-z-]+-intro(-4k)?\.mp4)$/.test(file)) continue;
    const rel = file.slice('guide/public/'.length);
    assets[id] = { url: 'https://aisgroup-design.web.app/' + rel, sha256: createHash('sha256').update(fs.readFileSync(path.join(publicRoot, rel))).digest('hex') };
  }
  return { revision, entries, assets };
}
