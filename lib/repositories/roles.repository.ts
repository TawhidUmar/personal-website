import { query, queryOne } from '@/lib/db/connection';
import type { DbRole, DbPermission } from '@/types/db.types';

export interface RoleWithPermissions extends DbRole {
  permissions: string[];
  user_count: number;
}

export async function getAllRoles(): Promise<DbRole[]> {
  return query<DbRole>(`SELECT * FROM roles ORDER BY id ASC`);
}

export async function getAllRolesWithDetails(): Promise<RoleWithPermissions[]> {
  const [roles, rolePerms, userCounts] = await Promise.all([
    query<DbRole>(`SELECT * FROM roles ORDER BY id ASC`),
    query<{ role_id: number; permission_name: string }>(
      `SELECT rp.role_id, p.name AS permission_name
       FROM role_permissions rp
       JOIN permissions p ON p.id = rp.permission_id
       ORDER BY p.name ASC`
    ),
    query<{ role_id: number; count: number }>(
      `SELECT role_id, COUNT(*) AS count FROM users GROUP BY role_id`
    ),
  ]);

  const countMap = new Map<number, number>(userCounts.map((u) => [u.role_id, u.count]));

  return roles.map((role) => ({
    ...role,
    permissions: rolePerms
      .filter((rp) => rp.role_id === role.id)
      .map((rp) => rp.permission_name),
    user_count: countMap.get(role.id) ?? 0,
  }));
}
