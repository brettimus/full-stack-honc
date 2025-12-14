import type { Context } from 'hono';
import { createAuth } from '../lib/auth';
import type { AuthUser } from '../lib/auth/types';
import { authLogger } from '../lib/logger';
import type { HonoAppType } from '../types';
import { isAllowedGitHubUsername } from '../utils/allow-list';

export async function authMiddleware(
  c: Context<HonoAppType>,
  next: () => Promise<void>
) {
  const auth = createAuth(c.env);

  // Skip auth for auth routes and static assets
  const pathname = new URL(c.req.url).pathname;
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/api/dev/') ||
    pathname === '/' ||
    pathname === '/openapi.json' ||
    pathname.startsWith('/fp')
  ) {
    return next();
  }

  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      authLogger.debug('No session found, redirecting to sign-in', {
        path: pathname,
      });
      return c.redirect('/api/auth/sign-in/github');
    }

    // Optional: Check allowlist
    const user = session.user as AuthUser;
    const githubUsername = user?.githubUsername?.toLowerCase();
    if (githubUsername && !isAllowedGitHubUsername(githubUsername)) {
      authLogger.warn('User not in allowlist', { githubUsername });
      return c.text('Forbidden – ask admin for access', 403);
    }

    authLogger.debug('Session validated', {
      userId: user.id,
      path: pathname,
    });

    c.set('user', user);
    await next();
  } catch (error) {
    authLogger.error('Session validation failed', {
      path: pathname,
      error: error instanceof Error ? error.message : String(error),
    });
    return c.redirect('/api/auth/sign-in/github');
  }
}
