import type React from 'react';
import { useState, useId } from 'react';
import type { CreateCommentRequest } from '../types';

interface CommentFormProps {
  onSubmit: (comment: CreateCommentRequest) => Promise<void>;
  isLoading: boolean;
}

export function CommentForm({ onSubmit, isLoading }: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    await onSubmit({ content: content.trim() });
    setContent('');
  };

  return (
    <div className="comment-form">
      <h3>💬 Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Comment</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            disabled={isLoading}
            rows={4}
            required
          />
        </div>
        <button type="submit" disabled={isLoading || !content.trim()}>
          {isLoading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}
