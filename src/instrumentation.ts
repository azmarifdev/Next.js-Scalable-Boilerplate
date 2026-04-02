import { logger } from "@/lib/observability/logger";

export async function register() {
  logger.info("instrumentation:register", {
    nodeEnv: process.env.NODE_ENV,
    tracing: "boilerplate-enabled"
  });
}
