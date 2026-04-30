import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import type { User } from "@/types/user";

export interface ExternalIdPTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  scope?: string;
}

export interface ExternalIdPChallenge {
  challengeId: string;
  method: "totp" | "sms" | "email";
}

export interface ExternalIdPAdapter {
  login(payload: AuthPayload): Promise<AuthResponse>;
  register(payload: AuthPayload): Promise<AuthResponse>;
  getMe(): Promise<User>;
  logout(): Promise<{ cleared: boolean }>;
  refreshToken(): Promise<{ refreshed: boolean }>;

  exchangeAuthorizationCode(input: {
    code: string;
    redirectUri: string;
    codeVerifier?: string;
  }): Promise<ExternalIdPTokenResponse>;

  verifyMfaChallenge(input: {
    challengeId: string;
    code: string;
  }): Promise<{ verified: boolean; nextToken?: string }>;
}
