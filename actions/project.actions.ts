'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/guards';
import { projectSchema } from '@/lib/validations/project.schema';
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from '@/lib/repositories/projects.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import type { ActionState } from '@/types/api.types';
import type { ProjectStatus } from '@/types/db.types';

export async function createProjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const technologiesRaw = (formData.get('technologies') as string) || '';
  const technologies = technologiesRaw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const featuresRaw = (formData.get('features') as string) || '';
  const features = featuresRaw
    .split('\n')
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    categoryId: formData.get('categoryId') || undefined,
    description: formData.get('description') as string,
    longDescription: (formData.get('longDescription') as string) || undefined,
    heroImageUrl: (formData.get('heroImageUrl') as string) || undefined,
    projectUrl: (formData.get('projectUrl') as string) || undefined,
    githubUrl: (formData.get('githubUrl') as string) || undefined,
    client: (formData.get('client') as string) || undefined,
    role: (formData.get('role') as string) || undefined,
    problem: (formData.get('problem') as string) || undefined,
    solution: (formData.get('solution') as string) || undefined,
    features,
    architecture: (formData.get('architecture') as string) || undefined,
    challenges: (formData.get('challenges') as string) || undefined,
    results: (formData.get('results') as string) || undefined,
    technologies,
    status: (formData.get('status') as ProjectStatus) || 'published',
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
    startedAt: formData.get('startedAt') as string,
    endedAt: (formData.get('endedAt') as string) || undefined,
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const projectId = await createProject(
      {
        author_id: admin.id,
        category_id: parsed.data.categoryId ?? null,
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        long_description: parsed.data.longDescription ?? null,
        hero_image_url: parsed.data.heroImageUrl || null,
        project_url: parsed.data.projectUrl || null,
        github_url: parsed.data.githubUrl || null,
        client: parsed.data.client ?? null,
        role: parsed.data.role ?? null,
        problem: parsed.data.problem ?? null,
        solution: parsed.data.solution ?? null,
        features: parsed.data.features,
        architecture: parsed.data.architecture ?? null,
        challenges: parsed.data.challenges ?? null,
        results: parsed.data.results ?? null,
        status: parsed.data.status,
        is_featured: parsed.data.isFeatured,
        display_order: parsed.data.displayOrder,
        started_at: new Date(parsed.data.startedAt),
        ended_at: parsed.data.endedAt ? new Date(parsed.data.endedAt) : null,
      },
      technologies
    );

    await createAuditLog({
      userId: admin.id,
      action: 'project.created',
      entityType: 'project',
      entityId: projectId,
      newValues: { title: parsed.data.title },
    });

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/admin');

    return { status: 'success', message: 'Project created successfully!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    return {
      status: 'error',
      error: msg.includes('Duplicate') ? 'A project with this slug already exists.' : 'Failed to create project.',
    };
  }
}

export async function updateProjectAction(
  projectId: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const technologiesRaw = (formData.get('technologies') as string) || '';
  const technologies = technologiesRaw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const featuresRaw = (formData.get('features') as string) || '';
  const features = featuresRaw
    .split('\n')
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  const raw = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    categoryId: formData.get('categoryId') || undefined,
    description: formData.get('description') as string,
    longDescription: (formData.get('longDescription') as string) || undefined,
    heroImageUrl: (formData.get('heroImageUrl') as string) || undefined,
    projectUrl: (formData.get('projectUrl') as string) || undefined,
    githubUrl: (formData.get('githubUrl') as string) || undefined,
    client: (formData.get('client') as string) || undefined,
    role: (formData.get('role') as string) || undefined,
    problem: (formData.get('problem') as string) || undefined,
    solution: (formData.get('solution') as string) || undefined,
    features,
    architecture: (formData.get('architecture') as string) || undefined,
    challenges: (formData.get('challenges') as string) || undefined,
    results: (formData.get('results') as string) || undefined,
    technologies,
    status: (formData.get('status') as ProjectStatus) || 'published',
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
    displayOrder: formData.get('displayOrder') ? Number(formData.get('displayOrder')) : 0,
    startedAt: formData.get('startedAt') as string,
    endedAt: (formData.get('endedAt') as string) || undefined,
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please fix validation errors.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await updateProject(
      projectId,
      {
        category_id: parsed.data.categoryId ?? null,
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        long_description: parsed.data.longDescription ?? null,
        hero_image_url: parsed.data.heroImageUrl || null,
        project_url: parsed.data.projectUrl || null,
        github_url: parsed.data.githubUrl || null,
        client: parsed.data.client ?? null,
        role: parsed.data.role ?? null,
        problem: parsed.data.problem ?? null,
        solution: parsed.data.solution ?? null,
        features: parsed.data.features,
        architecture: parsed.data.architecture ?? null,
        challenges: parsed.data.challenges ?? null,
        results: parsed.data.results ?? null,
        status: parsed.data.status,
        is_featured: parsed.data.isFeatured,
        display_order: parsed.data.displayOrder,
        started_at: new Date(parsed.data.startedAt),
        ended_at: parsed.data.endedAt ? new Date(parsed.data.endedAt) : null,
      },
      technologies
    );

    await createAuditLog({
      userId: admin.id,
      action: 'project.updated',
      entityType: 'project',
      entityId: projectId,
      newValues: { title: parsed.data.title },
    });

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${parsed.data.slug}`);
    revalidatePath('/admin/projects');

    return { status: 'success', message: 'Project updated successfully!' };
  } catch (err: unknown) {
    return { status: 'error', error: 'Failed to update project.' };
  }
}

export async function deleteProjectAction(projectId: number): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    await deleteProject(projectId);
    await createAuditLog({
      userId: admin.id,
      action: 'project.deleted',
      entityType: 'project',
      entityId: projectId,
    });

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/admin');

    return { status: 'success', message: 'Project deleted successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to delete project.' };
  }
}


