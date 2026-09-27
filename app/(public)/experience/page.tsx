import type { Metadata } from 'next';
import { getPublicExperiences, getPublicHeadlines } from '@/lib/services/public-data.service';
import { SectionHeader } from '@/components/public/SectionHeader';
import { ExperienceTimeline } from '@/components/public/ExperienceTimeline';
import { Briefcase, Calendar, Code2, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Work Experience | Alex Vance',
  description:
    'Professional trajectory, engineering appointments, graduate research roles, and technical achievements of Alex Vance.',
  openGraph: {
    title: 'Work Experience | Alex Vance',
    description: 'Professional appointments, systems engineering milestones, and research history.',
    images: [{ url: '/api/og?title=Career+Trajectory&category=Engineering+%C2%B7+Experience' }],
  },
};

export default async function ExperiencePage() {
  const [experiences, headlines] = await Promise.all([
    getPublicExperiences(),
    getPublicHeadlines(),
  ]);

  // Aggregate stats
  const totalRoles = experiences.length;
  const allTech = new Set(experiences.flatMap((e) => e.technologies ?? []));
  const currentRoles = experiences.filter((e) => e.is_current).length;

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge={headlines.experience_badge}
          title={headlines.experience_title}
          description={headlines.experience_description}
          align="center"
        />

        {/* Quick statistics strip */}
        <div className="mb-14 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <div>
            <div className="flex items-center justify-center gap-1.5 font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              <Briefcase size={20} className="text-[var(--color-accent)]" />
              {totalRoles}
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Total Positions
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 font-mono text-2xl sm:text-3xl font-bold text-green-500">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              {currentRoles}
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Active Engagements
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 font-mono text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">
              <Code2 size={20} />
              {allTech.size}+
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Technologies Mastered
            </p>
          </div>
        </div>

        {/* Interactive Timeline */}
        <ExperienceTimeline experiences={experiences} />
      </div>
    </div>
  );
}
