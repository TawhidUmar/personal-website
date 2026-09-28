import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Code2,
  Calendar,
  Database,
  Cpu,
  Layers,
  FlaskConical,
  ExternalLink,
} from 'lucide-react';
import { getPublicResearchBySlug } from '@/lib/services/public-data.service';
import { BibtexCitation } from '@/components/public/BibtexCitation';
import { ShareButtons } from '@/components/public/ShareButtons';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateScholarlyArticleSchema } from '@/lib/seo/schema-generators';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const research = await getPublicResearchBySlug(slug);
  if (!research) return { title: 'Research Not Found' };

  const ogImage = `/api/og?title=${encodeURIComponent(research.title)}&category=Research+Paper&subtitle=${encodeURIComponent(
    research.doi ? `DOI: ${research.doi}` : 'ArXiv / Peer-Reviewed Manuscript'
  )}`;

  return {
    title: `${research.title} | AI Research Manuscript`,
    description: research.abstract?.slice(0, 160) ?? 'Research manuscript and methodology publication.',
    openGraph: {
      type: 'article',
      title: research.title,
      description: research.abstract?.slice(0, 200) ?? undefined,
      publishedTime: research.published_at ? new Date(research.published_at).toISOString() : undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: research.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: research.title,
      description: research.abstract?.slice(0, 200) ?? undefined,
      images: [ogImage],
    },
  };
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'Recently';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublicResearchBySlug(slug);

  if (!item) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tawhidulislam.me';
  const paperSchema = generateScholarlyArticleSchema(item, siteUrl);

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      <JsonLd data={paperSchema} />
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" aria-hidden="true" />

      <article className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back navigation */}
        <div>
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Research Directory
          </Link>
        </div>

        {/* Paper Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] flex items-center gap-1">
              <FlaskConical size={13} />
              {item.category_name ?? 'Deep Learning Research'}
            </span>
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {item.publication_status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-foreground)] leading-tight">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)]">
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(item.published_at)}
            </span>
            {item.doi && (
              <span>
                DOI: <code className="text-[var(--color-foreground)]">{item.doi}</code>
              </span>
            )}
            <span>Author: Alex Chen et al.</span>
          </div>

          {/* Action Links & Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              {item.publication_url && (
                <a
                  href={item.publication_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all"
                >
                  <FileText size={14} />
                  Download Paper / arXiv
                  <ExternalLink size={12} />
                </a>
              )}
              {item.github_url && (
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
                >
                  <Code2 size={14} />
                  Code Repository
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            <ShareButtons title={item.title} />
          </div>
        </header>

        {/* Abstract Box */}
        {item.abstract && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold mb-3">
              Abstract
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-foreground)] font-serif">
              {item.abstract}
            </p>
          </section>
        )}

        {/* Methodology Section */}
        {item.methodology && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-foreground)]">
              <Cpu size={18} className="text-[var(--color-accent)]" />
              Methodology & Mathematical Formulation
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
              {item.methodology}
            </p>
          </section>
        )}

        {/* Dataset & Technologies Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {item.dataset && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-2">
              <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--color-foreground)] uppercase tracking-wider">
                <Database size={15} className="text-[var(--color-accent)]" />
                Datasets & Benchmarks
              </h3>
              <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                {item.dataset}
              </p>
            </div>
          )}

          {item.technologies && item.technologies.length > 0 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-2">
              <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--color-foreground)] uppercase tracking-wider">
                <Layers size={15} className="text-[var(--color-accent)]" />
                Frameworks & Compute Stack
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1 font-mono text-xs text-[var(--color-foreground)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BibTeX Citation */}
        <BibtexCitation
          title={item.title}
          author="Alex Chen"
          doi={item.doi}
          url={item.publication_url}
        />
      </article>
    </div>
  );
}
