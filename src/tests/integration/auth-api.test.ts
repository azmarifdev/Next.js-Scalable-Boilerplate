// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSessionToken } from "@/lib/auth/session";
import { AUTH_COOKIE_NAME } from "@/lib/config/constants";

const ORIGINAL_ENV = {
  NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
  NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
  DATABASE_URL: process.env.DATABASE_URL,
  ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH,
  ALLOW_INSECURE_DEV_AUTH: process.env.ALLOW_INSECURE_DEV_AUTH,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS,
  REQUIRE_ADMIN_STEP_UP_AUTH: process.env.REQUIRE_ADMIN_STEP_UP_AUTH,
  AUTH_MFA_STATIC_CODE: process.env.AUTH_MFA_STATIC_CODE
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
  restoreEnv("ALLOW_DEMO_AUTH", ORIGINAL_ENV.ALLOW_DEMO_AUTH);
  restoreEnv("ALLOW_INSECURE_DEV_AUTH", ORIGINAL_ENV.ALLOW_INSECURE_DEV_AUTH);
  restoreEnv("AUTH_SESSION_SECRET", ORIGINAL_ENV.AUTH_SESSION_SECRET);
  restoreEnv("AUTH_SESSION_SECRETS", ORIGINAL_ENV.AUTH_SESSION_SECRETS);
  restoreEnv("REQUIRE_ADMIN_STEP_UP_AUTH", ORIGINAL_ENV.REQUIRE_ADMIN_STEP_UP_AUTH);
  restoreEnv("AUTH_MFA_STATIC_CODE", ORIGINAL_ENV.AUTH_MFA_STATIC_CODE);
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

  it("supports login + me + protected resources with envelope", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "better-auth";
    delete process.env.DATABASE_URL;
    process.env.ALLOW_DEMO_AUTH = "true";
    process.env.ALLOW_INSECURE_DEV_AUTH = "true";
    process.env.AUTH_SESSION_SECRET = "integration-secret";
    const { POST: loginPost } = await import("@/app/api/v1/auth/login/route");
    const { GET: meGet } = await import("@/app/api/v1/auth/me/route");
    const { POST: refreshPost } = await import("@/app/api/v1/auth/refresh/route");

    const loginResponse = await loginPost(
      buildJsonRequest("http://localhost/api/v1/auth/login", {
        email: "nextjs.boilerplate@azmarif.dev",
        password: "azmarifdev"
      })
    );

    expect(loginResponse.status).toBe(200);
    const loginPayload = await loginResponse.json();
    expect(loginPayload.success).toBe(true);
    expect(loginPayload.data.user.role).toBe("admin");

    const setCookie = loginResponse.headers.get("set-cookie");
    expect(setCookie).toContain(`${AUTH_COOKIE_NAME}=`);

    const meRequest = new NextRequest("http://localhost/api/v1/auth/me", {
      method: "GET",
      headers: {
        cookie: setCookie ?? ""
      }
    });
    const meResponse = await meGet(meRequest);
    const mePayload = await meResponse.json();

    expect(meResponse.status).toBe(200);
    expect(mePayload.success).toBe(true);
    expect(mePayload.data.email).toBe("nextjs.boilerplate@azmarif.dev");

    const refreshRequest = new NextRequest("http://localhost/api/v1/auth/refresh", {
      method: "POST",
      headers: {
        cookie: setCookie ?? "",
        origin: "http://localhost"
      }
    });
    const refreshResponse = await refreshPost(refreshRequest);
    const refreshPayload = await refreshResponse.json();

    expect(refreshResponse.status).toBe(200);
    expect(refreshPayload.success).toBe(true);
    expect(refreshPayload.data.refreshed).toBe(true);
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

  it("locks demo account after repeated failed logins", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "better-auth";
    delete process.env.DATABASE_URL;
    process.env.ALLOW_DEMO_AUTH = "true";
    process.env.ALLOW_INSECURE_DEV_AUTH = "true";
    process.env.AUTH_SESSION_SECRET = "integration-secret";
    const { POST: loginPost } = await import("@/app/api/v1/auth/login/route");

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const failed = await loginPost(
        buildJsonRequest("http://localhost/api/v1/auth/login", {
          email: "nextjs.boilerplate@azmarif.dev",
          password: "wrong-password"
        })
      );
      expect(failed.status).toBe(401);
    }

    const locked = await loginPost(
      buildJsonRequest("http://localhost/api/v1/auth/login", {
        email: "nextjs.boilerplate@azmarif.dev",
        password: "azmarifdev"
      })
    );
    const payload = await locked.json();
    expect(locked.status).toBe(429);
    expect(payload.error.code).toBe("LOGIN_LOCKED");
  });

  it("verifies admin MFA step-up and returns upgraded session cookie", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "better-auth";
    delete process.env.DATABASE_URL;
    process.env.ALLOW_DEMO_AUTH = "true";
    process.env.ALLOW_INSECURE_DEV_AUTH = "true";
    process.env.REQUIRE_ADMIN_STEP_UP_AUTH = "true";
    process.env.AUTH_MFA_STATIC_CODE = "123456";
    process.env.AUTH_SESSION_SECRET = "integration-secret";

    const { POST: loginPost } = await import("@/app/api/v1/auth/login/route");
    const { POST: mfaVerifyPost } = await import("@/app/api/v1/auth/mfa/verify/route");

    const loginResponse = await loginPost(
      buildJsonRequest("http://localhost/api/v1/auth/login", {
        email: "nextjs.boilerplate@azmarif.dev",
        password: "azmarifdev"
      })
    );
    const loginCookie = loginResponse.headers.get("set-cookie") ?? "";
    expect(loginResponse.status).toBe(200);
    expect(loginCookie).toContain(`${AUTH_COOKIE_NAME}=`);

    const mfaResponse = await mfaVerifyPost(
      new NextRequest("http://localhost/api/v1/auth/mfa/verify", {
        method: "POST",
        headers: {
          origin: "http://localhost",
          "content-type": "application/json",
          cookie: loginCookie
        },
        body: JSON.stringify({ code: "123456" })
      })
    );
    const mfaPayload = await mfaResponse.json();

    expect(mfaResponse.status).toBe(200);
    expect(mfaPayload.success).toBe(true);
    expect(mfaPayload.data.verified).toBe(true);
    expect(mfaResponse.headers.get("set-cookie")).toContain(`${AUTH_COOKIE_NAME}=`);
  });
});
