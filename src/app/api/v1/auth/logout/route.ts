import { withApiHandler } from "@/lib/api-handler";
import { apiSuccess, resolveRequestId } from "@/lib/api-response";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { requireSameOrigin } from "@/lib/security/request-origin";

async function logoutHandler(request: Request): Promise<Response> {
  const requestId = resolveRequestId(request.headers);
  const route = "/api/v1/auth/logout";

  const originError = requireSameOrigin(request, { requestId, route });
  if (originError) {
    return originError;
  }

  const response = apiSuccess({ cleared: true }, { requestId });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/"
  });

  return response;
}

export const POST = withApiHandler("/api/v1/auth/logout", logoutHandler);
