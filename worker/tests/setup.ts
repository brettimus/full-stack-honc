import { env } from 'cloudflare:test';

/**
 * Apply D1 migrations to the test database before running tests
 */
export default async function () {
  await Promise.all(
    env.TEST_MIGRATIONS.flatMap((migration) =>
      migration.queries.map((query) => env.DB.exec(query))
    )
  );
}
