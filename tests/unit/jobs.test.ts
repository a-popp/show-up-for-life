import { describe, expect, it } from 'vitest';
import { calculateBackoffMs } from '@/server/jobs/queue';

describe('calculateBackoffMs', () => {
  it('uses exponential backoff', () => {
    expect(calculateBackoffMs(1, 100)).toBe(100);
    expect(calculateBackoffMs(2, 100)).toBe(200);
    expect(calculateBackoffMs(3, 100)).toBe(400);
  });

  it('caps backoff at the configured maximum', () => {
    expect(calculateBackoffMs(20, 100, 1_000)).toBe(1_000);
  });
});
