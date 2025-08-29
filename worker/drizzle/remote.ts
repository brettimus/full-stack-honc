import { type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

type RemoteDrizzleClient = ReturnType<typeof drizzle<Record<string, never>, Client>>;

/**
 * Creates a Drizzle client for remote database operations
 * @param databaseUrl - The remote database URL
 * @param authToken - The authentication token
 * @returns A Drizzle client instance
 */
export const createRemoteDrizzleClient = (
  databaseUrl: string,
  authToken: string,
): RemoteDrizzleClient => {
  const client = drizzle({
    connection: {
      url: databaseUrl,
      authToken: authToken,
    },
    casing: "snake_case",
  });

  return client;
};