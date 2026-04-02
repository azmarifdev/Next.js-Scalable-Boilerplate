import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/session-guard";

async function meHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/me";

  const { session, response } = await requireSession({ request, requestId, route });
  if (!session) {
    return response;
  }

  return apiSuccess(
    {
      id: session.sub,
      name: session.name,
      email: session.email,
      role: session.role
    },
    { requestId }
  );
}

export const GET = withApiHandler("/api/v1/auth/me", meHandler);
