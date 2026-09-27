import { query, execute, paginate } from '@/lib/db/connection';
import type { DbAuditLog } from '@/types/db.types';

export interface CreateAuditLogInput {
  userId?: number;
  action: string;
  entityType?: string;
  entityId?: number;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(input: CreateAuditLogInput): Promise<void> {
  await execute(
    `INSERT INTO audit_logs
     (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.userId ?? null,
      input.action,
      input.entityType ?? null,
      input.entityId ?? null,
      input.oldValues ? JSON.stringify(input.oldValues) : null,
      input.newValues ? JSON.stringify(input.newValues) : null,
      input.ipAddress ?? null,
      input.userAgent ?? null,
    ]
  );
}

export async function getAuditLogs(
  page: number = 1,
  limit: number = 50,
  filters?: { userId?: number; action?: string; entityType?: string }
): Promise<{ logs: DbAuditLog[]; total: number }> {
  const { offset, limit: safeLimit } = paginate(page, limit);

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters?.userId) {
    conditions.push('al.user_id = ?');
    params.push(filters.userId);
  }
  if (filters?.action) {
    conditions.push('al.action LIKE ?');
    params.push(`%${filters.action}%`);
  }
  if (filters?.entityType) {
    conditions.push('al.entity_type = ?');
    params.push(filters.entityType);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [logs, countResult] = await Promise.all([
    query<DbAuditLog>(
      `SELECT al.*, u.name AS user_name
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.user_id
       ${where}
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM audit_logs al ${where}`,
      params
    ),
  ]);

  return { logs, total: countResult[0]?.total ?? 0 };
}
