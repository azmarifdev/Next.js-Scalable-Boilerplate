import type { Permission, UserRole } from "@/types/auth";
import { permissions, roles } from "@/types/auth";

export type ApiMode = "rest";
export type BackendMode = "external" | "internal";
export type DbProvider = "postgres";
export type AuthProvider = "better-auth";

interface FeatureConfig {
  ecommerce: boolean;
  billing: boolean;
  admin: boolean;
}

interface AuthConfig {
  roles: UserRole[];
  permissions: Permission[];
}

export interface AppConfig {
  apiMode: ApiMode;
  backendMode: BackendMode;
  dbProvider: DbProvider;
  authProvider: AuthProvider;
  features: FeatureConfig;
  auth: AuthConfig;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") {
    return fallback;
  }

  return value === "true";
}

function parseBackendMode(value: string | undefined): BackendMode {
  return value === "external" ? "external" : "internal";
}

export const appConfig: AppConfig = {
  apiMode: "rest",
  backendMode: parseBackendMode(process.env.NEXT_PUBLIC_BACKEND_MODE),
  dbProvider: "postgres",
  authProvider: "better-auth",
  features: {
    ecommerce: parseBoolean(
      process.env.NEXT_PUBLIC_ENABLE_ECOMMERCE ?? process.env.ENABLE_ECOMMERCE,
      false
    ),
    billing: parseBoolean(
      process.env.NEXT_PUBLIC_ENABLE_BILLING ?? process.env.ENABLE_BILLING,
      false
    ),
    admin: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_ADMIN, true)
  },
  auth: {
    roles,
    permissions
  }
};
