export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  githubUsername?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface CommentWithUser extends Comment {
  user: {
    id: string;
    name: string;
    githubUsername?: string | null;
    image?: string | null;
  };
}

export interface CreateCommentRequest {
  content: string;
}

export interface ApiError {
  message: string;
}
