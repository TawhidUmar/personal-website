'use client';

import { useActionState } from 'react';
import { submitCommentAction } from '@/actions/comment.actions';
import { MessageCircle, Send, Loader2, CheckCircle2, User } from 'lucide-react';
import type { DbComment } from '@/types/db.types';
import type { ActionState } from '@/types/api.types';

interface ArticleCommentsProps {
  articleId: number;
  initialComments: DbComment[];
}

const initialState: ActionState = { status: 'idle' };

function formatCommentDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ArticleComments({ articleId, initialComments }: ArticleCommentsProps) {
  const [state, formAction, isPending] = useActionState(submitCommentAction, initialState);

  return (
    <section className="mt-16 pt-12 border-t border-[var(--color-border)] space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-2xl font-bold text-[var(--color-foreground)]">
          <MessageCircle size={22} className="text-[var(--color-accent)]" />
          Discussion ({initialComments.length})
        </h3>
        <span className="font-mono text-xs text-[var(--color-muted)]">
          Moderated comments
        </span>
      </div>

      {/* Existing Comments */}
      {initialComments.length > 0 ? (
        <div className="space-y-4">
          {initialComments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-xs font-bold">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-foreground)]">
                      {comment.author_name}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--color-muted)]">
                      {formatCommentDate(comment.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-muted)] whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-8 text-center text-sm text-[var(--color-muted)]">
          No comments yet. Start the intellectual discussion below!
        </div>
      )}

      {/* Comment Form */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm space-y-5">
        <h4 className="text-lg font-bold text-[var(--color-foreground)]">
          Leave a Technical Comment
        </h4>
        <p className="text-xs text-[var(--color-muted)]">
          Your email address will not be published. Comments are reviewed to ensure constructive discussion.
        </p>

        {state.status === 'success' && (
          <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p>{state.message}</p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="articleId" value={articleId} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="authorName" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Your Name *
              </label>
              <input
                id="authorName"
                name="authorName"
                type="text"
                required
                placeholder="Dr. Jane Doe"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              {state.status === 'error' && state.errors?.authorName && (
                <p className="mt-1 text-xs text-red-500">{state.errors.authorName[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="authorEmail" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Your Email *
              </label>
              <input
                id="authorEmail"
                name="authorEmail"
                type="email"
                required
                placeholder="jane@institution.edu"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              {state.status === 'error' && state.errors?.authorEmail && (
                <p className="mt-1 text-xs text-red-500">{state.errors.authorEmail[0]}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
              Comment *
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              required
              placeholder="Share thoughts, research critiques, or related findings..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
            />
            {state.status === 'error' && state.errors?.content && (
              <p className="mt-1 text-xs text-red-500">{state.errors.content[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={14} />
                Post Comment
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
