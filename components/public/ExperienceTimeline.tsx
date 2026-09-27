'use client';

import { useState } from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';
import type { DbExperience, ExperienceType } from '@/types/db.types';

interface ExperienceTimelineProps {
  experiences: DbExperience[];
}

const filterOptions: { label: string; value: 'all' | ExperienceType }[] = [
  { label: 'All Roles', value: 'all' },
  { label: 'Full-Time', value: 'full-time' },
  { label: 'Part-Time / Research', value: 'part-time' },
  { label: 'Internship', value: 'internship' },
];

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ExperienceType>('all');

  const filtered = selectedFilter === 'all'
    ? experiences
    : experiences.filter((exp) => exp.type === selectedFilter);

  return (
    <div className="w-full space-y-8">
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedFilter(opt.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              selectedFilter === opt.value
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Timeline list */}
      <div className="relative border-l border-[var(--color-border)] pl-6 sm:pl-8 ml-3 sm:ml-4 space-y-10">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline node icon */}
            <div
              className={`absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border bg-[var(--color-surface)] transition-all ${
                item.is_current
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)] shadow-md'
                  : 'border-[var(--color-border)] text-[var(--color-muted)] group-hover:border-[var(--color-accent-border)] group-hover:text-[var(--color-foreground)]'
              }`}
            >
              <Briefcase size={13} />
            </div>

            {/* Experience card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-sm transition-all duration-200 hover:border-[var(--color-accent-border)] hover:shadow-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">
                      {item.title}
                    </h3>
                    {item.is_current && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[11px] font-semibold text-green-600 dark:text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
                    {item.company_url ? (
                      <a
                        href={item.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[var(--color-accent)] hover:underline"
                      >
                        {item.company}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="font-medium text-[var(--color-foreground)]">
                        {item.company}
                      </span>
                    )}

                    {item.location && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                        <MapPin size={12} />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-muted)] self-start sm:self-auto bg-[var(--color-surface-raised)] px-3 py-1 rounded-md border border-[var(--color-border)]">
                  <Calendar size={12} />
                  <span>
                    {formatDate(item.start_date)} —{' '}
                    {item.is_current ? 'Present' : item.end_date ? formatDate(item.end_date) : 'Present'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--color-foreground-muted)]">
                  {item.description}
                </p>
              )}

              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-1 font-mono text-xs text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent-border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
