'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitContactAction } from '@/actions/contact.actions';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ActionState } from '@/types/api.types';

const initialState: ActionState = { status: 'idle' };

interface ContactFormProps {
  title?: string;
  description?: string;
}

export function ContactForm({
  title = 'Send an Encrypted Message',
  description = 'Inquiries regarding research fellowships, distributed systems consulting, speaking, or writing.',
}: ContactFormProps = {}) {
  const [state, formAction, isPending] = useActionState(submitContactAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10 shadow-lg">
      <h3 className="text-2xl font-bold text-[var(--color-foreground)]">
        {title}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-[var(--color-muted)]">
        {description}
      </p>

      {/* Success banner */}
      {state.status === 'success' && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
        >
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <p>{state.message}</p>
        </div>
      )}

      {/* General error banner */}
      {state.status === 'error' && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p>{state.error}</p>
        </div>
      )}

      <form ref={formRef} action={formAction} className="mt-6 space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isPending}
              placeholder="Dr. Alan Turing"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 transition-colors"
            />
            {state.status === 'error' && state.errors?.name && (
              <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
              placeholder="alan@turing.ac.uk"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 transition-colors"
            />
            {state.status === 'error' && state.errors?.email && (
              <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
            Subject / Topic *
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            disabled={isPending}
            placeholder="Research Collaboration: Sparse State-Space Models"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 transition-colors"
          />
          {state.status === 'error' && state.errors?.subject && (
            <p className="mt-1 text-xs text-red-500">{state.errors.subject[0]}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
            Message Body *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={isPending}
            placeholder="Describe your research proposal, architecture inquiry, or project scope in detail..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-60 transition-colors resize-y"
          />
          {state.status === 'error' && state.errors?.message && (
            <p className="mt-1 text-xs text-red-500">{state.errors.message[0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-60 transition-all"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Transmitting Message...
            </>
          ) : (
            <>
              <Send size={16} />
              Transmit Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
