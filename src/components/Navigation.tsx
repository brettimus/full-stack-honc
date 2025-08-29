import React from 'react';
import { authClient } from '../lib/auth';

interface NavigationProps {
  user: {
    id: string;
    name: string;
    email?: string;
    image?: string | null;
    githubUsername?: string;
  } | null;
  isAuthenticated: boolean;
}

export function Navigation({ user, isAuthenticated }: NavigationProps) {
  const handleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: window.location.pathname,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.reload();
          },
        },
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="auth-nav">
      {isAuthenticated && user ? (
        <div className="auth-user">
          <div className="user-info">
            {user.image && (
              <img src={user.image} alt={user.name} className="user-avatar" />
            )}
            <div>
              <span className="user-name">Welcome, {user.name}</span>
              {user.githubUsername && (
                <span className="user-github">@{user.githubUsername}</span>
              )}
            </div>
          </div>
          <button onClick={handleSignOut} className="auth-button sign-out">
            Sign out
          </button>
        </div>
      ) : (
        <button onClick={handleSignIn} className="auth-button sign-in">
          Sign in with GitHub
        </button>
      )}
    </nav>
  );
}
