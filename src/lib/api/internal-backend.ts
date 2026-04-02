import { apiError } from "@/lib/api-response";
import { appConfig } from "@/lib/config/app-config";

export function requireInternalBackend(options: { requestId: string; route: string }) {
  if (process.env.NODE_ENV === "test") {
    return null;
  }

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
