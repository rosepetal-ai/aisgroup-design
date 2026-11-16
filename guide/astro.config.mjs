import { defineConfig } from 'astro/config';
import assetLinks from './scripts/asset-links.mjs';
import officePdfs from './scripts/office-pdfs.mjs';
import separatorCheck from './scripts/check-separators.mjs';
import searchIndex from './scripts/search-index.mjs';
import imageSizes from './scripts/image-sizes.mjs';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// The product components come from the workspace package @rosepetal/design (packages/design), never from a copy.
// '@rosepetal/design-src' is its folder, for the globs that list its examples and read its files.
const DESIGN = path.dirname(fs.realpathSync(createRequire(import.meta.url).resolve('@rosepetal/design/catalog')));
// The website components come from @aisgroup/web (packages/web) the same way; '@aisgroup/web-src' is its folder.
const WEB = path.dirname(fs.realpathSync(createRequire(import.meta.url).resolve('@aisgroup/web/catalog')));

// In an app an imported image (the blocks' logo SVG) is its URL; Astro would make it an image object.
const imageAsUrl = { name: 'design-image-url', enforce: 'pre', resolveId(id, importer) {
  if (importer?.startsWith(DESIGN) && /\.(svg|png|jpe?g|webp)$/.test(id)) return this.resolve(`${id}?url`, importer, { skipSelf: true });
} };

// The component previews share their code: Vue in one file, and every small module two previews share (Lucide icons,
// reka-ui helpers, @rosepetal/design's components) in another, instead of a file per icon and per helper. Larger
// modules stay with the examples that use them, so one page doesn't load the whole library. Browser build only.
const previewChunks = { name: 'preview-chunks', configEnvironment(name) {
  if (name !== 'client') return;
  return { build: { rolldownOptions: { output: { codeSplitting: { groups: [
    { name: 'vue', test: /node_modules\/(@vue|vue)\//, priority: 2 },
    { name: 'shared', test: (id) => id.includes('/node_modules/') || (id.startsWith(`${DESIGN}/`) && !id.includes('/examples/')), maxModuleSize: 8000, minShareCount: 2, priority: 1 },
  ] } } } } };
} };

export default defineConfig({
  // The components type their props with reka-ui's types; Vue's compiler reads them from disk to resolve them.
  integrations: [separatorCheck(), officePdfs(), assetLinks(), imageSizes(), searchIndex(), mdx(), vue({ script: { fs: { fileExists: (f) => fs.existsSync(f) && fs.statSync(f).isFile(), readFile: (f) => fs.readFileSync(f, 'utf8'), realpath: fs.realpathSync } } })],
  i18n: { locales: ['en', 'es', 'ca'], defaultLocale: 'en', routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true } },
  redirects: { '/': '/en/' },
  // Tailwind only runs on the CSS that imports it: the component previews and the website specimens, never the guide's own pages.
  vite: { plugins: [imageAsUrl, previewChunks, tailwindcss()], resolve: { alias: { '@rosepetal/design-src': DESIGN, '@aisgroup/web-src': WEB } }, server: { fs: { allow: ['..', DESIGN, WEB] } } },
});
