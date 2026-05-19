import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };
let mockAdminEnabled = true;
let mockAuthProvider = "better-auth";

vi.mock("@/lib/config/app-config", () => ({
  appConfig: {
    get features() {
      return { admin: mockAdminEnabled };
    },
    get authProvider() {
      return mockAuthProvider;
    },
    backendMode: "internal"
  }
}));

describe("featureFlags", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_FEATURE_ADMIN = "true";
    process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH = "false";
    process.env.ENABLE_CUSTOM_AUTH = "false";
    mockAuthProvider = "better-auth";
  });

  afterEach(() => {
    Object.assign(process.env, ORIGINAL_ENV);
  });

  it("returns admin enabled when env says true", async () => {
    mockAdminEnabled = true;
    const { getFeatureFlags } = await import("@/lib/config/featureFlags");
    const flags = getFeatureFlags();
    expect(flags.ENABLE_ADMIN).toBe(true);
  });

  it("returns admin disabled when env says false", async () => {
    mockAdminEnabled = false;
    const { getFeatureFlags } = await import("@/lib/config/featureFlags");
    const flags = getFeatureFlags();
    expect(flags.ENABLE_ADMIN).toBe(false);
  });

  it("returns custom auth disabled when both envs are false", async () => {
    const { getFeatureFlags } = await import("@/lib/config/featureFlags");
    const flags = getFeatureFlags();
    expect(flags.ENABLE_CUSTOM_AUTH).toBe(false);
  });

  it("returns custom auth enabled when NEXT_PUBLIC_ENABLE_CUSTOM_AUTH is true", async () => {
    process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH = "true";
    const { getFeatureFlags } = await import("@/lib/config/featureFlags");
    const flags = getFeatureFlags();
    expect(flags.ENABLE_CUSTOM_AUTH).toBe(true);
  });

  it("returns custom auth enabled when ENABLE_CUSTOM_AUTH is true", async () => {
    process.env.ENABLE_CUSTOM_AUTH = "true";
    const { getFeatureFlags } = await import("@/lib/config/featureFlags");
    const flags = getFeatureFlags();
    expect(flags.ENABLE_CUSTOM_AUTH).toBe(true);
  });

  it("returns custom auth enabled when custom-auth is the selected provider", async () => {
    mockAuthProvider = "custom-auth";
    const { getFeatureFlags } = await import("@/lib/config/featureFlags");
    const flags = getFeatureFlags();
    expect(flags.ENABLE_CUSTOM_AUTH).toBe(true);
  });

  it("isFeatureEnabled returns correct value", async () => {
    mockAdminEnabled = true;
    const { isFeatureEnabled } = await import("@/lib/config/featureFlags");
    expect(isFeatureEnabled("ENABLE_ADMIN")).toBe(true);
  });

  it("assertFeatureEnabled throws when disabled", async () => {
    mockAdminEnabled = false;
    const { assertFeatureEnabled } = await import("@/lib/config/featureFlags");
    expect(() => assertFeatureEnabled("ENABLE_ADMIN")).toThrow(
      "Feature 'ENABLE_ADMIN' is disabled by configuration"
    );
  });

  it("resolveClientFeatureFlags merges overrides", async () => {
    const { resolveClientFeatureFlags } = await import("@/lib/config/featureFlags");
    const result = resolveClientFeatureFlags({ ENABLE_ADMIN: false });
    expect(result.ENABLE_ADMIN).toBe(false);
    expect(result.ENABLE_CUSTOM_AUTH).toBe(false);
  });
});
