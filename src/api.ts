import { hc } from 'hono/client';
import type { AppType } from '../worker/api/index.ts';
import type {
  ApiError,
  CommentWithUser,
  CreateCommentRequest,
  User,
} from './types';

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database: string;
}

const client = hc<AppType>(
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
);

const api = client.api;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: `HTTP ${res.status}: ${res.statusText}`,
    }));
    throw new Error(error.message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  async getUsers(): Promise<User[]> {
    const res = await api.users.$get();
    return handleResponse<User[]>(res);
  },

  async getUserById(id: string): Promise<User> {
    const res = await api.users[':id'].$get({ param: { id } });
    return handleResponse<User>(res);
  },

  async getComments(): Promise<CommentWithUser[]> {
    const res = await api.comments.$get();
    return handleResponse<CommentWithUser[]>(res);
  },

  async createComment(comment: CreateCommentRequest): Promise<CommentWithUser> {
    const res = await api.comments.$post({ json: comment });
    return handleResponse<CommentWithUser>(res);
  },

  async getCommentById(id: string): Promise<CommentWithUser> {
    const res = await api.comments[':id'].$get({ param: { id } });
    return handleResponse<CommentWithUser>(res);
  },

  async updateComment(
    id: string,
    comment: Partial<CreateCommentRequest>
  ): Promise<CommentWithUser> {
    const res = await api.comments[':id'].$put({
      param: { id },
      json: comment,
    });
    return handleResponse<CommentWithUser>(res);
  },

  async deleteComment(id: string): Promise<void> {
    const res = await api.comments[':id'].$delete({ param: { id } });
    await handleResponse<void>(res);
  },

  async healthCheck(): Promise<HealthCheckResponse> {
    const res = await api.health.$get();
    return handleResponse<HealthCheckResponse>(res);
  },
};
