import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getDatabase } from '@/server/db/client';
import { logger } from '@/server/logging/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { db } = getDatabase();
    await db.execute(sql`select 1`);
    await db.execute(
      sql`select count(*)::int as migration_count from drizzle.__drizzle_migrations`,
    );
    return NextResponse.json({ status: 'ready' });
  } catch (error) {
    logger.error(
      { errorName: error instanceof Error ? error.name : 'unknown' },
      'Readiness check failed',
    );
    return NextResponse.json({ status: 'not_ready' }, { status: 503 });
  }
}
