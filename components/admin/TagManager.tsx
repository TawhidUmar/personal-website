'use client';

import { useActionState, useTransition } from 'react';
import { createTagAction, deleteTagAction } from '@/actions/taxonomy.actions';
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Tag as TagIcon } from 'lucide-react';
import type { DbTag } from '@/types/db.types';
import type { ActionState } from '@/types/api.types';

interface TagManagerProps {
  initialTags: DbTag[];
}

const initialState: ActionState = { status: 'idle' };

export function TagManager({ initialTags }: TagManagerProps) {
  const [state, formAction, isPending] = useActionState(createTagAction, initialState);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete tag "#${name}"?`)) {
      startDeleteTransition(async () => {
        await deleteTagAction(id);
      });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start">
      {/* Tags Grid */}
      <div className="lg:col-span-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-[var(--color-foreground)]">
          All Tags ({initialTags.length})
        </h3>

        <div className="flex flex-wrap gap-2.5">
          {initialTags.map((tag) => (
            <div
              key={tag.id}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs text-[var(--color-foreground)] shadow-sm hover:border-[var(--color-accent-border)] transition-colors"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tag.color ?? '#6366f1' }}
              />
              <span className="font-mono font-medium">#{tag.name}</span>
              <button
                onClick={() => handleDelete(tag.id, tag.name)}
                disabled={isDeleting}
                className="ml-1 text-[var(--color-muted)] hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete tag"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {initialTags.length === 0 && (
            <p className="text-xs text-[var(--color-muted)]">No tags created yet.</p>
          )}
        </div>
      </div>

      {/* Tag Creation Form */}
      <div className="lg:col-span-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
        <h3 className="font-bold text-base text-[var(--color-foreground)]">
          Create New Tag
        </h3>

        {state.status === 'success' && (
          <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-700 dark:text-green-400">
            <CheckCircle2 size={15} />
            <span>{state.message}</span>
          </div>
        )}

        {state.status === 'error' && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={15} />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
              Tag Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Mamba"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
              Slug (optional)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="mamba"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="color"
                name="color"
                type="color"
                defaultValue="#6366f1"
                className="h-8 w-12 cursor-pointer rounded border border-[var(--color-border)] bg-transparent p-0.5"
              />
              <span className="font-mono text-xs text-[var(--color-muted)]">Hex accent code</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-60"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create Tag
          </button>
        </form>
      </div>
    </div>
  );
}
