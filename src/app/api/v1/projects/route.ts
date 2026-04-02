import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";
import { requirePermission, requireSession } from "@/lib/auth/session-guard";
import { listDemoProjects } from "@/lib/demo-data";

async function projectsHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/projects";

  const { session, response } = await requireSession({ request, requestId, route });
  if (!session) {
    return response;
  }

  const permissionError = requirePermission(session.role, "projects:read", { requestId, route });
  if (permissionError) {
    return permissionError;
  }

  return apiSuccess(listDemoProjects(), { requestId });
}

export const GET = withApiHandler("/api/v1/projects", projectsHandler);
