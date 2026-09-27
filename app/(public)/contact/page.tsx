import type { Metadata } from 'next';
import { SectionHeader } from '@/components/public/SectionHeader';
import { ContactForm } from '@/components/public/ContactForm';
import { getPublicContactDetails } from '@/lib/services/public-data.service';
import { Mail, MapPin, ShieldCheck, Clock, Phone, Sparkles, Activity } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const { profile, headlines } = await getPublicContactDetails();
  const name = profile.name || 'Alex Vance';
  return {
    title: `${headlines.contact_title} | ${name}`,
    description: headlines.contact_description,
    openGraph: {
      title: `${headlines.contact_title} | ${name}`,
      description: headlines.contact_description,
      images: [{ url: `/api/og?title=${encodeURIComponent(headlines.contact_title)}&category=Inquiries` }],
    },
  };
}

export default async function ContactPage() {
  const { profile, headlines, email, availabilityStatus } = await getPublicContactDetails();

  return (
    <div className="relative overflow-hidden pt-24 pb-24">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <SectionHeader
          badge={headlines.contact_badge}
          title={headlines.contact_title}
          description={headlines.contact_description}
          align="center"
        />

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Channels & Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Coordinates Card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
              {/* Corner crosshairs */}
              <span className="pointer-events-none absolute -top-1.5 -left-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-60 select-none" aria-hidden="true">+</span>
              <span className="pointer-events-none absolute -top-1.5 -right-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-60 select-none" aria-hidden="true">+</span>
              <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-60 select-none" aria-hidden="true">+</span>
              <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 font-mono text-[10px] font-bold text-[var(--color-accent)] opacity-60 select-none" aria-hidden="true">+</span>

              <h3 className="text-xl font-bold text-[var(--color-foreground)] flex items-center justify-between">
                <span>{headlines.contact_direct_title}</span>
                <span className="text-[10px] font-mono font-normal uppercase text-[var(--color-accent)] tracking-wider px-2 py-0.5 rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)]">
                  Live
                </span>
              </h3>

              <div className="space-y-4 text-sm">
                {/* Electronic Mail */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
                      {headlines.contact_email_label}
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="block font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors truncate"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Physical Location */}
                {profile.location && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
                        {headlines.contact_location_label}
                      </span>
                      <p className="font-semibold text-[var(--color-foreground)]">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Telephone / Voice (if configured) */}
                {profile.phone && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                      <Phone size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
                        Voice & Direct Line
                      </span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="block font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors truncate"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Typical Response Time */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                    <Clock size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
                      {headlines.contact_response_time_label}
                    </span>
                    <p className="font-semibold text-[var(--color-foreground)]">
                      {headlines.contact_response_time}
                    </p>
                  </div>
                </div>

                {/* Availability Status */}
                {availabilityStatus && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                      <Activity size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-muted)]">
                        Current Status
                      </span>
                      <p className="font-medium text-xs text-[var(--color-foreground)] flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        {availabilityStatus}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Security & Verification Note */}
              <div className="pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-start gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/80 p-3.5 text-xs text-[var(--color-muted)]">
                  <ShieldCheck size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <p>{headlines.contact_security_note}</p>
                </div>
              </div>
            </div>

            {/* Social Links Ribbon */}
            {profile.social_links && profile.social_links.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  {headlines.contact_social_title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.social_links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm
              title={headlines.contact_form_title}
              description={headlines.contact_form_description}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
