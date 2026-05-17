import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("logger", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.assign(process.env, ORIGINAL_ENV);
  });

  it("info emits a JSON payload via console.info", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { logger } = await import("@/lib/observability/logger");

    logger.info("hello", { route: "/test" });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(infoSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe("info");
    expect(payload.message).toBe("hello");
    expect(payload.context?.route).toBe("/test");
    expect(payload.timestamp).toBeTruthy();
  });

  it("warn emits via console.warn", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { logger } = await import("@/lib/observability/logger");

    logger.warn("caution");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe("warn");
    expect(payload.message).toBe("caution");
  });

  it("error emits via console.error", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { logger } = await import("@/lib/observability/logger");

    logger.error("fail");

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe("error");
    expect(payload.message).toBe("fail");
  });

  it("debug does not emit in production", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { logger } = await import("@/lib/observability/logger");

    logger.debug("should be silent");

    expect(infoSpy).not.toHaveBeenCalled();
    (process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
  });

  it("debug emits in non-production", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "development";
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const { logger } = await import("@/lib/observability/logger");

    logger.debug("dev debug");

    expect(infoSpy).toHaveBeenCalledTimes(1);
    (process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
  });
});
