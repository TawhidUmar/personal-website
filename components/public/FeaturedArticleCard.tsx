import Link from 'next/link';
import { Clock, Calendar, ArrowUpRight, Star, Tag, Eye } from 'lucide-react';
import type { DbArticleWithAuthor } from '@/types/db.types';

interface FeaturedArticleCardProps {
  article: DbArticleWithAuthor;
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'Recently';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-xl">
      {/* Top gradient accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
        aria-hidden="true"
      />

      {/* Corner crosshair marks */}
      <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>

      <div>
        {/* Cover Image if available */}
        {article.cover_image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Category, Read time & Featured Badge */}
        <div className="flex items-center justify-between text-xs text-[var(--color-muted)] font-mono gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
              {article.category_name ?? 'Article'}
            </span>
            {article.is_featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500">
                <Star size={10} fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          {article.reading_time && (
            <span className="flex items-center gap-1 text-[11px]">
              <Clock size={11} />
              {article.reading_time} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3.5 text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-foreground-muted)] line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-muted)]"
              >
                <Tag size={9} />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(article.published_at)}
          </span>
          {article.view_count > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {article.view_count.toLocaleString()}
            </span>
          )}
        </div>

        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline"
        >
          Read Article
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  );
}
