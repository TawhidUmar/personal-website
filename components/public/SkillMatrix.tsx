'use client';

import { useState } from 'react';
import { Search, Layers, Sparkles } from 'lucide-react';
import type { SkillCategoryWithSkills } from '@/lib/repositories/skills.repository';
import { TechSkillCard } from '@/components/public/TechSkillCard';

interface SkillMatrixProps {
  categories: SkillCategoryWithSkills[];
}

export function SkillMatrix({ categories }: SkillMatrixProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories
    .filter((cat) => (activeCategory === 'all' ? true : cat.slug === activeCategory))
    .map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter((cat) => cat.skills.length > 0);

  const totalMatchingSkills = filteredCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="w-full space-y-8">
      {/* Controls: Search & Category tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
        {/* Category selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)]'
            }`}
          >
            All Disciplines
          </button>
          {categories.map((cat) => {
            const count = cat.skills.length;
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-white shadow-sm'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-md px-1.5 py-0.2 font-mono text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-muted)]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools, architectures..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] pl-9 pr-4 py-2 text-xs text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Categories & Skills grid */}
      <div className="space-y-12">
        {filteredCategories.map((category, catIdx) => (
          <div
            key={category.id}
            className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm space-y-6 overflow-hidden"
          >
            {/* Top gradient line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }}
              aria-hidden="true"
            />

            {/* Category header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--color-border)]/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] shadow-xs">
                  <Layers size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                      DOMAIN // {String(catIdx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--color-muted)]">•</span>
                    <span className="font-mono text-[10px] text-[var(--color-muted)]">
                      {category.skills.length} Capabilities
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-foreground)] leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>

              {category.description && (
                <p className="text-xs text-[var(--color-muted)] max-w-md sm:text-right leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            {/* Skills Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.skills.map((skill) => (
                <TechSkillCard key={skill.id} skill={skill} showDescription={true} />
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <p className="text-sm font-medium text-[var(--color-muted)]">
              No technical capabilities found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-3 text-xs font-semibold text-[var(--color-accent)] hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
