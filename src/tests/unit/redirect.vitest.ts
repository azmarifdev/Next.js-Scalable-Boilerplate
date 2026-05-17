import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "@/lib/security/redirect";

describe("getSafeRedirectPath", () => {
  it("returns fallback for empty input", () => {
    expect(getSafeRedirectPath(null, "/dashboard")).toBe("/dashboard");
  });

  it("accepts safe relative paths", () => {
    expect(getSafeRedirectPath("/docs", "/dashboard")).toBe("/docs");
    expect(getSafeRedirectPath("/docs?tab=1", "/dashboard")).toBe("/docs?tab=1");
  });

  it("rejects protocol-relative URLs", () => {
    expect(getSafeRedirectPath("//evil.com", "/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectPath("///evil.com", "/dashboard")).toBe("/dashboard");
  });

  it("rejects absolute URLs", () => {
    expect(getSafeRedirectPath("https://evil.com", "/dashboard")).toBe("/dashboard");
  });

  it("accepts relative path with hash", () => {
    expect(getSafeRedirectPath("/docs#section", "/dashboard")).toBe("/docs#section");
  });

  it("rejects backslash paths", () => {
    expect(getSafeRedirectPath("/\\evil", "/dashboard")).toBe("/dashboard");
  });
});
