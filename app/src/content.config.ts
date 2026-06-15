import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Three pillars of the portfolio.
const PILLARS = ['motion', 'visual', 'code'] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().default(''),
    // One project can belong to several pillars.
    pillars: z.array(z.enum(PILLARS)).default(['visual']),
    cover: z.string(), // root-relative URL, e.g. /media/images/projects/<slug>/x.webp
    year: z.union([z.string(), z.number()]).optional(),
    role: z.string().optional(),
    // Display ordering on listing pages; lower = earlier.
    order: z.number().default(100),
    // External link (e.g. product page) instead of a detail page.
    externalUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string(),
    excerpt: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
