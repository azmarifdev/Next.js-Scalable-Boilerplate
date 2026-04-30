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
  if (appConfig.authProvider === "custom-auth") {
    const isCustomAuthEnabled =
      process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH === "true" ||
      process.env.ENABLE_CUSTOM_AUTH === "true";

    if (!isCustomAuthEnabled) {
      console.warn(
        "NEXT_PUBLIC_AUTH_PROVIDER=custom-auth but custom auth flag is disabled. Falling back to better-auth."
      );
      return providerRegistry["better-auth"];
    }
  }

  return providerRegistry[appConfig.authProvider];
}

export const authProvider: AuthProvider = resolveAuthProvider();
