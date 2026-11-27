import { describe, expect, it } from 'vitest';
import { logRedactionPaths } from '@/server/logging/logger';

describe('logging redaction configuration', () => {
  it('redacts credential-like fields', () => {
    for (const path of ['password', 'secret', 'token', 'authorization']) {
      expect(logRedactionPaths).toContain(path);
    }
  });

  it('redacts auth and database environment values if accidentally logged', () => {
    expect(logRedactionPaths).toContain('DATABASE_URL');
    expect(logRedactionPaths).toContain('BETTER_AUTH_SECRET');
  });
});
