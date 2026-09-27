import { query, queryOne, execute, paginate } from '@/lib/db/connection';
import type { DbMedia } from '@/types/db.types';

export interface MediaFilter {
  page?: number;
  limit?: number;
  folder?: string;
  search?: string;
}

export async function getAllMedia(
  filter: MediaFilter = {}
): Promise<{ media: DbMedia[]; total: number; folders: string[] }> {
  const { page = 1, limit = 30, folder, search } = filter;
  const { offset, limit: safeLimit } = paginate(page, limit);

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (folder && folder !== 'all') {
    conditions.push('folder = ?');
    params.push(folder);
  }

  if (search && search.trim() !== '') {
    conditions.push('(filename LIKE ? OR original_filename LIKE ? OR alt LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [media, countResult, foldersResult] = await Promise.all([
    query<DbMedia>(
      `SELECT * FROM media
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM media ${where}`,
      params
    ),
    query<{ folder: string }>(
      `SELECT DISTINCT folder FROM media WHERE folder IS NOT NULL ORDER BY folder ASC`
    ),
  ]);

  return {
    media,
    total: countResult[0]?.total ?? 0,
    folders: foldersResult.map((r) => r.folder).filter(Boolean),
  };
}

export async function getMediaById(id: number): Promise<DbMedia | null> {
  return queryOne<DbMedia>(`SELECT * FROM media WHERE id = ? LIMIT 1`, [id]);
}

export async function createMedia(
  data: Omit<DbMedia, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  const result = await execute(
    `INSERT INTO media 
     (uploader_id, filename, original_filename, url, mime_type, size, width, height, alt, caption, folder)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.uploader_id,
      data.filename,
      data.original_filename,
      data.url,
      data.mime_type,
      data.size,
      data.width ?? null,
      data.height ?? null,
      data.alt ?? null,
      data.caption ?? null,
      data.folder || 'general',
    ]
  );
  return result.insertId;
}

export async function updateMedia(
  id: number,
  data: Partial<Pick<DbMedia, 'alt' | 'caption' | 'folder'>>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;

  const setClause = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => (data as Record<string, unknown>)[f] ?? null);

  await execute(
    `UPDATE media SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteMedia(id: number): Promise<void> {
  await execute(`DELETE FROM media WHERE id = ?`, [id]);
}
