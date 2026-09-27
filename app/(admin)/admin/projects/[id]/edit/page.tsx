import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getProjectById } from '@/lib/repositories/projects.repository';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Project Case Study | Admin',
};

export default async function EditProjectPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const projectId = Number(id);

  if (isNaN(projectId)) {
    notFound();
  }

  const [project, categories] = await Promise.all([
    getProjectById(projectId),
    getAllCategories('project').catch(() => []),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="space-y-2">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Projects Directory
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          Edit Case Study: {project.title}
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Update system architecture, performance metrics, features, or links.
        </p>
      </div>

      <ProjectForm categories={categories} initialProject={project} />
    </div>
  );
}
