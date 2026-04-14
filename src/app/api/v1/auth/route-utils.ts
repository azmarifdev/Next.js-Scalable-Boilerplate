import { appConfig } from "@/lib/config/app-config";
import { validateRuntimeConfig } from "@/lib/config/validate";
import { logger } from "@/lib/observability/logger";
import { apiError, resolveRequestId } from "@/lib/utils/api-response";

export function withApiHandler<TRequest extends Request>(
  route: string,
  handler: (request: TRequest) => Promise<Response>
) {
  return async (request: TRequest): Promise<Response> => {
    const requestId = resolveRequestId(request.headers);

    try {
      validateRuntimeConfig();
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

export function requireInternalBackend(options: { requestId: string; route: string }) {
  if (appConfig.backendMode !== "internal") {
    return apiError(
      {
        code: "INTERNAL_API_DISABLED",
        message: "Internal API is disabled. Set NEXT_PUBLIC_BACKEND_MODE=internal to enable it."
      },
      {
        status: 404,
        requestId: options.requestId,
        route: options.route
      }
    );
  }

  return null;
}

export function requireCustomAuthProvider(options: { requestId: string; route: string }) {
  if (appConfig.authProvider !== "custom") {
    return apiError(
      {
        code: "AUTH_PROVIDER_DISABLED",
        message: "Custom auth API is disabled. Set NEXT_PUBLIC_AUTH_PROVIDER=custom to enable it."
      },
      {
        status: 404,
        requestId: options.requestId,
        route: options.route
      }
    );
  }

  return null;
}
