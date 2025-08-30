import { type SQL, sql } from 'drizzle-orm';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const currentTimestamp = () => {
  return sql`(CURRENT_TIMESTAMP)`;
};

export const lower = (email: AnySQLiteColumn): SQL => {
  return sql`lower(${email})`;
};
