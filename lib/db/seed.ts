/**
 * Database seeder — creates admin user + default settings.
 * Run: npx tsx lib/db/seed.ts
 */
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function seed() {
  console.log('🌱 Seeding database...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'personal_site',
  });

  try {
    // ── Roles ──────────────────────────────────────────────
    await connection.execute(
      `INSERT IGNORE INTO roles (id, name, description) VALUES
       (1, 'admin', 'Full access to all features'),
       (2, 'editor', 'Can create and edit content'),
       (3, 'viewer', 'Read-only access')`
    );
    console.log('  ✔ Roles seeded');

    // ── Admin user ─────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
    const adminName = process.env.ADMIN_NAME ?? 'Admin User';

    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    ) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    if (existing.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const [result] = await connection.execute(
        `INSERT INTO users (email, password_hash, name, role_id, is_active, email_verified_at)
         VALUES (?, ?, ?, 1, 1, NOW())`,
        [adminEmail, passwordHash, adminName]
      ) as [mysql.ResultSetHeader, mysql.FieldPacket[]];

      // Create profile
      await connection.execute(
        `INSERT INTO profiles (user_id, headline, bio)
         VALUES (?, ?, ?)`,
        [result.insertId, 'Developer · Researcher · Designer', 'Welcome to my personal site.']
      );

      console.log(`  ✔ Admin user created: ${adminEmail}`);
    } else {
      console.log(`  ℹ Admin user already exists: ${adminEmail}`);
    }

    // ── Default settings ───────────────────────────────────
    const defaultSettings = [
      ['site_name', 'My Personal Site', 'string', 'general', 'Site display name', 1],
      ['site_tagline', 'Developer · Researcher · Designer', 'string', 'general', 'Site tagline', 1],
      ['site_description', 'Personal portfolio, research profile, and technical blog.', 'string', 'general', 'Site meta description', 1],
      ['site_url', process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev', 'string', 'general', 'Canonical site URL', 1],
      ['contact_email', adminEmail, 'string', 'general', 'Public contact email', 0],
      ['allow_comments', 'true', 'boolean', 'content', 'Allow comments on articles', 0],
      ['comments_require_approval', 'true', 'boolean', 'content', 'Comments need admin approval', 0],
      ['articles_per_page', '9', 'number', 'content', 'Articles per page', 0],
      ['projects_per_page', '9', 'number', 'content', 'Projects per page', 0],
      ['maintenance_mode', 'false', 'boolean', 'system', 'Put site in maintenance mode', 0],
      ['google_analytics_id', '', 'string', 'analytics', 'Google Analytics measurement ID', 0],
    ];

    for (const [key, value, type, group, description, isPublic] of defaultSettings) {
      await connection.execute(
        `INSERT IGNORE INTO settings (\`key\`, value, type, group_name, description, is_public)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [key, value, type, group, description, isPublic]
      );
    }
    console.log('  ✔ Default settings seeded');

    console.log('\n✅ Seed complete.');
    console.log(`\nAdmin credentials:`);
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('\n⚠️  Change the admin password after first login!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
