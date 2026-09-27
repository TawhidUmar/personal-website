import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Terminal as TerminalIcon,
  FlaskConical,
  Briefcase,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  FileText,
  Mail,
  GraduationCap,
  MapPin,
  Star,
  Award,
  CalendarDays,
  Shield,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import {
  getPublicProfile,
  getPublicFeaturedResearch,
  getPublicFeaturedProjects,
  getPublicFeaturedArticles,
  getPublicExperiences,
  getPublicEducation,
  getPublicSkills,
  getPublicHeadlines,
  getPublicAwards,
} from '@/lib/services/public-data.service';
import { HeroTerminal } from '@/components/public/HeroTerminal';
import { HeroBrandedPhoto } from '@/components/public/HeroBrandedPhoto';
import { SectionHeader } from '@/components/public/SectionHeader';
import { FeaturedProjectCard } from '@/components/public/FeaturedProjectCard';
import { FeaturedResearchCard } from '@/components/public/FeaturedResearchCard';
import { FeaturedArticleCard } from '@/components/public/FeaturedArticleCard';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { TechSkillCard } from '@/components/public/TechSkillCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebSiteSchema, generatePersonSchema } from '@/lib/seo/schema-generators';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getPublicProfile();
  const name = profile.name || 'Md Tawhidul Islam';
  const headline = profile.headline || 'Developer · AI/ML Researcher · Designer · Writer';
  return {
    title: `${name} | ${headline}`,
    description: profile.bio || 'Graduate AI/ML Researcher, Full-Stack Developer, Systems Designer, and Technical Writer.',
    openGraph: {
      title: `${name} | ${headline}`,
      description: profile.bio || 'Graduate AI/ML Researcher, Full-Stack Developer, Systems Designer, and Technical Writer.',
      images: [{ url: `/api/og?title=${encodeURIComponent(name)}&subtitle=${encodeURIComponent(headline)}` }],
    },
  };
}

const personaBadges = [
  'Full-Stack Developer',
  'Graduate AI/ML Researcher',
  'Systems & UI Designer',
  'Graduate Student',
  'Technical & Research Writer',
];


