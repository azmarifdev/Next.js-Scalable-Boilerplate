import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { env } from "@/lib/config/env";

export function getDrizzleClient() {
  if (!env.DATABASE_URL) {
    return null;
  }

  return drizzle(env.DATABASE_URL, { schema });
}

type PostgresClient = ReturnType<typeof getDrizzleClient>;

export type ActiveDbProvider = { provider: "postgres"; client: PostgresClient };

export async function getActiveDbProvider(): Promise<ActiveDbProvider> {
  return {
    provider: "postgres",
    client: getDrizzleClient()
  };
}
