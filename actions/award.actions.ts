'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import { awardSchema } from '@/lib/validations/award.schema';
import {
  createAward,
  updateAward,
  deleteAward,
} from '@/lib/repositories/awards.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';
import type { AwardCategory } from '@/types/db.types';

export async function createAwardAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const raw = {
    title: formData.get('title') as string,
    issuer: formData.get('issuer') as string,
    issuerUrl: (formData.get('issuerUrl') as string) || undefined,
    category: (formData.get('category') as string) || 'award',
    date: (formData.get('date') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    badgeUrl: (formData.get('badgeUrl') as string) || undefined,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
  };

  const parsed = awardSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const awardId = await createAward({
      user_id: admin.id,
      title: parsed.data.title,
      issuer: parsed.data.issuer,
      issuer_url: parsed.data.issuerUrl || null,
      category: parsed.data.category as AwardCategory,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      description: parsed.data.description || null,
      badge_url: parsed.data.badgeUrl || null,
      is_featured: parsed.data.isFeatured ?? false,
      display_order: parsed.data.displayOrder ?? 0,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'award.created',
      entityType: 'award',
      entityId: awardId,
      newValues: { title: parsed.data.title, category: parsed.data.category },
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/awards');
    revalidatePath('/admin');

    return { status: 'success', message: 'Award/certification added successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to create award.' };
  }
}

export async function updateAwardAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const raw = {
    title: formData.get('title') as string,
    issuer: formData.get('issuer') as string,
    issuerUrl: (formData.get('issuerUrl') as string) || undefined,
    category: (formData.get('category') as string) || 'award',
    date: (formData.get('date') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    badgeUrl: (formData.get('badgeUrl') as string) || undefined,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
  };

  const parsed = awardSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await updateAward(id, {
      title: parsed.data.title,
      issuer: parsed.data.issuer,
      issuer_url: parsed.data.issuerUrl || null,
      category: parsed.data.category as AwardCategory,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      description: parsed.data.description || null,
      badge_url: parsed.data.badgeUrl || null,
      is_featured: parsed.data.isFeatured ?? false,
      display_order: parsed.data.displayOrder ?? 0,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'award.updated',
      entityType: 'award',
      entityId: id,
      newValues: { title: parsed.data.title, category: parsed.data.category },
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/awards');

    return { status: 'success', message: 'Award/certification updated successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to update award.' };
  }
}

export async function deleteAwardAction(id: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteAward(id);
    await createAuditLog({
      userId: admin.id,
      action: 'award.deleted',
      entityType: 'award',
      entityId: id,
    });

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/awards');

    return { status: 'success', message: 'Award/certification deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete award.' };
  }
}
