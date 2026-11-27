import pino from 'pino';

export const logRedactionPaths = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'password',
  'secret',
  'token',
  'apiKey',
  'api_key',
  'authorization',
  'req.headers.authorization',
  'request.headers.authorization',
  '*.password',
  '*.secret',
  '*.token',
  '*.apiKey',
  '*.api_key',
  '*.DATABASE_URL',
  '*.BETTER_AUTH_SECRET',
] as const;

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: [...logRedactionPaths],
    censor: '[redacted]',
  },
  base: {
    service: 'show-up-for-life',
  },
});

export type Logger = typeof logger;
