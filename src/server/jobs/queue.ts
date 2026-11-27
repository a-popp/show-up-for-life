import { and, eq, sql } from 'drizzle-orm';
import type { Database } from '@/server/db/client';
import {
  jobQueue,
  outboxMessages,
  type JobQueueRow,
  type NewJobQueueRow,
  type NewOutboxMessageRow,
  type OutboxMessageRow,
} from '@/server/db/schema';

export type JobHandler = (job: JobQueueRow) => Promise<void>;

function coerceDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  throw new TypeError('Expected a database timestamp value.');
}

function coerceNullableDate(value: unknown): Date | null {
  return value == null ? null : coerceDate(value);
}

function mapJobQueueRow(row: unknown): JobQueueRow {
  const typed = row as JobQueueRow;
  return {
    ...typed,
    runAt: coerceDate(typed.runAt),
    claimedAt: coerceNullableDate(typed.claimedAt),
    createdAt: coerceDate(typed.createdAt),
    updatedAt: coerceDate(typed.updatedAt),
    completedAt: coerceNullableDate(typed.completedAt),
  };
}

function mapOutboxMessageRow(row: unknown): OutboxMessageRow {
  const typed = row as OutboxMessageRow;
  return {
    ...typed,
    createdAt: coerceDate(typed.createdAt),
    processedAt: coerceNullableDate(typed.processedAt),
  };
}

export interface EnqueueJobInput {
  type: string;
  payload: Record<string, unknown>;
  runAt?: Date;
  idempotencyKey?: string;
  maxAttempts?: number;
}

export interface EnqueueOutboxInput {
  type: string;
  payload: Record<string, unknown>;
  idempotencyKey?: string;
}

export function calculateBackoffMs(
  attempt: number,
  baseMs = 1_000,
  maxMs = 60_000,
): number {
  if (attempt < 1) {
    return baseMs;
  }

  return Math.min(baseMs * 2 ** (attempt - 1), maxMs);
}

export async function enqueueJob(
  db: Database,
  input: EnqueueJobInput,
): Promise<{ job: JobQueueRow; inserted: boolean }> {
  const values: NewJobQueueRow = {
    type: input.type,
    payload: input.payload,
    runAt: input.runAt ?? new Date(),
    idempotencyKey: input.idempotencyKey,
    maxAttempts: input.maxAttempts ?? 5,
  };

  const inserted = await db
    .insert(jobQueue)
    .values(values)
    .onConflictDoNothing({ target: jobQueue.idempotencyKey })
    .returning();

  if (inserted[0]) {
    return { job: inserted[0], inserted: true };
  }

  if (!input.idempotencyKey) {
    throw new Error(
      'Job insertion failed without an idempotency key conflict.',
    );
  }

  const existing = await db
    .select()
    .from(jobQueue)
    .where(eq(jobQueue.idempotencyKey, input.idempotencyKey))
    .limit(1);

  if (!existing[0]) {
    throw new Error(
      'Job insertion conflicted but the existing job could not be loaded.',
    );
  }

  return { job: existing[0], inserted: false };
}

export async function claimJobs(
  db: Database,
  workerId: string,
  batchSize: number,
): Promise<JobQueueRow[]> {
  const result = await db.execute(sql`
    with candidate as (
      select id
      from job_queue
      where status = 'pending'
        and run_at <= now()
      order by run_at asc
      limit ${batchSize}
      for update skip locked
    )
    update job_queue as job
    set
      status = 'claimed',
      claimed_at = now(),
      claimed_by = ${workerId},
      attempts = job.attempts + 1,
      updated_at = now()
    from candidate
    where job.id = candidate.id
    returning
      job.id,
      job.type,
      job.payload,
      job.idempotency_key as "idempotencyKey",
      job.status,
      job.run_at as "runAt",
      job.claimed_at as "claimedAt",
      job.claimed_by as "claimedBy",
      job.attempts,
      job.max_attempts as "maxAttempts",
      job.last_error as "lastError",
      job.created_at as "createdAt",
      job.updated_at as "updatedAt",
      job.completed_at as "completedAt"
  `);

  return result.rows.map(mapJobQueueRow);
}

