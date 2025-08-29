import { useCallback, useEffect, useState } from 'react';
import { apiClient } from './api';
import { ApiStatus } from './components/ApiStatus';
import { CommentForm } from './components/CommentForm';
import { CommentList } from './components/CommentList';
import { Navigation } from './components/Navigation';
import { authClient } from './lib/auth';
import type { CreateCommentRequest, CommentWithUser } from './types';
import './App.css';

function App() {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const commentData = await apiClient.getComments();
      setComments(commentData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load comments'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateComment = async (commentData: CreateCommentRequest) => {
    try {
      setIsCreating(true);
      setError(null);
      const newComment = await apiClient.createComment(commentData);
      setComments((prev) => [...prev, newComment]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create comment'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateComment = async (id: string, content: string) => {
    try {
      setError(null);
      const updatedComment = await apiClient.updateComment(id, { content });
      setComments((prev) =>
        prev.map((comment) => (comment.id === id ? updatedComment : comment))
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update comment'
      );
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);
      await apiClient.deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete comment'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.user) {
          setAuthUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadComments();
    }
  }, [loadComments, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🪿 HONC Comments</h1>
            <p>React SPA + Cloudflare Worker with D1 Database + Better Auth</p>
          </div>
          <Navigation user={authUser} isAuthenticated={isAuthenticated} />
        </div>
      </header>

      <main className="app-main">
        {isAuthenticated ? (
          <>
            <ApiStatus />

            {error && (
              <div className="error-message">
                <p>❌ {error}</p>
                <button type="button" onClick={() => setError(null)}>
                  Dismiss
                </button>
              </div>
            )}

            <div className="app-content">
              <div className="form-section">
                <CommentForm
                  onSubmit={handleCreateComment}
                  isLoading={isCreating}
                />
              </div>

              <div className="list-section">
                {isLoading ? (
                  <div className="loading">Loading comments...</div>
                ) : (
                  <CommentList
                    comments={comments}
                    onDeleteComment={handleDeleteComment}
                    onUpdateComment={handleUpdateComment}
                    isDeleting={deletingId}
                    currentUserId={authUser?.id}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please sign in with GitHub to access the comments system.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
