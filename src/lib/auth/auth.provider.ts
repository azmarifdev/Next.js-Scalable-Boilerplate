import { betterAuthProvider } from "@/lib/auth/better-auth.provider";
import { appConfig } from "@/lib/config/app-config";
import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import { customAuthProvider } from "@/modules/optional/auth/custom-auth.provider";
import type { User } from "@/types/user";

export interface AuthProvider {
  login(payload: AuthPayload): Promise<AuthResponse>;
  register(payload: AuthPayload): Promise<AuthResponse>;
  getMe(): Promise<User>;
  logout(): Promise<{ cleared: boolean }>;
  refreshToken(): Promise<{ refreshed: boolean }>;
}

const providerRegistry: Record<"better-auth" | "custom-auth", AuthProvider> = {
  "better-auth": betterAuthProvider,
  "custom-auth": customAuthProvider
};

function resolveAuthProvider(): AuthProvider {
  return providerRegistry[appConfig.authProvider];
}

export const authProvider: AuthProvider = resolveAuthProvider();
