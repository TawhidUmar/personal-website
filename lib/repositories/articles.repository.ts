import { query, queryOne, execute, transaction, paginate } from '@/lib/db/connection';
import type { DbArticle, DbArticleWithAuthor, DbTag, ArticleStatus } from '@/types/db.types';

export async function getFeaturedArticles(limit = 3): Promise<DbArticleWithAuthor[]> {
  let articles = await query<DbArticleWithAuthor>(
    `SELECT a.*, u.name AS author_name, u.email AS author_email, c.name AS category_name, c.slug AS category_slug
     FROM articles a
     JOIN users u ON u.id = a.author_id
     LEFT JOIN categories c ON c.id = a.category_id
     WHERE a.status = 'published' AND a.is_featured = 1
     ORDER BY a.published_at DESC
     LIMIT ?`,
    [limit]
  );

  // If fewer than limit, backfill with recent published articles so real user articles are always showcased
  if (articles.length < limit) {
    const existingIds = articles.map((a) => a.id);
    const needed = limit - articles.length;
    const additional = await query<DbArticleWithAuthor>(
      `SELECT a.*, u.name AS author_name, u.email AS author_email, c.name AS category_name, c.slug AS category_slug
       FROM articles a
       JOIN users u ON u.id = a.author_id
       LEFT JOIN categories c ON c.id = a.category_id
       WHERE a.status = 'published' ${existingIds.length > 0 ? `AND a.id NOT IN (${existingIds.map(() => '?').join(',')})` : ''}
       ORDER BY a.published_at DESC
       LIMIT ?`,
      existingIds.length > 0 ? [...existingIds, needed] : [needed]
    );
    articles = [...articles, ...additional];
  }

  return enrichArticleTags(articles);
}

export async function toggleArticleFeatured(id: number): Promise<boolean> {
  const article = await queryOne<DbArticle>(`SELECT is_featured FROM articles WHERE id = ? LIMIT 1`, [id]);
  if (!article) throw new Error('Article not found');
  const nextVal = article.is_featured ? 0 : 1;
  await execute(`UPDATE articles SET is_featured = ? WHERE id = ?`, [nextVal, id]);
  return nextVal === 1;
}

export async function getRecentArticles(limit = 6): Promise<DbArticleWithAuthor[]> {
  const articles = await query<DbArticleWithAuthor>(
    `SELECT a.*, u.name AS author_name, u.email AS author_email, c.name AS category_name, c.slug AS category_slug
     FROM articles a
     JOIN users u ON u.id = a.author_id
     LEFT JOIN categories c ON c.id = a.category_id
     WHERE a.status = 'published'
     ORDER BY a.published_at DESC
     LIMIT ?`,
    [limit]
  );

  return enrichArticleTags(articles);
}

export async function getArticleBySlug(slug: string): Promise<DbArticleWithAuthor | null> {
  const article = await queryOne<DbArticleWithAuthor>(
    `SELECT a.*, u.name AS author_name, u.email AS author_email, c.name AS category_name, c.slug AS category_slug
     FROM articles a
     JOIN users u ON u.id = a.author_id
     LEFT JOIN categories c ON c.id = a.category_id
     WHERE a.slug = ? AND a.status = 'published'
     LIMIT 1`,
    [slug]
  );

  if (!article) return null;
  const [enriched] = await enrichArticleTags([article]);
  return enriched ?? null;
}

export async function getArticleById(id: number): Promise<DbArticleWithAuthor | null> {
  const article = await queryOne<DbArticleWithAuthor>(
    `SELECT a.*, u.name AS author_name, u.email AS author_email, c.name AS category_name, c.slug AS category_slug
     FROM articles a
     JOIN users u ON u.id = a.author_id
     LEFT JOIN categories c ON c.id = a.category_id
     WHERE a.id = ?
     LIMIT 1`,
    [id]
  );

  if (!article) return null;
  const [enriched] = await enrichArticleTags([article]);
  return enriched ?? null;
}

export interface AdminArticleFilter {
  page?: number;
  limit?: number;
  status?: ArticleStatus;
  search?: string;
  categoryId?: number;
}

