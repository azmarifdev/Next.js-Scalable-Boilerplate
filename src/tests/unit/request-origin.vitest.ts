import { describe, expect, it } from "vitest";

import { requireSameOrigin } from "@/lib/security/request-origin";

describe("requireSameOrigin", () => {
  it("allows same origin", () => {
    const request = new Request("http://127.0.0.1:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        origin: "http://127.0.0.1:3000"
      }
    });

    expect(requireSameOrigin(request, {})).toBeNull();
  });

  it("allows loopback aliases with same protocol and port", () => {
    const request = new Request("http://127.0.0.1:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000"
      }
    });

    expect(requireSameOrigin(request, {})).toBeNull();
  });

  it("allows 0.0.0.0 as loopback alias", () => {
    const request = new Request("http://0.0.0.0:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        origin: "http://127.0.0.1:3000"
      }
    });

    expect(requireSameOrigin(request, {})).toBeNull();
  });

  it("rejects non-loopback cross origin", async () => {
    const request = new Request("http://127.0.0.1:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        origin: "https://evil.example.com"
      }
    });

    const response = requireSameOrigin(request, {});
    expect(response).not.toBeNull();

    const payload = await response?.json();
    expect(response?.status).toBe(403);
    expect(payload?.error?.code).toBe("FORBIDDEN_ORIGIN");
  });
});
