import { shouldUseSecureCookies } from "@/lib/auth/cookie-security";
import { AUTH_COOKIE_NAME } from "@/lib/config/constants";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { apiSuccess, resolveRequestId } from "@/lib/utils/api-response";

import { requireInternalBackend, withApiHandler } from "../route-utils";

async function logoutHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/logout";
  const backendError = requireInternalBackend({ requestId, route });
  if (backendError) {
    return backendError;
  }
  const originError = requireSameOrigin(request, { requestId, route });
  if (originError) {
    return originError;
  }

  const response = apiSuccess({ cleared: true }, { requestId });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "strict",
    expires: new Date(0),
    path: "/"
  });

  return response;
}

export const POST = withApiHandler("/api/v1/auth/logout", logoutHandler);
