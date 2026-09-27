import { z } from 'zod';

export const researchSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  abstract: z.string().min(10, 'Abstract must be at least 10 characters'),
  methodology: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional().default([]),
  dataset: z.string().optional().nullable(),
  status: z.enum(['ongoing', 'completed', 'published', 'archived']).default('published'),
  publicationStatus: z.enum(['unpublished', 'preprint', 'under-review', 'published']).default('preprint'),
  publicationUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  doi: z.string().optional().nullable(),
  githubUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
});

export type ResearchInput = z.infer<typeof researchSchema>;
