import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllRolesWithDetails } from '@/lib/repositories/roles.repository';
import { RolesList } from '@/components/admin/RolesList';

export const metadata: Metadata = {
  title: 'Roles & Permissions | Admin',
};

export default async function AdminRolesPage() {
  await requireAdmin();
  const roles = await getAllRolesWithDetails().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <RolesList roles={roles} />
    </div>
  );
}
