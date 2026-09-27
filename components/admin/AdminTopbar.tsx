import Link from 'next/link';
import { ExternalLink, Bell, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { logoutAction } from '@/actions/auth.actions';
import type { SessionUser } from '@/types/session.types';

interface AdminTopbarProps {
  user: SessionUser;
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6">
      {/* Left: breadcrumb placeholder */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={12} />
          View site
        </Link>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button
          className="relative flex items-center justify-center rounded-md p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-2.5 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-xs font-medium text-[var(--color-foreground)] sm:block">
            {user.name}
          </span>
        </div>

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
