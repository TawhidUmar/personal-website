import { NextResponse } from 'next/server';
import { getAdminArticles } from '@/lib/repositories/articles.repository';
import { query } from '@/lib/db/connection';
import { getDbConfig } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getDbConfig();
  const safeConfig = {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
  };

  try {
    // Raw article count first
    const rawCount = await query<{ cnt: number }>('SELECT COUNT(*) as cnt FROM articles');
    const rawArticles = await query<{ id: number; title: string; author_id: number; status: string }>(
      'SELECT id, title, author_id, status FROM articles ORDER BY id DESC LIMIT 10'
    );
    const rawUsers = await query<{ id: number; email: string }>('SELECT id, email FROM users');

    // Now try getAdminArticles
    let adminArticles: unknown = null;
    let adminError: string | null = null;
    try {
      adminArticles = await getAdminArticles({ page: 1, limit: 20 });
    } catch (err: unknown) {
      adminError = err instanceof Error ? err.message : String(err);
    }

    return NextResponse.json({
      config: safeConfig,
      rawCount: rawCount[0]?.cnt ?? 0,
      rawArticles,
      rawUsers,
      adminArticles,
      adminError,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      config: safeConfig,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
