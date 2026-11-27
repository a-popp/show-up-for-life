import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { getAuthEnv } from '@/server/config/env';
import { getDatabase } from '@/server/db/client';
import * as schema from '@/server/db/schema';

export function createAuth() {
  const authEnv = getAuthEnv();
  const { db } = getDatabase();

  return betterAuth({
    appName: 'Show Up For Life',
    baseURL: authEnv.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
      transaction: true,
    }),
    emailAndPassword: {
      enabled: false,
    },
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  authInstance ??= createAuth();
  return authInstance;
}
