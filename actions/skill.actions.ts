'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import {
  createSkill,
  updateSkill,
  deleteSkill,
  createSkillCategory,
  deleteSkillCategory,
} from '@/lib/repositories/skills.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';
import type { SkillLevel } from '@/types/db.types';

export async function createSkillAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const name = (formData.get('name') as string) || '';
  const slug = (formData.get('slug') as string) || '';
  const categoryId = formData.get('categoryId') ? Number(formData.get('categoryId')) : null;
  const level = (formData.get('level') as SkillLevel) || 'advanced';
  const years = formData.get('yearsOfExperience') ? Number(formData.get('yearsOfExperience')) : null;
  const icon = (formData.get('icon') as string) || null;
  const description = (formData.get('description') as string) || null;
  const displayOrder = formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0;
  const isFeatured = formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true';

  if (!name.trim() || !slug.trim() || !categoryId) {
    return { status: 'error', error: 'Name, slug, and category are required.' };
  }

  try {
    const skillId = await createSkill({
      category_id: categoryId,
      name: name.trim(),
      slug: slug.trim(),
      level,
      years_of_experience: years,
      icon,
      description,
      display_order: displayOrder,
      is_featured: isFeatured,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'skill.created',
      entityType: 'skill',
      entityId: skillId,
      newValues: { name, level },
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { status: 'success', message: 'Technical skill added successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to create skill.' };
  }
}

export async function updateSkillAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const name = (formData.get('name') as string) || '';
  const slug = (formData.get('slug') as string) || '';
  const categoryId = formData.get('categoryId') ? Number(formData.get('categoryId')) : undefined;
  const level = (formData.get('level') as SkillLevel) || 'advanced';
  const years = formData.get('yearsOfExperience') ? Number(formData.get('yearsOfExperience')) : null;
  const icon = (formData.get('icon') as string) || null;
  const description = (formData.get('description') as string) || null;
  const displayOrder = formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0;
  const isFeatured = formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true';

  try {
    await updateSkill(id, {
      category_id: categoryId,
      name: name.trim(),
      slug: slug.trim(),
      level,
      years_of_experience: years,
      icon,
      description,
      display_order: displayOrder,
      is_featured: isFeatured,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'skill.updated',
      entityType: 'skill',
      entityId: id,
      newValues: { name, level },
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { status: 'success', message: 'Skill updated successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to update skill.' };
  }
}

export async function deleteSkillAction(id: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteSkill(id);
    await createAuditLog({
      userId: admin.id,
      action: 'skill.deleted',
      entityType: 'skill',
      entityId: id,
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { status: 'success', message: 'Skill deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete skill.' };
  }
}

export async function createSkillCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const name = (formData.get('name') as string) || '';
  const slug = (formData.get('slug') as string) || '';
  const description = (formData.get('description') as string) || null;
  const displayOrder = formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0;

  if (!name.trim() || !slug.trim()) {
    return { status: 'error', error: 'Category name and slug are required.' };
  }

  try {
    const categoryId = await createSkillCategory({
      name: name.trim(),
      slug: slug.trim(),
      description,
      display_order: displayOrder,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'skill_category.created',
      entityType: 'skill_category',
      entityId: categoryId,
      newValues: { name },
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { status: 'success', message: 'Skill domain category created!' };
  } catch {
    return { status: 'error', error: 'Failed to create skill category.' };
  }
}

export async function deleteSkillCategoryAction(id: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteSkillCategory(id);
    await createAuditLog({
      userId: admin.id,
      action: 'skill_category.deleted',
      entityType: 'skill_category',
      entityId: id,
    });

    revalidatePath('/skills');
    revalidatePath('/about');
    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { status: 'success', message: 'Skill category removed.' };
  } catch {
    return { status: 'error', error: 'Failed to delete skill category. Check if skills are attached.' };
  }
}
