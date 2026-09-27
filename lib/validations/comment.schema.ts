import { z } from 'zod';

export const commentSchema = z.object({
  articleId: z.coerce.number().int().positive('Invalid article ID'),
  parentId: z.coerce.number().int().positive().optional().nullable(),
  authorName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  authorEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(2000, 'Comment cannot exceed 2000 characters'),
});

export type CommentInput = z.infer<typeof commentSchema>;
