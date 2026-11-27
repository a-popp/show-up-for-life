import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDatabaseClient, type DatabaseClient } from '@/server/db/client';

const databaseUrl = process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase('database foundation', () => {
  let client: DatabaseClient | undefined;

  beforeAll(() => {
    if (databaseUrl) {
      client = createDatabaseClient(databaseUrl);
    }
  });

  afterAll(async () => {
    await client?.pool.end();
  });

  function requireClient(): DatabaseClient {
    if (!client) {
      throw new Error('DATABASE_URL is required for integration tests.');
    }
    return client;
  }

  it('connects to PostgreSQL', async () => {
    const result = await requireClient().db.execute(sql`select 1 as value`);
    expect(result.rows[0]).toMatchObject({ value: 1 });
  });

  it('contains the foundational auth, job, and outbox tables', async () => {
    const result = await requireClient().db.execute(sql`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name in ('user', 'session', 'account', 'verification', 'job_queue', 'outbox_messages')
    `);

    const tableNames = result.rows.map((row) => row.table_name).sort();
    expect(tableNames).toEqual([
      'account',
      'job_queue',
      'outbox_messages',
      'session',
      'user',
      'verification',
    ]);
  });
});
