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
const appName = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().min(1).default("Nextjs Starter Template")
);

export const env = createEnv({
  server: {
    DATABASE_URL: optionalUrl,
    NEXTAUTH_SECRET: optionalString,
    NEXTAUTH_URL: optionalUrl,
    GITHUB_CLIENT_ID: optionalString,
    GITHUB_CLIENT_SECRET: optionalString
  },
  client: {
    NEXT_PUBLIC_APP_NAME: appName,
    NEXT_PUBLIC_API_BASE_URL: optionalString,
    NEXT_PUBLIC_SITE_URL: optionalUrl
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
  }
});
