import { requireInternalBackend } from "@/lib/api/internal-backend";
import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";
import { requireSession } from "@/lib/auth/session-guard";
import { AUTH_COOKIE_NAME, AUTH_SESSION_TTL_SECONDS } from "@/lib/constants";
import { createSessionToken } from "@/lib/session";

async function refreshHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/refresh";
  const backendError = requireInternalBackend({ requestId, route });
  if (backendError) {
    return backendError;
  }

  const { session, response } = await requireSession({ request, requestId, route });
  if (!session) {
    return response;
  }

  const token = await createSessionToken(
    {
      sub: session.sub,
      name: session.name,
      email: session.email,
      role: session.role
    },
    AUTH_SESSION_TTL_SECONDS
  );

  const refreshResponse = apiSuccess({ refreshed: true }, { requestId });
  refreshResponse.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: AUTH_SESSION_TTL_SECONDS
  });

  return refreshResponse;
}

export const POST = withApiHandler("/api/v1/auth/refresh", refreshHandler);
