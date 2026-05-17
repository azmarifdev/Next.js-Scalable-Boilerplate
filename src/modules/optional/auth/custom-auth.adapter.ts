import { z } from "zod";

import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import type {
  ExternalIdPAdapter,
  ExternalIdPTokenResponse
} from "@/modules/optional/auth/custom-auth.types";
import type { User } from "@/types/user";

interface ApiErrorLike {
  message?: string;
  status?: number;
  code?: string;
}

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"])
});

export class ExternalIdPConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExternalIdPConfigError";
  }
}

function resolveExternalIdPBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL;
  if (!baseUrl) {
    throw new ExternalIdPConfigError(
      "NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL is required for custom-auth provider"
    );
  }

  return baseUrl.replace(/\/$/, "");
}

async function externalRequest<TResponse, TPayload>(
  method: "GET" | "POST",
  path: string,
  payload?: TPayload,
  headers?: Record<string, string>
): Promise<TResponse> {
  const baseUrl = resolveExternalIdPBaseUrl();
  let response: Response;
  const signal = typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5000) : null;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(headers ?? {})
      },
      credentials: "include",
      ...(signal ? { signal } : {}),
      body: payload === undefined ? undefined : JSON.stringify(payload),
      cache: "no-store"
    });
  } catch (error) {
    const message =
      "Could not reach custom auth provider. Check CORS (Access-Control-Allow-Origin + credentials), HTTPS, and endpoint availability.";
    throw new Error(`${message} ${(error as Error)?.message ?? ""}`.trim());
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorLike | null;
    const message = errorBody?.message ?? `External IdP request failed (${response.status})`;
    throw new Error(message);
  }

  return (await response.json()) as TResponse;
}

function normalizeAuthResponse(payload: unknown): AuthResponse {
  const user = extractUserLike(payload);
  if (user) return { user };

  throw new Error("Invalid auth response from custom auth provider");
}

function normalizeUserResponse(payload: unknown): User {
  const user = extractUserLike(payload);
  if (user) return user;

  throw new Error("Invalid user response from custom auth provider");
}

function extractUserLike(payload: unknown): User | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const root = payload as Record<string, unknown>;
  const candidates: unknown[] = [
    root.user,
    root.profile,
    root.account,
    root.data,
    (root.data as Record<string, unknown> | undefined)?.user,
    (root.data as Record<string, unknown> | undefined)?.profile,
    (root.data as Record<string, unknown> | undefined)?.account
  ];

  for (const candidate of candidates) {
    const parsed = userSchema.safeParse(candidate);
    if (parsed.success) {
      return parsed.data;
    }
  }

  return null;
}

function normalizeBooleanResult(
  payload: unknown,
  key: "cleared" | "refreshed"
): { cleared: boolean } | { refreshed: boolean } {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    (payload as { success?: unknown }).success === true
  ) {
    const envelope = payload as { data?: Record<string, unknown> };
    const value = envelope.data?.[key];
    if (typeof value === "boolean") {
      return key === "cleared" ? { cleared: value } : { refreshed: value };
    }
  }

  if (typeof payload === "object" && payload !== null && key in payload) {
    const value = (payload as Record<string, unknown>)[key];
    if (typeof value === "boolean") {
      return key === "cleared" ? { cleared: value } : { refreshed: value };
    }
  }

  throw new Error(`Invalid ${key} response from custom auth provider`);
}

export const customAuthAdapter: ExternalIdPAdapter = {
  async login(payload: AuthPayload): Promise<AuthResponse> {
    const response = await externalRequest<unknown, AuthPayload>("POST", "/auth/login", payload);
    return normalizeAuthResponse(response);
  },

  async register(payload: AuthPayload): Promise<AuthResponse> {
    const response = await externalRequest<unknown, AuthPayload>("POST", "/auth/register", payload);
    return normalizeAuthResponse(response);
  },

  async getMe(): Promise<User> {
    const response = await externalRequest<unknown, never>("GET", "/auth/me");
    return normalizeUserResponse(response);
  },

  async logout(): Promise<{ cleared: boolean }> {
    const response = await externalRequest<unknown, Record<string, never>>(
      "POST",
      "/auth/logout",
      {}
    );
    return normalizeBooleanResult(response, "cleared") as { cleared: boolean };
  },

  async refreshToken(): Promise<{ refreshed: boolean }> {
    const response = await externalRequest<unknown, Record<string, never>>(
      "POST",
      "/auth/refresh",
      {}
    );
    return normalizeBooleanResult(response, "refreshed") as { refreshed: boolean };
  },

  exchangeAuthorizationCode(input: {
    code: string;
    redirectUri: string;
    codeVerifier?: string;
  }): Promise<ExternalIdPTokenResponse> {
    return externalRequest<ExternalIdPTokenResponse, typeof input>("POST", "/oauth/token", input);
  },

  verifyMfaChallenge(input: {
    challengeId: string;
    code: string;
  }): Promise<{ verified: boolean; nextToken?: string }> {
    return externalRequest<{ verified: boolean; nextToken?: string }, typeof input>(
      "POST",
      "/mfa/verify",
      input
    );
  }
};
