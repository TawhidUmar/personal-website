'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserAction,
  toggleUserActiveAction,
  deleteUserAction,
} from '@/actions/user.actions';
import {
  UserPlus,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  Mail,
  User,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { DbUserWithRole, DbRole } from '@/types/db.types';

interface UsersManagerProps {
  initialUsers: DbUserWithRole[];
  roles: DbRole[];
  currentAdminId: number;
}

export function UsersManager({ initialUsers, roles, currentAdminId }: UsersManagerProps) {
  const router = useRouter();
  const [users] = useState<DbUserWithRole[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(roles[0] ? String(roles[0].id) : '2');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('roleId', roleId);

    startTransition(async () => {
      const res = await createUserAction({ status: 'idle' }, formData);
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

  const handleToggleActive = (user: DbUserWithRole) => {
    if (user.id === currentAdminId) {
      alert('You cannot modify your own administrative status.');
      return;
    }
    startTransition(async () => {
      const res = await toggleUserActiveAction(user.id, user.is_active);
      if (res.status === 'error') {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (user: DbUserWithRole) => {
    if (user.id === currentAdminId) {
      alert('You cannot delete your own administrative account.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete user "${user.name}"?`)) {
      startTransition(async () => {
        const res = await deleteUserAction(user.id);
        if (res.status === 'error') {
          alert(res.error);
        } else {
          router.refresh();
        }
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Users & Access Governance
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Total {users.length} registered administrators, contributors, and research collaborators.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setEmail('');
            setPassword('');
            setRoleId(roles[0] ? String(roles[0].id) : '2');
            setStatusMsg(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <UserPlus size={16} />
          Create New User
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Last Login</th>
                <th className="px-4 py-3.5">Created At</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-foreground)]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--color-surface-raised)] transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold text-xs uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[var(--color-foreground)] flex items-center gap-1.5">
                          {u.name}
                          {u.id === currentAdminId && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                              YOU
                            </span>
                          )}
                        </p>
                        <p className="font-mono text-[11px] text-[var(--color-muted)]">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-foreground)] border border-[var(--color-border)] capitalize">
                      {u.role_name}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        u.is_active
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}
                    >
                      {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-[var(--color-muted)]">
                    {u.last_login_at
                      ? new Date(u.last_login_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Never'}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-[var(--color-muted)]">
                    {new Date(u.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    {u.id !== currentAdminId && (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleActive(u)}
                          disabled={isPending}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                            u.is_active
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                              : 'border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20'
                          }`}
                        >
                          {u.is_active ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleDelete(u)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h2 className="text-base font-bold text-[var(--color-foreground)]">
                Create System User
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

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collaborator@example.com"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Password (min. 8 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Assigned Role *
                </label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.description ?? ''}
                    </option>
                  ))}
                </select>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
