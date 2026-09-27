import type { Metadata } from 'next';
import { getPublicAllArticles, getPublicHeadlines, getPublicProfile } from '@/lib/services/public-data.service';
import { SectionHeader } from '@/components/public/SectionHeader';
import { FeaturedArticleCard } from '@/components/public/FeaturedArticleCard';
import { BookOpen, Clock, FileText, Sparkles } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const [profile, headlines] = await Promise.all([
    getPublicProfile(),
    getPublicHeadlines(),
  ]);
  const name = profile.name || 'Md Tawhidul Islam';
  const title = `${headlines.articles_title || 'Technical Articles & Research Blog'} | ${name}`;
  const description = headlines.articles_description || 'Deep dives into machine learning algorithms, distributed systems, and modern web architectures.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `/api/og?title=${encodeURIComponent(headlines.articles_title || 'Technical Articles')}&category=Engineering+%C2%B7+AI` }],
    },
  };
}

export default async function ArticlesListingPage() {
  const [articles, headlines] = await Promise.all([
    getPublicAllArticles(),
    getPublicHeadlines(),
  ]);

  const totalReadingTime = articles.reduce((acc, a) => acc + (a.reading_time ?? 5), 0);
  const totalViews = articles.reduce((acc, a) => acc + a.view_count, 0);

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <SectionHeader
          badge={headlines.articles_badge}
          title={headlines.articles_title}
          description={headlines.articles_description}
          align="center"
        />

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              {articles.length}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Published Articles
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">
              {totalReadingTime} min
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Total Reading Depth
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-green-500">
              {totalViews.toLocaleString()}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Technical Readers
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              Zero-Spam
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Peer-Quality Content
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <FeaturedArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
