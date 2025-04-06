import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import config from '../config';
import logger from '../utils/logger.util';

const { user, host, name: database, password, port } = config.get('database');
const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
});

const runMigrations = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations ORDER BY id ASC',
    );

    const migrationFiles = fs
      .readdirSync(path.join(__dirname, 'migrations'))
      .filter((file: string) => file.endsWith('.up.sql'))
      .sort();

    for (const file of migrationFiles) {
      const migrationName = file.replace('.up.sql', '');

      if (!executedMigrations.some((m) => m.name === migrationName)) {
        logger.info(`Running migration: ${migrationName}`);

        const sql = fs.readFileSync(
          path.join(__dirname, 'migrations', file),
          'utf8',
        );

        await client.query(sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [
          migrationName,
        ]);

        logger.info(`Migration ${migrationName} completed`);
      }
    }

    await client.query('COMMIT');
    logger.info('All migrations completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

runMigrations();
