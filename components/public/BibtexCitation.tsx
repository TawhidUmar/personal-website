'use client';

import { useState } from 'react';
import { Copy, Check, Quote } from 'lucide-react';

interface BibtexCitationProps {
  title: string;
  author: string;
  year?: number | string;
  journalOrConference?: string;
  doi?: string | null;
  url?: string | null;
}

export function BibtexCitation({
  title,
  author,
  year = new Date().getFullYear(),
  journalOrConference = 'arXiv preprint',
  doi,
  url,
}: BibtexCitationProps) {
  const [copied, setCopied] = useState(false);

  const cleanKey = author.split(' ')[0].toLowerCase() + year + title.split(' ')[0].toLowerCase();
  const bibtex = `@article{${cleanKey},
  title     = {${title}},
  author    = {${author}},
  journal   = {${journalOrConference}},
  year      = {${year}}${doi ? `,\n  doi       = {${doi}}` : ''}${url ? `,\n  url       = {${url}}` : ''}
}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--color-foreground)]">
          <Quote size={14} className="text-[var(--color-accent)]" />
          BibTeX Citation
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy Citation'}</span>
        </button>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-xs text-[var(--color-foreground)] bg-[var(--color-background)]/80 leading-relaxed">
        <pre>
          <code>{bibtex}</code>
        </pre>
      </div>
    </div>
  );
}
