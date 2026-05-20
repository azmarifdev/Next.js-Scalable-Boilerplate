import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/auth/session";
import { AUTH_COOKIE_NAME } from "@/lib/config/constants";
import { applySecurityHeaders, buildCsp } from "@/lib/security/security-headers";

// Handles authentication and route protection
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isAuthRoute = authRoutes.includes(pathname);
  const isSignedIn = Boolean(session);
  const isDev = process.env.NODE_ENV !== "production";

  // Generate a single nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  // In dev mode, relax CSP to allow eval() (needed by Turbopack HMR and React DevTools)
  // and inline styles (injected by Turbopack without nonces).
  // In production, eval and inline styles are strictly blocked for security.
  const contentSecurityPolicy = buildCsp(nonce, isDev);

  // Prepare request headers with nonce for SSR
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  let response: NextResponse;

  // Redirect signed-in users away from auth pages to docs
  if (isAuthRoute && isSignedIn) {
    response = NextResponse.redirect(new URL("/docs", request.url));
  } else {
    // For all other pages, create a response with CSP headers
    response = NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  // ── Apply security headers to EVERY response ──────────────────────────
  // CSP, HSTS (production only), X-Frame-Options, X-Content-Type-Options,
  // Referrer-Policy, Permissions-Policy, Cross-Origin isolation headers
  response.headers.set("x-nonce", nonce);
  applySecurityHeaders(response, {
    nonce,
    isDev,
    includeHsts: process.env.NODE_ENV === "production"
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
