import { hc } from 'hono/client';
import type { AppType } from '../../../worker/api/index.ts';
import type { CreateCommentRequest } from '../../types.ts';
import { handleResponse } from './handle-response.ts';

const client = hc<AppType>(
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
);

export const apiClient = {
  async getComments() {
    const res = await client.api.comments.$get();
    return handleResponse(res);
  },

  async createComment(comment: CreateCommentRequest) {
    const res = await client.api.comments.$post({ json: comment });
    return handleResponse(res);
  },

  async getCommentById(id: string) {
    const res = await client.api.comments[':id'].$get({ param: { id } });
    return handleResponse(res);
  },

  async updateComment(id: string, comment: Partial<CreateCommentRequest>) {
    const res = await client.api.comments[':id'].$put({
      param: { id },
      json: comment,
    });
    return handleResponse(res);
  },

  async deleteComment(id: string) {
    const res = await client.api.comments[':id'].$delete({ param: { id } });
    await handleResponse<void>(res);
  },

  async healthCheck() {
    const res = await client.api.health.$get();
    return handleResponse(res);
  },
};
