import { redirect } from 'next/navigation';
import { getSessionUser } from './session';
import type { SessionUser } from '@/types/session.types';

/**
 * Ensures user is authenticated. Redirects to login if not.
 * Use in Server Components and Server Actions.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

/**
 * Ensures user has admin role. Redirects to login if not.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !user.isAdmin) {
    redirect('/auth/login');
  }
  return user;
}

/**
 * Ensures user has a specific role.
 */
export async function requireRole(role: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.role !== role) {
    redirect('/auth/login');
  }
  return user;
}

/**
 * Returns the current user or null (non-redirecting).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSessionUser();
}
