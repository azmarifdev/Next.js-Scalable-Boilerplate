import { appConfig } from "@/lib/config/app-config";
import { getDrizzleClient } from "@/lib/db/providers/drizzle";
import { getMongoDb } from "@/lib/db/providers/mongo";
import { getPrismaClient } from "@/lib/db/providers/prisma";

export async function getActiveDbProvider() {
  if (appConfig.dbProvider === "mongo") {
    return {
      provider: "mongo" as const,
      client: await getMongoDb()
    };
  }

  return {
    provider: "postgres" as const,
    client: getDrizzleClient(),
    prisma: getPrismaClient()
  };
}

export const db = getDrizzleClient();
