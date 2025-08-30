declare module 'cloudflare:test' {
  interface ProvidedEnv extends Env {
    TEST_MIGRATIONS: D1Migration[];
    DB: D1Database;
  }

  export const env: ProvidedEnv;
}
