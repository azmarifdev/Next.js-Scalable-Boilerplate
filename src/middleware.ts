import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const protectedRoutes = ["/dashboard", "/users", "/projects", "/tasks"];
const authRoutes = ["/login", "/register"];

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return intlResponse ?? NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/login",
    "/register"
  ]
};
