import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseEnv, isProduction } from '@/server/config/env';
import * as schema from '@/server/db/schema';

export type Database = NodePgDatabase<typeof schema>;
export type DatabaseClient = ReturnType<typeof createDatabaseClient>;

export function createDatabaseClient(connectionString: string) {
  const pool = new Pool({
    connectionString,
    ssl: isProduction() ? { rejectUnauthorized: true } : undefined,
  });
  const db = drizzle(pool, { schema });

  return { pool, db };
}

const globalForDatabase = globalThis as unknown as {
  showUpForLifeDatabase?: DatabaseClient;
};

export function getDatabase(): DatabaseClient {
  if (!globalForDatabase.showUpForLifeDatabase) {
    const { DATABASE_URL } = getDatabaseEnv();
    globalForDatabase.showUpForLifeDatabase =
      createDatabaseClient(DATABASE_URL);
  }

  return globalForDatabase.showUpForLifeDatabase;
}

export async function closeDatabase(): Promise<void> {
  if (globalForDatabase.showUpForLifeDatabase) {
    await globalForDatabase.showUpForLifeDatabase.pool.end();
    globalForDatabase.showUpForLifeDatabase = undefined;
  }
}
