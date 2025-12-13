import { createFiberplane } from '@fiberplane/hono';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { describeRoute, openAPISpecs } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import * as schema from './db/schema';
import {
  ZCommentByIDParams,
  ZCommentInsert,
  ZCommentUpdate,
  ZCommentWithUser,
  ZUserByIDParams,
  ZUserSelect,
} from './dtos';
import { createAuth } from './lib/auth';
import { prepareErrorForLogging } from './lib/errors';
import { apiLogger } from './lib/logger';
import { authMiddleware } from './middleware/auth';
import { dbProvider } from './middleware/dbProvider';
import { requestLogger } from './middleware/requestLogger';
import { zodValidator } from './middleware/validator';

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

const api = new Hono<{ Bindings: Env; Variables: Variables }>()
  .use('*', dbProvider)
  .get(
    '/health',
    describeRoute({
      responses: {
        200: {
          description: 'API health check successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  timestamp: { type: 'string' },
                  database: { type: 'string' },
                },
              },
            },
          },
        },
      },
    }),
    async (c) => {
      const db = c.var.db;

      // Test database connection
      try {
        await db.select().from(schema.comments).limit(1);
        apiLogger.debug('Health check passed', { database: 'connected' });
        return c.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'connected',
        });
      } catch (error) {
        apiLogger.warn('Health check database error', {
          error: error instanceof Error ? error.message : String(error),
        });
        return c.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'error',
        });
      }
    }
  )
  .get(
    '/users',
    describeRoute({
      responses: {
        200: {
          description: 'Users queried successfully',
          content: {
            'application/json': {
              schema: resolver(ZUserSelect.array()),
            },
          },
        },
      },
    }),
    async (c) => {
      const db = c.var.db;
      const users = await db.select().from(schema.user);

      return c.json(users);
    }
  )
  .get(
    '/users/:id',
    describeRoute({
      responses: {
        200: {
          description: 'User queried by ID successfully',
          content: {
            'application/json': {
              schema: resolver(ZUserSelect),
            },
          },
        },
        404: {
          description: 'User with provided ID not found',
        },
      },
    }),
    zodValidator('param', ZUserByIDParams),
    async (c) => {
      const db = c.var.db;
      const { id } = c.req.valid('param');

      const [user] = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, id));

      if (!user) {
        return c.notFound();
      }

      return c.json(user);
    }
  )
  .get(
    '/comments',
    describeRoute({
      responses: {
        200: {
          description: 'Comments queried successfully',
          content: {
            'application/json': {
              schema: resolver(ZCommentWithUser.array()),
            },
          },
        },
      },
    }),
    async (c) => {
      const db = c.var.db;

      const comments = await db
        .select({
          id: schema.comments.id,
          content: schema.comments.content,
          userId: schema.comments.userId,
          createdAt: schema.comments.createdAt,
          updatedAt: schema.comments.updatedAt,
          user: {
            id: schema.user.id,
            name: schema.user.name,
            githubUsername: schema.user.githubUsername,
            image: schema.user.image,
          },
        })
        .from(schema.comments)
        .leftJoin(schema.user, eq(schema.comments.userId, schema.user.id))
        .orderBy(schema.comments.createdAt);

      return c.json(comments);
    }
  )
  .post(
    '/comments',
    describeRoute({
      responses: {
        201: {
          description: 'Comment created successfully',
          content: {
            'application/json': {
              schema: resolver(ZCommentWithUser),
            },
          },
        },
      },
    }),
    zodValidator('json', ZCommentInsert),
    async (c) => {
      const db = c.var.db;
      const user = c.get('user');
      const { content } = c.req.valid('json');

      const [newComment] = await db
        .insert(schema.comments)
        .values({
          content,
          userId: user.id,
        })
        .returning();

      // Fetch the comment with user info
      const [commentWithUser] = await db
        .select({
          id: schema.comments.id,
          content: schema.comments.content,
          userId: schema.comments.userId,
          createdAt: schema.comments.createdAt,
          updatedAt: schema.comments.updatedAt,
          user: {
            id: schema.user.id,
            name: schema.user.name,
            githubUsername: schema.user.githubUsername,
            image: schema.user.image,
          },
        })
        .from(schema.comments)
        .leftJoin(schema.user, eq(schema.comments.userId, schema.user.id))
        .where(eq(schema.comments.id, newComment.id));

      return c.json(commentWithUser, 201);
    }
  )
  .get(
    '/comments/:id',
    describeRoute({
      responses: {
        200: {
          description: 'Comment queried by ID successfully',
          content: {
            'application/json': {
              schema: resolver(ZCommentWithUser),
            },
          },
        },
        404: {
          description: 'Comment with provided ID not found',
        },
      },
    }),
    zodValidator('param', ZCommentByIDParams),
    async (c) => {
      const db = c.var.db;
      const { id } = c.req.valid('param');

      const [comment] = await db
        .select({
          id: schema.comments.id,
          content: schema.comments.content,
          userId: schema.comments.userId,
          createdAt: schema.comments.createdAt,
          updatedAt: schema.comments.updatedAt,
          user: {
            id: schema.user.id,
            name: schema.user.name,
            githubUsername: schema.user.githubUsername,
            image: schema.user.image,
          },
        })
        .from(schema.comments)
        .leftJoin(schema.user, eq(schema.comments.userId, schema.user.id))
        .where(eq(schema.comments.id, id));

      if (!comment) {
        return c.json({ message: 'Comment not found' }, 404);
      }

      return c.json(comment);
    }
  )
  .put(
    '/comments/:id',
    describeRoute({
      responses: {
        200: {
          description: 'Comment updated successfully',
          content: {
            'application/json': {
              schema: resolver(ZCommentWithUser),
            },
          },
        },
        404: {
          description: 'Comment with provided ID not found',
        },
        403: {
          description: 'Forbidden - can only update your own comments',
        },
      },
    }),
    zodValidator('param', ZCommentByIDParams),
    zodValidator('json', ZCommentUpdate),
    async (c) => {
      const db = c.var.db;
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { content } = c.req.valid('json');

      // Check if comment exists and belongs to current user
      const [existingComment] = await db
        .select()
        .from(schema.comments)
        .where(eq(schema.comments.id, id));

      if (!existingComment) {
        return c.json({ message: 'Comment not found' }, 404);
      }

      if (existingComment.userId !== user.id) {
        return c.json(
          { message: 'Forbidden - can only update your own comments' },
          403
        );
      }

      // Update the comment
      await db
        .update(schema.comments)
        .set({
          content,
          updatedAt: new Date(),
        })
        .where(eq(schema.comments.id, id));

      // Fetch updated comment with user info
      const [updatedComment] = await db
        .select({
          id: schema.comments.id,
          content: schema.comments.content,
          userId: schema.comments.userId,
          createdAt: schema.comments.createdAt,
          updatedAt: schema.comments.updatedAt,
          user: {
            id: schema.user.id,
            name: schema.user.name,
            githubUsername: schema.user.githubUsername,
            image: schema.user.image,
          },
        })
        .from(schema.comments)
        .leftJoin(schema.user, eq(schema.comments.userId, schema.user.id))
        .where(eq(schema.comments.id, id));

      return c.json(updatedComment);
    }
  )
  .delete(
    '/comments/:id',
    describeRoute({
      responses: {
        204: {
          description: 'Comment deleted successfully',
        },
        404: {
          description: 'Comment with provided ID not found',
        },
        403: {
          description: 'Forbidden - can only delete your own comments',
        },
      },
    }),
    zodValidator('param', ZCommentByIDParams),
    async (c) => {
      const db = c.var.db;
      const user = c.get('user');
      const { id } = c.req.valid('param');

      // Check if comment exists and belongs to current user
      const [existingComment] = await db
        .select()
        .from(schema.comments)
        .where(eq(schema.comments.id, id));

      if (!existingComment) {
        return c.notFound();
      }

      if (existingComment.userId !== user.id) {
        return c.json(
          { message: 'Forbidden - can only delete your own comments' },
          403
        );
      }

      await db.delete(schema.comments).where(eq(schema.comments.id, id));

      return c.body(null, 204);
    }
  );

