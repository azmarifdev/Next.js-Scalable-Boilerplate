import { appConfig } from "@/lib/config/app-config";
import { env } from "@/lib/config/env";

let validated = false;

function collectErrors(): string[] {
  const errors: string[] = [];

  if (appConfig.backendMode === "internal" && appConfig.authProvider === "custom") {
    if (appConfig.apiMode === "graphql") {
      errors.push(
        "NEXT_PUBLIC_API_MODE=graphql is not supported with internal custom auth because no internal /graphql route is provided. Use NEXT_PUBLIC_API_MODE=rest or configure an external GraphQL backend."
      );
    }

    const allowDemoAuth = process.env.ALLOW_DEMO_AUTH === "true";
    const hasSessionSecret = Boolean(
      env.AUTH_SESSION_SECRET?.trim() || env.AUTH_SESSION_SECRETS?.trim()
    );

    if (!hasSessionSecret && process.env.ALLOW_INSECURE_DEV_AUTH !== "true") {
      errors.push(
        "AUTH_SESSION_SECRET or AUTH_SESSION_SECRETS is required for internal custom auth (or set ALLOW_INSECURE_DEV_AUTH=true for local development only)."
      );
    }

    if (!allowDemoAuth && appConfig.dbProvider === "mongo") {
      if (!env.MONGODB_URI?.trim() || !env.MONGODB_DB_NAME?.trim()) {
        errors.push(
          "MONGODB_URI and MONGODB_DB_NAME are required when dbProvider=mongo and backendMode=internal."
        );
      }
    }

    if (!allowDemoAuth && appConfig.dbProvider === "postgres" && !env.DATABASE_URL?.trim()) {
      errors.push("DATABASE_URL is required when dbProvider=postgres and backendMode=internal.");
    }
  }

  if (
    appConfig.authProvider === "nextauth" &&
    (env.AUTH_GOOGLE_CLIENT_ID?.trim() || env.AUTH_GOOGLE_CLIENT_SECRET?.trim())
  ) {
    if (!env.AUTH_GOOGLE_CLIENT_ID?.trim() || !env.AUTH_GOOGLE_CLIENT_SECRET?.trim()) {
      errors.push(
        "Both AUTH_GOOGLE_CLIENT_ID and AUTH_GOOGLE_CLIENT_SECRET must be set for Google OAuth."
      );
    }
  }

  return errors;
}

export function validateRuntimeConfig(): void {
  if (validated || process.env.NODE_ENV === "test") {
    return;
  }

  const errors = collectErrors();
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n- ${errors.join("\n- ")}`);
  }

  validated = true;
}
