import mysql from 'mysql2/promise';

// ============================================================
// Connection Pool
// ============================================================

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: { minVersion?: string; rejectUnauthorized?: boolean };
  connectTimeout?: number;
}

export function getDbConfig(): DbConfig {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const isRemote = url.hostname !== 'localhost' && url.hostname !== '127.0.0.1';
      const isTiDB = url.hostname.includes('tidbcloud') || Boolean(process.env.TIDB_HOST);
      const useSsl = isTiDB || process.env.DB_SSL === 'true' || (isRemote && process.env.DB_SSL !== 'false');

      return {
        host: url.hostname,
        port: parseInt(url.port || (isTiDB ? '4000' : '3306'), 10),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, '') || (isTiDB ? 'test' : 'personal_site'),
        ssl: useSsl ? { minVersion: 'TLSv1.2', rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' } : undefined,
      };
    } catch {
      // Fall through to individual variables
    }
  }

  const host = process.env.DB_HOST ?? process.env.TIDB_HOST ?? 'localhost';
  const isTiDB = host.includes('tidbcloud') || Boolean(process.env.TIDB_HOST);
  const defaultPort = isTiDB ? '4000' : '3306';
  const port = parseInt(process.env.DB_PORT ?? process.env.TIDB_PORT ?? defaultPort, 10);
  const user = process.env.DB_USER ?? process.env.TIDB_USER ?? 'root';
  const password = process.env.DB_PASSWORD ?? process.env.TIDB_PASSWORD ?? '';
  const database = process.env.DB_NAME ?? process.env.TIDB_DATABASE ?? 'personal_site';
  const isRemote = host !== 'localhost' && host !== '127.0.0.1';
  const useSsl = isTiDB || process.env.DB_SSL === 'true' || (isRemote && process.env.DB_SSL !== 'false');

  return {
    host,
    port,
    user,
    password,
    database,
    ssl: useSsl ? { minVersion: 'TLSv1.2', rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' } : undefined,
    connectTimeout: 15000,
  };
}

function createPool() {
  const dbConfig = getDbConfig();
  console.log('[DB] Pool created — host:', dbConfig.host, 'user:', dbConfig.user, 'db:', dbConfig.database);
  return mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: '+00:00',
    charset: 'utf8mb4',
    typeCast(field, next) {
      // Auto-parse TINYINT(1) as boolean
      if (field.type === 'TINY' && field.length === 1) {
        return field.string() === '1';
      }
      // Auto-parse JSON fields
      if (field.type === 'JSON') {
        const value = field.string();
        if (value === null) return null;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return next();
    },
  });
}

// Singleton pool — created once per process/cold start using current env vars
const pool = createPool();

// ============================================================
// Typed Query Helpers
// ============================================================

/**
 * Execute a SELECT query and return typed rows.
 * Uses pool.query() (not pool.execute) to avoid TiDB's LIMIT/OFFSET
 * restriction on prepared statement placeholders.
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

/**
 * Execute a SELECT query and return the first row or null.
 */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/**
 * Execute an INSERT / UPDATE / DELETE and return ResultSetHeader.
 * Uses pool.query() (not pool.execute) to avoid TiDB prepared statement
 * issues with Date objects, booleans, and other parameter types.
 */
export async function execute(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  const [result] = await pool.query(sql, params);
  return result as mysql.ResultSetHeader;
}

/**
 * Run multiple operations inside a single transaction.
 * Automatically commits on success, rolls back on error.
 * Note: use conn.query() (not conn.execute()) inside fn for TiDB compatibility.
 */
export async function transaction<T>(
  fn: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/**
 * Build a paginated query helper.
 */
export function paginate(page: number, limit: number): { offset: number; limit: number } {
  // Use Math.trunc to ensure strict integers — TiDB rejects float LIMIT/OFFSET values
  const safePage = Math.max(1, Math.trunc(page));
  const safeLimit = Math.min(100, Math.max(1, Math.trunc(limit)));
  return { offset: Math.trunc((safePage - 1) * safeLimit), limit: safeLimit };
}

export default pool;
