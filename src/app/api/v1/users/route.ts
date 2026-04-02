import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";
import { requirePermission, requireSession } from "@/lib/auth/session-guard";
import { listDemoUsers } from "@/lib/demo-data";

async function usersHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/users";

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
