'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  updateCommentStatusAction,
  deleteCommentAction,
} from '@/actions/moderation.actions';
import {
  MessageSquare,
  Check,
  AlertTriangle,
  X,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import type { DbCommentWithArticle } from '@/lib/repositories/comments.repository';
import type { CommentStatus } from '@/types/db.types';

interface CommentsManagerProps {
  initialComments: DbCommentWithArticle[];
  total: number;
}

export function CommentsManager({ initialComments, total }: CommentsManagerProps) {
  const router = useRouter();
  const [comments] = useState<DbCommentWithArticle[]>(initialComments);
  const [filter, setFilter] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: number, status: CommentStatus) => {
    startTransition(async () => {
      await updateCommentStatusAction(id, status);
      router.refresh();
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this comment?')) {
      startTransition(async () => {
        await deleteCommentAction(id);
        router.refresh();
      });
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const statusBadge: Record<CommentStatus, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
    approved: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
    spam: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' },
    rejected: { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-500/20' },
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Article Discussion & Comments
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Total {total} community reader comments and peer peer review remarks.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'pending', 'approved', 'spam', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all ${
                filter === s
                  ? 'bg-[var(--color-accent)] text-white font-bold'
                  : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map((c) => {
          const badge = statusBadge[c.status] ?? statusBadge.pending;
          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-border)] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--color-foreground)]">
                      {c.author_name}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">&lt;{c.author_email}&gt;</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span>On article:</span>
                    <Link
                      href={`/articles/${c.article_slug}`}
                      target="_blank"
                      className="font-medium text-[var(--color-accent)] hover:underline flex items-center gap-1"
                    >
                      {c.article_title}
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-muted)]">
                  <Calendar size={12} />
                  <span>
                    {new Date(c.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-xs text-[var(--color-foreground)] leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>

              {/* Moderation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs">
                <span className="font-mono text-[10px] text-[var(--color-muted)]">
                  IP: {c.ip_address ?? '127.0.0.1'}
                </span>

                <div className="flex items-center gap-2">
                  {c.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(c.id, 'approved')}
                      disabled={isPending}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-green-500/20 bg-green-500/10 text-xs font-semibold text-green-600 hover:bg-green-500/20 transition-colors"
                    >
                      <Check size={12} />
                      Approve
                    </button>
                  )}

                  {c.status !== 'spam' && (
                    <button
                      onClick={() => handleStatusChange(c.id, 'spam')}
                      disabled={isPending}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-xs font-semibold text-amber-600 hover:bg-amber-500/20 transition-colors"
                    >
                      <AlertTriangle size={12} />
                      Mark Spam
                    </button>
                  )}

                  {c.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(c.id, 'rejected')}
                      disabled={isPending}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                    >
                      <X size={12} />
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-600 hover:bg-red-500/20 transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredComments.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            No comments found matching this status filter.
          </div>
        )}
      </div>
    </div>
  );
}
