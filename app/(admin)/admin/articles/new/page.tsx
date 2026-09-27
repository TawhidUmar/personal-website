import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { getAllTags } from '@/lib/repositories/tags.repository';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compose New Article | Admin',
};

export default async function NewArticlePage() {
  await requireAdmin();

  const [categories, tags] = await Promise.all([
    getAllCategories('article').catch(() => []),
    getAllTags().catch(() => []),
  ]);

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
          Compose Technical Article
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Draft and publish research essays, algorithm walkthroughs, and tutorials with rich text and code syntax.
        </p>
      </div>

      {/* Form */}
      <ArticleForm categories={categories} tags={tags} />
    </div>
  );
}
