import { getDrizzleClient } from "@/lib/db/providers/drizzle";

type PostgresClient = ReturnType<typeof getDrizzleClient>;

export type ActiveDbProvider = { provider: "postgres"; client: PostgresClient };

export async function getActiveDbProvider(): Promise<ActiveDbProvider> {
  return {
    provider: "postgres",
    client: getDrizzleClient()
  };
}
