import { logger } from "@/lib/observability/logger";

export async function withTrace<T>(
  name: string,
  operation: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const startedAt = Date.now();

  try {
    const result = await operation();
    logger.debug("trace:success", {
      span: name,
      durationMs: Date.now() - startedAt,
      ...metadata
    });
    return result;
  } catch (error) {
    logger.error("trace:error", {
      span: name,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown error",
      ...metadata
    });
    throw error;
  }
}
