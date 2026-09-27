import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAdminProjects } from '@/lib/repositories/projects.repository';
import { ProjectActions } from '@/components/admin/ProjectActions';
import { Plus, Briefcase, ExternalLink, Code2 } from 'lucide-react';
import type { ProjectStatus } from '@/types/db.types';

export const metadata: Metadata = {
  title: 'Manage Projects | Admin',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const status = params.status as ProjectStatus | undefined;

  const { projects, total } = await getAdminProjects({ status }).catch(() => ({
    projects: [],
    total: 0,
  }));

  const statusBadge: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
    published: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
    draft: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20' },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Project Portfolio CMS
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Total {total} system architectures and open-source projects
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Create New Project
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3.5">Title & Role</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Tech Stack</th>
                <th className="px-4 py-3.5">Client / Context</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-foreground)]">
              {projects.map((project) => {
                const s = statusBadge[project.status] ?? statusBadge.published;
                return (
                  <tr key={project.id} className="hover:bg-[var(--color-surface-raised)] transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="font-bold text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                      >
                        {project.title}
                      </Link>
                      <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                        {project.role ?? 'Architect'}
                      </p>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-[var(--color-accent)]">
                        {project.category_name ?? '—'}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${s.bg} ${s.text} ${s.border}`}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[10px] text-[var(--color-muted)] bg-[var(--color-background)] px-1.5 py-0.5 rounded border border-[var(--color-border)]"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="font-mono text-[10px] text-[var(--color-muted)]">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--color-muted)]">
                      {project.client ?? '—'}
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <ProjectActions projectId={project.id} slug={project.slug} />
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--color-muted)]">
                    No projects found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
