import { NextResponse } from 'next/server';
import pool, { getDbConfig } from '@/lib/db/connection';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getDbConfig();
  const safeConfig = {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    hasPassword: Boolean(config.password),
    ssl: Boolean(config.ssl),
  };

  try {
    // 1. Test raw connection
    await pool.query('SELECT 1 as is_connected');

    // 2. Check existing tables
    const [tableRows] = (await pool.query('SHOW TABLES')) as [Record<string, unknown>[], unknown];
    const tables = tableRows.map((r) => Object.values(r)[0] as string);

    // 3. Check users table
    let userCount = 0;
    let usersList: { id: number; email: string; name: string }[] = [];
    if (tables.includes('users')) {
      const [users] = (await pool.query(
        'SELECT id, email, name FROM users'
      )) as [ { id: number; email: string; name: string }[], unknown];
      userCount = users.length;
      usersList = users;
    }

    const isReady = tables.includes('users') && tables.includes('roles') && userCount > 0;

    return NextResponse.json({
      success: true,
      connection: 'connected',
      config: safeConfig,
      tablesCount: tables.length,
      tables,
      userCount,
      users: usersList,
      readyToLogin: isReady,
      message: isReady
        ? 'Database is connected and admin account exists. You can log in.'
        : !tables.includes('users')
        ? 'Connected to TiDB, but database tables do not exist yet. Please initialize the schema.'
        : 'Tables exist, but no user accounts found. Please seed the admin account.',
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; sqlMessage?: string };

    return NextResponse.json(
      {
        success: false,
        connection: 'failed',
        config: safeConfig,
        error: {
          code: err?.code,
          message: err?.message,
          sqlMessage: err?.sqlMessage,
        },
        troubleshooting:
          err?.code === 'ER_BAD_DB_ERROR'
            ? 'The database name does not exist on your TiDB cluster. In TiDB Cloud, the default database is usually "test".'
            : err?.code === 'ER_ACCESS_DENIED_ERROR'
            ? 'Authentication failed: please check your TIDB_USER / DB_USER and password in Vercel environment variables.'
            : err?.code === 'ECONNREFUSED' || err?.code === 'ETIMEDOUT'
            ? 'Connection timed out or refused: verify the host and port in Vercel environment variables.'
            : 'Check Vercel environment variables and database connectivity.',
      },
      { status: 500 }
    );
  }
}
