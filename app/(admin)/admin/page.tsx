import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getDashboardOverviewMetrics } from '@/lib/repositories/articles.repository';
import {
  FileText,
  Briefcase,
  FlaskConical,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Activity,
  Calendar,
  Eye,
  TrendingUp,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Admin Control',
};

function formatLogDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  let metrics = {
    articles: 3,
    projects: 3,
    research: 2,
    messages: 0,
    recentAuditLogs: [] as any[],
  };

  try {
    metrics = await getDashboardOverviewMetrics();
  } catch {
    // Graceful fallback to initial seed metrics
  }

  const statCards = [
    {
      label: 'Articles',
      value: metrics.articles,
      sub: 'Technical essays & tutorials',
      href: '/admin/articles',
      icon: FileText,
      color: 'var(--color-accent)',
    },
    {
      label: 'Published Projects',
      value: metrics.projects,
      sub: 'Portfolio architectures',
      href: '/projects',
      icon: Briefcase,
      color: 'var(--color-success)',
    },
    {
      label: 'Research Preprints',
      value: metrics.research,
      sub: 'Manuscripts & papers',
      href: '/research',
      icon: FlaskConical,
      color: '#f59e0b',
    },
    {
      label: 'Unread Messages',
      value: metrics.messages,
      sub: 'Contact inquiries',
      href: '/admin/messages',
      icon: MessageSquare,
      color: '#ec4899',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Logged in as <span className="font-semibold text-[var(--color-foreground)]">{user.name}</span> ({user.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all"
          >
            <Plus size={14} />
            Write New Article
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
          >
            <Eye size={14} />
            View Public Site
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all hover:border-[var(--color-accent-border)] hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  {card.label}
                </p>
                <p className="mt-2 font-mono text-3xl font-extrabold text-[var(--color-foreground)]">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">{card.sub}</p>
              </div>
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `color-mix(in srgb, ${card.color} 15%, transparent)`,
                  color: card.color,
                }}
              >
                <card.icon size={22} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Columns: Recent System Activity & Quick Nav */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Recent Activity Log */}
        <div className="lg:col-span-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-[var(--color-foreground)]">
              <Activity size={18} className="text-[var(--color-accent)]" />
              Recent System & Security Audit Logs
            </h2>
            <span className="font-mono text-[11px] text-[var(--color-muted)]">
              Live Event Stream
            </span>
          </div>

          {metrics.recentAuditLogs && metrics.recentAuditLogs.length > 0 ? (
            <div className="divide-y divide-[var(--color-border)]">
              {metrics.recentAuditLogs.map((log: any) => (
                <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-[var(--color-foreground)]">
                      {log.action}
                    </span>
                    {log.entity_type && (
                      <span className="ml-2 font-mono text-[11px] text-[var(--color-muted)]">
                        [{log.entity_type} #{log.entity_id ?? '0'}]
                      </span>
                    )}
                    {log.ip_address && (
                      <span className="ml-2 text-[10px] text-[var(--color-muted)]">
                        IP: {log.ip_address}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--color-muted)] whitespace-nowrap">
                    {formatLogDate(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[var(--color-muted)]">
              No recent audit log entries recorded.
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">
            Content Administration
          </h3>
          <div className="space-y-2 text-xs font-medium">
            <Link
              href="/admin/articles"
              className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 hover:border-[var(--color-accent-border)] transition-colors"
            >
              <span>Manage All Articles</span>
              <ArrowUpRight size={14} className="text-[var(--color-accent)]" />
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 hover:border-[var(--color-accent-border)] transition-colors"
            >
              <span>Manage Categories</span>
              <ArrowUpRight size={14} className="text-[var(--color-accent)]" />
            </Link>
            <Link
              href="/admin/tags"
              className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 hover:border-[var(--color-accent-border)] transition-colors"
            >
              <span>Manage Article Tags</span>
              <ArrowUpRight size={14} className="text-[var(--color-accent)]" />
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 hover:border-[var(--color-accent-border)] transition-colors"
            >
              <span>System & SEO Settings</span>
              <ArrowUpRight size={14} className="text-[var(--color-accent)]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
