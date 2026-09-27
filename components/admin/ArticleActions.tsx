'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  deleteArticleAction,
  toggleArticleStatusAction,
  toggleArticleFeaturedAction,
} from '@/actions/article.actions';
import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  Archive,
  Loader2,
  Star,
} from 'lucide-react';
import type { ArticleStatus } from '@/types/db.types';

interface ArticleActionsProps {
  articleId: number;
  slug: string;
  status: ArticleStatus;
  isFeatured?: boolean;
}

export function ArticleActions({ articleId, slug, status, isFeatured }: ArticleActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (newStatus: ArticleStatus) => {
    setIsOpen(false);
    startTransition(async () => {
      await toggleArticleStatusAction(articleId, newStatus);
      router.refresh();
    });
  };

  const handleToggleFeatured = () => {
    setIsOpen(false);
    startTransition(async () => {
      await toggleArticleFeaturedAction(articleId);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this article?')) {
      setIsOpen(false);
      startTransition(async () => {
        await deleteArticleAction(articleId);
        router.refresh();
      });
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <MoreHorizontal size={14} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-xl text-xs font-medium space-y-0.5">
            <Link
              href={`/articles/${slug}`}
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Eye size={13} />
              View Public Page
            </Link>

            <Link
              href={`/admin/articles/${articleId}/edit`}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Edit size={13} />
              Edit Content
            </Link>

            <button
              onClick={handleToggleFeatured}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Star
                size={13}
                className={isFeatured ? 'text-amber-500 fill-amber-500' : 'text-[var(--color-muted)]'}
              />
              {isFeatured ? 'Unfeature on Home' : 'Feature on Home'}
            </button>

            <div className="my-1 border-t border-[var(--color-border)]" />

            {status !== 'published' && (
              <button
                onClick={() => handleToggleStatus('published')}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-green-600 hover:bg-green-500/10 transition-colors"
              >
                <CheckCircle size={13} />
                Publish Now
              </button>
            )}

            {status !== 'draft' && (
              <button
                onClick={() => handleToggleStatus('draft')}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-amber-600 hover:bg-amber-500/10 transition-colors"
              >
                <Archive size={13} />
                Revert to Draft
              </button>
            )}

            <div className="my-1 border-t border-[var(--color-border)]" />

            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-red-600 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={13} />
              Delete Article
            </button>
          </div>
        </>
      )}
    </div>
  );
}
