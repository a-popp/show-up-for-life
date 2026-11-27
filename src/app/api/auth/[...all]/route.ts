import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const lazyAuthHandler = async (request: Request) => getAuth().handler(request);

export const { GET, POST } = toNextJsHandler(lazyAuthHandler);
