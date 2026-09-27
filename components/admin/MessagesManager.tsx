'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateMessageStatusAction,
  deleteMessageAction,
} from '@/actions/moderation.actions';
import {
  Mail,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { DbContactMessage, MessageStatus } from '@/types/db.types';

interface MessagesManagerProps {
  initialMessages: DbContactMessage[];
  total: number;
}

export function MessagesManager({ initialMessages, total }: MessagesManagerProps) {
  const router = useRouter();
  const [messages] = useState<DbContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<DbContactMessage | null>(
    initialMessages[0] ?? null
  );

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: number, status: MessageStatus) => {
    startTransition(async () => {
      const res = await updateMessageStatusAction(id, status);
      if (res.status === 'success') {
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
        router.refresh();
      }
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      startTransition(async () => {
        const res = await deleteMessageAction(id);
        if (res.status === 'success') {
          if (selectedMessage?.id === id) {
            setSelectedMessage(null);
          }
          router.refresh();
        }
      });
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const statusBadge: Record<MessageStatus, { bg: string; text: string; border: string }> = {
    unread: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
    read: { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-500/20' },
    replied: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
    archived: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Inquiries & Contact Messages
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Total {total} messages received from collaborators, recruiters, and conference attendees.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'unread', 'read', 'replied', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all ${
                filter === s
                  ? 'bg-[var(--color-accent)] text-white font-bold'
                  : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Message List Sidebar */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] text-xs font-mono text-[var(--color-muted)]">
            Messages ({filteredMessages.length})
          </div>

          <div className="divide-y divide-[var(--color-border)] overflow-y-auto max-h-[600px] flex-1">
            {filteredMessages.map((m) => {
              const badge = statusBadge[m.status] ?? statusBadge.unread;
              const isSelected = selectedMessage?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMessage(m)}
                  className={`w-full text-left p-4 transition-colors flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[var(--color-surface-raised)] border-l-4 border-l-[var(--color-accent)]'
                      : 'hover:bg-[var(--color-surface-raised)]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--color-foreground)] truncate">
                      {m.name}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-[var(--color-foreground)] truncate">
                    {m.subject}
                  </p>

                  <p className="text-[11px] text-[var(--color-muted)] line-clamp-1">
                    {m.message}
                  </p>

                  <span className="text-[10px] font-mono text-[var(--color-muted)] mt-1">
                    {new Date(m.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </button>
              );
            })}

            {filteredMessages.length === 0 && (
              <div className="p-8 text-center text-xs text-[var(--color-muted)]">
                No messages found in this category.
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-[var(--color-border)] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-foreground)]">
                      {selectedMessage.name}
                    </span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-[var(--color-muted)]">
                    <Calendar size={12} />
                    <span>
                      {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start shrink-0">
                  {selectedMessage.status === 'unread' ? (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      disabled={isPending}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-xs text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
                      title="Mark Read"
                    >
                      <MailOpen size={13} />
                      Mark Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'unread')}
                      disabled={isPending}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-xs text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors"
                      title="Mark Unread"
                    >
                      <Mail size={13} />
                      Mark Unread
                    </button>
                  )}

                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    disabled={isPending}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-green-500/20 bg-green-500/10 text-xs text-green-600 hover:bg-green-500/20 transition-colors"
                    title="Mark Replied"
                  >
                    <Reply size={13} />
                    Mark Replied
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-600 hover:bg-red-500/20 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="text-xs text-[var(--color-foreground)] leading-relaxed whitespace-pre-wrap rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
                {selectedMessage.message}
              </div>

              {/* Reply Coordinate CTA */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] font-mono text-[var(--color-muted)]">
                  IP: {selectedMessage.ip_address ?? '127.0.0.1'}
                </div>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all"
                >
                  <Reply size={14} />
                  Reply via Email Client
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center text-xs text-[var(--color-muted)]">
              <Mail size={32} className="mb-2 opacity-40" />
              Select a message from the list to view full communication details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
