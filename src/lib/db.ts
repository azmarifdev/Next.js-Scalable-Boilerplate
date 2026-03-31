import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";

export const db = env.DATABASE_URL ? drizzle(env.DATABASE_URL) : null;
