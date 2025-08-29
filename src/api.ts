import type {
  ApiError,
  CreateCommentRequest,
  CommentWithUser,
  User,
} from './types';

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database: string;
}

const API_BASE = '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getComments(): Promise<CommentWithUser[]> {
    return this.request<CommentWithUser[]>('/comments');
  }

  async createComment(comment: CreateCommentRequest): Promise<CommentWithUser> {
    return this.request<CommentWithUser>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async getCommentById(id: string): Promise<CommentWithUser> {
    return this.request<CommentWithUser>(`/comments/${id}`);
  }

  async updateComment(
    id: string,
    comment: Partial<CreateCommentRequest>
  ): Promise<CommentWithUser> {
    return this.request<CommentWithUser>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(comment),
    });
  }

  async deleteComment(id: string): Promise<void> {
    return this.request<void>(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/health');
  }
}

export const apiClient = new ApiClient();
