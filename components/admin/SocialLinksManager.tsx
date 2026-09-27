'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveSocialLinkAction, deleteSocialLinkAction } from '@/actions/profile.actions';
import {
  Plus,
  Share2,
  ExternalLink,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { DbSocialLink } from '@/types/db.types';

interface SocialLinksManagerProps {
  initialLinks: DbSocialLink[];
}

export function SocialLinksManager({ initialLinks }: SocialLinksManagerProps) {
  const router = useRouter();
  const [links] = useState<DbSocialLink[]>(initialLinks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('platform', platform);
    formData.append('url', url);
    formData.append('displayOrder', displayOrder);

    startTransition(async () => {
      const res = await saveSocialLinkAction({ status: 'idle' }, formData);
      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        setTimeout(() => {
          setIsModalOpen(false);
          router.refresh();
        }, 800);
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  const handleDelete = (id: number, plat: string) => {
    if (window.confirm(`Delete ${plat} link?`)) {
      startTransition(async () => {
        await deleteSocialLinkAction(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Social Coordinates & Links
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Configure external identity links shown in Navbar, Hero, and Footer.
          </p>
        </div>

        <button
          onClick={() => {
            setPlatform('');
            setUrl('');
            setDisplayOrder('0');
            setStatusMsg(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Social Link
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-border)] transition-all"
          >
            <div className="space-y-1 min-w-0 pr-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--color-foreground)] capitalize">
                  {link.platform}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface-raised)] text-[var(--color-muted)] border border-[var(--color-border)]">
                  Order #{link.display_order}
                </span>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline truncate font-mono"
              >
                <span className="truncate">{link.url}</span>
                <ExternalLink size={11} className="shrink-0" />
              </a>
            </div>

            <button
              onClick={() => handleDelete(link.id, link.platform)}
              disabled={isPending}
              className="p-1.5 rounded-lg text-red-500/70 hover:text-red-600 hover:bg-red-500/10 shrink-0 transition-colors"
              title="Delete Link"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {links.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            No social links registered. Click &quot;Add Social Link&quot; to configure your GitHub, Scholar, Twitter/X, and LinkedIn URLs.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h2 className="text-base font-bold text-[var(--color-foreground)]">
                Add Social Link
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
              >
                <X size={16} />
              </button>
            </div>

            {statusMsg && (
              <div
                className={`flex items-center gap-2 rounded-xl border p-3 text-xs ${
                  statusMsg.type === 'success'
                    ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-600'
                }`}
              >
                {statusMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. github, scholar, twitter, linkedin"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Target URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50"
                >
                  {isPending && <Loader2 size={13} className="animate-spin" />}
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
