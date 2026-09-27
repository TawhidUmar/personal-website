'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleArticleFeaturedAction } from '@/actions/article.actions';
import { Star, Loader2 } from 'lucide-react';

interface FeaturedArticleToggleProps {
  articleId: number;
  isFeatured: boolean;
}

export function FeaturedArticleToggle({ articleId, isFeatured }: FeaturedArticleToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleArticleFeaturedAction(articleId);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isFeatured ? 'Featured on Homepage (Click to unfeature)' : 'Not featured (Click to feature on homepage)'}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition-all ${
        isFeatured
          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 shadow-xs'
          : 'bg-[var(--color-surface-raised)] text-[var(--color-muted)] border border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)]'
      }`}
    >
      {isPending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Star size={12} className={isFeatured ? 'fill-current text-amber-500' : 'text-[var(--color-muted)]'} />
      )}
      <span>{isFeatured ? 'Featured' : 'Standard'}</span>
    </button>
  );
}
