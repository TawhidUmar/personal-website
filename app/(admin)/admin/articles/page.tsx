import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAdminArticles } from '@/lib/repositories/articles.repository';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { ArticleActions } from '@/components/admin/ArticleActions';
import { FeaturedArticleToggle } from '@/components/admin/FeaturedArticleToggle';
import { Plus, Search, Filter, FileText, Eye, Clock } from 'lucide-react';
import type { ArticleStatus } from '@/types/db.types';

export const metadata: Metadata = {
  title: 'Manage Articles | Admin',
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
    category?: string;
  }>;
}

function formatDate(date: Date | string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;

  const page = Number(params.page ?? '1');
  const status = params.status as ArticleStatus | undefined;
  const search = params.search;
  const categoryId = params.category ? Number(params.category) : undefined;

  const [{ articles, total }, categories] = await Promise.all([
    getAdminArticles({ page, limit: 20, status, search, categoryId }).catch(() => ({
      articles: [],
      total: 0,
    })),
    getAllCategories('article').catch(() => []),
  ]);

  const statusColors: Record<ArticleStatus, { bg: string; text: string; border: string }> = {
    published: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
    review: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
    draft: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20' },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Technical Articles CMS
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Total {total} article{total === 1 ? '' : 's'} authored
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Create New Article
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href="/admin/articles"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              !status
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            All Articles
          </Link>
          <Link
            href="/admin/articles?status=published"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              status === 'published'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Published
          </Link>
          <Link
            href="/admin/articles?status=draft"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              status === 'draft'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Drafts
          </Link>
          <Link
            href="/admin/articles?status=archived"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              status === 'archived'
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }`}
          >
            Archived
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3.5">Title & Excerpt</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Featured</th>
                <th className="px-4 py-3.5">Metrics</th>
                <th className="px-4 py-3.5">Published</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-foreground)]">
              {articles.length > 0 ? (
                articles.map((article) => {
                  const s = statusColors[article.status] ?? statusColors.draft;
                  const isFeatured = Boolean(article.is_featured);
                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-[var(--color-surface-raised)] transition-colors"
                    >
                      <td className="px-5 py-4 max-w-sm">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="font-bold text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                        >
                          {article.title}
                        </Link>
                        {article.excerpt && (
                          <p className="text-[11px] text-[var(--color-muted)] line-clamp-1 mt-0.5">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {article.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="font-mono text-[10px] text-[var(--color-muted)] bg-[var(--color-background)] px-1.5 py-0.5 rounded border border-[var(--color-border)]"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-[var(--color-accent)]">
                          {article.category_name ?? '—'}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${s.bg} ${s.text} ${s.border}`}
                        >
                          {article.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <FeaturedArticleToggle
                          articleId={article.id}
                          isFeatured={isFeatured}
                        />
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-mono text-[11px] text-[var(--color-muted)]">
                        <div>
                          <span className="text-[var(--color-foreground)] font-bold">
                            {article.view_count.toLocaleString()}
                          </span>{' '}
                          views
                        </div>
                        {article.reading_time && (
                          <div>{article.reading_time} min read</div>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-[var(--color-muted)]">
                        {formatDate(article.published_at ?? article.created_at)}
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <ArticleActions
                          articleId={article.id}
                          slug={article.slug}
                          status={article.status}
                          isFeatured={isFeatured}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--color-muted)]">
                    No articles found matching the selected filters.
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
