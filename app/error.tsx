'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" aria-hidden="true" />

      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 mb-6">
        <AlertTriangle size={32} />
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-[var(--color-foreground)]">Something went wrong</h1>
      <p className="mb-8 max-w-sm text-sm text-[var(--color-muted)]">
        An unexpected error occurred. Please try refreshing or returning home.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-raised)]"
        >
          <RefreshCw size={14} />
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
