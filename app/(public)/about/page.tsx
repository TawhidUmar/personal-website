import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  FileDown,
  Mail,
  MapPin,
  ExternalLink,
  BookOpen,
  Cpu,
  Palette,
  ShieldCheck,
  Award,
  ArrowRight,
  Star,
  Trophy,
  Shield,
  CalendarDays,
  Layers,
  GraduationCap,
  Sparkles,
  Compass,
  Code2,
} from 'lucide-react';
import {
  getPublicProfile,
  getPublicEducation,
  getPublicHeadlines,
  getPublicSkills,
  getPublicAwards,
} from '@/lib/services/public-data.service';
import { SectionHeader } from '@/components/public/SectionHeader';
import { EducationCard } from '@/components/public/EducationCard';
import { TechSkillCard } from '@/components/public/TechSkillCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { generatePersonSchema } from '@/lib/seo/schema-generators';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getPublicProfile();
  const name = profile.name || 'Md Tawhidul Islam';
  return {
    title: `About | ${name}`,
    description:
      `Academic biography, research focus, engineering philosophy, and background of ${name} — ${profile.headline || 'AI/ML researcher, full-stack engineer, and writer'}.`,
    openGraph: {
      title: `About ${name} | ${profile.headline || 'AI Researcher & Software Architect'}`,
      description: profile.bio || 'Academic biography, research focus, and engineering philosophy.',
      images: [{ url: `/api/og?title=About+${encodeURIComponent(name)}&category=Biography+%C2%B7+Research` }],
    },
  };
}

const researchPillars = [
  {
    icon: Cpu,
    title: 'Efficient Deep Learning',
    description:
      'Designing hardware-aligned recurrent architectures (SSMs, Mamba) and fused GPU kernels that diminish the quadratic compute bottleneck of traditional attention mechanisms.',
  },
  {
    icon: BookOpen,
    title: 'Mechanistic Interpretability',
    description:
      'Probing latent representations and attention circuits in multimodal foundation models to convert black-box predictors into causally verified conceptual graphs.',
  },
  {
    icon: Palette,
    title: 'Systems & Interface Design',
    description:
      'Translating intricate mathematical and distributed abstractions into responsive, accessible, high-contrast digital interfaces that facilitate scientific exploration.',
  },
  {
    icon: ShieldCheck,
    title: 'Methodological Rigor',
    description:
      'Insisting on reproducible open benchmarks, publicly shared artifacts, mathematical proofs of convergence, and zero-compromise architectural standards.',
  },
];

const principles = [
  {
    number: '01',
    title: 'First-Principles Understanding',
    text: 'Never accept a tool, abstraction, or loss function without understanding its underlying linear algebra, hardware memory hierarchy, and algorithmic complexity.',
  },
  {
    number: '02',
    title: 'Bypass Unnecessary Abstractions',
    text: 'When high performance and clean architecture matter, rely on typed raw SQL pools, zero-overhead CSS custom property tokens, and custom fused compute kernels.',
  },
  {
    number: '03',
    title: 'Open Scientific Dissemination',
    text: 'Research that cannot be independently audited or reproduced does not advance science. Every publication should be accompanied by verified code repositories and weights.',
  },
  {
    number: '04',
    title: 'Design as an Intellectual Tool',
    text: 'Visual precision, restrained typography, and intentional micro-interactions are not decorative; they are cognitive instruments that clarify complex thought.',
  },
];

