'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createAwardAction,
  updateAwardAction,
  deleteAwardAction,
} from '@/actions/award.actions';
import {
  Plus,
  Award,
  Shield,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import type { DbAward } from '@/types/db.types';

interface AwardsManagerProps {
  initialAwards: DbAward[];
}

function formatDate(d: Date | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function toInputDate(d: Date | null): string {
  if (!d) return '';
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function AwardsManager({ initialAwards }: AwardsManagerProps) {
  const router = useRouter();
  const [awardsList] = useState<DbAward[]>(initialAwards);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<DbAward | null>(null);

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issuerUrl, setIssuerUrl] = useState('');
  const [category, setCategory] = useState<'award' | 'certification'>('award');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [badgeUrl, setBadgeUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setTitle('');
    setIssuer('');
    setIssuerUrl('');
    setCategory('award');
    setDate('');
    setDescription('');
    setBadgeUrl('');
    setIsFeatured(false);
    setDisplayOrder('0');
  };

  const openCreateForm = () => {
    setEditingAward(null);
    resetForm();
    setIsFormOpen(true);
    setStatusMsg(null);
  };

  const openEditForm = (award: DbAward) => {
    setEditingAward(award);
    setTitle(award.title);
    setIssuer(award.issuer);
    setIssuerUrl(award.issuer_url ?? '');
    setCategory(award.category);
    setDate(toInputDate(award.date));
    setDescription(award.description ?? '');
    setBadgeUrl(award.badge_url ?? '');
    setIsFeatured(award.is_featured);
    setDisplayOrder(String(award.display_order));
    setIsFormOpen(true);
    setStatusMsg(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAward(null);
    resetForm();
    setStatusMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.set('title', title);
    formData.set('issuer', issuer);
    formData.set('issuerUrl', issuerUrl);
    formData.set('category', category);
    formData.set('date', date);
    formData.set('description', description);
    formData.set('badgeUrl', badgeUrl);
    formData.set('isFeatured', String(isFeatured));
    formData.set('displayOrder', displayOrder);

    startTransition(async () => {
      const res = editingAward
        ? await updateAwardAction(editingAward.id, { status: 'idle' }, formData)
        : await createAwardAction({ status: 'idle' }, formData);

      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        router.refresh();
        setTimeout(closeForm, 1200);
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this award/certification?')) return;
    startTransition(async () => {
      const res = await deleteAwardAction(id);
      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        router.refresh();
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Awards & Certifications
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Manage professional recognitions, academic honors, and industry certifications.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus size={15} />
          Add Award
        </button>
      </div>

      {/* Status message */}
      {statusMsg && !isFormOpen && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-xs font-medium ${
            statusMsg.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-600'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Inline Form */}
      {isFormOpen && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[var(--color-foreground)]">
              {editingAward ? 'Edit Award / Certification' : 'Add Award / Certification'}
            </h2>
            <button onClick={closeForm} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
              <X size={18} />
            </button>
          </div>

          {statusMsg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-xs font-medium ${
                statusMsg.type === 'success'
                  ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-600'
              }`}
            >
              {statusMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Certified ML – Specialty"
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>

            {/* Issuer */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Issuing Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Amazon Web Services"
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'award' | 'certification')}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)]"
              >
                <option value="award">Award / Honor</option>
                <option value="certification">Certification</option>
              </select>
            </div>

            {/* Issuer URL */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Issuer URL
              </label>
              <input
                type="url"
                value={issuerUrl}
                onChange={(e) => setIssuerUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Date Received
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>

            {/* Badge URL */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Badge / Logo Image URL
              </label>
              <input
                type="url"
                value={badgeUrl}
                onChange={(e) => setBadgeUrl(e.target.value)}
                placeholder="https://example.com/badge.png"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of the award or certification..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 resize-none"
              />
            </div>

            {/* Featured & Order */}
            <div className="flex items-center gap-3">
              <input
                id="isFeatured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
              />
              <label htmlFor="isFeatured" className="text-xs font-medium text-[var(--color-foreground)]">
                Feature on homepage & about page
              </label>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-foreground)]">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                min={0}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            {/* Actions */}
            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-background)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60 transition-colors"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                {editingAward ? 'Update Award' : 'Save Award'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Awards List */}
      {awardsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
          <Award size={32} className="text-[var(--color-muted)]" />
          <p className="text-sm font-medium text-[var(--color-muted)]">No awards or certifications yet.</p>
          <button
            onClick={openCreateForm}
            className="text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            Add your first one
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {awardsList.map((award) => (
            <div
              key={award.id}
              className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-accent-border)] hover:shadow-md"
            >
              {/* Category badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    award.category === 'certification'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {award.category === 'certification' ? (
                    <Shield size={10} />
                  ) : (
                    <Award size={10} />
                  )}
                  {award.category === 'certification' ? 'Certification' : 'Award'}
                </span>
                {award.is_featured && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--color-accent)] font-semibold">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </span>
                )}
              </div>

              {/* Badge image */}
              {award.badge_url && (
                <div className="mb-3 h-12 w-12 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={award.badge_url} alt={award.title} className="h-10 w-10 object-contain" />
                </div>
              )}

              <h3 className="font-semibold text-sm leading-snug text-[var(--color-foreground)]">
                {award.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-1 flex items-center gap-1">
                {award.issuer_url ? (
                  <a
                    href={award.issuer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-accent)] flex items-center gap-1"
                  >
                    {award.issuer}
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  award.issuer
                )}
              </p>

              {award.date && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--color-muted)]">
                  <Calendar size={11} />
                  {formatDate(award.date)}
                </p>
              )}

              {award.description && (
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)] line-clamp-2">
                  {award.description}
                </p>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditForm(award)}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition-colors"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(award.id)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
