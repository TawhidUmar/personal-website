'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import {
  createCategory,
  deleteCategory,
} from '@/lib/repositories/categories.repository';
import { createTag, deleteTag } from '@/lib/repositories/tags.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import { slugify } from '@/lib/utils/slugify';
import type { ActionState } from '@/types/api.types';
import type { CategoryType } from '@/types/db.types';

export async function createCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const name = (formData.get('name') as string)?.trim();
  const type = (formData.get('type') as CategoryType) || 'article';
  const description = (formData.get('description') as string)?.trim() || undefined;

  if (!name || name.length < 2) {
    return { status: 'error', error: 'Category name must be at least 2 characters.' };
  }

  const slug = (formData.get('slug') as string)?.trim() || slugify(name);

  try {
    const id = await createCategory({
      name,
      slug,
      type,
      description: description ?? null,
      color: null,
      display_order: 0,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'category.created',
      entityType: 'category',
      entityId: id,
      newValues: { name, slug, type },
    });

    revalidatePath('/admin/categories');
    return { status: 'success', message: `Category "${name}" created successfully.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return {
      status: 'error',
      error: msg.includes('Duplicate') ? 'A category with this slug already exists.' : 'Failed to create category.',
    };
  }
}

export async function deleteCategoryAction(categoryId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteCategory(categoryId);
    await createAuditLog({
      userId: admin.id,
      action: 'category.deleted',
      entityType: 'category',
      entityId: categoryId,
    });

    revalidatePath('/admin/categories');
    return { status: 'success', message: 'Category deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete category.' };
  }
}

export async function createTagAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const name = (formData.get('name') as string)?.trim();
  const color = (formData.get('color') as string)?.trim() || '#6366f1';

  if (!name || name.length < 2) {
    return { status: 'error', error: 'Tag name must be at least 2 characters.' };
  }

  const slug = (formData.get('slug') as string)?.trim() || slugify(name);

  try {
    const id = await createTag({
      name,
      slug,
      color,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'tag.created',
      entityType: 'tag',
      entityId: id,
      newValues: { name, slug, color },
    });

    revalidatePath('/admin/tags');
    return { status: 'success', message: `Tag "#${name}" created successfully.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return {
      status: 'error',
      error: msg.includes('Duplicate') ? 'A tag with this name/slug already exists.' : 'Failed to create tag.',
    };
  }
}

export async function deleteTagAction(tagId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteTag(tagId);
    await createAuditLog({
      userId: admin.id,
      action: 'tag.deleted',
      entityType: 'tag',
      entityId: tagId,
    });

    revalidatePath('/admin/tags');
    return { status: 'success', message: 'Tag deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete tag.' };
  }
}
