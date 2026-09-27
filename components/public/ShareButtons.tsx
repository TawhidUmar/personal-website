'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? (url ?? window.location.href) : (url ?? '');

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-[var(--color-muted)] flex items-center gap-1">
        <Share2 size={13} />
        Share:
      </span>

      <button
        onClick={handleShareTwitter}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors"
      >
        X / Twitter
      </button>

      <button
        onClick={handleShareLinkedIn}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] hover:text-[var(--color-accent)] transition-colors"
      >
        LinkedIn
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
      >
        {copied ? <Check size={12} className="text-green-500" /> : <LinkIcon size={12} />}
        <span>{copied ? 'Link Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
