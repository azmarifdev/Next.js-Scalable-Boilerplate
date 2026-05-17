import { afterEach, beforeEach, describe, expect, it } from "vitest";

const ORIGINAL_ENV = { ...process.env };

function setEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

describe("getLocalAppOrigin", () => {
  beforeEach(() => {
    setEnv("APP_PROTOCOL", undefined);
    setEnv("APP_HOST", undefined);
    setEnv("PORT", undefined);
    setEnv("NEXT_PUBLIC_SITE_URL", undefined);
    setEnv("VERCEL_PROJECT_PRODUCTION_URL", undefined);
    setEnv("VERCEL_URL", undefined);
  });

  afterEach(() => {
    Object.assign(process.env, ORIGINAL_ENV);
  });

  it("returns default local origin when no env is set", async () => {
    const { getLocalAppOrigin } = await import("@/lib/config/url");
    expect(getLocalAppOrigin()).toBe("http://localhost:3000");
  });

  it("respects APP_PROTOCOL, APP_HOST and PORT", async () => {
    setEnv("APP_PROTOCOL", "https");
    setEnv("APP_HOST", "myhost");
    setEnv("PORT", "4000");
    const { getLocalAppOrigin } = await import("@/lib/config/url");
    expect(getLocalAppOrigin()).toBe("https://myhost:4000");
  });

  it("strips default port 80 for http", async () => {
    setEnv("APP_PROTOCOL", "http");
    setEnv("PORT", "80");
    const { getLocalAppOrigin } = await import("@/lib/config/url");
    expect(getLocalAppOrigin()).toBe("http://localhost");
  });

  it("strips default port 443 for https", async () => {
    setEnv("APP_PROTOCOL", "https");
    setEnv("PORT", "443");
    const { getLocalAppOrigin } = await import("@/lib/config/url");
    expect(getLocalAppOrigin()).toBe("https://localhost");
  });

  it("accepts host override via options", async () => {
    const { getLocalAppOrigin } = await import("@/lib/config/url");
    expect(getLocalAppOrigin({ host: "127.0.0.1" })).toBe("http://127.0.0.1:3000");
  });
});

describe("getConfiguredSiteOrigin", () => {
  beforeEach(() => {
    setEnv("NEXT_PUBLIC_SITE_URL", undefined);
    setEnv("VERCEL_PROJECT_PRODUCTION_URL", undefined);
    setEnv("VERCEL_URL", undefined);
  });

  afterEach(() => {
    Object.assign(process.env, ORIGINAL_ENV);
  });

  it("returns null when nothing is configured", async () => {
    const { getConfiguredSiteOrigin } = await import("@/lib/config/url");
    expect(getConfiguredSiteOrigin()).toBeNull();
  });

  it("returns normalized NEXT_PUBLIC_SITE_URL when set", async () => {
    setEnv("NEXT_PUBLIC_SITE_URL", "https://myapp.com/");
    const { getConfiguredSiteOrigin } = await import("@/lib/config/url");
    expect(getConfiguredSiteOrigin()).toBe("https://myapp.com");
  });

  it("returns VERCEL_PROJECT_PRODUCTION_URL when NEXT_PUBLIC_SITE_URL is blank", async () => {
    setEnv("VERCEL_PROJECT_PRODUCTION_URL", "myapp.vercel.app");
    const { getConfiguredSiteOrigin } = await import("@/lib/config/url");
    expect(getConfiguredSiteOrigin()).toBe("https://myapp.vercel.app");
  });

  it("falls back to VERCEL_URL", async () => {
    setEnv("VERCEL_URL", "preview.myapp.vercel.app");
    const { getConfiguredSiteOrigin } = await import("@/lib/config/url");
    expect(getConfiguredSiteOrigin()).toBe("https://preview.myapp.vercel.app");
  });
});

describe("getSiteOrigin", () => {
  beforeEach(() => {
    setEnv("NEXT_PUBLIC_SITE_URL", undefined);
    setEnv("VERCEL_PROJECT_PRODUCTION_URL", undefined);
    setEnv("VERCEL_URL", undefined);
    setEnv("APP_PROTOCOL", undefined);
    setEnv("APP_HOST", undefined);
    setEnv("PORT", undefined);
  });

  afterEach(() => {
    Object.assign(process.env, ORIGINAL_ENV);
  });

  it("returns configured origin when set", async () => {
    setEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const { getSiteOrigin } = await import("@/lib/config/url");
    expect(getSiteOrigin()).toBe("https://example.com");
  });

  it("falls back to local origin when nothing configured", async () => {
    const { getSiteOrigin } = await import("@/lib/config/url");
    expect(getSiteOrigin()).toBe("http://localhost:3000");
  });
});
