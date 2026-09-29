import { query, queryOne, execute, transaction, paginate } from '@/lib/db/connection';
import type { DbProject, DbProjectWithDetails, DbProjectImage, ProjectStatus } from '@/types/db.types';

export async function getFeaturedProjects(): Promise<DbProjectWithDetails[]> {
  const projects = await query<DbProject & { category_name: string | null }>(
    `SELECT p.*, c.name AS category_name
     FROM projects p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.status = 'published' AND p.is_featured = 1
     ORDER BY p.display_order ASC, p.started_at DESC
     LIMIT 6`
  );

  return enrichProjects(projects);
}

export async function getAllPublishedProjects(): Promise<DbProjectWithDetails[]> {
  const projects = await query<DbProject & { category_name: string | null }>(
    `SELECT p.*, c.name AS category_name
     FROM projects p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.status = 'published'
     ORDER BY p.display_order ASC, p.started_at DESC`
  );

  return enrichProjects(projects);
}

export async function getProjectBySlug(slug: string): Promise<DbProjectWithDetails | null> {
  const project = await queryOne<DbProject & { category_name: string | null }>(
    `SELECT p.*, c.name AS category_name
     FROM projects p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.status = 'published'
     LIMIT 1`,
    [slug]
  );

  if (!project) return null;
  const [enriched] = await enrichProjects([project]);
  return enriched ?? null;
}

export async function getProjectById(id: number): Promise<DbProjectWithDetails | null> {
  const project = await queryOne<DbProject & { category_name: string | null }>(
    `SELECT p.*, c.name AS category_name
     FROM projects p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = ?
     LIMIT 1`,
    [id]
  );

  if (!project) return null;
  const [enriched] = await enrichProjects([project]);
  return enriched ?? null;
}

export interface AdminProjectFilter {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
  categoryId?: number;
}

export async function getAdminProjects(
  filter: AdminProjectFilter = {}
): Promise<{ projects: DbProjectWithDetails[]; total: number }> {
  const { page = 1, limit = 20, status, search, categoryId } = filter;
  const { offset, limit: safeLimit } = paginate(page, limit);

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    conditions.push('p.status = ?');
    params.push(status);
  }

  if (categoryId) {
    conditions.push('p.category_id = ?');
    params.push(categoryId);
  }

  if (search && search.trim() !== '') {
    conditions.push('(p.title LIKE ? OR p.description LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [projects, countResult] = await Promise.all([
    query<DbProject & { category_name: string | null }>(
      `SELECT p.*, c.name AS category_name
       FROM projects p
       LEFT JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.display_order ASC, p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM projects p ${where}`,
      params
    ),
  ]);

  const enriched = await enrichProjects(projects);

  return {
    projects: enriched,
    total: countResult[0]?.total ?? 0,
  };
}

export async function createProject(
  data: Omit<DbProject, 'id' | 'created_at' | 'updated_at'>,
  technologies: string[] = []
): Promise<number> {
  return transaction(async (conn) => {
    const [result] = await conn.query(
      `INSERT INTO projects 
       (author_id, category_id, title, slug, description, long_description, hero_image_url, project_url, github_url, client, role, problem, solution, features, architecture, challenges, results, status, is_featured, display_order, started_at, ended_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.author_id,
        data.category_id ?? null,
        data.title,
        data.slug,
        data.description ?? null,
        data.long_description ?? null,
        data.hero_image_url ?? null,
        data.project_url ?? null,
        data.github_url ?? null,
        data.client ?? null,
        data.role ?? null,
        data.problem ?? null,
        data.solution ?? null,
        data.features ? JSON.stringify(data.features) : null,
        data.architecture ?? null,
        data.challenges ?? null,
        data.results ?? null,
        data.status,
        data.is_featured ? 1 : 0,
        data.display_order ?? 0,
        data.started_at,
        data.ended_at ?? null,
      ] as any[]
    );

    const projectId = (result as { insertId: number }).insertId;

    if (technologies.length > 0) {
      for (let i = 0; i < technologies.length; i++) {
        await conn.query(
          `INSERT INTO project_technologies (project_id, name, display_order) VALUES (?, ?, ?)`,
          [projectId, technologies[i].trim(), i] as any[]
        );
      }
    }

    return projectId;
  });
}

export async function updateProject(
  id: number,
  data: Partial<Omit<DbProject, 'id' | 'created_at' | 'updated_at'>>,
  technologies?: string[]
): Promise<void> {
  await transaction(async (conn) => {
    const fields = Object.keys(data);
    if (fields.length > 0) {
      const setClause = fields.map((f) => `${f} = ?`).join(', ');
      const values = fields.map((f) => {
        const val = (data as Record<string, unknown>)[f];
        if (f === 'is_featured') return val ? 1 : 0;
        if (f === 'features' && val) return JSON.stringify(val);
        return val ?? null;
      });

      await conn.query(
        `UPDATE projects SET ${setClause} WHERE id = ?`,
        [...values, id] as any[]
      );
    }

    if (technologies !== undefined) {
      await conn.query(`DELETE FROM project_technologies WHERE project_id = ?`, [id] as any[]);
      for (let i = 0; i < technologies.length; i++) {
        await conn.query(
          `INSERT INTO project_technologies (project_id, name, display_order) VALUES (?, ?, ?)`,
          [id, technologies[i].trim(), i] as any[]
        );
      }
    }
  });
}

export async function deleteProject(id: number): Promise<void> {
  await execute(`DELETE FROM projects WHERE id = ?`, [id]);
}

async function enrichProjects(
  projects: (DbProject & { category_name: string | null })[]
): Promise<DbProjectWithDetails[]> {
  if (projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);
  const placeholders = projectIds.map(() => '?').join(',');

  const [techRows, imageRows] = await Promise.all([
    query<{ project_id: number; name: string }>(
      `SELECT project_id, name FROM project_technologies
       WHERE project_id IN (${placeholders})
       ORDER BY display_order ASC`,
      projectIds
    ),
    query<DbProjectImage>(
      `SELECT * FROM project_images
       WHERE project_id IN (${placeholders})
       ORDER BY display_order ASC`,
      projectIds
    ),
  ]);

  return projects.map((p) => ({
    ...p,
    category_name: p.category_name,
    technologies: techRows.filter((t) => t.project_id === p.id).map((t) => t.name),
    images: imageRows.filter((img) => img.project_id === p.id),
  }));
}
