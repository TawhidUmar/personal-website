import { query, queryOne, execute, paginate } from '@/lib/db/connection';
import type { DbResearch, PublicationStatus } from '@/types/db.types';

export interface ResearchWithCategory extends DbResearch {
  category_name: string | null;
}

export async function getFeaturedResearch(): Promise<ResearchWithCategory[]> {
  return query<ResearchWithCategory>(
    `SELECT r.*, c.name AS category_name
     FROM research r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.is_featured = 1 AND r.status != 'archived'
     ORDER BY r.published_at DESC, r.created_at DESC
     LIMIT 4`
  );
}

export async function getAllResearch(): Promise<ResearchWithCategory[]> {
  return query<ResearchWithCategory>(
    `SELECT r.*, c.name AS category_name
     FROM research r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.status != 'archived'
     ORDER BY r.published_at DESC, r.created_at DESC`
  );
}

export async function getResearchBySlug(slug: string): Promise<ResearchWithCategory | null> {
  return queryOne<ResearchWithCategory>(
    `SELECT r.*, c.name AS category_name
     FROM research r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.slug = ? AND r.status != 'archived'
     LIMIT 1`,
    [slug]
  );
}

export async function getResearchById(id: number): Promise<ResearchWithCategory | null> {
  return queryOne<ResearchWithCategory>(
    `SELECT r.*, c.name AS category_name
     FROM research r
     LEFT JOIN categories c ON c.id = r.category_id
     WHERE r.id = ?
     LIMIT 1`,
    [id]
  );
}

export interface AdminResearchFilter {
  page?: number;
  limit?: number;
  publicationStatus?: PublicationStatus;
  search?: string;
  categoryId?: number;
}

export async function getAdminResearch(
  filter: AdminResearchFilter = {}
): Promise<{ research: ResearchWithCategory[]; total: number }> {
  const { page = 1, limit = 20, publicationStatus, search, categoryId } = filter;
  const { offset, limit: safeLimit } = paginate(page, limit);

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (publicationStatus) {
    conditions.push('r.publication_status = ?');
    params.push(publicationStatus);
  }

  if (categoryId) {
    conditions.push('r.category_id = ?');
    params.push(categoryId);
  }

  if (search && search.trim() !== '') {
    conditions.push('(r.title LIKE ? OR r.abstract LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [research, countResult] = await Promise.all([
    query<ResearchWithCategory>(
      `SELECT r.*, c.name AS category_name
       FROM research r
       LEFT JOIN categories c ON c.id = r.category_id
       ${where}
       ORDER BY r.published_at DESC, r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM research r ${where}`,
      params
    ),
  ]);

  return {
    research,
    total: countResult[0]?.total ?? 0,
  };
}

export async function createResearch(
  data: Omit<DbResearch, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO research 
     (author_id, category_id, title, slug, abstract, methodology, technologies, dataset, status, publication_status, publication_url, doi, github_url, is_featured, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.author_id,
      data.category_id ?? null,
      data.title,
      data.slug,
      data.abstract ?? null,
      data.methodology ?? null,
      data.technologies ? JSON.stringify(data.technologies) : null,
      data.dataset ?? null,
      data.status,
      data.publication_status,
      data.publication_url ?? null,
      data.doi ?? null,
      data.github_url ?? null,
      data.is_featured ? 1 : 0,
      data.published_at ?? null,
    ]
  );
  return result.insertId;
}

export async function updateResearch(
  id: number,
  data: Partial<Omit<DbResearch, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => {
    const val = (data as Record<string, unknown>)[f];
    if (f === 'is_featured') return val ? 1 : 0;
    if (f === 'technologies' && val) return JSON.stringify(val);
    return val ?? null;
  });

  await execute(
    `UPDATE research SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteResearch(id: number): Promise<void> {
  await execute(`DELETE FROM research WHERE id = ?`, [id]);
}
