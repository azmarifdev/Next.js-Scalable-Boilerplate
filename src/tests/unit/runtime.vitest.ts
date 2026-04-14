import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = {
  NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
};

afterEach(() => {
  process.env.NEXT_PUBLIC_BACKEND_MODE = ORIGINAL_ENV.NEXT_PUBLIC_BACKEND_MODE;
  process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_ENV.NEXT_PUBLIC_API_BASE_URL;
  vi.resetModules();
});

describe("resolveApiEndpoint", () => {
  it("does not duplicate /api/v1 prefix when the path is already prefixed", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "external";
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";

    const { resolveApiEndpoint } = await import("@/lib/config/runtime");

    expect(resolveApiEndpoint("/api/v1/auth/me")).toBe("https://api.example.com/api/v1/auth/me");
  });

  it("adds /api/v1 prefix when the path is not prefixed", async () => {
    process.env.NEXT_PUBLIC_BACKEND_MODE = "external";
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";

    const { resolveApiEndpoint } = await import("@/lib/config/runtime");

    expect(resolveApiEndpoint("/auth/me")).toBe("https://api.example.com/api/v1/auth/me");
  });
});
