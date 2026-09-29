import { NextResponse } from 'next/server';
import { query, getDbConfig } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';

async function safeQuery<T>(sql: string, params?: unknown[]): Promise<{ data: T[] | null; error: string | null }> {
  try {
    const rows = await query<T>(sql, params as any[]);
    return { data: rows, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET() {
  const config = getDbConfig();

  const [
    articles,
    profiles,
    experiences,
    education,
    skills,
    projects,
    research,
    settings,
    users,
  ] = await Promise.all([
    safeQuery('SELECT id, title, status, author_id FROM articles ORDER BY id DESC LIMIT 5'),
    safeQuery('SELECT id, user_id, headline, bio, location FROM profiles LIMIT 5'),
    safeQuery('SELECT id, user_id, title, company FROM experiences ORDER BY display_order LIMIT 5'),
    safeQuery('SELECT id, user_id, institution, degree FROM education ORDER BY display_order LIMIT 5'),
    safeQuery('SELECT id, name FROM skill_categories LIMIT 5'),
    safeQuery('SELECT id, title, status, is_featured FROM projects ORDER BY id DESC LIMIT 5'),
    safeQuery('SELECT id, title, status FROM research ORDER BY id DESC LIMIT 5'),
    safeQuery('SELECT `key`, value FROM settings LIMIT 10'),
    safeQuery('SELECT id, email, name FROM users LIMIT 5'),
  ]);

  return NextResponse.json({
    config: {
      host: config.host,
      user: config.user,
      database: config.database,
    },
    tables: {
      articles: { count: articles.data?.length ?? 0, error: articles.error, sample: articles.data },
      profiles: { count: profiles.data?.length ?? 0, error: profiles.error, sample: profiles.data },
      experiences: { count: experiences.data?.length ?? 0, error: experiences.error, sample: experiences.data },
      education: { count: education.data?.length ?? 0, error: education.error, sample: education.data },
      skills: { count: skills.data?.length ?? 0, error: skills.error, sample: skills.data },
      projects: { count: projects.data?.length ?? 0, error: projects.error, sample: projects.data },
      research: { count: research.data?.length ?? 0, error: research.error, sample: research.data },
      settings: { count: settings.data?.length ?? 0, error: settings.error, sample: settings.data },
      users: { count: users.data?.length ?? 0, error: users.error, sample: users.data },
    },
  });
}
