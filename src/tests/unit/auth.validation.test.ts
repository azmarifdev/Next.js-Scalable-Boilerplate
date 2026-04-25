import { loginSchema, registerSchema } from "@/modules/auth/auth.schema";

describe("auth validation", () => {
  it("validates a correct login payload", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "secret123"
    });

    expect(result.success).toBe(true);
  });

  it("rejects short password during register", () => {
    const result = registerSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      password: "123"
    });

    expect(result.success).toBe(false);
  });
});
