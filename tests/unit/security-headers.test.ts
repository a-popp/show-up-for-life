import { describe, expect, it } from 'vitest';
import { securityHeaders } from '../../next.config';

describe('security headers', () => {
  it('includes baseline browser protections', () => {
    const headers = new Map(
      securityHeaders.map((header) => [header.key, header.value]),
    );

    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('Referrer-Policy')).toBe(
      'strict-origin-when-cross-origin',
    );
    expect(headers.get('Permissions-Policy')).toContain('geolocation=()');
    expect(headers.get('Content-Security-Policy')).toContain(
      "default-src 'self'",
    );
    expect(headers.get('Content-Security-Policy')).toContain(
      "frame-ancestors 'none'",
    );
  });
});
