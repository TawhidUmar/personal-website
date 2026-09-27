'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import { educationSchema } from '@/lib/validations/education.schema';
import {
  createEducation,
  updateEducation,
  deleteEducation,
} from '@/lib/repositories/education.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';

export async function createEducationAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const raw = {
    institution: formData.get('institution') as string,
    institutionUrl: (formData.get('institutionUrl') as string) || undefined,
    degree: formData.get('degree') as string,
    fieldOfStudy: (formData.get('fieldOfStudy') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    activities: (formData.get('activities') as string) || undefined,
    gpa: formData.get('gpa') ? Number(formData.get('gpa')) : undefined,
    gpaScale: formData.get('gpaScale') ? Number(formData.get('gpaScale')) : undefined,
    location: (formData.get('location') as string) || undefined,
    startDate: (formData.get('startDate') as string) || undefined,
    endDate: (formData.get('endDate') as string) || undefined,
    isCurrent: formData.get('isCurrent') === 'on' || formData.get('isCurrent') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
  };

  const parsed = educationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const educationId = await createEducation({
      user_id: admin.id,
      institution: parsed.data.institution,
      institution_url: parsed.data.institutionUrl || null,
      degree: parsed.data.degree,
      field_of_study: parsed.data.fieldOfStudy || null,
      description: parsed.data.description || null,
      activities: parsed.data.activities || null,
      gpa: parsed.data.gpa ?? null,
      gpa_scale: parsed.data.gpaScale ?? null,
      location: parsed.data.location || null,
      start_date: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      end_date: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      is_current: parsed.data.isCurrent,
      display_order: parsed.data.displayOrder,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'education.created',
      entityType: 'education',
      entityId: educationId,
      newValues: { institution: parsed.data.institution, degree: parsed.data.degree },
    });

    revalidatePath('/education');
    revalidatePath('/about');
    revalidatePath('/admin/education');
    revalidatePath('/admin');
    revalidatePath('/');

    return { status: 'success', message: 'Education record added successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to create education record.' };
  }
}

export async function updateEducationAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const raw = {
    institution: formData.get('institution') as string,
    institutionUrl: (formData.get('institutionUrl') as string) || undefined,
    degree: formData.get('degree') as string,
    fieldOfStudy: (formData.get('fieldOfStudy') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    activities: (formData.get('activities') as string) || undefined,
    gpa: formData.get('gpa') ? Number(formData.get('gpa')) : undefined,
    gpaScale: formData.get('gpaScale') ? Number(formData.get('gpaScale')) : undefined,
    location: (formData.get('location') as string) || undefined,
    startDate: (formData.get('startDate') as string) || undefined,
    endDate: (formData.get('endDate') as string) || undefined,
    isCurrent: formData.get('isCurrent') === 'on' || formData.get('isCurrent') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
  };

  const parsed = educationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await updateEducation(id, {
      institution: parsed.data.institution,
      institution_url: parsed.data.institutionUrl || null,
      degree: parsed.data.degree,
      field_of_study: parsed.data.fieldOfStudy || null,
      description: parsed.data.description || null,
      activities: parsed.data.activities || null,
      gpa: parsed.data.gpa ?? null,
      gpa_scale: parsed.data.gpaScale ?? null,
      location: parsed.data.location || null,
      start_date: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      end_date: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      is_current: parsed.data.isCurrent,
      display_order: parsed.data.displayOrder,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'education.updated',
      entityType: 'education',
      entityId: id,
      newValues: { institution: parsed.data.institution, degree: parsed.data.degree },
    });

    revalidatePath('/education');
    revalidatePath('/about');
    revalidatePath('/admin/education');
    revalidatePath('/');

    return { status: 'success', message: 'Education record updated successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to update education record.' };
  }
}

export async function deleteEducationAction(id: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteEducation(id);
    await createAuditLog({
      userId: admin.id,
      action: 'education.deleted',
      entityType: 'education',
      entityId: id,
    });

    revalidatePath('/education');
    revalidatePath('/about');
    revalidatePath('/admin/education');
    revalidatePath('/');

    return { status: 'success', message: 'Education record deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete education record.' };
  }
}
