import { z } from 'zod';

export const awardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  issuer: z.string().min(1, 'Issuer is required').max(255),
  issuerUrl: z.string().url('Must be a valid URL').max(500).optional().or(z.literal('')),
  category: z.enum(['award', 'certification']),
  date: z.string().optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  badgeUrl: z.string().url('Must be a valid URL').max(500).optional().or(z.literal('')),
  isFeatured: z.boolean().optional().default(false),
  displayOrder: z.number().int().min(0).optional().default(0),
});

export type AwardFormData = z.infer<typeof awardSchema>;
