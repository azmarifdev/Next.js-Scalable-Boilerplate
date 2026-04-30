import { NextRequest, NextResponse } from "next/server";

import { hasPermission } from "@/lib/auth/rbac";
import { verifySessionToken } from "@/lib/auth/session";
import { isAdminStepUpEnabled, isAdminStepUpRoute } from "@/lib/auth/step-up";
import { AUTH_COOKIE_NAME } from "@/lib/config/constants";

// Handles authentication and route protection
const protectedRoutes = ["/dashboard", "/projects", "/tasks", "/ecommerce", "/billing", "/users"];
const authRoutes = ["/login", "/register"];

const routePermissions: Record<
  string,
  | "dashboard:read"
  | "users:read"
  | "projects:read"
  | "tasks:read"
  | "ecommerce:read"
  | "billing:read"
> = {
  "/dashboard": "dashboard:read",
  "/users": "users:read",
  "/projects": "projects:read",
  "/tasks": "tasks:read",
  "/ecommerce": "ecommerce:read",
  "/billing": "billing:read"
};

function isMatchedRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isProtectedRoute = isMatchedRoute(pathname, protectedRoutes);
  const isAuthRoute = authRoutes.includes(pathname);
  const isSignedIn = Boolean(session);

  if (isProtectedRoute && !isSignedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedRoute && session) {
    const basePath = protectedRoutes.find(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    const requiredPermission = basePath ? routePermissions[basePath] : null;

    if (requiredPermission && !hasPermission(session.role, requiredPermission)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      isAdminStepUpEnabled() &&
      session.role === "admin" &&
      isAdminStepUpRoute(pathname) &&
      !session.mfaVerified
    ) {
      return NextResponse.redirect(new URL("/dashboard?mfa=required", request.url));
    }
  }

  if (isAuthRoute && isSignedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/ecommerce/:path*",
    "/billing/:path*",
    "/users/:path*",
    "/login",
    "/register"
  ]
};
