import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbTag } from '@/types/db.types';

export async function getAllTags(): Promise<DbTag[]> {
  return query<DbTag>(`SELECT * FROM tags ORDER BY name ASC`);
}

export async function getTagById(id: number): Promise<DbTag | null> {
  return queryOne<DbTag>(`SELECT * FROM tags WHERE id = ? LIMIT 1`, [id]);
}

export async function createTag(
  data: Omit<DbTag, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO tags (name, slug, color) VALUES (?, ?, ?)`,
    [data.name, data.slug, data.color ?? null]
  );
  return result.insertId;
}

export async function updateTag(
  id: number,
  data: Partial<Omit<DbTag, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => (data as Record<string, unknown>)[f] ?? null);

  await execute(`UPDATE tags SET ${setClause} WHERE id = ?`, [...values, id]);
}

export async function deleteTag(id: number): Promise<void> {
  await execute(`DELETE FROM tags WHERE id = ?`, [id]);
}
