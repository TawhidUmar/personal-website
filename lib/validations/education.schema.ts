import { z } from 'zod';

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required').max(150),
  institutionUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  degree: z.string().min(2, 'Degree is required').max(100),
  fieldOfStudy: z.string().max(100).optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable().or(z.literal('')),
  activities: z.string().optional().nullable().or(z.literal('')),
  gpa: z.coerce.number().min(0).max(10).optional().nullable(),
  gpaScale: z.coerce.number().min(0).max(10).optional().nullable(),
  location: z.string().max(100).optional().nullable().or(z.literal('')),
  startDate: z.string().optional().nullable().or(z.literal('')),
  endDate: z.string().optional().nullable().or(z.literal('')),
  isCurrent: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;
