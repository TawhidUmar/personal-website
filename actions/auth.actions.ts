'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { loginSchema, changePasswordSchema } from '@/lib/validations/auth.schema';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { setSessionUser, destroySession, getSessionUser } from '@/lib/auth/session';
import { findUserByEmail, findUserById, updateUserPassword, updateLastLogin } from '@/lib/repositories/users.repository';
import { createAuditLog } from '@/lib/repositories/audit.repository';
import { rateLimit } from '@/lib/utils/rate-limiter';
import type { ActionState } from '@/types/api.types';

// ============================================================
// Login Action
// ============================================================
export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';

  // Rate limiting: 5 attempts per 15 minutes per IP
  const rl = rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.success) {
    return {
      status: 'error',
      error: 'Too many login attempts. Please try again later.',
    };
  }

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Invalid credentials.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = parsed.data;

  try {
    const user = await findUserByEmail(email);

    // Use constant-time comparison to prevent user enumeration
    const dummyHash = '$2a$12$invalidhashfortimingprotection0000000000000';
    const isValid = user
      ? await verifyPassword(password, user.password_hash)
      : await verifyPassword(password, dummyHash).then(() => false);

    if (!user || !isValid) {
      await createAuditLog({
        action: 'auth.login.failed',
        ipAddress: ip,
        userAgent: headersList.get('user-agent') ?? undefined,
        newValues: { email, reason: 'invalid_credentials' },
      });
      return { status: 'error', error: 'Invalid email or password.' };
    }

    // Set session
    await setSessionUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role_name,
      roleId: user.role_id,
      isAdmin: user.role_name === 'admin',
    });

    await updateLastLogin(user.id);

    await createAuditLog({
      userId: user.id,
      action: 'auth.login.success',
      entityType: 'user',
      entityId: user.id,
      ipAddress: ip,
      userAgent: headersList.get('user-agent') ?? undefined,
    });
  } catch {
    return { status: 'error', error: 'An unexpected error occurred. Please try again.' };
  }

  redirect('/admin');
}

// ============================================================
// Logout Action
// ============================================================
export async function logoutAction(): Promise<void> {
  const user = await getSessionUser();
  const headersList = await headers();

  if (user) {
    await createAuditLog({
      userId: user.id,
      action: 'auth.logout',
      entityType: 'user',
      entityId: user.id,
      ipAddress: headersList.get('x-forwarded-for') ?? undefined,
    });
  }

  await destroySession();
  redirect('/auth/login');
}

// ============================================================
// Change Password Action
// ============================================================
export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { status: 'error', error: 'Not authenticated.' };
  }

  const raw = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Validation failed.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = await findUserById(sessionUser.id);
    if (!user) return { status: 'error', error: 'User not found.' };

    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      return { status: 'error', error: 'Current password is incorrect.' };
    }

    const newHash = await hashPassword(newPassword);
    await updateUserPassword(user.id, newHash);

    await createAuditLog({
      userId: user.id,
      action: 'auth.password.changed',
      entityType: 'user',
      entityId: user.id,
    });

    return { status: 'success', message: 'Password changed successfully.' };
  } catch {
    return { status: 'error', error: 'Failed to change password. Please try again.' };
  }
}
