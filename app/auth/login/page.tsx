'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { loginAction } from '@/actions/auth.actions';
import { Code2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ActionState } from '@/types/api.types';

const initialState: ActionState = { status: 'idle' };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, var(--color-accent-glow), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-md">
              <Image
                src="/icon.svg"
                alt="Logo"
                width={56}
                height={56}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-[var(--color-foreground)]">Admin Login</h1>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Sign in to access the dashboard
              </p>
            </div>
          </div>

          {/* Error banner */}
          {state.status === 'error' && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
            >
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-[var(--color-foreground)]"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-describedby={
                  state.status === 'error' && state.errors?.email ? 'email-error' : undefined
                }
                className={[
                  'w-full rounded-lg border bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-foreground)]',
                  'placeholder:text-[var(--color-muted)]',
                  'transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                  state.status === 'error' && state.errors?.email
                    ? 'border-red-500'
                    : 'border-[var(--color-border)]',
                ].join(' ')}
                placeholder="admin@example.com"
                disabled={isPending}
              />
              {state.status === 'error' && state.errors?.email && (
                <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-[var(--color-foreground)]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  aria-describedby={
                    state.status === 'error' && state.errors?.password
                      ? 'password-error'
                      : undefined
                  }
                  className={[
                    'w-full rounded-lg border bg-[var(--color-background)] px-3.5 py-2.5 pr-10 text-sm text-[var(--color-foreground)]',
                    'placeholder:text-[var(--color-muted)]',
                    'transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent',
                    state.status === 'error' && state.errors?.password
                      ? 'border-red-500'
                      : 'border-[var(--color-border)]',
                  ].join(' ')}
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {state.status === 'error' && state.errors?.password && (
                <p id="password-error" role="alert" className="mt-1 text-xs text-red-500">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
