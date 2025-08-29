import { env } from "cloudflare:test";

/**
 * Apply D1 migrations to the test database before running tests
 */
export default async function () {
  await Promise.all(
    env.TEST_MIGRATIONS.map((migration) =>
      env.DB.exec(migration.sql)
    )
  );
}