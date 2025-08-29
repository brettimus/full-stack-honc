import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Re-export Better Auth tables
export * from './auth';
import { user } from './auth';

// Comments table - associated with authenticated users
export const comments = sqliteTable('comments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type NewComment = typeof comments.$inferInsert;
