import { existsSync } from 'node:fs';
import { z } from 'zod';

let attemptedLocalEnvLoad = false;

export function loadLocalEnv(): void {
  if (attemptedLocalEnvLoad || process.env.NODE_ENV === 'production') {
    return;
  }

  attemptedLocalEnvLoad = true;
  if (existsSync('.env.local')) {
    process.loadEnvFile('.env.local');
  }
}

const appEnvSchema = z.object({
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_BASE_URL: z.url().default('http://localhost:3000'),
});

const databaseEnvSchema = z.object({
  DATABASE_URL: z.url(),
});

const authEnvSchema = z
  .object({
    APP_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url().optional(),
  })
  .refine(
    (value) =>
      !(
        (value.APP_ENV === 'production' ||
          process.env.NODE_ENV === 'production') &&
        !value.BETTER_AUTH_URL
      ),
    {
      message: 'BETTER_AUTH_URL is required in production',
      path: ['BETTER_AUTH_URL'],
    },
  )
  .transform((value) => ({
    BETTER_AUTH_SECRET: value.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: value.BETTER_AUTH_URL ?? 'http://localhost:3000',
  }));

export type AppEnv = z.infer<typeof appEnvSchema>;
export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
export type AuthEnv = z.infer<typeof authEnvSchema>;

export function getAppEnv(): AppEnv {
  loadLocalEnv();
  return appEnvSchema.parse(process.env);
}

export function getDatabaseEnv(): DatabaseEnv {
  loadLocalEnv();
  return databaseEnvSchema.parse(process.env);
}

export function getAuthEnv(): AuthEnv {
  loadLocalEnv();
  return authEnvSchema.parse(process.env);
}

export function isProduction(): boolean {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.APP_ENV === 'production'
  );
}
