import { randomUUID } from 'node:crypto';
import path from 'node:path';

/**
 * Utility function to get the local D1 database path
 * @returns The path to the local D1 database file
 */
export const getLocalD1DbPath = (): string => {
  const uuid = randomUUID();
  const localDbPath = path.join(
    process.cwd(),
    '.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
    `${uuid}.sqlite`
  );

  return `file:${localDbPath}`;
};
