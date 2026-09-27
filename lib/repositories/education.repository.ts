import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbEducation } from '@/types/db.types';

export async function getAllEducation(): Promise<DbEducation[]> {
  return query<DbEducation>(
    `SELECT * FROM education
     ORDER BY is_current DESC, start_date DESC, display_order ASC`
  );
}

export async function getEducationByUserId(userId: number): Promise<DbEducation[]> {
  return query<DbEducation>(
    `SELECT * FROM education
     WHERE user_id = ?
     ORDER BY is_current DESC, start_date DESC, display_order ASC`,
    [userId]
  );
}

export async function getEducationById(id: number): Promise<DbEducation | null> {
  return queryOne<DbEducation>(
    `SELECT * FROM education WHERE id = ? LIMIT 1`,
    [id]
  );
}

export async function createEducation(
  data: Omit<DbEducation, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO education
     (user_id, institution, institution_url, degree, field_of_study, description, activities, gpa, gpa_scale, location, start_date, end_date, is_current, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.institution,
      data.institution_url ?? null,
      data.degree,
      data.field_of_study ?? null,
      data.description ?? null,
      data.activities ?? null,
      data.gpa ?? null,
      data.gpa_scale ?? null,
      data.location ?? null,
      data.start_date ?? null,
      data.end_date ?? null,
      data.is_current ? 1 : 0,
      data.display_order ?? 0,
    ]
  );
  return result.insertId;
}

export async function updateEducation(
  id: number,
  data: Partial<Omit<DbEducation, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => {
    const val = (data as Record<string, unknown>)[f];
    if (f === 'is_current') return val ? 1 : 0;
    return val ?? null;
  });

  await execute(
    `UPDATE education SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteEducation(id: number): Promise<void> {
  await execute(`DELETE FROM education WHERE id = ?`, [id]);
}
