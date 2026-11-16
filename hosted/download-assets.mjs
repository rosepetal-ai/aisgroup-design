// Merge the public Downloads selection without treating source-only stock as hosted files.
import path from 'node:path';

export function mergeDownloads(existing, descriptor, exists) {
  if (descriptor.version !== 1 || !Array.isArray(descriptor.entries)) throw Error('Unsupported downloads catalogue.');
  const assets = existing.map(a => ({ ...a }));
  const ids = new Set(assets.map(a => a.id));
  for (const e of descriptor.entries) {
    if (!['photo', 'logo', 'stock', 'video', 'poster'].includes(e.kind)) throw Error(`Unsupported download kind: ${e.kind}`);
    const metadata = Object.fromEntries(['title', 'author', 'authorUrl', 'source', 'rights', 'origin', 'width', 'height', 'bytes', 'format', 'preview'].filter(k => e[k] !== undefined).map(k => [k, e[k]]));
    let asset;
    if (e.kind === 'stock') {
      const source = new URL(e.source);
      if (source.protocol !== 'https:' || source.username || source.password || e.file || e.rights?.redistribution !== 'source-only') throw Error(`Stock must remain a source-only HTTPS link: ${e.name}`);
      asset = { id: e.name, kind: 'stock', sourceOnly: true, source: source.href, use: `${e.title}. ${e.author}. ${e.rights.licence}. ${e.rights.usage}`, ...metadata };
    } else {
      if (typeof e.file !== 'string' || !e.file || path.posix.isAbsolute(e.file) || e.file.includes('\\') || e.file.split('/').some(p => p === '..' || p === '.') || !exists(e.file)) throw Error(`Missing or invalid download file: ${e.file}`);
      const present = assets.find(a => a.file === e.file);
      if (present) { Object.assign(present, metadata); continue; }
      asset = { id: e.name, kind: e.kind, file: e.file, use: `${e.title}${e.format ? `, ${e.format}` : ''}. ${e.rights?.licence ?? ''}`, ...metadata };
    }
    if (ids.has(asset.id)) throw Error(`Duplicate download id: ${asset.id}`);
    ids.add(asset.id); assets.push(asset);
  }
  return assets;
}
