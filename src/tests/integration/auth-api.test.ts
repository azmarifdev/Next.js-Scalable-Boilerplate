// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSessionToken } from "@/lib/auth/session";
import { AUTH_COOKIE_NAME } from "@/lib/config/constants";

const ORIGINAL_ENV = {
  NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
  NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS,
  REQUIRE_ADMIN_STEP_UP_AUTH: process.env.REQUIRE_ADMIN_STEP_UP_AUTH
};
const mutableEnv = process.env as Record<string, string | undefined>;

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete mutableEnv[key];
    return;
  }

  mutableEnv[key] = value;
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  restoreEnv("NEXT_PUBLIC_BACKEND_MODE", ORIGINAL_ENV.NEXT_PUBLIC_BACKEND_MODE);
  restoreEnv("NEXT_PUBLIC_AUTH_PROVIDER", ORIGINAL_ENV.NEXT_PUBLIC_AUTH_PROVIDER);
  restoreEnv("DATABASE_URL", ORIGINAL_ENV.DATABASE_URL);
  restoreEnv("AUTH_SESSION_SECRET", ORIGINAL_ENV.AUTH_SESSION_SECRET);
  restoreEnv("AUTH_SESSION_SECRETS", ORIGINAL_ENV.AUTH_SESSION_SECRETS);
  restoreEnv("REQUIRE_ADMIN_STEP_UP_AUTH", ORIGINAL_ENV.REQUIRE_ADMIN_STEP_UP_AUTH);
});

function buildJsonRequest(url: string, body: Record<string, unknown>): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(body)
  });
}

describe("auth api integration", () => {
  it("returns service unavailable envelope for register when DB is missing", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "better-auth";
    delete process.env.DATABASE_URL;
    const { POST: registerPost } = await import("@/app/api/v1/auth/register/route");

    const response = await registerPost(
      buildJsonRequest("http://localhost/api/v1/auth/register", {
        name: "No DB",
        email: "nodb@example.com",
        password: "azmarifdev"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("AUTH_UNAVAILABLE");
  });

  it("returns service unavailable envelope for login when DB is missing", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "better-auth";
    delete process.env.DATABASE_URL;
    process.env.AUTH_SESSION_SECRET = "integration-secret";
    const { POST: loginPost } = await import("@/app/api/v1/auth/login/route");

    const loginResponse = await loginPost(
      buildJsonRequest("http://localhost/api/v1/auth/login", {
        email: "missing-db@example.com",
        password: "valid-password"
      })
    );
    const payload = await loginResponse.json();

    expect(loginResponse.status).toBe(503);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("AUTH_UNAVAILABLE");
  });

  it("clears auth cookie on logout", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "better-auth";
    process.env.AUTH_SESSION_SECRET = "integration-secret";
    const { POST: logoutPost } = await import("@/app/api/v1/auth/logout/route");

    const request = new NextRequest("http://localhost/api/v1/auth/logout", {
      method: "POST",
      headers: {
        origin: "http://localhost"
      }
    });
    const response = await logoutPost(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data.cleared).toBe(true);
    expect(response.headers.get("set-cookie")).toContain(`${AUTH_COOKIE_NAME}=;`);
  });

  it("rejects expired sessions on /auth/me", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.AUTH_SESSION_SECRET = "integration-secret";
    const { GET: meGet } = await import("@/app/api/v1/auth/me/route");

    const expiredToken = await createSessionToken(
      {
        sub: "u_1",
        name: "Expired",
        email: "expired@example.com",
        role: "user",
        mfaVerified: true
      },
      -1
    );
    const request = new NextRequest("http://localhost/api/v1/auth/me", {
      method: "GET",
      headers: {
        cookie: `${AUTH_COOKIE_NAME}=${expiredToken}`
      }
    });
    const response = await meGet(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("INVALID_SESSION");
  });

  it("returns service unavailable when admin MFA step-up verifier is missing", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "better-auth";
    process.env.REQUIRE_ADMIN_STEP_UP_AUTH = "true";
    process.env.AUTH_SESSION_SECRET = "integration-secret";

    const { POST: mfaVerifyPost } = await import("@/app/api/v1/auth/mfa/verify/route");
    const adminToken = await createSessionToken(
      {
        sub: "u_admin",
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
        mfaVerified: false
      },
      60
    );

    const mfaResponse = await mfaVerifyPost(
      new NextRequest("http://localhost/api/v1/auth/mfa/verify", {
        method: "POST",
        headers: {
          origin: "http://localhost",
          "content-type": "application/json",
          cookie: `${AUTH_COOKIE_NAME}=${adminToken}`
        },
        body: JSON.stringify({ code: "123456" })
      })
    );
    const mfaPayload = await mfaResponse.json();

    expect(mfaResponse.status).toBe(503);
    expect(mfaPayload.success).toBe(false);
    expect(mfaPayload.error.code).toBe("MFA_NOT_CONFIGURED");
  });
});
