import { appConfig } from "@/lib/config/app-config";
import { env } from "@/lib/config/env";

let validated = false;

function collectErrors(): string[] {
  const errors: string[] = [];
  const isCustomAuthEnabled =
    process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH === "true" ||
    process.env.ENABLE_CUSTOM_AUTH === "true";

  if (appConfig.backendMode === "internal") {
    const allowDemoAuth = process.env.ALLOW_DEMO_AUTH === "true";
    const hasSessionSecret = Boolean(
      env.AUTH_SESSION_SECRET?.trim() || env.AUTH_SESSION_SECRETS?.trim()
    );

    if (!hasSessionSecret && process.env.ALLOW_INSECURE_DEV_AUTH !== "true") {
      errors.push(
        "AUTH_SESSION_SECRET or AUTH_SESSION_SECRETS is required for internal auth (or set ALLOW_INSECURE_DEV_AUTH=true for local development only)."
      );
    }

    if (!allowDemoAuth && !env.DATABASE_URL?.trim()) {
      errors.push("DATABASE_URL is required when NEXT_PUBLIC_BACKEND_MODE=internal.");
    }
  }

  if (appConfig.authProvider === "custom-auth" && isCustomAuthEnabled) {
    const customBaseUrl = env.NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL?.trim();
    if (!customBaseUrl) {
      errors.push(
        "NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL is required when NEXT_PUBLIC_AUTH_PROVIDER=custom-auth and custom auth is enabled."
      );
    } else if (process.env.NODE_ENV === "production" && !customBaseUrl.startsWith("https://")) {
      errors.push("NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL must use https:// in production.");
    }
  }

  return errors;
}

export function validateRuntimeConfig(): void {
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  const skipValidation = process.env.SKIP_RUNTIME_VALIDATION === "true";

  if (validated || process.env.NODE_ENV === "test" || isBuildPhase || skipValidation) {
    return;
  }

  const errors = collectErrors();
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n- ${errors.join("\n- ")}`);
  }

  validated = true;
}
