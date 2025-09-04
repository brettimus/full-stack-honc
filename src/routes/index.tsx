import { AuthCard } from '@/components/AuthCard';
import { CommentForm } from '@/components/CommentForm';
import { CommentList } from '@/components/CommentList';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/api';
import { useSession } from '@/lib/auth';
import type { CommentWithUser, CreateCommentRequest } from '@/types';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoadingComments(true);
      setError(null);
      const commentData = await apiClient.getComments();
      setComments(commentData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load comments'
      );
    } finally {
      setIsLoadingComments(false);
    }
  }, [isAuthenticated]);

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

  useEffect(() => {
    if (isAuthenticated) {
      loadComments();
    }
  }, [loadComments, isAuthenticated]);

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center space-y-8">
        <AuthCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Protected Resource</h1>
        <p className="text-sm text-muted-foreground">
          Comments system - authenticated users only
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">❌ {error}</p>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <CommentForm onSubmit={handleCreateComment} isLoading={isCreating} />

        <div>
          {isLoadingComments ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <CommentList
              comments={comments}
              onDeleteComment={handleDeleteComment}
              onUpdateComment={handleUpdateComment}
              isDeleting={deletingId}
              currentUserId={user?.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
