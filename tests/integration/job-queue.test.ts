import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDatabaseClient, type DatabaseClient } from '@/server/db/client';
import { jobQueue, outboxMessages } from '@/server/db/schema';
import {
  claimJobs,
  claimOutboxMessages,
  completeJob,
  enqueueJob,
  enqueueOutboxMessage,
  failJob,
  markOutboxProcessed,
} from '@/server/jobs/queue';

const databaseUrl = process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase('job and outbox primitives', () => {
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

  it('enqueues jobs idempotently', async () => {
    const idempotencyKey = `test-job-${randomUUID()}`;
    const input = {
      type: 'diagnostic.noop',
      payload: { test: true },
      idempotencyKey,
      runAt: new Date(),
    };

    const first = await enqueueJob(requireClient().db, input);
    const second = await enqueueJob(requireClient().db, input);

    expect(first.inserted).toBe(true);
    expect(second.inserted).toBe(false);
    expect(second.job.id).toBe(first.job.id);
  });

  it('claims and completes a pending job', async () => {
    const workerId = `test-worker-${randomUUID()}`;
    const enqueued = await enqueueJob(requireClient().db, {
      type: 'diagnostic.noop',
      payload: { test: true },
      idempotencyKey: `test-claim-${randomUUID()}`,
      runAt: new Date(),
    });

    const claimed = await claimJobs(requireClient().db, workerId, 10);
    const job = claimed.find((candidate) => candidate.id === enqueued.job.id);

    expect(job).toBeDefined();
    expect(job?.status).toBe('claimed');
    expect(job?.attempts).toBe(1);

    await completeJob(requireClient().db, enqueued.job.id, workerId);
    const rows = await requireClient()
      .db.select()
      .from(jobQueue)
      .where(eq(jobQueue.id, enqueued.job.id));
    expect(rows[0]?.status).toBe('completed');
    expect(rows[0]?.completedAt).not.toBeNull();
  });

  it('marks a job as finally failed when attempts are exhausted', async () => {
    const workerId = `test-worker-${randomUUID()}`;
    const enqueued = await enqueueJob(requireClient().db, {
      type: 'diagnostic.noop',
      payload: { test: true },
      idempotencyKey: `test-fail-${randomUUID()}`,
      runAt: new Date(),
      maxAttempts: 1,
    });

    const claimed = await claimJobs(requireClient().db, workerId, 10);
    const job = claimed.find((candidate) => candidate.id === enqueued.job.id);
    expect(job).toBeDefined();

    if (job) {
      await failJob(
        requireClient().db,
        job,
        workerId,
        new Error('expected test failure'),
      );
    }

    const rows = await requireClient()
      .db.select()
      .from(jobQueue)
      .where(eq(jobQueue.id, enqueued.job.id));
    expect(rows[0]?.status).toBe('failed_final');
    expect(rows[0]?.lastError).toBe('expected test failure');
  });

  it('enqueues, claims, and processes outbox messages idempotently', async () => {
    const idempotencyKey = `test-outbox-${randomUUID()}`;
    const input = {
      type: 'diagnostic.outbox',
      payload: { test: true },
      idempotencyKey,
    };

    const first = await enqueueOutboxMessage(requireClient().db, input);
    const second = await enqueueOutboxMessage(requireClient().db, input);
    expect(first.inserted).toBe(true);
    expect(second.inserted).toBe(false);
    expect(second.message.id).toBe(first.message.id);

    const claimed = await claimOutboxMessages(requireClient().db, 10);
    const message = claimed.find(
      (candidate) => candidate.id === first.message.id,
    );
    expect(message).toBeDefined();
    expect(message?.status).toBe('processing');

    await markOutboxProcessed(requireClient().db, first.message.id);
    const rows = await requireClient()
      .db.select()
      .from(outboxMessages)
      .where(eq(outboxMessages.id, first.message.id));
    expect(rows[0]?.status).toBe('processed');
    expect(rows[0]?.processedAt).not.toBeNull();
  });
});
