import type { Context } from 'hono';
import { createAuth } from '../lib/auth';
import { authLogger } from '../lib/logger';
import { isAllowedGitHubUsername } from '../utils/allow-list';

interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  githubUsername?: string;
}

interface Env {
  DB: D1Database;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

type Variables = {
  user: {
    id: string;
    name: string;
    email?: string;
    githubUsername?: string;
  };
};

export async function authMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
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
    const githubUsername = (
      session.user as SessionUser
    )?.githubUsername?.toLowerCase();
    if (githubUsername && !isAllowedGitHubUsername(githubUsername)) {
      authLogger.warn('User not in allowlist', { githubUsername });
      return c.text('Forbidden – ask admin for access', 403);
    }

    authLogger.debug('Session validated', {
      userId: session.user.id,
      path: pathname,
    });

    c.set('user', session.user as Variables['user']);
    await next();
  } catch (error) {
    authLogger.error('Session validation failed', {
      path: pathname,
      error: error instanceof Error ? error.message : String(error),
    });
    return c.redirect('/api/auth/sign-in/github');
  }
}