export default async function HomePage() {
  const [profile, research, projects, articles, experiences, education, skillCategories, headlines, awards] =
    await Promise.all([
      getPublicProfile(),
      getPublicFeaturedResearch(),
      getPublicFeaturedProjects(),
      getPublicFeaturedArticles(),
      getPublicExperiences(),
      getPublicEducation(),
      getPublicSkills(),
      getPublicHeadlines(),
      getPublicAwards(),
    ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev';
  const websiteSchema = generateWebSiteSchema(siteUrl, 'Alex Vance | AI Researcher & Software Architect');
  const personSchema = generatePersonSchema(profile, siteUrl, profile?.social_links?.map((s) => s.url) ?? []);

  // Flatten featured skills for summary strip; fall back to first 8 across categories
  const featuredSkills = skillCategories.flatMap((c) => c.skills.filter((s) => s.is_featured));
  const displaySkills = featuredSkills.length > 0 ? featuredSkills : skillCategories.flatMap((c) => c.skills).slice(0, 8);

  // Only first 3 edu records on homepage
  const displayEducation = education.slice(0, 3);

  // Only first 6 featured awards on homepage
  const displayAwards = awards.slice(0, 6);

  return (
    <div className="relative overflow-hidden pt-20">
      <JsonLd data={websiteSchema} />
      <JsonLd data={personSchema} />
      {/* Ambient background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, var(--color-accent-glow), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ================================================================
          1. HERO SECTION
          ================================================================ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Bio & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-4 py-1.5 text-xs font-medium text-[var(--color-accent)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              {headlines.hero_badge}
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-6xl lg:text-5xl xl:text-6xl leading-[1.08]">
              {headlines.hero_title_prefix}{' '}
              <span className="text-gradient-accent">
                {headlines.hero_title_highlight}
              </span>{' '}
              {headlines.hero_title_suffix}
            </h1>

            {/* Subtitle / Bio */}
            <p className="max-w-2xl text-base sm:text-lg text-[var(--color-muted)] leading-relaxed mx-auto lg:mx-0">
              {headlines.hero_subtitle || profile.headline ||
                'Developer · Graduate AI/ML Researcher · Designer · Technical Writer'}
            </p>

            {/* Multi-disciplinary persona badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 max-w-2xl">
              {personaBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1 font-mono text-xs text-[var(--color-foreground)] shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/research"
                className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Explore Research
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] shadow-sm transition-all hover:border-[var(--color-accent-border)] hover:bg-[var(--color-surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <Code2 size={16} className="text-[var(--color-accent)]" />
                View Projects
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-xl border border-transparent px-5 py-3 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Right Column: Branded Photo Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end pb-10 sm:pb-14 lg:pb-16">
            <HeroBrandedPhoto
              avatarUrl={profile.avatar_url}
              name={profile.name || 'Md Tawhidul Islam'}
              headline={profile.headline}
              location={profile.location}
              cardBadge={headlines.hero_card_role_badge}
            />
          </div>
        </div>

        {/* Interactive Code & Research Terminal */}
        <div className="mt-16 sm:mt-20">
          <HeroTerminal />
        </div>
      </section>

      {/* ================================================================
          2. METRICS STRIP (Temporarily Hidden)
          ================================================================ */}
      {/*
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[var(--color-foreground)]">
                3.8x
              </p>
              <p className="mt-1 text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
                Inference Memory Reduction
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[var(--color-accent)]">
                6+ Yrs
              </p>
              <p className="mt-1 text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
                Engineering Experience
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[var(--color-foreground)]">
                3.96
              </p>
              <p className="mt-1 text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
                Graduate AI/CS GPA
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[var(--color-success)]">
                100%
              </p>
              <p className="mt-1 text-xs font-mono uppercase tracking-wider text-[var(--color-muted)]">
                Open Access Publications
              </p>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* ================================================================
          3. TECHNICAL SKILLS & EXPERTISE
          ================================================================ */}
      <section className="border-t border-[var(--color-border)] mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeader
          badge={headlines.home_skills_badge}
          title={headlines.home_skills_title}
          description={headlines.home_skills_description}
        />

        {/* Category grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {skillCategories.map((cat, catIdx) => {
            const catSkills = cat.skills.slice(0, 5);
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] overflow-hidden"
              >
                {/* Corner crosshair marks */}
                <span className="pointer-events-none absolute -top-1.5 -left-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>
                <span className="pointer-events-none absolute -top-1.5 -right-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>
                <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>
                <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>

                {/* Top accent glow on hover */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
                  aria-hidden="true"
                />

                <div>
                  {/* Category header */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                        DOMAIN // {String(catIdx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-base font-bold text-[var(--color-foreground)] leading-tight">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-accent)] shadow-xs group-hover:border-[var(--color-accent-border)] transition-colors">
                      <Layers size={18} />
                    </div>
                  </div>

                  {/* Skill rows using TechSkillCard */}
                  <div className="space-y-2.5">
                    {catSkills.map((skill) => (
                      <TechSkillCard key={skill.id} skill={skill} compact={true} />
                    ))}
                  </div>
                </div>

                {/* Footer domain link */}
                <div className="mt-6 pt-3.5 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[var(--color-muted)]">
                    {cat.skills.length > 5 ? `+${cat.skills.length - 5} more in domain` : 'All capabilities shown'}
                  </span>
                  <Link
                    href="/skills"
                    className="inline-flex items-center gap-1 font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    View Domain
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured skills quick strip / Active Production Toolchain */}
        {displaySkills.length > 0 && (
          <div className="mt-12 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md p-6 shadow-sm relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
              aria-hidden="true"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)] font-bold">
                  Active Production Toolchain &amp; Core Stack
                </span>
              </div>
              <span className="font-mono text-[10px] text-[var(--color-muted)]">
                {displaySkills.length} High-Impact Technologies
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {displaySkills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/80 px-3.5 py-1.5 font-mono text-xs text-[var(--color-foreground)] shadow-2xs hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] hover:shadow-xs transition-all duration-200"
                >
                  <DynamicIcon name={skill.icon} fallbackKeyword={skill.name} size={13} className="text-[var(--color-accent)] shrink-0" />
                  <span>{skill.name}</span>
                  {skill.years_of_experience && (
                    <span className="text-[10px] text-[var(--color-muted)]">• {skill.years_of_experience}y</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors shadow-xs"
          >
            <Layers size={15} className="text-[var(--color-accent)]" />
            View Full Competency Matrix
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

{/* ================================================================
          4. EDUCATION & TRAINING INFOGRAPHIC
          ================================================================ */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={headlines.home_education_badge}
          title={headlines.home_education_title}
          description={headlines.home_education_description}
        />

        <div className="relative mt-4">
          {/* Vertical timeline track */}
          <div
            className="pointer-events-none absolute left-6 top-0 bottom-0 w-px hidden sm:block"
            style={{ background: 'linear-gradient(to bottom, var(--color-accent), var(--color-border) 80%, transparent)' }}
            aria-hidden="true"
          />

          <div className="space-y-6">
            {displayEducation.map((edu, idx) => {
              const startYear = edu.start_date ? new Date(edu.start_date).getFullYear() : null;
              const endYear = edu.end_date ? new Date(edu.end_date).getFullYear() : null;
              const yearRange = edu.is_current
                ? `${startYear ?? '?'} – Present`
                : startYear && endYear
                  ? `${startYear} – ${endYear}`
                  : endYear
                    ? `Graduated ${endYear}`
                    : 'Completed';

              return (
                <div key={edu.id} className="sm:pl-16 relative group">
                  {/* Timeline dot */}
                  <div
                    className="pointer-events-none absolute left-[17px] top-6 hidden sm:flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-background)] shadow-sm group-hover:shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-shadow"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                  </div>

                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.1)] overflow-hidden relative">
                    {/* Top gradient accent line */}
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
                      aria-hidden="true"
                    />

                    {/* Corner marks */}
                    <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-50 transition-opacity select-none" aria-hidden="true">+</span>
                    <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-50 transition-opacity select-none" aria-hidden="true">+</span>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Degree + index badge */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="inline-block rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                            EDU.{String(idx + 1).padStart(2, '0')}
                          </span>
                          {edu.is_current && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Current
                            </span>
                          )}
                        </div>

                        {/* Degree title */}
                        <h3 className="text-base sm:text-lg font-extrabold text-[var(--color-foreground)] tracking-tight leading-snug">
                          {edu.degree}
                        </h3>

                        {/* Institution */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <GraduationCap size={13} className="text-[var(--color-accent)] flex-shrink-0" />
                          {edu.institution_url ? (
                            <a
                              href={edu.institution_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors truncate"
                            >
                              {edu.institution}
                            </a>
                          ) : (
                            <span className="font-medium text-sm text-[var(--color-foreground)] truncate">
                              {edu.institution}
                            </span>
                          )}
                        </div>

                        {/* Field of study + location */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {edu.field_of_study && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
                              <Code2 size={9} />
                              {edu.field_of_study}
                            </span>
                          )}
                          {edu.location && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
                              <MapPin size={9} />
                              {edu.location}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
                            <CalendarDays size={9} />
                            {yearRange}
                          </span>
                        </div>

                        {/* Description snippet */}
                        {edu.description && (
                          <p className="mt-3 text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>

                      {/* Right: GPA badge */}
                      {edu.gpa && (
                        <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-4 py-3 text-center min-w-[80px] shadow-sm">
                          <Award size={16} className="text-[var(--color-accent)] mb-1" />
                          <span className="font-mono text-xl font-extrabold text-[var(--color-accent)] leading-none">
                            {edu.gpa.toFixed(2)}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-muted)] mt-0.5">
                            GPA{edu.gpa_scale ? ` / ${edu.gpa_scale.toFixed(1)}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Activities strip */}
                    {edu.activities && (
                      <div className="mt-4 pt-3.5 border-t border-[var(--color-border)]">
                        <div className="flex items-start gap-2">
                          <Star size={11} className="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
                          <p className="text-[11px] text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                            {edu.activities}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/about#education"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
          >
            <GraduationCap size={15} className="text-[var(--color-accent)]" />
            View Full Academic Profile
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      </section>

{/* ================================================================
          5. AWARDS & CERTIFICATIONS INFOGRAPHIC SECTION
          ================================================================ */}
      {displayAwards.length > 0 && (
        <section className="border-t border-[var(--color-border)] py-24 relative overflow-hidden ">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeader
              badge={headlines.home_awards_badge || 'Recognition & Credentials'}
              title={headlines.home_awards_title || 'Awards & Certifications'}
              description={headlines.home_awards_description || 'Professional recognitions, academic honors, and industry-validated certifications.'}
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayAwards.map((item, idx) => {
                const isCert = item.category === 'certification';
                const formattedDate = item.date
                  ? new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                  : null;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--color-accent-border)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] overflow-hidden"
                  >
                    {/* Top gradient accent line */}
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
                      aria-hidden="true"
                    />

                    {/* Corner marks */}
                    <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>
                    <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-60 transition-opacity select-none" aria-hidden="true">+</span>

                    <div>
                      {/* Header bar: category + index + featured indicator */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
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

                        {item.is_featured && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-accent)]">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[9px] font-mono uppercase tracking-wider">Featured</span>
                          </span>
                        )}
                      </div>

                      {/* Optional Badge image or stylized icon container */}
                      <div className="flex items-center gap-3.5 mb-3">
                        {item.badge_url ? (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-1 flex items-center justify-center shadow-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.badge_url} alt={item.title} className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div
                            className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border shadow-xs ${
                              isCert
                                ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                                : 'border-amber-500/20 bg-amber-500/10 text-amber-500 dark:text-amber-400'
                            }`}
                          >
                            {isCert ? <Shield size={18} /> : <Award size={18} />}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm text-[var(--color-foreground)] leading-snug line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Issuer & Date */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                          <span className="font-medium text-[var(--color-foreground)] truncate">
                            {item.issuer}
                          </span>
                          {item.issuer_url && (
                            <a
                              href={item.issuer_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--color-muted)] hover:text-[var(--color-accent)] shrink-0 transition-colors"
                              title="Visit Issuer"
                            >
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>

                        {formattedDate && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-muted)]">
                            <CalendarDays size={11} />
                            <span>{formattedDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs leading-relaxed text-[var(--color-muted)] line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom verification / badge line */}
                    {item.issuer_url && (
                      <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
                          Credential Verified
                        </span>
                        <a
                          href={item.issuer_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--color-accent)] hover:underline"
                        >
                          View Source
                          <ArrowRight size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/about#awards"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors shadow-xs"
              >
                <Award size={15} className="text-[var(--color-accent)]" />
                View All Honors &amp; Certifications
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

{/* ================================================================
          6. FEATURED PROJECTS SHOWCASE
          ================================================================ */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={headlines.home_projects_badge}
            title={headlines.home_projects_title}
            description={headlines.home_projects_description}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <FeaturedProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
            >
              Explore Full Project Portfolio
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

{/* ================================================================
          7. LATEST WRITING & TECHNICAL ARTICLES
          ================================================================ */}
      <section className="border-t border-[var(--color-border)] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={headlines.home_articles_badge}
          title={headlines.home_articles_title}
          description={headlines.home_articles_description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article) => (
              <FeaturedArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-xs text-[var(--color-muted)] font-mono">
              No technical articles published yet.
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:underline"
          >
            {headlines.home_articles_button_text || 'Visit Technical Article Platform'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      </section>

{/* ================================================================
          8. FEATURED RESEARCH SHOWCASE
          ================================================================ */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={headlines.home_research_badge}
          title={headlines.home_research_title}
          description={headlines.home_research_description}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {research.map((item) => (
            <FeaturedResearchCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:underline"
          >
            Browse All Research Manuscripts & ArXiv Preprints
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      </section>

      {/* ================================================================
          9. CONTACT & COLLABORATION BANNER
          ================================================================ */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)] mb-6">
            <Mail size={22} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Interested in Research Collaboration or Strategic Systems Engineering?
          </h2>

          <p className="mt-4 text-base text-[var(--color-muted)] max-w-xl mx-auto">
            I am always eager to discuss deep learning research, distributed systems architecture,
            guest lectures, or technical writing assignments.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-7 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--color-accent-hover)] transition-all"
            >
              Initiate Discussion
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-7 py-3 text-sm font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
            >
              Read Full Biography
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
