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
  z.string().min(1).default("Nextjs Starter Template")
);

export const env = createEnv({
  server: {
    DATABASE_URL: optionalUrl,
    MONGODB_URI: optionalUrl,
    MONGODB_DB_NAME: optionalString,
    AUTH_SESSION_SECRET: optionalString,
    AUTH_SESSION_SECRETS: optionalString,
    ALLOW_DEMO_AUTH: optionalBooleanString,
    ALLOW_INSECURE_DEV_AUTH: optionalBooleanString,
    AUTH_GOOGLE_CLIENT_ID: optionalString,
    AUTH_GOOGLE_CLIENT_SECRET: optionalString
  },
  client: {
    NEXT_PUBLIC_APP_NAME: appName,
    NEXT_PUBLIC_API_BASE_URL: optionalString,
    NEXT_PUBLIC_SITE_URL: optionalUrl,
    NEXT_PUBLIC_API_MODE: z.enum(["rest", "graphql"]).default("rest"),
    NEXT_PUBLIC_BACKEND_MODE: z.enum(["external", "internal"]).default("external"),
    NEXT_PUBLIC_DB_PROVIDER: z.enum(["mongo", "postgres"]).default("mongo"),
    NEXT_PUBLIC_AUTH_PROVIDER: z.enum(["custom", "nextauth"]).default("custom"),
    NEXT_PUBLIC_FEATURE_ECOMMERCE: optionalBooleanString,
    NEXT_PUBLIC_FEATURE_BILLING: optionalBooleanString,
    NEXT_PUBLIC_FEATURE_ADMIN: optionalBooleanString
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    AUTH_SESSION_SECRETS: process.env.AUTH_SESSION_SECRETS,
    ALLOW_DEMO_AUTH: process.env.ALLOW_DEMO_AUTH,
    ALLOW_INSECURE_DEV_AUTH: process.env.ALLOW_INSECURE_DEV_AUTH,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
    NEXT_PUBLIC_BACKEND_MODE: process.env.NEXT_PUBLIC_BACKEND_MODE,
    NEXT_PUBLIC_DB_PROVIDER: process.env.NEXT_PUBLIC_DB_PROVIDER,
    NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
    NEXT_PUBLIC_FEATURE_ECOMMERCE: process.env.NEXT_PUBLIC_FEATURE_ECOMMERCE,
    NEXT_PUBLIC_FEATURE_BILLING: process.env.NEXT_PUBLIC_FEATURE_BILLING,
    NEXT_PUBLIC_FEATURE_ADMIN: process.env.NEXT_PUBLIC_FEATURE_ADMIN
  }
});
