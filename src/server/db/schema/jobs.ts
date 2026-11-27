import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const jobStatus = pgEnum('job_status', [
  'pending',
  'claimed',
  'completed',
  'failed_retryable',
  'failed_final',
  'cancelled',
]);

export const jobQueue = pgTable(
  'job_queue',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    idempotencyKey: text('idempotency_key'),
    status: jobStatus('status').notNull().default('pending'),
    runAt: timestamp('run_at', { withTimezone: true, mode: 'date' }).notNull(),
    claimedAt: timestamp('claimed_at', { withTimezone: true, mode: 'date' }),
    claimedBy: text('claimed_by'),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(5),
    lastError: text('last_error'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    completedAt: timestamp('completed_at', {
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => [
    index('job_queue_status_run_at_idx').on(table.status, table.runAt),
    uniqueIndex('job_queue_idempotency_key_idx').on(table.idempotencyKey),
  ],
);

export type JobQueueRow = typeof jobQueue.$inferSelect;
export type NewJobQueueRow = typeof jobQueue.$inferInsert;
