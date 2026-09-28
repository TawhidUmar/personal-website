/**
 * Migration runner — reads schema.sql and executes it against the DB.
 * Run: npx tsx lib/db/migrate.ts
 */
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import { getDbConfig } from './connection';

async function migrate() {
  console.log('🗄️  Running migrations...');

  const dbConfig = getDbConfig();
  const connection = await mysql.createConnection({
    ...dbConfig,
    multipleStatements: true,
  });

  try {
    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await connection.query(schema);
    console.log('✅ Migration complete.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
