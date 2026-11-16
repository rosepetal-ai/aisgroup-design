import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guide = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guide' }),
  // `wide`: no contents column, the page body spans the full width (live specimens).
  // `rules`: short, checkable statements an AI agent must follow; collected into /{lang}/brand.md.
  schema: z.object({ title: z.string(), rules: z.array(z.string()).optional(), wide: z.boolean().optional() }),
});

export const collections = { guide };
