import sql from 'mssql';
import { config } from '@/config';

/**
 * @summary
 * Database connection pool management
 *
 * @module instances/database
 */

let pool: sql.ConnectionPool | null = null;

/**
 * @summary
 * Gets or creates database connection pool
 *
 * @function getPool
 * @module instances/database
 *
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 *
 * @throws {Error} When connection fails
 *
 * @example
 * const pool = await getPool();
 * const result = await pool.request().query('SELECT * FROM table');
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    const dbConfig: sql.config = {
      server: config.database.server,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      options: {
        encrypt: config.database.options.encrypt,
        trustServerCertificate: config.database.options.trustServerCertificate,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };

    pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('Database connection established');
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

/**
 * @summary
 * Closes database connection pool
 *
 * @function closePool
 * @module instances/database
 *
 * @returns {Promise<void>}
 *
 * @example
 * await closePool();
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection closed');
  }
}
