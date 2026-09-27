import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getArticleById } from '@/lib/repositories/articles.repository';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { getAllTags } from '@/lib/repositories/tags.repository';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Article | Admin',
};

export default async function EditArticlePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const articleId = Number(id);

  if (isNaN(articleId)) {
    notFound();
  }

  const [article, categories, tags] = await Promise.all([
    getArticleById(articleId),
    getAllCategories('article').catch(() => []),
    getAllTags().catch(() => []),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Back Navigation & Title */}
      <div className="space-y-2">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Articles Directory
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          Edit Article: {article.title}
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Update article content, metadata, categories, tags, or publishing status.
        </p>
      </div>

      {/* Form */}
      <ArticleForm
        categories={categories}
        tags={tags}
        initialArticle={article}
      />
    </div>
  );
}
