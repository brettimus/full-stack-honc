import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthUser = AuthSession['user'];

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        githubUsername: {
          type: 'string',
        },
      },
    }),
  ],
  baseURL:
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:4284',
});

// Export the useSession hook for convenience
export const { useSession } = authClient;
