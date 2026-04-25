// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("mode guards", () => {
  const originalEnv = {
    NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
    NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV
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
    restoreEnv("NEXT_PUBLIC_AUTH_PROVIDER", originalEnv.NEXT_PUBLIC_AUTH_PROVIDER);
    restoreEnv("NEXT_PUBLIC_BACKEND_MODE", originalEnv.NEXT_PUBLIC_BACKEND_MODE);
    restoreEnv("NEXT_PUBLIC_API_BASE_URL", originalEnv.NEXT_PUBLIC_API_BASE_URL);
    restoreEnv("AUTH_SESSION_SECRET", originalEnv.AUTH_SESSION_SECRET);
    restoreEnv("NODE_ENV", originalEnv.NODE_ENV);
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

  it("keeps external mode strict for REST client calls", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "external";
    process.env.NEXT_PUBLIC_API_BASE_URL = "";

    const { restGet } = await import("@/services/rest/client");

    await expect(restGet("/users")).rejects.toThrow(
      "NEXT_PUBLIC_API_BASE_URL is required when NEXT_PUBLIC_BACKEND_MODE=external"
    );
  });
});
