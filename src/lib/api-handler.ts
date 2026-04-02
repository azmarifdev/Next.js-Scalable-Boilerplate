import { apiError, resolveRequestId } from "@/lib/api-response";
import { logger } from "@/lib/observability/logger";

export function withApiHandler<TRequest extends Request>(
  route: string,
  handler: (request: TRequest) => Promise<Response>
) {
  return async (request: TRequest): Promise<Response> => {
    const requestId = resolveRequestId(request.headers);

    try {
      return await handler(request);
    } catch (error) {
      logger.error("api:unhandled", {
        route,
        requestId,
        message: error instanceof Error ? error.message : "Unknown error"
      });

      return apiError(
        {
          code: "INTERNAL_ERROR",
          message: "Unexpected server error"
        },
        {
          status: 500,
          requestId,
          route
        }
      );
    }
  };
}
