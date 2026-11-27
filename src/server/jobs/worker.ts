import { randomUUID } from 'node:crypto';
import { closeDatabase, getDatabase } from '@/server/db/client';
import { installGracefulShutdown } from '@/server/jobs/shutdown';
import { JobWorker } from '@/server/jobs/worker-runner';
import { logger } from '@/server/logging/logger';

const workerId = `worker-${randomUUID()}`;
const { db } = getDatabase();

const handlers = new Map([
  [
    'diagnostic.noop',
    async () => {
      logger.info({ workerId }, 'Processed diagnostic no-op job');
    },
  ],
]);

const worker = new JobWorker({
  db,
  workerId,
  handlers,
  logger,
});

installGracefulShutdown(() => {
  logger.info({ workerId }, 'Worker shutdown requested');
  worker.stop();
});

logger.info({ workerId }, 'Worker starting');
if (process.argv.includes('--once')) {
  await worker.processOnce();
} else {
  await worker.start();
}
await closeDatabase();
