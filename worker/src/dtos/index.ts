import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import 'zod-openapi/extend';
import * as schema from '../db/schema';

// User DTOs (Better Auth - read-only, creation handled by OAuth)
export const ZUserSelect = createSelectSchema(schema.user, {
  id: (schema) =>
    schema.openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
  name: (schema) =>
    schema.openapi({
      example: 'Goose McCloud',
    }),
  email: (schema) =>
    schema.email().openapi({
      example: 'goose@honc.dev',
    }),
  githubUsername: (schema) =>
    schema.openapi({
      example: 'goose-mccloud',
    }),
  image: (schema) =>
    schema.openapi({
      example: 'https://avatars.githubusercontent.com/u/12345?v=4',
    }),
  createdAt: (schema) =>
    schema.openapi({
      example: 1672531200,
      description: 'Unix timestamp',
    }),
  updatedAt: (schema) =>
    schema.openapi({
      example: 1672531200,
      description: 'Unix timestamp',
    }),
}).openapi({
  ref: 'UserSelect',
});

export const ZUserByIDParams = z
  .object({
    id: z.string().openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
  })
  .openapi({
    ref: 'UserByIdParams',
  });

// Comment DTOs
export const ZCommentInsert = createInsertSchema(schema.comments, {
  content: (schema) =>
    schema.openapi({
      example: 'This is a great post! Thanks for sharing.',
    }),
})
  .pick({
    content: true,
  })
  .openapi({
    ref: 'CommentInsert',
  });

export const ZCommentSelect = createSelectSchema(schema.comments, {
  id: (schema) =>
    schema.openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
  content: (schema) =>
    schema.openapi({
      example: 'This is a great post! Thanks for sharing.',
    }),
  userId: (schema) =>
    schema.openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
  createdAt: (schema) =>
    schema.openapi({
      example: 1672531200,
      description: 'Unix timestamp',
    }),
  updatedAt: (schema) =>
    schema.openapi({
      example: 1672531200,
      description: 'Unix timestamp',
    }),
}).openapi({
  ref: 'CommentSelect',
});

export const ZCommentUpdate = createInsertSchema(schema.comments, {
  content: (schema) =>
    schema.openapi({
      example: 'Updated comment content.',
    }),
})
  .pick({
    content: true,
  })
  .partial()
  .openapi({
    ref: 'CommentUpdate',
  });

export const ZCommentByIDParams = z
  .object({
    id: z.string().uuid().openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
  })
  .openapi({
    ref: 'CommentByIdParams',
  });

// Enhanced comment response with user info
export const ZCommentWithUser = ZCommentSelect.extend({
  user: ZUserSelect.pick({
    id: true,
    name: true,
    githubUsername: true,
    image: true,
  }),
}).openapi({
  ref: 'CommentWithUser',
});
