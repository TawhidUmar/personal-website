import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbExperience, ExperienceType } from '@/types/db.types';

export async function getAllExperiences(): Promise<DbExperience[]> {
  return query<DbExperience>(
    `SELECT * FROM experiences
     ORDER BY is_current DESC, start_date DESC, display_order ASC`
  );
}

export async function getExperiencesByUserId(userId: number): Promise<DbExperience[]> {
  return query<DbExperience>(
    `SELECT * FROM experiences
     WHERE user_id = ?
     ORDER BY is_current DESC, start_date DESC, display_order ASC`,
    [userId]
  );
}

export async function getExperienceById(id: number): Promise<DbExperience | null> {
  return queryOne<DbExperience>(
    `SELECT * FROM experiences WHERE id = ? LIMIT 1`,
    [id]
  );
}

export async function createExperience(
  data: Omit<DbExperience, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO experiences 
     (user_id, title, company, company_url, location, type, description, technologies, start_date, end_date, is_current, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.title,
      data.company,
      data.company_url ?? null,
      data.location ?? null,
      data.type,
      data.description ?? null,
      data.technologies ? JSON.stringify(data.technologies) : null,
      data.start_date,
      data.end_date ?? null,
      data.is_current ? 1 : 0,
      data.display_order ?? 0,
    ]
  );
  return result.insertId;
}

export async function updateExperience(
  id: number,
  data: Partial<Omit<DbExperience, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => {
    const val = (data as Record<string, unknown>)[f];
    if (f === 'technologies' && val) return JSON.stringify(val);
    if (f === 'is_current') return val ? 1 : 0;
    return val ?? null;
  });

  await execute(
    `UPDATE experiences SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteExperience(id: number): Promise<void> {
  await execute(`DELETE FROM experiences WHERE id = ?`, [id]);
}
