import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional()
);
const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);
const optionalBooleanString = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.enum(["true", "false"]).optional()
);
const appName = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().min(1).default("Next.js-Boilerplate-PostgresQL-Drizzle")
);

export const env = createEnv({
  server: {
    DATABASE_URL: optionalUrl,
    AUTH_SESSION_SECRET: optionalString,
    AUTH_SESSION_SECRETS: optionalString,
    AUTH_MFA_STATIC_CODE: optionalString,
    AUTH_MFA_VERIFY_URL: optionalUrl,
    AUTH_MFA_VERIFY_BEARER_TOKEN: optionalString,
    ALLOW_STATIC_MFA_IN_PRODUCTION: optionalBooleanString,
    ALLOW_DEMO_AUTH: optionalBooleanString,
    ALLOW_INSECURE_DEV_AUTH: optionalBooleanString,
    REQUIRE_ADMIN_STEP_UP_AUTH: optionalBooleanString,
    ENABLE_BILLING: optionalBooleanString,
    ENABLE_ECOMMERCE: optionalBooleanString,
    ENABLE_CUSTOM_AUTH: optionalBooleanString
  },
  client: {
    NEXT_PUBLIC_APP_NAME: appName,
    NEXT_PUBLIC_API_BASE_URL: optionalString,
    NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL: optionalUrl,
    NEXT_PUBLIC_SITE_URL: optionalUrl,
    NEXT_PUBLIC_BACKEND_MODE: z.enum(["external", "internal"]).default("internal"),
    NEXT_PUBLIC_AUTH_PROVIDER: z.enum(["better-auth", "custom-auth"]).default("better-auth"),
    NEXT_PUBLIC_ENABLE_ECOMMERCE: optionalBooleanString,
    NEXT_PUBLIC_ENABLE_BILLING: optionalBooleanString,
    NEXT_PUBLIC_ENABLE_CUSTOM_AUTH: optionalBooleanString,
    NEXT_PUBLIC_FEATURE_ADMIN: optionalBooleanString
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS,
    AUTH_MFA_STATIC_CODE: process.env.AUTH_MFA_STATIC_CODE,
    AUTH_MFA_VERIFY_URL: process.env.AUTH_MFA_VERIFY_URL,
    AUTH_MFA_VERIFY_BEARER_TOKEN: process.env.AUTH_MFA_VERIFY_BEARER_TOKEN,
    ALLOW_STATIC_MFA_IN_PRODUCTION: process.env.ALLOW_STATIC_MFA_IN_PRODUCTION,
    ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH,
    ALLOW_INSECURE_DEV_AUTH: process.env.ALLOW_INSECURE_DEV_AUTH,
    REQUIRE_ADMIN_STEP_UP_AUTH: process.env.REQUIRE_ADMIN_STEP_UP_AUTH,
    ENABLE_BILLING: process.env.ENABLE_BILLING,
    ENABLE_ECOMMERCE: process.env.ENABLE_ECOMMERCE,
    ENABLE_CUSTOM_AUTH: process.env.ENABLE_CUSTOM_AUTH,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL: process.env.NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
    NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
    NEXT_PUBLIC_ENABLE_ECOMMERCE: process.env.NEXT_PUBLIC_ENABLE_ECOMMERCE,
    NEXT_PUBLIC_ENABLE_BILLING: process.env.NEXT_PUBLIC_ENABLE_BILLING,
    NEXT_PUBLIC_ENABLE_CUSTOM_AUTH: process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH,
    NEXT_PUBLIC_FEATURE_ADMIN: process.env.NEXT_PUBLIC_FEATURE_ADMIN
  }
});
