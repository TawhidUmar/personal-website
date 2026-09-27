'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import {
  upsertProfile,
  upsertSocialLink,
  deleteSocialLink,
} from '@/lib/repositories/profiles.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const name = (formData.get('name') as string) || null;
  const headline = (formData.get('headline') as string) || null;
  const bio = (formData.get('bio') as string) || null;
  const bioExtended = (formData.get('bioExtended') as string) || null;
  const avatarUrl = (formData.get('avatarUrl') as string) || null;
  const resumeUrl = (formData.get('resumeUrl') as string) || null;
  const location = (formData.get('location') as string) || null;
  const phone = (formData.get('phone') as string) || null;
  const website = (formData.get('website') as string) || null;

  try {
    if (name && name.trim()) {
      const { updateUserName } = await import('@/lib/repositories/users.repository');
      await updateUserName(admin.id, name.trim());
    }

    await upsertProfile(admin.id, {
      headline,
      bio,
      bio_extended: bioExtended,
      avatar_url: avatarUrl,
      resume_url: resumeUrl,
      location,
      phone,
      website,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'profile.updated',
      entityType: 'profile',
      entityId: admin.id,
      newValues: { name, headline, location, website },
    });

    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/');
    revalidatePath('/admin/profile');

    return { status: 'success', message: 'Profile updated successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to update profile.' };
  }
}

export async function saveSocialLinkAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const platform = (formData.get('platform') as string) || '';
  const url = (formData.get('url') as string) || '';
  const displayOrder = formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0;

  if (!platform.trim() || !url.trim()) {
    return { status: 'error', error: 'Platform and URL are required.' };
  }

  try {
    await upsertSocialLink(admin.id, platform.trim(), url.trim(), displayOrder);

    await createAuditLog({
      userId: admin.id,
      action: 'social_link.saved',
      entityType: 'social_link',
      newValues: { platform, url },
    });

    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/');
    revalidatePath('/admin/social-links');

    return { status: 'success', message: 'Social coordinate saved.' };
  } catch {
    return { status: 'error', error: 'Failed to save social link.' };
  }
}

export async function deleteSocialLinkAction(id: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteSocialLink(id, admin.id);

    await createAuditLog({
      userId: admin.id,
      action: 'social_link.deleted',
      entityType: 'social_link',
      entityId: id,
    });

    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/');
    revalidatePath('/admin/social-links');

    return { status: 'success', message: 'Social link removed.' };
  } catch {
    return { status: 'error', error: 'Failed to delete social link.' };
  }
}
