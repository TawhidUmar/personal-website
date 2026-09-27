'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { searchPublicContentAction, SearchResultItem } from '@/actions/search.actions';
import {
  Search,
  BookOpen,
  FlaskConical,
  Briefcase,
  Compass,
  ArrowRight,
  X,
  Loader2,
  CornerDownLeft,
} from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle Search Input Change
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }

    startTransition(async () => {
      const res = await searchPublicContentAction(val);
      setResults(res);
      setSelectedIndex(0);
    });
  };

  const handleSelect = useCallback((item: SearchResultItem) => {
    setIsOpen(false);
    router.push(item.url);
  }, [router]);

  // Arrow key navigation
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  const getItemIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'article':
        return <BookOpen size={15} className="text-amber-500" />;
      case 'research':
        return <FlaskConical size={15} className="text-indigo-500" />;
      case 'project':
        return <Briefcase size={15} className="text-blue-500" />;
      case 'page':
      default:
        return <Compass size={15} className="text-[var(--color-muted)]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Global Command Palette"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleListKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[var(--color-border)] px-4 py-3.5">
          <Search size={18} className="text-[var(--color-muted)] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Type a command, paper title, or topic to search..."
            className="w-full bg-transparent text-sm text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none"
          />
          {isPending ? (
            <Loader2 size={16} className="animate-spin text-[var(--color-accent)] shrink-0 ml-2" />
          ) : query ? (
            <button
              onClick={() => handleQueryChange('')}
              className="p-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)] shrink-0 ml-2"
            >
              <X size={15} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-muted)]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[var(--color-border)]/50">
          {results.map((item, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                  isSelected
                    ? 'bg-[var(--color-surface-raised)] text-[var(--color-foreground)]'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-raised)]/50 hover:text-[var(--color-foreground)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] shrink-0">
                    {getItemIcon(item.type)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-foreground)] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted)] truncate">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)] uppercase">
                      {item.badge}
                    </span>
                  )}
                  {isSelected && (
                    <CornerDownLeft size={13} className="text-[var(--color-accent)] hidden sm:block" />
                  )}
                </div>
              </button>
            );
          })}

          {query.trim() && results.length === 0 && !isPending && (
            <div className="p-8 text-center text-xs text-[var(--color-muted)]">
              No matching articles, manuscripts, or projects found for &quot;{query}&quot;.
            </div>
          )}

          {!query.trim() && (
            <div className="p-6 text-center text-xs text-[var(--color-muted)] space-y-2">
              <p className="font-medium text-[var(--color-foreground)]">Quick Navigation Suggestions</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  { label: 'Research Papers', url: '/research' },
                  { label: 'Technical Blog', url: '/articles' },
                  { label: 'Engineering Projects', url: '/projects' },
                  { label: 'Biography', url: '/about' },
                  { label: 'Direct Contact', url: '/contact' },
                ].map((item) => (
                  <button
                    key={item.url}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(item.url);
                    }}
                    className="px-3 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-xs text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 flex items-center justify-between text-[11px] text-[var(--color-muted)] font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px]">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px]">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>
            <kbd className="px-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px]">
              ESC
            </kbd>{' '}
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
