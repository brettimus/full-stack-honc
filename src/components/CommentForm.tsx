import type React from 'react';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { CreateCommentRequest } from '../types';

interface CommentFormProps {
  onSubmit: (comment: CreateCommentRequest) => Promise<void>;
  isLoading: boolean;
}

export function CommentForm({ onSubmit, isLoading }: CommentFormProps) {
  const [content, setContent] = useState('');
  const contentId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    await onSubmit({ content: content.trim() });
    setContent('');
  };

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">💬 Add a Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor={contentId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Comment
            </label>
            <textarea
              id={contentId}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              disabled={isLoading}
              rows={4}
              required
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full"
          >
            {isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </div>
    </div>
  );
}
