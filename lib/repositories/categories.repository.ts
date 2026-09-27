import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbCategory, CategoryType } from '@/types/db.types';

export async function getAllCategories(type?: CategoryType): Promise<DbCategory[]> {
  if (type) {
    return query<DbCategory>(
      `SELECT * FROM categories WHERE type = ? ORDER BY display_order ASC, name ASC`,
      [type]
    );
  }
  return query<DbCategory>(
    `SELECT * FROM categories ORDER BY type ASC, display_order ASC, name ASC`
  );
}

export async function getCategoryById(id: number): Promise<DbCategory | null> {
  return queryOne<DbCategory>(
    `SELECT * FROM categories WHERE id = ? LIMIT 1`,
    [id]
  );
}

export async function getCategoryBySlug(
  slug: string,
  type: CategoryType
): Promise<DbCategory | null> {
  return queryOne<DbCategory>(
    `SELECT * FROM categories WHERE slug = ? AND type = ? LIMIT 1`,
    [slug, type]
  );
}

export async function createCategory(
  data: Omit<DbCategory, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO categories (name, slug, description, type, color, display_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.slug,
      data.description ?? null,
      data.type,
      data.color ?? null,
      data.display_order ?? 0,
    ]
  );
  return result.insertId;
}

export async function updateCategory(
  id: number,
  data: Partial<Omit<DbCategory, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => (data as Record<string, unknown>)[f] ?? null);

  await execute(
    `UPDATE categories SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteCategory(id: number): Promise<void> {
  await execute(`DELETE FROM categories WHERE id = ?`, [id]);
}
