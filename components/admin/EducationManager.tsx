'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from '@/actions/education.actions';
import {
  Plus,
  GraduationCap,
  Calendar,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Award,
} from 'lucide-react';
import type { DbEducation } from '@/types/db.types';

interface EducationManagerProps {
  initialEducation: DbEducation[];
}

export function EducationManager({ initialEducation }: EducationManagerProps) {
  const router = useRouter();
  const [educationList] = useState<DbEducation[]>(initialEducation);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<DbEducation | null>(null);

  const [institution, setInstitution] = useState('');
  const [institutionUrl, setInstitutionUrl] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState('');
  const [gpa, setGpa] = useState('');
  const [gpaScale, setGpaScale] = useState('4.0');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreateForm = () => {
    setEditingEdu(null);
    setInstitution('');
    setInstitutionUrl('');
    setDegree('');
    setFieldOfStudy('');
    setLocation('');
    setDescription('');
    setActivities('');
    setGpa('');
    setGpaScale('4.0');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDisplayOrder('0');
    setStatusMsg(null);
    setIsFormOpen(true);
  };

  const openEditForm = (edu: DbEducation) => {
    setEditingEdu(edu);
    setInstitution(edu.institution);
    setInstitutionUrl(edu.institution_url ?? '');
    setDegree(edu.degree);
    setFieldOfStudy(edu.field_of_study ?? '');
    setLocation(edu.location ?? '');
    setDescription(edu.description ?? '');
    setActivities(edu.activities ?? '');
    setGpa(edu.gpa ? String(edu.gpa) : '');
    setGpaScale(edu.gpa_scale ? String(edu.gpa_scale) : '4.0');
    setStartDate(
      edu.start_date ? new Date(edu.start_date).toISOString().split('T')[0] : ''
    );
    setEndDate(
      edu.end_date ? new Date(edu.end_date).toISOString().split('T')[0] : ''
    );
    setIsCurrent(edu.is_current);
    setDisplayOrder(String(edu.display_order ?? 0));
    setStatusMsg(null);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('institution', institution);
    formData.append('institutionUrl', institutionUrl);
    formData.append('degree', degree);
    formData.append('fieldOfStudy', fieldOfStudy);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('activities', activities);
    if (gpa) formData.append('gpa', gpa);
    if (gpaScale) formData.append('gpaScale', gpaScale);
    formData.append('startDate', startDate);
    if (!isCurrent && endDate) {
      formData.append('endDate', endDate);
    }
    if (isCurrent) {
      formData.append('isCurrent', 'true');
    }
    formData.append('displayOrder', displayOrder);

    startTransition(async () => {
      const res = editingEdu
        ? await updateEducationAction(editingEdu.id, { status: 'idle' }, formData)
        : await createEducationAction({ status: 'idle' }, formData);

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

  const handleDelete = (id: number, inst: string) => {
    if (window.confirm(`Are you sure you want to delete education record from ${inst}?`)) {
      startTransition(async () => {
        await deleteEducationAction(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Academic Credentials CMS
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Manage university degrees, graduate research appointments, and academic achievements.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Education Record
        </button>
      </div>

      {/* Education List */}
      <div className="grid grid-cols-1 gap-4">
        {educationList.map((edu) => (
          <div
            key={edu.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-border)] transition-all"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-base text-[var(--color-foreground)]">
                  {edu.degree}
                </span>
                {edu.field_of_study && (
                  <span className="text-sm font-medium text-[var(--color-muted)]">
                    in {edu.field_of_study}
                  </span>
                )}
                {edu.is_current && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                    CURRENT
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-[var(--color-accent)]">
                {edu.institution}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)] font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {edu.start_date
                    ? `${new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — ${
                        edu.is_current
                          ? 'Present'
                          : edu.end_date
                          ? new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : 'Present'
                      }`
                    : edu.is_current
                    ? 'Current'
                    : edu.end_date
                    ? `Graduated ${new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                    : 'Completed'}
                </span>
                {edu.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {edu.location}
                  </span>
                )}
                {edu.gpa && (
                  <span className="flex items-center gap-1 text-[var(--color-foreground)]">
                    <Award size={13} className="text-[var(--color-accent)]" />
                    GPA: {edu.gpa} / {edu.gpa_scale ?? '4.0'}
                  </span>
                )}
                {edu.institution_url && (
                  <a
                    href={edu.institution_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[var(--color-accent)] hover:underline"
                  >
                    <ExternalLink size={12} />
                    Portal
                  </a>
                )}
              </div>

              {edu.description && (
                <p className="text-xs text-[var(--color-muted)] line-clamp-2 mt-2">
                  {edu.description}
                </p>
              )}

              {edu.activities && (
                <p className="text-xs text-[var(--color-muted)] italic mt-1">
                  Activities: {edu.activities}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => openEditForm(edu)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
              >
                <Edit2 size={13} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(edu.id, edu.institution)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {educationList.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            No education records found. Click &quot;Add Education Record&quot; to begin cataloging your academic credentials.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                {editingEdu ? 'Edit Academic Record' : 'Add Academic Record'}
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
                    Institution / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Master of Science (M.S.)"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Stanford, CA"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Institution URL
                  </label>
                  <input
                    type="url"
                    value={institutionUrl}
                    onChange={(e) => setInstitutionUrl(e.target.value)}
                    placeholder="https://stanford.edu"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="3.95"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">GPA Scale</label>
                  <input
                    type="number"
                    step="0.1"
                    value={gpaScale}
                    onChange={(e) => setGpaScale(e.target.value)}
                    placeholder="4.0"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Start Date (optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Graduation / End Date {isCurrent && '(Disabled if currently enrolled)'}
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
                  id="isCurrentEdu"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <label
                  htmlFor="isCurrentEdu"
                  className="text-xs font-medium text-[var(--color-foreground)] cursor-pointer"
                >
                  I am currently enrolled / pursuing this degree
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Activities & Honors
                </label>
                <input
                  type="text"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="e.g. Graduate Teaching Assistant, AI Reading Group Organizer"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Research Thesis & Coursework Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Thesis focus: Deep generative models for tabular synthesis under privacy constraints..."
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
                  {editingEdu ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