const app = new Hono<{ Bindings: Env; Variables: Variables }>()
  // Request logging middleware - runs first
  .use('*', requestLogger)
  // Better Auth routes - MUST come first and bypass auth middleware
  .on(['GET', 'POST'], '/api/auth/**', async (c) => {
    const auth = createAuth(c.env);
    try {
      return await auth.handler(c.req.raw);
    } catch (_error) {
      return c.text('Auth error', 500);
    }
  })
  // Apply auth middleware to all other routes (except auth routes)
  .use('*', authMiddleware)
  .get('/', (c) => {
    const user = c.get('user');
    return c.json({
      message: 'Honc from above! ☁️🪿',
      user: user ? { name: user.name, email: user.email } : null,
    });
  })
  .route('/api', api);

app.onError((error, c) => {
  const path = new URL(c.req.url).pathname;
  const method = c.req.method;

  if (error instanceof HTTPException) {
    apiLogger.warn('HTTP exception', {
      method,
      path,
      status: error.status,
      message: error.message,
    });
    return c.json(
      {
        message: error.message,
      },
      error.status
    );
  }

  apiLogger.error('Unhandled error', {
    method,
    path,
    error: prepareErrorForLogging(error),
  });

  return c.json(
    {
      message: 'Something went wrong',
    },
    500
  );
});

/**
 * Generate OpenAPI spec at /openapi.json
 */
app.get(
  '/openapi.json',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'HONC Comments API',
        version: '1.0.0',
        description: 'A comments API built with HONC stack and Better Auth',
      },
    },
  })
);

/**
 * Mount the Fiberplane api explorer to be able to make requests against your API.
 *
 * Visit the explorer at `/fp`
 */
app.use(
  '/fp/*',
  createFiberplane({
    app,
    openapi: { url: '/openapi.json' },
  })
);

export type AppType = typeof app;

export default app;
