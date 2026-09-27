import type { Metadata } from 'next';
import { getPublicEducation, getPublicHeadlines } from '@/lib/services/public-data.service';
import { SectionHeader } from '@/components/public/SectionHeader';
import { EducationCard } from '@/components/public/EducationCard';
import { GraduationCap, Award, BookOpen, Library, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Education & Academic Profile | Alex Vance',
  description:
    'Academic credentials, graduate degrees, thesis research, honors, and coursework in Computer Science and Artificial Intelligence.',
  openGraph: {
    title: 'Education & Academic Profile | Alex Vance',
    description: 'Degrees, fellowships, and graduate research coursework.',
    images: [{ url: '/api/og?title=Academic+Credentials&category=Education+%C2%B7+Fellowships' }],
  },
};

const graduateCoursework = [
  { code: 'CS 281A', name: 'Statistical Learning Theory', grade: 'A+' },
  { code: 'CS 282M', name: 'Deep Generative Models & Diffusion', grade: 'A' },
  { code: 'CS 267', name: 'Applications of Parallel Computers & CUDA', grade: 'A+' },
  { code: 'CS 294', name: 'Mechanistic Interpretability of Transformers', grade: 'A' },
  { code: 'MATH 228', name: 'Stochastic Calculus & Differential Equations', grade: 'A' },
  { code: 'CS 262A', name: 'Advanced Distributed Operating Systems', grade: 'A+' },
];

const academicHonors = [
  {
    title: 'Outstanding Graduate AI Research Fellowship',
    organization: 'National Computing Consortium',
    year: '2023',
    description: 'Awarded to top 1% of graduate researchers pursuing hardware-efficient foundation model architectures.',
  },
  {
    title: 'Magna Cum Laude & High Departmental Honors',
    organization: 'University of California, Berkeley',
    year: '2021',
    description: 'Recognized for cumulative GPA exceeding 3.90 across Computer Science and Applied Mathematics curricula.',
  },
  {
    title: 'Undergraduate Research Excellence Citation',
    organization: 'EECS Honors Society',
    year: '2020',
    description: 'Commended for pioneering distributed graph algorithms on clustered GPU topologies.',
  },
];

export default async function EducationPage() {
  const [education, headlines] = await Promise.all([
    getPublicEducation(),
    getPublicHeadlines(),
  ]);

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <SectionHeader
          badge={headlines.education_badge}
          title={headlines.education_title}
          description={headlines.education_description}
          align="center"
        />

        {/* Education Timeline / Cards */}
        <div className="space-y-8">
          {education.map((item) => (
            <EducationCard key={item.id} item={item} />
          ))}
        </div>

        {/* Graduate Coursework Grid */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-foreground)]">
                Key Graduate & Advanced Coursework
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Selected theoretical mathematics and machine learning doctoral-level curricula
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {graduateCoursework.map((course) => (
              <div
                key={course.code}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3.5"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[var(--color-accent)]">
                    {course.code}
                  </span>
                  <p className="text-xs font-medium text-[var(--color-foreground)] mt-0.5">
                    {course.name}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                  {course.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Honors & Fellowships */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-foreground)]">
                Academic Honors & Fellowships
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Recognitions of academic merit, research quality, and departmental leadership
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {academicHonors.map((honor) => (
              <div
                key={honor.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 transition-colors hover:border-[var(--color-accent-border)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className="text-sm font-bold text-[var(--color-foreground)]">
                    {honor.title}
                  </h4>
                  <span className="font-mono text-xs text-[var(--color-accent)]">
                    {honor.year}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--color-muted)] mt-0.5">
                  {honor.organization}
                </p>
                <p className="text-xs leading-relaxed text-[var(--color-foreground-muted)] mt-2">
                  {honor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
