import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/libsql';

const localDbPath = getLocalD1DB();

if (!localDbPath) {
  throw new Error(
    "Local D1 DB not found. Make sure to run 'pnpm db:setup' first."
  );
}

const mockClient = createClient({ url: `file:${localDbPath}` });
const mockDb = drizzle(mockClient);

export const auth = betterAuth({
  user: {
    additionalFields: {
      githubUsername: {
        type: 'string',
        required: false,
      },
    },
  },
  database: drizzleAdapter(mockDb, {
    provider: 'sqlite',
  }),
  socialProviders: {
    github: {
      clientId: 'dummy', // This is just for schema generation
      clientSecret: 'dummy',
      scope: ['user:email', 'read:user'],
      mapProfileToUser: (profile) => {
        return {
          githubUsername: profile.login,
        };
      },
    },
  },
});

function getLocalD1DB() {
  try {
    const basePath = path.resolve('.wrangler', 'state', 'v3', 'd1');
    const files = fs
      .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
      .filter((f) => f.endsWith('.sqlite'));

    files.sort((a, b) => {
      const statA = fs.statSync(path.join(basePath, a));
      const statB = fs.statSync(path.join(basePath, b));
      return statB.mtime.getTime() - statA.mtime.getTime();
    });

    const dbFile = files[0];
    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    return path.resolve(basePath, dbFile);
  } catch (_err) {
    return null;
  }
}
