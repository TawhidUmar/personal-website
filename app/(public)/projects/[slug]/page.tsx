import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Calendar,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Trophy,
  Layers,
} from 'lucide-react';
import { getPublicProjectBySlug } from '@/lib/services/public-data.service';
import { ShareButtons } from '@/components/public/ShareButtons';

import { JsonLd } from '@/components/seo/JsonLd';
import { generateProjectSchema } from '@/lib/seo/schema-generators';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  const ogImage = project.hero_image_url || `/api/og?title=${encodeURIComponent(project.title)}&category=Case+Study`;

  return {
    title: `${project.title} | Technical Case Study`,
    description: project.description ?? 'Software Engineering Case Study & System Architecture',
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.description ?? undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description ?? undefined,
      images: [ogImage],
    },
  };
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'Present';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tawhidulislam.me';
  const projectSchema = generateProjectSchema(project, siteUrl);

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      <JsonLd data={projectSchema} />
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" aria-hidden="true" />

      <article className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to All Projects
          </Link>
        </div>

        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            {project.category_name && (
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                {project.category_name}
              </span>
            )}
            <span className="font-mono text-xs text-[var(--color-muted)]">•</span>
            <span className="font-mono text-xs text-[var(--color-muted)]">
              {formatDate(project.started_at)} — {formatDate(project.ended_at)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-foreground)] leading-tight">
            {project.title}
          </h1>

          <p className="text-lg text-[var(--color-muted)] leading-relaxed">
            {project.description}
          </p>

          {/* Links & Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex flex-wrap items-center gap-3">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all"
                >
                  <ExternalLink size={14} />
                  Live Deployment
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
                >
                  <Code2 size={14} />
                  GitHub Repository
                </a>
              )}
            </div>

            <ShareButtons title={project.title} />
          </div>
        </header>

        {/* Project Metadata Matrix */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-xs">
          <div>
            <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">Role</span>
            <p className="font-semibold text-[var(--color-foreground)] mt-1">{project.role ?? 'Architect'}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">Client / Context</span>
            <p className="font-semibold text-[var(--color-foreground)] mt-1">{project.client ?? 'Open Source'}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">Timeline</span>
            <p className="font-semibold text-[var(--color-foreground)] mt-1">
              {formatDate(project.started_at)}
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">Status</span>
            <p className="font-semibold text-green-500 mt-1 capitalize">{project.status}</p>
          </div>
        </div>

        {/* Hero Image */}
        {project.hero_image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-lg">
            <Image
              src={project.hero_image_url}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Problem vs Solution Split */}
        <div className="grid gap-6 md:grid-cols-2">
          {project.problem && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-7 space-y-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-red-600 dark:text-red-400">
                <AlertTriangle size={18} />
                The Problem & Bottleneck
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                {project.problem}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 sm:p-7 space-y-3">
              <h3 className="flex items-center gap-2 text-base font-bold text-green-600 dark:text-green-400">
                <CheckCircle2 size={18} />
                The Architectural Solution
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                {project.solution}
              </p>
            </div>
          )}
        </div>

        {/* Features Checklist */}
        {project.features && project.features.length > 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--color-foreground)]">
              <Layers size={18} className="text-[var(--color-accent)]" />
              Core Capabilities & Features
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-foreground)]">
                  <CheckCircle2 size={16} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* System Architecture & Technical Decisions */}
        {project.architecture && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 space-y-3">
            <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--color-foreground)]">
              <Cpu size={18} className="text-[var(--color-accent)]" />
              System Architecture & Implementation
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--color-foreground-muted)]">
              {project.architecture}
            </p>
          </section>
        )}

        {/* Challenges & Results Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {project.challenges && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-2">
              <h3 className="text-base font-bold text-[var(--color-foreground)]">
                Key Engineering Challenges
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                {project.challenges}
              </p>
            </div>
          )}

          {project.results && (
            <div className="rounded-2xl border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] p-6 space-y-2">
              <h3 className="flex items-center gap-2 text-base font-bold text-[var(--color-accent)]">
                <Trophy size={16} />
                Measurable Results & Impact
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-foreground)] font-medium">
                {project.results}
              </p>
            </div>
          )}
        </div>

        {/* Technologies Stack */}
        {project.technologies && project.technologies.length > 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Technologies & Frameworks Utilized
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1 font-mono text-xs font-semibold text-[var(--color-foreground)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
