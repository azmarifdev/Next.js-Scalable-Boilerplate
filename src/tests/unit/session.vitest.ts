import { afterEach, describe, expect, it } from "vitest";

import { createSessionToken, verifySessionToken } from "@/lib/auth/session";

describe("session token", () => {
  const original = {
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS,
    ALLOW_INSECURE_DEV_AUTH: process.env.ALLOW_INSECURE_DEV_AUTH
  };

  afterEach(() => {
    process.env.AUTH_SESSION_SECRET = original.AUTH_SESSION_SECRET;
    process.env.AUTH_SESSION_SECRETS = original.AUTH_SESSION_SECRETS;
    process.env.ALLOW_INSECURE_DEV_AUTH = original.ALLOW_INSECURE_DEV_AUTH;
  });

  it("creates and verifies a valid token", async () => {
    process.env.AUTH_SESSION_SECRET = "test-secret";
    const token = await createSessionToken(
      { sub: "u_1", name: "Demo User", email: "demo@example.com", role: "admin" },
      60
    );

    const payload = await verifySessionToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("u_1");
    expect(payload?.email).toBe("demo@example.com");
    expect(payload?.role).toBe("admin");
  });

  it("rejects a tampered token", async () => {
    process.env.AUTH_SESSION_SECRET = "test-secret";
    const token = await createSessionToken(
      { sub: "u_2", name: "Another", email: "another@example.com", role: "user" },
      60
    );
    const [header, body, signature] = token.split(".");
    const tamperedToken = `${header}.${body}.tampered${signature}`;

    const verifiedPayload = await verifySessionToken(tamperedToken);
    expect(verifiedPayload).toBeNull();
  });

  it("fails fast when secret is missing and insecure fallback is disabled", async () => {
    delete process.env.AUTH_SESSION_SECRET;
    delete process.env.AUTH_SESSION_SECRETS;
    process.env.ALLOW_INSECURE_DEV_AUTH = "false";

    await expect(
      createSessionToken(
        { sub: "u_3", name: "No Secret", email: "no@example.com", role: "user" },
        60
      )
    ).rejects.toThrow(/ALLOW_INSECURE_DEV_AUTH=true/);
  });
});
