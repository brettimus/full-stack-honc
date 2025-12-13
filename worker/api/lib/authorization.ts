import { HTTPException } from 'hono/http-exception';

/**
 * Authenticated user type from session context
 */
export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  githubUsername?: string;
}

/**
 * Interface for resources that have user ownership
 */
export interface OwnedResource {
  userId: string;
}

/**
 * Asserts that a user is authenticated.
 *
 * @param user - The user from context (may be null/undefined)
 * @throws {HTTPException} 401 if user is not present
 */
export function assertAuthenticated(
  user: AuthUser | null | undefined
): asserts user is AuthUser {
  if (!user) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
}

/**
 * Authorizes that a resource belongs to a user.
 *
 * @param user - The user from context (may be null/undefined)
 * @param resource - Any resource with a userId property
 * @throws {HTTPException} 401 if user is not present
 * @throws {HTTPException} 403 if resource does not belong to user
 */
export function authorizeResourceForUser<T extends OwnedResource>(
  user: AuthUser | null | undefined,
  resource: T
): asserts user is AuthUser {
  assertAuthenticated(user);

  if (resource.userId !== user.id) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }
}
