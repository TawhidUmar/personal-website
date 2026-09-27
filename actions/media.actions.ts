'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import {
  createMedia,
  updateMedia,
  deleteMedia,
} from '@/lib/repositories/media.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';

export async function createMediaAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const url = formData.get('url') as string;
  const filename = formData.get('filename') as string;
  const originalFilename = (formData.get('originalFilename') as string) || filename;
  const mimeType = (formData.get('mimeType') as string) || 'image/jpeg';
  const size = formData.get('size') ? Number(formData.get('size')) : 102400;
  const width = formData.get('width') ? Number(formData.get('width')) : null;
  const height = formData.get('height') ? Number(formData.get('height')) : null;
  const alt = (formData.get('alt') as string) || null;
  const caption = (formData.get('caption') as string) || null;
  const folder = (formData.get('folder') as string) || 'general';

  if (!url || !url.trim()) {
    return {
      status: 'error',
      error: 'Media URL is required.',
    };
  }

  if (!filename || !filename.trim()) {
    return {
      status: 'error',
      error: 'Filename is required.',
    };
  }

  try {
    const mediaId = await createMedia({
      uploader_id: admin.id,
      filename: filename.trim(),
      original_filename: originalFilename.trim(),
      url: url.trim(),
      mime_type: mimeType,
      size,
      width,
      height,
      alt,
      caption,
      folder,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'media.uploaded',
      entityType: 'media',
      entityId: mediaId,
      newValues: { filename, url, folder },
    });

    revalidatePath('/admin/media');

    return { status: 'success', message: 'Asset cataloged successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to save media asset.' };
  }
}

export async function updateMediaAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const alt = (formData.get('alt') as string) || null;
  const caption = (formData.get('caption') as string) || null;
  const folder = (formData.get('folder') as string) || 'general';

  try {
    await updateMedia(id, {
      alt,
      caption,
      folder,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'media.updated',
      entityType: 'media',
      entityId: id,
      newValues: { alt, caption, folder },
    });

    revalidatePath('/admin/media');

    return { status: 'success', message: 'Media metadata updated.' };
  } catch {
    return { status: 'error', error: 'Failed to update media metadata.' };
  }
}

export async function deleteMediaAction(id: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteMedia(id);
    await createAuditLog({
      userId: admin.id,
      action: 'media.deleted',
      entityType: 'media',
      entityId: id,
    });

    revalidatePath('/admin/media');

    return { status: 'success', message: 'Asset removed from library.' };
  } catch {
    return { status: 'error', error: 'Failed to delete media asset.' };
  }
}
