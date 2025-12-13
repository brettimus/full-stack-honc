import type { Context, Next } from 'hono';
import { apiLogger } from '../lib/logger';

/**
 * Middleware that logs incoming requests and outgoing responses.
 * Logs method, path, status code, and duration.
 */
export async function requestLogger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = new URL(c.req.url).pathname;

  // Skip logging for noisy endpoints
  if (path === '/openapi.json' || path.startsWith('/fp')) {
    return next();
  }

  apiLogger.info('Incoming request', { method, path });

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  if (status >= 500) {
    apiLogger.error('Request completed with error', {
      method,
      path,
      status,
      duration,
    });
  } else if (status >= 400) {
    apiLogger.warn('Request completed with client error', {
      method,
      path,
      status,
      duration,
    });
  } else {
    apiLogger.info('Request completed', { method, path, status, duration });
  }
}
