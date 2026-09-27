import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isLeft = align === 'left';

  return (
    <div className={`mb-12 ${isLeft ? 'text-left' : 'text-center'} ${className}`}>
      {badge && (
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--color-accent)] mb-3 ${
            isLeft ? '' : 'mx-auto'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          {badge}
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base text-[var(--color-muted)] sm:text-lg mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
