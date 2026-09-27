'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createArticleAction, updateArticleAction } from '@/actions/article.actions';
import { TiptapEditor } from '@/components/admin/TiptapEditor';
import { slugify } from '@/lib/utils/slugify';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import type { DbCategory, DbTag, DbArticleWithAuthor } from '@/types/db.types';
import type { ActionState } from '@/types/api.types';

interface ArticleFormProps {
  categories: DbCategory[];
  tags: DbTag[];
  initialArticle?: DbArticleWithAuthor;
}

const initialState: ActionState = { status: 'idle' };

export function ArticleForm({ categories, tags, initialArticle }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = !!initialArticle;

  const [title, setTitle] = useState(initialArticle?.title ?? '');
  const [slug, setSlug] = useState(initialArticle?.slug ?? '');
  const [autoSlug, setAutoSlug] = useState(!initialArticle);
  const [content, setContent] = useState(initialArticle?.content ?? '');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    initialArticle?.tags?.map((t) => t.id) ?? []
  );
  const [showSeo, setShowSeo] = useState(false);
  const [coverUrl, setCoverUrl] = useState(initialArticle?.cover_image_url ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imgLoadError, setImgLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setImgLoadError(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'covers');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setCoverUrl(data.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const actionFn = isEditing
    ? updateArticleAction.bind(null, initialArticle.id)
    : createArticleAction;

  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      setTimeout(() => {
        router.push('/admin/articles');
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

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Status Banners */}
      {state.status === 'success' && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 size={18} />
          <span>{state.message} Redirecting to articles directory...</span>
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

      {/* Main Form Layout: 2 Columns */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Title, Excerpt, Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-[var(--color-foreground)] mb-1">
                Article Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Demystifying State-Space Models: From SSM Fundamentals to Mamba"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-base font-semibold text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="slug" className="block text-xs font-medium text-[var(--color-foreground)]">
                  Permanent URL Slug *
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
                <span>/articles/</span>
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
                  placeholder="demystifying-state-space-models"
                  className="w-full bg-transparent py-2 text-xs text-[var(--color-foreground)] focus:outline-none"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Summary / Abstract Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                defaultValue={initialArticle?.excerpt ?? ''}
                placeholder="Brief intellectual overview shown on article cards and search snippets..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y"
              />
            </div>
          </div>

          {/* Tiptap Content Editor */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-2">
            <label className="block text-xs font-semibold text-[var(--color-foreground)]">
              Article Body Content *
            </label>
            <input type="hidden" name="content" value={content} />
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          {/* Collapsible SEO & Social Meta Section */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="flex w-full items-center justify-between text-left font-semibold text-sm text-[var(--color-foreground)]"
            >
              <span>Search Engine Optimization & Metadata</span>
              {showSeo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showSeo && (
              <div className="pt-3 border-t border-[var(--color-border)] space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                    Custom SEO Title (defaults to article title)
                  </label>
                  <input
                    id="seoTitle"
                    name="seoTitle"
                    type="text"
                    defaultValue={initialArticle?.seo_title ?? ''}
                    placeholder="Custom search engine title..."
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label htmlFor="seoDescription" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    rows={2}
                    defaultValue={initialArticle?.seo_description ?? ''}
                    placeholder="150-160 character description for Google search results..."
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label htmlFor="canonicalUrl" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                    Canonical URL (if cross-published on Medium/Substack)
                  </label>
                  <input
                    id="canonicalUrl"
                    name="canonicalUrl"
                    type="url"
                    defaultValue={initialArticle?.canonical_url ?? ''}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Taxonomy, Status, Cover, Submit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication Status Card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
              Publishing Controls
            </h3>

            <div>
              <label htmlFor="status" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Article Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={initialArticle?.status ?? 'draft'}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="draft">Draft (Work in progress)</option>
                <option value="published">Published (Publicly live)</option>
                <option value="archived">Archived (Unlisted)</option>
              </select>
            </div>

            <div>
              <label htmlFor="readingTime" className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Reading Time (Minutes, optional)
              </label>
              <input
                id="readingTime"
                name="readingTime"
                type="number"
                min={1}
                defaultValue={initialArticle?.reading_time ?? ''}
                placeholder="Auto-calculated if left empty"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                defaultChecked={initialArticle?.is_featured ?? false}
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
                    Saving Article...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    {isEditing ? 'Save Changes' : 'Create Article'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3">
            <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
              Category
            </h3>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={initialArticle?.category_id ?? ''}
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

          {/* Tags Multi-Selector */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3">
            <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
              Article Tags
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 text-xs text-[var(--color-foreground)] cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={tag.id}
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="h-3.5 w-3.5 rounded border-[var(--color-border)] text-[var(--color-accent)]"
                  />
                  <span>#{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cover Image Upload & URL */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[var(--color-foreground)] flex items-center gap-1.5">
                <ImageIcon size={15} className="text-[var(--color-accent)]" />
                Cover Image
              </h3>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCoverUrl('');
                    setImgLoadError(false);
                  }}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Direct Upload Dropzone Button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] py-4 px-3 text-center transition-colors hover:border-[var(--color-accent-border)] hover:bg-[var(--color-surface-raised)] disabled:opacity-60 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[var(--color-accent)]" />
                  <span className="text-xs font-semibold text-[var(--color-foreground)]">Uploading image to server...</span>
                </>
              ) : (
                <>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                    <Upload size={15} />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-[var(--color-foreground)]">Click to upload image</span>
                    <span className="text-[var(--color-muted)]"> (JPG, PNG, WEBP, up to 10MB)</span>
                  </div>
                </>
              )}
            </button>

            {uploadError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {uploadError}
              </p>
            )}

            {/* Or Paste URL */}
            <div className="space-y-1.5">
              <label htmlFor="coverImageUrl" className="block text-[11px] font-medium text-[var(--color-muted)]">
                Or enter image URL / relative path:
              </label>
              <input
                id="coverImageUrl"
                name="coverImageUrl"
                type="text"
                value={coverUrl}
                onChange={(e) => {
                  setCoverUrl(e.target.value);
                  setImgLoadError(false);
                }}
                placeholder="https://images.unsplash.com/... or /uploads/..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>

            {/* Preview */}
            {coverUrl && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono text-[var(--color-muted)]">Image Preview:</span>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                  {imgLoadError ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <ImageIcon size={24} className="text-[var(--color-muted)] mb-1" />
                      <p className="text-xs text-[var(--color-muted)]">Preview unavailable, but URL will still be saved.</p>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverUrl}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                      onError={() => setImgLoadError(true)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
