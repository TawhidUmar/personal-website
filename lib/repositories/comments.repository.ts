import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbComment, CommentStatus } from '@/types/db.types';

export interface CreateCommentInput {
  articleId: number;
  parentId?: number;
  authorName: string;
  authorEmail: string;
  content: string;
  ipAddress?: string;
  userAgent?: string;
  status?: CommentStatus;
}

export async function getApprovedCommentsByArticleId(
  articleId: number
): Promise<DbComment[]> {
  return query<DbComment>(
    `SELECT * FROM comments
     WHERE article_id = ? AND status = 'approved'
     ORDER BY created_at ASC`,
    [articleId]
  );
}

export async function createComment(
  input: CreateCommentInput
): Promise<number> {
  const result = await execute(
    `INSERT INTO comments (article_id, parent_id, author_name, author_email, content, status, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.articleId,
      input.parentId ?? null,
      input.authorName,
      input.authorEmail,
      input.content,
      input.status ?? 'pending',
      input.ipAddress ?? null,
      input.userAgent ?? null,
    ]
  );
  return result.insertId;
}

export async function updateCommentStatus(
  id: number,
  status: CommentStatus
): Promise<void> {
  await execute(`UPDATE comments SET status = ? WHERE id = ?`, [status, id]);
}

export interface DbCommentWithArticle extends DbComment {
  article_title: string;
  article_slug: string;
}

export async function getAdminComments(
  page = 1,
  limit = 20,
  status?: CommentStatus
): Promise<{ comments: DbCommentWithArticle[]; total: number }> {
  const { paginate } = await import('@/lib/db/connection');
  const { offset, limit: safeLimit } = paginate(page, limit);
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    conditions.push('c.status = ?');
    params.push(status);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [comments, countResult] = await Promise.all([
    query<DbCommentWithArticle>(
      `SELECT c.*, a.title AS article_title, a.slug AS article_slug
       FROM comments c
       JOIN articles a ON a.id = c.article_id
       ${where}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM comments c ${where}`,
      params
    ),
  ]);

  return {
    comments,
    total: countResult[0]?.total ?? 0,
  };
}

export async function deleteComment(id: number): Promise<void> {
  await execute(`DELETE FROM comments WHERE id = ?`, [id]);
}
