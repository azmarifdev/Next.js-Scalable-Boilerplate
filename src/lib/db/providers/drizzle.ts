import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/config/env";

export function getDrizzleClient() {
  if (!env.DATABASE_URL) {
    return null;
  }

  return drizzle(env.DATABASE_URL);
}
