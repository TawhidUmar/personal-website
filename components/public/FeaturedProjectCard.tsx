import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Code2 } from 'lucide-react';
import type { DbProjectWithDetails } from '@/types/db.types';

interface FeaturedProjectCardProps {
  project: DbProjectWithDetails;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-xl">
      {/* Top gradient accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
        aria-hidden="true"
      />

      {/* Corner crosshair marks */}
      <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>

      <div>
        {/* Category & Links */}
        <div className="flex items-center justify-between gap-2">
          {project.category_name && (
            <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
              {project.category_name}
            </span>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub source for ${project.title}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)]"
              >
                <Code2 size={13} />
              </a>
            )}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live link for ${project.title}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)]"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-foreground-muted)] line-clamp-3">
          {project.description}
        </p>

        {/* Key result / feature bullet */}
        {project.results && (
          <div className="mt-4 rounded-xl border border-[var(--color-accent-border)]/40 bg-[var(--color-accent-subtle)]/50 px-3.5 py-2.5 text-xs text-[var(--color-foreground)] font-mono flex items-start gap-2">
            <span className="text-[var(--color-accent)] font-bold shrink-0">Impact:</span>
            <span className="line-clamp-2">{project.results}</span>
          </div>
        )}
      </div>

      {/* Footer / Tech stack */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border)]/60">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-[var(--color-surface-raised)] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[var(--color-muted)] border border-[var(--color-border)]"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded-md bg-[var(--color-surface-raised)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-muted)] border border-[var(--color-border)]">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline"
          >
            Read Technical Case Study
            <ArrowUpRight size={13} />
          </Link>
          {project.role && (
            <span className="font-mono text-[10px] text-[var(--color-muted)]">{project.role}</span>
          )}
        </div>
      </div>
    </div>
  );
}
