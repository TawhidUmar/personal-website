import Link from 'next/link';
import { FlaskConical, Code2, FileText, ArrowUpRight } from 'lucide-react';
import type { ResearchWithCategory } from '@/lib/repositories/research.repository';

interface FeaturedResearchCardProps {
  item: ResearchWithCategory;
}

export function FeaturedResearchCard({ item }: FeaturedResearchCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-xl">
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
        {/* Category & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
            <FlaskConical size={11} />
            {item.category_name ?? 'Research'}
          </span>

          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {item.publication_status}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
          <Link href={`/research/${item.slug}`}>
            {item.title}
          </Link>
        </h3>

        {/* Abstract snippet */}
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-foreground-muted)] line-clamp-3">
          {item.abstract}
        </p>

        {/* Methodology note */}
        {item.methodology && (
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/70 p-3">
            <span className="font-mono text-[11px] font-bold text-[var(--color-foreground)]">Methodology: </span>
            <span className="text-xs text-[var(--color-muted)] line-clamp-2">{item.methodology}</span>
          </div>
        )}
      </div>

      {/* Footer / Links */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.publication_url && (
            <a
              href={item.publication_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[var(--color-accent)] hover:underline"
            >
              <FileText size={12} />
              Paper / arXiv
            </a>
          )}
          {item.github_url && (
            <a
              href={item.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <Code2 size={12} />
              Source Code
            </a>
          )}
        </div>

        <Link
          href={`/research/${item.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline"
        >
          Details
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
