import { z } from 'zod';

export const articleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title cannot exceed 255 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255, 'Slug cannot exceed 255 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().max(500, 'Excerpt cannot exceed 500 characters').optional().nullable(),
  content: z.string().min(10, 'Article content must be at least 10 characters'),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  coverImageUrl: z
    .string()
    .max(1000, 'Cover image URL cannot exceed 1000 characters')
    .optional()
    .nullable()
    .or(z.literal(''))
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/') || val.startsWith('data:image/'),
      { message: 'Cover image must be a valid URL (http/https) or relative path (/uploads/...)' }
    ),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  readingTime: z.coerce.number().int().min(1).optional().nullable(),
  isFeatured: z.boolean().default(false),
  tagIds: z.array(z.coerce.number().int().positive()).optional().default([]),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  canonicalUrl: z.string().url('Invalid canonical URL').optional().nullable().or(z.literal('')),
});

export type ArticleInput = z.infer<typeof articleSchema>;