export async function getAdminArticles(
  filter: AdminArticleFilter = {}
): Promise<{ articles: DbArticleWithAuthor[]; total: number }> {
  const { page = 1, limit = 15, status, search, categoryId } = filter;
  const { offset, limit: safeLimit } = paginate(page, limit);

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    conditions.push('a.status = ?');
    params.push(status);
  }

  if (categoryId) {
    conditions.push('a.category_id = ?');
    params.push(categoryId);
  }

  if (search && search.trim() !== '') {
    conditions.push('(a.title LIKE ? OR a.excerpt LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    params.push(searchTerm, searchTerm);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [articles, countResult] = await Promise.all([
    query<DbArticleWithAuthor>(
      `SELECT a.*, u.name AS author_name, u.email AS author_email, c.name AS category_name, c.slug AS category_slug
       FROM articles a
       JOIN users u ON u.id = a.author_id
       LEFT JOIN categories c ON c.id = a.category_id
       ${where}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM articles a ${where}`,
      params
    ),
  ]);

  const enriched = await enrichArticleTags(articles);

  return {
    articles: enriched,
    total: countResult[0]?.total ?? 0,
  };
}

export async function createArticle(
  data: Omit<DbArticle, 'id' | 'created_at' | 'updated_at' | 'view_count'>,
  tagIds?: number[]
): Promise<number> {
  return transaction(async (conn) => {
    const [result] = await conn.query(
      `INSERT INTO articles 
       (author_id, category_id, title, slug, excerpt, content, cover_image_url, status, reading_time, is_featured, published_at, scheduled_at, seo_title, seo_description, canonical_url, view_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        data.author_id,
        data.category_id ?? null,
        data.title,
        data.slug,
        data.excerpt ?? null,
        data.content,
        data.cover_image_url ?? null,
        data.status,
        data.reading_time ?? null,
        data.is_featured ? 1 : 0,
        data.published_at ?? null,
        data.scheduled_at ?? null,
        data.seo_title ?? null,
        data.seo_description ?? null,
        data.canonical_url ?? null,
      ] as any[]
    );

    const articleId = (result as { insertId: number }).insertId;

    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await conn.query(
          `INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)`,
          [articleId, tagId] as any[]
        );
      }
    }

    return articleId;
  });
}

export async function updateArticle(
  id: number,
  data: Partial<Omit<DbArticle, 'id' | 'created_at' | 'updated_at' | 'view_count'>>,
  tagIds?: number[]
): Promise<void> {
  await transaction(async (conn) => {
    const fields = Object.keys(data);
    if (fields.length > 0) {
      const setClause = fields.map((f) => `${f} = ?`).join(', ');
      const values = fields.map((f) => {
        const val = (data as Record<string, unknown>)[f];
        if (f === 'is_featured') return val ? 1 : 0;
        return val ?? null;
      });

      await conn.query(
        `UPDATE articles SET ${setClause} WHERE id = ?`,
        [...values, id] as any[]
      );
    }

    if (tagIds !== undefined) {
      await conn.query(`DELETE FROM article_tags WHERE article_id = ?`, [id] as any[]);
      for (const tagId of tagIds) {
        await conn.query(
          `INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)`,
          [id, tagId] as any[]
        );
      }
    }
  });
}

export async function deleteArticle(id: number): Promise<void> {
  await execute(`DELETE FROM articles WHERE id = ?`, [id]);
}

export async function getDashboardOverviewMetrics() {
  const [articlesCount, projectsCount, researchCount, unreadMessagesCount, recentAuditLogs] =
    await Promise.all([
      queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM articles`),
      queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM projects WHERE status = 'published'`),
      queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM research WHERE status != 'archived'`),
      queryOne<{ count: number }>(`SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'unread'`),
      query<any>(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 8`),
    ]);

  return {
    articles: articlesCount?.count ?? 0,
    projects: projectsCount?.count ?? 0,
    research: researchCount?.count ?? 0,
    messages: unreadMessagesCount?.count ?? 0,
    recentAuditLogs: recentAuditLogs ?? [],
  };
}

async function enrichArticleTags(articles: DbArticleWithAuthor[]): Promise<DbArticleWithAuthor[]> {
  if (articles.length === 0) return [];

  const articleIds = articles.map((a) => a.id);
  const placeholders = articleIds.map(() => '?').join(',');

  const tagRows = await query<DbTag & { article_id: number }>(
    `SELECT t.*, at.article_id
     FROM tags t
     JOIN article_tags at ON at.tag_id = t.id
     WHERE at.article_id IN (${placeholders})`,
    articleIds
  );

  return articles.map((a) => ({
    ...a,
    tags: tagRows.filter((t) => t.article_id === a.id),
  }));
}
