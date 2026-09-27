import { query, queryOne, execute, paginate } from '@/lib/db/connection';
import type { DbContactMessage, MessageStatus } from '@/types/db.types';

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createContactMessage(
  input: CreateContactMessageInput
): Promise<number> {
  const result = await execute(
    `INSERT INTO contact_messages (name, email, subject, message, status, ip_address, user_agent)
     VALUES (?, ?, ?, ?, 'unread', ?, ?)`,
    [
      input.name,
      input.email,
      input.subject,
      input.message,
      input.ipAddress ?? null,
      input.userAgent ?? null,
    ]
  );
  return result.insertId;
}

export async function getContactMessages(
  page = 1,
  limit = 20,
  status?: MessageStatus
): Promise<{ messages: DbContactMessage[]; total: number }> {
  const { offset, limit: safeLimit } = paginate(page, limit);
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [messages, countResult] = await Promise.all([
    query<DbContactMessage>(
      `SELECT * FROM contact_messages
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM contact_messages ${where}`,
      params
    ),
  ]);

  return {
    messages,
    total: countResult[0]?.total ?? 0,
  };
}

export async function updateMessageStatus(
  id: number,
  status: MessageStatus
): Promise<void> {
  await execute(
    `UPDATE contact_messages SET status = ? WHERE id = ?`,
    [status, id]
  );
}

export async function getUnreadMessagesCount(): Promise<number> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'unread'`
  );
  return result?.count ?? 0;
}

export async function deleteContactMessage(id: number): Promise<void> {
  await execute(`DELETE FROM contact_messages WHERE id = ?`, [id]);
}

