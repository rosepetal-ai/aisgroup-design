// Enrich the existing snapshot without changing its source guide or running a renderer.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from '../packages/vue-themes/generate.mjs';
import { allowedDownload, pending } from './download-policy.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), OUT = path.join(HERE, 'data');
const DIST = path.resolve(process.env.AIS_GUIDE_DIST || path.join(HERE, '../guide/dist'));
generate({ check: true });
const themes = path.join(OUT, 'downloads/vue-themes');
fs.mkdirSync(themes, { recursive: true });
for (const name of ['primevue.mjs', 'vuetify.mjs', 'tokens.json', 'base.css', 'README.md']) fs.copyFileSync(path.join(HERE, '../packages/vue-themes', name), path.join(themes, name));
// The websites' package, @aisgroup/web, as its published files plus an index of its components.
const web = path.join(OUT, 'downloads/aisgroup-web'), WEB_PKG = path.join(HERE, '../packages/web');
fs.rmSync(web, { recursive: true, force: true });
for (const f of [...JSON.parse(fs.readFileSync(path.join(WEB_PKG, 'package.json'))).files, 'package.json']) fs.cpSync(path.join(WEB_PKG, f), path.join(web, f), { recursive: true });
const webCatalog = fs.readFileSync(path.join(WEB_PKG, 'catalog.ts'), 'utf8');
const webItems = [...webCatalog.matchAll(/\{\s*id:\s*'([a-z0-9-]+)',\s*name:\s*'([^']+)',\s*description:\s*'([^']*)'/g)].map(([, id, title, description]) => {
  const list = d => fs.existsSync(path.join(web, d)) ? fs.readdirSync(path.join(web, d)).sort().map(f => `${d}/${f}`) : [];
  return { name: id, title, description, files: list(`components/${id}`), examples: list(`examples/${id}`), import: `import X from '@aisgroup/web/components/${id}'` };
});
if (!webItems.length) throw new Error('packages/web/catalog.ts: no components read');
fs.writeFileSync(path.join(web, 'index.json'), JSON.stringify({ package: '@aisgroup/web', setup: ['styles.css', 'README.md'], shared: fs.readdirSync(path.join(web, 'lib')).sort().map(f => `lib/${f}`), items: webItems }, null, 1));
const registry = JSON.parse(fs.readFileSync(path.join(OUT, 'r/registry.json')));
const software = [];
for (const item of registry.items.filter(i => i.type !== 'registry:theme')) {
  const from = path.join(DIST, 'en/components', item.name, 'index.html');
  if (!fs.existsSync(from)) continue;
  const relative = `software-views/${item.name}/index.html`, to = path.join(OUT, 'examples', relative);
  fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to);
  software.push({ id: `software-${item.name}`, type: 'software-view', title: item.title ?? item.name, html: `/en/components/${item.name}/`, source: relative, registry: `/r/${item.name}.json`, why: item.description ?? 'Existing product component and its package examples.' });
}
fs.writeFileSync(path.join(OUT, 'examples/software.json'), JSON.stringify(software, null, 2));
const catalogue = JSON.parse(fs.readFileSync(path.join(OUT, 'catalogue.json')));
catalogue.assets = catalogue.assets.filter(a => a.kind !== 'mascot' && allowedDownload(a.file ?? a.source ?? ''));
catalogue.downloads = { Code: ['tailwind', 'components', 'web', 'primevue', 'vuetify'], Assets: ['logos', 'favicons', 'patterns', 'backgrounds', 'mascots'], Examples: ['html-documents', 'software-view', 'image', 'pdf', '3d-model'], Standards: ['tokens', 'dtcg', 'guidelines', 'rules'] };
catalogue.pending = pending;
fs.writeFileSync(path.join(OUT, 'catalogue.json'), JSON.stringify(catalogue, null, 1));
for (const file of fs.readdirSync(OUT, { recursive: true })) {
  const at = path.join(OUT, file);
  if (fs.lstatSync(at).isFile() && !allowedDownload(file)) fs.rmSync(at);
}
console.log(`Download groups: Code / Assets / Examples / Standards; ${software.length} existing software views; mascots and illustrations held back; no machine models.`);
