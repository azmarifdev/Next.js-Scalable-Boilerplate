import { requireInternalBackend } from "@/lib/api/internal-backend";
import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";
import { requirePermission, requireSession } from "@/lib/auth/session-guard";
import { isFeatureEnabled } from "@/lib/config/feature-flags";
import { listDemoUsers } from "@/lib/demo-data";

async function usersHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/users";
  const backendError = requireInternalBackend({ requestId, route });
  if (backendError) {
    return backendError;
  }
  if (!isFeatureEnabled("admin")) {
    return apiSuccess([], { requestId });
  }

  const { session, response } = await requireSession({ request, requestId, route });
  if (!session) {
    return response;
  }

  const permissionError = requirePermission(session.role, "users:read", { requestId, route });
  if (permissionError) {
    return permissionError;
  }

  return apiSuccess(listDemoUsers(), { requestId });
}

export const GET = withApiHandler("/api/v1/users", usersHandler);
