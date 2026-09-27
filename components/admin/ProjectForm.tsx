'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectAction, updateProjectAction } from '@/actions/project.actions';
import { slugify } from '@/lib/utils/slugify';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { DbCategory, DbProjectWithDetails } from '@/types/db.types';
import type { ActionState } from '@/types/api.types';

interface ProjectFormProps {
  categories: DbCategory[];
  initialProject?: DbProjectWithDetails;
}

const initialState: ActionState = { status: 'idle' };

export function ProjectForm({ categories, initialProject }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!initialProject;

  const [title, setTitle] = useState(initialProject?.title ?? '');
  const [slug, setSlug] = useState(initialProject?.slug ?? '');
  const [autoSlug, setAutoSlug] = useState(!initialProject);
  const [coverUrl, setCoverUrl] = useState(initialProject?.hero_image_url ?? '');

  const actionFn = isEditing
    ? updateProjectAction.bind(null, initialProject.id)
    : createProjectAction;

  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      setTimeout(() => {
        router.push('/admin/projects');
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

  const initialStartDate = initialProject?.started_at
    ? new Date(initialProject.started_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const initialEndDate = initialProject?.ended_at
    ? new Date(initialProject.ended_at).toISOString().split('T')[0]
    : '';

  return (
    <form action={formAction} className="space-y-8">
      {state.status === 'success' && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 size={18} />
          <span>{state.message} Redirecting to projects directory...</span>
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
        {/* Left Column: Core Case Study Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-[var(--color-foreground)] mb-1">
                Project Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="SynapseEngine: Low-Latency Neural Runtime"
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
                <span>/projects/</span>
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
              <label htmlFor="description" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Short Description / Abstract *
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                required
                defaultValue={initialProject?.description ?? ''}
                placeholder="Brief summary displayed on cards..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
              />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Technologies (comma separated) *
              </label>
              <input
                id="technologies"
                name="technologies"
                type="text"
                defaultValue={initialProject?.technologies?.join(', ') ?? ''}
                placeholder="PyTorch, CUDA, Triton, Next.js, Rust, Docker"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-foreground)]">
              Case Study Problem & Solution
            </h3>

            <div>
              <label htmlFor="problem" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Problem & Computational Bottleneck
              </label>
              <textarea
                id="problem"
                name="problem"
                rows={3}
                defaultValue={initialProject?.problem ?? ''}
                placeholder="What limitation or challenge existed?"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
              />
            </div>

            <div>
              <label htmlFor="solution" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Architectural Solution
              </label>
              <textarea
                id="solution"
                name="solution"
                rows={3}
                defaultValue={initialProject?.solution ?? ''}
                placeholder="How was the problem solved?"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
              />
            </div>
          </div>

          {/* Architecture, Challenges & Results */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-foreground)]">
              Architecture & Impact
            </h3>

            <div>
              <label htmlFor="architecture" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                System Architecture & Decisions
              </label>
              <textarea
                id="architecture"
                name="architecture"
                rows={3}
                defaultValue={initialProject?.architecture ?? ''}
                placeholder="Pipeline flow, compute kernel layers, distributed data stores..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
              />
            </div>

            <div>
              <label htmlFor="features" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Key Features (one per line)
              </label>
              <textarea
                id="features"
                name="features"
                rows={3}
                defaultValue={initialProject?.features?.join('\n') ?? ''}
                placeholder="Sub-3ms first-token latency&#10;Dynamic 4-bit weight activation&#10;Zero runtime dependencies"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y font-mono"
              />
            </div>

            <div>
              <label htmlFor="results" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Measurable Results & Benchmarks
              </label>
              <input
                id="results"
                name="results"
                type="text"
                defaultValue={initialProject?.results ?? ''}
                placeholder="Adopted by 1,400+ researchers; 4.2x speedup over vanilla PyTorch"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Controls */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
              Publication Settings
            </h3>

            <div>
              <label htmlFor="status" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={initialProject?.status ?? 'published'}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={initialProject?.category_id ?? ''}
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="startedAt" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                  Start Date *
                </label>
                <input
                  id="startedAt"
                  name="startedAt"
                  type="date"
                  required
                  defaultValue={initialStartDate}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div>
                <label htmlFor="endedAt" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                  End Date
                </label>
                <input
                  id="endedAt"
                  name="endedAt"
                  type="date"
                  defaultValue={initialEndDate}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                defaultChecked={initialProject?.is_featured ?? false}
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
                    Saving Project...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEditing ? 'Save Changes' : 'Create Project'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Links & Attribution */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3">
            <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
              Links & Metadata
            </h3>

            <div>
              <label htmlFor="githubUrl" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                GitHub Repository URL
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                defaultValue={initialProject?.github_url ?? ''}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label htmlFor="projectUrl" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Live Deployment URL
              </label>
              <input
                id="projectUrl"
                name="projectUrl"
                type="url"
                defaultValue={initialProject?.project_url ?? ''}
                placeholder="https://..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Your Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                defaultValue={initialProject?.role ?? ''}
                placeholder="Lead Architect & Maintainer"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label htmlFor="client" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Client / Context
              </label>
              <input
                id="client"
                name="client"
                type="text"
                defaultValue={initialProject?.client ?? ''}
                placeholder="Open Source / Laboratory"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label htmlFor="heroImageUrl" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Hero Image URL
              </label>
              <input
                id="heroImageUrl"
                name="heroImageUrl"
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              {coverUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] mt-2">
                  <img
                    src={coverUrl}
                    alt="Hero Preview"
                    className="h-full w-full object-cover"
                    onError={() => setCoverUrl('')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
