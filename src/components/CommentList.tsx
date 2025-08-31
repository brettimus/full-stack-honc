import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { CommentWithUser } from '../types';

interface CommentListProps {
  comments: CommentWithUser[];
  onDeleteComment: (id: string) => Promise<void>;
  onUpdateComment: (id: string, content: string) => Promise<void>;
  isDeleting: string | null;
  currentUserId?: string;
}

export function CommentList({
  comments,
  onDeleteComment,
  onUpdateComment,
  isDeleting,
  currentUserId,
}: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (comment: CommentWithUser) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (id: string) => {
    if (editContent.trim()) {
      await onUpdateComment(id, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (comments.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">💬 Comments</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <div className="mb-2 text-4xl">💭</div>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">💬 Comments ({comments.length})</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {comment.user.image && (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{comment.user.name}</div>
                  {comment.user.githubUsername && (
                    <div className="text-xs text-muted-foreground">
                      @{comment.user.githubUsername}
                    </div>
                  )}
                </div>
              </div>
              {currentUserId === comment.userId && (
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(comment)}
                    disabled={editingId === comment.id}
                    className="h-8 w-8 p-0"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteComment(comment.id)}
                    disabled={isDeleting === comment.id}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    {isDeleting === comment.id ? '⏳' : '🗑️'}
                  </Button>
                </div>
              )}
            </div>

            <div className="mb-3">
              {editingId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(comment.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{comment.content}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{formatDate(comment.createdAt)}</span>
              {new Date(comment.updatedAt).getTime() >
                new Date(comment.createdAt).getTime() && (
                <span>• (edited)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
