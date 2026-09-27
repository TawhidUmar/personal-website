'use client';

import { useState } from 'react';
import {
  ScrollText,
  Search,
  User,
  Clock,
  Shield,
  ChevronDown,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import type { DbAuditLog } from '@/types/db.types';

interface AuditLogsViewerProps {
  initialLogs: (DbAuditLog & { user_name?: string })[];
  total: number;
}

export function AuditLogsViewer({ initialLogs, total }: AuditLogsViewerProps) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredLogs = initialLogs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      (log.entity_type && log.entity_type.toLowerCase().includes(q)) ||
      (log.user_name && log.user_name.toLowerCase().includes(q)) ||
      (log.ip_address && log.ip_address.includes(q))
    );
  });

  const getActionColor = (action: string) => {
    if (action.includes('created') || action.includes('uploaded')) {
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
    if (action.includes('updated') || action.includes('saved')) {
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
    if (action.includes('deleted') || action.includes('rejected') || action.includes('spam')) {
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
    return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Security & Audit Activity Logs
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Immutable chronicle of administrative actions, data mutations, and access records ({total} total entries).
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Filter action, entity, or admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 py-2 text-xs text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Entity</th>
                <th className="px-4 py-3.5">Network Origin</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-foreground)] font-mono">
              {filteredLogs.map((log) => {
                const isExpanded = expandedId === log.id;
                const hasPayload = log.new_values || log.old_values;
                return (
                  <tr key={log.id} className="hover:bg-[var(--color-surface-raised)] transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-[11px] text-[var(--color-muted)]">
                      {new Date(log.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[var(--color-foreground)]">
                      {log.user_name ?? (log.user_id ? `User #${log.user_id}` : 'System')}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[var(--color-muted)]">
                      {log.entity_type ? `${log.entity_type} ${log.entity_id ? `(#${log.entity_id})` : ''}` : '—'}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-[11px] text-[var(--color-muted)]">
                      {log.ip_address ?? '127.0.0.1'}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {hasPayload ? (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-[var(--color-accent)] hover:underline"
                        >
                          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[var(--color-muted)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[var(--color-muted)]">
                    No audit records found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Inspection Drawer / Modal */}
      {expandedId !== null && (
        <div className="rounded-2xl border border-[var(--color-accent-border)] bg-[var(--color-surface-raised)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-foreground)] font-mono">
              <Terminal size={14} className="text-[var(--color-accent)]" />
              <span>Log Payload #{expandedId}</span>
            </div>
            <button
              onClick={() => setExpandedId(null)}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Close
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-black/80 text-green-400 font-mono text-[11px] overflow-x-auto">
            {JSON.stringify(
              {
                new_values: filteredLogs.find((l) => l.id === expandedId)?.new_values,
                old_values: filteredLogs.find((l) => l.id === expandedId)?.old_values,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
