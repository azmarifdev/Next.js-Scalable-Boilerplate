import { siteConfig } from "@/lib/site-config";

export const APP_CONFIG = {
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale
} as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  users: "/users",
  projects: "/projects",
  tasks: "/tasks"
} as const;

export const API_ROUTES = {
  health: "/api/v1/health",
  auth: {
    login: "/api/v1/auth/login",
    register: "/api/v1/auth/register",
    logout: "/api/v1/auth/logout",
    me: "/api/v1/auth/me"
  }
} as const;
