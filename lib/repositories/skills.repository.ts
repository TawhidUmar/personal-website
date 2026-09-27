import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbSkill, DbSkillCategory, DbSkillWithCategory } from '@/types/db.types';

export interface SkillCategoryWithSkills extends DbSkillCategory {
  skills: DbSkill[];
}

export async function getAllSkillCategories(): Promise<DbSkillCategory[]> {
  return query<DbSkillCategory>(
    `SELECT * FROM skill_categories ORDER BY display_order ASC, name ASC`
  );
}

export async function getAllSkillsWithCategory(): Promise<DbSkillWithCategory[]> {
  return query<DbSkillWithCategory>(
    `SELECT s.*, c.name AS category_name, c.slug AS category_slug
     FROM skills s
     JOIN skill_categories c ON c.id = s.category_id
     ORDER BY c.display_order ASC, s.display_order ASC, s.name ASC`
  );
}

export async function getSkillCategoriesWithSkills(): Promise<SkillCategoryWithSkills[]> {
  const [categories, skills] = await Promise.all([
    getAllSkillCategories(),
    query<DbSkill>(`SELECT * FROM skills ORDER BY display_order ASC, name ASC`),
  ]);

  return categories.map((category) => ({
    ...category,
    skills: skills.filter((s) => s.category_id === category.id),
  }));
}

export async function getFeaturedSkills(): Promise<DbSkillWithCategory[]> {
  return query<DbSkillWithCategory>(
    `SELECT s.*, c.name AS category_name, c.slug AS category_slug
     FROM skills s
     JOIN skill_categories c ON c.id = s.category_id
     WHERE s.is_featured = 1
     ORDER BY s.display_order ASC, s.name ASC`
  );
}

export async function createSkill(
  data: Omit<DbSkill, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO skills (category_id, name, slug, level, years_of_experience, icon, description, display_order, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id,
      data.name,
      data.slug,
      data.level,
      data.years_of_experience ?? null,
      data.icon ?? null,
      data.description ?? null,
      data.display_order ?? 0,
      data.is_featured ? 1 : 0,
    ]
  );
  return result.insertId;
}

export async function updateSkill(
  id: number,
  data: Partial<Omit<DbSkill, 'id' | 'created_at' | 'updated_at'>>
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
    `UPDATE skills SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteSkill(id: number): Promise<void> {
  await execute(`DELETE FROM skills WHERE id = ?`, [id]);
}

export async function createSkillCategory(
  data: Omit<DbSkillCategory, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO skill_categories (name, slug, description, display_order)
     VALUES (?, ?, ?, ?)`,
    [data.name, data.slug, data.description ?? null, data.display_order ?? 0]
  );
  return result.insertId;
}

export async function deleteSkillCategory(id: number): Promise<void> {
  await execute(`DELETE FROM skill_categories WHERE id = ?`, [id]);
}

