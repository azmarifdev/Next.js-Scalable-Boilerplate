import { and, eq } from "drizzle-orm";

import type { AuthAdapter, AuthUserRecord } from "@/lib/auth/adapter";
import { db } from "@/lib/db";
import { authUsers } from "@/lib/schema";
import type { UserRole } from "@/types/auth";

class PostgresAuthAdapter implements AuthAdapter {
  isConfigured(): boolean {
    return Boolean(db);
  }

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    if (!db) {
      return null;
    }

    const [row] = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email.toLowerCase()))
      .limit(1);

    if (!row) {
      return null;
    }

    return {
      ...row,
      role: row.role === "admin" ? "admin" : "user"
    };
  }

  async createUser(input: {
    name: string;
    email: string;
    role?: UserRole;
    passwordHash: string;
  }): Promise<AuthUserRecord> {
    if (!db) {
      throw new Error("Auth database is not configured");
    }

    const [created] = await db
      .insert(authUsers)
      .values({
        id: `u_${crypto.randomUUID()}`,
        name: input.name,
        email: input.email.toLowerCase(),
        role: input.role ?? "user",
        passwordHash: input.passwordHash
      })
      .returning();

    return {
      ...created,
      role: created.role === "admin" ? "admin" : "user"
    };
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    if (!db) {
      return;
    }

    await db
      .update(authUsers)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date()
      })
      .where(eq(authUsers.id, userId));
  }

  async recordFailedLoginAttempt(
    user: Pick<AuthUserRecord, "id" | "failedLoginAttempts">,
    lockUntil: Date | null
  ): Promise<void> {
    if (!db) {
      return;
    }

    await db
      .update(authUsers)
      .set({
        failedLoginAttempts: user.failedLoginAttempts + 1,
        lockedUntil: lockUntil,
        updatedAt: new Date()
      })
      .where(
        and(eq(authUsers.id, user.id), eq(authUsers.failedLoginAttempts, user.failedLoginAttempts))
      );
  }
}

const authAdapter: AuthAdapter = new PostgresAuthAdapter();

export type { AuthAdapter, AuthUserRecord } from "@/lib/auth/adapter";

export function getAuthAdapter(): AuthAdapter {
  return authAdapter;
}

export function isAuthDatabaseConfigured(): boolean {
  return authAdapter.isConfigured();
}

export async function findAuthUserByEmail(email: string): Promise<AuthUserRecord | null> {
  return authAdapter.findByEmail(email);
}

export async function createAuthUser(input: {
  name: string;
  email: string;
  role?: UserRole;
  passwordHash: string;
}): Promise<AuthUserRecord> {
  return authAdapter.createUser(input);
}

export async function resetFailedLoginAttempts(userId: string): Promise<void> {
  await authAdapter.resetFailedLoginAttempts(userId);
}

export async function recordFailedLoginAttempt(
  user: Pick<AuthUserRecord, "id" | "failedLoginAttempts">,
  lockUntil: Date | null
): Promise<void> {
  await authAdapter.recordFailedLoginAttempt(user, lockUntil);
}
