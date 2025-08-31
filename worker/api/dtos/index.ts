import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import 'zod-openapi/extend';
import * as schema from '../db/schema';

// User DTOs (Better Auth - read-only, creation handled by OAuth)
export const ZUserSelect = createSelectSchema(schema.user)
  .extend({
    id: z.string().openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
    name: z.string().openapi({
      example: 'Goose McCloud',
    }),
    email: z.string().email().openapi({
      example: 'goose@honc.dev',
    }),
    githubUsername: z.string().nullable().openapi({
      example: 'goose-mccloud',
    }),
    image: z.string().nullable().openapi({
      example: 'https://avatars.githubusercontent.com/u/12345?v=4',
    }),
    createdAt: z.string().datetime().openapi({
      example: '2023-01-01T00:00:00Z',
      description: 'Creation timestamp',
    }),
    updatedAt: z.string().datetime().openapi({
      example: '2023-01-01T00:00:00Z',
      description: 'Last update timestamp',
    }),
  })
  .openapi({
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
export const ZCommentInsert = createInsertSchema(schema.comments)
  .pick({
    content: true,
  })
  .extend({
    content: z.string().openapi({
      example: 'This is a great post! Thanks for sharing.',
    }),
  })
  .openapi({
    ref: 'CommentInsert',
  });

export const ZCommentSelect = createSelectSchema(schema.comments)
  .extend({
    id: z.string().openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
    content: z.string().openapi({
      example: 'This is a great post! Thanks for sharing.',
    }),
    userId: z.string().openapi({
      example: '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf',
    }),
    createdAt: z.string().datetime().openapi({
      example: '2023-01-01T00:00:00Z',
      description: 'Creation timestamp',
    }),
    updatedAt: z.string().datetime().openapi({
      example: '2023-01-01T00:00:00Z',
      description: 'Last update timestamp',
    }),
  })
  .openapi({
    ref: 'CommentSelect',
  });

export const ZCommentUpdate = createInsertSchema(schema.comments)
  .pick({
    content: true,
  })
  .extend({
    content: z.string().openapi({
      example: 'Updated comment content.',
    }),
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
