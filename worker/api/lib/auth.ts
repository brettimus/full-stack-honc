import { getLogger } from '@logtape/logtape';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { account, session, user, verification } from '../db/schema';

const logger = getLogger(['honc', 'auth']);

interface Env {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  DB: D1Database;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

export const createAuth = (env: Env) => {
  const db = drizzle(env.DB);

  return betterAuth({
    user: {
      additionalFields: {
        githubUsername: {
          type: 'string',
          required: false,
        },
      },
      deleteUser: {
        enabled: true,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days (fixes 5-minute default timeout)
      },
    },
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: user,
        session: session,
        account: account,
        verification: verification,
      },
    }),
    emailAndPassword: {
      enabled: false, // OAuth only
    },
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID || '',
        clientSecret: env.GITHUB_CLIENT_SECRET || '',
        scope: ['user:email', 'read:user'],
        mapProfileToUser: (profile) => {
          return {
            githubUsername: profile.login,
          };
        },
      },
    },
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    advanced: {
      cookiePrefix: 'honc',
    },
    logger: {
      level: 'debug',
      log: (level, message, ...args) => {
        const serializedArgs = args.map((arg) => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              const seen = new WeakSet();
              return JSON.stringify(
                arg,
                (_key, value) => {
                  if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                      return '[Circular Reference]';
                    }
                    seen.add(value);
                  }
                  return value;
                },
                2
              );
            } catch (error) {
              return `[Object serialization failed: ${error instanceof Error ? error.message : 'Unknown error'}]`;
            }
          }
          return arg;
        });
        logger.debug(`[BetterAuth][${level}] ${message}`, {
          args: serializedArgs,
        });
      },
    },
  });
};

export type Auth = ReturnType<typeof createAuth>;
