import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { SessionUser } from '@/types/session.types';

export interface IronSessionData {
  user?: SessionUser;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET ?? 'fallback-secret-change-this-in-production-32chars',
  cookieName: process.env.SESSION_COOKIE_NAME ?? 'ps-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: parseInt(process.env.SESSION_MAX_AGE ?? '28800', 10), // 8 hours
    path: '/',
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<IronSessionData>(cookieStore, sessionOptions);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session.user ?? null;
}

export async function setSessionUser(user: SessionUser): Promise<void> {
  const session = await getSession();
  session.user = user;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}
