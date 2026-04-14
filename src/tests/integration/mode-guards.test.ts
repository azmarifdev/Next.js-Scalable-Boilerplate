// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("mode guards", () => {
  const originalEnv = {
    NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
    NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
    ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH,
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV
  };

  function restoreEnv(key: keyof typeof originalEnv, value: string | undefined): void {
    if (value === undefined) {
      delete process.env[key];
      return;
    }

    process.env[key] = value;
  }

  beforeEach(() => {
    vi.resetModules();
    restoreEnv("NEXT_PUBLIC_AUTH_PROVIDER", originalEnv.NEXT_PUBLIC_AUTH_PROVIDER);
    restoreEnv("NEXT_PUBLIC_BACKEND_MODE", originalEnv.NEXT_PUBLIC_BACKEND_MODE);
    restoreEnv("NEXT_PUBLIC_API_BASE_URL", originalEnv.NEXT_PUBLIC_API_BASE_URL);
    restoreEnv("NEXT_PUBLIC_API_MODE", originalEnv.NEXT_PUBLIC_API_MODE);
    restoreEnv("ALLOW_DEMO_AUTH", originalEnv.ALLOW_DEMO_AUTH);
    restoreEnv("AUTH_SESSION_SECRET", originalEnv.AUTH_SESSION_SECRET);
    restoreEnv("NODE_ENV", originalEnv.NODE_ENV);
  });

  it("returns 404 for NextAuth route when authProvider=custom", async () => {
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "custom";

    const { GET } = await import("@/app/api/auth/[...nextauth]/route");
    const { NextRequest } = await import("next/server");

    const response = await GET(new NextRequest("http://localhost/api/auth/session"));
    expect(response.status).toBe(404);
  });

  it("fails fast when external mode is set without API base URL", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "external";
    process.env.NEXT_PUBLIC_API_BASE_URL = "";

    const { restGet } = await import("@/services/rest/client");

    await expect(restGet("/auth/me")).rejects.toThrow(
      "NEXT_PUBLIC_API_BASE_URL is required when NEXT_PUBLIC_BACKEND_MODE=external"
    );
  });

  it("returns 404 for internal auth APIs when backend mode is external", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "external";

    const { GET } = await import("@/app/api/v1/auth/me/route");
    const { NextRequest } = await import("next/server");
    const response = await GET(new NextRequest("http://localhost/api/v1/auth/me"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error?.code).toBe("INTERNAL_API_DISABLED");
  });

  it("returns 404 for custom auth APIs when authProvider is nextauth", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "nextauth";

    const { POST } = await import("@/app/api/v1/auth/login/route");
    const { NextRequest } = await import("next/server");
    const response = await POST(
      new NextRequest("http://localhost/api/v1/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ email: "admin@example.com", password: "secret123" })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error?.code).toBe("AUTH_PROVIDER_DISABLED");
  });

  it("keeps external mode strict for REST client calls", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "external";
    process.env.NEXT_PUBLIC_API_BASE_URL = "";

    const { restGet } = await import("@/services/rest/client");

    await expect(restGet("/users")).rejects.toThrow(
      "NEXT_PUBLIC_API_BASE_URL is required when NEXT_PUBLIC_BACKEND_MODE=external"
    );
  });

  it("fails fast for unsupported internal custom auth GraphQL mode", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "internal";
    process.env.NEXT_PUBLIC_AUTH_PROVIDER = "custom";
    process.env.NEXT_PUBLIC_API_MODE = "graphql";
    process.env.ALLOW_DEMO_AUTH = "true";
    process.env.AUTH_SESSION_SECRET = "test-secret";
    process.env.NODE_ENV = "development";

    const { validateRuntimeConfig } = await import("@/lib/config/validate");

    expect(() => validateRuntimeConfig()).toThrow(
      "NEXT_PUBLIC_API_MODE=graphql is not supported with internal custom auth"
    );
  });
});
