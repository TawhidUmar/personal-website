'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createResearchAction, updateResearchAction } from '@/actions/research.actions';
import { slugify } from '@/lib/utils/slugify';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { DbCategory } from '@/types/db.types';
import type { ResearchWithCategory } from '@/lib/repositories/research.repository';
import type { ActionState } from '@/types/api.types';

interface ResearchFormProps {
  categories: DbCategory[];
  initialResearch?: ResearchWithCategory;
}

const initialState: ActionState = { status: 'idle' };

export function ResearchForm({ categories, initialResearch }: ResearchFormProps) {
  const router = useRouter();
  const isEditing = !!initialResearch;

  const [title, setTitle] = useState(initialResearch?.title ?? '');
  const [slug, setSlug] = useState(initialResearch?.slug ?? '');
  const [autoSlug, setAutoSlug] = useState(!initialResearch);

  const actionFn = isEditing
    ? updateResearchAction.bind(null, initialResearch.id)
    : createResearchAction;

  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      setTimeout(() => {
        router.push('/admin/research');
        router.refresh();
      }, 1000);
    }
  }, [state, router]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const initialDate = initialResearch?.published_at
    ? new Date(initialResearch.published_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <form action={formAction} className="space-y-8">
      {state.status === 'success' && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 size={18} />
          <span>{state.message} Redirecting to research directory...</span>
        </div>
      )}

      {state.status === 'error' && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{state.error}</p>
            {state.errors && (
              <ul className="mt-1 list-disc pl-4 text-xs space-y-0.5">
                {Object.entries(state.errors).map(([field, msgs]) => (
                  <li key={field}>
                    <span className="capitalize">{field}:</span> {(msgs as string[])[0]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Core Manuscript Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-[var(--color-foreground)] mb-1">
                Manuscript Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Sparse Attentive State-Space Models for Long-Sequence Reasoning"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-base font-semibold text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="slug" className="block text-xs font-medium text-[var(--color-foreground)]">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] font-mono text-[var(--color-accent)] hover:underline"
                >
                  {autoSlug ? 'Manual Edit' : 'Auto-Generate'}
                </button>
              </div>
              <div className="flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-xs text-[var(--color-muted)] font-mono">
                <span>/research/</span>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setSlug(e.target.value);
                  }}
                  className="w-full bg-transparent py-2 text-xs text-[var(--color-foreground)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="abstract" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Scientific Abstract *
              </label>
              <textarea
                id="abstract"
                name="abstract"
                rows={5}
                required
                defaultValue={initialResearch?.abstract ?? ''}
                placeholder="Full abstract as submitted to arXiv or conference..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y leading-relaxed"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-foreground)]">
              Methodology & Experimental Setup
            </h3>

            <div>
              <label htmlFor="methodology" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Methodology & Algorithmic Formulation
              </label>
              <textarea
                id="methodology"
                name="methodology"
                rows={4}
                defaultValue={initialResearch?.methodology ?? ''}
                placeholder="Details regarding inductive biases, parameter discretization, causal intervention..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
              />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Technologies & Compute Frameworks (comma separated)
              </label>
              <input
                id="technologies"
                name="technologies"
                type="text"
                defaultValue={initialResearch?.technologies?.join(', ') ?? ''}
                placeholder="PyTorch, Triton, CUDA, JAX, Hugging Face"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label htmlFor="dataset" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Datasets & Evaluation Benchmarks
              </label>
              <input
                id="dataset"
                name="dataset"
                type="text"
                defaultValue={initialResearch?.dataset ?? ''}
                placeholder="Long Range Arena (LRA), PG19, Custom Synthetic Benchmarks"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Publication Status & Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
              Publication Settings
            </h3>

            <div>
              <label htmlFor="publicationStatus" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Publication Status
              </label>
              <select
                id="publicationStatus"
                name="publicationStatus"
                defaultValue={initialResearch?.publication_status ?? 'preprint'}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="published">Peer-Reviewed / Published</option>
                <option value="preprint">ArXiv Preprint</option>
                <option value="under-review">Under Conference Review</option>
                <option value="unpublished">Unpublished / In Prep</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Project Lifecycle Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={initialResearch?.status ?? 'published'}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="published">Published</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Research Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={initialResearch?.category_id ?? ''}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="publishedAt" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Date
              </label>
              <input
                id="publishedAt"
                name="publishedAt"
                type="date"
                defaultValue={initialDate}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                defaultChecked={initialResearch?.is_featured ?? false}
                className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
              <label htmlFor="isFeatured" className="text-xs font-medium text-[var(--color-foreground)]">
                Feature on Homepage
              </label>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving Manuscript...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEditing ? 'Save Changes' : 'Create Manuscript'}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3">
            <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
              Citations & Artifacts
            </h3>

            <div>
              <label htmlFor="doi" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                DOI Identifier
              </label>
              <input
                id="doi"
                name="doi"
                type="text"
                defaultValue={initialResearch?.doi ?? ''}
                placeholder="10.48550/arXiv.2401.00000"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label htmlFor="publicationUrl" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                ArXiv / Paper URL
              </label>
              <input
                id="publicationUrl"
                name="publicationUrl"
                type="url"
                defaultValue={initialResearch?.publication_url ?? ''}
                placeholder="https://arxiv.org/abs/..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Code / Reproducibility Repo URL
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                defaultValue={initialResearch?.github_url ?? ''}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
