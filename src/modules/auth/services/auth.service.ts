import { appConfig } from "@/lib/config/app-config";
import { customAuthService } from "@/modules/auth/services/custom-auth.service";
import { nextAuthService } from "@/modules/auth/services/nextauth.service";
import type { AuthPayload, AuthResponse } from "@/modules/auth/types";
import type { User } from "@/types/user";

interface AuthService {
  login(payload: AuthPayload): Promise<AuthResponse>;
  register(payload: AuthPayload): Promise<AuthResponse>;
  getMe(): Promise<User>;
  logout(): Promise<{ cleared: boolean }>;
  refreshToken(): Promise<{ refreshed: boolean }>;
}

const providers: Record<typeof appConfig.authProvider, AuthService> = {
  custom: customAuthService,
  nextauth: nextAuthService
};

export const authService: AuthService = providers[appConfig.authProvider];
