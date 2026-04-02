import { NextRequest, NextResponse } from "next/server";

import { hasPermission } from "@/lib/auth/rbac";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import {
  getOrCreateRequestId,
  REQUEST_ID_HEADER,
  setRequestIdHeader
} from "@/lib/observability/request-id";
import { verifySessionToken } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/users", "/projects", "/tasks"];
const authRoutes = ["/login", "/register"];

const routePermissions: Record<
  string,
  "dashboard:read" | "users:read" | "projects:read" | "tasks:read"
> = {
  "/dashboard": "dashboard:read",
  "/users": "users:read",
  "/projects": "projects:read",
  "/tasks": "tasks:read"
};

function attachRequestId(response: NextResponse, requestId: string): NextResponse {
  setRequestIdHeader(response, requestId);
  return response;
}

export async function proxy(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  const session = token ? await verifySessionToken(token) : null;
  const isSignedIn = Boolean(session);

  if (isProtected && !isSignedIn) {
    return attachRequestId(NextResponse.redirect(new URL("/login", request.url)), requestId);
  }

  if (isProtected && session) {
    const basePath = protectedRoutes.find(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    const requiredPermission = basePath ? routePermissions[basePath] : null;

    if (requiredPermission && !hasPermission(session.role, requiredPermission)) {
      return attachRequestId(NextResponse.redirect(new URL("/dashboard", request.url)), requestId);
    }
  }

  if (isAuthRoute && isSignedIn) {
    return attachRequestId(NextResponse.redirect(new URL("/dashboard", request.url)), requestId);
  }

  if (token && !isSignedIn) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/"
    });
    return attachRequestId(response, requestId);
  }

  return attachRequestId(NextResponse.next({ request: { headers: requestHeaders } }), requestId);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/login",
    "/register",
    "/api/:path*"
  ]
};
