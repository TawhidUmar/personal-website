import { findUserByEmail } from '@/lib/repositories/users.repository';
import { verifyPassword } from '@/lib/auth/password';
import type { DbUserWithRole } from '@/types/db.types';

export interface AuthResult {
  success: boolean;
  user?: DbUserWithRole;
  error?: string;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  const user = await findUserByEmail(email);

  // Dummy hash for timing attack prevention
  const dummyHash = '$2a$12$invalidhashfortimingprotection0000000000000000000';
  const isValid = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyPassword(password, dummyHash).then(() => false);

  if (!user || !isValid) {
    return { success: false, error: 'Invalid email or password.' };
  }

  return { success: true, user };
}
