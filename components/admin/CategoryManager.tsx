'use client';

import { useActionState, useTransition, useState, useEffect } from 'react';
import { createCategoryAction, deleteCategoryAction } from '@/actions/taxonomy.actions';
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { DbCategory, CategoryType } from '@/types/db.types';
import type { ActionState } from '@/types/api.types';

interface CategoryManagerProps {
  initialCategories: DbCategory[];
}

const initialState: ActionState = { status: 'idle' };

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialState);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'all' | CategoryType>('all');

  const filtered = activeTab === 'all'
    ? initialCategories
    : initialCategories.filter((c) => c.type === activeTab);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete category "${name}"? Existing articles/projects will be unassigned.`)) {
      startDeleteTransition(async () => {
        await deleteCategoryAction(id);
      });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start">
      {/* Categories Table & Filter */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-[var(--color-accent)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
            }`}
          >
            All Types ({initialCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('article')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'article'
                ? 'bg-[var(--color-accent)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
            }`}
          >
            Article Categories
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'project'
                ? 'bg-[var(--color-accent)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
            }`}
          >
            Project Categories
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'research'
                ? 'bg-[var(--color-accent)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'
            }`}
          >
            Research Categories
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3.5">Name & Slug</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-foreground)]">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[var(--color-surface-raised)] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-sm">{cat.name}</p>
                    <code className="text-[10px] text-[var(--color-muted)]">/{cat.slug}</code>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[11px] text-[var(--color-accent)] capitalize">
                      {cat.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-muted)] max-w-xs truncate">
                    {cat.description ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={isDeleting}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="Delete category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-[var(--color-muted)]">
                    No categories found for this type.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Form */}
      <div className="lg:col-span-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
        <h3 className="font-bold text-base text-[var(--color-foreground)]">
          Add New Category
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
              Category Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Deep Learning Theory"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
              Category Type *
            </label>
            <select
              id="type"
              name="type"
              defaultValue="article"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="article">Article</option>
              <option value="project">Project</option>
              <option value="research">Research</option>
            </select>
          </div>

          <div>
            <label htmlFor="slug" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
              Slug (optional, auto-generated)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="deep-learning-theory"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Brief description..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-60"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}
