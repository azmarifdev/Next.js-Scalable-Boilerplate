import { describe, expect, it } from "vitest";

import { resolveRequestId } from "@/lib/utils/api-response";

describe("resolveRequestId", () => {
  it("returns provided requestId when given", () => {
    expect(resolveRequestId(undefined, "req-123")).toBe("req-123");
  });

  it("generates uuid when nothing provided", () => {
    const id = resolveRequestId();
    expect(id).toBeTruthy();
    expect(id?.length).toBeGreaterThan(10);
  });

  it("generates different ids on consecutive calls", () => {
    const a = resolveRequestId();
    const b = resolveRequestId();
    expect(a).not.toBe(b);
  });
});
