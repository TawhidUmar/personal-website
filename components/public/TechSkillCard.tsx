import { Star } from 'lucide-react';
import type { DbSkill, SkillLevel } from '@/types/db.types';
import { DynamicIcon } from '@/components/common/DynamicIcon';

export interface TechSkillCardProps {
  skill: DbSkill;
  compact?: boolean;
  showDescription?: boolean;
}

export const skillLevelConfigs: Record<
  SkillLevel,
  {
    label: string;
    pct: number;
    stage: string;
    color: string;
    badgeBg: string;
    border: string;
  }
> = {
  expert: {
    label: 'Expert',
    pct: 95,
    stage: 'Tier 4 // Mastered',
    color: '#6366f1',
    badgeBg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.35)',
  },
  advanced: {
    label: 'Advanced',
    pct: 80,
    stage: 'Tier 3 // Advanced',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
  },
  intermediate: {
    label: 'Intermediate',
    pct: 65,
    stage: 'Tier 2 // Proficient',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
  },
  beginner: {
    label: 'Foundational',
    pct: 45,
    stage: 'Tier 1 // Working',
    color: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.35)',
  },
};

export function TechSkillCard({
  skill,
  compact = false,
  showDescription = false,
}: TechSkillCardProps) {
  const cfg = skillLevelConfigs[skill.level] ?? skillLevelConfigs.intermediate;

  if (compact) {
    return (
      <div className="group/item relative rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface-raised)]/60 p-3.5 transition-all duration-300 hover:border-[var(--color-accent-border)] hover:bg-[var(--color-surface-raised)] hover:shadow-xs">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)] shadow-2xs group-hover/item:border-[var(--color-accent-border)] transition-colors">
              <DynamicIcon name={skill.icon} fallbackKeyword={skill.name} size={13} />
            </div>
            <div className="truncate">
              <span className="truncate font-mono text-xs font-semibold text-[var(--color-foreground)] flex items-center gap-1">
                {skill.name}
                {skill.is_featured && (
                  <Star size={10} className="shrink-0 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {skill.years_of_experience && (
              <span className="font-mono text-[10px] text-[var(--color-muted)]">
                {skill.years_of_experience}y
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: cfg.badgeBg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
              }}
            >
              <span
                className="h-1 w-1 rounded-full animate-pulse"
                style={{ backgroundColor: cfg.color }}
              />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Telemetry Gauge & Micro-Header */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--color-muted)]">
            <span className="uppercase tracking-wider">Proficiency</span>
            <span className="font-bold text-[var(--color-foreground)]">{cfg.pct}%</span>
          </div>

          {/* Hardware-styled recessed track */}
          <div className="relative h-2 w-full rounded-full bg-[var(--color-background)] border border-[var(--color-border)]/90 p-[1.5px] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative"
              style={{
                width: `${cfg.pct}%`,
                background: `linear-gradient(90deg, ${cfg.color}75 0%, ${cfg.color} 100%)`,
                boxShadow: `0 0 8px ${cfg.color}80`,
              }}
            >
              {/* Glowing leading head */}
              <span
                className="absolute right-0 top-0 bottom-0 w-1.5 rounded-full bg-white opacity-80"
                style={{ boxShadow: `0 0 6px #fff, 0 0 10px ${cfg.color}` }}
              />
            </div>

            {/* Subtle milestone ticks */}
            <span className="pointer-events-none absolute left-1/4 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60" />
            <span className="pointer-events-none absolute left-2/4 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60" />
            <span className="pointer-events-none absolute left-3/4 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group/item relative flex flex-col justify-between rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-raised)]/70 p-5 transition-all duration-300 hover:border-[var(--color-accent-border)] hover:bg-[var(--color-surface-raised)] hover:shadow-md overflow-hidden">
      {/* Top subtle glow bar */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${cfg.color}, transparent)`,
        }}
        aria-hidden="true"
      />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)] shadow-2xs group-hover/item:border-[var(--color-accent-border)] group-hover/item:shadow-[0_0_14px_var(--color-accent-glow)] transition-all">
              <DynamicIcon name={skill.icon} fallbackKeyword={skill.name} size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="truncate font-bold text-sm text-[var(--color-foreground)] flex items-center gap-1.5">
                {skill.name}
                {skill.is_featured && (
                  <Star size={12} className="shrink-0 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                )}
              </h4>
              {skill.years_of_experience ? (
                <p className="font-mono text-[10px] text-[var(--color-muted)] mt-0.5">
                  {skill.years_of_experience}+ years production experience
                </p>
              ) : (
                <p className="font-mono text-[10px] text-[var(--color-muted)] mt-0.5">
                  Validated Competency
                </p>
              )}
            </div>
          </div>

          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0"
            style={{
              backgroundColor: cfg.badgeBg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: cfg.color }}
            />
            {cfg.label}
          </span>
        </div>

        {showDescription && skill.description && (
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)] line-clamp-2">
            {skill.description}
          </p>
        )}
      </div>

      {/* Advanced Telemetry Proficiency Module */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border)]/50 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-muted)]">
          <span className="uppercase tracking-wider flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
            {cfg.stage}
          </span>
          <span className="font-bold text-[var(--color-foreground)] text-xs">
            {cfg.pct}%
          </span>
        </div>

        {/* Dual-rail recessed track */}
        <div className="relative h-2.5 w-full rounded-full bg-[var(--color-background)] border border-[var(--color-border)]/90 p-[2px] overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out relative"
            style={{
              width: `${cfg.pct}%`,
              background: `linear-gradient(90deg, ${cfg.color}70 0%, ${cfg.color} 100%)`,
              boxShadow: `0 0 10px ${cfg.color}90`,
            }}
          >
            {/* Top gloss reflection */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 rounded-t-full opacity-40"
              style={{ background: 'linear-gradient(180deg, #fff 0%, transparent 100%)' }}
            />
            {/* Illuminated leading head */}
            <span
              className="absolute right-0 top-0 bottom-0 w-2 rounded-full bg-white opacity-90"
              style={{ boxShadow: `0 0 8px #fff, 0 0 12px ${cfg.color}` }}
            />
          </div>

          {/* Precision tick dividers */}
          <span className="pointer-events-none absolute left-1/4 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60" />
          <span className="pointer-events-none absolute left-2/4 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60" />
          <span className="pointer-events-none absolute left-3/4 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60" />
        </div>

        {/* Ruler scale labels */}
        <div className="flex justify-between font-mono text-[8px] text-[var(--color-muted)] px-0.5">
          <span>0%</span>
          <span className="text-[var(--color-muted)]/70">25%</span>
          <span className="text-[var(--color-muted)]/70">50%</span>
          <span className="text-[var(--color-muted)]/70">75%</span>
          <span className="font-semibold text-[var(--color-foreground)]">100%</span>
        </div>
      </div>
    </div>
  );
}
