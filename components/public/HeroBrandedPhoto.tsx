'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Terminal, Cpu, Award, ShieldCheck, Activity } from 'lucide-react';

interface HeroBrandedPhotoProps {
  avatarUrl?: string | null;
  name: string;
  headline?: string | null;
  location?: string | null;
  cardBadge?: string | null;
}

export function HeroBrandedPhoto({
  avatarUrl,
  name,
  headline,
  location,
  cardBadge,
}: HeroBrandedPhotoProps) {
  const monogram = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AI';

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[430px] select-none">
      {/* ── Ambient Radial Glow Background ───────────────────────────────── */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-full opacity-40 blur-3xl transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Outer Geometric Frame with CAD Crosshairs ──────────────────────── */}
      <div className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3 sm:p-3.5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-[var(--color-accent-border)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.2)]">
        {/* Technical Corner Crosshairs */}
        <span
          className="absolute -top-1.5 -left-1.5 font-mono text-[11px] font-bold text-[var(--color-accent)] opacity-70 select-none"
          aria-hidden="true"
        >
          +
        </span>
        <span
          className="absolute -top-1.5 -right-1.5 font-mono text-[11px] font-bold text-[var(--color-accent)] opacity-70 select-none"
          aria-hidden="true"
        >
          +
        </span>
        <span
          className="absolute -bottom-1.5 -left-1.5 font-mono text-[11px] font-bold text-[var(--color-accent)] opacity-70 select-none"
          aria-hidden="true"
        >
          +
        </span>
        <span
          className="absolute -bottom-1.5 -right-1.5 font-mono text-[11px] font-bold text-[var(--color-accent)] opacity-70 select-none"
          aria-hidden="true"
        >
          +
        </span>

        {/* Top Telemetry Header */}
        <div className="mb-2.5 flex items-center justify-between px-1.5 text-[10px] font-mono text-[var(--color-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            SYS.ID: ARCH-01 // RESEARCH GRADE
          </span>
          <span className="uppercase tracking-widest text-[9px] opacity-80 text-[var(--color-accent)] font-semibold">
            VERIFIED CREDENTIALS
          </span>
        </div>

        {/* ── Photo Canvas Anchor Container ─────────────────────────────────── */}
        <div className="relative">
          {/* Photo Canvas Container */}
          <div className="group relative aspect-[3.9/5] w-full overflow-hidden rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-inner">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                fill
                priority
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 400px, 430px"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--color-surface)] p-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-4xl font-extrabold font-mono text-[var(--color-accent)] border border-[var(--color-accent-border)] mb-4">
                  {monogram}
                </div>
                <p className="font-semibold text-sm text-[var(--color-foreground)]">{name}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">{headline}</p>
              </div>
            )}

            {/* Smooth bottom cinematic gradient */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90"
              aria-hidden="true"
            />

            {/* ── Top-Left: Live Presence Telemetry Pill ───────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute top-3 left-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-xl shadow-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] font-medium text-white flex items-center gap-1.5">
                <MapPin size={11} className="text-[var(--color-accent)]" />
                {location || 'Online'}
              </span>
            </motion.div>

            {/* ── Top-Right: Spec / Role Satellite Chip ─────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 backdrop-blur-xl text-white shadow-lg text-[10px] font-mono"
            >
              <Sparkles size={12} className="text-[var(--color-accent)]" />
              <span className="font-semibold uppercase tracking-wider">Verified</span>
            </motion.div>
          </div>

          {/* ── Floating Glassmorphic Identity Card ───────────────────────── */}
          {/* Light UI: Crisp light background with dark forecolor */}
          {/* Dark UI: Rich indigo background with light forecolor */}
          {/* Positioned relatively to person image: -30% left and -50% bottom */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="hero-identity-card absolute z-30 bottom-0 left-0 w-[92%] sm:w-[88%] lg:w-[94%] max-w-[340px] sm:max-w-[370px] -translate-x-[10%] sm:-translate-x-[20%] lg:-translate-x-[30%] translate-y-[35%] sm:translate-y-[45%] lg:translate-y-[50%] rounded-2xl border p-4 sm:p-4.5 backdrop-blur-2xl ring-1 ring-zinc-950/5 dark:ring-indigo-400/25 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Specular Top Highlight */}
            <div
              className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-indigo-300/50 to-transparent"
              aria-hidden="true"
            />

            {/* Header row inside card */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="card-badge inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-wider">
                <Activity size={10} className="animate-pulse" />
                {cardBadge || 'Principal // AI & Systems'}
              </div>
              <div className="card-icon flex h-6 w-6 items-center justify-center rounded-lg border shadow-sm">
                <Terminal size={12} />
              </div>
            </div>

            {/* Person Name */}
            <h2 className="card-name text-base sm:text-lg font-extrabold tracking-tight truncate">
              {name}
            </h2>

            {/* Headline */}
            <p className="card-headline text-xs font-medium line-clamp-1 mt-0.5">
              {headline || 'AI/ML Researcher & Systems Architect'}
            </p>

            {/* Micro Tech Tags & Telemetry */}
            <div className="card-divider mt-3 flex items-center justify-between pt-2.5 border-t text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="card-chip rounded-md border px-1.5 py-0.5 font-semibold">
                  PyTorch
                </span>
                <span className="card-chip rounded-md border px-1.5 py-0.5 font-semibold">
                  Next.js
                </span>
                <span className="card-chip-accent rounded-md border px-1.5 py-0.5 font-bold">
                  Triton
                </span>
              </div>
              <span className="card-telemetry flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
