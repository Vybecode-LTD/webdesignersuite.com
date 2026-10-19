import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { guideSchema } from './content/schema';

/** Guides are MDX in src/content/guides/, one folder per series (decision 0001). */
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/[^_]*.{md,mdx}' }),
  schema: guideSchema,
});

export const collections = { guides };
