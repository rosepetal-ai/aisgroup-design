import { fileURLToPath } from 'node:url';
import { createIndex, close } from 'pagefind';

// An Astro build hook also covers direct `astro build` and the deployment script.
export default function searchIndex() {
  return { name: 'guide-search-index', hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const { index, errors } = await createIndex({ excludeSelectors: ['pre', '.astro-code'] }); // code samples aren't search results
      if (!index || errors?.length) throw new Error(`Pagefind: ${errors?.join(', ')}`);
      try {
        const added = await index.addDirectory({ path: fileURLToPath(dir), glob: '{en,es,ca}/**/*.html' });
        if (added.errors?.length) throw new Error(added.errors.join('\n'));
        const written = await index.writeFiles({ outputPath: fileURLToPath(new URL('pagefind/', dir)) });
        if (written.errors?.length) throw new Error(written.errors.join('\n'));
        logger.info(`Pagefind indexed ${added.page_count} rendered guide pages (EN/ES/CA).`);
      } finally { await close(); }
    },
  } };
}
