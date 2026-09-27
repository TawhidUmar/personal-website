import { GraduationCap, Calendar, Award, MapPin, ExternalLink, BookOpen } from 'lucide-react';
import type { DbEducation } from '@/types/db.types';

interface EducationCardProps {
  item: DbEducation;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function EducationCard({ item }: EducationCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-[var(--color-accent-border)] hover:shadow-md">
      {/* Top row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
            <GraduationCap size={22} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">
              {item.degree}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
              {item.institution_url ? (
                <a
                  href={item.institution_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {item.institution}
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="font-semibold text-[var(--color-foreground)]">
                  {item.institution}
                </span>
              )}

              {item.location && (
                <span className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                  <MapPin size={12} />
                  {item.location}
                </span>
              )}
            </div>

            {item.field_of_study && (
              <p className="mt-1 font-mono text-xs text-[var(--color-accent)]">
                Focus: {item.field_of_study}
              </p>
            )}
          </div>
        </div>

        {/* GPA & Dates */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto sm:flex-col sm:items-end">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-muted)] bg-[var(--color-surface-raised)] px-3 py-1 rounded-md border border-[var(--color-border)]">
            <Calendar size={12} />
            <span>
              {item.start_date
                ? `${formatDate(item.start_date)} — ${item.is_current ? 'Present' : item.end_date ? formatDate(item.end_date) : 'Present'}`
                : item.is_current
                  ? 'Current'
                  : item.end_date
                    ? `Graduated ${formatDate(item.end_date)}`
                    : 'Completed'}
            </span>
          </div>

          {item.gpa && (
            <div className="inline-flex items-center gap-1 rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2.5 py-0.5 text-xs font-mono font-medium text-[var(--color-accent)]">
              <Award size={12} />
              <span>GPA: {item.gpa} / {item.gpa_scale ?? 4.0}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description / Thesis */}
      {item.description && (
        <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/60 p-4">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-foreground)] mb-1">
            <BookOpen size={13} className="text-[var(--color-accent)]" />
            Academic Focus & Thesis
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
            {item.description}
          </p>
        </div>
      )}

      {/* Activities / Honors */}
      {item.activities && (
        <div className="mt-4 flex items-start gap-2 text-xs text-[var(--color-muted)]">
          <Award size={14} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-[var(--color-foreground)]">Honors & Activities:</span>{' '}
            {item.activities}
          </p>
        </div>
      )}
    </div>
  );
}
