import { env } from 'cloudflare:test';
import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

import app from '../api';

const client = testClient(app, env);

const DATE_REGEX = /^\d{4}-[01]\d-[0-3]\d\s[0-2]\d:[0-5]\d:[0-5]\d$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * The Cloudflare + Vitest integration isolates storage for each
 * `describe`, so it's necessary to seed any data that will be
 * queried with `beforeAll`.
 * @see https://developers.cloudflare.com/workers/testing/vitest-integration/
 * @see https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples/d1
 */

describe('GET /', () => {
  it('Returns landing text', async () => {
    const response = await client.index.$get();
    expect(response.status).toBe(200);

    const data = await response.text();
    expect(data).toBe('Honc from above! ☁️🪿');
  });
});

describe('GET /comments', () => {
  it('Returns an array of comments', async () => {
    const response = await client.api.comments.$get();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(expect.any(Array));

    // Each comment should have the expected structure
    for (const comment of data) {
      expect(comment).toEqual({
        id: expect.stringMatching(UUID_REGEX),
        content: expect.any(String),
        userId: expect.stringMatching(UUID_REGEX),
        createdAt: expect.stringMatching(DATE_REGEX),
        updatedAt: expect.stringMatching(DATE_REGEX),
        user: expect.objectContaining({
          id: expect.stringMatching(UUID_REGEX),
          name: expect.any(String),
          githubUsername: expect.any(String),
          image: expect.any(String),
        }),
      });
    }
  });
});

describe('POST /comments', () => {
  it('Returns 401 if not authenticated', async () => {
    const response = await client.api.comments.$post({
      json: { content: 'Test comment' },
    });
    expect(response.status).toBe(401);
  });

  // Note: POST /comments requires authentication, so we'd need to set up auth in tests
  // For now, we're just testing the unauthenticated case
});

describe('GET /comments/:id', () => {
  it('Returns 404 for non-existent comment', async () => {
    const fakeCommentId = '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf';
    const response = await client.api.comments[':id'].$get({
      param: { id: fakeCommentId },
    });

    expect(response.status).toBe(404);
  });

  // Note: To test successful GET /comments/:id, we'd need to create a comment first
  // which requires authentication. For now, we're testing the 404 case.
});

describe('PUT /comments/:id', () => {
  it('Returns 401 if not authenticated', async () => {
    const fakeCommentId = '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf';
    const response = await client.api.comments[':id'].$put({
      param: { id: fakeCommentId },
      json: { content: 'Updated comment' },
    });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /comments/:id', () => {
  it('Returns 401 if not authenticated', async () => {
    const fakeCommentId = '3e0bb3d0-2074-4a1e-6263-d13dd10cb0cf';
    const response = await client.api.comments[':id'].$delete({
      param: { id: fakeCommentId },
    });

    expect(response.status).toBe(401);
  });
});
