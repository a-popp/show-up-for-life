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

export const outboxStatus = pgEnum('outbox_status', [
  'pending',
  'processing',
  'processed',
  'failed_retryable',
  'failed_final',
  'cancelled',
]);

export const outboxMessages = pgTable(
  'outbox_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    idempotencyKey: text('idempotency_key'),
    status: outboxStatus('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    lastError: text('last_error'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    processedAt: timestamp('processed_at', {
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => [
    index('outbox_messages_status_created_at_idx').on(
      table.status,
      table.createdAt,
    ),
    uniqueIndex('outbox_messages_idempotency_key_idx').on(table.idempotencyKey),
  ],
);

export type OutboxMessageRow = typeof outboxMessages.$inferSelect;
export type NewOutboxMessageRow = typeof outboxMessages.$inferInsert;
