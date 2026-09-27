import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbAward } from '@/types/db.types';

export async function getAllAwards(): Promise<DbAward[]> {
  return query<DbAward>(
    `SELECT * FROM awards ORDER BY display_order ASC, date DESC, created_at DESC`
  );
}

export async function getFeaturedAwards(): Promise<DbAward[]> {
  return query<DbAward>(
    `SELECT * FROM awards WHERE is_featured = 1 ORDER BY display_order ASC, date DESC`
  );
}

export async function getAwardById(id: number): Promise<DbAward | null> {
  return queryOne<DbAward>(`SELECT * FROM awards WHERE id = ? LIMIT 1`, [id]);
}

export async function createAward(
  data: Omit<DbAward, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO awards
     (user_id, title, issuer, issuer_url, category, date, description, badge_url, is_featured, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.title,
      data.issuer,
      data.issuer_url ?? null,
      data.category,
      data.date ?? null,
      data.description ?? null,
      data.badge_url ?? null,
      data.is_featured ? 1 : 0,
      data.display_order ?? 0,
    ]
  );
  return result.insertId;
}

export async function updateAward(
  id: number,
  data: Partial<Omit<DbAward, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => {
    const val = (data as Record<string, unknown>)[f];
    if (f === 'is_featured') return val ? 1 : 0;
    return val ?? null;
  });

  await execute(
    `UPDATE awards SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteAward(id: number): Promise<void> {
  await execute(`DELETE FROM awards WHERE id = ?`, [id]);
}
