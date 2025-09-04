import type { ClientResponse } from 'hono/client';
import type { ApiError } from '../../types.ts';

// Success HTTP status codes we care about for narrowing
type SuccessStatus = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;

// Infer the successful JSON body type from a Hono ClientResponse union.
// - Only narrows when the status is a 2xx
// - Returns `undefined` for 204
export type InferSuccessJsonBody<R> = R extends ClientResponse<
  infer Body,
  infer Status,
  infer ContentType
>
  ? ContentType extends 'json'
    ? Status extends SuccessStatus
      ? Status extends 204
        ? undefined
        : Body
      : never
    : never
  : never;

// Overload for native fetch Response (keep generic)
export async function handleResponse<T>(res: Response): Promise<T>;
// Overload for Hono ClientResponse - infer only the successful JSON body
export async function handleResponse<
  R extends ClientResponse<unknown, number, 'json'>,
>(res: R): Promise<InferSuccessJsonBody<R>>;

/**
 * Handle the response from the API.
 *
 * If it's a 204, return undefined.
 * If it's not ok, throw an error, and try to extract the `message` from the response body.
 * If it's ok, return the JSON.
 *
 * If you're using `fetch`, the response body shape needs to be passed as a generic.
 * Otherwise, if you're using `hono/client`, the *success* response body shape can be inferred.
 *
 * The logic in this function can be expanded to handle more response codes, error paths, and types.
 */
export async function handleResponse(
  res:
    | Response
    | ClientResponse<
        unknown,
        number,
        'json' | 'text' | 'blob' | 'stream' | 'arrayBuffer'
      >
): Promise<unknown> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: `HTTP ${res.status}: ${res.statusText}`,
    }));
    throw new Error(error.message);
  }

  if (res.status === 204) {
    return undefined as unknown;
  }

  return res.json() as Promise<unknown>;
}
