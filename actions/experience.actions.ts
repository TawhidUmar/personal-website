'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import { experienceSchema } from '@/lib/validations/experience.schema';
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/lib/repositories/experiences.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';
import type { ExperienceType } from '@/types/db.types';

export async function createExperienceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const technologiesRaw = (formData.get('technologies') as string) || '';
  const technologies = technologiesRaw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const raw = {
    title: formData.get('title') as string,
    company: formData.get('company') as string,
    companyUrl: (formData.get('companyUrl') as string) || undefined,
    location: (formData.get('location') as string) || undefined,
    type: (formData.get('type') as ExperienceType) || 'full-time',
    description: (formData.get('description') as string) || undefined,
    technologies,
    startDate: (formData.get('startDate') as string) || '',
    endDate: (formData.get('endDate') as string) || undefined,
    isCurrent: formData.get('isCurrent') === 'on' || formData.get('isCurrent') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
  };

  const parsed = experienceSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const experienceId = await createExperience({
      user_id: admin.id,
      title: parsed.data.title,
      company: parsed.data.company,
      company_url: parsed.data.companyUrl || null,
      location: parsed.data.location || null,
      type: parsed.data.type,
      description: parsed.data.description || null,
      technologies: parsed.data.technologies ?? [],
      start_date: new Date(parsed.data.startDate),
      end_date: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      is_current: parsed.data.isCurrent,
      display_order: parsed.data.displayOrder,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'experience.created',
      entityType: 'experience',
      entityId: experienceId,
      newValues: { title: parsed.data.title, company: parsed.data.company },
    });

    revalidatePath('/experience');
    revalidatePath('/about');
    revalidatePath('/admin/experience');
    revalidatePath('/admin');

    return { status: 'success', message: 'Experience entry added successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to create experience entry.' };
  }
}

export async function updateExperienceAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const technologiesRaw = (formData.get('technologies') as string) || '';
  const technologies = technologiesRaw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const raw = {
    title: formData.get('title') as string,
    company: formData.get('company') as string,
    companyUrl: (formData.get('companyUrl') as string) || undefined,
    location: (formData.get('location') as string) || undefined,
    type: (formData.get('type') as ExperienceType) || 'full-time',
    description: (formData.get('description') as string) || undefined,
    technologies,
    startDate: (formData.get('startDate') as string) || '',
    endDate: (formData.get('endDate') as string) || undefined,
    isCurrent: formData.get('isCurrent') === 'on' || formData.get('isCurrent') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
  };

  const parsed = experienceSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await updateExperience(id, {
      title: parsed.data.title,
      company: parsed.data.company,
      company_url: parsed.data.companyUrl || null,
      location: parsed.data.location || null,
      type: parsed.data.type,
      description: parsed.data.description || null,
      technologies: parsed.data.technologies ?? [],
      start_date: new Date(parsed.data.startDate),
      end_date: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      is_current: parsed.data.isCurrent,
      display_order: parsed.data.displayOrder,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'experience.updated',
      entityType: 'experience',
      entityId: id,
      newValues: { title: parsed.data.title, company: parsed.data.company },
    });

    revalidatePath('/experience');
    revalidatePath('/about');
    revalidatePath('/admin/experience');

    return { status: 'success', message: 'Experience entry updated successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to update experience entry.' };
  }
}

export async function deleteExperienceAction(id: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteExperience(id);
    await createAuditLog({
      userId: admin.id,
      action: 'experience.deleted',
      entityType: 'experience',
      entityId: id,
    });

    revalidatePath('/experience');
    revalidatePath('/about');
    revalidatePath('/admin/experience');

    return { status: 'success', message: 'Experience entry deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete experience entry.' };
  }
}
