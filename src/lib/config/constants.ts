export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Next.js-Boilerplate-PostgresQL-Drizzle";
export const API_VERSION = "v1";
export const API_PREFIX = `/api/${API_VERSION}`;

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_SESSION_TTL_SECONDS = 60 * 60 * 24;

export const DASHBOARD_ROUTES = [
  "/dashboard",
  "/users",
  "/projects",
  "/tasks",
  "/ecommerce",
  "/billing"
];
