import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";
import { requirePermission, requireSession } from "@/lib/auth/session-guard";
import { listDemoTasks } from "@/lib/demo-data";

async function tasksHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/tasks";

  const { session, response } = await requireSession({ request, requestId, route });
  if (!session) {
    return response;
  }

  const permissionError = requirePermission(session.role, "tasks:read", { requestId, route });
  if (permissionError) {
    return permissionError;
  }

  return apiSuccess(listDemoTasks(), { requestId });
}

export const GET = withApiHandler("/api/v1/tasks", tasksHandler);
