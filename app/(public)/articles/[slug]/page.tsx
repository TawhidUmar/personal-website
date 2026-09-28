import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  User,
  Tag,
  BookOpen,
} from 'lucide-react';
import {
  getPublicArticleBySlug,
  getPublicCommentsForArticle,
  getPublicProfile,
} from '@/lib/services/public-data.service';
import { ShareButtons } from '@/components/public/ShareButtons';
import { ArticleComments } from '@/components/public/ArticleComments';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateArticleSchema } from '@/lib/seo/schema-generators';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  const ogImage = article.cover_image_url || `/api/og?title=${encodeURIComponent(article.title)}&category=Technical+Article`;

  return {
    title: `${article.seo_title ?? article.title} | Technical Blog`,
    description: article.seo_description ?? article.excerpt ?? 'Technical article and system engineering dispatch.',
    alternates: {
      canonical: article.canonical_url ?? undefined,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt ?? article.seo_description ?? undefined,
      publishedTime: article.published_at ? new Date(article.published_at).toISOString() : undefined,
      authors: [article.author_name],
      tags: article.tags?.map((t) => t.name) ?? [],
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt ?? article.seo_description ?? undefined,
      images: [ogImage],
    },
  };
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'Recently';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [article, profile] = await Promise.all([
    getPublicArticleBySlug(slug),
    getPublicProfile(),
  ]);

  if (!article) {
    notFound();
  }

  const comments = await getPublicCommentsForArticle(article.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tawhidulislam.me';
  const articleSchema = generateArticleSchema(article, siteUrl);

  const authorName = article.author_name || profile.name || 'Author';
  const authorHeadline = profile.headline || 'Author · Researcher · Developer';

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      <JsonLd data={articleSchema} />
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" aria-hidden="true" />

      <article className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to All Articles
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--color-muted)]">
            {article.category_name && (
              <span className="font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                {article.category_name}
              </span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(article.published_at)}
            </span>
            <span>•</span>
            {article.reading_time && (
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {article.reading_time} min read
              </span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye size={13} />
              {article.view_count.toLocaleString()} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-foreground)] leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg sm:text-xl text-[var(--color-muted)] leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Author Strip & Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                  <Image
                    src={profile.avatar_url}
                    alt={authorName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-xs font-bold">
                  {authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[var(--color-foreground)]">
                  {authorName}
                </p>
                <p className="font-mono text-[11px] text-[var(--color-muted)]">
                  {authorHeadline}
                </p>
              </div>
            </div>

            <ShareButtons title={article.title} />
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-lg">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body */}
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10 lg:p-12 shadow-sm text-base sm:text-lg leading-relaxed text-[var(--color-foreground-muted)] overflow-hidden">
          {article.content ? (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="italic text-[var(--color-muted)] font-mono text-sm">
              No content published for this article yet.
            </p>
          )}
        </section>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="font-mono text-xs text-[var(--color-muted)] flex items-center gap-1">
              <Tag size={13} />
              Tags:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-xs text-[var(--color-foreground)]"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Discussion & Comments */}
        <ArticleComments articleId={article.id} initialComments={comments} />
      </article>
    </div>
  );
}
