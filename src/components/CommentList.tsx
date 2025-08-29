import React, { useState } from 'react';
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (comments.length === 0) {
    return (
      <div className="comment-list">
        <h3>💬 Comments</h3>
        <div className="empty-state">
          No comments yet. Be the first to share your thoughts!
        </div>
      </div>
    );
  }

  return (
    <div className="comment-list">
      <h3>💬 Comments ({comments.length})</h3>
      <div className="comments-grid">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <div className="comment-author">
                {comment.user.image && (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name}
                    className="author-avatar"
                  />
                )}
                <div className="author-info">
                  <span className="author-name">{comment.user.name}</span>
                  {comment.user.githubUsername && (
                    <span className="author-github">
                      @{comment.user.githubUsername}
                    </span>
                  )}
                </div>
              </div>
              <div className="comment-actions">
                {currentUserId === comment.userId && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(comment)}
                      className="edit-button"
                      disabled={editingId === comment.id}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment.id)}
                      className="delete-button"
                      disabled={isDeleting === comment.id}
                    >
                      {isDeleting === comment.id ? '⏳' : '🗑️'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="comment-content">
              {editingId === comment.id ? (
                <div className="edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(comment.id)}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.content}</p>
              )}
            </div>

            <div className="comment-meta">
              <span className="comment-date">
                {formatDate(comment.createdAt)}
              </span>
              {comment.updatedAt > comment.createdAt && (
                <span className="comment-edited">(edited)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
