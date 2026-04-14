import { Db, MongoClient } from "mongodb";

import { env } from "@/lib/config/env";

const globalState = globalThis as unknown as {
  __mongoClient?: MongoClient;
  __mongoDb?: Db;
};

export async function getMongoDb(): Promise<Db | null> {
  if (!env.MONGODB_URI || !env.MONGODB_DB_NAME) {
    return null;
  }

  if (globalState.__mongoDb) {
    return globalState.__mongoDb;
  }

  const client = globalState.__mongoClient ?? new MongoClient(env.MONGODB_URI);

  if (!globalState.__mongoClient) {
    await client.connect();
    globalState.__mongoClient = client;
  }

  const database = client.db(env.MONGODB_DB_NAME);
  globalState.__mongoDb = database;

  return database;
}
