import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(255),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  description: z.string().min(5, 'Description is required'),
  longDescription: z.string().optional().nullable(),
  heroImageUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  projectUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  client: z.string().max(100).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  problem: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  features: z.array(z.string()).optional().default([]),
  architecture: z.string().optional().nullable(),
  challenges: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional().default([]),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
  startedAt: z.string().min(1, 'Start date is required'),
  endedAt: z.string().optional().nullable(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
