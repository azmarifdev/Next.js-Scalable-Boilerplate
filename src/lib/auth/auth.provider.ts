import { betterAuthProvider } from "@/lib/auth/better-auth.provider";
import { customAuthProvider } from "@/lib/auth/custom-auth.provider";
import { appConfig } from "@/lib/config/app-config";
import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import type { User } from "@/types/user";

export interface AuthProvider {
  login(payload: AuthPayload): Promise<AuthResponse>;
  register(payload: AuthPayload): Promise<AuthResponse>;
  getMe(): Promise<User>;
  logout(): Promise<{ cleared: boolean }>;
  refreshToken(): Promise<{ refreshed: boolean }>;
}

const providers: Record<typeof appConfig.authProvider, AuthProvider> = {
  "better-auth": betterAuthProvider,
  custom: customAuthProvider
};

export const authProvider: AuthProvider = providers[appConfig.authProvider];
