import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAuthEnv, getDatabaseEnv } from '@/server/config/env';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('environment validation', () => {
  it('accepts a valid database URL', () => {
    vi.stubEnv(
      'DATABASE_URL',
      'postgresql://showup@localhost:5432/showup_for_life',
    );

    expect(getDatabaseEnv().DATABASE_URL).toBe(
      'postgresql://showup@localhost:5432/showup_for_life',
    );
  });

  it('rejects a missing database URL', () => {
    vi.stubEnv('DATABASE_URL', '');

    expect(() => getDatabaseEnv()).toThrow();
  });

  it('requires an auth secret of at least 32 characters', () => {
    vi.stubEnv('BETTER_AUTH_SECRET', 'x'.repeat(32));
    vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000');

    expect(getAuthEnv().BETTER_AUTH_URL).toBe('http://localhost:3000');
  });

  it('rejects a short auth secret', () => {
    vi.stubEnv('BETTER_AUTH_SECRET', 'short');
    vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000');

    expect(() => getAuthEnv()).toThrow();
  });

  it('requires an explicit auth URL in production', () => {
    vi.stubEnv('APP_ENV', 'production');
    vi.stubEnv('BETTER_AUTH_SECRET', 'x'.repeat(32));
    vi.stubEnv('BETTER_AUTH_URL', undefined);

    expect(() => getAuthEnv()).toThrow();
  });

  it('accepts an explicit auth URL in production', () => {
    vi.stubEnv('APP_ENV', 'production');
    vi.stubEnv('BETTER_AUTH_SECRET', 'x'.repeat(32));
    vi.stubEnv('BETTER_AUTH_URL', 'https://example.com');

    expect(getAuthEnv().BETTER_AUTH_URL).toBe('https://example.com');
  });

  it('does not require auth configuration when importing the auth module', async () => {
    vi.stubEnv('BETTER_AUTH_SECRET', '');

    await expect(import('@/server/auth')).resolves.toBeDefined();
  });
});
