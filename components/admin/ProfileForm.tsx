'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileAction } from '@/actions/profile.actions';
import {
  User,
  MapPin,
  Globe,
  Phone,
  FileText,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { DbProfile } from '@/types/db.types';

interface ProfileFormProps {
  initialProfile: DbProfile | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialProfile?.name ?? '');
  const [headline, setHeadline] = useState(initialProfile?.headline ?? '');
  const [location, setLocation] = useState(initialProfile?.location ?? '');
  const [website, setWebsite] = useState(initialProfile?.website ?? '');
  const [phone, setPhone] = useState(initialProfile?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? '');
  const [resumeUrl, setResumeUrl] = useState(initialProfile?.resume_url ?? '');
  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [bioExtended, setBioExtended] = useState(initialProfile?.bio_extended ?? '');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('headline', headline);
    formData.append('location', location);
    formData.append('website', website);
    formData.append('phone', phone);
    formData.append('avatarUrl', avatarUrl);
    formData.append('resumeUrl', resumeUrl);
    formData.append('bio', bio);
    formData.append('bioExtended', bioExtended);

    startTransition(async () => {
      const res = await updateProfileAction({ status: 'idle' }, formData);
      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        router.refresh();
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {statusMsg && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-xs font-medium ${
            statusMsg.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-600'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Core Identity Details */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6 shadow-sm">
        <h2 className="text-base font-bold text-[var(--color-foreground)] flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <User size={18} className="text-[var(--color-accent)]" />
          Professional Identity
        </h2>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)] flex items-center gap-1">
                <User size={13} className="text-[var(--color-muted)]" />
                Full Name (Displayed across portfolio and about card)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)]">
                Professional Headline / Title
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. AI Researcher & Distributed Systems Architect"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)] flex items-center gap-1">
                <MapPin size={13} className="text-[var(--color-muted)]" />
                Physical Location / Badge (e.g. Cambridge, MA)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cambridge, MA"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)] flex items-center gap-1">
                <Globe size={13} className="text-[var(--color-muted)]" />
                Primary Website / Portfolio
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourname.dev"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)] flex items-center gap-1">
                <Phone size={13} className="text-[var(--color-muted)]" />
                Contact Phone / Coordinates
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)] flex items-center gap-1">
                <ImageIcon size={13} className="text-[var(--color-muted)]" />
                Avatar / Headshot URL
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or /avatar.png"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)] flex items-center gap-1">
                <FileText size={13} className="text-[var(--color-muted)]" />
                Curriculum Vitae (PDF URL)
              </label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="/cv.pdf or https://drive.google.com/..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Narrative / Biographies */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6 shadow-sm">
        <h2 className="text-base font-bold text-[var(--color-foreground)] border-b border-[var(--color-border)] pb-3">
          Biographical Narrative
        </h2>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--color-foreground)]">
              Short Biography (Hero & Homepage Summary)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Graduate AI researcher investigating state-space models and efficient transformer architectures..."
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[var(--color-foreground)]">
              Extended Editorial Biography (About Page Detailed Story)
            </label>
            <textarea
              rows={8}
              value={bioExtended}
              onChange={(e) => setBioExtended(e.target.value)}
              placeholder="My academic journey began in computational physics before pivoting toward modern foundation models. Over the past five years..."
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y font-serif leading-relaxed"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save Profile Updates
        </button>
      </div>
    </form>
  );
}
