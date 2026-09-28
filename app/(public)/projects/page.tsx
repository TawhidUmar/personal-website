import type { Metadata } from 'next';
import { getPublicAllProjects, getPublicHeadlines } from '@/lib/services/public-data.service';
import { SectionHeader } from '@/components/public/SectionHeader';
import { FeaturedProjectCard } from '@/components/public/FeaturedProjectCard';
import { Code2, Terminal, Layers, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Software Engineering Projects | Alex Vance',
  description:
    'Full-stack applications, deep learning inference runtimes, distributed systems architectures, and open-source software by Alex Vance.',
  openGraph: {
    title: 'Software Engineering Projects | Alex Vance',
    description: 'Production architectures, distributed runtimes, and open-source frameworks.',
    images: [{ url: '/api/og?title=Software+Projects&category=Architecture+%C2%B7+Systems' }],
  },
};

export default async function ProjectsListingPage() {
  const [projects, headlines] = await Promise.all([
    getPublicAllProjects(),
    getPublicHeadlines(),
  ]);

  const allTech = new Set(projects.flatMap((p) => p.technologies));

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <SectionHeader
          badge={headlines.projects_badge}
          title={headlines.projects_title}
          description={headlines.projects_description}
          align="center"
        />

        {/* Project Metrics Strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              {projects.length}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Shipped Projects
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">
              {allTech.size}+
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Technologies Utilized
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-green-500">
              Sub-3ms
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Peak Kernel Latency
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              100%
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              Production Validated
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
