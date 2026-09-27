'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
} from '@/actions/experience.actions';
import {
  Plus,
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { DbExperience, ExperienceType } from '@/types/db.types';

interface ExperienceManagerProps {
  initialExperiences: DbExperience[];
}

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const router = useRouter();
  const [experiences] = useState<DbExperience[]>(initialExperiences);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<DbExperience | null>(null);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<ExperienceType>('full-time');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreateForm = () => {
    setEditingExp(null);
    setTitle('');
    setCompany('');
    setCompanyUrl('');
    setLocation('');
    setType('full-time');
    setDescription('');
    setTechnologies('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDisplayOrder('0');
    setStatusMsg(null);
    setIsFormOpen(true);
  };

  const openEditForm = (exp: DbExperience) => {
    setEditingExp(exp);
    setTitle(exp.title);
    setCompany(exp.company);
    setCompanyUrl(exp.company_url ?? '');
    setLocation(exp.location ?? '');
    setType(exp.type);
    setDescription(exp.description ?? '');
    setTechnologies(exp.technologies ? exp.technologies.join(', ') : '');
    setStartDate(
      exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : ''
    );
    setEndDate(
      exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : ''
    );
    setIsCurrent(exp.is_current);
    setDisplayOrder(String(exp.display_order ?? 0));
    setStatusMsg(null);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('company', company);
    formData.append('companyUrl', companyUrl);
    formData.append('location', location);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('technologies', technologies);
    formData.append('startDate', startDate);
    if (!isCurrent && endDate) {
      formData.append('endDate', endDate);
    }
    if (isCurrent) {
      formData.append('isCurrent', 'true');
    }
    formData.append('displayOrder', displayOrder);

    startTransition(async () => {
      const res = editingExp
        ? await updateExperienceAction(editingExp.id, { status: 'idle' }, formData)
        : await createExperienceAction({ status: 'idle' }, formData);

      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        setTimeout(() => {
          setIsFormOpen(false);
          router.refresh();
        }, 800);
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  const handleDelete = (id: number, comp: string) => {
    if (window.confirm(`Are you sure you want to delete experience at ${comp}?`)) {
      startTransition(async () => {
        await deleteExperienceAction(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Experience Timeline CMS
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Manage professional roles, engineering appointments, and industry career milestones.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Work Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="grid grid-cols-1 gap-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-border)] transition-all"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-base text-[var(--color-foreground)]">
                  {exp.title}
                </span>
                <span className="text-xs font-medium text-[var(--color-accent)]">
                  @ {exp.company}
                </span>
                {exp.is_current && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                    PRESENT
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[var(--color-surface-raised)] text-[var(--color-muted)] border border-[var(--color-border)]">
                  {exp.type}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)] font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}{' '}
                  —{' '}
                  {exp.is_current
                    ? 'Present'
                    : exp.end_date
                    ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'N/A'}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {exp.location}
                  </span>
                )}
                {exp.company_url && (
                  <a
                    href={exp.company_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[var(--color-accent)] hover:underline"
                  >
                    <ExternalLink size={12} />
                    Website
                  </a>
                )}
              </div>

              {exp.description && (
                <p className="text-xs text-[var(--color-muted)] line-clamp-2 mt-2">
                  {exp.description}
                </p>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--color-surface-raised)] text-[var(--color-muted)] border border-[var(--color-border)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => openEditForm(exp)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
              >
                <Edit2 size={13} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id, exp.company)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            No work experience records found. Click &quot;Add Work Experience&quot; to begin building your career timeline.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                {editingExp ? 'Edit Work Experience' : 'Add Work Experience'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
              >
                <X size={18} />
              </button>
            </div>

            {statusMsg && (
              <div
                className={`flex items-center gap-2 rounded-xl border p-3.5 text-xs ${
                  statusMsg.type === 'success'
                    ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-600'
                }`}
              >
                {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lead Machine Learning Engineer"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Anthropic / DeepMind"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Employment Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ExperienceType)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA / Remote"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    End Date {isCurrent && '(Disabled for current role)'}
                  </label>
                  <input
                    type="date"
                    disabled={isCurrent}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrentExp"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <label
                  htmlFor="isCurrentExp"
                  className="text-xs font-medium text-[var(--color-foreground)] cursor-pointer"
                >
                  I currently work here
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Technologies Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="e.g. PyTorch, CUDA, Next.js, Distributed Training, Docker"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Description & Impact
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architected production inference pipelines; reduced LLM latency by 45%..."
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  {editingExp ? 'Update Experience' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
