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
    APP_PROTOCOL: optionalString,
    APP_HOST: optionalString,
    PORT: optionalString,
    E2E_BASE_URL: optionalUrl,
    DATABASE_URL: optionalUrl,
    AUTH_SESSION_SECRET: optionalString,
    AUTH_SESSION_SECRETS: optionalString,
    AUTH_MFA_VERIFY_URL: optionalUrl,
    AUTH_MFA_VERIFY_BEARER_TOKEN: optionalString,
    REQUIRE_ADMIN_STEP_UP_AUTH: optionalBooleanString,
    ENABLE_CUSTOM_AUTH: optionalBooleanString,
    SENTRY_DSN: optionalUrl,
    SENTRY_AUTH_TOKEN: optionalString,
    SENTRY_ORG: optionalString,
    SENTRY_PROJECT: optionalString,
    SENTRY_TRACES_SAMPLE_RATE: optionalString,
    RESEND_API_KEY: optionalString,
    EMAIL_FROM: optionalString,
    UPSTASH_REDIS_REST_URL: optionalUrl,
    UPSTASH_REDIS_REST_TOKEN: optionalString
  },
  client: {
    NEXT_PUBLIC_APP_NAME: appName,
    NEXT_PUBLIC_API_BASE_URL: optionalString,
    NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL: optionalUrl,
    NEXT_PUBLIC_SITE_URL: optionalUrl,
    NEXT_PUBLIC_BACKEND_MODE: z.enum(["external", "internal"]).default("internal"),
    NEXT_PUBLIC_AUTH_PROVIDER: z.enum(["better-auth", "custom-auth"]).default("better-auth"),
    NEXT_PUBLIC_ENABLE_CUSTOM_AUTH: optionalBooleanString,
    NEXT_PUBLIC_FEATURE_ADMIN: optionalBooleanString,
    NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
    NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: optionalString
  },
  runtimeEnv: {
    APP_PROTOCOL: process.env.APP_PROTOCOL,
    APP_HOST: process.env.APP_HOST,
    PORT: process.env.PORT,
    E2E_BASE_URL: process.env.E2E_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS,
    AUTH_MFA_VERIFY_URL: process.env.AUTH_MFA_VERIFY_URL,
    AUTH_MFA_VERIFY_BEARER_TOKEN: process.env.AUTH_MFA_VERIFY_BEARER_TOKEN,
    REQUIRE_ADMIN_STEP_UP_AUTH: process.env.REQUIRE_ADMIN_STEP_UP_AUTH,
    ENABLE_CUSTOM_AUTH: process.env.ENABLE_CUSTOM_AUTH,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL: process.env.NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
    NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
    NEXT_PUBLIC_ENABLE_CUSTOM_AUTH: process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH,
    NEXT_PUBLIC_FEATURE_ADMIN: process.env.NEXT_PUBLIC_FEATURE_ADMIN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
  }
});
