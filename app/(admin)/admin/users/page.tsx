import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { findAllUsers } from '@/lib/repositories/users.repository';
import { getAllRoles } from '@/lib/repositories/roles.repository';
import { UsersManager } from '@/components/admin/UsersManager';

export const metadata: Metadata = {
  title: 'User Management | Admin',
};

export default async function AdminUsersPage() {
  const admin = await requireAdmin();

  const [users, roles] = await Promise.all([
    findAllUsers().catch(() => []),
    getAllRoles().catch(() => []),
  ]);

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <UsersManager
        initialUsers={users}
        roles={roles}
        currentAdminId={admin.id}
      />
    </div>
  );
}
