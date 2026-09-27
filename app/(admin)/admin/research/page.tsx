import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAdminResearch } from '@/lib/repositories/research.repository';
import { ResearchActions } from '@/components/admin/ResearchActions';
import { Plus, BookOpen, ExternalLink, FileText } from 'lucide-react';
import type { PublicationStatus } from '@/types/db.types';

export const metadata: Metadata = {
  title: 'Manage Research Manuscripts | Admin',
};

interface PageProps {
  searchParams: Promise<{
    publicationStatus?: string;
  }>;
}

export default async function AdminResearchPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const publicationStatus = params.publicationStatus as PublicationStatus | undefined;

  const { research, total } = await getAdminResearch({ publicationStatus }).catch(() => ({
    research: [],
    total: 0,
  }));

  const pubBadge: Record<PublicationStatus, { bg: string; text: string; border: string; label: string }> = {
    published: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20', label: 'Peer Reviewed' },
    preprint: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20', label: 'Preprint' },
    'under-review': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', label: 'Under Review' },
    unpublished: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20', label: 'Unpublished' },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Research Manuscripts CMS
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Total {total} peer-reviewed papers, preprints, and research manuscripts
          </p>
        </div>

        <Link
          href="/admin/research/new"
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Publish New Manuscript
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3.5">Title & DOI</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Publication Status</th>
                <th className="px-4 py-3.5">Methodology & Dataset</th>
                <th className="px-4 py-3.5">Published Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-foreground)]">
              {research.map((paper) => {
                const badge = pubBadge[paper.publication_status] ?? pubBadge.published;
                return (
                  <tr key={paper.id} className="hover:bg-[var(--color-surface-raised)] transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <Link
                        href={`/admin/research/${paper.id}/edit`}
                        className="font-bold text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                      >
                        {paper.title}
                      </Link>
                      <p className="font-mono text-[11px] text-[var(--color-muted)] mt-0.5">
                        {paper.doi ? `DOI: ${paper.doi}` : paper.slug}
                      </p>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-[var(--color-accent)]">
                        {paper.category_name ?? '—'}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td className="px-4 py-4 max-w-xs">
                      <div className="space-y-1">
                        <p className="line-clamp-1 text-[var(--color-muted)]">
                          {paper.methodology ?? '—'}
                        </p>
                        {paper.dataset && (
                          <p className="font-mono text-[10px] text-[var(--color-accent)]">
                            Data: {paper.dataset}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--color-muted)]">
                      {paper.published_at ? new Date(paper.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : '—'}
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <ResearchActions researchId={paper.id} slug={paper.slug} />
                    </td>
                  </tr>
                );
              })}
              {research.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--color-muted)]">
                    No research manuscripts found in database.
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
