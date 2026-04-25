import { betterAuthProvider } from "@/lib/auth/better-auth.provider";
import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import type { User } from "@/types/user";

export interface AuthProvider {
  login(payload: AuthPayload): Promise<AuthResponse>;
  register(payload: AuthPayload): Promise<AuthResponse>;
  getMe(): Promise<User>;
  logout(): Promise<{ cleared: boolean }>;
  refreshToken(): Promise<{ refreshed: boolean }>;
}

export const authProvider: AuthProvider = betterAuthProvider;
