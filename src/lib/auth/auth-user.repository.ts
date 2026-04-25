import { and, eq } from "drizzle-orm";

import type { AuthAdapter, AuthUserRecord } from "@/lib/auth/adapter";
import { getDrizzleClient } from "@/lib/db/providers/drizzle";
import { authUsers } from "@/lib/db/schema";
import type { UserRole } from "@/types/auth";

export class AuthEmailExistsError extends Error {
  constructor() {
    super("Email already exists");
    this.name = "AuthEmailExistsError";
  }
}

export function isAuthEmailExistsError(error: unknown): boolean {
  return error instanceof AuthEmailExistsError;
}

class PostgresAuthAdapter implements AuthAdapter {
  isConfigured(): boolean {
    return Boolean(getDrizzleClient());
  }

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const db = getDrizzleClient();
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
    const db = getDrizzleClient();
    if (!db) {
      throw new Error("Auth database is not configured");
    }

    let created;
    try {
      [created] = await db
        .insert(authUsers)
        .values({
          id: `u_${crypto.randomUUID()}`,
          name: input.name,
          email: input.email.toLowerCase(),
          role: input.role ?? "user",
          passwordHash: input.passwordHash
        })
        .returning();
    } catch (error) {
      const errorCode = (error as { code?: string })?.code;
      if (errorCode === "23505") {
        throw new AuthEmailExistsError();
      }
      throw error;
    }

    return {
      ...created,
      role: created.role === "admin" ? "admin" : "user"
    };
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const db = getDrizzleClient();
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
    const db = getDrizzleClient();
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

const adapter: AuthAdapter = new PostgresAuthAdapter();

export type { AuthAdapter, AuthUserRecord } from "@/lib/auth/adapter";

export function getAuthAdapter(): AuthAdapter {
  return adapter;
}

export function isAuthDatabaseConfigured(): boolean {
  return adapter.isConfigured();
}

export async function findAuthUserByEmail(email: string): Promise<AuthUserRecord | null> {
  return adapter.findByEmail(email);
}

export async function createAuthUser(input: {
  name: string;
  email: string;
  role?: UserRole;
  passwordHash: string;
}): Promise<AuthUserRecord> {
  return adapter.createUser(input);
}

export async function resetFailedLoginAttempts(userId: string): Promise<void> {
  await adapter.resetFailedLoginAttempts(userId);
}

export async function recordFailedLoginAttempt(
  user: Pick<AuthUserRecord, "id" | "failedLoginAttempts">,
  lockUntil: Date | null
): Promise<void> {
  await adapter.recordFailedLoginAttempt(user, lockUntil);
}
