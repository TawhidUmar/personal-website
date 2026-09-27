'use client';

import { Shield, Key, Users, CheckCircle2 } from 'lucide-react';
import type { RoleWithPermissions } from '@/lib/repositories/roles.repository';

interface RolesListProps {
  roles: RoleWithPermissions[];
}

export function RolesList({ roles }: RolesListProps) {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          Roles & Permission Matrices
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Access control policies, operational boundaries, and system privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4 hover:border-[var(--color-accent-border)] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--color-foreground)] capitalize">
                    {role.name}
                  </h2>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {role.description ?? 'System access tier'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-foreground)]">
                <Users size={12} className="text-[var(--color-accent)]" />
                <span>{role.user_count} assigned</span>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1">
                <Key size={12} />
                Granted Capabilities
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {role.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)]"
                  >
                    <CheckCircle2 size={10} className="text-green-500" />
                    {perm}
                  </span>
                ))}
                {role.permissions.length === 0 && (
                  <span className="text-xs text-[var(--color-muted)] italic">
                    Full root permissions (Superadmin)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
