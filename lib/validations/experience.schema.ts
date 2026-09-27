import { z } from 'zod';

export const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(150),
  company: z.string().min(2, 'Company name is required').max(150),
  companyUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  location: z.string().max(100).optional().nullable().or(z.literal('')),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance', 'volunteer']).default('full-time'),
  description: z.string().optional().nullable().or(z.literal('')),
  technologies: z.array(z.string()).optional().default([]),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable().or(z.literal('')),
  isCurrent: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
