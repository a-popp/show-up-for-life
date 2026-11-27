import type { Database } from '@/server/db/client';
import type { JobQueueRow } from '@/server/db/schema';
import {
  claimJobs,
  completeJob,
  failJob,
  retryableJobsToPending,
  type JobHandler,
} from '@/server/jobs/queue';

export interface WorkerLogger {
  info: (obj: Record<string, unknown>, message: string) => void;
  warn: (obj: Record<string, unknown>, message: string) => void;
  error: (obj: Record<string, unknown>, message: string) => void;
}

export interface JobWorkerOptions {
  db: Database;
  workerId: string;
  handlers: ReadonlyMap<string, JobHandler>;
  logger: WorkerLogger;
  batchSize?: number;
  pollIntervalMs?: number;
}

export class JobWorker {
  private running = false;

  private readonly shutdownController = new AbortController();

  private readonly batchSize: number;

  private readonly pollIntervalMs: number;

  constructor(private readonly options: JobWorkerOptions) {
    this.batchSize = options.batchSize ?? 10;
    this.pollIntervalMs = options.pollIntervalMs ?? 5_000;
  }

  async start(): Promise<void> {
    this.running = true;

    while (this.running) {
      try {
        const processed = await this.processOnce();
        if (processed === 0) {
          await this.waitForNextPoll();
        }
      } catch (error) {
        this.options.logger.error(
          { errorName: error instanceof Error ? error.name : 'unknown' },
          'Worker polling failed',
        );
        await this.waitForNextPoll();
      }
    }
  }

  stop(): void {
    this.running = false;
    this.shutdownController.abort();
  }

  private waitForNextPoll(): Promise<void> {
    if (this.shutdownController.signal.aborted) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const finish = () => {
        clearTimeout(timeout);
        this.shutdownController.signal.removeEventListener('abort', finish);
        resolve();
      };
      const timeout = setTimeout(finish, this.pollIntervalMs);
      this.shutdownController.signal.addEventListener('abort', finish, {
        once: true,
      });
    });
  }

  async processOnce(): Promise<number> {
    await retryableJobsToPending(this.options.db);
    const jobs = await claimJobs(
      this.options.db,
      this.options.workerId,
      this.batchSize,
    );

    for (const job of jobs) {
      await this.processJob(job);
    }

    return jobs.length;
  }

  private async processJob(job: JobQueueRow): Promise<void> {
    const handler = this.options.handlers.get(job.type);

    if (!handler) {
      await failJob(
        this.options.db,
        job,
        this.options.workerId,
        new Error(`No handler registered for job type: ${job.type}`),
      );
      return;
    }

    try {
      await handler(job);
      await completeJob(this.options.db, job.id, this.options.workerId);
    } catch (error) {
      await failJob(this.options.db, job, this.options.workerId, error);
    }
  }
}
