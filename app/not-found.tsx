import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

      <p className="mb-2 font-mono text-8xl font-bold text-[var(--color-accent)] opacity-20">404</p>
      <h1 className="mb-3 text-2xl font-semibold text-[var(--color-foreground)]">
        Page not found
      </h1>
      <p className="mb-8 max-w-sm text-sm text-[var(--color-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Return home
      </Link>
    </div>
  );
}
