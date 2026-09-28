import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicAllResearch, getPublicHeadlines } from '@/lib/services/public-data.service';
import { SectionHeader } from '@/components/public/SectionHeader';
import { FeaturedResearchCard } from '@/components/public/FeaturedResearchCard';
import { FlaskConical, BookOpen, Layers, Cpu } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'AI/ML Research & Publications | Alex Vance',
  description:
    'Graduate research manuscripts, preprints, and publications in Deep Learning, Structured State-Space Models, and Mechanistic Interpretability.',
  openGraph: {
    title: 'AI/ML Research & Publications | Alex Vance',
    description: 'Peer-reviewed papers, preprints, and machine intelligence methodologies.',
    images: [{ url: '/api/og?title=Research+Publications&category=AI%2FML+%C2%B7+Deep+Learning' }],
  },
};

export default async function ResearchListingPage() {
  const [research, headlines] = await Promise.all([
    getPublicAllResearch(),
    getPublicHeadlines(),
  ]);

  const peerReviewedCount = research.filter((r) => r.publication_status === 'published').length;
  const preprintCount = research.filter((r) => r.publication_status === 'preprint').length;

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <SectionHeader
          badge={headlines.research_badge}
          title={headlines.research_title}
          description={headlines.research_description}
          align="center"
        />

        {/* Research Metrics Strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              {research.length}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Manuscripts
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">
              {peerReviewedCount}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Peer-Reviewed Papers
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-purple-500">
              {preprintCount}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              ArXiv Preprints
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-green-500">
              100%
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Open Code & Artifacts
            </p>
          </div>
        </div>

        {/* Research Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {research.map((item) => (
            <FeaturedResearchCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
