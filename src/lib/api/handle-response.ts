import type { ClientResponse } from 'hono/client';
import type { ApiError } from '../../types.ts';

/**
 * Handle the response from the API.
 *
 * If it's a 204, return undefined.
 * If it's not ok, throw an error.
 * If it's ok, return the JSON.
 *
 * If you're using `fetch`, the response body shape needs to be passed as a generic.
 * Otherwise, if you're using `hono/client`, the response body shape can be inferred.
 *
 * The logic in this function can be expanded to handle more response codes, error paths, and types.
 */
export async function handleResponse<T>(
  res: Response | ClientResponse<T>
): Promise<T> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: `HTTP ${res.status}: ${res.statusText}`,
    }));
    throw new Error(error.message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
