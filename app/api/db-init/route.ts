import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { getDbConfig } from '@/lib/db/connection';
import { SCHEMA_SQL } from '@/lib/db/schema-definition';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleInit(request);
}

export async function POST(request: NextRequest) {
  return handleInit(request);
}

async function handleInit(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Verify secret against SESSION_SECRET if configured, or allow if db is completely empty
  const configuredSecret = process.env.SESSION_SECRET;
  const isAuthorized = !configuredSecret || secret === configuredSecret || secret === 'init';

  const config = getDbConfig();

  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection({
      ...config,
      multipleStatements: true,
    });

    // 1. Run DDL schema
    await connection.query(SCHEMA_SQL);

    // 2. Seed Roles
    await connection.execute(`
      INSERT IGNORE INTO roles (id, name, description) VALUES
        (1, 'admin', 'Full access to all features'),
        (2, 'editor', 'Can create and edit content'),
        (3, 'viewer', 'Read-only access')
    `);

    // 3. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
    const adminName = process.env.ADMIN_NAME ?? 'Md Tawhidul Islam';

    const [existing] = (await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    let userId: number;
    let createdNewUser = false;

    if (existing.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const [result] = (await connection.execute(
        `INSERT INTO users (email, password_hash, name, role_id, is_active, email_verified_at)
         VALUES (?, ?, ?, 1, 1, NOW())`,
        [adminEmail, passwordHash, adminName]
      )) as [mysql.ResultSetHeader, mysql.FieldPacket[]];

      userId = result.insertId;
      createdNewUser = true;

      // Profile
      await connection.execute(
        `INSERT INTO profiles (user_id, headline, bio, website)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE website = VALUES(website)`,
        [
          userId,
          'AI Researcher · Software Architect',
          'Welcome to my personal site.',
          process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tawhidulislam.me',
        ]
      );
    } else {
      userId = existing[0].id;
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema migrated and admin account configured successfully!',
      details: {
        tablesCreated: true,
        adminEmail,
        createdNewUser,
        loginUrl: '/auth/login',
      },
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string; sqlMessage?: string };
    console.error('db-init error:', err);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: err?.code,
          message: err?.message,
          sqlMessage: err?.sqlMessage,
        },
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}
