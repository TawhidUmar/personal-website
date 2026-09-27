'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import { researchSchema } from '@/lib/validations/research.schema';
import {
  createResearch,
  updateResearch,
  deleteResearch,
  getResearchById,
} from '@/lib/repositories/research.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';
import type { ResearchStatus, PublicationStatus } from '@/types/db.types';

export async function createResearchAction(
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
    slug: formData.get('slug') as string,
    categoryId: formData.get('categoryId') || undefined,
    abstract: formData.get('abstract') as string,
    methodology: (formData.get('methodology') as string) || undefined,
    technologies,
    dataset: (formData.get('dataset') as string) || undefined,
    status: (formData.get('status') as ResearchStatus) || 'published',
    publicationStatus: (formData.get('publicationStatus') as PublicationStatus) || 'preprint',
    publicationUrl: (formData.get('publicationUrl') as string) || undefined,
    doi: (formData.get('doi') as string) || undefined,
    githubUrl: (formData.get('githubUrl') as string) || undefined,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    publishedAt: (formData.get('publishedAt') as string) || undefined,
  };

  const parsed = researchSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const researchId = await createResearch({
      author_id: admin.id,
      category_id: parsed.data.categoryId ?? null,
      title: parsed.data.title,
      slug: parsed.data.slug,
      abstract: parsed.data.abstract,
      methodology: parsed.data.methodology ?? null,
      technologies: parsed.data.technologies,
      dataset: parsed.data.dataset ?? null,
      status: parsed.data.status,
      publication_status: parsed.data.publicationStatus,
      publication_url: parsed.data.publicationUrl || null,
      doi: parsed.data.doi ?? null,
      github_url: parsed.data.githubUrl || null,
      is_featured: parsed.data.isFeatured,
      published_at: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date(),
    });

    await createAuditLog({
      userId: admin.id,
      action: 'research.created',
      entityType: 'research',
      entityId: researchId,
      newValues: { title: parsed.data.title },
    });

    revalidatePath('/');
    revalidatePath('/research');
    revalidatePath('/admin/research');
    revalidatePath('/admin');

    return { status: 'success', message: 'Research manuscript created successfully!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return {
      status: 'error',
      error: msg.includes('Duplicate') ? 'A research item with this slug already exists.' : 'Failed to create research.',
    };
  }
}

export async function updateResearchAction(
  researchId: number,
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
    slug: formData.get('slug') as string,
    categoryId: formData.get('categoryId') || undefined,
    abstract: formData.get('abstract') as string,
    methodology: (formData.get('methodology') as string) || undefined,
    technologies,
    dataset: (formData.get('dataset') as string) || undefined,
    status: (formData.get('status') as ResearchStatus) || 'published',
    publicationStatus: (formData.get('publicationStatus') as PublicationStatus) || 'preprint',
    publicationUrl: (formData.get('publicationUrl') as string) || undefined,
    doi: (formData.get('doi') as string) || undefined,
    githubUrl: (formData.get('githubUrl') as string) || undefined,
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    publishedAt: (formData.get('publishedAt') as string) || undefined,
  };

  const parsed = researchSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await updateResearch(researchId, {
      category_id: parsed.data.categoryId ?? null,
      title: parsed.data.title,
      slug: parsed.data.slug,
      abstract: parsed.data.abstract,
      methodology: parsed.data.methodology ?? null,
      technologies: parsed.data.technologies,
      dataset: parsed.data.dataset ?? null,
      status: parsed.data.status,
      publication_status: parsed.data.publicationStatus,
      publication_url: parsed.data.publicationUrl || null,
      doi: parsed.data.doi ?? null,
      github_url: parsed.data.githubUrl || null,
      is_featured: parsed.data.isFeatured,
      published_at: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
    });

    await createAuditLog({
      userId: admin.id,
      action: 'research.updated',
      entityType: 'research',
      entityId: researchId,
      newValues: { title: parsed.data.title },
    });

    revalidatePath('/');
    revalidatePath('/research');
    revalidatePath(`/research/${parsed.data.slug}`);
    revalidatePath('/admin/research');

    return { status: 'success', message: 'Research updated successfully!' };
  } catch {
    return { status: 'error', error: 'Failed to update research.' };
  }
}

export async function deleteResearchAction(researchId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteResearch(researchId);
    await createAuditLog({
      userId: admin.id,
      action: 'research.deleted',
      entityType: 'research',
      entityId: researchId,
    });

    revalidatePath('/');
    revalidatePath('/research');
    revalidatePath('/admin/research');
    revalidatePath('/admin');

    return { status: 'success', message: 'Research manuscript deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete research.' };
  }
}

