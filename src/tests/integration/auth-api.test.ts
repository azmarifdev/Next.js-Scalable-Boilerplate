// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";

import { POST as loginPost } from "@/app/api/v1/auth/login/route";
import { GET as meGet } from "@/app/api/v1/auth/me/route";
import { POST as registerPost } from "@/app/api/v1/auth/register/route";
import { GET as projectsGet } from "@/app/api/v1/projects/route";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const ORIGINAL_ENV = {
  DATABASE_URL: process.env.DATABASE_URL,
  ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH,
  ALLOW_INSECURE_DEV_AUTH: process.env.ALLOW_INSECURE_DEV_AUTH,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS
};

afterEach(() => {
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
    delete process.env.DATABASE_URL;

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
    delete process.env.DATABASE_URL;
    process.env.ALLOW_DEMO_AUTH = "true";
    process.env.ALLOW_INSECURE_DEV_AUTH = "true";
    process.env.AUTH_SESSION_SECRET = "integration-secret";

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

    const projectsRequest = new NextRequest("http://localhost/api/v1/projects", {
      method: "GET",
      headers: {
        cookie: setCookie ?? ""
      }
    });
    const projectsResponse = await projectsGet(projectsRequest);
    const projectsPayload = await projectsResponse.json();

    expect(projectsResponse.status).toBe(200);
    expect(projectsPayload.success).toBe(true);
    expect(Array.isArray(projectsPayload.data)).toBe(true);
  });
});
