import { queryOne, execute } from '@/lib/db/connection';
import type { DbProfile, DbSocialLink } from '@/types/db.types';

export async function findProfileByUserId(userId: number): Promise<DbProfile | null> {
  return queryOne<DbProfile>(
    `SELECT p.*, u.name, u.email
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.id = ? LIMIT 1`,
    [userId]
  );
}

export async function upsertProfile(
  userId: number,
  data: Partial<Omit<DbProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);

  await execute(
    `INSERT INTO profiles (user_id, ${fields.join(', ')})
     VALUES (?, ${fields.map(() => '?').join(', ')})
     ON DUPLICATE KEY UPDATE ${setClause}`,
    [userId, ...values, ...values]
  );
}

export async function findSocialLinksByUserId(userId: number): Promise<DbSocialLink[]> {
  const { query } = await import('@/lib/db/connection');
  return query<DbSocialLink>(
    `SELECT * FROM social_links WHERE user_id = ? ORDER BY display_order ASC`,
    [userId]
  );
}

export async function upsertSocialLink(
  userId: number,
  platform: string,
  url: string,
  displayOrder: number = 0
): Promise<void> {
  await execute(
    `INSERT INTO social_links (user_id, platform, url, display_order)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE url = ?, display_order = ?`,
    [userId, platform, url, displayOrder, url, displayOrder]
  );
}

export async function deleteSocialLink(id: number, userId: number): Promise<void> {
  await execute(
    `DELETE FROM social_links WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
}
