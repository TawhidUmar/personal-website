import type { Metadata } from 'next';
import { getPublicSkills, getPublicHeadlines } from '@/lib/services/public-data.service';
import { SectionHeader } from '@/components/public/SectionHeader';
import { SkillMatrix } from '@/components/public/SkillMatrix';
import { Code2, BrainCircuit, Palette, BookOpen, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Technical Skills & Competencies | Alex Vance',
  description:
    'Comprehensive technical skill matrix across deep learning, full-stack architecture, UI/UX design systems, and scientific publishing.',
  openGraph: {
    title: 'Technical Skills & Competencies | Alex Vance',
    description: 'Skill matrix across deep learning, full-stack architectures, and UI/UX design systems.',
    images: [{ url: '/api/og?title=Technical+Competencies&category=Skills+%C2%B7+Tooling' }],
  },
};

export default async function SkillsPage() {
  const [categories, headlines] = await Promise.all([
    getPublicSkills(),
    getPublicHeadlines(),
  ]);

  // Aggregate stats
  const totalSkills = categories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const expertSkills = categories.reduce(
    (acc, cat) => acc + cat.skills.filter((s) => s.level === 'expert').length,
    0
  );

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <SectionHeader
          badge={headlines.skills_badge}
          title={headlines.skills_title}
          description={headlines.skills_description}
          align="center"
        />

        {/* Competency Summary Ribbon */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              {totalSkills}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Total Competencies
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">
              {expertSkills}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Expert Level Domains
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-green-500">
              4 Disciplines
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              AI · Web · Design · Writing
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              Zero-ORM
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Pure Typed Architecture
            </p>
          </div>
        </div>

        {/* Interactive Matrix */}
        <SkillMatrix categories={categories} />
      </div>
    </div>
  );
}