export async function completeJob(
  db: Database,
  jobId: string,
  workerId: string,
): Promise<void> {
  await db
    .update(jobQueue)
    .set({
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(jobQueue.id, jobId), eq(jobQueue.claimedBy, workerId)));
}

export async function failJob(
  db: Database,
  job: JobQueueRow,
  workerId: string,
  error: unknown,
): Promise<void> {
  const message =
    error instanceof Error ? error.message : 'Unknown job failure';
  const final = job.attempts >= job.maxAttempts;
  const runAt = final
    ? job.runAt
    : new Date(Date.now() + calculateBackoffMs(job.attempts));

  await db
    .update(jobQueue)
    .set({
      status: final ? 'failed_final' : 'failed_retryable',
      runAt,
      lastError: message,
      updatedAt: new Date(),
    })
    .where(and(eq(jobQueue.id, job.id), eq(jobQueue.claimedBy, workerId)));
}

export async function releaseClaimedJob(
  db: Database,
  jobId: string,
  workerId: string,
): Promise<void> {
  await db
    .update(jobQueue)
    .set({
      status: 'pending',
      claimedAt: null,
      claimedBy: null,
      updatedAt: new Date(),
    })
    .where(and(eq(jobQueue.id, jobId), eq(jobQueue.claimedBy, workerId)));
}

export async function retryableJobsToPending(db: Database): Promise<void> {
  await db
    .update(jobQueue)
    .set({
      status: 'pending',
      claimedAt: null,
      claimedBy: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(jobQueue.status, 'failed_retryable'),
        sql`${jobQueue.runAt} <= now()`,
      ),
    );
}

export async function enqueueOutboxMessage(
  db: Database,
  input: EnqueueOutboxInput,
): Promise<{ message: OutboxMessageRow; inserted: boolean }> {
  const values: NewOutboxMessageRow = {
    type: input.type,
    payload: input.payload,
    idempotencyKey: input.idempotencyKey,
  };

  const inserted = await db
    .insert(outboxMessages)
    .values(values)
    .onConflictDoNothing({ target: outboxMessages.idempotencyKey })
    .returning();

  if (inserted[0]) {
    return { message: inserted[0], inserted: true };
  }

  if (!input.idempotencyKey) {
    throw new Error(
      'Outbox insertion failed without an idempotency key conflict.',
    );
  }

  const existing = await db
    .select()
    .from(outboxMessages)
    .where(eq(outboxMessages.idempotencyKey, input.idempotencyKey))
    .limit(1);

  if (!existing[0]) {
    throw new Error(
      'Outbox insertion conflicted but the existing message could not be loaded.',
    );
  }

  return { message: existing[0], inserted: false };
}

export async function claimOutboxMessages(
  db: Database,
  batchSize: number,
): Promise<OutboxMessageRow[]> {
  const result = await db.execute(sql`
    with candidate as (
      select id
      from outbox_messages
      where status = 'pending'
      order by created_at asc
      limit ${batchSize}
      for update skip locked
    )
    update outbox_messages as message
    set
      status = 'processing',
      attempts = message.attempts + 1
    from candidate
    where message.id = candidate.id
    returning
      message.id,
      message.type,
      message.payload,
      message.idempotency_key as "idempotencyKey",
      message.status,
      message.attempts,
      message.last_error as "lastError",
      message.created_at as "createdAt",
      message.processed_at as "processedAt"
  `);

  return result.rows.map(mapOutboxMessageRow);
}

export async function markOutboxProcessed(
  db: Database,
  messageId: string,
): Promise<void> {
  await db
    .update(outboxMessages)
    .set({ status: 'processed', processedAt: new Date() })
    .where(eq(outboxMessages.id, messageId));
}

export async function markOutboxFailed(
  db: Database,
  messageId: string,
  error: unknown,
  final = false,
): Promise<void> {
  await db
    .update(outboxMessages)
    .set({
      status: final ? 'failed_final' : 'failed_retryable',
      lastError:
        error instanceof Error ? error.message : 'Unknown outbox failure',
    })
    .where(eq(outboxMessages.id, messageId));
}
