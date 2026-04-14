// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_COOKIE_NAME } from "@/lib/config/constants";

const ORIGINAL_ENV = {
  NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
  NEXT_PUBLIC_DB_PROVIDER: process.env.NEXT_PUBLIC_DB_PROVIDER,
  DATABASE_URL: process.env.DATABASE_URL,
  ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH,
  ALLOW_INSECURE_DEV_AUTH: process.env.ALLOW_INSECURE_DEV_AUTH,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS
};

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  process.env.NEXT_PUBLIC_BACKEND_MODE = ORIGINAL_ENV.NEXT_PUBLIC_BACKEND_MODE;
  process.env.NEXT_PUBLIC_DB_PROVIDER = ORIGINAL_ENV.NEXT_PUBLIC_DB_PROVIDER;
  process.env.DATABASE_URL = ORIGINAL_ENV.DATABASE_URL;
  process.env.ALLOW_DEMO_AUTH = ORIGINAL_ENV.ALLOW_DEMO_AUTH;
  process.env.ALLOW_INSECURE_DEV_AUTH = ORIGINAL_ENV.ALLOW_INSECURE_DEV_AUTH;
  process.env.AUTH_SESSION_SECRET = ORIGINAL_ENV.AUTH_SESSION_SECRET;
  process.env.AUTH_SESSION_SECRETS = ORIGINAL_ENV.AUTH_SESSION_SECRETS;
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
    process.env.NEXT_PUBLIC_DB_PROVIDER = "postgres";
    delete process.env.DATABASE_URL;
    const { POST: registerPost } = await import("@/app/api/v1/auth/register/route");

    const response = await registerPost(
      buildJsonRequest("http://localhost/api/v1/auth/register", {
        name: "No DB",
        email: "nodb@example.com",
        password: "secret123"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("AUTH_UNAVAILABLE");
  });

  it("supports login + me + protected resources with envelope", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_DB_PROVIDER = "postgres";
    delete process.env.DATABASE_URL;
    process.env.ALLOW_DEMO_AUTH = "true";
    process.env.ALLOW_INSECURE_DEV_AUTH = "true";
    process.env.AUTH_SESSION_SECRET = "integration-secret";
    const { POST: loginPost } = await import("@/app/api/v1/auth/login/route");
    const { GET: meGet } = await import("@/app/api/v1/auth/me/route");
    const { POST: refreshPost } = await import("@/app/api/v1/auth/refresh/route");

    const loginResponse = await loginPost(
      buildJsonRequest("http://localhost/api/v1/auth/login", {
        email: "admin@example.com",
        password: "secret123"
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
    expect(mePayload.data.email).toBe("admin@example.com");

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
});
