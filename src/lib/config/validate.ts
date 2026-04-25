import { appConfig } from "@/lib/config/app-config";
import { env } from "@/lib/config/env";

let validated = false;

function collectErrors(): string[] {
  const errors: string[] = [];

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
