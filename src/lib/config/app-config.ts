import type { Permission, UserRole } from "@/types/auth";
import { permissions, roles } from "@/types/auth";

export type ApiMode = "rest" | "graphql";
export type BackendMode = "external" | "internal";
export type DbProvider = "mongo" | "postgres";
export type AuthProvider = "custom" | "nextauth";

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

function parseApiMode(value: string | undefined): ApiMode {
  return value === "graphql" ? "graphql" : "rest";
}

function parseBackendMode(value: string | undefined): BackendMode {
  return value === "internal" ? "internal" : "external";
}

function parseDbProvider(value: string | undefined): DbProvider {
  return value === "postgres" ? "postgres" : "mongo";
}

function parseAuthProvider(value: string | undefined): AuthProvider {
  return value === "nextauth" ? "nextauth" : "custom";
}

export const appConfig: AppConfig = {
  apiMode: parseApiMode(process.env.NEXT_PUBLIC_API_MODE),
  backendMode: parseBackendMode(process.env.NEXT_PUBLIC_BACKEND_MODE),
  dbProvider: parseDbProvider(process.env.NEXT_PUBLIC_DB_PROVIDER),
  authProvider: parseAuthProvider(process.env.NEXT_PUBLIC_AUTH_PROVIDER),
  features: {
    ecommerce: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_ECOMMERCE, true),
    billing: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_BILLING, true),
    admin: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_ADMIN, true)
  },
  auth: {
    roles,
    permissions
  }
};
