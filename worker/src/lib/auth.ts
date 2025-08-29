import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { account, session, user, verification } from '../db/schema';

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
      cookiePrefix: 'hackday-cf-vite',
    },
    logger: {
      level: 'debug',
      log: (level, message, ...args) => {
        console.log(`[BetterAuth][${level}]`, message, ...args);
      },
    },
  });
};

export type Auth = ReturnType<typeof createAuth>;
