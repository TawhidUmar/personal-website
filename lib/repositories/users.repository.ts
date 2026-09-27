import { query, queryOne, execute } from '@/lib/db/connection';
import type { DbUser, DbUserWithRole } from '@/types/db.types';

export async function findUserByEmail(email: string): Promise<DbUserWithRole | null> {
  return queryOne<DbUserWithRole>(
    `SELECT u.*, r.name AS role_name
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.email = ? AND u.is_active = 1
     LIMIT 1`,
    [email]
  );
}

export async function findUserById(id: number): Promise<DbUserWithRole | null> {
  return queryOne<DbUserWithRole>(
    `SELECT u.*, r.name AS role_name
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.id = ? AND u.is_active = 1
     LIMIT 1`,
    [id]
  );
}

export async function findAllUsers(): Promise<DbUserWithRole[]> {
  return query<DbUserWithRole>(
    `SELECT u.*, r.name AS role_name
     FROM users u
     JOIN roles r ON r.id = u.role_id
     ORDER BY u.created_at DESC`
  );
}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string,
  roleId: number = 2
): Promise<number> {
  const result = await execute(
    `INSERT INTO users (email, password_hash, name, role_id, is_active)
     VALUES (?, ?, ?, ?, 1)`,
    [email, passwordHash, name, roleId]
  );
  return result.insertId;
}

export async function updateUserPassword(
  userId: number,
  passwordHash: string
): Promise<void> {
  await execute(
    `UPDATE users SET password_hash = ?, password_changed_at = NOW() WHERE id = ?`,
    [passwordHash, userId]
  );
}

export async function updateUserName(userId: number, name: string): Promise<void> {
  await execute(
    `UPDATE users SET name = ? WHERE id = ?`,
    [name, userId]
  );
}

export async function updateLastLogin(userId: number): Promise<void> {
  await execute(
    `UPDATE users SET last_login_at = NOW() WHERE id = ?`,
    [userId]
  );
}

export async function updateUserActiveStatus(
  userId: number,
  isActive: boolean
): Promise<void> {
  await execute(
    `UPDATE users SET is_active = ? WHERE id = ?`,
    [isActive ? 1 : 0, userId]
  );
}

export async function deleteUser(userId: number): Promise<void> {
  await execute(`DELETE FROM users WHERE id = ?`, [userId]);
}
