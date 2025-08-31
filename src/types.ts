import type { z } from 'zod';
import type {
  ZCommentInsert,
  ZCommentSelect,
  ZCommentWithUser,
  ZUserSelect,
} from '../worker/api/dtos/index.ts';

export type User = z.infer<typeof ZUserSelect>;
export type Comment = z.infer<typeof ZCommentSelect>;
export type CommentWithUser = z.infer<typeof ZCommentWithUser>;
export type CreateCommentRequest = z.infer<typeof ZCommentInsert>;

export interface ApiError {
  message: string;
}
