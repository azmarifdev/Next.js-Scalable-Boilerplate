import { requireSession } from "@/lib/auth/session-guard";
import { apiSuccess, resolveRequestId } from "@/lib/utils/api-response";

import { requireBetterAuthProvider, requireInternalBackend, withApiHandler } from "../route-utils";

async function meHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/me";
  const backendError = requireInternalBackend({ requestId, route });
  if (backendError) {
    return backendError;
  }
  const providerError = requireBetterAuthProvider({ requestId, route });
  if (providerError) {
    return providerError;
  }

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
