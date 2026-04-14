import type { Db } from "mongodb";

import { appConfig } from "@/lib/config/app-config";
import { getDrizzleClient } from "@/lib/db/providers/drizzle";
import { getMongoDb } from "@/lib/db/providers/mongo";

type PostgresClient = ReturnType<typeof getDrizzleClient>;

export type ActiveDbProvider =
  | { provider: "mongo"; client: Db | null }
  | { provider: "postgres"; client: PostgresClient };

export async function getActiveDbProvider(): Promise<ActiveDbProvider> {
  if (appConfig.dbProvider === "mongo") {
    return {
      provider: "mongo",
      client: await getMongoDb()
    };
  }

  return {
    provider: "postgres",
    client: getDrizzleClient()
  };
}
