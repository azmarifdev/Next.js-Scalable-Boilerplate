import type { UserRole } from "@/types/auth";

export interface AuthUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}

export interface AuthAdapter {
  isConfigured(): boolean;
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  createUser(input: {
    name: string;
    email: string;
    role?: UserRole;
    passwordHash: string;
  }): Promise<AuthUserRecord>;
  resetFailedLoginAttempts(userId: string): Promise<void>;
  recordFailedLoginAttempt(
    user: Pick<AuthUserRecord, "id" | "failedLoginAttempts">,
    lockUntil: Date | null
  ): Promise<void>;
}
