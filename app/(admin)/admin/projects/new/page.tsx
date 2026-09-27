import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create Project Case Study | Admin',
};

export default async function NewProjectPage() {
  await requireAdmin();
  const categories = await getAllCategories('project').catch(() => []);

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
          Create Project Case Study
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Document an engineering system architecture, features, obstacles overcome, and benchmark results.
        </p>
      </div>

      <ProjectForm categories={categories} />
    </div>
  );
}
