import { and, eq } from "drizzle-orm";

import type { AuthAdapter, AuthUserRecord } from "@/lib/auth/adapter";
import { appConfig } from "@/lib/config/app-config";
import { getDrizzleClient } from "@/lib/db/providers/drizzle";
import { getMongoDb } from "@/lib/db/providers/mongo";
import { authUsers } from "@/lib/db/schema";
import type { UserRole } from "@/types/auth";

interface MongoAuthUserDocument {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthEmailExistsError extends Error {
  constructor() {
    super("Email already exists");
    this.name = "AuthEmailExistsError";
  }
}

export function isAuthEmailExistsError(error: unknown): boolean {
  return error instanceof AuthEmailExistsError;
}

class MongoAuthAdapter implements AuthAdapter {
  isConfigured(): boolean {
    return Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB_NAME);
  }

  private async getCollection() {
    const mongoDb = await getMongoDb();
    if (!mongoDb) {
      return null;
    }

    return mongoDb.collection<MongoAuthUserDocument>("auth_users");
  }

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const collection = await this.getCollection();
    if (!collection) {
      return null;
    }

    const row = await collection.findOne({ email: email.toLowerCase() });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      passwordHash: row.passwordHash,
      failedLoginAttempts: row.failedLoginAttempts,
      lockedUntil: row.lockedUntil
    };
  }

  async createUser(input: {
    name: string;
    email: string;
    role?: UserRole;
    passwordHash: string;
  }): Promise<AuthUserRecord> {
    const collection = await this.getCollection();
    if (!collection) {
      throw new Error("MongoDB auth provider is not configured");
    }

    const normalizedEmail = input.email.toLowerCase();
    const user: MongoAuthUserDocument = {
      id: `u_${crypto.randomUUID()}`,
      name: input.name,
      email: normalizedEmail,
      role: input.role ?? "user",
      passwordHash: input.passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { email: normalizedEmail },
      {
        $setOnInsert: user
      },
      { upsert: true }
    );
    if (!result.upsertedId) {
      throw new AuthEmailExistsError();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: user.passwordHash,
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil
    };
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const collection = await this.getCollection();
    if (!collection) {
      return;
    }

    await collection.updateOne(
      { id: userId },
      {
        $set: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          updatedAt: new Date()
        }
      }
    );
  }

  async recordFailedLoginAttempt(
    user: Pick<AuthUserRecord, "id" | "failedLoginAttempts">,
    lockUntil: Date | null
  ): Promise<void> {
    const collection = await this.getCollection();
    if (!collection) {
      return;
    }

    await collection.updateOne(
      { id: user.id, failedLoginAttempts: user.failedLoginAttempts },
      {
        $set: {
          failedLoginAttempts: user.failedLoginAttempts + 1,
          lockedUntil: lockUntil,
          updatedAt: new Date()
        }
      }
    );
  }
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

const adapters: Record<"mongo" | "postgres", AuthAdapter> = {
  mongo: new MongoAuthAdapter(),
  postgres: new PostgresAuthAdapter()
};

function getActiveAdapter(): AuthAdapter {
  return adapters[appConfig.dbProvider];
}

export type { AuthAdapter, AuthUserRecord } from "@/lib/auth/adapter";

export function getAuthAdapter(): AuthAdapter {
  return getActiveAdapter();
}

export function isAuthDatabaseConfigured(): boolean {
  if (appConfig.backendMode === "external") {
    return false;
  }

  return getActiveAdapter().isConfigured();
}

export async function findAuthUserByEmail(email: string): Promise<AuthUserRecord | null> {
  return getActiveAdapter().findByEmail(email);
}

export async function createAuthUser(input: {
  name: string;
  email: string;
  role?: UserRole;
  passwordHash: string;
}): Promise<AuthUserRecord> {
  return getActiveAdapter().createUser(input);
}

export async function resetFailedLoginAttempts(userId: string): Promise<void> {
  await getActiveAdapter().resetFailedLoginAttempts(userId);
}

export async function recordFailedLoginAttempt(
  user: Pick<AuthUserRecord, "id" | "failedLoginAttempts">,
  lockUntil: Date | null
): Promise<void> {
  await getActiveAdapter().recordFailedLoginAttempt(user, lockUntil);
}
