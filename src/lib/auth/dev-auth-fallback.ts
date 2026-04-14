import { verifyPassword } from "@/lib/auth/password";
import type { User } from "@/types/user";

interface DevAuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  passwordHash: string;
  failedAttempts: number;
  lockedUntil: Date | null;
}

const devUser: DevAuthUser = {
  id: "u_demo_admin",
  name: "Demo Admin",
  email: "admin@example.com",
  role: "admin",
  passwordHash:
    "scrypt$DfixAOmN/HyToJDXVsnsMQ==$0KALoYelUP+hzauO8lv/iA91bmhy/uKfTGetxpSlP3XxklctbE1d9ni1A103qH/cBRItXtPU6Yc1ZsO+moVNTw==",
  failedAttempts: 0,
  lockedUntil: null
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

function toUser(user: DevAuthUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function tryDevAuthLogin(input: {
  email: string;
  password: string;
}): Promise<{ user?: User; status: number; message?: string }> {
  const normalizedEmail = input.email.toLowerCase();
  if (normalizedEmail !== devUser.email) {
    return { status: 401, message: "Invalid email or password" };
  }

  if (devUser.lockedUntil && devUser.lockedUntil.getTime() > Date.now()) {
    return { status: 429, message: "Too many login attempts. Please try again later." };
  }

  const passwordMatches = await verifyPassword(input.password, devUser.passwordHash);
  if (!passwordMatches) {
    devUser.failedAttempts += 1;
    if (devUser.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      devUser.lockedUntil = new Date(Date.now() + LOCK_WINDOW_MS);
    }
    return { status: 401, message: "Invalid email or password" };
  }

  devUser.failedAttempts = 0;
  devUser.lockedUntil = null;

  return { status: 200, user: toUser(devUser) };
}
