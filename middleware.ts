import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { IronSessionData } from '@/lib/auth/session';

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? 'fallback-secret-change-this-in-production-32chars',
  cookieName: process.env.SESSION_COOKIE_NAME ?? 'ps-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: parseInt(process.env.SESSION_MAX_AGE ?? '28800', 10),
    path: '/',
  },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const res = NextResponse.next();
    const session = await getIronSession<IronSessionData>(request, res, sessionOptions);

    if (!session.user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!session.user.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
