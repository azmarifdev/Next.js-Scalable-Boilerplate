import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/auth/session";
import { AUTH_COOKIE_NAME } from "@/lib/config/constants";

// Handles authentication and route protection
const authRoutes = ["/login", "/register"];

function buildProductionCsp(nonce: string): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "script-src-attr 'none'",
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "object-src 'none'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests"
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isAuthRoute = authRoutes.includes(pathname);
  const isSignedIn = Boolean(session);

  let response = NextResponse.next();

  // Redirect signed-in users away from auth pages to docs
  if (isAuthRoute && isSignedIn) {
    response = NextResponse.redirect(new URL("/docs", request.url));
  }

  if (process.env.NODE_ENV === "production" && !(isAuthRoute && isSignedIn)) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const contentSecurityPolicy = buildProductionCsp(nonce);
    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

    response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
    response.headers.set("x-nonce", nonce);
    response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
