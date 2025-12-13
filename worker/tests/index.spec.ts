import { env } from 'cloudflare:test';
import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

import app from '../api';

const client = testClient(app, env);

/**
 * The Cloudflare + Vitest integration isolates storage for each
 * `describe`, so it's necessary to seed any data that will be
 * queried with `beforeAll`.
 * @see https://developers.cloudflare.com/workers/testing/vitest-integration/
 * @see https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples/d1
 */

describe('GET /', () => {
  it('Returns landing JSON with message', async () => {
    const response = await client.index.$get();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      message: 'Honc from above! ☁️🪿',
      user: null,
    });
  });
});

describe('GET /comments', () => {
  it('Redirects to login when not authenticated', async () => {
    const response = await client.api.comments.$get();
    // Auth middleware redirects to login for unauthenticated requests
    expect(response.status).toBe(302);
  });
});

describe('POST /comments', () => {
  it('Redirects to login when not authenticated', async () => {
    const response = await client.api.comments.$post({
      json: { content: 'Test comment' },
    });
    // Auth middleware redirects to login for unauthenticated requests
    expect(response.status).toBe(302);
  });
});

describe('GET /comments/:id', () => {
  it('Redirects to login when not authenticated', async () => {
    const fakeCommentId = '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf';
    const response = await client.api.comments[':id'].$get({
      param: { id: fakeCommentId },
    });
    // Auth middleware redirects to login for unauthenticated requests
    expect(response.status).toBe(302);
  });
});

describe('PUT /comments/:id', () => {
  it('Redirects to login when not authenticated', async () => {
    const fakeCommentId = '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf';
    const response = await client.api.comments[':id'].$put({
      param: { id: fakeCommentId },
      json: { content: 'Updated comment' },
    });
    // Auth middleware redirects to login for unauthenticated requests
    expect(response.status).toBe(302);
  });
});

describe('DELETE /comments/:id', () => {
  it('Redirects to login when not authenticated', async () => {
    const fakeCommentId = '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf';
    const response = await client.api.comments[':id'].$delete({
      param: { id: fakeCommentId },
    });
    // Auth middleware redirects to login for unauthenticated requests
    expect(response.status).toBe(302);
  });
});