export default async function AboutPage() {
  const [profile, education, headlines, skillCategories, awards] = await Promise.all([
    getPublicProfile(),
    getPublicEducation(),
    getPublicHeadlines(),
    getPublicSkills(),
    getPublicAwards(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev';
  const personSchema = generatePersonSchema(profile, siteUrl, profile?.social_links?.map((s) => s.url) ?? []);
  const name = profile.name || 'Md Tawhidul Islam';
  const location = profile.location || 'Cambridge, MA';

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      <JsonLd data={personSchema} />
      {/* Ambient background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* ================================================================
            1. PAGE HEADER & EXECUTIVE OVERVIEW
            ================================================================ */}
        <div>
          <SectionHeader
            badge={headlines.about_badge || 'Executive Profile & Biography'}
            title={headlines.about_title || 'About & Scientific Philosophy'}
            description={headlines.about_description || 'Academic biography, core research pillars, technical specializations, and engineering principles.'}
            align="center"
          />

          {/* Top Profile Card & Bio Split */}
          <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Executive Profile Card */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-xl">
                {/* Top glow accent */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
                  aria-hidden="true"
                />

                {/* Avatar with status indicator */}
                <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-[var(--color-surface-raised)] border-b border-[var(--color-border)] overflow-hidden">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-5xl font-extrabold text-[var(--color-accent)]">
                      {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Active status pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-[var(--color-surface)]/90 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-medium text-[var(--color-foreground)] border border-[var(--color-border)] shadow-xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
                      {name}
                    </h3>
                    <p className="font-mono text-xs font-semibold text-[var(--color-accent)] mt-1">
                      {profile.headline || 'Graduate Researcher · Full-Stack Architect · Systems Designer'}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                    {profile.bio || 'Operating at the intersection of mathematical AI, distributed systems, and elegant digital interfaces.'}
                  </p>

                  <div className="pt-3 border-t border-[var(--color-border)]/70 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-[var(--color-foreground-muted)]">
                      <MapPin size={14} className="text-[var(--color-accent)] shrink-0" />
                      <span>{location}</span>
                    </div>
                    {education.length > 0 && (
                      <div className="flex items-center gap-2.5 text-xs text-[var(--color-foreground-muted)]">
                        <GraduationCap size={14} className="text-[var(--color-accent)] shrink-0" />
                        <span className="truncate">{education[0].degree} — {education[0].institution}</span>
                      </div>
                    )}
                  </div>

                  {/* Academic & Code Profiles */}
                  {profile.social_links && profile.social_links.length > 0 && (
                    <div className="pt-3 border-t border-[var(--color-border)]/70">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-2.5">
                        Academic &amp; Code Links
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.social_links.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 font-mono text-xs text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)]"
                          >
                            <span>{link.platform}</span>
                            <ExternalLink size={10} className="text-[var(--color-muted)]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 border-t border-[var(--color-border)]/70 flex flex-col sm:flex-row gap-3">
                    <a
                      href={profile.resume_url ?? '#'}
                      download
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all"
                    >
                      <FileDown size={14} />
                      Download Academic CV
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2.5 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
                    >
                      <Mail size={14} />
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Narrative & Focus Matrix */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10 shadow-sm space-y-6">
                <div>
                  <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-3">
                    {headlines.about_bio_badge || 'Narrative & Background'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
                    {headlines.about_bio_title || 'Bridging Theoretical AI Research & Production Systems'}
                  </h3>
                </div>

                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--color-foreground-muted)]">
                  <p>
                    I am a computer science researcher and software engineer operating at the convergence of
                    mathematical machine learning, distributed infrastructure, and intuitive interface design.
                    My graduate work concentrates on overcoming compute and memory constraints in long-context
                    neural sequence processing.
                  </p>
                  <p>
                    My recent investigations explore structured state-space sequence models (SSMs) and hybrid
                    recurrent formulations as viable sub-quadratic alternatives to dense multi-head attention.
                    By formulating hardware-aligned recurrent operators and custom fused GPU kernels, our research
                    seeks to expand context horizons without the severe memory bottlenecks that impede foundation models.
                  </p>
                  <p>
                    Outside the laboratory, I design production full-stack systems with obsessive attention to user
                    experience, type safety, and clean architecture. I believe rigorous technical writing is a direct
                    expression of clear thought; each dispatch explores theoretical concepts with uncompromising
                    mathematical and practical clarity.
                  </p>
                </div>

                {/* Key Metrics / Highlights Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[var(--color-border)]">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 p-3 text-center">
                    <p className="font-mono text-xl font-bold text-[var(--color-accent)]">6+ Yrs</p>
                    <p className="font-mono text-[10px] uppercase text-[var(--color-muted)] mt-0.5">Engineering</p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 p-3 text-center">
                    <p className="font-mono text-xl font-bold text-[var(--color-foreground)]">3.96</p>
                    <p className="font-mono text-[10px] uppercase text-[var(--color-muted)] mt-0.5">Graduate GPA</p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 p-3 text-center">
                    <p className="font-mono text-xl font-bold text-emerald-500">100%</p>
                    <p className="font-mono text-[10px] uppercase text-[var(--color-muted)] mt-0.5">Open Code</p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 p-3 text-center">
                    <p className="font-mono text-xl font-bold text-[var(--color-accent)]">Zero-Spam</p>
                    <p className="font-mono text-[10px] uppercase text-[var(--color-muted)] mt-0.5">Publications</p>
                  </div>
                </div>

                {/* Quick Section Anchor Hub */}
                <div className="pt-6 border-t border-[var(--color-border)]">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-3 flex items-center gap-1.5">
                    <Compass size={12} className="text-[var(--color-accent)]" />
                    Jump to Portfolio Segment
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <a
                      href="#pillars"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 font-medium text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Cpu size={12} className="text-[var(--color-accent)]" />
                      Research Pillars
                    </a>
                    <a
                      href="#skills"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 font-medium text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Code2 size={12} className="text-[var(--color-accent)]" />
                      Technical Skills
                    </a>
                    <a
                      href="#education"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 font-medium text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <GraduationCap size={12} className="text-[var(--color-accent)]" />
                      Education &amp; Degrees
                    </a>
                    <a
                      href="#awards"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 font-medium text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Award size={12} className="text-[var(--color-accent)]" />
                      Honors &amp; Certs
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            2. CORE RESEARCH PILLARS & PHILOSOPHY (FULL-WIDTH BENTO)
            ================================================================ */}
        <div id="pillars" className="scroll-mt-28 space-y-12">
          <SectionHeader
            badge="Foundations &amp; Philosophy"
            title="Core Research Pillars &amp; Working Principles"
            description="Theoretical frameworks guiding laboratory investigations alongside practical engineering heuristics."
            align="center"
          />

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* 4 Pillars Grid (7 cols) */}
            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              {researchPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-md overflow-hidden"
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
                    aria-hidden="true"
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)] shadow-xs mb-4 group-hover:scale-105 transition-transform">
                    <pillar.icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-[var(--color-foreground)]">
                    {pillar.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* 4 Working Principles (5 cols) */}
            <div className="lg:col-span-5 space-y-3.5">
              {principles.map((principle) => (
                <div
                  key={principle.number}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xs transition-all hover:border-[var(--color-accent-border)]"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xl font-extrabold text-[var(--color-accent)] shrink-0 pt-0.5">
                      {principle.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                        {principle.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--color-foreground-muted)]">
                        {principle.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            3. TECHNICAL COMPETENCIES (FULL-WIDTH VISUALIZED MATRIX)
            ================================================================ */}
        {skillCategories.length > 0 && (
          <div id="skills" className="scroll-mt-28 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
              <div>
                <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                  {headlines.skills_badge || 'Competency Domains'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
                  {headlines.skills_title || 'Technical Competencies & Systems Toolchain'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1 max-w-2xl">
                  {headlines.skills_description || 'Production frameworks, deep learning libraries, database engines, and architecture methodologies.'}
                </p>
              </div>

              <Link
                href="/skills"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 font-mono text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
              >
                <span>View Searchable Matrix</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Domain Modules Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skillCategories.map((category, catIdx) => {
                if (category.skills.length === 0) return null;
                const previewSkills = category.skills.slice(0, 4);

                return (
                  <div
                    key={category.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-lg overflow-hidden"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
                      aria-hidden="true"
                    />

                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-1.5">
                            DOMAIN // {String(catIdx + 1).padStart(2, '0')}
                          </span>
                          <h4 className="text-base font-bold text-[var(--color-foreground)]">
                            {category.name}
                          </h4>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--color-muted)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] px-2 py-0.5 rounded-full shrink-0">
                          {category.skills.length} skills
                        </span>
                      </div>

                      {category.description && (
                        <p className="text-xs text-[var(--color-muted)] line-clamp-2 mb-4 leading-relaxed">
                          {category.description}
                        </p>
                      )}

                      {/* Elevated skill items */}
                      <div className="space-y-2.5">
                        {previewSkills.map((skill) => (
                          <TechSkillCard key={skill.id} skill={skill} compact={true} />
                        ))}
                      </div>
                    </div>

                    {/* Footer link */}
                    <div className="mt-5 pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-[var(--color-muted)]">
                        {category.skills.length > 4 ? `+${category.skills.length - 4} more skills` : 'All skills shown'}
                      </span>
                      <Link
                        href={`/skills`}
                        className="inline-flex items-center gap-1 font-semibold text-[var(--color-accent)] hover:underline"
                      >
                        Explore Domain
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================
            4. ACADEMIC CREDENTIALS & EDUCATION (FULL-WIDTH TIMELINE)
            ================================================================ */}
        {education.length > 0 && (
          <div id="education" className="scroll-mt-28 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
              <div>
                <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                  {headlines.about_edu_badge || 'Academic Foundations'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
                  {headlines.about_edu_title || 'Academic Credentials & Formal Education'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
                  {headlines.about_edu_description || 'Higher education degrees, specialized fellowships, and academic affiliations.'}
                </p>
              </div>

              <Link
                href="/education"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 font-mono text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
              >
                <span>Full Academic Profile</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-5">
              {education.map((item) => (
                <EducationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            5. AWARDS, HONORS & CERTIFICATIONS (FULL-WIDTH CREDENTIALS GRID)
            ================================================================ */}
        {awards.length > 0 && (
          <div id="awards" className="scroll-mt-28 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                    {headlines.about_awards_badge || 'Honors & Credentials'}
                  </span>
                  <span className="font-mono text-xs text-[var(--color-muted)]">
                    {awards.length} Verified
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
                  {headlines.about_awards_title || 'Awards, Honors & Professional Certifications'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
                  {headlines.about_awards_description || 'Academic honors, prestigious fellowships, and industry-validated credentials.'}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {awards.map((award, idx) => {
                const isCert = award.category === 'certification';
                const formattedDate = award.date
                  ? new Date(award.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                  : null;

                return (
                  <div
                    key={award.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-lg overflow-hidden"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
                      aria-hidden="true"
                    />

                    <div>
                      {/* Category badge & index */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                            isCert
                              ? 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                              : 'border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400'
                          }`}
                        >
                          {isCert ? <Shield size={10} /> : <Trophy size={10} />}
                          {isCert ? 'Certification' : 'Honor / Award'}
                        </span>

                        <span className="font-mono text-[9px] text-[var(--color-muted)]">
                          {isCert ? `CRT.${String(idx + 1).padStart(2, '0')}` : `AWD.${String(idx + 1).padStart(2, '0')}`}
                        </span>
                      </div>

                      {/* Image or Icon & Title */}
                      <div className="flex items-start gap-3.5 mb-3">
                        {award.badge_url ? (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-1 flex items-center justify-center shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={award.badge_url} alt={award.title} className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div
                            className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border shadow-2xs ${
                              isCert
                                ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                                : 'border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400'
                            }`}
                          >
                            {isCert ? <Shield size={18} /> : <Award size={18} />}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-[var(--color-foreground)] leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                            {award.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                            <span className="font-medium text-[var(--color-foreground)] truncate">
                              {award.issuer}
                            </span>
                            {award.issuer_url && (
                              <a
                                href={award.issuer_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                              >
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      {formattedDate && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-muted)]">
                          <CalendarDays size={11} />
                          <span>{formattedDate}</span>
                        </div>
                      )}

                      {/* Description */}
                      {award.description && (
                        <p className="mt-2.5 text-xs leading-relaxed text-[var(--color-muted)] line-clamp-3">
                          {award.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom verification */}
                    {award.issuer_url && (
                      <div className="mt-5 pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
                          Verified Credential
                        </span>
                        <a
                          href={award.issuer_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--color-accent)] hover:underline"
                        >
                          View Credential
                          <ArrowRight size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================
            6. COLLABORATION & INQUIRIES CALLOUT
            ================================================================ */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
            aria-hidden="true"
          />

          <div className="mx-auto max-w-2xl space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
              <Mail size={22} />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
              Interested in Research Collaboration or Systems Consulting?
            </h3>

            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Available for theoretical deep learning exchanges, high-throughput distributed systems advisory,
              guest seminars, or technical publication commissions.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all"
              >
                Initiate Discussion
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-2.5 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
              >
                Browse Manuscripts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
